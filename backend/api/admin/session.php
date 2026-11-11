<?php
declare(strict_types=1);

require_once __DIR__ . '/common.php';
auth_require_method('GET');

if (empty($_SESSION['admin_id'])) {
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
    'admin' => [
        'id' => (int) $_SESSION['admin_id'],
        'fullName' => (string) ($_SESSION['admin_name'] ?? ''),
        'email' => (string) ($_SESSION['admin_email'] ?? ''),
    ],
]);
