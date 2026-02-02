// Navigation mobile + animations d'apparition
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
  if (window.innerWidth > 768) {
    closeNav();
  }
});

// Animation fade-up
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");

// Theme toggle
const themeToggle = document.querySelector("[data-theme-toggle]");
const root = document.documentElement;
const storedTheme = localStorage.getItem("theme");
const prefersLight = window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: light)").matches;
const initialTheme = storedTheme || (prefersLight ? "light" : "dark");

if (initialTheme === "light") {
  root.setAttribute("data-theme", "light");
}

// Language toggle + translations
const langToggle = document.querySelector("[data-lang-toggle]");
const storedLang = localStorage.getItem("lang");
const browserLang = (navigator.language || "").toLowerCase().startsWith("fr") ? "fr" : "en";
let currentLang = storedLang || browserLang;

const translations = {
  fr: {
    "page.title": "Antoine développement | Sites web",
    "nav.aria": "Navigation principale",
    "nav.toggle": "Ouvrir le menu",
    "nav.about": "Qui-suis je ?",
    "nav.services": "Services",
    "nav.projects": "Réalisations",
    "nav.process": "Processus",
    "nav.contact": "Contact",
    "hero.title": "Sites web pour indépendants <br /> et commerces de proximité",
    "hero.badge.clear": "Clairs",
    "hero.badge.functional": "Fonctionnels",
    "hero.badge.responsive": "Responsives",
    "about.lead":
      "Je m'appelle Antoine, développeur web.<br />J'aide les indépendants et commerces de proximité<br />à avoir un site clair, professionnel et facile à contacter.",
    "about.secondary":
      "Pas de jargon technique, pas de site inutile.<br />Juste l'essentiel pour présenter votre activité<br />et recevoir des appels ou des demandes de devis.",
    "services.title": "Services et tarifs",
    "pricing.standard.title": "299€ - One shot",
    "pricing.standard.desc": "Idéal pour lancer votre présence en ligne.",
    "pricing.standard.li1": "1 page sur-mesure (landing page)",
    "pricing.standard.li2": "Design clair et branding cohérent",
    "pricing.standard.li3": "Responsive mobile/tablette",
    "pricing.standard.li4": "Formulaire de contact",
    "pricing.standard.li5": "Mise en ligne incluse",
    "pricing.standard.li6": "Support 7 jours",
    "pricing.pro.title": "790€ - Pro",
    "pricing.pro.desc": "Le choix le plus équilibré pour convertir.",
    "pricing.pro.li1": "3 à 5 pages stratégiques",
    "pricing.pro.li2": "Design premium + animations légères",
    "pricing.pro.li3": "Responsive + optimisation vitesse",
    "pricing.pro.li4": "Formulaire & appels à l'action avancés",
    "pricing.pro.li5": "SEO local basique",
    "pricing.pro.li6": "Mise en ligne incluse",
    "pricing.premium.title": "990€ - Premium",
    "pricing.premium.desc": "Pour une image forte et des contenus riches.",
    "pricing.premium.li1": "5 à 8 pages complètes",
    "pricing.premium.li2": "Identité visuelle plus poussée",
    "pricing.premium.li3": "Animations plus travaillées",
    "pricing.premium.li4": "SEO local avancé",
    "pricing.premium.li5": "Formulaire + tunnel de contact",
    "pricing.premium.li6": "Mise en ligne incluse",
    "pricing.premium.li7": "Base de données / contenu dynamique",
    "pricing.featured": "Recommandé",
    "pricing.note":
      "*Ces formules donnent un cadre, mais rien n'est figé : chaque projet peut être ajusté.",
    "projects.title": "Réalisations",
    "projects.subtitle": "Quelques projets récents pour des commerces locaux.",
    "projects.item1.label": "Site vitrine",
    "projects.item1.title": "Boucherie artisanale",
    "projects.item1.desc":
      "Univers chaleureux, parcours simplifié et appel à l'action clair.",
    "projects.item1.tag1": "UI/UX",
    "projects.item1.tag2": "Conversion",
    "projects.item1.tag3": "Mobile-first",
    "projects.item2.label": "Portfolio",
    "projects.item2.title": "Portfolio créatif",
    "projects.item2.desc":
      "Mise en avant des réalisations avec un design épuré et impactant.",
    "projects.item2.tag1": "Branding",
    "projects.item2.tag2": "UI polish",
    "projects.item2.tag3": "Animation",
    "projects.cta": "Voir le site →",
    "process.title": "Le parcours d'un projet",
    "process.desc":
      "Chaque projet suit un processus clair, de l'échange initial à la mise en ligne, afin de garantir un site simple, efficace et adapté à vos besoins.",
    "process.cta": "Démarrer un projet",
    "process.step1": "Premier contact",
    "process.step2": "Création de la maquette",
    "process.step3": "Développement du site",
    "process.step4": "Mise en production",
    "process.step5": "Hébergement et maintenance",
    "contact.title": "Me contacter",
    "contact.name": "Nom",
    "contact.sector": "Secteur d'activité",
    "contact.email": "Adresse mail",
    "contact.phone": "Téléphone",
    "contact.message": "Décrivez votre projet...",
    "contact.package": "Formule",
    "contact.option.oneShot": "One shot",
    "contact.option.pro": "Pro",
    "contact.option.premium": "Premium",
    "contact.submit": "Envoyer",
    "legal.title": "Mentions légales",
    "legal.subtitle": "Informations obligatoires concernant l’éditeur du site et l’hébergeur.",
    "legal.content": `
      <p>
        <strong>Éditeur du site</strong><br />
        Axis — [Nom & prénom / Raison sociale]<br />
        Statut : [auto-entrepreneur / société]<br />
        Adresse : [adresse complète]<br />
        SIRET : [SIRET]<br />
        Email : [email] • Téléphone : [téléphone]
      </p>
      <p>
        <strong>Directeur de la publication</strong><br />
        [Nom & prénom]
      </p>
      <p>
        <strong>Hébergement</strong><br />
        [Nom de l’hébergeur] — [adresse] — [téléphone]
      </p>
      <p>
        <strong>Propriété intellectuelle</strong><br />
        L’ensemble des contenus (textes, visuels, logos, maquettes) est protégé par le droit d’auteur. Toute
        reproduction, distribution ou utilisation sans autorisation est interdite.
      </p>
      <p>
        <strong>Responsabilité</strong><br />
        L’éditeur ne saurait être tenu responsable des dommages liés à l’usage du site ou à l’indisponibilité
        temporaire des services.
      </p>
    `,
    "privacy.title": "Politique de confidentialité",
    "privacy.subtitle": "Transparence sur les données collectées via le formulaire et leur utilisation.",
    "privacy.content": `
      <p>
        <strong>Données collectées</strong><br />
        Nom, email, téléphone, secteur d’activité et message transmis via le formulaire.
      </p>
      <p>
        <strong>Finalités</strong><br />
        Répondre à votre demande, établir un devis et assurer le suivi commercial.
      </p>
      <p>
        <strong>Base légale</strong><br />
        Votre consentement lors de l’envoi du formulaire.
      </p>
      <p>
        <strong>Durée de conservation</strong><br />
        3 ans à compter du dernier contact pour les prospects, sauf obligation légale contraire.
      </p>
      <p>
        <strong>Destinataires</strong><br />
        Données accessibles uniquement à l’éditeur. Le formulaire est envoyé via un prestataire d’emailing
        (EmailJS ou service équivalent).
      </p>
      <p>
        <strong>Vos droits</strong><br />
        Vous pouvez demander l’accès, la rectification ou la suppression de vos données en écrivant à [email].
      </p>
      <p>
        <strong>Cookies</strong><br />
        Aucun cookie publicitaire n’est déposé. Les cookies techniques indispensables au fonctionnement du site
        peuvent être utilisés.
      </p>
    `,
    "footer.tagline": "Sites web sur-mesure pour indépendants.",
    "footer.legal": "Mentions légales",
    "footer.privacy": "Politique de confidentialité",
    "footer.copy": "© 2026 Axis. Tous droits réservés.",
    "theme.light": "Mode clair",
    "theme.dark": "Mode sombre",
    "lang.switchToEn": "Passer en anglais",
    "lang.switchToFr": "Passer en français",
  },
  en: {
    "page.title": "Axis | Websites for independent professionals",
    "nav.aria": "Main navigation",
    "nav.toggle": "Open menu",
    "nav.about": "About",
    "nav.services": "Services",
    "nav.projects": "Projects",
    "nav.process": "Process",
    "nav.contact": "Contact",
    "hero.title": "Websites for independent professionals<br />and local businesses",
    "hero.badge.clear": "Clear",
    "hero.badge.functional": "Functional",
    "hero.badge.responsive": "Responsive",
    "about.lead":
      "My name is Antoine, web developer.<br />I help independent professionals and local businesses<br />get a clear, professional, and easy-to-contact website.",
    "about.secondary":
      "No technical jargon, no useless website.<br />Just the essentials to present your activity<br />and receive calls or quote requests.",
    "services.title": "Services & pricing",
    "pricing.standard.title": "299€ - Starter",
    "pricing.standard.desc": "Ideal to launch your online presence.",
    "pricing.standard.li1": "1 custom page (landing page)",
    "pricing.standard.li2": "Clear design and consistent branding",
    "pricing.standard.li3": "Responsive mobile/tablet",
    "pricing.standard.li4": "Contact form",
    "pricing.standard.li5": "Launch included",
    "pricing.standard.li6": "7-day support",
    "pricing.pro.title": "790€ - Pro",
    "pricing.pro.desc": "The most balanced choice to convert.",
    "pricing.pro.li1": "3 to 5 strategic pages",
    "pricing.pro.li2": "Premium design + light animations",
    "pricing.pro.li3": "Responsive + speed optimization",
    "pricing.pro.li4": "Form + advanced calls to action",
    "pricing.pro.li5": "Basic local SEO",
    "pricing.pro.li6": "Launch included",
    "pricing.premium.title": "990€ - Premium",
    "pricing.premium.desc": "For a strong image and rich content.",
    "pricing.premium.li1": "5 to 8 complete pages",
    "pricing.premium.li2": "Advanced visual identity",
    "pricing.premium.li3": "More refined animations",
    "pricing.premium.li4": "Advanced local SEO",
    "pricing.premium.li5": "Form + contact funnel",
    "pricing.premium.li6": "Launch included",
    "pricing.premium.li7": "Database / dynamic content",
    "pricing.featured": "Recommended",
    "pricing.note":
      "*These packages provide a framework, but nothing is fixed: each project can be adjusted.",
    "projects.title": "Projects",
    "projects.subtitle": "A few recent projects for local businesses.",
    "projects.item1.label": "Showcase site",
    "projects.item1.title": "Artisanal butcher shop",
    "projects.item1.desc":
      "Warm atmosphere, simplified flow, and clear calls to action.",
    "projects.item1.tag1": "UI/UX",
    "projects.item1.tag2": "Conversion",
    "projects.item1.tag3": "Mobile-first",
    "projects.item2.label": "Portfolio",
    "projects.item2.title": "Creative portfolio",
    "projects.item2.desc":
      "Highlights projects with a clean, impactful design.",
    "projects.item2.tag1": "Branding",
    "projects.item2.tag2": "UI polish",
    "projects.item2.tag3": "Animation",
    "projects.cta": "View site →",
    "process.title": "Project workflow",
    "process.desc":
      "Each project follows a clear process, from the first exchange to launch, to deliver a simple, effective site tailored to your needs.",
    "process.cta": "Start a project",
    "process.step1": "First contact",
    "process.step2": "Wireframe & mockup",
    "process.step3": "Website development",
    "process.step4": "Launch",
    "process.step5": "Hosting & maintenance",
    "contact.title": "Contact me",
    "contact.name": "Name",
    "contact.sector": "Industry",
    "contact.email": "Email address",
    "contact.phone": "Phone",
    "contact.message": "Describe your project...",
    "contact.package": "Package",
    "contact.option.oneShot": "Starter",
    "contact.option.pro": "Pro",
    "contact.option.premium": "Premium",
    "contact.submit": "Send",
    "legal.title": "Legal notice",
    "legal.subtitle": "Mandatory information about the site publisher and hosting provider.",
    "legal.content": `
      <p>
        <strong>Site publisher</strong><br />
        Axis — [Name / Company name]<br />
        Status: [sole trader / company]<br />
        Address: [full address]<br />
        Business ID: [SIRET or registration number]<br />
        Email: [email] • Phone: [phone]
      </p>
      <p>
        <strong>Publishing director</strong><br />
        [Name]
      </p>
      <p>
        <strong>Hosting</strong><br />
        [Hosting provider] — [address] — [phone]
      </p>
      <p>
        <strong>Intellectual property</strong><br />
        All content (texts, visuals, logos, mockups) is protected by copyright. Any reproduction, distribution,
        or use without permission is prohibited.
      </p>
      <p>
        <strong>Liability</strong><br />
        The publisher cannot be held responsible for damages related to the use of the site or temporary service
        unavailability.
      </p>
    `,
    "privacy.title": "Privacy policy",
    "privacy.subtitle": "Transparency about data collected through the form and how it is used.",
    "privacy.content": `
      <p>
        <strong>Data collected</strong><br />
        Name, email, phone, industry, and the message sent via the form.
      </p>
      <p>
        <strong>Purposes</strong><br />
        Respond to your request, provide a quote, and ensure commercial follow‑up.
      </p>
      <p>
        <strong>Legal basis</strong><br />
        Your consent when submitting the form.
      </p>
      <p>
        <strong>Retention period</strong><br />
        3 years from the last contact for prospects, unless legal obligations require otherwise.
      </p>
      <p>
        <strong>Recipients</strong><br />
        Data is accessible only to the publisher. The form is sent via an emailing provider (EmailJS or equivalent).
      </p>
      <p>
        <strong>Your rights</strong><br />
        You can request access, correction, or deletion of your data by emailing [email].
      </p>
      <p>
        <strong>Cookies</strong><br />
        No advertising cookies are used. Essential technical cookies may be used for site operation.
      </p>
    `,
    "footer.tagline": "Custom websites for independent professionals.",
    "footer.legal": "Legal notice",
    "footer.privacy": "Privacy policy",
    "footer.copy": "© 2026 Axis. All rights reserved.",
    "theme.light": "Light mode",
    "theme.dark": "Dark mode",
    "lang.switchToEn": "Switch to English",
    "lang.switchToFr": "Switch to French",
  },
};

