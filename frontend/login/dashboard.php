<?php
declare(strict_types=1);
require_once __DIR__ . '/../../backend/config/auth.php';
require_student();
$query = database()->prepare('SELECT full_name, student_id, email, sport_of_interest FROM students WHERE id = :id');
$query->execute(['id' => $_SESSION['student_id']]);
$student = $query->fetch();
if (!$student) {
    unset($_SESSION['student_id']);
    header('Location: login.php');
    exit;
}
$pageTitle = 'Student Dashboard';
$pageDescription = 'Your NSBM Sports Hub account overview.';
require __DIR__ . '/layout-start.php';
?>
      <div class="profile-card">
        <span class="eyebrow">WELCOME TO THE TEAM</span>
        <h3><?= e($student['full_name']) ?></h3>
        <dl>
          <div><dt>Student ID</dt><dd><?= e($student['student_id']) ?></dd></div>
          <div><dt>Email</dt><dd><?= e($student['email']) ?></dd></div>
          <div><dt>Sport of interest</dt><dd><?= e($student['sport_of_interest']) ?></dd></div>
        </dl>
      </div>
      <form method="post" action="actions.php">
        <input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">
        <input type="hidden" name="action" value="logout">
        <button class="submit-button secondary-button" type="submit">Sign out</button>
      </form>
    <?php require __DIR__ . '/layout-end.php'; ?>
