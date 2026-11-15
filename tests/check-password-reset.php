<?php
declare(strict_types=1);

// Use the same separate test database and environment as the test PHP server.
if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}
$baseUrl = getenv('SPORTSHUB_TEST_URL');
if (!$baseUrl || !getenv('NSBM_DB_NAME')) {
    fwrite(STDERR, "Set SPORTSHUB_TEST_URL and NSBM_DB_NAME for a separate test database.\n");
    exit(1);
}
require_once __DIR__ . '/../backend/config/database.php';
$pdo = sportshubDatabaseConnection();
$userId = null;

function reset_request(string $baseUrl, string $token, string $password, int $expected): void
{
    $context = stream_context_create(['http' => [
        'method' => 'POST', 'header' => "Content-Type: application/json\r\n",
        'content' => json_encode(['token' => $token, 'password' => $password]),
        'ignore_errors' => true, 'timeout' => 10,
    ]]);
    $body = file_get_contents(rtrim($baseUrl, '/') . '/backend/api/reset-password.php', false, $context);
    preg_match('/\s(\d{3})\s/', $http_response_header[0] ?? '', $matches);
    if ((int) ($matches[1] ?? 0) !== $expected) {
        throw new RuntimeException('Unexpected reset response: ' . $body);
    }
    json_decode((string) $body, true, 16, JSON_THROW_ON_ERROR);
}

try {
    $tag = bin2hex(random_bytes(5));
    $oldPassword = 'OldTestPassword2026!';
    $newPassword = 'NewTestPassword2026!';
    $insert = $pdo->prepare('INSERT INTO sportshub_users (email, password_hash) VALUES (:email, :password)');
    $insert->execute(['email' => 'reset-' . $tag . '@example.test', 'password' => password_hash($oldPassword, PASSWORD_DEFAULT)]);
    $userId = (int) $pdo->lastInsertId();

    $validToken = bin2hex(random_bytes(32));
    $expiredToken = bin2hex(random_bytes(32));
    $otherToken = bin2hex(random_bytes(32));
    $token = $pdo->prepare(
        'INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
         VALUES (:user, :hash, DATE_ADD(UTC_TIMESTAMP(), INTERVAL :minutes MINUTE))'
    );
    foreach ([[$validToken, 30], [$expiredToken, -1], [$otherToken, 30]] as [$raw, $minutes]) {
        $token->execute(['user' => $userId, 'hash' => hash('sha256', $raw), 'minutes' => $minutes]);
    }
    $remember = $pdo->prepare(
        'INSERT INTO student_remember_tokens (user_id, token_hash, expires_at)
         VALUES (:user, :hash, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 30 DAY))'
    );
    $remember->execute(['user' => $userId, 'hash' => hash('sha256', random_bytes(32))]);

    reset_request($baseUrl, $expiredToken, $newPassword, 400);
    echo "PASS expired links are rejected\n";
    reset_request($baseUrl, $validToken, 'short', 400);
    echo "PASS short passwords are rejected\n";
    reset_request($baseUrl, $validToken, $newPassword, 200);
    $query = $pdo->prepare('SELECT password_hash FROM sportshub_users WHERE user_id = :id');
    $query->execute(['id' => $userId]);
    $hash = (string) $query->fetchColumn();
    if (!password_verify($newPassword, $hash) || password_verify($oldPassword, $hash)) {
        throw new RuntimeException('Password did not change correctly.');
    }
    echo "PASS the new password replaces the old password\n";
    reset_request($baseUrl, $validToken, $oldPassword, 400);
    reset_request($baseUrl, $otherToken, $oldPassword, 400);
    echo "PASS used and previous reset links cannot be reused\n";
    $tokens = $pdo->prepare('SELECT COUNT(*) FROM student_remember_tokens WHERE user_id = :id');
    $tokens->execute(['id' => $userId]);
    if ((int) $tokens->fetchColumn() !== 0) throw new RuntimeException('Remembered logins were not revoked.');
    echo "PASS password reset revokes remembered logins\n";
} finally {
    if ($userId !== null) {
        $delete = $pdo->prepare('DELETE FROM sportshub_users WHERE user_id = :id');
        $delete->execute(['id' => $userId]);
    }
}
