<?php
declare(strict_types=1);
require_once __DIR__ . '/../../backend/config/auth.php';
$pageTitle = 'Reset password';
$pageDescription = 'Create a new password. Reset links are valid for one hour.';
$token = isset($_GET['token']) && is_string($_GET['token']) ? $_GET['token'] : '';
require __DIR__ . '/layout-start.php';
?>
      <?php if (preg_match('/\A[a-f0-9]{64}\z/', $token)): ?>
        <form class="portal-form" method="post" action="actions.php">
          <input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">
          <input type="hidden" name="action" value="reset_password">
          <input type="hidden" name="token" value="<?= e($token) ?>">
          <label class="field">New password
            <input name="password" type="password" minlength="8" maxlength="72" autocomplete="new-password" required>
            <small>Use at least 8 characters (maximum 72 bytes).</small>
          </label>
          <label class="field">Confirm new password
            <input name="confirm_password" type="password" minlength="8" maxlength="72" autocomplete="new-password" required>
          </label>
          <button class="submit-button" type="submit">Save new password <span aria-hidden="true">→</span></button>
        </form>
      <?php else: ?>
        <div class="notice error" role="alert">This reset link is invalid. Request a new password reset.</div>
        <a class="text-link" href="forgot-password.php">Request a reset link</a>
      <?php endif; ?>
    <?php require __DIR__ . '/layout-end.php'; ?>