const translate = (key) => (translations[currentLang] && translations[currentLang][key]) || "";

const updateThemeToggle = () => {
  if (!themeToggle) return;
  const isLight = root.getAttribute("data-theme") === "light";
  themeToggle.setAttribute("aria-pressed", String(isLight));
  const label = isLight ? translate("theme.dark") : translate("theme.light");
  themeToggle.textContent = label;
  themeToggle.setAttribute("aria-label", label);
};

const updateLangToggle = () => {
  if (!langToggle) return;
  langToggle.setAttribute("aria-pressed", String(currentLang === "en"));
  langToggle.textContent = currentLang === "fr" ? "EN" : "FR";
  const label = currentLang === "fr" ? translate("lang.switchToEn") : translate("lang.switchToFr");
  langToggle.setAttribute("aria-label", label);
};

const applyTranslations = (lang) => {
  currentLang = lang;
  localStorage.setItem("lang", currentLang);
  document.documentElement.lang = currentLang;
  const dict = translations[currentLang] || translations.fr;
  document.documentElement.setAttribute("lang", currentLang);
  if (dict["page.title"]) {
    document.title = dict["page.title"];
  }

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

  document.querySelectorAll(".custom-select").forEach((select) => {
    const trigger = select.querySelector(".custom-select__trigger");
    const hidden = select.querySelector("input[type='hidden']");
    const options = select.querySelectorAll("[role='option']");
    if (!trigger || !hidden) return;
    if (hidden.value) {
      const selected = Array.from(options).find((opt) => opt.dataset.value === hidden.value);
      if (selected) {
        trigger.textContent = selected.textContent || "";
        trigger.style.color = "var(--text-primary)";
      }
    } else {
      const key = trigger.dataset.i18n;
      if (dict[key]) {
        trigger.textContent = dict[key];
        trigger.style.color = "var(--text-secondary)";
      }
    }
  });

  if (dict["pricing.featured"]) {
    root.style.setProperty("--pricing-featured-label", `"${dict["pricing.featured"]}"`);
  }

  updateThemeToggle();
  updateLangToggle();
};
applyTranslations(currentLang);

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
    {
      threshold: 0.2,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  revealItems.forEach((item) => {
    const delay = Number(item.dataset.delay || 0);
    item.style.transitionDelay = `${delay}ms`;
    revealObserver.observe(item);
  });
}

