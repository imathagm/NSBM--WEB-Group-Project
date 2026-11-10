// NSBM SportsHub password recovery - frontend demonstration.
// To enable real password-reset emails, provide a secure backend endpoint.
// Example: const RESET_ENDPOINT = '/api/auth/forgot-password';
const RESET_ENDPOINT = '';

const form = document.getElementById('forgotPasswordForm');
const emailInput = document.getElementById('email');
const formMessage = document.getElementById('formMessage');
const resetButton = document.getElementById('resetButton');
const buttonText = document.getElementById('buttonText');

function showMessage(message, kind) {
  formMessage.textContent = message;
  formMessage.className = kind ? `form-message ${kind}` : 'form-message';
}

emailInput.addEventListener('input', function () {
  emailInput.removeAttribute('aria-invalid');
  showMessage('', '');
});

form.addEventListener('submit', async function (event) {
  event.preventDefault();
  showMessage('', '');
  emailInput.value = emailInput.value.trim();

  if (!emailInput.validity.valid) {
    emailInput.setAttribute('aria-invalid', 'true');
    showMessage(emailInput.validity.valueMissing
      ? 'Please enter your registered email address.'
      : 'Please enter a valid email address, such as student@example.com.', 'error');
    emailInput.focus();
    return;
  }

  // Frontend-only version does not pretend to email the user.
  if (!RESET_ENDPOINT) {
    showMessage('Email format verified. This is a student project demo, so no password-reset email was sent. Connect a secure backend to enable email delivery.', 'info');
    return;
  }

  resetButton.disabled = true;
  buttonText.textContent = 'Submitting...';

  try {
    const response = await fetch(RESET_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailInput.value })
    });

    if (!response.ok) throw new Error('Reset request failed');

    // Generic response prevents account enumeration.
    showMessage('If an account exists for this email, you will receive a password-reset link shortly. Check your inbox and spam folder.', 'success');
    form.reset();
  } catch (error) {
    showMessage('Unable to request a reset link right now. Please try again later.', 'error');
  } finally {
    resetButton.disabled = false;
    buttonText.textContent = 'Request Reset Link';
  }
});
