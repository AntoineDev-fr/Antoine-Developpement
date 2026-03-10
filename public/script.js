// ===========================
// NAVIGATION MOBILE
// ===========================
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.getElementById("primary-nav");

const closeNav = () => {
  if (!header || !navToggle) return;
  header.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
};

if (navToggle && header) {
  navToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

if (navMenu) {
  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });
}

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) closeNav();
});

// ===========================
// SCROLL — classe "scrolled" sur le header
// ===========================
if (header) {
  window.addEventListener(
    "scroll",
    () => {
      header.classList.toggle("scrolled", window.scrollY > 20);
    },
    { passive: true }
  );
}

// ===========================
// THÈME (light = défaut, dark = [data-theme="dark"])
// ===========================
const themeToggle = document.querySelector("[data-theme-toggle]");
const root = document.documentElement;
const storedTheme = localStorage.getItem("theme");
const initialTheme = storedTheme || "light";

if (initialTheme === "dark") {
  root.setAttribute("data-theme", "dark");
}

// ===========================
// TRADUCTIONS (FR uniquement)
// ===========================
const dict = {
    "page.title": "Antoine développement | Sites web",
    "nav.aria": "Navigation principale",
    "nav.toggle": "Ouvrir le menu",
    "nav.about": "À propos",
    "nav.services": "Services",
    "nav.projects": "Réalisations",
    "nav.process": "Processus",
    "nav.contact": "Contact",

    "hero.chip": "Développeur web indépendant",
    "hero.title": "Des sites web qui <em>convertissent</em><br>vos visiteurs en clients",
    "hero.desc":
      "J'aide les indépendants et commerces de proximité à avoir une présence en ligne claire, professionnelle et efficace — sans jargon technique.",
    "hero.cta.primary": "Démarrer un projet",
    "hero.cta.secondary": "Voir mes réalisations",
    "hero.stat.from": "À partir de",
    "hero.stat.projects": "Projets livrés",
    "hero.stat.custom": "Sur-mesure",

    "about.tag": "À propos",
    "about.title": "Je m'appelle Antoine,<br>développeur web",
    "about.lead":
      "J'aide les indépendants et commerces de proximité à avoir un site clair, professionnel et facile à contacter.",
    "about.secondary":
      "Pas de jargon technique, pas de site inutile. Juste l'essentiel pour présenter votre activité et recevoir des appels ou des demandes de devis.",
    "about.hl1": "Sites livrés rapidement, sans surprise",
    "about.hl2": "Adapté à tous les écrans (mobile, tablette, desktop)",
    "about.hl3": "Communication simple et transparente",

    "services.tag": "Tarifs",
    "services.title": "Services et formules",
    "services.subtitle":
      "Des formules claires pour chaque besoin. Rien n'est figé — chaque projet est ajustable.",

    "pricing.standard.name": "One shot",
    "pricing.standard.desc": "Idéal pour lancer votre présence en ligne rapidement.",
    "pricing.standard.li1": "1 page sur-mesure (landing page)",
    "pricing.standard.li2": "Design clair et branding cohérent",
    "pricing.standard.li3": "Responsive mobile/tablette",
    "pricing.standard.li4": "Formulaire de contact avec envoi d’email",
    "pricing.standard.li5": "Mise en ligne incluse",
    "pricing.standard.li6": "Support 7 jours",
    "pricing.pro.name": "Pro",
    "pricing.pro.desc": "Le choix équilibré pour convertir vos visiteurs.",
    "pricing.pro.li1": "3 à 5 pages stratégiques",
    "pricing.pro.li2": "Design premium + animations légères",
    "pricing.pro.li3": "Responsive + optimisation vitesse",
    "pricing.pro.li4": "Formulaire de contact avec envoi d’email",
    "pricing.pro.li5": "SEO local basique",
    "pricing.pro.li6": "Mise en ligne incluse",
    "pricing.premium.name": "Premium",
    "pricing.premium.desc": "Pour une image forte et des contenus riches.",
    "pricing.premium.li1": "5 à 8 pages complètes",
    "pricing.premium.li2": "Identité visuelle plus poussée",
    "pricing.premium.li3": "Animations plus travaillées",
    "pricing.premium.li4": "SEO local avancé",
    "pricing.premium.li5": "Formulaire de contact avec envoi d’email",
    "pricing.premium.li6": "Mise en ligne incluse",
    "pricing.premium.li7": "Base de données / contenu dynamique",
    "pricing.featured": "Recommandé",
    "pricing.cta": "Choisir cette formule",
    "pricing.note":
      "* Ces formules donnent un cadre, mais rien n'est figé : chaque projet peut être ajusté.",

    "projects.tag": "Réalisations",
    "projects.title": "Mes derniers projets",
    "projects.subtitle": "Quelques projets récents pour des commerces locaux.",
    "projects.item1.label": "Site vitrine",
    "projects.item1.title": "Boucherie artisanale",
    "projects.item1.desc": "Univers chaleureux, parcours simplifié et appel à l'action clair.",
    "projects.item1.tag1": "UI/UX",
    "projects.item1.tag2": "Conversion",
    "projects.item1.tag3": "Mobile-first",
    "projects.item2.label": "Portfolio",
    "projects.item2.title": "Portfolio créatif",
    "projects.item2.desc": "Mise en avant des réalisations avec un design épuré et impactant.",
    "projects.item2.tag1": "Branding",
    "projects.item2.tag2": "UI polish",
    "projects.item2.tag3": "Animation",
    "projects.cta": "Voir le site →",

    "process.tag": "Processus",
    "process.title": "Le parcours d'un projet",
    "process.subtitle":
      "De l'échange initial à la mise en ligne, un processus simple et transparent.",
    "process.step1": "Premier contact",
    "process.step1.desc": "On discute de votre projet et de vos besoins.",
    "process.step2": "Maquette",
    "process.step2.desc": "Je conçois le design et vous le soumets pour validation.",
    "process.step3": "Développement",
    "process.step3.desc": "Le site prend vie, intégration et ajustements inclus.",
    "process.step4": "Mise en ligne",
    "process.step4.desc": "Déploiement, nom de domaine et configuration inclus.",
    "process.step5": "Maintenance",
    "process.step5.desc": "Hébergement et suivi pour que tout reste opérationnel.",
    "process.cta": "Démarrer un projet",

    "contact.tag": "Contact",
    "contact.info.title": "Démarrons<br>votre projet",
    "contact.info.desc":
      "Remplissez le formulaire et je vous réponds dans les 24h pour discuter de votre projet.",
    "contact.name": "Votre nom",
    "contact.sector": "Votre secteur",
    "contact.email": "Adresse email",
    "contact.phone": "Téléphone",
    "contact.message": "Décrivez votre projet...",
    "contact.package": "Choisir une formule",
    "contact.option.oneShot": "One shot — 290€",
    "contact.option.pro": "Pro — 590€",
    "contact.option.premium": "Premium — 790€",
    "contact.submit": "Envoyer ma demande",
    "contact.sending": "Envoi en cours...",
    "contact.success": "Message envoyé avec succès.",
    "contact.error": "Erreur lors de l'envoi. Réessayez.",
    "contact.validation": "Merci de remplir tous les champs correctement.",

    "legal.title": "Mentions légales",
    "legal.subtitle": "Informations obligatoires concernant l'éditeur du site et l'hébergeur.",
    "legal.content": `
      <p>
        <strong>Éditeur du site</strong><br />
        Axis — [Nom & prénom / Raison sociale]<br />
        Statut : [auto-entrepreneur / société]<br />
        Adresse : [adresse complète]<br />
        SIRET : [SIRET]<br />
        Email : [email] • Téléphone : [téléphone]
      </p>
      <p><strong>Directeur de la publication</strong><br />[Nom & prénom]</p>
      <p><strong>Hébergement</strong><br />[Nom de l'hébergeur] — [adresse] — [téléphone]</p>
      <p>
        <strong>Propriété intellectuelle</strong><br />
        L'ensemble des contenus est protégé par le droit d'auteur.
        Toute reproduction sans autorisation est interdite.
      </p>
      <p>
        <strong>Responsabilité</strong><br />
        L'éditeur ne saurait être tenu responsable des dommages liés à l'usage du site.
      </p>
    `,
    "privacy.title": "Politique de confidentialité",
    "privacy.subtitle": "Transparence sur les données collectées via le formulaire et leur utilisation.",
    "privacy.content": `
      <p><strong>Données collectées</strong><br />Nom, email, téléphone, secteur, formule et message.</p>
      <p><strong>Finalités</strong><br />Répondre à votre demande et établir un devis.</p>
      <p><strong>Base légale</strong><br />Votre consentement lors de l'envoi du formulaire.</p>
      <p><strong>Durée de conservation</strong><br />3 ans à compter du dernier contact.</p>
      <p><strong>Destinataires</strong><br />Données accessibles uniquement à l'éditeur.</p>
      <p><strong>Vos droits</strong><br />Accès, rectification ou suppression en écrivant à [email].</p>
      <p><strong>Cookies</strong><br />Aucun cookie publicitaire. Cookies techniques indispensables uniquement.</p>
    `,

    "footer.tagline": "Sites web sur-mesure pour indépendants.",
    "footer.legal": "Mentions légales",
    "footer.privacy": "Politique de confidentialité",
    "footer.copy": "© 2026 Antoine développement. Tous droits réservés.",
    "theme.light": "Mode clair",
    "theme.dark": "Mode sombre",
};

