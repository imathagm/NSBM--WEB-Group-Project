<?php
declare(strict_types=1);

require_once __DIR__ . '/auth/common.php';
auth_require_method('POST');
auth_require_csrf();
$input = auth_read_json();

if (empty($_SESSION['student_id'])) {
    auth_respond(401, ['success' => false, 'message' => 'Sign in before applying to a club.']);
}

$clubId = trim((string) ($input['clubId'] ?? ''));
$experience = trim((string) ($input['experience'] ?? ''));
$notes = trim((string) ($input['notes'] ?? ''));
$faculty = trim((string) ($input['faculty'] ?? ''));
$academicYear = trim((string) ($input['academicYear'] ?? ''));
$facultyLength = preg_match_all('/./us', $faculty, $matches);
$academicYearLength = preg_match_all('/./us', $academicYear, $matches);
if (!preg_match('/\A[0-9a-f-]{36}\z/i', $clubId)
    || !in_array($experience, ['Beginner', 'Intermediate', 'Experienced'], true)
    || preg_match_all('/./us', $notes) > 500
    || $facultyLength === false || $facultyLength > 120
    || $academicYearLength === false || $academicYearLength > 40) {
    auth_respond(400, ['success' => false, 'message' => 'Choose a club and experience level. Check the length of your profile details and message.']);
}

try {
    $pdo = sportshubDatabaseConnection();
    $pdo->beginTransaction();
    $student = auth_user($pdo, (int) $_SESSION['student_id']);
    if ($student === null) {
        auth_respond(401, ['success' => false, 'message' => 'Your student account is no longer available.']);
    }

    // Lock the club while checking duplicates, so two clicks cannot submit twice.
    $clubQuery = $pdo->prepare("SELECT name FROM sportshub_clubs WHERE id = :id AND status = 'Active' FOR UPDATE");
    $clubQuery->execute(['id' => $clubId]);
    $club = $clubQuery->fetchColumn();
    if ($club === false) {
        auth_respond(400, ['success' => false, 'message' => 'This club is not currently accepting applications.']);
    }
    $existing = $pdo->prepare(
        'SELECT status FROM sportshub_membership_applications WHERE student_id = :student_id AND club = :club LIMIT 1'
    );
    $existing->execute(['student_id' => $student['student_id'], 'club' => $club]);
    if ($existing->fetchColumn() !== false) {
        auth_respond(409, ['success' => false, 'message' => 'You already have an application for this club. Check Applications on your dashboard.']);
    }

    $insert = $pdo->prepare(
        "INSERT INTO sportshub_membership_applications
         (id, user_id, club_id, student_name, student_id, club, submitted_on, status, notes)
         VALUES (:id, :user_id, :club_id, :name, :student_id, :club, CURRENT_DATE(), 'Pending', :notes)"
    );
    $insert->execute([
        'id' => auth_uuid(), 'user_id' => $student['user_id'], 'club_id' => $clubId,
        'name' => $student['full_name'], 'student_id' => $student['student_id'],
        'club' => $club, 'notes' => 'Experience: ' . $experience . ($notes === '' ? '' : "\n" . $notes),
    ]);
    if ($faculty !== '' || $academicYear !== '') {
        $profile = $pdo->prepare(
            "UPDATE sportshub_users SET faculty = COALESCE(NULLIF(:faculty, ''), faculty),
             academic_year = COALESCE(NULLIF(:year, ''), academic_year) WHERE user_id = :id"
        );
        $profile->execute(['faculty' => $faculty, 'year' => $academicYear, 'id' => $student['user_id']]);
        $directory = $pdo->prepare(
            "UPDATE admin_students SET faculty = COALESCE(NULLIF(:faculty, ''), faculty),
             batch = COALESCE(NULLIF(:year, ''), batch) WHERE user_id = :id"
        );
        $directory->execute(['faculty' => $faculty, 'year' => $academicYear, 'id' => $student['user_id']]);
    }
    $pdo->commit();
    auth_respond(201, ['success' => true, 'message' => 'Your application has been sent to the administrators for review.']);
} catch (Throwable $error) {
    if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
    error_log('Club application failed: ' . $error->getMessage());
    auth_respond(503, ['success' => false, 'message' => 'Your application could not be saved. Please try again.']);
}
