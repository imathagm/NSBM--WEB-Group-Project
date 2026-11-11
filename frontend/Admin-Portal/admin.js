(function () {
  "use strict";

  var pageDefinitions = {
    dashboard: { title: "Admin Dashboard", crumb: "Overview", icon: "fa-gauge-high", description: "A clear overview of SportsHub administration, based on saved server records." },
    students: { title: "Student Management", crumb: "People", icon: "fa-user-graduate", description: "Manage student records and follow their club memberships." },
    clubs: { title: "Sports Club Management", crumb: "Clubs", icon: "fa-people-group", description: "Maintain club information and review related members, schedules, and applications." },
    applications: { title: "Membership Applications", crumb: "Memberships", icon: "fa-file-lines", description: "Review requests, inspect the related student, and record an application decision." },
    training: { title: "Training Schedules", crumb: "Schedules", icon: "fa-calendar-days", description: "Create and maintain training sessions with a club, date, time, and location." },
    events: { title: "Matches & Tournaments", crumb: "Competitions", icon: "fa-trophy", description: "Manage matches, tournaments, participating clubs, fixtures, and results." },
    announcements: { title: "Announcement Management", crumb: "Communication", icon: "fa-bullhorn", description: "Draft, preview, publish, and maintain announcements for selected audiences." },
    facilities: { title: "Facilities & Equipment", crumb: "Resources", icon: "fa-building", description: "Review facility and equipment booking requests and record decisions." },
    reports: { title: "Reports & Statistics", crumb: "Insights", icon: "fa-chart-line", description: "Review summaries calculated from saved SportsHub records and export the current report." }
  };

  var navigation = [
    ["dashboard", "Dashboard", "fa-gauge-high", "dashboard.html"],
    ["students", "Student Management", "fa-user-graduate", "students.html"],
    ["clubs", "Sports Club Management", "fa-people-group", "clubs.html"],
    ["applications", "Membership Applications", "fa-file-lines", "applications.html"],
    ["training", "Training Schedules", "fa-calendar-days", "training.html"],
    ["events", "Matches & Tournaments", "fa-trophy", "matches-tournaments.html"],
    ["announcements", "Announcements", "fa-bullhorn", "announcements.html"],
    ["facilities", "Facilities & Equipment", "fa-building", "facilities.html"],
    ["reports", "Reports & Statistics", "fa-chart-line", "reports.html"]
  ];

  var datasets = {
    students: {
      label: "student", plural: "students", icon: "fa-user-graduate",
      fields: [
        { key: "name", label: "Student name", required: true },
        { key: "studentId", label: "Student ID", required: true },
        { key: "email", label: "Email", type: "email" },
        { key: "faculty", label: "Faculty" },
        { key: "batch", label: "Batch / year" }
      ],
      columns: [["name", "Student"], ["studentId", "Student ID"], ["faculty", "Faculty"], ["batch", "Batch"], ["membershipCount", "Club memberships"]]
    },
    clubs: {
      label: "club", plural: "clubs", icon: "fa-people-group",
      fields: [
        { key: "name", label: "Club name", required: true },
        { key: "sport", label: "Sport", required: true },
        { key: "coach", label: "Coach / contact" },
        { key: "venue", label: "Usual venue" },
        { key: "description", label: "Description", type: "textarea", full: true },
        { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"] }
      ],
      columns: [["name", "Club"], ["sport", "Sport"], ["coach", "Coach / contact"], ["venue", "Venue"], ["memberCount", "Members"], ["status", "Status"]]
    },
    applications: {
      label: "application", plural: "applications", icon: "fa-file-lines",
      fields: [
        { key: "studentName", label: "Student name", required: true },
        { key: "studentId", label: "Student ID", required: true },
        { key: "club", label: "Club", required: true },
        { key: "submittedOn", label: "Submitted on", type: "date" },
        { key: "status", label: "Status", type: "select", options: ["Pending", "Approved", "Rejected"] },
        { key: "notes", label: "Notes", type: "textarea", full: true }
      ],
      columns: [["studentName", "Student"], ["studentId", "Student ID"], ["club", "Club"], ["submittedOn", "Submitted"], ["status", "Status"]]
    },
    training: {
      label: "training session", plural: "training sessions", icon: "fa-calendar-days",
      fields: [
        { key: "title", label: "Session name", required: true },
        { key: "club", label: "Club", required: true },
        { key: "date", label: "Date", type: "date", required: true },
        { key: "time", label: "Start time", type: "time" },
        { key: "venue", label: "Location / venue" },
        { key: "coach", label: "Coach / contact" },
        { key: "status", label: "Status", type: "select", options: ["Scheduled", "Cancelled", "Completed"] }
      ],
      columns: [["title", "Session"], ["club", "Club"], ["date", "Date"], ["time", "Time"], ["venue", "Location"], ["status", "Status"]]
    },
    events: {
      label: "event", plural: "matches & tournaments", icon: "fa-trophy",
      fields: [
        { key: "kind", label: "Event type", type: "select", options: ["Match", "Tournament"] },
        { key: "title", label: "Name", required: true },
        { key: "sport", label: "Sport" },
        { key: "date", label: "Date", type: "date" },
        { key: "time", label: "Start time", type: "time" },
        { key: "venue", label: "Venue" },
        { key: "homeClub", label: "NSBM club" },
        { key: "opponent", label: "Opponent / participating clubs" },
        { key: "status", label: "Status", type: "select", options: ["Draft", "Scheduled", "Completed", "Cancelled"] },
        { key: "result", label: "Result (if available)" }
      ],
      columns: [["kind", "Type"], ["title", "Event"], ["sport", "Sport"], ["date", "Date"], ["venue", "Venue"], ["status", "Status"], ["result", "Result"]]
    },
    announcements: {
      label: "announcement", plural: "announcements", icon: "fa-bullhorn",
      fields: [
        { key: "title", label: "Title", required: true },
        { key: "audience", label: "Audience", type: "select", options: ["All students", "Club members", "Administrators"] },
        { key: "status", label: "Status", type: "select", options: ["Draft", "Published"] },
        { key: "publishDate", label: "Publish date", type: "date" },
        { key: "content", label: "Announcement content", type: "textarea", required: true, full: true }
      ],
      columns: [["title", "Announcement"], ["audience", "Audience"], ["publishDate", "Publish date"], ["status", "Status"]]
    },
    facilities: {
      label: "booking", plural: "bookings", icon: "fa-building",
      fields: [
        { key: "type", label: "Booking type", type: "select", options: ["Facility", "Equipment"] },
        { key: "resource", label: "Facility / equipment", required: true },
        { key: "requester", label: "Requested by" },
        { key: "date", label: "Date", type: "date", required: true },
        { key: "startTime", label: "Start time", type: "time" },
        { key: "endTime", label: "End time", type: "time" },
        { key: "purpose", label: "Purpose", type: "textarea", full: true },
        { key: "status", label: "Status", type: "select", options: ["Pending", "Approved", "Rejected"] }
      ],
      columns: [["type", "Type"], ["resource", "Resource"], ["requester", "Requested by"], ["date", "Date"], ["startTime", "Time"], ["status", "Status"]]
    }
  };

  var state = emptyState();
  var adminApiBase = new URL("../../backend/api/admin/", document.currentScript.src);
  var csrfToken = "";
  var page = document.body.getAttribute("data-page");
  if (!pageDefinitions[page]) page = "dashboard";
  var visibleRows = [];
  var toastTimer;

  function emptyState() {
    return { students: [], clubs: [], applications: [], training: [], events: [], announcements: [], facilities: [], activity: [], tournamentRegistrations: [] };
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  }

  async function adminRequest(path, method, payload) {
    var options = {
      method: method || "GET",
      credentials: "same-origin",
      cache: "no-store",
      headers: { "Accept": "application/json" }
    };
    if (payload) {
      options.headers["Content-Type"] = "application/json";
      options.headers["X-CSRF-Token"] = csrfToken;
      options.body = JSON.stringify(payload);
    }
    var response = await fetch(new URL(path, adminApiBase), options);
    var result;
    try {
      result = await response.json();
    } catch (error) {
      throw new Error("The administration service returned an invalid response.");
    }
    if (!response.ok || result.success !== true) {
      throw new Error(result.message || "The administration request could not be completed.");
    }
    if (typeof result.csrfToken === "string") csrfToken = result.csrfToken;
    return result;
  }

  async function loadState() {
    var session = await adminRequest("session.php");
    if (!session.authenticated) {
      var returnTo = window.location.pathname.split("/").pop() + window.location.search;
      window.location.replace("../login/login.html?view=admin&return=" + encodeURIComponent(returnTo) + "#admin");
      return false;
    }
    csrfToken = session.csrfToken;
    var result = await adminRequest("records.php?entity=all");
    Object.keys(state).forEach(function (key) {
      if (Array.isArray(result.records[key])) state[key] = result.records[key];
    });
    return true;
  }

  async function saveRecord(entity, record, id) {
    var data = {};
    datasets[entity].fields.forEach(function (field) {
      if (Object.prototype.hasOwnProperty.call(record, field.key)) data[field.key] = record[field.key];
    });
    var result = await adminRequest("records.php", id ? "PUT" : "POST", {
      entity: entity,
      id: id || undefined,
      data: data
    });
    return result.record;
  }

  async function deleteRecord(entity, id) {
    await adminRequest("records.php", "DELETE", { entity: entity, id: id });
  }

  function showStartupError(error) {
    console.error("Unable to start Admin Portal.", error);
    var app = document.getElementById("app");
    app.innerHTML = '<section class="empty-state"><strong>Admin Portal unavailable</strong><p id="startup-error"></p><a class="btn" href="../login/login.html?view=admin#admin">Administrator sign in</a></section>';
    document.getElementById("startup-error").textContent = error.message || "The administration service could not be reached.";
  }

  function refreshNotificationCount() {
    var button = document.getElementById("notifications-button");
    if (!button) return;
    var count = state.applications.filter(function (item) { return item.status === "Pending"; }).length +
      state.facilities.filter(function (item) { return item.status === "Pending"; }).length;
    button.setAttribute("aria-label", count + " pending items");
    var badge = button.querySelector(".notification-count");
    if (count && !badge) {
      badge = document.createElement("span");
      badge.className = "notification-count";
      button.appendChild(badge);
    }
    if (badge) {
      badge.textContent = String(count);
      badge.hidden = count === 0;
    }
  }

  function applyTheme(theme, save) {
    document.documentElement.setAttribute("data-theme", theme);
    var button = document.getElementById("theme-toggle");
    if (button) {
      button.innerHTML = '<i class="fa-solid ' + (theme === "dark" ? "fa-sun" : "fa-moon") + '" aria-hidden="true"></i>';
      button.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0c1511" : "#f1f6f3");
    if (save) {
      try { window.localStorage.setItem("sportshub-admin-theme", theme); }
      catch (error) { console.warn("Unable to save Admin Portal theme preference.", error); }
    }
  }

  function initTheme() {
    var theme;
    try { theme = window.localStorage.getItem("sportshub-admin-theme"); }
    catch (error) { console.warn("Unable to read Admin Portal theme preference.", error); }
    if (theme !== "light" && theme !== "dark") {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    applyTheme(theme, false);
  }

  function labelize(value) {
    return String(value || "").replace(/([a-z])([A-Z])/g, "$1 $2");
  }

  function fieldValue(entity, item, key) {
    if (key === "membershipCount" && entity === "students") {
      return state.applications.filter(function (application) {
        return application.status === "Approved" && application.studentId === item.studentId;
      }).length;
    }
    if (key === "memberCount" && entity === "clubs") {
      return state.applications.filter(function (application) {
        return application.status === "Approved" && application.club === item.name;
      }).length;
    }
    return item[key] || "";
  }

  function statusBadge(value) {
    var safe = String(value || "Unspecified");
    return '<span class="status status-' + escapeHtml(safe.toLowerCase().replace(/[^a-z]+/g, "-")) + '">' + escapeHtml(safe) + "</span>";
  }

  function studentLink(studentId, name) {
    var student = state.students.find(function (record) { return record.studentId === studentId; });
    var text = escapeHtml(name || studentId || "Student");
    if (!student) return text;
    return '<a class="table-link" href="students.html?record=' + encodeURIComponent(student.id) + '">' + text + "</a>";
  }

  function clubLink(clubName) {
    var club = state.clubs.find(function (record) { return record.name === clubName; });
    var text = escapeHtml(clubName);
    if (!club) return text;
    return '<a class="table-link" href="clubs.html?record=' + encodeURIComponent(club.id) + '">' + text + "</a>";
  }

  function formatCell(entity, item, key) {
    var value = fieldValue(entity, item, key);
    if (key === "status") return statusBadge(value);
    if (entity === "students" && key === "name") return studentLink(item.studentId, value);
    if (entity === "students" && key === "membershipCount") {
      return '<a class="table-link" href="applications.html?student=' + encodeURIComponent(item.studentId) + '">' + escapeHtml(value) + " membership(s)</a>";
    }
    if (entity === "clubs" && key === "name") return clubLink(value);
    if (entity === "clubs" && key === "memberCount") {
      return '<a class="table-link" href="applications.html?club=' + encodeURIComponent(item.name) + '">' + escapeHtml(value) + " member(s)</a>";
    }
    if (entity === "applications" && key === "studentName") return studentLink(item.studentId, value);
    if ((entity === "applications" || entity === "training") && key === "club") return clubLink(value);
    if (!value) return '<span aria-label="Not provided">—</span>';
    return escapeHtml(value);
  }

  function actionButtons(entity, item) {
    var viewLabel = entity === "announcements" ? "Preview" : "View";
    var buttons = '<button class="btn btn-secondary btn-small" type="button" data-action="details" data-entity="' + entity + '" data-id="' + escapeHtml(item.id) + '">' + viewLabel + "</button>" +
      '<button class="btn btn-secondary btn-small" type="button" data-action="edit" data-entity="' + entity + '" data-id="' + escapeHtml(item.id) + '">Edit</button>';
    if ((entity === "applications" || entity === "facilities") && item.status === "Pending") {
      buttons += '<button class="btn btn-small" type="button" data-action="approve" data-entity="' + entity + '" data-id="' + escapeHtml(item.id) + '">Approve</button>' +
        '<button class="btn btn-danger btn-small" type="button" data-action="reject" data-entity="' + entity + '" data-id="' + escapeHtml(item.id) + '">Reject</button>';
    }
    if (entity === "announcements" && item.status === "Draft") {
      buttons += '<button class="btn btn-small" type="button" data-action="publish" data-entity="' + entity + '" data-id="' + escapeHtml(item.id) + '">Publish</button>';
    }
    buttons += '<button class="btn btn-danger btn-small" type="button" data-action="delete" data-entity="' + entity + '" data-id="' + escapeHtml(item.id) + '">Delete</button>';
    return '<div class="row-actions">' + buttons + "</div>";
  }

  function tableMarkup(entity, rows) {
    var definition = datasets[entity];
    if (!rows.length) {
      return '<div class="empty-state"><i class="fa-regular fa-folder-open" aria-hidden="true"></i><strong>No ' + escapeHtml(definition.plural) + " to display</strong><p>Create a record or adjust the search and filters. No sample records are preloaded.</p></div>";
    }
    var headings = definition.columns.map(function (column) { return "<th>" + escapeHtml(column[1]) + "</th>"; }).join("");
    var body = rows.map(function (item) {
      var cells = definition.columns.map(function (column) {
        return "<td>" + formatCell(entity, item, column[0]) + "</td>";
      }).join("");
      return "<tr>" + cells + "<td>" + actionButtons(entity, item) + "</td></tr>";
    }).join("");
    return '<div class="table-wrap"><table class="admin-table"><thead><tr>' + headings + "<th>Actions</th></tr></thead><tbody>" + body + "</tbody></table></div>";
  }

  function renderHeader() {
    var current = pageDefinitions[page];
    var pending = state.applications.filter(function (item) { return item.status === "Pending"; }).length +
      state.facilities.filter(function (item) { return item.status === "Pending"; }).length;
    return '<header class="portal-header">' +
      '<button class="menu-toggle" id="menu-toggle" type="button" aria-label="Open admin navigation" aria-expanded="false" aria-controls="portal-sidebar"><i class="fa-solid fa-bars" aria-hidden="true"></i></button>' +
      '<a class="portal-brand" href="dashboard.html" aria-label="NSBM SportsHub Admin Portal"><img src="../assets/nsbm.jpg" alt=""><span>NSBM <strong>SPORTSHUB</strong><small>ADMIN PORTAL</small></span></a>' +
      '<span class="header-title">ADMIN PORTAL</span><div class="header-actions">' +
      '<button class="icon-btn" id="notifications-button" type="button" aria-label="' + pending + ' pending items"><i class="fa-regular fa-bell" aria-hidden="true"></i>' + (pending ? '<span class="notification-count">' + pending + "</span>" : "") + "</button>" +
      '<button class="icon-btn" id="theme-toggle" type="button" aria-label="Switch theme"><i class="fa-solid fa-moon" aria-hidden="true"></i></button>' +
      '<div class="profile-menu-wrap"><button class="icon-btn" id="profile-toggle" type="button" aria-label="Admin profile options" aria-haspopup="menu" aria-expanded="false" aria-controls="profile-menu"><i class="fa-regular fa-circle-user" aria-hidden="true"></i></button>' +
      '<div class="profile-menu" id="profile-menu" role="menu" aria-label="Admin profile options" hidden>' +
      '<button type="button" role="menuitem" data-profile-action="profile"><i class="fa-regular fa-user" aria-hidden="true"></i> Profile details</button>' +
      '<button type="button" role="menuitem" data-profile-action="preferences"><i class="fa-solid fa-sliders" aria-hidden="true"></i> Account preferences</button>' +
      '<div class="profile-menu-divider" role="separator"></div>' +
      '<button type="button" role="menuitem" data-profile-action="logout"><i class="fa-solid fa-arrow-right-from-bracket" aria-hidden="true"></i> Sign out</button>' +
      '</div></div></div></header>' +
      '<div class="portal-shell"><button class="sidebar-backdrop" id="sidebar-backdrop" type="button" aria-label="Close navigation" tabindex="-1"></button>' +
      '<aside class="portal-sidebar" id="portal-sidebar" aria-label="Admin portal navigation"><div class="sidebar-heading">ADMINISTRATION</div><nav class="sidebar-nav" aria-label="Admin menu">' +
      navigation.map(function (item) {
        return '<a href="' + item[3] + '" class="sidebar-link' + (page === item[0] ? " is-active" : "") + '"' + (page === item[0] ? ' aria-current="page"' : "") + '><i class="fa-solid ' + item[2] + '" aria-hidden="true"></i><span>' + item[1] + "</span></a>";
      }).join("") + '</nav><div class="sidebar-bottom"><button class="sidebar-link sidebar-logout" type="button" id="logout-button"><i class="fa-solid fa-arrow-right-from-bracket" aria-hidden="true"></i><span>Logout</span></button><div class="sidebar-version"><span class="status-pulse"></span><span>Administrator session active</span></div></div></aside>' +
      '<main class="portal-main" id="main-content"><div class="main-inner">' + renderPage(current) +
      '<footer class="portal-footer"><strong>NSBM SportsHub</strong><span>Admin Portal <i class="footer-dot"></i> ' + escapeHtml(current.crumb) + "</span></footer></div></main></div>" +
      '<dialog class="admin-dialog" id="record-dialog" aria-labelledby="dialog-title"></dialog><dialog class="admin-dialog" id="notifications-dialog" aria-labelledby="notifications-title"></dialog><div class="toast" id="toast" role="status" aria-live="polite" hidden></div>';
  }

  function renderPage(definition) {
    return '<nav class="breadcrumb" aria-label="Breadcrumb"><a href="dashboard.html">Home</a><i class="fa-solid fa-chevron-right" aria-hidden="true"></i><span aria-current="page">' + escapeHtml(definition.crumb) + '</span></nav>' +
      '<section class="page-intro"><div><p class="eyebrow"><span class="eyebrow-mark"></span> NSBM SPORTSHUB ADMINISTRATION</p><h1>' + escapeHtml(definition.title) + '</h1><p class="intro-copy">' + escapeHtml(definition.description) + '</p></div><div class="season-chip"><i class="fa-solid ' + definition.icon + '" aria-hidden="true"></i> Admin workspace</div></section>' +
      '<div class="prototype-note"><i class="fa-solid fa-circle-info" aria-hidden="true"></i><span><strong>Administrator workspace:</strong> changes are stored in the SportsHub database and require an administrator account.</span></div>' +
      (page === "dashboard" ? renderDashboard() : page === "reports" ? renderReports() :
        page === "events" ? renderManager(page) + renderTournamentRegistrations() : renderManager(page));
  }

  function renderDashboard() {
    var upcomingTraining = state.training.filter(function (item) { return item.date >= today() && item.status !== "Cancelled"; });
    var upcomingEvents = state.events.filter(function (item) { return item.date >= today() && item.status !== "Cancelled"; });
    var pendingApplications = state.applications.filter(function (item) { return item.status === "Pending"; }).slice(0, 5);
    var recent = state.activity.slice(0, 5);
    return '<section class="stats-grid" aria-label="Administrative overview">' +
      statCard("fa-user-graduate", state.students.length, "Students", "students.html") +
      statCard("fa-people-group", state.clubs.length, "Sports clubs", "clubs.html") +
      statCard("fa-file-lines", state.applications.filter(function (item) { return item.status === "Pending"; }).length, "Pending applications", "applications.html") +
      statCard("fa-calendar-check", upcomingEvents.length + upcomingTraining.length, "Upcoming events & sessions", "matches-tournaments.html") + "</section>" +
      '<section class="dashboard-section"><div class="section-heading"><div><p class="section-overline">QUICK ACCESS</p><h2>Quick actions</h2></div></div><div class="quick-actions">' +
      actionCard("fa-user-plus", "Add student", "students.html", "add") + actionCard("fa-people-group", "Add sports club", "clubs.html", "add") +
      actionCard("fa-file-circle-check", "Review applications", "applications.html") + actionCard("fa-calendar-plus", "Create training session", "training.html", "add") +
      actionCard("fa-trophy", "Create match or tournament", "matches-tournaments.html", "add") + actionCard("fa-bullhorn", "Create announcement", "announcements.html", "add") + "</div></section>" +
      '<div class="panel-grid"><section class="dashboard-section panel"><div class="section-heading"><div><p class="section-overline">REVIEW QUEUE</p><h2>Pending applications</h2></div><a class="table-link" href="applications.html">View all</a></div>' +
      tableMarkup("applications", pendingApplications) + '</section><section class="dashboard-section panel"><div class="section-heading"><div><p class="section-overline">RECENT CHANGES</p><h2>Activity</h2></div></div>' + activityMarkup(recent) + "</section></div>" +
      '<section class="dashboard-section panel"><div class="section-heading"><div><p class="section-overline">SCHEDULE</p><h2>Upcoming matches &amp; training</h2></div><a class="table-link" href="training.html">Training schedules</a></div>' +
      scheduleMarkup(upcomingEvents, upcomingTraining) + "</section>";
  }

  function statCard(icon, count, label, href) {
    return '<a class="stat-card" href="' + href + '" style="text-decoration:none"><span class="stat-icon"><i class="fa-solid ' + icon + '" aria-hidden="true"></i></span><span><strong>' + escapeHtml(count) + "</strong><span>" + escapeHtml(label) + "</span></span></a>";
  }

  function actionCard(icon, label, href, action) {
    return '<a class="action-card" href="' + href + (action ? '?action=' + action : "") + '"><i class="fa-solid ' + icon + '" aria-hidden="true"></i><span>' + escapeHtml(label) + "</span></a>";
  }

  function activityMarkup(items) {
    if (!items.length) return '<div class="empty-state"><i class="fa-regular fa-clock" aria-hidden="true"></i><strong>No recent activity</strong><p>Saved administration changes will appear here.</p></div>';
    return '<div class="activity-list">' + items.slice(0, 5).map(function (item) {
      return '<div class="activity-row"><i class="fa-solid fa-circle-check" aria-hidden="true"></i><div>' + escapeHtml(item.text) + '<time>' + escapeHtml(item.time) + "</time></div></div>";
    }).join("") + "</div>";
  }

  function scheduleMarkup(events, sessions) {
    var rows = events.map(function (item) {
      return { title: item.title, type: item.kind || "Event", date: item.date, time: item.time, place: item.venue, link: "matches-tournaments.html" };
    }).concat(sessions.map(function (item) {
      return { title: item.title, type: "Training", date: item.date, time: item.time, place: item.venue, link: "training.html" };
    })).sort(function (a, b) { return (a.date || "").localeCompare(b.date || ""); }).slice(0, 8);
    if (!rows.length) return '<div class="empty-state"><i class="fa-regular fa-calendar" aria-hidden="true"></i><strong>No upcoming activities</strong><p>There are no upcoming matches or sessions in the database.</p></div>';
    return '<div class="table-wrap"><table class="admin-table"><thead><tr><th>Activity</th><th>Type</th><th>Date</th><th>Time</th><th>Location</th></tr></thead><tbody>' +
      rows.map(function (item) { return "<tr><td><a class=\"table-link\" href=\"" + item.link + "\">" + escapeHtml(item.title) + "</a></td><td>" + escapeHtml(item.type) + "</td><td>" + escapeHtml(item.date || "—") + "</td><td>" + escapeHtml(item.time || "—") + "</td><td>" + escapeHtml(item.place || "—") + "</td></tr>"; }).join("") +
      "</tbody></table></div>";
  }

  function renderManager(entity) {
    var definition = datasets[entity];
    return '<section class="dashboard-section"><div class="toolbar" aria-label="Search and filter ' + escapeHtml(definition.plural) + '">' +
      '<label class="field search-field"><span>Search</span><input id="record-search" type="search" placeholder="Search ' + escapeHtml(definition.plural) + '" autocomplete="off"></label>' +
      (entity !== "students" ? '<label class="field"><span>Filter by status</span><select id="status-filter"><option value="">All statuses</option>' + statusOptions(entity) + "</select></label>" : "") +
      (entity === "students" ? '<label class="field"><span>Faculty</span><select id="faculty-filter"><option value="">All faculties</option>' + uniqueOptions("students", "faculty") + '</select></label><label class="field"><span>Batch / year</span><select id="batch-filter"><option value="">All batches</option>' + uniqueOptions("students", "batch") + "</select></label>" : "") +
      (entity === "applications" ? '<label class="field"><span>Club</span><select id="club-filter"><option value="">All clubs</option>' + uniqueOptions("applications", "club") + "</select></label>" : "") +
      (entity === "events" ? '<label class="field"><span>Event type</span><select id="kind-filter"><option value="">All event types</option><option>Match</option><option>Tournament</option></select></label>' : "") +
      '<button class="btn btn-secondary" id="clear-filters" type="button"><i class="fa-solid fa-rotate-left" aria-hidden="true"></i> Clear</button>' +
      '<button class="btn" id="add-record" type="button"><i class="fa-solid fa-plus" aria-hidden="true"></i> Add ' + escapeHtml(definition.label) + "</button>" +
      '<button class="btn btn-secondary" id="export-records" type="button"><i class="fa-solid fa-download" aria-hidden="true"></i> Export CSV</button></div>' +
      '<div id="record-table">' + tableMarkup(entity, state[entity]) + "</div></section>" +
      (entity === "facilities" ? renderAvailability() : "");
  }

  function renderAvailability() {
    var bySlot = Object.create(null);
    state.facilities.forEach(function (booking) {
      if (!booking.resource || !booking.date) return;
      var key = [booking.resource, booking.date, booking.startTime || ""].join("|");
      if (!bySlot[key] || booking.status === "Approved") bySlot[key] = booking;
    });
    var rows = Object.keys(bySlot).map(function (key) { return bySlot[key]; });
    var content = rows.length
      ? '<div class="table-wrap"><table class="admin-table"><thead><tr><th>Resource</th><th>Date</th><th>Time</th><th>Booking status</th></tr></thead><tbody>' +
        rows.map(function (item) { return "<tr><td><strong>" + escapeHtml(item.resource) + "</strong></td><td>" + escapeHtml(item.date) + "</td><td>" + escapeHtml(item.startTime || "—") + (item.endTime ? "–" + escapeHtml(item.endTime) : "") + "</td><td>" + statusBadge(item.status) + "</td></tr>"; }).join("") +
        "</tbody></table></div>"
      : '<div class="empty-state"><i class="fa-solid fa-building-circle-check" aria-hidden="true"></i><strong>No resource availability data</strong><p>Availability will appear when booking records are added.</p></div>';
    return '<section class="dashboard-section panel"><div class="section-heading"><div><p class="section-overline">DATABASE RECORDS</p><h2>Booking availability</h2></div></div><p class="intro-copy" style="margin-bottom:.8rem">Availability summarizes the saved booking requests; it is not a complete resource inventory or authoritative calendar.</p>' + content + "</section>";
  }

  function renderTournamentRegistrations() {
    var rows = state.tournamentRegistrations;
    if (!rows.length) {
      return '<section class="dashboard-section panel"><div class="section-heading"><div><p class="section-overline">STUDENT ENTRIES</p><h2>Tournament registrations</h2></div></div><div class="empty-state"><i class="fa-regular fa-folder-open" aria-hidden="true"></i><strong>No tournament registrations</strong><p>Student submissions will appear here after they are received.</p></div></section>';
    }
    var body = rows.map(function (item) {
      return "<tr><td>" + escapeHtml(item.tournament) + "</td><td>" + escapeHtml(item.studentName) +
        "</td><td>" + escapeHtml(item.studentId) + "</td><td>" + escapeHtml(item.email) +
        "</td><td>" + escapeHtml(item.faculty || "—") + "</td><td>" +
        escapeHtml(item.yearOfStudy || "—") + "</td><td>" + escapeHtml(item.submittedAt) + "</td></tr>";
    }).join("");
    return '<section class="dashboard-section panel"><div class="section-heading"><div><p class="section-overline">STUDENT ENTRIES</p><h2>Tournament registrations</h2></div><span class="section-count">' + escapeHtml(rows.length) + "</span></div>" +
      '<div class="table-wrap"><table class="admin-table"><thead><tr><th>Tournament</th><th>Student</th><th>Student ID</th><th>Email</th><th>Faculty</th><th>Year</th><th>Submitted</th></tr></thead><tbody>' + body + "</tbody></table></div></section>";
  }

  function uniqueOptions(entity, key) {
    var values = Array.from(new Set(state[entity].map(function (item) { return item[key]; }).filter(Boolean))).sort();
    return values.map(function (value) { return '<option value="' + escapeHtml(value) + '">' + escapeHtml(value) + "</option>"; }).join("");
  }

  function statusOptions(entity) {
    var statuses = Array.from(new Set(state[entity].map(function (item) { return item.status; }).filter(Boolean)));
    if (entity === "applications" || entity === "facilities") statuses = ["Pending", "Approved", "Rejected"];
    if (entity === "announcements") statuses = ["Draft", "Published"];
    if (entity === "events") statuses = ["Draft", "Scheduled", "Completed", "Cancelled"];
    if (entity === "clubs") statuses = ["Active", "Inactive"];
    if (entity === "training") statuses = ["Scheduled", "Cancelled", "Completed"];
    return statuses.map(function (status) { return '<option value="' + escapeHtml(status) + '">' + escapeHtml(status) + "</option>"; }).join("");
  }

  function renderReports() {
    var counts = [
      ["Students", state.students.length, "students.html"],
      ["Sports clubs", state.clubs.length, "clubs.html"],
      ["Pending applications", state.applications.filter(function (item) { return item.status === "Pending"; }).length, "applications.html"],
      ["Approved memberships", state.applications.filter(function (item) { return item.status === "Approved"; }).length, "applications.html"],
      ["Matches", state.events.filter(function (item) { return item.kind === "Match"; }).length, "matches-tournaments.html"],
      ["Tournaments", state.events.filter(function (item) { return item.kind === "Tournament"; }).length, "matches-tournaments.html"],
      ["Training sessions", state.training.length, "training.html"],
      ["Pending bookings", state.facilities.filter(function (item) { return item.status === "Pending"; }).length, "facilities.html"]
    ];
    return '<section class="dashboard-section"><div class="toolbar"><label class="field"><span>Report category</span><select id="report-filter"><option value="all">All categories</option><option value="membership">Memberships</option><option value="events">Matches &amp; tournaments</option><option value="operations">Training &amp; bookings</option></select></label><button class="btn btn-secondary" id="export-report" type="button"><i class="fa-solid fa-download" aria-hidden="true"></i> Export report CSV</button></div>' +
      '<div class="report-grid" id="report-grid">' + counts.map(function (row, index) {
        var type = index < 4 ? "membership" : index < 6 ? "events" : "operations";
        return '<article class="report-card" data-category="' + type + '"><h3>' + escapeHtml(row[0]) + '</h3><p><strong>' + row[1] + '</strong> recorded in this session</p><a class="table-link" href="' + row[2] + '">View records <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a></article>';
      }).join("") + "</div><p class=\"intro-copy\" style=\"margin-top:1rem\">Reports are calculated from this session’s entered records only. No historical or database data is connected.</p></section>";
  }

  function today() {
    var date = new Date();
    return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
  }

  function notify(message) {
    var toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { toast.hidden = true; }, 3500);
  }

  function showNotifications() {
    var pendingApplications = state.applications.filter(function (item) { return item.status === "Pending"; });
    var pendingBookings = state.facilities.filter(function (item) { return item.status === "Pending"; });
    var items = pendingApplications.map(function (item) {
      return { title: "Membership application", text: (item.studentName || item.studentId || "Student") + " · " + (item.club || "Club not specified"), href: "applications.html?record=" + encodeURIComponent(item.id) };
    }).concat(pendingBookings.map(function (item) {
      return { title: "Booking request", text: (item.resource || "Resource") + " · " + (item.date || "Date not set"), href: "facilities.html?record=" + encodeURIComponent(item.id) };
    }));
    var dialog = document.getElementById("notifications-dialog");
    var content = items.length
      ? '<div class="activity-list">' + items.map(function (item) {
        return '<a class="activity-row notification-row" href="' + item.href + '"><i class="fa-regular fa-bell" aria-hidden="true"></i><span><strong>' + escapeHtml(item.title) + '</strong><span class="notification-copy">' + escapeHtml(item.text) + "</span></span></a>";
      }).join("") + "</div>"
      : '<div class="empty-state"><i class="fa-regular fa-bell-slash" aria-hidden="true"></i><strong>No pending items</strong><p>Pending applications and booking requests will appear here.</p></div>';
    dialog.innerHTML = '<div class="dialog-head"><div><p class="section-overline">ADMIN UPDATES</p><h2 id="notifications-title">Notifications</h2></div><button class="dialog-close" type="button" data-action="close-notifications" aria-label="Close"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button></div>' + content;
    dialog.showModal();
  }

  function renderForm(entity, item) {
    var definition = datasets[entity];
    var fields = definition.fields.map(function (field) {
      var value = item ? item[field.key] || "" : "";
      var control;
      if (field.type === "select") {
        var choices = field.options.map(function (option) {
          return '<option value="' + escapeHtml(option) + '"' + (value === option ? " selected" : "") + ">" + escapeHtml(option) + "</option>";
        }).join("");
        control = '<select name="' + field.key + '"' + (field.required ? " required" : "") + ">" + choices + "</select>";
      } else if (field.type === "textarea") {
        control = '<textarea name="' + field.key + '"' + (field.required ? " required" : "") + ">" + escapeHtml(value) + "</textarea>";
      } else {
        control = '<input name="' + field.key + '" type="' + (field.type || "text") + '" value="' + escapeHtml(value) + '"' + (field.required ? " required" : "") + ">";
      }
      return '<label class="form-field' + (field.full ? " full" : "") + '"><span>' + escapeHtml(field.label) + (field.required ? " *" : "") + "</span>" + control + "</label>";
    }).join("");
    var dialog = document.getElementById("record-dialog");
    dialog.innerHTML = '<div class="dialog-head"><div><p class="section-overline">' + (item ? "EDIT RECORD" : "NEW RECORD") + '</p><h2 id="dialog-title">' + (item ? "Edit " : "Add ") + escapeHtml(definition.label) + '</h2></div><button class="dialog-close" type="button" data-action="close-dialog" aria-label="Close"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button></div>' +
      '<form id="record-form" data-entity="' + entity + '" data-id="' + (item ? escapeHtml(item.id) : "") + '"><div class="form-grid">' + fields + '</div><div class="dialog-actions"><button class="btn btn-secondary" type="button" data-action="close-dialog">Cancel</button><button class="btn" type="submit">Save ' + escapeHtml(definition.label) + "</button></div></form>";
    dialog.showModal();
  }

  function renderDetails(entity, item) {
    var definition = datasets[entity];
    var fields = definition.fields.map(function (field) {
      var value = fieldValue(entity, item, field.key);
      var rendered = field.key === "status" ? statusBadge(value) : escapeHtml(value || "Not provided");
      if ((entity === "applications" && field.key === "studentId") || (entity === "students" && field.key === "studentId")) {
        rendered = studentLink(item.studentId, item.studentId);
      }
      if ((entity === "applications" || entity === "training") && field.key === "club") rendered = clubLink(value);
      return "<div><dt>" + escapeHtml(field.label) + "</dt><dd>" + rendered + "</dd></div>";
    }).join("");
    var related = "";
    if (entity === "students") {
      var studentMemberships = state.applications.filter(function (application) {
        return application.status === "Approved" && application.studentId === item.studentId;
      });
      related = '<section class="related-records"><h3>Club memberships (' + studentMemberships.length + ")</h3>" +
        (studentMemberships.length ? "<ul>" + studentMemberships.map(function (application) {
          return "<li>" + clubLink(application.club) + " <span>" + escapeHtml(application.status) + "</span></li>";
        }).join("") + "</ul>" : '<p class="intro-copy">No approved club memberships are recorded in this session.</p>') +
        '<a class="table-link" href="applications.html?student=' + encodeURIComponent(item.studentId) + '">View related applications</a></section>';
    }
    if (entity === "clubs") {
      var clubMemberships = state.applications.filter(function (application) {
        return application.status === "Approved" && application.club === item.name;
      });
      var clubSessions = state.training.filter(function (session) { return session.club === item.name; });
      related = '<section class="related-records"><h3>Club members (' + clubMemberships.length + ")</h3>" +
        (clubMemberships.length ? "<ul>" + clubMemberships.map(function (application) {
          return "<li>" + studentLink(application.studentId, application.studentName) + "</li>";
        }).join("") + "</ul>" : '<p class="intro-copy">No approved club memberships are recorded in this session.</p>') +
        '<a class="table-link" href="applications.html?club=' + encodeURIComponent(item.name) + '">View related applications</a>' +
        '<h3 class="related-subheading">Training sessions (' + clubSessions.length + ")</h3>" +
        (clubSessions.length ? "<ul>" + clubSessions.map(function (session) {
          return '<li><a class="table-link" href="training.html">' + escapeHtml(session.title) + "</a> <span>" + escapeHtml(session.date || "Date not set") + "</span></li>";
        }).join("") + "</ul>" : '<p class="intro-copy">No training sessions are recorded in this session.</p>') + "</section>";
    }
    var dialog = document.getElementById("record-dialog");
    dialog.innerHTML = '<div class="dialog-head"><div><p class="section-overline">' + (entity === "announcements" ? "ANNOUNCEMENT PREVIEW" : "RECORD DETAILS") + '</p><h2 id="dialog-title">' + escapeHtml(item.name || item.title || item.studentName || item.resource || definition.label) + '</h2></div><button class="dialog-close" type="button" data-action="close-dialog" aria-label="Close"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button></div><dl class="detail-list">' + fields + "</dl>" + related + '<div class="dialog-actions"><button class="btn btn-secondary" type="button" data-action="close-dialog">Close</button></div>';
    dialog.showModal();
  }

  function applyFilters() {
    var entity = page;
    var search = (document.getElementById("record-search").value || "").trim().toLowerCase();
    var statusControl = document.getElementById("status-filter");
    var status = statusControl ? (statusControl.value || "").toLowerCase() : "";
    var faculty = document.getElementById("faculty-filter") ? document.getElementById("faculty-filter").value : "";
    var batch = document.getElementById("batch-filter") ? document.getElementById("batch-filter").value : "";
    var club = document.getElementById("club-filter") ? document.getElementById("club-filter").value : "";
    var kind = document.getElementById("kind-filter") ? document.getElementById("kind-filter").value : "";
    var query = new URLSearchParams(window.location.search);
    var studentFilter = query.get("student") || "";
    var clubFilter = query.get("club") || "";
    var rows = state[entity].filter(function (item) {
      var searchable = Object.keys(item).map(function (key) { return item[key]; }).join(" ").toLowerCase();
      return (!search || searchable.indexOf(search) !== -1) &&
        (!status || String(item.status || "").toLowerCase() === status) &&
        (!faculty || item.faculty === faculty) && (!batch || item.batch === batch) &&
        (!club || item.club === club) && (!kind || item.kind === kind) &&
        (!studentFilter || item.studentId === studentFilter) && (!clubFilter || item.club === clubFilter);
    });
    visibleRows = rows;
    document.getElementById("record-table").innerHTML = tableMarkup(entity, rows);
  }

  function exportRows(entity, rows) {
    var definition = datasets[entity];
    var columns = definition.columns.filter(function (column) { return column[0] !== "membershipCount" && column[0] !== "memberCount"; });
    var csv = [columns.map(function (column) { return csvCell(column[1]); }).join(",")].concat(rows.map(function (item) {
      return columns.map(function (column) { return csvCell(item[column[0]] || ""); }).join(",");
    })).join("\r\n");
    downloadCsv(entity + "-report.csv", csv);
  }

  function csvCell(value) {
    return '"' + String(value == null ? "" : value).replace(/"/g, '""') + '"';
  }

  function downloadCsv(filename, text) {
    var blob = new Blob(["\ufeff" + text], { type: "text/csv;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    notify("CSV export downloaded.");
  }

  function handleAction(event) {
    var control = event.target.closest("[data-action]");
    if (!control) return;
    var action = control.getAttribute("data-action");
    if (action === "close-notifications") {
      document.getElementById("notifications-dialog").close();
      return;
    }
    if (action === "close-dialog") {
      document.getElementById("record-dialog").close();
      return;
    }
    var entity = control.getAttribute("data-entity");
    var item = state[entity] && state[entity].find(function (record) { return record.id === control.getAttribute("data-id"); });
    if (!item) return;
    if (action === "details") renderDetails(entity, item);
    if (action === "edit") renderForm(entity, item);
    if (action === "approve" || action === "reject" || action === "publish") {
      var nextStatus = action === "approve" ? "Approved" : action === "reject" ? "Rejected" : "Published";
      if (!window.confirm("Change this " + datasets[entity].label + " status to " + nextStatus + "?")) return;
      var previousStatus = item.status;
      item.status = nextStatus;
      saveRecord(entity, item, item.id).then(function (saved) {
        state[entity] = state[entity].map(function (record) { return record.id === saved.id ? saved : record; });
        window.location.reload();
      }).catch(function (error) {
        item.status = previousStatus;
        notify(error.message);
      });
    }
    if (action === "delete") {
      var deleteWarning = entity === "students" && item.hasAccount
        ? "Delete this student and their login account and tournament registrations? This cannot be undone."
        : "Delete this " + datasets[entity].label + "? This cannot be undone.";
      if (!window.confirm(deleteWarning)) return;
      deleteRecord(entity, item.id).then(function () {
        state[entity] = state[entity].filter(function (record) { return record.id !== item.id; });
        window.location.reload();
      }).catch(function (error) {
        notify(error.message);
      });
    }
  }

  function bindEvents() {
    document.getElementById("theme-toggle").addEventListener("click", function () {
      applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark", true);
    });
    var menuButton = document.getElementById("menu-toggle");
    var backdrop = document.getElementById("sidebar-backdrop");
    function setMenu(open) {
      document.body.classList.toggle("sidebar-open", open);
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Close admin navigation" : "Open admin navigation");
    }
    menuButton.addEventListener("click", function () { setMenu(!document.body.classList.contains("sidebar-open")); });
    backdrop.addEventListener("click", function () { setMenu(false); });
    document.addEventListener("keydown", function (event) { if (event.key === "Escape") setMenu(false); });

    document.getElementById("notifications-button").addEventListener("click", function () {
      showNotifications();
    });
    document.getElementById("logout-button").addEventListener("click", async function () {
      try {
        await adminRequest("logout.php", "POST", {});
        window.location.assign("../login/login.html?view=admin#admin");
      } catch (error) {
        notify(error.message);
      }
    });
    var profileToggle = document.getElementById("profile-toggle");
    var profileMenu = document.getElementById("profile-menu");
    function setProfileMenu(open) {
      profileMenu.hidden = !open;
      profileToggle.setAttribute("aria-expanded", String(open));
    }
    profileToggle.addEventListener("click", function () {
      setProfileMenu(profileMenu.hidden);
    });
    profileMenu.addEventListener("click", function (event) {
      var option = event.target.closest("[data-profile-action]");
      if (!option) return;
      setProfileMenu(false);
      if (option.dataset.profileAction === "profile") {
        notify("Administrator profile details are unavailable until an authenticated admin account is connected.");
      } else if (option.dataset.profileAction === "preferences") {
        notify("Use the adjacent theme button to switch between light and dark appearance.");
      } else if (option.dataset.profileAction === "logout") {
        document.getElementById("logout-button").click();
      }
    });
    document.addEventListener("click", function (event) {
      if (!event.target.closest(".profile-menu-wrap")) setProfileMenu(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !profileMenu.hidden) {
        setProfileMenu(false);
        profileToggle.focus();
      }
    });

    var addButton = document.getElementById("add-record");
    if (addButton) addButton.addEventListener("click", function () { renderForm(page, null); });
    var search = document.getElementById("record-search");
    if (search) search.addEventListener("input", applyFilters);
    ["status-filter", "faculty-filter", "batch-filter", "club-filter", "kind-filter"].forEach(function (id) {
      var select = document.getElementById(id);
      if (select) select.addEventListener("change", applyFilters);
    });
    var clear = document.getElementById("clear-filters");
    if (clear) clear.addEventListener("click", function () {
      document.querySelectorAll(".toolbar input, .toolbar select").forEach(function (control) { control.value = ""; });
      applyFilters();
    });
    var exportButton = document.getElementById("export-records");
    if (exportButton) exportButton.addEventListener("click", function () {
      exportRows(page, visibleRows);
    });

    var reportFilter = document.getElementById("report-filter");
    if (reportFilter) reportFilter.addEventListener("change", function () {
      document.querySelectorAll(".report-card").forEach(function (card) {
        card.hidden = reportFilter.value !== "all" && card.getAttribute("data-category") !== reportFilter.value;
      });
    });
    var exportReport = document.getElementById("export-report");
    if (exportReport) exportReport.addEventListener("click", function () {
      var rows = [["Category", "Count"]];
      var selectedCategory = reportFilter ? reportFilter.value : "all";
      var reportRows = [
        ["membership", "Students", state.students.length], ["membership", "Sports clubs", state.clubs.length],
        ["membership", "Pending applications", state.applications.filter(function (item) { return item.status === "Pending"; }).length],
        ["membership", "Approved memberships", state.applications.filter(function (item) { return item.status === "Approved"; }).length],
        ["events", "Matches", state.events.filter(function (item) { return item.kind === "Match"; }).length],
        ["events", "Tournaments", state.events.filter(function (item) { return item.kind === "Tournament"; }).length],
        ["operations", "Training sessions", state.training.length],
        ["operations", "Pending bookings", state.facilities.filter(function (item) { return item.status === "Pending"; }).length]
      ];
      reportRows.filter(function (row) { return selectedCategory === "all" || row[0] === selectedCategory; })
        .forEach(function (row) { rows.push([row[1], row[2]]); });
      downloadCsv("sportshub-admin-report.csv", rows.map(function (row) { return row.map(csvCell).join(","); }).join("\r\n"));
    });

    document.getElementById("app").addEventListener("click", handleAction);
    document.getElementById("app").addEventListener("submit", async function (event) {
      var form = event.target.closest("#record-form");
      if (!form) return;
      event.preventDefault();
      var entity = form.getAttribute("data-entity");
      var id = form.getAttribute("data-id");
      var existing = id ? state[entity].find(function (record) { return record.id === id; }) : null;
      var record = existing ? Object.assign({}, existing) :
        { id: (window.crypto && window.crypto.randomUUID) ? window.crypto.randomUUID() : String(Date.now()) };
      var submitButton = form.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      new FormData(form).forEach(function (value, key) { record[key] = String(value).trim(); });
      if (!record.status && datasets[entity].fields.some(function (field) { return field.key === "status"; })) {
        record.status = entity === "announcements" ? "Draft" : entity === "clubs" ? "Active" : entity === "training" ? "Scheduled" : entity === "events" ? "Draft" : "Pending";
      }
      try {
        var savedRecord = await saveRecord(entity, record, existing ? id : null);
        if (existing) {
          state[entity] = state[entity].map(function (item) { return item.id === savedRecord.id ? savedRecord : item; });
        } else {
          state[entity].unshift(savedRecord);
        }
      } catch (error) {
        notify(error.message);
        submitButton.disabled = false;
        return;
      }
      document.getElementById("record-dialog").close();
      notify("Record " + (existing ? "updated" : "created") + ".");
      if (page === "dashboard") window.location.reload();
      else applyFilters();
    });

    var query = new URLSearchParams(window.location.search);
    if (query.get("action") === "add" && datasets[page]) renderForm(page, null);
    if (query.get("record") && datasets[page]) {
      var linkedRecord = state[page].find(function (item) { return item.id === query.get("record"); });
      if (linkedRecord) renderDetails(page, linkedRecord);
    }
    if (page !== "dashboard" && page !== "reports") {
      if (query.get("student")) document.getElementById("record-search").value = query.get("student");
      if (query.get("club")) document.getElementById("record-search").value = query.get("club");
      applyFilters();
    }
  }

  async function start() {
    initTheme();
    document.getElementById("app").textContent = "Loading administration data…";
    if (!await loadState()) return;
    document.getElementById("app").innerHTML = renderHeader();
    bindEvents();
  }

  document.addEventListener("DOMContentLoaded", function () {
    start().catch(showStartupError);
  });
})();
