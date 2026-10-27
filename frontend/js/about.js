function animateStats() {
  const stats = document.querySelectorAll('.about-stats h2');
  stats.forEach(stat => {
    const target = parseInt(stat.innerText);
    if (isNaN(target)) return;
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        stat.innerText = target + '+';
        clearInterval(timer);
      } else {
        stat.innerText = Math.floor(current) + '+';
      }
    }, 30);
  });
}

// 2. Scroll Reveal for Value Cards
function revealOnScroll() {
  const cards = document.querySelectorAll('.value-card, .about-pitch-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transform = 'translateY(0)';
        entry.target.style.opacity = '1';
      }
    });
  }, { threshold: 0.2 });

  cards.forEach(card => {
    card.style.transform = 'translateY(20px)';