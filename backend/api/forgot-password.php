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

$email = is_array($input)
    ? trim((string)($input['email'] ?? ''))
    : '';

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

    require_once __DIR__ . '/../config/database.php';

    $pdo = sportshubDatabaseConnection();

    $stmt = $pdo->prepare(
        'SELECT user_id, email
         FROM sportshub_users
         WHERE email = :email
         LIMIT 1'
    );

    $stmt->execute([
        'email' => strtolower($email)
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
         SET used_at = NOW()
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
             DATE_ADD(NOW(),INTERVAL 30 MINUTE))'
    );

    $insert->execute([
        'user_id' => $user['user_id'],
        'token_hash' => $tokenHash
    ]);

    $pdo->commit();

    $mailConfigPath =
        __DIR__ . '/../config/mail-config.php';

    $autoloadPath =
        __DIR__ . '/../vendor/autoload.php';

    if (
        !is_file($mailConfigPath)
        || !is_file($autoloadPath)
    ) {
        error_log('Password recovery email is not configured.');

        respond(500, [
            'success' => false,
            'message' => 'Email service is not configured.'
        ]);
    }

    $mailConfig = require $mailConfigPath;

    $baseUrl = rtrim(
        (string)($mailConfig['app_base_url'] ?? ''),
        '/'
    );

    if ($baseUrl === '') {
        respond(500, [
            'success' => false,
            'message' => 'Reset URL is not configured.'
        ]);
    }

    $resetUrl =
        $baseUrl
        . '/frontend/pages/reset-password.html?token='
        . rawurlencode($rawToken);

    require_once $autoloadPath;

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