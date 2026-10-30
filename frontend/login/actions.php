<?php
declare(strict_types=1);

require_once __DIR__ . '/../../backend/config/auth.php';

function redirect_to(string $location): void
{
    header('Location: ' . $location);
    exit;
}

function post_value(string $key): string
{
    return isset($_POST[$key]) && is_string($_POST[$key]) ? trim($_POST[$key]) : '';
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !verify_csrf()) {
    set_flash('Your form session expired. Please try again.', 'error');
    redirect_to('login.php');
}

$action = post_value('action');
$pdo = null;

try {
    $pdo = database();

    if ($action === 'register') {
        $name = post_value('full_name');
        $studentId = post_value('student_id');
        $email = strtolower(post_value('email'));
        $phone = post_value('contact_number');
        $sport = post_value('sport_of_interest');
        $password = isset($_POST['password']) && is_string($_POST['password']) ? $_POST['password'] : '';
        $confirmation = isset($_POST['confirm_password']) && is_string($_POST['confirm_password']) ? $_POST['confirm_password'] : '';

        if ($name === '' || strlen($name) > 120 || preg_match('/[\x00-\x1F\x7F]/', $name)
            || $studentId === '' || strlen($studentId) > 40 || preg_match('/[\x00-\x1F\x7F]/', $studentId)
            || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254
            || !preg_match('/\A[+0-9()\s.-]{7,30}\z/', $phone) || $sport === ''
            || !password_meets_policy($password)) {
            set_flash('Please check all fields. Passwords must contain at least 8 characters and no more than 72 bytes.', 'error');
            redirect_to('login.php?view=register');
        }
        if (!hash_equals($password, $confirmation)) {
            set_flash('The passwords do not match.', 'error');
            redirect_to('login.php?view=register');
        }

        $sports = ['Football', 'Cricket', 'Basketball', 'Volleyball', 'Badminton', 'Swimming', 'Athletics', 'Other'];
        if (!in_array($sport, $sports, true)) {
            set_flash('Please select a valid sport.', 'error');
            redirect_to('login.php?view=register');
        }

        try {
            $insert = $pdo->prepare(
                'INSERT INTO students (full_name, student_id, email, contact_number, sport_of_interest, password_hash)
                 VALUES (:name, :student_id, :email, :phone, :sport, :password_hash)'
            );
            $insert->execute([
                'name' => $name,
                'student_id' => $studentId,
                'email' => $email,
                'phone' => $phone,
                'sport' => $sport,
                'password_hash' => password_hash($password, PASSWORD_DEFAULT),
            ]);
        } catch (PDOException $exception) {
            if ($exception->getCode() === '23000') {
                set_flash('That Student ID or email address is already registered.', 'error');
                redirect_to('login.php?view=register');
            }
            throw $exception;
        }

        set_flash('Your account has been created. You can now sign in.');
        redirect_to('login.php');
    }

    if ($action === 'student_login') {
        $identity = post_value('identity');
        $password = isset($_POST['password']) && is_string($_POST['password']) ? $_POST['password'] : '';
        if (strlen($password) > 72) {
            set_flash('Invalid Student ID/email or password.', 'error');
            redirect_to('login.php');
        }
        $lookup = $pdo->prepare(
            'SELECT id, password_hash FROM students WHERE student_id = :student_id OR email = :email LIMIT 1'
        );
        $lookup->execute(['student_id' => $identity, 'email' => strtolower($identity)]);
        $student = $lookup->fetch();
        if (!$student || !password_verify($password, $student['password_hash'])) {
            set_flash('Invalid Student ID/email or password.', 'error');
            redirect_to('login.php');
        }

        session_regenerate_id(true);
        $_SESSION['student_id'] = (int) $student['id'];
        unset($_SESSION['admin_id']);
        if (isset($_COOKIE['nsbm_remember']) && is_string($_COOKIE['nsbm_remember'])
            && preg_match('/\A[a-f0-9]{64}\z/', $_COOKIE['nsbm_remember'])) {
            $revoke = $pdo->prepare('DELETE FROM student_remember_tokens WHERE token_hash = :token_hash');
            $revoke->execute(['token_hash' => hash('sha256', $_COOKIE['nsbm_remember'])]);
        }
        set_portal_cookie('nsbm_remember', '', time() - 3600);
        if (isset($_POST['remember']) && $_POST['remember'] === '1') {
            $token = bin2hex(random_bytes(32));
            $store = $pdo->prepare(
                'INSERT INTO student_remember_tokens (student_id, token_hash, expires_at)
                 VALUES (:student_id, :token_hash, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 30 DAY))'
            );
            $store->execute([
                'student_id' => $student['id'],
                'token_hash' => hash('sha256', $token),
            ]);
            set_portal_cookie('nsbm_remember', $token, time() + 60 * 60 * 24 * 30);
        }
        redirect_to('dashboard.php');
    }

    if ($action === 'admin_login') {
        $email = strtolower(post_value('email'));
        $password = isset($_POST['password']) && is_string($_POST['password']) ? $_POST['password'] : '';
        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $password === '' || strlen($password) > 72) {
            set_flash('Invalid administrator email or password.', 'error');
            redirect_to('admin.php');
        }

        $lookup = $pdo->prepare('SELECT id, password_hash FROM administrators WHERE email = :email LIMIT 1');
        $lookup->execute(['email' => $email]);
        $admin = $lookup->fetch();
        if (!$admin || !password_verify($password, $admin['password_hash'])) {
            set_flash('Invalid administrator email or password.', 'error');
            redirect_to('admin.php');
        }

        if (isset($_COOKIE['nsbm_remember']) && is_string($_COOKIE['nsbm_remember'])
            && preg_match('/\A[a-f0-9]{64}\z/', $_COOKIE['nsbm_remember'])) {
            $revoke = $pdo->prepare('DELETE FROM student_remember_tokens WHERE token_hash = :token_hash');
            $revoke->execute(['token_hash' => hash('sha256', $_COOKIE['nsbm_remember'])]);
        }
        set_portal_cookie('nsbm_remember', '', time() - 3600);
        session_regenerate_id(true);
        unset($_SESSION['student_id']);
        $_SESSION['admin_id'] = (int) $admin['id'];
        redirect_to('admin-dashboard.php');
    }

    if ($action === 'forgot_password') {
        $email = strtolower(post_value('email'));
        if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $lookup = $pdo->prepare('SELECT id FROM students WHERE email = :email LIMIT 1');
            $lookup->execute(['email' => $email]);
            $studentId = $lookup->fetchColumn();
            if ($studentId !== false) {
                $token = bin2hex(random_bytes(32));
                $removePrevious = $pdo->prepare(
                    'DELETE FROM password_reset_tokens WHERE student_id = :student_id'
                );
                $removePrevious->execute(['student_id' => $studentId]);
                $store = $pdo->prepare(
                    'INSERT INTO password_reset_tokens (student_id, token_hash, expires_at)
                     VALUES (:student_id, :token_hash, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 1 HOUR))'
                );
                $store->execute([
                    'student_id' => $studentId,
                    'token_hash' => hash('sha256', $token),
                ]);

                $baseUrl = rtrim((string) getenv('NSBM_APP_BASE_URL'), '/');
                $baseUrlParts = parse_url($baseUrl);
                if ($baseUrl === '' || !filter_var($baseUrl, FILTER_VALIDATE_URL)
                    || !is_array($baseUrlParts)
                    || !in_array($baseUrlParts['scheme'] ?? '', ['http', 'https'], true)
                    || empty($baseUrlParts['host'])
                    || isset($baseUrlParts['user'])
                    || isset($baseUrlParts['pass'])
                    || isset($baseUrlParts['query'])
                    || isset($baseUrlParts['fragment'])) {
                    $delete = $pdo->prepare('DELETE FROM password_reset_tokens WHERE token_hash = :token_hash');
                    $delete->execute(['token_hash' => hash('sha256', $token)]);
                    error_log('NSBM_APP_BASE_URL must be set to send password reset links.');
                } else {
                    $link = $baseUrl . '/login/reset-password.php?token=' . rawurlencode($token);
                    $subject = 'NSBM Sports Hub password reset';
                    $body = "Use this link within one hour to reset your password:\n\n" . $link . "\n\nIf you did not request this, ignore this email.";
                    $headers = "Content-Type: text/plain; charset=UTF-8\r\n";
                    if (!mail($email, $subject, $body, $headers)) {
                        $delete = $pdo->prepare('DELETE FROM password_reset_tokens WHERE token_hash = :token_hash');
                        $delete->execute(['token_hash' => hash('sha256', $token)]);
                        error_log('Failed to send NSBM Sports Hub password reset email.');
                    }
                }
            }
        }
        set_flash('If an account exists for that email, password reset instructions will be sent.');
        redirect_to('forgot-password.php');
    }

    if ($action === 'reset_password') {
        $token = post_value('token');
        $password = isset($_POST['password']) && is_string($_POST['password']) ? $_POST['password'] : '';
        $confirmation = isset($_POST['confirm_password']) && is_string($_POST['confirm_password']) ? $_POST['confirm_password'] : '';
        if (!preg_match('/\A[a-f0-9]{64}\z/', $token) || !password_meets_policy($password)
            || !hash_equals($password, $confirmation)) {
            set_flash('The reset link or password is invalid. Please try again.', 'error');
            redirect_to('reset-password.php?token=' . rawurlencode($token));
        }

        $pdo->beginTransaction();
        $lookup = $pdo->prepare(
            'SELECT id, student_id FROM password_reset_tokens
             WHERE token_hash = :token_hash AND expires_at > UTC_TIMESTAMP() FOR UPDATE'
        );
        $lookup->execute(['token_hash' => hash('sha256', $token)]);
        $reset = $lookup->fetch();
        if (!$reset) {
            $pdo->rollBack();
            set_flash('This reset link has expired or is invalid. Request a new one.', 'error');
            redirect_to('forgot-password.php');
        }
        $update = $pdo->prepare('UPDATE students SET password_hash = :password_hash WHERE id = :id');
        $update->execute([
            'password_hash' => password_hash($password, PASSWORD_DEFAULT),
            'id' => $reset['student_id'],
        ]);
        $delete = $pdo->prepare('DELETE FROM password_reset_tokens WHERE student_id = :student_id');
        $delete->execute(['student_id' => $reset['student_id']]);
        $revokeRemember = $pdo->prepare('DELETE FROM student_remember_tokens WHERE student_id = :student_id');
        $revokeRemember->execute(['student_id' => $reset['student_id']]);
        $pdo->commit();
        set_flash('Your password has been reset. Sign in with your new password.');
        redirect_to('login.php');
    }

    if ($action === 'logout') {
        if (isset($_COOKIE['nsbm_remember']) && is_string($_COOKIE['nsbm_remember'])
            && preg_match('/\A[a-f0-9]{64}\z/', $_COOKIE['nsbm_remember'])) {
            $delete = $pdo->prepare('DELETE FROM student_remember_tokens WHERE token_hash = :token_hash');
            $delete->execute(['token_hash' => hash('sha256', $_COOKIE['nsbm_remember'])]);
        }
        set_portal_cookie('nsbm_remember', '', time() - 3600);
        $_SESSION = [];
        session_regenerate_id(true);
        set_flash('You have been signed out.');
        redirect_to('login.php');
    }

    if ($action === 'admin_logout') {
        $_SESSION = [];
        session_regenerate_id(true);
        set_flash('You have been signed out.');
        redirect_to('admin.php');
    }
} catch (Throwable $exception) {
    if ($pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('NSBM account portal request failed: ' . $exception->getMessage());
    set_flash('We could not complete your request. Please try again later.', 'error');
    redirect_to($action === 'admin_login' ? 'admin.php' : 'login.php');
}

redirect_to('login.php');
