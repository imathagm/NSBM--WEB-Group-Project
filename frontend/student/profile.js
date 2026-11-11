const profileScriptUrl = document.currentScript.src;

document.addEventListener('DOMContentLoaded', async () => {
  const root = document.documentElement;
  const themeButton = document.getElementById('themeToggle');
  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    const dark = theme === 'dark';
    themeButton.innerHTML = dark
      ? '<i class="fas fa-sun" aria-hidden="true"></i>'
      : '<i class="fas fa-moon" aria-hidden="true"></i>';
    themeButton.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  };

  applyTheme(root.getAttribute('data-theme') || 'light');
  themeButton.addEventListener('click', () => {
    const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    try { localStorage.setItem('sportshub-theme', nextTheme); } catch (error) { /* storage blocked */ }
  });

  const form = document.getElementById('profileForm');
  const message = document.getElementById('profileMessage');
  const fullName = document.getElementById('profileFullName');
  const studentId = document.getElementById('profileStudentId');
  const email = document.getElementById('profileEmail');
  const contact = document.getElementById('profileContact');
  const faculty = document.getElementById('profileFaculty');
  const degree = document.getElementById('profileDegree');
  const academicYear = document.getElementById('profileAcademicYear');
  const sport = document.getElementById('profileSport');
  const photoInput = document.getElementById('profilePhotoInput');
  const photoControl = document.querySelector('.profile-photo-control');
  const photo = document.getElementById('profilePhoto');
  const avatar = document.getElementById('profileAvatar');
  const displayName = document.getElementById('profileDisplayName');
  const editButton = document.getElementById('profileEditButton');
  const saveButton = document.getElementById('profileSaveButton');
  const cancelButton = document.getElementById('profileCancelButton');
  const editableFields = [fullName, email, contact, faculty, degree, academicYear, sport];
  const endpoint = new URL('../../backend/api/auth/profile.php', profileScriptUrl);
  let savedProfile = null;
  let pendingPhoto = '';

  function showMessage(text, type = '') {
    message.textContent = text;
    message.classList.toggle('is-success', type === 'success');
    message.classList.toggle('is-error', type === 'error');
  }

  function renderProfile(profile) {
    fullName.value = profile.fullName || '';
    studentId.value = profile.studentId || '';
    email.value = profile.email || '';
    contact.value = profile.contactNumber || '';
    faculty.value = profile.faculty || '';
    degree.value = profile.degreeProgram || '';
    academicYear.value = profile.academicYear || '';
    sport.value = profile.sportOfInterest || '';
    displayName.textContent = profile.fullName || 'Student';
    avatar.textContent = (profile.fullName || 'S').trim().charAt(0).toUpperCase();
    photo.hidden = !profile.profilePhoto;
    avatar.hidden = Boolean(profile.profilePhoto);
    if (profile.profilePhoto) photo.src = profile.profilePhoto;
  }

  function setEditing(enabled) {
    editableFields.forEach((field) => { field.disabled = !enabled; });
    photoInput.disabled = !enabled;
    photoControl.hidden = !enabled;
    editButton.hidden = enabled;
    saveButton.hidden = !enabled;
    cancelButton.hidden = !enabled;
  }

  async function requestProfile(method, payload, csrfToken) {
    const options = {
      method,
      credentials: 'same-origin',
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    };
    if (payload) {
      options.headers['Content-Type'] = 'application/json';
      options.headers['X-CSRF-Token'] = csrfToken;
      options.body = JSON.stringify(payload);
    }
    const response = await fetch(endpoint, options);
    let result;
    try {
      result = await response.json();
    } catch (error) {
      throw new Error('The account service returned an invalid response.');
    }
    if (!response.ok || result.success !== true) {
      if (response.status === 401) window.location.replace('../login/login.html');
      throw new Error(result.message || 'The profile request could not be completed.');
    }
    return result;
  }

  try {
    const session = await window.sportshubAuth.session();
    if (!session.authenticated) {
      window.location.replace('../login/login.html');
      return;
    }
    const result = await requestProfile('GET');
    savedProfile = result.profile;
    pendingPhoto = savedProfile.profilePhoto || '';
    renderProfile(savedProfile);
    setEditing(false);
  } catch (error) {
    showMessage(error.message || 'The profile could not be loaded.', 'error');
    setEditing(false);
    editButton.disabled = true;
  }

  editButton.addEventListener('click', () => {
    pendingPhoto = savedProfile.profilePhoto || '';
    setEditing(true);
    showMessage('');
    fullName.focus();
  });

  photoInput.addEventListener('change', () => {
    const file = photoInput.files[0];
    if (!file) return;
    const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
    if (!allowedTypes.has(file.type)) {
      photoInput.value = '';
      showMessage('Choose a JPG, PNG, or WebP profile photo.', 'error');
      return;
    }
    if (file.size > 1.5 * 1024 * 1024) {
      photoInput.value = '';
      showMessage('Profile photos must be 1.5 MB or smaller.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (typeof reader.result !== 'string') {
        showMessage('The selected photo could not be read.', 'error');
        return;
      }
      pendingPhoto = reader.result;
      photo.src = pendingPhoto;
      photo.hidden = false;
      avatar.hidden = true;
      showMessage('');
    });
    reader.addEventListener('error', () => showMessage('The selected photo could not be read.', 'error'));
    reader.readAsDataURL(file);
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity() || !savedProfile) return;
    const digits = contact.value.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) {
      showMessage('Enter a contact number containing 7 to 15 digits.', 'error');
      contact.focus();
      return;
    }

    saveButton.disabled = true;
    try {
      const session = await window.sportshubAuth.session();
      const result = await requestProfile('PUT', {
        fullName: fullName.value.trim(),
        email: email.value.trim(),
        contactNumber: contact.value.trim(),
        faculty: faculty.value.trim(),
        degreeProgram: degree.value.trim(),
        academicYear: academicYear.value.trim(),
        sportOfInterest: sport.value,
        profilePhoto: pendingPhoto
      }, session.csrfToken);
      if (!result.success) throw new Error(result.message || 'The profile could not be saved.');
      savedProfile = {
        ...savedProfile,
        fullName: fullName.value.trim(),
        email: email.value.trim(),
        contactNumber: contact.value.trim(),
        faculty: faculty.value.trim(),
        degreeProgram: degree.value.trim(),
        academicYear: academicYear.value.trim(),
        sportOfInterest: sport.value,
        profilePhoto: pendingPhoto
      };
      renderProfile(savedProfile);
      setEditing(false);
      showMessage(result.message, 'success');
    } catch (error) {
      showMessage(error.message || 'The profile could not be saved.', 'error');
    } finally {
      saveButton.disabled = false;
    }
  });

  cancelButton.addEventListener('click', () => {
    if (!savedProfile) return;
    pendingPhoto = savedProfile.profilePhoto || '';
    photoInput.value = '';
    renderProfile(savedProfile);
    setEditing(false);
    showMessage('Changes cancelled.');
  });
});
