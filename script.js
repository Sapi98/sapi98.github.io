document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const theme = document.getElementById("themeToggle");
  const menu = document.getElementById("menuToggle");
  const nav = document.getElementById("siteNav");

  body.dataset.theme = localStorage.getItem("theme") || "light";

  if (theme) {
    theme.onclick = () => {
      body.dataset.theme = body.dataset.theme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", body.dataset.theme);
    };
  }

  if (menu && nav) {
    menu.onclick = () => nav.classList.toggle("open");
  }

  const cur = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".site-nav a").forEach(a => {
    if (a.getAttribute("href") === cur) a.classList.add("active");
  });

  const obs = new IntersectionObserver(
    entries =>
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      }),
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach(el => obs.observe(el));

  document.querySelectorAll(".expand-summary").forEach(btn => {
    btn.onclick = () => {
      const card = btn.closest(".expand-card");
      const open = card.classList.toggle("open");
      const icon = btn.querySelector(".accordion-icon");

      if (icon) icon.textContent = open ? "−" : "+";

      updateTimelineProgress();
    };
  });

  updateTimelineProgress();
});

function updateTimelineProgress() {
  document.querySelectorAll(".timeline-modern").forEach(timeline => {
    const rect = timeline.getBoundingClientRect();
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;

    const start = viewportHeight * 0.70;
    const end = viewportHeight * 0.30;

    let progress = (start - rect.top) / (rect.height - (start - end));
    progress = Math.max(0, Math.min(1, progress));

    timeline.style.setProperty(
      "--timeline-progress",
      `${(progress * 100).toFixed(2)}%`
    );

    let bestEntry = null;
    let bestDistance = Infinity;

    timeline.querySelectorAll(".timeline-entry").forEach(entry => {
      const entryRect = entry.getBoundingClientRect();
      const center = entryRect.top + entryRect.height / 2;
      const distance = Math.abs(center - viewportHeight * 0.45);

      if (distance < bestDistance) {
        bestDistance = distance;
        bestEntry = entry;
      }
    });

    timeline.querySelectorAll(".timeline-entry").forEach(entry => {
      entry.classList.toggle(
        "is-active",
        entry === bestEntry && bestDistance < viewportHeight * 0.45
      );
    });
  });
}

window.addEventListener("scroll", updateTimelineProgress, { passive: true });
window.addEventListener("resize", updateTimelineProgress);