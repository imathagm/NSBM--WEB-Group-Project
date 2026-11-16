(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    if (!("IntersectionObserver" in window)) return;

    var elements = document.querySelectorAll(
      ".story-item, .campus-card, .values-card, .people-section .card"
    );
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    elements.forEach(function (element) {
      element.classList.add("about-reveal");
      observer.observe(element);
    });
  });
})();