const translate = (key) => dict[key] || "";

// ===========================
// APPLICATION DES TRADUCTIONS
// ===========================
if (dict["page.title"]) document.title = dict["page.title"];

document.querySelectorAll("[data-i18n]").forEach((el) => {
  const key = el.dataset.i18n;
  if (dict[key]) el.textContent = dict[key];
});

document.querySelectorAll("[data-i18n-html]").forEach((el) => {
  const key = el.dataset.i18nHtml;
  if (dict[key]) el.innerHTML = dict[key];
});

document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
  const key = el.dataset.i18nPlaceholder;
  if (dict[key]) el.setAttribute("placeholder", dict[key]);
});

document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
  const key = el.dataset.i18nAria;
  if (dict[key]) el.setAttribute("aria-label", dict[key]);
});

// ===========================
// TOGGLE THÈME
// ===========================
const syncThemeBtn = () => {
  if (!themeToggle) return;
  const isDark = root.getAttribute("data-theme") === "dark";
  themeToggle.textContent = isDark ? "☀️" : "🌙";
  themeToggle.setAttribute("aria-label", isDark ? translate("theme.light") : translate("theme.dark"));
  themeToggle.setAttribute("aria-pressed", String(isDark));
};

syncThemeBtn();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    if (isDark) {
      root.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    } else {
      root.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
    syncThemeBtn();
  });
}

