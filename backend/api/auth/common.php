<?php
declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/config/auth.php';

function auth_respond(int $status, array $payload): never
{
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    exit;
}

function auth_require_method(string $method): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== $method) {
        header('Allow: ' . $method);
        auth_respond(405, ['success' => false, 'message' => 'Method not allowed.']);
    }
}

function auth_read_json(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || strlen($raw) > 16384) {
        auth_respond(400, ['success' => false, 'message' => 'Invalid request body.']);
    }

    try {
        $payload = json_decode($raw, true, 16, JSON_THROW_ON_ERROR);
    } catch (JsonException) {
        auth_respond(400, ['success' => false, 'message' => 'Invalid JSON request.']);
    }

    if (!is_array($payload)) {
        auth_respond(400, ['success' => false, 'message' => 'Invalid request body.']);
    }

    return $payload;
}

function auth_require_csrf(): void
{
    $provided = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    $expected = $_SESSION['csrf_token'] ?? '';
    if (!is_string($provided) || !is_string($expected) || $expected === '' || !hash_equals($expected, $provided)) {
        auth_respond(403, ['success' => false, 'message' => 'Refresh the page and try again.']);
    }
}

function auth_user(PDO $pdo, int $userId): ?array
{
    $statement = $pdo->prepare(
        'SELECT user_id, full_name, student_id, email, contact_number, sport_of_interest
         FROM sportshub_users
         WHERE user_id = :user_id
         LIMIT 1'
    );
    $statement->execute(['user_id' => $userId]);
    $user = $statement->fetch();
    return $user === false ? null : $user;
}

function auth_public_user(array $user): array
{
    return [
        'id' => (int) $user['user_id'],
        'fullName' => $user['full_name'],
        'studentId' => $user['student_id'],
        'email' => $user['email'],
        'contactNumber' => $user['contact_number'],
        'sportOfInterest' => $user['sport_of_interest'],
    ];
}

function auth_create_student_session(PDO $pdo, array $user, bool $remember): void
{
    $currentToken = $_COOKIE['nsbm_remember'] ?? '';
    if (is_string($currentToken) && preg_match('/\A[a-f0-9]{64}\z/', $currentToken)) {
        $delete = $pdo->prepare(
            'DELETE FROM student_remember_tokens WHERE token_hash = :token_hash'
        );
        $delete->execute(['token_hash' => hash('sha256', $currentToken)]);
    }

    if ($remember) {
        $token = bin2hex(random_bytes(32));
        $insert = $pdo->prepare(
            'INSERT INTO student_remember_tokens (user_id, token_hash, expires_at)
             VALUES (:user_id, :token_hash, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 30 DAY))'
        );
        $insert->execute([
            'user_id' => $user['user_id'],
            'token_hash' => hash('sha256', $token),
        ]);
        set_portal_cookie('nsbm_remember', $token, time() + 60 * 60 * 24 * 30);
    } else {
        set_portal_cookie('nsbm_remember', '', time() - 3600);
    }

    session_regenerate_id(true);
    $_SESSION = [];
    $_SESSION['student_id'] = (int) $user['user_id'];
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

function auth_clear_remember_cookie(PDO $pdo): void
{
    $token = $_COOKIE['nsbm_remember'] ?? '';
    if (is_string($token) && preg_match('/\A[a-f0-9]{64}\z/', $token)) {
        $delete = $pdo->prepare(
            'DELETE FROM student_remember_tokens WHERE token_hash = :token_hash'
        );
        $delete->execute(['token_hash' => hash('sha256', $token)]);
    }
    set_portal_cookie('nsbm_remember', '', time() - 3600);
}
