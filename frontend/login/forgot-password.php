<?php
declare(strict_types=1);
require_once __DIR__ . '/../../backend/config/auth.php';
$pageTitle = 'Forgot password';
$pageDescription = 'Enter the email address linked to your student account.';
require __DIR__ . '/layout-start.php';
?>
      <form class="portal-form" method="post" action="actions.php">
        <input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">
        <input type="hidden" name="action" value="forgot_password">
        <label class="field">Student email address
          <input name="email" type="email" autocomplete="email" maxlength="254" required>
        </label>
        <button class="submit-button" type="submit">Send reset instructions <span aria-hidden="true">→</span></button>
        <p class="form-foot"><a class="text-link" href="login.php">Return to sign in</a></p>
      </form>
    <?php require __DIR__ . '/layout-end.php'; ?>
