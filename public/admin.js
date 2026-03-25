const DEFAULT_IMAGE = "assets/logo.png";
const PROJECTS_API_URL = "/api/projects";
const UPLOAD_API_URL = "/api/upload";
const SEARCH_DEBOUNCE_MS = 250;

const form = document.getElementById("project-form");
const projectsList = document.getElementById("projects-list");
const formStatus = document.getElementById("form-status");
const formTitle = document.getElementById("form-title");
const formSubtitle = document.getElementById("form-subtitle");
const submitButton = document.getElementById("submit-button");
const searchInput = document.getElementById("admin-search");

const fields = {
  name: document.getElementById("name"),
  description: document.getElementById("description"),
  image: document.getElementById("image"),
  url: document.getElementById("url"),
  status: document.getElementById("status"),
};

let currentEditId = null;
let currentImagePath = "";
let allProjects = [];
let currentSearchTerm = "";
let searchDebounceTimer = null;

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getStatusLabel(status) {
  return status === "online" ? "En ligne" : "En cours";
}

function normalizeProject(project) {
  return {
    id: project.id ?? project.project_id ?? project.ID ?? null,
    name: (project.name ?? "").trim(),
    description: (project.description ?? "").trim(),
    image: (project.image ?? project.image_url ?? DEFAULT_IMAGE).trim() || DEFAULT_IMAGE,
    url: (project.url ?? "").trim(),
    status: project.status === "online" ? "online" : "progress",
  };
}

function getProjectById(id) {
  return allProjects.find((project) => String(project.id) === String(id)) || null;
}

function buildProjectPayload(imagePath) {
  return {
    name: fields.name.value.trim(),
    description: fields.description.value.trim(),
    image: imagePath,
    url: fields.url.value.trim(),
    status: fields.status.value,
  };
}

function buildProjectsUrl(searchTerm) {
  if (!searchTerm) {
    return PROJECTS_API_URL;
  }

  const params = new URLSearchParams({ search: searchTerm });
  return `${PROJECTS_API_URL}?${params.toString()}`;
}

function resetFormState() {
  currentEditId = null;
  currentImagePath = "";
  form.reset();
  fields.status.value = "online";
  formTitle.textContent = "Ajouter un projet";
  formSubtitle.textContent =
    "Selectionnez une image puis validez pour publier une nouvelle card.";
  submitButton.textContent = "Ajouter le projet";
  submitButton.disabled = false;
}

function setMessage(message, type = "info") {
  formStatus.textContent = message;

  if (type === "error") {
    formStatus.style.color = "#e5484d";
    return;
  }

  if (type === "success") {
    formStatus.style.color = "#1f7a3d";
    return;
  }

  formStatus.style.color = "";
}

function renderEmptyState(message = "Aucun projet trouvé.") {
  projectsList.innerHTML = `<p class="project-empty-state">${message}</p>`;
}

async function readResponse(response) {
  const rawText = await response.text();

  if (!rawText) {
    return {};
  }

  try {
    return JSON.parse(rawText);
  } catch {
    return { message: rawText };
  }
}

async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(UPLOAD_API_URL, {
    method: "POST",
    body: formData,
  });
  const payload = await readResponse(response);

  if (response.ok && payload.path) {
    return payload.path;
  }

  throw new Error(payload.error || payload.message || "Upload image impossible.");
}

async function loadProjects(searchTerm = currentSearchTerm, options = {}) {
  const { preserveMessage = false } = options;
  currentSearchTerm = searchTerm.trim();

  if (!preserveMessage) {
    setMessage("Chargement des projets...");
  }

  try {
    const response = await fetch(buildProjectsUrl(currentSearchTerm), {
      headers: {
        Accept: "application/json",
      },
    });
    const payload = await readResponse(response);

    if (!response.ok) {
      throw new Error(payload.error || payload.message || "Impossible de charger les projets.");
    }

    const projects = Array.isArray(payload)
      ? payload
      : Array.isArray(payload.projects)
        ? payload.projects
        : [];

    allProjects = projects.map(normalizeProject);
    renderProjects(allProjects);

    if (!preserveMessage) {
      setMessage("");
    }
  } catch (error) {
    console.error("Erreur lors du chargement des projets:", error);
    renderEmptyState("Erreur lors du chargement des projets.");
    setMessage(error.message || "Erreur lors du chargement des projets.", "error");
  }
}

