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
$email = strtolower(trim((string)($input['email'] ?? $input['identifier'] ?? '')));

if (
    !filter_var($email, FILTER_VALIDATE_EMAIL)
    || strlen($email) > 254
) {
    respond(400, [
        'success' => false,
        'message' => 'Enter a valid email address.'
    ]);
}

try {

    $mailConfigPath = __DIR__ . '/../config/mail-config.php';
    $autoloadPath = __DIR__ . '/../vendor/autoload.php';
    if (!is_file($mailConfigPath) || !is_file($autoloadPath)) {
        throw new RuntimeException('Password recovery mail is not configured.');
    }

    $mailConfig = require $mailConfigPath;
    if (!is_array($mailConfig)) {
        throw new RuntimeException('Password recovery mail configuration is invalid.');
    }
    foreach (['app_base_url', 'host', 'username', 'password', 'from_email', 'from_name', 'port'] as $key) {
        if (!isset($mailConfig[$key]) || trim((string) $mailConfig[$key]) === '') {
            throw new RuntimeException('Password recovery mail configuration is incomplete.');
        }
    }
    $baseUrl = rtrim((string) $mailConfig['app_base_url'], '/');
    if (!filter_var($baseUrl, FILTER_VALIDATE_URL)) {
        throw new RuntimeException('Password recovery URL is invalid.');
    }
    require_once $autoloadPath;

    require_once __DIR__ . '/../config/database.php';

    $pdo = sportshubDatabaseConnection();

    $stmt = $pdo->prepare(
        'SELECT user_id, email
         FROM sportshub_users
         WHERE LOWER(email) = :email
         LIMIT 1'
    );

    $stmt->execute([
        'email' => $email
    ]);

    $user = $stmt->fetch();

    $publicMessage =
        'If an account matches that email address, a reset link will be sent.';

    if (!$user) {

        respond(200, [
            'success' => true,
            'message' => $publicMessage
        ]);
    }

    $rawToken = bin2hex(random_bytes(32));

    $tokenHash = hash('sha256', $rawToken);

    

    $pdo->beginTransaction();

    $invalidate = $pdo->prepare(
        'UPDATE password_reset_tokens
         SET used_at = UTC_TIMESTAMP()
         WHERE user_id = :user_id
         AND used_at IS NULL'
    );

    $invalidate->execute([
        'user_id' => $user['user_id']
    ]);

    $insert = $pdo->prepare(
        'INSERT INTO password_reset_tokens
         (user_id, token_hash, expires_at)
         VALUES (:user_id, :token_hash,
             DATE_ADD(UTC_TIMESTAMP(), INTERVAL 30 MINUTE))'
    );

    $insert->execute([
        'user_id' => $user['user_id'],
        'token_hash' => $tokenHash
    ]);

    $pdo->commit();

    $resetUrl =
        $baseUrl
        . '/frontend/pages/reset-password.html?token='
        . rawurlencode($rawToken);

    $mailer = new PHPMailer\PHPMailer\PHPMailer(true);

    $mailer->isSMTP();

    $mailer->Host = $mailConfig['host'];

    $mailer->SMTPAuth = true;

    $mailer->Username = $mailConfig['username'];

    $mailer->Password = $mailConfig['password'];

    $mailer->SMTPSecure =
        PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;

    $mailer->Port = (int)$mailConfig['port'];

    $mailer->CharSet = 'UTF-8';

    $mailer->setFrom(
        $mailConfig['from_email'],
        $mailConfig['from_name']
    );

    $mailer->addAddress($user['email']);

    $mailer->Subject =
        'Reset your NSBM Sports Hub password';

    $mailer->Body =
        "A password reset was requested for your account.\n\n"
        . "Open this link within 30 minutes:\n"
        . $resetUrl
        . "\n\nIf you did not request this, ignore this email.";

    $mailer->send();

    respond(200, [
        'success' => true,
        'message' => $publicMessage
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
        'Password recovery failed: '
        . $error->getMessage()
    );

    respond(500, [
        'success' => false,
        'message' => 'Password recovery is temporarily unavailable.'
    ]);
}