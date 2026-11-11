<?php
declare(strict_types=1);

require_once __DIR__ . '/common.php';
auth_require_method('POST');
auth_require_csrf();
$input = auth_read_json();

$email = strtolower(trim((string) ($input['email'] ?? '')));
$password = (string) ($input['password'] ?? '');
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254 || $password === '' || strlen($password) > 72) {
    auth_respond(400, ['success' => false, 'message' => 'Enter a valid administrator email and password.']);
}

try {
    $pdo = sportshubDatabaseConnection();
    $statement = $pdo->prepare(
        'SELECT admin_id, full_name, email, password_hash
         FROM administrators
         WHERE email = :email
         LIMIT 1'
    );
    $statement->execute(['email' => $email]);
    $admin = $statement->fetch();

    if ($admin === false || !password_verify($password, $admin['password_hash'])) {
        auth_respond(401, ['success' => false, 'message' => 'Administrator email or password is incorrect.']);
    }

    if (password_needs_rehash($admin['password_hash'], PASSWORD_DEFAULT)) {
        $update = $pdo->prepare(
            'UPDATE administrators SET password_hash = :password_hash WHERE admin_id = :admin_id'
        );
        $update->execute([
            'password_hash' => password_hash($password, PASSWORD_DEFAULT),
            'admin_id' => $admin['admin_id'],
        ]);
    }

    session_regenerate_id(true);
    $_SESSION = [];
    $_SESSION['admin_id'] = (int) $admin['admin_id'];
    $_SESSION['admin_name'] = $admin['full_name'];
    $_SESSION['admin_email'] = $admin['email'];
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));

    auth_respond(200, [
        'success' => true,
        'message' => 'Signed in successfully.',
        'authenticated' => true,
        'csrfToken' => csrf_token(),
    ]);
} catch (Throwable $error) {
    error_log('Administrator sign-in failed: ' . $error->getMessage());
    auth_respond(503, ['success' => false, 'message' => 'Administrator sign-in is temporarily unavailable.']);
}