function renderProjects(projects = []) {
  if (!projects.length) {
    renderEmptyState("Aucun projet trouvé.");
    return;
  }

  projectsList.innerHTML = projects
    .map((project) => {
      const projectId = escapeHtml(project.id);
      const name = escapeHtml(project.name);
      const description = escapeHtml(project.description);
      const image = escapeHtml(project.image || DEFAULT_IMAGE);
      const url = escapeHtml(project.url);
      const status = project.status === "online" ? "online" : "progress";
      const statusLabel = getStatusLabel(status);
      const cardTag = project.url ? "a" : "div";
      const cardAttributes = project.url
        ? `class="project-card" href="${url}" target="_blank" rel="noopener noreferrer"`
        : 'class="project-card"';

      return `
        <article class="admin-project-item">
          <${cardTag} ${cardAttributes}>
            <div class="project-header">
              <img src="${image}" alt="${name}" loading="lazy">
              <h2>${name}</h2>
            </div>
            <p>${description}</p>
            <span class="status-badge ${status}">${statusLabel}</span>
          </${cardTag}>

          <div class="admin-card-actions">
            <button type="button" data-action="edit" data-id="${projectId}">
              Modifier
            </button>
            <button type="button" data-action="delete" data-id="${projectId}">
              Supprimer
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

async function deleteProject(id) {
  const project = getProjectById(id);
  const projectName = project ? ` "${project.name}"` : "";
  const confirmed = window.confirm(`Supprimer${projectName} ?`);

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(`${PROJECTS_API_URL}?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    const payload = await readResponse(response);

    if (!response.ok) {
      throw new Error(payload.error || payload.message || "Erreur lors de la suppression.");
    }

    if (String(currentEditId) === String(id)) {
      resetFormState();
    }

    await loadProjects(currentSearchTerm, { preserveMessage: true });
    setMessage(payload.message || "Projet supprime avec succes.", "success");
  } catch (error) {
    console.error("Erreur lors de la suppression du projet:", error);
    setMessage(error.message || "Erreur lors de la suppression.", "error");
  }
}

function editProject(id) {
  const project = getProjectById(id);

  if (!project) {
    setMessage("Projet introuvable.", "error");
    return;
  }

  currentEditId = project.id;
  currentImagePath = project.image || "";

  fields.name.value = project.name;
  fields.description.value = project.description;
  fields.image.value = "";
  fields.url.value = project.url;
  fields.status.value = project.status;

  formTitle.textContent = "Modifier le projet";
  formSubtitle.textContent = currentImagePath
    ? `Choisissez une nouvelle image uniquement si vous voulez remplacer l'actuelle (${currentImagePath}).`
    : "Choisissez une image pour ce projet avant de valider.";
  submitButton.textContent = "Mettre a jour le projet";

  setMessage(`Edition du projet ${project.name}.`);
  window.scrollTo({ top: 0, behavior: "smooth" });
  fields.name.focus();
}

async function handleSubmit(event) {
  event.preventDefault();

  const isEditing = currentEditId !== null;
  const selectedFile = fields.image.files && fields.image.files.length ? fields.image.files[0] : null;
  const idleLabel = isEditing ? "Mettre a jour le projet" : "Ajouter le projet";

  submitButton.disabled = true;
  submitButton.textContent = isEditing ? "Mise a jour..." : "Ajout...";

  try {
    let imagePath = currentImagePath;

    if (selectedFile) {
      setMessage("Upload de l'image en cours...");
      imagePath = await uploadImage(selectedFile);
    } else if (!isEditing) {
      throw new Error("Selectionnez une image a televerser.");
    } else if (!imagePath) {
      throw new Error("Aucune image actuelle disponible. Selectionnez une nouvelle image.");
    }

    const body = buildProjectPayload(imagePath);

    if (!body.name || !body.description || !body.status) {
      throw new Error("Merci de remplir tous les champs obligatoires.");
    }

    const endpoint = isEditing
      ? `${PROJECTS_API_URL}?id=${encodeURIComponent(currentEditId)}`
      : PROJECTS_API_URL;
    const method = isEditing ? "PUT" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const payload = await readResponse(response);

    if (!response.ok) {
      throw new Error(
        payload.error ||
          payload.message ||
          (isEditing
            ? "Erreur lors de la mise a jour du projet."
            : "Erreur lors de l'ajout du projet.")
      );
    }

    resetFormState();
    await loadProjects(currentSearchTerm, { preserveMessage: true });

    setMessage(
      payload.message ||
        (isEditing ? "Projet mis a jour avec succes." : "Projet ajoute avec succes."),
      "success"
    );
  } catch (error) {
    console.error("Erreur lors de l'envoi du formulaire:", error);
    submitButton.disabled = false;
    submitButton.textContent = idleLabel;
    setMessage(error.message || "Erreur serveur.", "error");
  }
}

projectsList.addEventListener("click", (event) => {
  const actionButton = event.target.closest("button[data-action]");

  if (!actionButton) {
    return;
  }

  const { action, id } = actionButton.dataset;

  if (action === "edit") {
    editProject(id);
    return;
  }

  if (action === "delete") {
    deleteProject(id);
  }
});

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const nextSearch = searchInput.value;

    window.clearTimeout(searchDebounceTimer);
    searchDebounceTimer = window.setTimeout(() => {
      loadProjects(nextSearch);
    }, SEARCH_DEBOUNCE_MS);
  });
}

form.addEventListener("submit", handleSubmit);

resetFormState();
loadProjects();
