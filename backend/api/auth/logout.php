<?php
declare(strict_types=1);

require_once __DIR__ . '/common.php';
auth_require_method('POST');
auth_require_csrf();

try {
    $pdo = sportshubDatabaseConnection();
    auth_clear_remember_cookie($pdo);
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $parameters = session_get_cookie_params();
        setcookie(session_name(), '', [
            'expires' => time() - 3600,
            'path' => $parameters['path'],
            'domain' => $parameters['domain'],
            'secure' => $parameters['secure'],
            'httponly' => $parameters['httponly'],
            'samesite' => 'Lax',
        ]);
    }
    session_destroy();
    auth_respond(200, ['success' => true, 'message' => 'Signed out.']);
} catch (Throwable $error) {
    error_log('Student sign-out failed: ' . $error->getMessage());
    auth_respond(503, ['success' => false, 'message' => 'Sign-out is temporarily unavailable.']);
}
