const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const https = require("https");

dotenv.config();

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", true);

const PORT = Number(process.env.PORT || 3000);
const isProd = process.env.NODE_ENV === "production";
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 10 * 60 * 1000);
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX || 5);
const MAX_MESSAGE_LENGTH = Number(process.env.MAX_MESSAGE_LENGTH || 4000);
const MAX_NAME_LENGTH = Number(process.env.MAX_NAME_LENGTH || 200);

const emailjsServiceId = process.env.EMAILJS_SERVICE_ID;
const emailjsTemplateId = process.env.EMAILJS_TEMPLATE_ID;
const emailjsPublicKey = process.env.EMAILJS_PUBLIC_KEY || process.env.EMAILJS_USER_ID;
const emailjsAccessToken = process.env.EMAILJS_ACCESS_TOKEN;
const emailjsConfigured = Boolean(emailjsServiceId && emailjsTemplateId && emailjsPublicKey);

const siteRoot = path.join(__dirname, "..");
const corsEnv =
  process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || "";
const corsOrigins = corsEnv
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const devCorsOrigins = ["http://127.0.0.1:5500", "http://localhost:5500"];
const allowedOrigins = corsOrigins.length ? corsOrigins : (isProd ? [] : devCorsOrigins);

app.use((req, res, next) => {
  if (!req.path.startsWith("/api/")) return next();
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  }
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  return next();
});

app.use(express.static(siteRoot));
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: false, limit: "20kb" }));

const rateLimitStore = new Map();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sendWithEmailJs = ({ name, sector, email, phone, packageChoice, message, ip }) => {
  const payload = JSON.stringify({
    service_id: emailjsServiceId,
    template_id: emailjsTemplateId,
    user_id: emailjsPublicKey,
    template_params: {
      name,
      sector,
      email,
      phone,
      package: packageChoice,
      message,
      ip,
    },
    ...(emailjsAccessToken ? { accessToken: emailjsAccessToken } : {}),
  });

  const headers = {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(payload),
  };

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: "api.emailjs.com",
        path: "/api/v1.0/email/send",
        method: "POST",
        headers,
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            return resolve();
          }
          return reject(new Error(`EMAILJS_${res.statusCode || "UNKNOWN"}: ${body}`));
        });
      }
    );
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
};

const getMissingEmailJs = () => {
  const missing = [];
  if (!emailjsServiceId) missing.push("EMAILJS_SERVICE_ID");
  if (!emailjsTemplateId) missing.push("EMAILJS_TEMPLATE_ID");
  if (!emailjsPublicKey) missing.push("EMAILJS_PUBLIC_KEY");
  return missing;
};

const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length) {
    return forwarded.split(",")[0].trim();
  }
  return req.ip || req.connection?.remoteAddress || "unknown";
};

const isRateLimited = (ip) => {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
};

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitStore.entries()) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(ip);
    }
  }
}, RATE_LIMIT_WINDOW_MS).unref();

app.post("/contact", async (req, res) => {
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return res.status(429).json({ ok: false, error: "RATE_LIMIT" });
  }

  const name = String(req.body?.name || "").trim();
  const sector = String(req.body?.sector || "").trim();
  const email = String(req.body?.email || "").trim();
  const phone = String(req.body?.phone || "").trim();
  const packageChoice = String(req.body?.package || "").trim();
  const message = String(req.body?.message || "").trim();
  const company = String(req.body?.company || "").trim();

  if (company) {
    return res.status(200).json({ ok: true });
  }

  if (
    !name ||
    !sector ||
    !email ||
    !phone ||
    !packageChoice ||
    !message ||
    !emailPattern.test(email)
  ) {
    return res.status(400).json({ ok: false, error: "VALIDATION" });
  }

  if (
    name.length > MAX_NAME_LENGTH ||
    sector.length > MAX_NAME_LENGTH ||
    phone.length > MAX_NAME_LENGTH ||
    packageChoice.length > MAX_NAME_LENGTH ||
    message.length > MAX_MESSAGE_LENGTH
  ) {
    return res.status(400).json({ ok: false, error: "VALIDATION" });
  }

  if (!emailjsConfigured) {
    return res.status(500).json({ ok: false, error: "CONFIG", missing: getMissingEmailJs() });
  }

  try {
    await sendWithEmailJs({ name, sector, email, phone, packageChoice, message, ip });
    return res.json({ ok: true });
  } catch (error) {
    const details = !isProd ? String(error?.message || error) : undefined;
    console.error("CONTACT_SEND_FAILED", details || error);
    return res.status(500).json({
      ok: false,
      error: "SEND_FAILED",
      ...(details ? { details } : {}),
    });
  }
});

app.listen(PORT, () => {
  console.log(`Contact API listening on port ${PORT}`);
});
