<?php
declare(strict_types=1);

function sportshubDatabaseConnection(): PDO
{
    $host = getenv('NSBM_DB_HOST');
    $database = getenv('NSBM_DB_NAME');
    $username = getenv('NSBM_DB_USER');
    $password = getenv('NSBM_DB_PASSWORD');
    $port = getenv('NSBM_DB_PORT') ?: '3306';

    if ($host === false || $database === false || $username === false) {
        throw new RuntimeException('NSBM_DB_HOST, NSBM_DB_NAME, and NSBM_DB_USER must be configured.');
    }

    return new PDO(
        "mysql:host={$host};port={$port};dbname={$database};charset=utf8mb4",
        $username,
        $password === false ? '' : $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
}
