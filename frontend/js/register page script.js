"use strict";

const clubApplicationEndpoint = new URL('../../backend/api/club-application.php', document.currentScript.src);
const clubListEndpoint = new URL('../../backend/api/public-content.php?entity=clubs', document.currentScript.src);

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('registration-form');
  const message = document.getElementById('registration-message');
  const submit = form.querySelector('button[type="submit"]');
  const clubs = document.getElementById('club-select');
  let session;
  const showMessage = (text, error = false) => {
    message.textContent = text;
    message.className = 'message ' + (error ? 'error' : 'success');
    message.hidden = false;
  };
  const fillStudent = () => {
    document.getElementById('full-name').value = session.user.fullName || '';
    document.getElementById('student-id').value = session.user.studentId || '';
    document.getElementById('student-email').value = session.user.email || '';
  };
  document.querySelectorAll('.current-year').forEach(element => {
    element.textContent = new Date().getFullYear();
  });
  submit.disabled = true;
  clubs.replaceChildren(new Option('Loading clubs...', ''));
  try {
    session = await window.sportshubAuth.session();
    if (!session.authenticated) {
      window.location.replace('../login/login.html');
      return;
    }
    fillStudent();
    const response = await fetch(clubListEndpoint, { cache: 'no-store' });
    const result = await response.json();
    if (!response.ok || result.success !== true || !Array.isArray(result.records)) {
      throw new Error(result.message || 'Clubs could not be loaded.');
    }
    clubs.replaceChildren(new Option('Select a club', ''));
    result.records.forEach(club => clubs.add(new Option(club.name, club.id)));
    const requestedClub = new URLSearchParams(window.location.search).get('club');
    if (result.records.some(club => club.id === requestedClub)) clubs.value = requestedClub;
    if (!result.records.length) throw new Error('No active clubs are accepting applications yet.');
    submit.disabled = false;
  } catch (error) {
    showMessage(error.message || 'Unable to connect to SportsHub.', true);
  }

  form.addEventListener('reset', () => {
    setTimeout(() => { if (session) fillStudent(); }, 0);
    message.hidden = true;
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!session || !form.reportValidity()) return;
    submit.disabled = true;
    try {
      const current = await window.sportshubAuth.session();
      if (!current.authenticated) {
        window.location.assign('../login/login.html');
        return;
      }
      const response = await fetch(clubApplicationEndpoint, {
        method: 'POST', credentials: 'same-origin', cache: 'no-store',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': current.csrfToken },
        body: JSON.stringify({
          clubId: clubs.value,
          faculty: document.getElementById('faculty').value,
          academicYear: document.getElementById('study-year').value,
          experience: document.getElementById('experience').value,
          notes: document.getElementById('notes').value.trim()
        })
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) throw new Error(result.message || 'Your application could not be saved.');
      form.reset();
      showMessage(result.message);
    } catch (error) {
      showMessage(error.message || 'Unable to connect to SportsHub.', true);
    } finally {
      submit.disabled = false;
    }
  });
});
