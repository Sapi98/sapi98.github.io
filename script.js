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
      updateTimelineProgress();
    };
  }

  if (menu && nav) {
    menu.onclick = () => nav.classList.toggle("open");
  }

  const currentPage = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".site-nav a").forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });

  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach(element => {
    revealObserver.observe(element);
  });

  document.querySelectorAll(".expand-summary").forEach(button => {
    button.addEventListener("click", () => {
      const card = button.closest(".expand-card");
      const entry = button.closest(".timeline-entry");
      const opened = card.classList.toggle("open");
      const icon = button.querySelector(".accordion-icon");

      if (entry) {
        entry.classList.toggle("open", opened);
      }

      if (icon) {
        icon.textContent = opened ? "−" : "+";
      }

      updateTimelineProgress();
    });
  });

  updateTimelineProgress();
});

function updateTimelineProgress() {
  document.querySelectorAll(".timeline-modern").forEach(timeline => {
    const rect = timeline.getBoundingClientRect();
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;

    /*
      This controls the moving line length.
      Keep this synced with the CSS:
      .timeline-modern::after {
        top: 10px;
        max-height: calc(100% - 20px);
      }
    */
    const lineTopOffset = 10;
    const lineBottomOffset = 10;
    const lineMaxHeight = timeline.offsetHeight - lineTopOffset - lineBottomOffset;

    const start = viewportHeight * 0.70;
    const end = viewportHeight * 0.30;

    let progress = (start - rect.top) / (rect.height - (start - end));
    progress = Math.max(0, Math.min(1, progress));

    timeline.style.setProperty(
      "--timeline-progress",
      `${(progress * 100).toFixed(2)}%`
    );

    /*
      Convert the visual line progress into an actual Y-position
      inside the timeline container.
    */
    const lineEndY = lineTopOffset + progress * lineMaxHeight;

    let activeEntry = null;

    timeline.querySelectorAll(".timeline-entry").forEach(entry => {
      const node = entry.querySelector(".timeline-node");

      if (!node) return;

      const nodeRect = node.getBoundingClientRect();

      /*
        Bullet center relative to the top of the timeline container.
      */
      const nodeCenterY =
        nodeRect.top - rect.top + nodeRect.height / 2;

      /*
        The active bullet is the latest bullet that the progress line
        has reached or passed.
      */
      if (lineEndY >= nodeCenterY) {
        activeEntry = entry;
      }
    });

    timeline.querySelectorAll(".timeline-entry").forEach(entry => {
      entry.classList.toggle("is-active", entry === activeEntry);
    });
  });
}

window.addEventListener("scroll", updateTimelineProgress, { passive: true });
window.addEventListener("resize", updateTimelineProgress);
