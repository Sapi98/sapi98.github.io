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

// function updateTimelineProgress() {
//   document.querySelectorAll(".timeline-modern").forEach(timeline => {
//     const rect = timeline.getBoundingClientRect();
//     const viewportHeight =
//       window.innerHeight || document.documentElement.clientHeight;

//     /*
//       The progress line now follows a fixed visual point on the screen.
//       This makes the timeline movement feel synced with scrolling instead
//       of advancing too quickly.
//     */
//     const screenMarkerY = viewportHeight * 0.50;

//     const lineTopOffset = 10;
//     const lineBottomOffset = 10;
//     const lineMaxHeight =
//       timeline.offsetHeight - lineTopOffset - lineBottomOffset;

//     /*
//       Convert the screen marker into a position inside the timeline.
//       If the marker is above the timeline, progress is 0.
//       If the marker is below the timeline, progress is 100%.
//     */
//     let lineEndY = screenMarkerY - rect.top - lineTopOffset;
//     lineEndY = Math.max(0, Math.min(lineMaxHeight, lineEndY));

//     const progress = lineMaxHeight > 0 ? lineEndY / lineMaxHeight : 0;

//     timeline.style.setProperty(
//       "--timeline-progress",
//       `${(progress * 100).toFixed(2)}%`
//     );

//     /*
//       Highlight the most recent bullet that the progress line has reached.
//       Scrolling down: bullet activates when the line passes it.
//       Scrolling up: bullet deactivates when the line rolls back above it.
//     */
//     let activeEntry = null;

//     timeline.querySelectorAll(".timeline-entry").forEach(entry => {
//       const node = entry.querySelector(".timeline-node");

//       if (!node) return;

//       const nodeRect = node.getBoundingClientRect();
//       const nodeCenterY =
//         nodeRect.top - rect.top + nodeRect.height / 2 - lineTopOffset;

//       if (lineEndY >= nodeCenterY) {
//         activeEntry = entry;
//       }
//     });

//     timeline.querySelectorAll(".timeline-entry").forEach(entry => {
//       entry.classList.toggle("is-active", entry === activeEntry);
//     });
//   });
// }

function updateTimelineProgress() {
  const scrollY =
    window.scrollY || document.documentElement.scrollTop;

  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;

  const documentHeight =
    document.documentElement.scrollHeight;

  const maxScroll = Math.max(0, documentHeight - viewportHeight);

  document.querySelectorAll(".timeline-modern").forEach(timeline => {
    const rect = timeline.getBoundingClientRect();

    const lineTopOffset = 10;
    const lineBottomOffset = 10;

    const lineMaxHeight = Math.max(
      0,
      timeline.offsetHeight - lineTopOffset - lineBottomOffset
    );

    /*
      Convert the timeline's current viewport position into its
      absolute document position.
    */
    const timelineTop =
      rect.top + scrollY + lineTopOffset;

    const timelineBottom =
      timelineTop + lineMaxHeight;

    /*
      Normally, animation begins when the top of the timeline reaches
      the middle of the viewport and ends when its bottom reaches the
      middle of the viewport.
    */
    const screenMarkerOffset = viewportHeight * 0.5;

    let startScroll = timelineTop - screenMarkerOffset;
    let endScroll = timelineBottom - screenMarkerOffset;

    /*
      On large screens, the page may end before the timeline bottom
      reaches the viewport midpoint. Limit endScroll to the maximum
      available scroll position so the line can still reach 100%.
    */
    startScroll = Math.max(0, Math.min(startScroll, maxScroll));
    endScroll = Math.max(startScroll, Math.min(endScroll, maxScroll));

    let progress;

    if (endScroll <= startScroll) {
      /*
        This handles pages whose content is shorter than or nearly
        equal to the viewport height.
      */
      progress = scrollY >= endScroll ? 1 : 0;
    } else {
      progress =
        (scrollY - startScroll) / (endScroll - startScroll);
    }

    progress = Math.max(0, Math.min(1, progress));

    const lineEndY = progress * lineMaxHeight;

    timeline.style.setProperty(
      "--timeline-progress",
      `${(progress * 100).toFixed(2)}%`
    );

    /*
      Highlight the latest timeline node reached by the progress line.
    */
    let activeEntry = null;

    timeline.querySelectorAll(".timeline-entry").forEach(entry => {
      const node = entry.querySelector(".timeline-node");

      if (!node) return;

      const nodeRect = node.getBoundingClientRect();

      const nodeCenterY =
        nodeRect.top -
        rect.top +
        nodeRect.height / 2 -
        lineTopOffset;

      if (lineEndY >= nodeCenterY) {
        activeEntry = entry;
      }
    });

    timeline.querySelectorAll(".timeline-entry").forEach(entry => {
      entry.classList.toggle(
        "is-active",
        entry === activeEntry
      );
    });
  });
}

