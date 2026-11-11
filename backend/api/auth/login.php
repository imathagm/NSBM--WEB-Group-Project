<?php
declare(strict_types=1);

require_once __DIR__ . '/common.php';
auth_require_method('POST');
auth_require_csrf();
$input = auth_read_json();

$identifier = strtolower(trim((string) ($input['identifier'] ?? '')));
$password = (string) ($input['password'] ?? '');
$remember = ($input['remember'] ?? false) === true;

if ($identifier === '' || strlen($identifier) > 254 || $password === '' || strlen($password) > 72) {
    auth_respond(400, ['success' => false, 'message' => 'Enter your email or student ID and password.']);
}

try {
    $pdo = sportshubDatabaseConnection();
    $statement = $pdo->prepare(
        'SELECT user_id, full_name, student_id, email, contact_number, sport_of_interest, password_hash
         FROM sportshub_users
         WHERE LOWER(email) = :email OR LOWER(student_id) = :student_id
         LIMIT 1'
    );
    $statement->execute([
        'email' => $identifier,
        'student_id' => $identifier,
    ]);
    $user = $statement->fetch();

    if ($user === false || !password_verify($password, $user['password_hash'])) {
        auth_respond(401, ['success' => false, 'message' => 'Email/student ID or password is incorrect.']);
    }

    if (password_needs_rehash($user['password_hash'], PASSWORD_DEFAULT)) {
        $update = $pdo->prepare(
            'UPDATE sportshub_users SET password_hash = :password_hash WHERE user_id = :user_id'
        );
        $update->execute([
            'password_hash' => password_hash($password, PASSWORD_DEFAULT),
            'user_id' => $user['user_id'],
        ]);
    }

    auth_create_student_session($pdo, $user, $remember);
    unset($user['password_hash']);
    auth_respond(200, [
        'success' => true,
        'message' => 'Signed in successfully.',
        'authenticated' => true,
        'csrfToken' => csrf_token(),
        'user' => auth_public_user($user),
    ]);
} catch (Throwable $error) {
    error_log('Student sign-in failed: ' . $error->getMessage());
    auth_respond(503, ['success' => false, 'message' => 'Sign-in is temporarily unavailable.']);
}
