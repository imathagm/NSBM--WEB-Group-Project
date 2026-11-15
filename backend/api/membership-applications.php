<?php
declare(strict_types=1);

require_once __DIR__ . '/auth/common.php';

if (empty($_SESSION['student_id'])) {
    auth_respond(401, ['success' => false, 'message' => 'Student sign-in is required.']);
}

auth_require_method('POST');
auth_require_csrf();
$input = auth_read_json();

foreach (array_keys($input) as $key) {
    if (!in_array($key, ['clubId', 'message'], true)) {
        auth_respond(400, ['success' => false, 'message' => 'The application contains an unsupported field.']);
    }
}

$clubId = $input['clubId'] ?? null;
$message = $input['message'] ?? '';
if (!is_string($clubId) || !preg_match('/\A[a-f0-9-]{36}\z/i', $clubId)) {
    auth_respond(400, ['success' => false, 'message' => 'Choose a valid sports club.']);
}
if (!is_string($message)) {
    auth_respond(400, ['success' => false, 'message' => 'The application message must be plain text.']);
}
$message = trim($message);
$messageLength = preg_match_all('/./us', $message);
if ($messageLength === false || $messageLength > 1000) {
    auth_respond(400, ['success' => false, 'message' => 'The application message must be 1,000 characters or fewer.']);
}

try {
    $pdo = sportshubDatabaseConnection();
    $user = auth_user($pdo, (int) $_SESSION['student_id']);
    if ($user === null) {
        $_SESSION = [];
        auth_respond(401, ['success' => false, 'message' => 'Student account is no longer available.']);
    }
    if (empty($user['full_name']) || empty($user['student_id'])) {
        auth_respond(409, ['success' => false, 'message' => 'Complete your student name and ID before applying to a club.']);
    }

    $pdo->beginTransaction();
    $clubLookup = $pdo->prepare(
        "SELECT id, name
         FROM sportshub_clubs
         WHERE id = :club_id AND status = 'Active'
         FOR UPDATE"
    );
    $clubLookup->execute(['club_id' => $clubId]);
    $club = $clubLookup->fetch();
    if ($club === false) {
        $pdo->rollBack();
        auth_respond(404, ['success' => false, 'message' => 'That club is no longer available for applications.']);
    }

    $duplicateLookup = $pdo->prepare(
        'SELECT id
         FROM sportshub_membership_applications
         WHERE (user_id = :user_id AND club_id = :club_id)
            OR (student_id = :student_id AND club = :club_name)
         LIMIT 1'
    );
    $duplicateLookup->execute([
        'user_id' => $user['user_id'],
        'club_id' => $club['id'],
        'student_id' => $user['student_id'],
        'club_name' => $club['name'],
    ]);
    if ($duplicateLookup->fetchColumn() !== false) {
        $pdo->rollBack();
        auth_respond(409, ['success' => false, 'message' => 'You already have an application for this club.']);
    }

    $insert = $pdo->prepare(
        'INSERT INTO sportshub_membership_applications
            (id, user_id, club_id, student_name, student_id, club, submitted_on, status, notes)
         VALUES
            (:id, :user_id, :club_id, :student_name, :student_id, :club, CURRENT_DATE(), \'Pending\', :notes)'
    );
    $insert->execute([
        'id' => auth_uuid(),
        'user_id' => $user['user_id'],
        'club_id' => $club['id'],
        'student_name' => $user['full_name'],
        'student_id' => $user['student_id'],
        'club' => $club['name'],
        'notes' => $message === '' ? null : $message,
    ]);
    $pdo->commit();

    auth_respond(201, [
        'success' => true,
        'message' => 'Your club application has been submitted.',
    ]);
} catch (PDOException $error) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    if ($error->getCode() === '23000') {
        auth_respond(409, ['success' => false, 'message' => 'You already have an application for this club.']);
    }
    error_log('Student club application failed: ' . $error->getMessage());
    auth_respond(503, ['success' => false, 'message' => 'The club application service is temporarily unavailable.']);
} catch (Throwable $error) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('Student club application failed: ' . $error->getMessage());
    auth_respond(500, ['success' => false, 'message' => 'The club application could not be completed.']);
}
