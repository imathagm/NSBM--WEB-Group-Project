<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

require_once __DIR__ . '/../config/database.php';

function prompt(string $label): string
{
    fwrite(STDOUT, $label);
    $value = fgets(STDIN);
    return $value === false ? '' : trim($value);
}

$name = prompt('Administrator full name: ');
$email = strtolower(prompt('Administrator email: '));
if ($name === '' || strlen($name) > 120 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fwrite(STDERR, "A valid name and email are required.\n");
    exit(1);
}

fwrite(STDOUT, 'Administrator password (minimum 12 characters): ');
if (function_exists('shell_exec') && PHP_OS_FAMILY !== 'Windows') {
    shell_exec('stty -echo');
}
$password = fgets(STDIN);
if (function_exists('shell_exec') && PHP_OS_FAMILY !== 'Windows') {
    shell_exec('stty echo');
    fwrite(STDOUT, PHP_EOL);
}
$password = $password === false ? '' : rtrim($password, "\r\n");
$passwordCharacters = preg_match_all('/./us', $password, $matches);
if ($passwordCharacters === false || $passwordCharacters < 12 || strlen($password) > 72) {
    fwrite(STDERR, "The password must contain at least 12 characters and no more than 72 bytes.\n");
    exit(1);
}

try {
    $insert = database()->prepare(
        'INSERT INTO administrators (full_name, email, password_hash)
         VALUES (:name, :email, :password_hash)'
    );
    $insert->execute([
        'name' => $name,
        'email' => $email,
        'password_hash' => password_hash($password, PASSWORD_DEFAULT),
    ]);
    fwrite(STDOUT, "Administrator account created.\n");
} catch (PDOException $exception) {
    if ($exception->getCode() === '23000') {
        fwrite(STDERR, "An administrator with that email already exists.\n");
        exit(1);
    }
    throw $exception;
} finally {
    if (isset($password) && function_exists('sodium_memzero')) {
        sodium_memzero($password);
    }
}
