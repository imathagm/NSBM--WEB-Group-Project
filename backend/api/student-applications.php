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
        $_SESSION = [];
        auth_respond(401, ['success' => false, 'message' => 'Sign in to view your applications.']);
    }

    $statement = $pdo->prepare(
        "SELECT 'Club' AS applicationType, club AS itemName,
                DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') AS submittedAt,
                status, notes AS message,
                DATE_FORMAT(reviewed_at, '%Y-%m-%d %H:%i') AS reviewedAt
         FROM sportshub_membership_applications
         WHERE user_id = :club_user_id
            OR (user_id IS NULL AND student_id = :club_student_id)
         UNION ALL
         SELECT 'Tournament' AS applicationType, tournament_name AS itemName,
                DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') AS submittedAt,
                status, NULL AS message,
                DATE_FORMAT(reviewed_at, '%Y-%m-%d %H:%i') AS reviewedAt
         FROM sportshub_tournament_registrations
         WHERE user_id = :tournament_user_id
            OR (user_id IS NULL AND student_id = :tournament_student_id)
         UNION ALL
         SELECT 'Match' AS applicationType, match_name AS itemName,
                DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') AS submittedAt,
                status, NULL AS message,
                DATE_FORMAT(reviewed_at, '%Y-%m-%d %H:%i') AS reviewedAt
         FROM sportshub_match_registrations
         WHERE user_id = :match_user_id
            OR (user_id IS NULL AND student_id = :match_student_id)
         ORDER BY submittedAt DESC"
    );
    $studentId = (string) $user['student_id'];
    $statement->execute([
        'club_user_id' => $userId,
        'club_student_id' => $studentId,
        'tournament_user_id' => $userId,
        'tournament_student_id' => $studentId,
        'match_user_id' => $userId,
        'match_student_id' => $studentId,
    ]);

    auth_respond(200, ['success' => true, 'records' => $statement->fetchAll()]);
} catch (Throwable $error) {
    error_log('Student application lookup failed: ' . $error->getMessage());
    auth_respond(503, [
        'success' => false,
        'message' => 'Your applications are temporarily unavailable.',
    ]);
}
