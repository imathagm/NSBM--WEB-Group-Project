<?php
declare(strict_types=1);
require_once __DIR__ . '/../../backend/config/auth.php';
$pageTitle = 'Administrator Login';
$pageDescription = 'Restricted access for authorized NSBM Sports Hub administrators.';
require __DIR__ . '/layout-start.php';
?>
      <div class="admin-callout">Administration area · Authorized personnel only</div>
      <form class="portal-form" method="post" action="actions.php" novalidate>
        <input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">
        <input type="hidden" name="action" value="admin_login">
        <label class="field">Administrator email
          <input name="email" type="email" autocomplete="username" maxlength="254">
        </label>
        <label class="field">Password
          <span class="password-field">
            <input name="password" type="password" maxlength="72" autocomplete="current-password">
            <button type="button" class="password-toggle" aria-label="Show password">Show</button>
          </span>
        </label>
        <button class="submit-button" type="submit">Secure administrator sign in <span aria-hidden="true">→</span></button>
        <p class="form-foot"><a class="text-link" href="login.php">Student sign in</a></p>
      </form>
    <?php require __DIR__ . '/layout-end.php'; ?>
