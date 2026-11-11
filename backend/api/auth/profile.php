<?php
declare(strict_types=1);

require_once __DIR__ . '/common.php';

if (empty($_SESSION['student_id'])) {
    auth_respond(401, ['success' => false, 'message' => 'Student sign-in is required.']);
}

$userId = (int) $_SESSION['student_id'];
$method = $_SERVER['REQUEST_METHOD'] ?? '';
if ($method === 'GET') {
    try {
        $statement = sportshubDatabaseConnection()->prepare(
            'SELECT full_name, student_id, email, contact_number, sport_of_interest,
                    faculty, degree_program, academic_year, profile_photo
             FROM sportshub_users WHERE user_id = :user_id LIMIT 1'
        );
        $statement->execute(['user_id' => $userId]);
        $profile = $statement->fetch();
        if ($profile === false) {
            $_SESSION = [];
            auth_respond(401, ['success' => false, 'message' => 'Student account is no longer available.']);
        }
        auth_respond(200, [
            'success' => true,
            'profile' => [
                'fullName' => $profile['full_name'],
                'studentId' => $profile['student_id'],
                'email' => $profile['email'],
                'contactNumber' => $profile['contact_number'],
                'sportOfInterest' => $profile['sport_of_interest'],
                'faculty' => $profile['faculty'],
                'degreeProgram' => $profile['degree_program'],
                'academicYear' => $profile['academic_year'],
                'profilePhoto' => $profile['profile_photo'],
            ],
        ]);
    } catch (Throwable $error) {
        error_log('Student profile lookup failed: ' . $error->getMessage());
        auth_respond(503, ['success' => false, 'message' => 'The profile service is temporarily unavailable.']);
    }
}

auth_require_method('PUT');
auth_require_csrf();
$input = auth_read_json(2300000);

$fullName = trim((string) ($input['fullName'] ?? ''));
$email = strtolower(trim((string) ($input['email'] ?? '')));
$contactNumber = trim((string) ($input['contactNumber'] ?? ''));
$sport = trim((string) ($input['sportOfInterest'] ?? ''));
$faculty = trim((string) ($input['faculty'] ?? ''));
$degreeProgram = trim((string) ($input['degreeProgram'] ?? ''));
$academicYear = trim((string) ($input['academicYear'] ?? ''));
$profilePhoto = $input['profilePhoto'] ?? null;
$allowedSports = ['Cricket', 'Football', 'Basketball', 'Volleyball', 'Badminton', 'Other', 'Swimming', 'Athletics', 'Netball', 'Table Tennis', 'Karate'];
$nameLength = preg_match_all('/./us', $fullName);
$digitCount = preg_match_all('/[0-9]/', $contactNumber);

if ($nameLength === false || $nameLength < 2 || $nameLength > 120) {
    auth_respond(400, ['success' => false, 'message' => 'Enter a name between 2 and 120 characters.']);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254) {
    auth_respond(400, ['success' => false, 'message' => 'Enter a valid email address.']);
}
if (!preg_match('/\A[+0-9(). -]{7,24}\z/', $contactNumber) || $digitCount === false || $digitCount < 7 || $digitCount > 15) {
    auth_respond(400, ['success' => false, 'message' => 'Enter a valid contact number.']);
}
if (!in_array($sport, $allowedSports, true)) {
    auth_respond(400, ['success' => false, 'message' => 'Choose a sport from the list.']);
}
foreach ([
    'Faculty' => ['value' => $faculty, 'maximum' => 120],
    'Degree programme' => ['value' => $degreeProgram, 'maximum' => 160],
    'Academic year' => ['value' => $academicYear, 'maximum' => 40],
] as $label => $field) {
    $length = preg_match_all('/./us', $field['value']);
    if ($length === false || $length > $field['maximum']) {
        auth_respond(400, ['success' => false, 'message' => $label . ' is too long.']);
    }
}

if ($profilePhoto !== null && $profilePhoto !== '') {
    if (!is_string($profilePhoto)
        || strlen($profilePhoto) > 2100000
        || !preg_match('/\Adata:image\/(jpeg|png|webp);base64,([A-Za-z0-9+\/=]+)\z/', $profilePhoto, $parts)) {
        auth_respond(400, ['success' => false, 'message' => 'Choose a valid JPG, PNG, or WebP profile photo under 1.5 MB.']);
    }
    $image = base64_decode($parts[2], true);
    $imageInfo = $image === false ? false : getimagesizefromstring($image);
    $allowedMimeTypes = ['jpeg' => 'image/jpeg', 'png' => 'image/png', 'webp' => 'image/webp'];
    if ($image === false || strlen($image) > 1572864 || $imageInfo === false
        || ($imageInfo['mime'] ?? '') !== $allowedMimeTypes[$parts[1]]) {
        auth_respond(400, ['success' => false, 'message' => 'The selected profile photo is invalid or too large.']);
    }
} else {
    $profilePhoto = null;
}

try {
    $pdo = sportshubDatabaseConnection();
    $pdo->beginTransaction();
    $update = $pdo->prepare(
        'UPDATE sportshub_users
         SET full_name = :full_name, email = :email, contact_number = :contact_number,
             sport_of_interest = :sport, faculty = :faculty, degree_program = :degree_program,
             academic_year = :academic_year, profile_photo = :profile_photo
         WHERE user_id = :user_id'
    );
    $update->execute([
        'full_name' => $fullName,
        'email' => $email,
        'contact_number' => $contactNumber,
        'sport' => $sport,
        'faculty' => $faculty === '' ? null : $faculty,
        'degree_program' => $degreeProgram === '' ? null : $degreeProgram,
        'academic_year' => $academicYear === '' ? null : $academicYear,
        'profile_photo' => $profilePhoto,
        'user_id' => $userId,
    ]);
    $directory = $pdo->prepare(
        'UPDATE admin_students
         SET name = :name, email = :email, faculty = :faculty, batch = :batch
         WHERE user_id = :user_id'
    );
    $directory->execute([
        'name' => $fullName,
        'email' => $email,
        'faculty' => $faculty === '' ? null : $faculty,
        'batch' => $academicYear === '' ? null : $academicYear,
        'user_id' => $userId,
    ]);
    $pdo->commit();
    auth_respond(200, ['success' => true, 'message' => 'Profile updated successfully.']);
} catch (PDOException $error) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    if ($error->getCode() === '23000') {
        auth_respond(409, ['success' => false, 'message' => 'That email address is already associated with another account.']);
    }
    error_log('Student profile update failed: ' . $error->getMessage());
    auth_respond(503, ['success' => false, 'message' => 'The profile could not be saved right now.']);
} catch (Throwable $error) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('Student profile update failed: ' . $error->getMessage());
    auth_respond(500, ['success' => false, 'message' => 'The profile could not be saved.']);
}
