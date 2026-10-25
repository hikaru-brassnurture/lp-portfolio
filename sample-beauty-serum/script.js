/*
 * Mobile sticky CTA (design-guide 8-5).
 * - Show once the first-view button scrolls off screen
 * - Hide while the trial-set (8) or final call-to-action (10) button is visible
 * - Never shown on PC (1024px+). Controlled by CSS (@media)
 * Without JS the bar never appears; all content still reads normally.
 */
(function () {
  "use strict";
  var bar = document.getElementById("sticky-cta");
  if (!bar || !("IntersectionObserver" in window)) return;

  var targets = ["fv-cta", "offer-cta", "final-cta"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  if (!targets.length) return;

  var visible = {};

  function update() {
    var anyVisible = targets.some(function (el) { return visible[el.id]; });
    bar.classList.toggle("is-visible", !anyVisible);
    // Keep keyboard and screen-reader users from landing on the bar while it's hidden
    if (anyVisible) {
      bar.setAttribute("aria-hidden", "true");
      bar.setAttribute("inert", "");
    } else {
      bar.removeAttribute("aria-hidden");
      bar.removeAttribute("inert");
    }
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      visible[entry.target.id] = entry.isIntersecting;
    });
    update();
  });

  // Hidden until the first callback arrives
  bar.setAttribute("aria-hidden", "true");
  bar.setAttribute("inert", "");
  targets.forEach(function (el) { io.observe(el); });
})();