// Custom select
const customSelects = document.querySelectorAll(".custom-select");

const closeAllSelects = (except) => {
  customSelects.forEach((select) => {
    if (select !== except) {
      select.classList.remove("is-open");
      const trigger = select.querySelector(".custom-select__trigger");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    }
  });
};

customSelects.forEach((select) => {
  const trigger = select.querySelector(".custom-select__trigger");
  const options = select.querySelector(".custom-select__options");
  const hidden = select.querySelector("input[type='hidden']");

  if (!trigger || !options || !hidden) return;

  trigger.addEventListener("click", () => {
    const isOpen = select.classList.toggle("is-open");
    trigger.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) closeAllSelects(select);
  });

  options.addEventListener("click", (event) => {
    const option = event.target.closest("[role='option']");
    if (!option) return;
    const value = option.dataset.value || "";
    hidden.value = value;
    trigger.textContent = option.textContent || "";
    trigger.style.color = "var(--text-primary)";
    options.querySelectorAll("[role='option']").forEach((item) => {
      item.setAttribute("aria-selected", item === option ? "true" : "false");
    });
    select.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".custom-select")) {
    closeAllSelects();
  }
});

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isLight = root.getAttribute("data-theme") === "light";
    if (isLight) {
      root.removeAttribute("data-theme");
      localStorage.setItem("theme", "dark");
    } else {
      root.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
    updateThemeToggle();
  });
}