// ===========================
// ANIMATIONS REVEAL
// ===========================
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");

if (prefersReduced) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else if (revealItems.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );

  revealItems.forEach((item) => {
    const delay = Number(item.dataset.delay || 0);
    item.style.transitionDelay = `${delay}ms`;
    revealObserver.observe(item);
  });
}

// ===========================
// FORMULAIRE DE CONTACT
// ===========================
const form = document.getElementById("contact-form");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getStatusMessages = () => ({
  sending: translate("contact.sending") || "Envoi...",
  success: translate("contact.success") || "Message envoyé avec succès.",
  error: translate("contact.error") || "Erreur lors de l'envoi. Réessayez.",
  validation:
    translate("contact.validation") || "Merci de remplir tous les champs correctement.",
});

const ensureStatusEl = (targetForm) => {
  let statusEl = document.getElementById("form-status");
  if (!statusEl) {
    statusEl = document.createElement("p");
    statusEl.id = "form-status";
    statusEl.setAttribute("aria-live", "polite");
    targetForm.appendChild(statusEl);
  }
  return statusEl;
};

const setStatus = (statusEl, msg, ok = true) => {
  statusEl.textContent = msg;
  statusEl.style.color = ok ? "var(--accent)" : "#EF4444";
};

const apiBase = (() => {
  if (window.location.port === "5500") {
    return `http://${window.location.hostname}:3000`;
  }
  return "";
})();

if (form) {
  const statusEl = ensureStatusEl(form);
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const sector = String(formData.get("sector") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const packageValue = String(formData.get("package") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const company = String(formData.get("company") || "").trim();
    const statusMessages = getStatusMessages();
    const packageSelect = form.querySelector('select[name="package"]');
    const packageLabel =
      packageSelect && packageSelect.selectedIndex >= 0
        ? packageSelect.options[packageSelect.selectedIndex].textContent.trim()
        : packageValue;

    if (
      !name ||
      !sector ||
      !email ||
      !phone ||
      !packageValue ||
      !message ||
      !emailPattern.test(email)
    ) {
      setStatus(statusEl, statusMessages.validation, false);
      return;
    }

    if (company) {
      setStatus(statusEl, statusMessages.success, true);
      form.reset();
      return;
    }

    const payload = { name, sector, email, phone, package: packageLabel || packageValue, message };
    const previousLabel = submitBtn ? submitBtn.textContent : "";

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = statusMessages.sending;
      }
      setStatus(statusEl, statusMessages.sending, true);

      const response = await fetch(`${apiBase}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.ok !== true) throw new Error(data.error || "REQUEST_FAILED");

      setStatus(statusEl, statusMessages.success, true);
      form.reset();
    } catch {
      setStatus(statusEl, statusMessages.error, false);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = previousLabel || translate("contact.submit") || "Envoyer";
      }
    }
  });
}
