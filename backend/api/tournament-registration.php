<?php
declare(strict_types=1);

require_once __DIR__ . '/auth/common.php';
auth_require_method('POST');
auth_require_csrf();

if (empty($_SESSION['student_id'])) {
    auth_respond(401, ['success' => false, 'message' => 'Sign in with your student account before registering.']);
}

$input = auth_read_json();
$tournaments = [
    'nsbm-t20' => ['name' => 'NSBM T20 League', 'deadline' => '2026-11-20'],
    'inter-faculty-cup' => ['name' => 'Inter-Faculty Cup', 'deadline' => '2026-11-24'],
    'badminton-cup' => ['name' => 'Inter-University Badminton Cup', 'deadline' => '2026-11-07'],
    'basketball-cup' => ['name' => 'University Basketball Challenge', 'deadline' => '2026-11-14'],
    'volleyball-cup' => ['name' => 'University Volleyball Trophy', 'deadline' => '2026-11-16'],
    'netball-cup' => ['name' => 'Inter-University Netball Cup', 'deadline' => '2026-11-18'],
    'table-tennis-cup' => ['name' => 'Inter-University Table Tennis Cup', 'deadline' => '2026-11-20'],
    'karate-open' => ['name' => 'Open Karate Championship', 'deadline' => '2026-11-22'],
];
$tournamentId = (string) ($input['tournamentId'] ?? '');
if (!isset($tournaments[$tournamentId])) {
    auth_respond(400, ['success' => false, 'message' => 'Choose a valid tournament.']);
}
$today = (new DateTimeImmutable('now', new DateTimeZone('Asia/Colombo')))->format('Y-m-d');
if ($today > $tournaments[$tournamentId]['deadline']) {
    auth_respond(400, ['success' => false, 'message' => 'The registration deadline for this tournament has passed.']);
}

try {
    $pdo = sportshubDatabaseConnection();
    $student = $pdo->prepare(
        'SELECT full_name, student_id, email, faculty, academic_year
         FROM sportshub_users WHERE user_id = :user_id LIMIT 1'
    );
    $student->execute(['user_id' => (int) $_SESSION['student_id']]);
    $account = $student->fetch();
    if ($account === false) {
        auth_respond(401, ['success' => false, 'message' => 'Student account is no longer available.']);
    }

    $providedId = strtolower(trim((string) ($input['studentId'] ?? '')));
    $providedEmail = strtolower(trim((string) ($input['email'] ?? '')));
    if ($providedId !== strtolower((string) $account['student_id'])
        || $providedEmail !== strtolower((string) $account['email'])
        || trim((string) ($input['fullName'] ?? '')) !== (string) $account['full_name']) {
        auth_respond(403, ['success' => false, 'message' => 'Use the name, student ID, and email on your signed-in account.']);
    }

    $insert = $pdo->prepare(
        'INSERT INTO sportshub_tournament_registrations
         (tournament_id, tournament_name, student_name, student_id, email, faculty, year_of_study)
         VALUES (:tournament_id, :tournament_name, :student_name, :student_id, :email, :faculty, :year_of_study)'
    );
    $insert->execute([
        'tournament_id' => $tournamentId,
        'tournament_name' => $tournaments[$tournamentId]['name'],
        'student_name' => $account['full_name'],
        'student_id' => $account['student_id'],
        'email' => $account['email'],
        'faculty' => $account['faculty'],
        'year_of_study' => $account['academic_year'],
    ]);

    auth_respond(201, [
        'success' => true,
        'message' => 'Your tournament registration has been submitted.',
    ]);
} catch (PDOException $error) {
    if ($error->getCode() === '23000') {
        auth_respond(409, ['success' => false, 'message' => 'You are already registered for this tournament.']);
    }
    error_log('Tournament registration failed: ' . $error->getMessage());
    auth_respond(503, ['success' => false, 'message' => 'Tournament registration is temporarily unavailable.']);
} catch (Throwable $error) {
    error_log('Tournament registration failed: ' . $error->getMessage());
    auth_respond(500, ['success' => false, 'message' => 'The registration could not be completed.']);
}
