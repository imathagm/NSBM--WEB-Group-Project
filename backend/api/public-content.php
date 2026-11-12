<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/config/database.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond_public_content(int $status, array $payload): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    header('Allow: GET');
    respond_public_content(405, ['success' => false, 'message' => 'Method not allowed.']);
}

$queries = [
    'clubs' => "SELECT id, name, sport, coach, venue, description
                FROM sportshub_clubs
                WHERE status = 'Active'
                ORDER BY name",
    'training' => "SELECT training.id, training.title, training.club,
                          club.sport, training.event_date AS date,
                          TIME_FORMAT(training.start_time, '%H:%i') AS time,
                          training.venue, training.coach
                   FROM sportshub_training_sessions AS training
                   LEFT JOIN sportshub_clubs AS club ON club.name = training.club
                   WHERE training.status = 'Scheduled' AND training.event_date >= CURRENT_DATE()
                   ORDER BY training.event_date, training.start_time, training.title",
    'events' => "SELECT fixture_id AS id, kind, competition AS title, sport,
                        event_date AS date,
                        TIME_FORMAT(start_time, '%H:%i') AS time,
                        venue, home_team AS homeClub, opponent_name AS opponent,
                        status, result, registration_deadline AS registrationDeadline
                 FROM sports_fixtures
                 WHERE status = 'Scheduled'
                   AND (event_date IS NULL OR event_date >= CURRENT_DATE())
                 ORDER BY event_date IS NULL, event_date, start_time, competition",
    'announcements' => "SELECT id, title, audience, content,
                               DATE_FORMAT(COALESCE(publish_date, created_at), '%Y-%m-%d') AS publishedDate
                        FROM sportshub_announcements
                        WHERE status = 'Published'
                          AND audience = 'All students'
                          AND (publish_date IS NULL OR publish_date <= CURRENT_DATE())
                        ORDER BY COALESCE(publish_date, DATE(created_at)) DESC, created_at DESC",
];

$entity = (string) ($_GET['entity'] ?? '');
if (!isset($queries[$entity])) {
    respond_public_content(400, ['success' => false, 'message' => 'Choose a valid public record type.']);
}

try {
    $records = sportshubDatabaseConnection()->query($queries[$entity])->fetchAll();
    respond_public_content(200, ['success' => true, 'records' => $records]);
} catch (Throwable $error) {
    error_log('Unable to retrieve public SportsHub records: ' . $error->getMessage());
    respond_public_content(503, [
        'success' => false,
        'message' => 'SportsHub records are temporarily unavailable.',
    ]);
}
