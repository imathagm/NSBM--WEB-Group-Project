<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(int $status, array $data): never
{
    http_response_code($status);

    echo json_encode($data);

    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {

    header('Allow: POST');

    respond(405, [
        'success' => false,
        'message' => 'Method not allowed.'
    ]);
}

$input = json_decode(
    file_get_contents('php://input'),
    true
);

$token = is_array($input)
    ? (string)($input['token'] ?? '')
    : '';

$password = is_array($input)
    ? (string)($input['password'] ?? '')
    : '';

if (!preg_match('/^[a-f0-9]{64}$/', $token)) {

    respond(400, [
        'success' => false,
        'message' => 'Invalid or expired reset link.'
    ]);
}

if (strlen($password) < 8 || strlen($password) > 128) {

    respond(400, [
        'success' => false,
        'message' => 'Password must be 8–128 characters.'
    ]);
}

try {

    require_once __DIR__ . '/../config/database.php';

    $pdo = sportshubDatabaseConnection();

    $pdo->beginTransaction();

    $stmt = $pdo->prepare(
        'SELECT reset_id, user_id
         FROM password_reset_tokens
         WHERE token_hash = :token_hash
         AND used_at IS NULL
         AND expires_at > NOW()
         LIMIT 1
         FOR UPDATE'
    );

    $stmt->execute([
        'token_hash' => hash('sha256', $token)
    ]);

    $reset = $stmt->fetch();

    if (!$reset) {

        $pdo->rollBack();

        respond(400, [
            'success' => false,
            'message' => 'Invalid or expired reset link.'
        ]);
    }

    $newHash = password_hash(
        $password,
        PASSWORD_DEFAULT
    );

    $updateUser = $pdo->prepare(
        'UPDATE sportshub_users
         SET password_hash = :password_hash
         WHERE user_id = :user_id'
    );

    $updateUser->execute([
        'password_hash' => $newHash,
        'user_id' => $reset['user_id']
    ]);

    $useToken = $pdo->prepare(
        'UPDATE password_reset_tokens
         SET used_at = NOW()
         WHERE reset_id = :reset_id'
    );

    $useToken->execute([
        'reset_id' => $reset['reset_id']
    ]);

    $invalidateOthers = $pdo->prepare(
        'UPDATE password_reset_tokens
         SET used_at = NOW()
         WHERE user_id = :user_id
         AND used_at IS NULL'
    );

    $invalidateOthers->execute([
        'user_id' => $reset['user_id']
    ]);

    $pdo->commit();

    respond(200, [
        'success' => true,
        'message' => 'Password changed successfully. You can now sign in.'
    ]);

} catch (Throwable $error) {

    if (
        isset($pdo)
        && $pdo instanceof PDO
        && $pdo->inTransaction()
    ) {
        $pdo->rollBack();
    }

    error_log(
        'Password reset failed: '
        . $error->getMessage()
    );

    respond(500, [
        'success' => false,
        'message' => 'Password reset is temporarily unavailable.'
    ]);
}