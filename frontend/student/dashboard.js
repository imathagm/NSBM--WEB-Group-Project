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
    document.body.classList.toggle('sidebar-open', open);
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
    window.location.href = 'notifications.html';
  });

  window.addEventListener('hashchange', () => showView(location.hash.slice(1)));
  showView(location.hash.slice(1) || 'dashboard');

  /* ---------- Mobile menu ---------- */
  menuToggle.addEventListener('click', () => setMenu(!sidebar.classList.contains('is-open')));
  scrim.addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  const dashboardEndpoint = new URL('../../backend/api/student-dashboard.php', window.location.href);
  const announcementsEndpoint = new URL('../../backend/api/announcements.php', window.location.href);
  const dashboardActivityList = document.getElementById('dashboard-activities');
  const dashboardClubList = document.getElementById('dashboard-clubs');
  const applicationList = document.getElementById('dashboard-applications');
  const scheduleList = document.getElementById('dashboard-schedule');
  const matchList = document.getElementById('dashboard-matches');
  const announcementList = document.getElementById('dashboard-announcements');

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, (char) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]
    ));
  }

  function setEmpty(list, message) {
    list.innerHTML = '<li class="activity-item">' + escapeHtml(message) + '</li>';
  }

  function formatDate(value) {
    if (!value) return 'Date to be announced';
    const parts = value.slice(0, 10).split('-').map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString(undefined, {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
    });
  }

  function formatActivity(item, label) {
    const dateTime = [formatDate(item.date), item.time || 'Time to be announced'].join(' · ');
    const location = item.venue ? ' · ' + item.venue : '';
    return '<li class="activity-item"><div><h3>' + escapeHtml(item.title) +
      '</h3><p><i class="far fa-clock"></i> ' + escapeHtml(dateTime + location) +
      '</p></div><span class="badge badge--scheduled">' + escapeHtml(label) + '</span></li>';
  }

  function renderApplications(applications) {
    document.getElementById('applicationsCount').textContent = pad2(applications.length);
    if (!applications.length) return setEmpty(applicationList, 'No applications have been submitted.');
    applicationList.innerHTML = applications.map((item) =>
      '<li class="activity-item"><div><h3>' + escapeHtml(item.club) + '</h3><p>Submitted ' +
      escapeHtml(formatDate(item.submittedOn)) + '</p></div><span class="badge badge--scheduled">' +
      escapeHtml(item.status) + '</span></li>'
    ).join('');
  }

  function renderDashboard(data) {
    if (!Array.isArray(data.clubs) || !Array.isArray(data.applications) ||
        !Array.isArray(data.training) || !Array.isArray(data.events)) {
      throw new Error('The dashboard service returned invalid records.');
    }

    const joinedNames = new Set(data.applications
      .filter((item) => item.status === 'Approved')
      .map((item) => item.club.toLowerCase()));
    const activities = data.training.map((item) => ({ ...item, type: 'Training' }))
      .concat(data.events.map((item) => ({ ...item, type: item.kind || 'Event' })))
      .sort((left, right) => String(left.date || '9999').localeCompare(String(right.date || '9999')));
    document.getElementById('myClubsCount').textContent = pad2(joinedNames.size);
    document.getElementById('eventsCount').textContent = pad2(data.events.length);
    dashboardClubList.innerHTML = data.clubs.length ? data.clubs.map((club) => {
      const joined = joinedNames.has(club.name.toLowerCase());
      return '<article class="club-card" data-club="' + escapeHtml(club.id) + '">' +
        '<div class="club-cover-wrap"><i class="fas fa-people-group club-fallback" aria-hidden="true"></i>' +
        '<span class="joined-badge" ' + (joined ? '' : 'hidden') + '><i class="fas fa-check-circle"></i> Joined</span></div>' +
        '<div class="club-content"><div class="club-header"><div class="club-icon"><i class="fas fa-people-group"></i></div>' +
        '<h3 class="club-title">' + escapeHtml(club.name) + '</h3></div><p class="club-desc">' +
        escapeHtml(club.description || '') + '</p><div class="club-meta"><span>' + escapeHtml(club.sport) +
        '</span>' + (club.coach ? '<span>' + escapeHtml(club.coach) + '</span>' : '') +
        (club.venue ? '<span>' + escapeHtml(club.venue) + '</span>' : '') +
        '</div><button class="btn-view-club" type="button">View directory</button></div></article>';
    }).join('') : '<p class="panel empty">No active clubs have been added.</p>';
    dashboardClubList.querySelectorAll('.btn-view-club').forEach((button) => {
      button.addEventListener('click', () => {
        window.location.href = '../sports-club-directory%20and%20Details-Page(Arshi)/sport-club-directory.html';
      });
    });

    renderApplications(data.applications);
    document.getElementById('applicationsCount').textContent = pad2(data.applications.length);
    if (activities.length) {
      dashboardActivityList.innerHTML = activities.slice(0, 5).map((item) => formatActivity(item, item.type)).join('');
    } else {
      setEmpty(dashboardActivityList, 'No upcoming activities have been scheduled.');
    }
    if (activities.length) scheduleList.innerHTML = activities.map((item) => formatActivity(item, item.type)).join('');
    else setEmpty(scheduleList, 'No upcoming sessions or events have been scheduled.');
    if (data.events.length) matchList.innerHTML = data.events.map((item) => formatActivity(item, item.kind || 'Event')).join('');
    else setEmpty(matchList, 'No upcoming matches or tournaments have been scheduled.');
  }

  async function loadDashboard() {
    try {
      const response = await fetch(dashboardEndpoint, { credentials: 'same-origin', cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok || payload.success !== true) {
        throw new Error(payload.message || 'The dashboard request could not be completed.');
      }
      renderDashboard(payload);
    } catch (error) {
      console.error('Unable to load student dashboard records.', error);
      ['myClubsCount', 'applicationsCount', 'eventsCount'].forEach((id) => {
        document.getElementById(id).textContent = '—';
      });
      ['dashboard-activities', 'dashboard-clubs', 'dashboard-applications', 'dashboard-schedule', 'dashboard-matches']
        .forEach((id) => {
          const list = document.getElementById(id);
          if (list) list.textContent = 'Student records are temporarily unavailable.';
        });
    }
  }

  async function loadAnnouncements() {
    try {
      const response = await fetch(announcementsEndpoint, { credentials: 'same-origin', cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok || payload.success !== true || !Array.isArray(payload.announcements)) {
        throw new Error(payload.message || 'The announcements request could not be completed.');
      }
      const announcements = payload.announcements;
      document.getElementById('notificationsCount').textContent = pad2(announcements.length);
      const bell = document.getElementById('bellCount');
      bell.textContent = String(announcements.length);
      bell.hidden = announcements.length === 0;
      if (!announcements.length) return setEmpty(announcementList, 'No published announcements.');
      announcementList.innerHTML = announcements.map((item) =>
        '<li class="activity-item"><div><h3>' + escapeHtml(item.title) + '</h3><p>' +
        escapeHtml(item.content) + '</p><p>' + escapeHtml(formatDate(item.publishedDate)) +
        '</p></div></li>'
      ).join('');
    } catch (error) {
      console.error('Unable to load student announcements.', error);
      document.getElementById('notificationsCount').textContent = '—';
      setEmpty(announcementList, 'Announcements are temporarily unavailable.');
    }
  }

  setEmpty(dashboardActivityList, 'Loading records…');
  setEmpty(dashboardClubList, 'Loading records…');
  setEmpty(applicationList, 'Loading records…');
  setEmpty(scheduleList, 'Loading records…');
  setEmpty(matchList, 'Loading records…');
  setEmpty(announcementList, 'Loading records…');
  loadDashboard();
  loadAnnouncements();
});
