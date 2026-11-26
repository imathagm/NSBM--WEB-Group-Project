<?php
declare(strict_types=1);

function sportshubDatabaseConnection(): PDO
{
    $hostingConfigPath = __DIR__ . '/hosting-database.php';

    $requestHost = strtolower($_SERVER['HTTP_HOST'] ?? '');
    $isProductionHost = in_array($requestHost, [
        'nsbm-sportshub.rf.gd',
        'www.nsbm-sportshub.rf.gd'
    ], true);

    if ($isProductionHost && file_exists($hostingConfigPath)) {
        $config = require $hostingConfigPath;

        $host = $config['host'];
        $database = $config['database'];
        $username = $config['username'];
        $password = $config['password'];
        $port = $config['port'];
    } else {
        $host = getenv('NSBM_DB_HOST') ?: 'localhost';
        $database = getenv('NSBM_DB_NAME') ?: 'nsbm_sportshub';
        $username = getenv('NSBM_DB_USER') ?: 'root';
        $password = getenv('NSBM_DB_PASSWORD');
        $password = $password === false ? '' : $password;
        $port = getenv('NSBM_DB_PORT') ?: '3307';
    }

    $pdo = new PDO(
        "mysql:host={$host};port={$port};dbname={$database};charset=utf8mb4",
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );

    $pdo->exec("SET time_zone = '+05:30'");

    return $pdo;
}
