document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const pad2 = (n) => String(n).padStart(2, '0');
  let dashboardLoaded = false;

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
    if (name === 'applications' && dashboardLoaded) loadDashboard();
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
  const applicationEndpoint = new URL('../../backend/api/membership-applications.php', window.location.href);
  const studentApplicationsEndpoint = new URL('../../backend/api/student-applications.php', window.location.href);
  const dashboardActivityList = document.getElementById('dashboard-activities');
  const dashboardClubList = document.getElementById('dashboard-clubs');
  const applicationList = document.getElementById('dashboard-applications');
  const joinClubGrid = document.getElementById('join-club-grid');
  const joinClubSearch = document.getElementById('join-club-search');
  const joinClubCount = document.getElementById('join-club-count');
  const joinClubMessage = document.getElementById('join-club-message');
  const applicationDialog = document.getElementById('club-application-dialog');
  const applicationForm = document.getElementById('club-application-form');
  const applicationApplicant = document.getElementById('club-application-applicant');
  const applicationNote = document.getElementById('club-application-note');
  const applicationRemaining = document.getElementById('club-application-remaining');
  const applicationFeedback = document.getElementById('club-application-feedback');
  const applicationSubmit = document.getElementById('club-application-submit');
  const scheduleList = document.getElementById('dashboard-schedule');
  const matchList = document.getElementById('dashboard-matches');
  const announcementList = document.getElementById('dashboard-announcements');
  let availableClubs = [];
  let currentApplications = [];
  let selectedClub = null;

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
    applicationList.innerHTML = applications.map((item) => {
      const status = String(item.status || 'Pending').toLowerCase();
      const applicationType = String(item.applicationType || 'Application');
      const statusMessage = status === 'approved'
        ? (applicationType === 'Club' ? 'Your club application has been approved.' : 'Your registration has been approved.')
        : status === 'rejected'
          ? (applicationType === 'Club' ? 'Your club application was not approved.' : 'Your registration was not approved.')
          : 'Waiting for an administrator decision.';
      return '<li class="activity-item application-item"><div><span class="badge badge--scheduled application-type">' +
        escapeHtml(applicationType) + '</span><h3>' + escapeHtml(item.itemName || 'Application') +
        '</h3><p>Submitted ' + escapeHtml(formatDate(item.submittedAt)) + '</p><p class="application-status-message">' +
        escapeHtml(statusMessage) + '</p>' + (item.message ? '<p class="application-note"><strong>Your message:</strong> ' +
          escapeHtml(item.message) + '</p>' : '') + (item.reviewedAt
          ? '<p class="application-review-date">Reviewed ' + escapeHtml(formatDate(item.reviewedAt)) + '</p>' : '') +
        '</div><span class="badge application-status application-status--' +
        escapeHtml(status) + '">' + escapeHtml(item.status || 'Pending') + '</span></li>';
    }).join('');
  }

  async function loadStudentApplications() {
    try {
      const response = await fetch(studentApplicationsEndpoint, { credentials: 'same-origin', cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok || payload.success !== true || !Array.isArray(payload.records)) {
        throw new Error(payload.message || 'The application request could not be completed.');
      }
      renderApplications(payload.records);
    } catch (error) {
      console.error('Unable to load student applications.', error);
      document.getElementById('applicationsCount').textContent = '—';
      setEmpty(applicationList, error.message || 'Application records are temporarily unavailable.');
    }
  }

  function clubImagePath(sport) {
    const key = String(sport || '').trim().toLocaleLowerCase();
    const imageName = key === 'martial arts'
      ? 'karate'
      : key.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return '../assets/' + imageName + '.jpg';
  }

  function showJoinMessage(text, type) {
    joinClubMessage.textContent = text;
    joinClubMessage.classList.toggle('is-success', type === 'success');
    joinClubMessage.classList.toggle('is-error', type === 'error');
  }

  function renderJoinClubs(clubs, applications) {
    availableClubs = clubs;
    currentApplications = applications;
    const term = joinClubSearch.value.trim().toLocaleLowerCase();
    const visibleClubs = clubs.filter((club) =>
      (club.name + ' ' + club.sport + ' ' + (club.description || '')).toLocaleLowerCase().includes(term)
    );
    joinClubCount.textContent = 'Showing ' + visibleClubs.length + ' of ' + clubs.length + ' clubs';
    if (!clubs.length) {
      joinClubGrid.innerHTML = '<div class="panel empty"><i class="fas fa-people-group" aria-hidden="true"></i><p>No active clubs are available right now.</p></div>';
      return;
    }
    if (!visibleClubs.length) {
      joinClubGrid.innerHTML = '<div class="panel empty"><i class="fas fa-magnifying-glass" aria-hidden="true"></i><p>No clubs match your search. Try another sport or club name.</p></div>';
      return;
    }

    joinClubGrid.innerHTML = visibleClubs.map((club) => {
      const application = applications.find((item) =>
        (item.clubId && item.clubId === club.id) || item.club === club.name
      );
      const status = application ? String(application.status || 'Pending').toLowerCase() : '';
      const action = application
        ? '<button class="join-club-button join-club-button--secondary" type="button" data-view-applications>View application status</button>'
        : '<button class="join-club-button" type="button" data-apply-club="' + escapeHtml(club.id) + '">Join club</button>';
      const statusBadge = application
        ? '<span class="join-club-status join-club-status--' + escapeHtml(status) + '">' +
          escapeHtml(application.status || 'Pending') + '</span>'
        : '';
      const venue = club.venue
        ? '<p class="join-club-location"><i class="fas fa-location-dot" aria-hidden="true"></i>' + escapeHtml(club.venue) + '</p>'
        : '<p class="join-club-location"><i class="fas fa-location-dot" aria-hidden="true"></i>Location to be announced</p>';
      return '<article class="join-club-card"><div class="join-club-card__visual"><img class="join-club-card__image" src="' +
        escapeHtml(clubImagePath(club.sport)) + '" alt="' + escapeHtml(club.name) +
        '" loading="lazy" decoding="async"><span class="join-club-card__sport">' + escapeHtml(club.sport) +
        '</span></div><div class="join-club-card__body"><p class="join-club-card__eyebrow">SPORTS CLUB</p><h2>' +
        escapeHtml(club.name) + '</h2><p class="join-club-card__description">' +
        escapeHtml(club.description || 'Find out more about training and activities when you apply.') +
        '</p>' + venue + '<div class="join-club-card__actions">' + statusBadge + action +
        '</div></div></article>';
    }).join('');
    joinClubGrid.querySelectorAll('.join-club-card__image').forEach((image) => {
      image.addEventListener('error', () => { image.hidden = true; }, { once: true });
    });
  }

  function renderDashboard(data) {
    if (!Array.isArray(data.clubs) || !Array.isArray(data.applications) ||
        !Array.isArray(data.training) || !Array.isArray(data.events)) {
      throw new Error('The dashboard service returned invalid records.');
    }

    const joinedNames = new Set(data.applications
      .filter((item) => item.status === 'Approved')
      .map((item) => item.club.toLowerCase()));
    renderJoinClubs(data.clubs, data.applications);
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
        '</div><a class="btn-view-club" href="' + (joined ? '#applications' : '../pages/clubregister.html?club=' + encodeURIComponent(club.id)) + '">' +
        (joined ? 'View application' : 'Apply to club') + '</a></div></article>';
    }).join('') : '<p class="panel empty">No active clubs have been added.</p>';
    dashboardClubList.querySelectorAll('.btn-view-club').forEach((button) => {
      button.addEventListener('click', () => {
        window.location.href = '../sports-club-directory%20and%20Details-Page(Arshi)/sport-club-directory.html';
      });
    });

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
      await loadStudentApplications();
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
      joinClubCount.textContent = 'Clubs unavailable';
      joinClubGrid.textContent = 'Club records are temporarily unavailable.';
    } finally {
      dashboardLoaded = true;
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

  joinClubSearch.addEventListener('input', () => renderJoinClubs(availableClubs, currentApplications));
  joinClubGrid.addEventListener('click', async (event) => {
    const viewApplications = event.target.closest('[data-view-applications]');
    if (viewApplications) {
      window.location.hash = 'applications';
      return;
    }
    const applyButton = event.target.closest('[data-apply-club]');
    if (!applyButton) return;
    selectedClub = availableClubs.find((club) => String(club.id) === applyButton.dataset.applyClub);
    if (!selectedClub) return;
    try {
      const session = await window.sportshubAuth.session();
      if (!session.authenticated) {
        window.location.replace('../login/login.html');
        return;
      }
      const applicant = session.user || {};
      applicationApplicant.textContent = [
        applicant.fullName,
        applicant.studentId ? 'Student ID ' + applicant.studentId : '',
        applicant.email
      ].filter(Boolean).join(' · ') || 'Your application will use the details in your signed-in account.';
    } catch (error) {
      showJoinMessage(error.message || 'Your student details could not be loaded.', 'error');
      return;
    }
    document.getElementById('club-application-title').textContent = 'Apply to join ' + selectedClub.name;
    applicationFeedback.textContent = '';
    applicationFeedback.className = 'club-application-feedback';
    applicationForm.reset();
    applicationRemaining.textContent = '1,000';
    applicationDialog.showModal();
    applicationNote.focus();
  });
  document.querySelectorAll('[data-close-club-application]').forEach((button) => {
    button.addEventListener('click', () => applicationDialog.close());
  });
  applicationNote.addEventListener('input', () => {
    applicationRemaining.textContent = String(1000 - applicationNote.value.length);
  });
  applicationForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!selectedClub) return;
    applicationSubmit.disabled = true;
    applicationFeedback.textContent = 'Submitting your application…';
    applicationFeedback.className = 'club-application-feedback';
    try {
      const session = await window.sportshubAuth.session();
      if (!session.authenticated) {
        window.location.replace('../login/login.html');
        return;
      }
      const response = await fetch(applicationEndpoint, {
        method: 'POST',
        credentials: 'same-origin',
        cache: 'no-store',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-Token': session.csrfToken
        },
        body: JSON.stringify({ clubId: selectedClub.id, message: applicationNote.value.trim() })
      });
      let payload;
      try {
        payload = await response.json();
      } catch (error) {
        throw new Error('The club application service returned an invalid response.');
      }
      if (!response.ok || payload.success !== true) {
        throw new Error(payload.message || 'The application could not be submitted.');
      }
      applicationDialog.close();
      showJoinMessage(payload.message, 'success');
      await loadDashboard();
    } catch (error) {
      applicationFeedback.textContent = error.message || 'The application could not be submitted.';
      applicationFeedback.classList.add('is-error');
    } finally {
      applicationSubmit.disabled = false;
    }
  });
  loadDashboard();
  loadAnnouncements();

  window.sportshubAuth.session().then((session) => {
    if (session.authenticated) {
      loadDashboard();
      loadAnnouncements();
    }
  }).catch(() => setEmpty(dashboardActivityList, 'The account service is temporarily unavailable.'));

});
