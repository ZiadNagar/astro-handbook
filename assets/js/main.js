function switchTab(btn, tabId) {
  const tabNav = btn.closest(".tab-nav");
  if (!tabNav) return;

  const tabContainer = tabNav.closest(".tabs");
  if (!tabContainer) return;

  const buttons = tabNav.querySelectorAll(".tab-btn");
  const panels = tabContainer.querySelectorAll(".tab-content");
  const targetPanel = tabContainer.querySelector(`#tab-${tabId}`);
  if (!targetPanel) return;

  buttons.forEach((button) => {
    const isActive = button === btn;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  });

  panels.forEach((panel) => {
    const isActive = panel === targetPanel;
    panel.classList.toggle("active", isActive);
    panel.hidden = !isActive;
  });
}

document.addEventListener("click", (event) => {
  const tabBtn = event.target.closest(".tab-btn[data-tab]");
  if (!tabBtn) return;
  switchTab(tabBtn, tabBtn.dataset.tab);
});

document.addEventListener("keydown", (event) => {
  const tabBtn = event.target.closest(".tab-btn[data-tab]");
  if (!tabBtn) return;

  const tabNav = tabBtn.closest(".tab-nav");
  if (!tabNav) return;

  const buttons = Array.from(tabNav.querySelectorAll(".tab-btn[data-tab]"));
  const currentIndex = buttons.indexOf(tabBtn);
  if (currentIndex < 0) return;

  let nextIndex = currentIndex;
  if (event.key === "ArrowRight")
    nextIndex = (currentIndex + 1) % buttons.length;
  if (event.key === "ArrowLeft")
    nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
  if (event.key === "Home") nextIndex = 0;
  if (event.key === "End") nextIndex = buttons.length - 1;

  if (nextIndex !== currentIndex) {
    event.preventDefault();
    const nextBtn = buttons[nextIndex];
    nextBtn.focus();
    switchTab(nextBtn, nextBtn.dataset.tab);
  }
});

const sidebar = document.getElementById("sidebar");
const navToggle = document.getElementById("nav-toggle");
const navBackdrop = document.getElementById("nav-backdrop");
const navLinks = document.querySelectorAll("#nav a");

function setSidebarOpen(isOpen) {
  if (!sidebar) return;

  sidebar.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("nav-open", isOpen);

  if (navToggle) {
    navToggle.setAttribute("aria-expanded", String(isOpen));
  }

  if (navBackdrop) {
    navBackdrop.classList.toggle("show", isOpen);
    navBackdrop.hidden = !isOpen;
    navBackdrop.setAttribute("aria-hidden", String(!isOpen));
  }
}

if (navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = sidebar ? sidebar.classList.contains("is-open") : false;
    setSidebarOpen(!isOpen);
  });
}

if (navBackdrop) {
  navBackdrop.addEventListener("click", () => {
    setSidebarOpen(false);
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setSidebarOpen(false);
  }
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.matchMedia("(max-width: 767.98px)").matches) {
      setSidebarOpen(false);
    }
  });
});

const sections = document.querySelectorAll("section[id]");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => link.classList.remove("active"));
      const active = document.querySelector(
        `#nav a[href="#${entry.target.id}"]`,
      );
      if (active) active.classList.add("active");
    });
  },
  { rootMargin: "-30% 0px -60% 0px" },
);

sections.forEach((section) => observer.observe(section));

async function initializeMermaid() {
  const diagramNodes = document.querySelectorAll(".mermaid");
  if (!diagramNodes.length) return;

  try {
    const { default: mermaid } =
      await import("https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs");

    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      theme: "base",
      flowchart: {
        htmlLabels: true,
        curve: "basis",
      },
      themeVariables: {
        background: "#0f1117",
        primaryColor: "#20222b",
        primaryBorderColor: "#2a2d3a",
        primaryTextColor: "#f0f0f2",
        lineColor: "#6b7280",
      },
    });

    await mermaid.run({ querySelector: ".mermaid" });
  } catch (error) {
    console.error("Mermaid initialization failed:", error);
  }
}

initializeMermaid();
