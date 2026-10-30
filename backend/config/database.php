<?php
declare(strict_types=1);

function database(): PDO
{
    static $connection = null;
    if ($connection instanceof PDO) {
        return $connection;
    }

    $host = getenv('NSBM_DB_HOST');
    $name = getenv('NSBM_DB_NAME');
    $user = getenv('NSBM_DB_USER');
    $password = getenv('NSBM_DB_PASSWORD');

    if (!$host || !$name || $user === false || $password === false) {
        throw new RuntimeException('Database environment variables are not configured.');
    }

    $dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $host, $name);
    $connection = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    return $connection;
}
