<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    header('Allow: GET');
    respond(405, ['error' => 'Only GET requests are supported.']);
    exit;
}

try {
    require_once dirname(__DIR__) . '/config/database.php';
    $database = sportshubDatabaseConnection();
    $statement = $database->query(
        "SELECT fixture_id, section, sport, competition, home_team, opponent_name,
                opponent_code, event_date, TIME_FORMAT(start_time, '%H:%i') AS start_time,
                venue, is_demo
         FROM sports_fixtures
         ORDER BY display_order, fixture_id"
    );

    $fixtures = array_map(
        static function (array $fixture): array {
            $fixture['is_demo'] = (bool) $fixture['is_demo'];
            return $fixture;
        },
        $statement->fetchAll()
    );

    respond(200, ['fixtures' => $fixtures]);
} catch (PDOException $error) {
    error_log('Unable to retrieve SportsHub fixtures: ' . $error->getMessage());
    respond(503, ['error' => 'Fixture data is temporarily unavailable.']);
} catch (Throwable $error) {
    error_log('SportsHub fixture API failure: ' . $error->getMessage());
    respond(500, ['error' => 'The fixture request could not be completed.']);
}
