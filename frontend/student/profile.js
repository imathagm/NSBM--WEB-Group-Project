document.addEventListener('DOMContentLoaded', () => {
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
  if (!form) return;

  const storageKey = 'sportshub-student-profile';
  const fullName = document.getElementById('profileFullName');
  const email = document.getElementById('profileEmail');
  const contact = document.getElementById('profileContact');
  const sport = document.getElementById('profileSport');
  const photoInput = document.getElementById('profilePhotoInput');
  const photoControl = document.querySelector('.profile-photo-control');
  const photo = document.getElementById('profilePhoto');
  const avatar = document.getElementById('profileAvatar');
  const displayName = document.getElementById('profileDisplayName');
  const editButton = document.getElementById('profileEditButton');
  const saveButton = document.getElementById('profileSaveButton');
  const cancelButton = document.getElementById('profileCancelButton');
  const message = document.getElementById('profileMessage');
  const editableFields = [fullName, email, contact, sport];
  const allowedSports = new Set(Array.from(sport.options, (option) => option.value));

  let savedProfile = {
    fullName: fullName.value,
    email: email.value,
    contact: contact.value,
    sport: sport.value,
    photo: ''
  };
  let pendingPhoto = '';

  function showMessage(text, type = '') {
    message.textContent = text;
    message.classList.toggle('is-success', type === 'success');
    message.classList.toggle('is-error', type === 'error');
  }

  function renderProfile(profile) {
    fullName.value = profile.fullName;
    email.value = profile.email;
    contact.value = profile.contact;
    sport.value = profile.sport;
    displayName.textContent = profile.fullName;
    avatar.textContent = profile.fullName.trim().charAt(0).toUpperCase() || 'S';
    photo.hidden = !profile.photo;
    avatar.hidden = Boolean(profile.photo);
    if (profile.photo) photo.src = profile.photo;
  }

  function setEditing(enabled) {
    editableFields.forEach((field) => { field.disabled = !enabled; });
    photoInput.disabled = !enabled;
    photoControl.hidden = !enabled;
    editButton.hidden = enabled;
    saveButton.hidden = !enabled;
    cancelButton.hidden = !enabled;
  }

  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const profile = JSON.parse(stored);
      if (
        typeof profile.fullName === 'string' &&
        typeof profile.email === 'string' &&
        typeof profile.contact === 'string' &&
        typeof profile.sport === 'string' &&
        allowedSports.has(profile.sport) &&
        (typeof profile.photo === 'string' || profile.photo === undefined)
      ) {
        savedProfile = { ...savedProfile, ...profile, photo: profile.photo || '' };
      } else {
        showMessage('Saved profile data is invalid. The sample profile is shown.', 'error');
      }
    }
  } catch (error) {
    showMessage('Could not read the saved profile from this browser.', 'error');
  }

  renderProfile(savedProfile);
  setEditing(false);

  editButton.addEventListener('click', () => {
    pendingPhoto = savedProfile.photo;
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

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;
    const normalizedContact = contact.value.replace(/\D/g, '');
    if (normalizedContact.length < 7 || normalizedContact.length > 15) {
      showMessage('Enter a contact number containing 7 to 15 digits.', 'error');
      contact.focus();
      return;
    }

    const profile = {
      fullName: fullName.value.trim(),
      email: email.value.trim(),
      contact: contact.value.trim(),
      sport: sport.value,
      photo: pendingPhoto
    };

    if (!profile.fullName || !profile.email || !allowedSports.has(profile.sport)) {
      showMessage('Review the required profile fields and try again.', 'error');
      return;
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify(profile));
    } catch (error) {
      showMessage('Could not save your changes in this browser. Check available storage and try again.', 'error');
      return;
    }

    savedProfile = profile;
    renderProfile(savedProfile);
    setEditing(false);
    showMessage('Profile updated in this browser. It has not been sent to a university account database.', 'success');
  });

  cancelButton.addEventListener('click', () => {
    pendingPhoto = savedProfile.photo;
    photoInput.value = '';
    renderProfile(savedProfile);
    setEditing(false);
    showMessage('Changes cancelled.');
  });
});
