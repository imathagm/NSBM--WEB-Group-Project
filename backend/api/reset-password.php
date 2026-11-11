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

function read_request_payload(): array
{
    $raw = file_get_contents('php://input');

    if (is_string($raw) && $raw !== '') {
        $decoded = json_decode($raw, true);

        if (is_array($decoded)) {
            return $decoded;
        }

        parse_str($raw, $parsed);

        if (is_array($parsed)) {
            return $parsed;
        }
    }

    return [];
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {

    header('Allow: POST');

    respond(405, [
        'success' => false,
        'message' => 'Method not allowed.'
    ]);
}

$input = read_request_payload();

$token = strtolower(trim((string)($input['token'] ?? '')));
$password = (string)($input['password'] ?? '');

if (!preg_match('/^[a-f0-9]{64}$/', $token)) {

    respond(400, [
        'success' => false,
        'message' => 'Invalid or expired reset link.'
    ]);
}

if (!preg_match('/.{8,}/us', $password) || strlen($password) > 72) {

    respond(400, [
        'success' => false,
        'message' => 'Password must contain at least 8 characters and no more than 72 bytes.'
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
         AND expires_at > UTC_TIMESTAMP()
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

    $deleteRememberTokens = $pdo->prepare(
        'DELETE FROM student_remember_tokens WHERE user_id = :user_id'
    );
    $deleteRememberTokens->execute([
        'user_id' => $reset['user_id']
    ]);

    $useToken = $pdo->prepare(
        'UPDATE password_reset_tokens
         SET used_at = UTC_TIMESTAMP()
         WHERE reset_id = :reset_id'
    );

    $useToken->execute([
        'reset_id' => $reset['reset_id']
    ]);

    $invalidateOthers = $pdo->prepare(
        'UPDATE password_reset_tokens
         SET used_at = UTC_TIMESTAMP()
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