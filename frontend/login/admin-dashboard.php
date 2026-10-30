<?php
declare(strict_types=1);
require_once __DIR__ . '/../../backend/config/auth.php';
require_admin();
$pageTitle = 'Admin Dashboard';
$pageDescription = 'Administrator access is active.';
require __DIR__ . '/layout-start.php';
?>
      <div class="profile-card">
        <span class="eyebrow">AUTHORIZED AREA</span>
        <h3>NSBM Sports Hub Administration</h3>
        <p>Your administrator session is active. Use the site administration tools available to your account.</p>
      </div>
      <form method="post" action="actions.php">
        <input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">
        <input type="hidden" name="action" value="admin_logout">
        <button class="submit-button secondary-button" type="submit">Sign out</button>
      </form>
    <?php require __DIR__ . '/layout-end.php'; ?>
