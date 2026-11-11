<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/auth/common.php';

function admin_require_session(): void
{
    if (empty($_SESSION['admin_id'])) {
        auth_respond(401, ['success' => false, 'message' => 'Administrator sign-in is required.']);
    }
}

function admin_uuid(): string
{
    return auth_uuid();
}