window.addEventListener("scroll", updateTimelineProgress, { passive: true });
window.addEventListener("resize", updateTimelineProgress);


document.addEventListener("DOMContentLoaded", () => {
  const line1 = document.getElementById("typingLine1");
  const line2 = document.getElementById("typingLine2");

  if (!line1 || !line2) return;

  const text1 = "Welcome!";
  const text2 = "About Saptarshi";

  let i = 0;

  line1.classList.add("typing-cursor");

  function typeFirstLine() {
    if (i < text1.length) {
      line1.textContent += text1.charAt(i);
      i++;
      setTimeout(typeFirstLine, 65);
    } else {
      line1.classList.remove("typing-cursor");

      line2.classList.add("typing-cursor");

      let j = 0;

      function typeSecondLine() {
        if (j < text2.length) {
          line2.textContent += text2.charAt(j);
          j++;
          setTimeout(typeSecondLine, 90);
        } else {
          
          const introContent =
            document.getElementById("introContent");

          if (introContent) {
            introContent.classList.add("visible");
          }
        }
      }

      setTimeout(typeSecondLine, 250);
    }
  }

  typeFirstLine();
});

function updateScrollProgressBar() {
  const progressBar = document.getElementById("scrollProgressBar");

  if (!progressBar) return;

  const scrollTop =
    window.scrollY || document.documentElement.scrollTop;

  const documentHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  const progress =
    documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;

  progressBar.style.width = `${progress}%`;
}

window.addEventListener("scroll", updateScrollProgressBar, {
  passive: true
});

window.addEventListener("resize", updateScrollProgressBar);

document.addEventListener("DOMContentLoaded", updateScrollProgressBar);

async function updateHomepageStats() {
  const citationElement =
    document.getElementById("citationCount");

  const hIndexElement =
    document.getElementById("hIndex");

  const worksElement =
    document.getElementById("worksCount");

  // Run only when at least one statistics element exists.
  if (
    !citationElement &&
    !hIndexElement &&
    !worksElement
  ) {
    return;
  }

  // Count publication entries from publications.js.
  if (
    worksElement &&
    Array.isArray(window.publications)
  ) {
    worksElement.textContent =
      window.publications.length.toLocaleString();
  }

  // Load citations and h-index from the generated JSON file.
  try {
    const response = await fetch(
      `scholar-stats.json?version=${Date.now()}`,
      {
        cache: "no-store"
      }
    );

    if (!response.ok) {
      throw new Error(
        `Statistics request failed: ${response.status}`
      );
    }

    const stats = await response.json();

    if (
      citationElement &&
      Number.isFinite(stats.citations)
    ) {
      citationElement.textContent =
        stats.citations.toLocaleString();
    }

    if (
      hIndexElement &&
      Number.isFinite(stats.hIndex)
    ) {
      hIndexElement.textContent =
        stats.hIndex.toLocaleString();
    }
  } catch (error) {
    // Preserve the fallback values in index.html.
    console.warn(
      "Could not update Google Scholar statistics:",
      error
    );
  }
}

document.addEventListener(
  "DOMContentLoaded",
  updateHomepageStats
);