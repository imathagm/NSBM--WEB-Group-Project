(function () {
  "use strict";

  function initializeAboutPage() {
    var root = document.documentElement;
    if (root.dataset.aboutInitialized === "true") return;
    root.dataset.aboutInitialized = "true";

    document.querySelectorAll("img[data-fallback]").forEach(function (image) {
      function useFallback() {
        if (!image.dataset.fallbackApplied) {
          image.dataset.fallbackApplied = "true";
          image.src = image.dataset.fallback;
          return;
        }

        console.warn("An About page image and its fallback failed to load:", image.currentSrc || image.src);
        image.hidden = true;
      }

      image.addEventListener("error", useFallback);
      if (image.complete && image.naturalWidth === 0) useFallback();
    });

    var elements = document.querySelectorAll(
      ".hero-stats li, .story-item, .campus-card, .values-card, .club-card, .people-section .card"
    );
    if (!elements.length) return;

    elements.forEach(function (element) {
      element.classList.add("about-reveal");
    });

    var reducedMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!("IntersectionObserver" in window) || reducedMotion) {
      elements.forEach(function (element) {
        element.classList.add("is-visible");
      });
      return;
    }

    var remaining = elements.length;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
      });
    }, { threshold: 0.12 });

    function reveal(element) {
      if (element.classList.contains("is-visible")) return;
      element.classList.add("is-visible");
      observer.unobserve(element);
      remaining -= 1;
      if (remaining === 0) {
        observer.disconnect();
        window.removeEventListener("scroll", revealVisibleElements);
        window.removeEventListener("resize", revealVisibleElements);
      }
    }

    function revealVisibleElements() {
      var viewportHeight = window.innerHeight || root.clientHeight;
      elements.forEach(function (element) {
        var bounds = element.getBoundingClientRect();
        if (bounds.bottom >= 0 && bounds.top <= viewportHeight) {
          reveal(element);
        }
      });
    }

    elements.forEach(function (element) {
      observer.observe(element);
    });
    window.addEventListener("scroll", revealVisibleElements, { passive: true });
    window.addEventListener("resize", revealVisibleElements);
    revealVisibleElements();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeAboutPage, { once: true });
  } else {
    initializeAboutPage();
  }
})();
