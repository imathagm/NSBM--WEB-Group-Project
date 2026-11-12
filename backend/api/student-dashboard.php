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
        auth_respond(401, ['success' => false, 'message' => 'Sign in to view your student dashboard.']);
    }

    $applications = $pdo->prepare(
        'SELECT id, student_name AS studentName, student_id AS studentId, club,
                submitted_on AS submittedOn, status, notes
         FROM sportshub_membership_applications
         WHERE student_id = :student_id
         ORDER BY created_at DESC'
    );
    $applications->execute(['student_id' => $user['student_id']]);

    $clubs = $pdo->query(
        "SELECT id, name, sport, coach, venue, description
         FROM sportshub_clubs WHERE status = 'Active' ORDER BY name"
    )->fetchAll();
    $training = $pdo->query(
        "SELECT id, title, club, event_date AS date,
                TIME_FORMAT(start_time, '%H:%i') AS time, venue, coach
         FROM sportshub_training_sessions
         WHERE status = 'Scheduled' AND event_date >= CURRENT_DATE()
         ORDER BY event_date, start_time, title"
    )->fetchAll();
    $events = $pdo->query(
        "SELECT fixture_id AS id, kind, competition AS title, sport, event_date AS date,
                TIME_FORMAT(start_time, '%H:%i') AS time, venue, home_team AS homeClub,
                opponent_name AS opponent, status, result
         FROM sports_fixtures
         WHERE status = 'Scheduled' AND (event_date IS NULL OR event_date >= CURRENT_DATE())
         ORDER BY event_date IS NULL, event_date, start_time, competition"
    )->fetchAll();

    auth_respond(200, [
        'success' => true,
        'clubs' => $clubs,
        'applications' => $applications->fetchAll(),
        'training' => $training,
        'events' => $events,
    ]);
} catch (Throwable $error) {
    error_log('Student dashboard data lookup failed: ' . $error->getMessage());
    auth_respond(503, [
        'success' => false,
        'message' => 'Dashboard records are temporarily unavailable.',
    ]);
}