if (langToggle) {
  langToggle.addEventListener("click", () => {
    const nextLang = currentLang === "fr" ? "en" : "fr";
    applyTranslations(nextLang);
  });
}


// 3) script.js : envoi EmailJS + gestion custom-select + status

const SERVICE_ID = "service_1mpn38f";
const TEMPLATE_ID = "template_y80wwgb";

const form = document.getElementById("contact-form");

if (form) {
  // (optionnel) zone status
  let statusEl = document.getElementById("form-status");
  if (!statusEl) {
    statusEl = document.createElement("p");
    statusEl.id = "form-status";
    statusEl.style.marginTop = "12px";
    form.appendChild(statusEl);
  }

  function setStatus(msg, ok = true) {
    statusEl.textContent = msg;
    statusEl.style.color = ok ? "green" : "red";
  }

// --- Custom select -> remplit l'input hidden name="formule" ---
const select = document.querySelector(".custom-select");
if (select) {
  const trigger = select.querySelector(".custom-select__trigger");
  const options = select.querySelector(".custom-select__options");
  const hidden = select.querySelector('input[type="hidden"][name="formule"]');

  // toggle open
  trigger.addEventListener("click", () => {
    const expanded = trigger.getAttribute("aria-expanded") === "true";
    trigger.setAttribute("aria-expanded", String(!expanded));
    options.style.display = expanded ? "none" : "block";
  });

  // select option
  options.querySelectorAll('[role="option"]').forEach((opt) => {
    opt.addEventListener("click", () => {
      const value = opt.getAttribute("data-value") || opt.textContent.trim();
      hidden.value = value;
      trigger.textContent = opt.textContent.trim();
      trigger.setAttribute("aria-expanded", "false");
      options.style.display = "none";
    });
  });

  // close on outside click
  document.addEventListener("click", (e) => {
    if (!select.contains(e.target)) {
      trigger.setAttribute("aria-expanded", "false");
      options.style.display = "none";
    }
  });
}

  // --- Envoi EmailJS ---
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Sécurité: s'assurer que la formule est bien choisie
    const formule = form.querySelector('input[name="formule"]');
    if (formule && !formule.value) {
      setStatus("Veuillez sélectionner une formule.", false);
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const oldText = submitBtn.textContent;

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = "Envoi...";

      if (!window.emailjs) {
        throw new Error("EmailJS indisponible");
      }

      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form);

      setStatus("Message envoyé avec succès.", true);
      form.reset();

      // reset custom select text si besoin
      const trigger = document.querySelector(".custom-select__trigger");
      if (trigger) trigger.textContent = "Formule";
    } catch (err) {
      setStatus("Erreur lors de l'envoi. Réessayez.", false);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = oldText;
    }
  });
}
