<?php
declare(strict_types=1);

require_once __DIR__ . '/database.php';

function start_portal_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

function e(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function password_meets_policy(string $password, int $minimumCharacters = 8): bool
{
    if (strlen($password) > 72) {
        return false;
    }

    $characterCount = preg_match_all('/./us', $password, $matches);
    return $characterCount !== false && $characterCount >= $minimumCharacters;
}

function csrf_token(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verify_csrf(): bool
{
    return isset($_POST['csrf_token'], $_SESSION['csrf_token'])
        && is_string($_POST['csrf_token'])
        && hash_equals($_SESSION['csrf_token'], $_POST['csrf_token']);
}

function set_flash(string $message, string $type = 'success'): void
{
    $_SESSION['flash'] = ['message' => $message, 'type' => $type];
}

function take_flash(): ?array
{
    $flash = $_SESSION['flash'] ?? null;
    unset($_SESSION['flash']);
    return is_array($flash) ? $flash : null;
}

function set_portal_cookie(string $name, string $value, int $expires): void
{
    setcookie($name, $value, [
        'expires' => $expires,
        'path' => '/',
        'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
}

function restore_student_session(PDO $pdo): void
{
    if (isset($_SESSION['student_id']) || empty($_COOKIE['nsbm_remember'])) {
        return;
    }

    $remember = $_COOKIE['nsbm_remember'];
    if (!is_string($remember) || !preg_match('/\A[a-f0-9]{64}\z/', $remember)) {
        set_portal_cookie('nsbm_remember', '', time() - 3600);
        return;
    }

    $hash = hash('sha256', $remember);
    $query = $pdo->prepare(
        'SELECT student_id FROM student_remember_tokens
         WHERE token_hash = :token_hash AND expires_at > UTC_TIMESTAMP()'
    );
    $query->execute(['token_hash' => $hash]);
    $studentId = $query->fetchColumn();
    if ($studentId === false) {
        set_portal_cookie('nsbm_remember', '', time() - 3600);
        return;
    }

    $replacement = bin2hex(random_bytes(32));
    $update = $pdo->prepare(
        'UPDATE student_remember_tokens
         SET token_hash = :new_hash, expires_at = DATE_ADD(UTC_TIMESTAMP(), INTERVAL 30 DAY)
         WHERE token_hash = :old_hash'
    );
    $update->execute([
        'new_hash' => hash('sha256', $replacement),
        'old_hash' => $hash,
    ]);
    session_regenerate_id(true);
    $_SESSION['student_id'] = (int) $studentId;
    set_portal_cookie('nsbm_remember', $replacement, time() + 60 * 60 * 24 * 30);
}

function require_student(): void
{
    start_portal_session();
    restore_student_session(database());

    if (empty($_SESSION['student_id'])) {
        header('Location: login.php');
        exit;
    }
}

function require_admin(): void
{
    start_portal_session();
    if (empty($_SESSION['admin_id'])) {
        header('Location: admin.php');
        exit;
    }
}

start_portal_session();
