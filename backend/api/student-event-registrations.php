<?php
declare(strict_types=1);

require_once __DIR__ . '/auth/common.php';
auth_require_method('GET');

if (empty($_SESSION['student_id'])) {
    auth_respond(401, ['success' => false, 'message' => 'Student sign-in is required.']);
}

try {
    $pdo = sportshubDatabaseConnection();
    $statement = $pdo->prepare(
        "SELECT 'Tournament' AS registrationType,
                tournament_id AS eventId, tournament_name AS eventName,
                student_name AS studentName, student_id AS studentId,
                status, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') AS submittedAt,
                DATE_FORMAT(reviewed_at, '%Y-%m-%d %H:%i') AS reviewedAt
         FROM sportshub_tournament_registrations
         WHERE user_id = :tournament_user_id
         UNION ALL
         SELECT 'Match' AS registrationType,
                fixture_id AS eventId, match_name AS eventName,
                student_name AS studentName, student_id AS studentId,
                status, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') AS submittedAt,
                DATE_FORMAT(reviewed_at, '%Y-%m-%d %H:%i') AS reviewedAt
         FROM sportshub_match_registrations
         WHERE user_id = :match_user_id
         ORDER BY submittedAt DESC"
    );
    $userId = (int) $_SESSION['student_id'];
    $statement->execute([
        'tournament_user_id' => $userId,
        'match_user_id' => $userId,
    ]);
    auth_respond(200, ['success' => true, 'records' => $statement->fetchAll()]);
} catch (Throwable $error) {
    error_log('Student event registration lookup failed: ' . $error->getMessage());
    auth_respond(503, ['success' => false, 'message' => 'Your event registrations are temporarily unavailable.']);
}
