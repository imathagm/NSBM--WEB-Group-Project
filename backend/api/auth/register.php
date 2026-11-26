<?php
declare(strict_types=1);

require_once __DIR__ . '/common.php';
auth_require_method('POST');
auth_require_csrf();
$input = auth_read_json();

$fullName = trim((string) ($input['fullName'] ?? ''));
$studentId = trim((string) ($input['studentId'] ?? ''));
$email = strtolower(trim((string) ($input['email'] ?? '')));
$contactNumber = trim((string) ($input['contactNumber'] ?? ''));
$faculty = trim((string) ($input['faculty'] ?? ''));
$degreeProgram = trim((string) ($input['degreeProgram'] ?? ''));
$academicYear = trim((string) ($input['academicYear'] ?? ''));
$sport = trim((string) ($input['sportOfInterest'] ?? ''));
$password = (string) ($input['password'] ?? '');
$allowedSports = [
    'Swimming',
    'Cricket',
    'Tennis',
    'Chess',
    'Table Tennis',
    'Volleyball',
    'Martial Arts',
    'Rugby',
    'Netball',
    'Badminton',
    'Athletics',
    'Calisthenics',
    'Basketball',
    'Hockey',
    'Archery',
    'Powerlifting',
    'Football',
    'Karate'
];
$nameLength = preg_match_all('/./us', $fullName, $matches);
$digitCount = preg_match_all('/[0-9]/', $contactNumber, $matches);

if ($nameLength === false || $nameLength < 2 || $nameLength > 120) {
    auth_respond(400, ['success' => false, 'message' => 'Enter a name between 2 and 120 characters.']);
}
if (!preg_match('/\A[A-Za-z0-9][A-Za-z0-9\/-]{3,22}[A-Za-z0-9]\z/', $studentId)) {
    auth_respond(400, ['success' => false, 'message' => 'Enter a valid student ID (5–24 letters, numbers, slashes, or hyphens).']);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254) {
    auth_respond(400, ['success' => false, 'message' => 'Enter a valid email address.']);
}
if (!preg_match('/\A[+0-9(). -]{7,24}\z/', $contactNumber) || $digitCount === false || $digitCount < 7 || $digitCount > 15) {
    auth_respond(400, ['success' => false, 'message' => 'Enter a valid contact number.']);
}
foreach ([
    'Faculty' => [$faculty, 120],
    'Degree Programme' => [$degreeProgram, 160],
    'Academic Year' => [$academicYear, 40],
] as $label => [$value, $maximum]) {
    $length = preg_match_all('/./us', $value);
    if ($length === false || $length < 2 || $length > $maximum) {
        auth_respond(400, ['success' => false, 'message' => 'Enter a ' . strtolower($label) . ' between 2 and ' . $maximum . ' characters.']);
    }
}
if (!in_array($sport, $allowedSports, true)) {
    auth_respond(400, ['success' => false, 'message' => 'Choose a sport from the list.']);
}
if (!password_meets_policy($password)) {
    auth_respond(400, ['success' => false, 'message' => 'Password must be 8–72 bytes and contain at least 8 characters.']);
}

try {
    $pdo = sportshubDatabaseConnection();
    $pdo->beginTransaction();
    $insert = $pdo->prepare(
        'INSERT INTO sportshub_users
         (full_name, student_id, email, contact_number, sport_of_interest,
          faculty, degree_program, academic_year, password_hash)
         VALUES (:full_name, :student_id, :email, :contact_number, :sport,
                 :faculty, :degree_program, :academic_year, :password_hash)'
    );
    $insert->execute([
        'full_name' => $fullName,
        'student_id' => $studentId,
        'email' => $email,
        'contact_number' => $contactNumber,
        'sport' => $sport,
        'faculty' => $faculty,
        'degree_program' => $degreeProgram,
        'academic_year' => $academicYear,
        'password_hash' => password_hash($password, PASSWORD_DEFAULT),
    ]);

    $user = auth_user($pdo, (int) $pdo->lastInsertId());
    if ($user === null) {
        throw new RuntimeException('New student account could not be reloaded.');
    }

    $existingDirectoryRecord = $pdo->prepare(
        'SELECT id FROM admin_students WHERE student_id = :student_id LIMIT 1'
    );
    $existingDirectoryRecord->execute(['student_id' => $studentId]);
    $directoryId = $existingDirectoryRecord->fetchColumn();
    if ($directoryId === false) {
        $directory = $pdo->prepare(
            'INSERT INTO admin_students (id, user_id, name, student_id, email, faculty, batch)
             VALUES (:id, :user_id, :name, :student_id, :email, :faculty, :batch)'
        );
        $directory->execute([
            'id' => auth_uuid(),
            'user_id' => $user['user_id'],
            'name' => $fullName,
            'student_id' => $studentId,
            'email' => $email,
            'faculty' => $faculty,
            'batch' => $academicYear,
        ]);
    } else {
        $directory = $pdo->prepare(
            'UPDATE admin_students
             SET user_id = :user_id, name = :name, email = :email,
                 faculty = :faculty, batch = :batch
             WHERE id = :id'
        );
        $directory->execute([
            'user_id' => $user['user_id'],
            'name' => $fullName,
            'email' => $email,
            'faculty' => $faculty,
            'batch' => $academicYear,
            'id' => $directoryId,
        ]);
    }
    $pdo->commit();

    auth_create_student_session($pdo, $user, false);
    auth_respond(201, [
        'success' => true,
        'message' => 'Your account has been created.',
        'authenticated' => true,
        'csrfToken' => csrf_token(),
        'user' => auth_public_user($user),
    ]);
} catch (PDOException $error) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    if ($error->getCode() === '23000') {
        auth_respond(409, [
            'success' => false,
            'message' => 'That email address or student ID is already registered.',
        ]);
    }
    error_log('Student registration failed: ' . $error->getMessage());
    auth_respond(503, ['success' => false, 'message' => 'Registration is temporarily unavailable.']);
} catch (Throwable $error) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('Student registration failed: ' . $error->getMessage());
    auth_respond(500, ['success' => false, 'message' => 'Registration could not be completed.']);
}
