document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const pad2 = (n) => String(n).padStart(2, '0');

  /* ---------- Dark / light theme ---------- */
  const themeBtn = document.getElementById('themeToggle');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    const dark = theme === 'dark';
    themeBtn.innerHTML = dark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    themeBtn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  }

  applyTheme(root.getAttribute('data-theme') || 'light');

  themeBtn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('sportshub-theme', next); } catch (e) { /* storage blocked */ }
  });

  /* ---------- Show each menu page inside this page ---------- */
  const views = document.querySelectorAll('.view');
  const navBtns = document.querySelectorAll('.nav-btn');
  const sidebar = document.getElementById('sidebar');
  const scrim = document.getElementById('scrim');
  const menuToggle = document.getElementById('menuToggle');

  function setMenu(open) {
    sidebar.classList.toggle('is-open', open);
    scrim.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  }

  function showView(name) {
    if (!document.getElementById(name)) name = 'dashboard';
    views.forEach((v) => { v.hidden = v.id !== name; });
    navBtns.forEach((b) => {
      const active = b.dataset.target === name;
      b.classList.toggle('is-active', active);
      if (active) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });
    window.scrollTo({ top: 0 });
    setMenu(false);
  }

  // Menu buttons and any element with data-go (profile icon, "Browse clubs", etc.)
  document.querySelectorAll('[data-target], [data-go]').forEach((el) => {
    el.addEventListener('click', () => {
      const name = el.dataset.target || el.dataset.go;
      if (location.hash === '#' + name) showView(name);
      else location.hash = name;
    });
  });

  document.getElementById('bellBtn').addEventListener('click', () => {
    location.hash = 'notifications';
  });

  window.addEventListener('hashchange', () => showView(location.hash.slice(1)));
  showView(location.hash.slice(1) || 'dashboard');

  /* ---------- Mobile menu ---------- */
  menuToggle.addEventListener('click', () => setMenu(!sidebar.classList.contains('is-open')));
  scrim.addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Keep the numbers in sync with the page ---------- */
  const joined = document.querySelectorAll('.club-card .joined-badge').length;
  const events = document.querySelectorAll('#dashboard .activity-item').length;
  const notifs = document.querySelectorAll('#notifications .notif-item').length;

  document.getElementById('myClubsCount').textContent = pad2(joined);
  document.getElementById('eventsCount').textContent = pad2(events);
  document.getElementById('notificationsCount').textContent = pad2(notifs);
  const bell = document.getElementById('bellCount');
  bell.textContent = notifs;
  bell.hidden = notifs === 0;

  /* ---------- View Club buttons ---------- */
  document.querySelectorAll('.btn-view-club').forEach((button) => {
    button.addEventListener('click', () => {
      const club = button.closest('.club-card').dataset.club;
      window.location.href = 'club-details.html?club=' + encodeURIComponent(club); // change to your real page
    });
  });
});
