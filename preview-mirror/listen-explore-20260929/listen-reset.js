/* ===== Listen: every fresh click starts from story 1 at 0:00 ===== */
/* EXACT preview code (wellwith-website-preview, published 2026-09-29). Paste-ready. */

/* --- hunk 1: openListenModal head (assets/js/app.js) --- */
function openListenModal(selectedIndex, fromHistory) {
    /* Every fresh Listen-card click starts the story sequence from item one. */
    index = fromHistory ? Math.max(0, Math.min(LISTEN_PRODUCTS.length - 1, Number(selectedIndex) || 0)) : 0;
    if (!fromHistory) {
      WellWithHistory.open("listen", { index: 0 });
      return;
    }

/* --- hunk 2: Listen card openers (assets/js/app.js) --- */
  openers.forEach(function (opener) {
    opener.addEventListener("click", function () {
      if (opener.id === "feature-listen-open") resetFeatureTimer();
      openListenModal(0);
    });
  });

/* --- hunk 3: Explore character slider (assets/js/app.js, after initBusinessSlider IIFE) --- */
  /* Explore card: one Pixar-style character at a time, matching Business. */
  (function initExploreCharacterSlider() {
    var slides = qsa(".explore-character-slider .explore-character-slide");
    if (slides.length < 2) return;
    var i = 0;
    setInterval(function () {
      slides[i].classList.remove("is-active");
      i = (i + 1) % slides.length;
      slides[i].classList.add("is-active");
    }, 2800);
  })();
