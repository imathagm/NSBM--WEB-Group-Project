<?php
declare(strict_types=1);

require_once __DIR__ . '/common.php';
auth_require_method('GET');

try {
    $user = null;
    if (!empty($_SESSION['student_id'])) {
        $user = auth_user(sportshubDatabaseConnection(), (int) $_SESSION['student_id']);
    } elseif (!empty($_COOKIE['nsbm_remember'])) {
        $pdo = sportshubDatabaseConnection();
        restore_student_session($pdo);
        if (!empty($_SESSION['student_id'])) {
            $user = auth_user($pdo, (int) $_SESSION['student_id']);
        }
    }

    if ($user === null) {
        $_SESSION = [];
        auth_respond(200, [
            'success' => true,
            'authenticated' => false,
            'csrfToken' => csrf_token(),
        ]);
    }

    auth_respond(200, [
        'success' => true,
        'authenticated' => true,
        'csrfToken' => csrf_token(),
        'user' => auth_public_user($user),
    ]);
} catch (Throwable $error) {
    error_log('Student session lookup failed: ' . $error->getMessage());
    auth_respond(503, [
        'success' => false,
        'message' => 'The account service is temporarily unavailable.',
    ]);
}
