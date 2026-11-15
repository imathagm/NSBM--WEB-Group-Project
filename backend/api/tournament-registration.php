<?php
declare(strict_types=1);

require_once __DIR__ . '/auth/common.php';
auth_require_method('POST');
auth_require_csrf();

if (empty($_SESSION['student_id'])) {
    auth_respond(401, ['success' => false, 'message' => 'Sign in with your student account before registering.']);
}

$input = auth_read_json();
$fixtureId = trim((string) ($input['fixtureId'] ?? $input['tournamentId'] ?? ''));
if (!preg_match('/\A[A-Za-z0-9][A-Za-z0-9_-]{0,63}\z/', $fixtureId)) {
    auth_respond(400, ['success' => false, 'message' => 'Choose a valid match or tournament.']);
}

try {
    $pdo = sportshubDatabaseConnection();

    $eventQuery = $pdo->prepare(
        "SELECT competition, registration_deadline, kind
        
    $tournamentQuery = $pdo->prepare(
        "SELECT competition, registration_deadline, event_date

         FROM sports_fixtures
         WHERE fixture_id = :fixture_id
           AND kind IN ('Tournament', 'Match')
           AND status = 'Scheduled'
         LIMIT 1"
    );
    $eventQuery->execute(['fixture_id' => $fixtureId]);
    $event = $eventQuery->fetch();
    if ($event === false) {
        auth_respond(400, ['success' => false, 'message' => 'Choose a scheduled match or tournament.']);
    }
    if (empty($event['registration_deadline'])) {
        auth_respond(400, ['success' => false, 'message' => 'Registration is unavailable because this event has no deadline.']);
    }
    $today = (new DateTimeImmutable('now', new DateTimeZone('Asia/Colombo')))->format('Y-m-d');

    if ($today > $event['registration_deadline']) {
        auth_respond(400, ['success' => false, 'message' => 'The registration deadline for this event has passed.']);

    if ($today > $tournament['registration_deadline']
        || (!empty($tournament['event_date']) && $today > $tournament['event_date'])) {
        auth_respond(400, ['success' => false, 'message' => 'The registration deadline for this tournament has passed.']);

    }

    $student = $pdo->prepare(
        'SELECT user_id, full_name, student_id, email, faculty, academic_year
         FROM sportshub_users WHERE user_id = :user_id LIMIT 1'
    );
    $student->execute(['user_id' => (int) $_SESSION['student_id']]);
    $account = $student->fetch();
    if ($account === false) {
        auth_respond(401, ['success' => false, 'message' => 'Student account is no longer available.']);
    }

    if (trim((string) $account['full_name']) === '' || trim((string) $account['student_id']) === '') {
        auth_respond(400, ['success' => false, 'message' => 'Complete your student name and ID before registering.']);

    $faculty = trim((string) ($input['faculty'] ?? $account['faculty'] ?? ''));
    $yearOfStudy = trim((string) ($input['yearOfStudy'] ?? $account['academic_year'] ?? ''));
    if (preg_match_all('/./us', $faculty) > 120 || preg_match_all('/./us', $yearOfStudy) > 40) {
        auth_respond(400, ['success' => false, 'message' => 'Faculty or year of study is too long.']);
    }

    $providedId = strtolower(trim((string) ($input['studentId'] ?? '')));
    $providedEmail = strtolower(trim((string) ($input['email'] ?? '')));
    if ($providedId !== strtolower((string) $account['student_id'])
        || $providedEmail !== strtolower((string) $account['email'])
        || trim((string) ($input['fullName'] ?? '')) !== (string) $account['full_name']) {
        auth_respond(403, ['success' => false, 'message' => 'Use the name, student ID, and email on your signed-in account.']);

    }

    if ($event['kind'] === 'Tournament') {
        $insert = $pdo->prepare(
            'INSERT INTO sportshub_tournament_registrations
             (user_id, tournament_id, tournament_name, student_name, student_id, email, faculty, year_of_study)
             VALUES (:user_id, :event_id, :event_name, :student_name, :student_id, :email, :faculty, :year_of_study)'
        );
        $registrationType = 'Tournament';
    } else {
        $insert = $pdo->prepare(
            'INSERT INTO sportshub_match_registrations
             (user_id, fixture_id, match_name, student_name, student_id, email, faculty, year_of_study)
             VALUES (:user_id, :event_id, :event_name, :student_name, :student_id, :email, :faculty, :year_of_study)'
        );
        $registrationType = 'Match';
    }
    $insert->execute([
        'user_id' => (int) $account['user_id'],
        'event_id' => $fixtureId,
        'event_name' => $event['competition'],
        'student_name' => $account['full_name'],
        'student_id' => $account['student_id'],
        'email' => $account['email'],
        'faculty' => $faculty === '' ? null : $faculty,
        'year_of_study' => $yearOfStudy === '' ? null : $yearOfStudy,
    ]);

    auth_respond(201, [
        'success' => true,
        'message' => 'Your ' . strtolower($registrationType) . ' registration has been submitted.',
        'registrationType' => $registrationType,
        'status' => 'Pending',
    ]);
} catch (PDOException $error) {
    if ($error->getCode() === '23000' && (int) ($error->errorInfo[1] ?? 0) === 1062) {
        auth_respond(409, ['success' => false, 'message' => 'You are already registered for this event.']);
    }
    error_log('Student event registration failed: ' . $error->getMessage());
    auth_respond(503, ['success' => false, 'message' => 'Event registration is temporarily unavailable.']);
} catch (Throwable $error) {
    error_log('Student event registration failed: ' . $error->getMessage());
    auth_respond(500, ['success' => false, 'message' => 'The event registration could not be completed.']);
}
