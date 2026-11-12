<?php
declare(strict_types=1);

require_once __DIR__ . '/auth/common.php';
auth_require_method('GET');

try {
    $pdo = sportshubDatabaseConnection();
    if (empty($_SESSION['student_id']) && !empty($_COOKIE['nsbm_remember'])) {
        restore_student_session($pdo);
    }

    $userId = (int) ($_SESSION['student_id'] ?? 0);
    $user = $userId > 0 ? auth_user($pdo, $userId) : null;
    if ($user === null) {
        auth_respond(401, ['success' => false, 'message' => 'Sign in to view student announcements.']);
    }

    $statement = $pdo->prepare(
        "SELECT id, title, content,
                DATE_FORMAT(COALESCE(publish_date, created_at), '%Y-%m-%d') AS publishedDate
         FROM sportshub_announcements
         WHERE status = 'Published'
           AND (publish_date IS NULL OR publish_date <= CURRENT_DATE())
           AND (
               audience = 'All students'
               OR (
                   audience = 'Club members'
                   AND EXISTS (
                       SELECT 1
                       FROM sportshub_membership_applications AS application
                       JOIN sportshub_users AS student
                         ON student.student_id = application.student_id
                       WHERE student.user_id = :user_id
                         AND application.status = 'Approved'
                   )
               )
           )
         ORDER BY COALESCE(publish_date, DATE(created_at)) DESC, created_at DESC"
    );
    $statement->execute(['user_id' => $userId]);

    auth_respond(200, [
        'success' => true,
        'announcements' => $statement->fetchAll(),
    ]);
} catch (Throwable $error) {
    error_log('Student announcement lookup failed: ' . $error->getMessage());
    auth_respond(503, [
        'success' => false,
        'message' => 'Announcements are temporarily unavailable.',
    ]);
}
