const DEFAULT_IMAGE = "assets/logo.png";
const PROJECTS_API_URL = "/api/projects";
const SEARCH_DEBOUNCE_MS = 250;

const portfolioGrid = document.getElementById("portfolio-grid");
const filterButtons = document.querySelectorAll(".portfolio-filters button");
const searchInput = document.getElementById("portfolio-search");

let allProjects = [];
let currentStatusFilter = "all";
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

function setActiveFilterButton(filter) {
  filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === filter);
  });
}

function renderEmptyState(message = "Aucun projet trouvé.") {
  portfolioGrid.innerHTML = `<p class="project-empty-state">${message}</p>`;
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

function buildProjectsUrl(searchTerm) {
  if (!searchTerm) {
    return PROJECTS_API_URL;
  }

  const params = new URLSearchParams({ search: searchTerm });
  return `${PROJECTS_API_URL}?${params.toString()}`;
}

function applyCurrentFilterAndRender() {
  const filteredProjects =
    currentStatusFilter === "all"
      ? allProjects
      : allProjects.filter((project) => project.status === currentStatusFilter);

  renderProjects(filteredProjects);
}

async function loadProjects(searchTerm = currentSearchTerm) {
  currentSearchTerm = searchTerm.trim();

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
    applyCurrentFilterAndRender();
  } catch (error) {
    console.error("Erreur lors du chargement des projets:", error);
    renderEmptyState("Erreur lors du chargement des projets.");
  }
}

function renderProjects(projects = []) {
  if (!projects.length) {
    renderEmptyState("Aucun projet trouvé.");
    return;
  }

  portfolioGrid.innerHTML = projects
    .map((project) => {
      const name = escapeHtml(project.name);
      const description = escapeHtml(project.description);
      const image = escapeHtml(project.image || DEFAULT_IMAGE);
      const url = escapeHtml(project.url);
      const status = project.status === "online" ? "online" : "progress";
      const cardTag = project.url ? "a" : "div";
      const cardAttributes = project.url
        ? `class="project-card" href="${url}" target="_blank" rel="noopener noreferrer"`
        : 'class="project-card"';

      return `
        <${cardTag} ${cardAttributes}>
          <div class="project-header">
            <img src="${image}" alt="${name}" loading="lazy">
            <h2>${name}</h2>
          </div>
          <p>${description}</p>
          <span class="status-badge ${status}">${getStatusLabel(status)}</span>
        </${cardTag}>
      `;
    })
    .join("");
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentStatusFilter = button.dataset.filter;
    setActiveFilterButton(currentStatusFilter);
    applyCurrentFilterAndRender();
  });
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

setActiveFilterButton(currentStatusFilter);
loadProjects();
