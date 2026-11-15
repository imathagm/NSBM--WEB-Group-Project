<?php
declare(strict_types=1);

require_once __DIR__ . '/common.php';
admin_require_session();

$entities = [
    'students' => [
        'table' => 'admin_students',
        'includeAccount' => true,
        'fields' => [
            'name' => ['column' => 'name', 'type' => 'text', 'required' => true, 'max' => 120],
            'studentId' => ['column' => 'student_id', 'type' => 'studentId', 'required' => true, 'max' => 24],
            'email' => ['column' => 'email', 'type' => 'email', 'max' => 254],
            'faculty' => ['column' => 'faculty', 'type' => 'text', 'max' => 120],
            'batch' => ['column' => 'batch', 'type' => 'text', 'max' => 40],
        ],
    ],
    'clubs' => [
        'table' => 'sportshub_clubs',
        'fields' => [
            'name' => ['column' => 'name', 'type' => 'text', 'required' => true, 'max' => 120],
            'sport' => ['column' => 'sport', 'type' => 'text', 'required' => true, 'max' => 40],
            'coach' => ['column' => 'coach', 'type' => 'text', 'max' => 120],
            'venue' => ['column' => 'venue', 'type' => 'text', 'max' => 180],
            'description' => ['column' => 'description', 'type' => 'text', 'max' => 5000],
            'status' => ['column' => 'status', 'type' => 'enum', 'options' => ['Active', 'Inactive'], 'default' => 'Active'],
        ],
    ],
    'applications' => [
        'table' => 'sportshub_membership_applications',
        'fields' => [
            'studentName' => ['column' => 'student_name', 'type' => 'text', 'required' => true, 'max' => 120],
            'studentId' => ['column' => 'student_id', 'type' => 'studentId', 'required' => true, 'max' => 24],
            'club' => ['column' => 'club', 'type' => 'text', 'required' => true, 'max' => 120],
            'submittedOn' => ['column' => 'submitted_on', 'type' => 'date'],
            'status' => ['column' => 'status', 'type' => 'enum', 'options' => ['Pending', 'Approved', 'Rejected'], 'default' => 'Pending'],
            'notes' => ['column' => 'notes', 'type' => 'text', 'max' => 5000],
        ],
    ],
    'training' => [
        'table' => 'sportshub_training_sessions',
        'fields' => [
            'title' => ['column' => 'title', 'type' => 'text', 'required' => true, 'max' => 160],
            'club' => ['column' => 'club', 'type' => 'text', 'required' => true, 'max' => 120],
            'date' => ['column' => 'event_date', 'type' => 'date', 'required' => true],
            'time' => ['column' => 'start_time', 'type' => 'time'],
            'venue' => ['column' => 'venue', 'type' => 'text', 'max' => 180],
            'coach' => ['column' => 'coach', 'type' => 'text', 'max' => 120],
            'status' => ['column' => 'status', 'type' => 'enum', 'options' => ['Scheduled', 'Cancelled', 'Completed'], 'default' => 'Scheduled'],
        ],
    ],
    'events' => [
        'table' => 'sports_fixtures',
        'idColumn' => 'fixture_id',
        'orderBy' => 'display_order, fixture_id',
        'fields' => [
            'kind' => ['column' => 'kind', 'type' => 'enum', 'options' => ['Match', 'Tournament'], 'default' => 'Match'],
            'title' => ['column' => 'competition', 'type' => 'text', 'required' => true, 'max' => 160],
            'sport' => ['column' => 'sport', 'type' => 'text', 'required' => true, 'max' => 40],
            'date' => ['column' => 'event_date', 'type' => 'date'],
            'time' => ['column' => 'start_time', 'type' => 'time'],
            'venue' => ['column' => 'venue', 'type' => 'text', 'max' => 180],
            'homeClub' => ['column' => 'home_team', 'type' => 'text', 'required' => true, 'max' => 120],
            'opponent' => ['column' => 'opponent_name', 'type' => 'text', 'max' => 160],
            'registrationDeadline' => ['column' => 'registration_deadline', 'type' => 'date'],
            'status' => ['column' => 'status', 'type' => 'enum', 'options' => ['Draft', 'Scheduled', 'Completed', 'Cancelled'], 'default' => 'Scheduled'],
            'result' => ['column' => 'result', 'type' => 'text', 'max' => 180],
        ],
    ],
    'announcements' => [
        'table' => 'sportshub_announcements',
        'fields' => [
            'title' => ['column' => 'title', 'type' => 'text', 'required' => true, 'max' => 160],
            'audience' => ['column' => 'audience', 'type' => 'enum', 'options' => ['All students', 'Club members', 'Administrators'], 'default' => 'All students'],
            'status' => ['column' => 'status', 'type' => 'enum', 'options' => ['Draft', 'Published'], 'default' => 'Draft'],
            'publishDate' => ['column' => 'publish_date', 'type' => 'date'],
            'content' => ['column' => 'content', 'type' => 'text', 'required' => true, 'max' => 10000],
        ],
    ],
    'facilities' => [
        'table' => 'sportshub_facility_bookings',
        'fields' => [
            'type' => ['column' => 'type', 'type' => 'enum', 'options' => ['Facility', 'Equipment'], 'default' => 'Facility'],
            'resource' => ['column' => 'resource', 'type' => 'text', 'required' => true, 'max' => 160],
            'requester' => ['column' => 'requester', 'type' => 'text', 'max' => 120],
            'date' => ['column' => 'event_date', 'type' => 'date', 'required' => true],
            'startTime' => ['column' => 'start_time', 'type' => 'time'],
            'endTime' => ['column' => 'end_time', 'type' => 'time'],
            'purpose' => ['column' => 'purpose', 'type' => 'text', 'max' => 5000],
            'status' => ['column' => 'status', 'type' => 'enum', 'options' => ['Pending', 'Approved', 'Rejected'], 'default' => 'Pending'],
        ],
    ],
];

$eventRegistrationEntities = [
    'tournamentRegistrations' => [
        'table' => 'sportshub_tournament_registrations',
        'eventColumn' => 'tournament_name',
        'eventLabel' => 'tournament',
    ],
    'matchRegistrations' => [
        'table' => 'sportshub_match_registrations',
        'eventColumn' => 'match_name',
        'eventLabel' => 'match',
    ],
];

function admin_record_error(string $message): never
{
    auth_respond(400, ['success' => false, 'message' => $message]);
}

function admin_validate_record(array $entity, array $input): array
{
    $fields = $entity['fields'];
    foreach ($input as $key => $_value) {
        if (!is_string($key) || !isset($fields[$key])) {
            admin_record_error('The record contains an unsupported field.');
        }
    }

    $clean = [];
    foreach ($fields as $key => $field) {
        if (!array_key_exists($key, $input)) {
            if (isset($field['required']) && $field['required']) {
                admin_record_error('Complete all required fields.');
            }
            if (array_key_exists('default', $field)) {
                $clean[$key] = $field['default'];
            }
            continue;
        }

        if ($input[$key] !== null && !is_scalar($input[$key])) {
            admin_record_error('Record fields must contain plain text values.');
        }
        $value = trim((string) $input[$key]);
        if ($value === '') {
            if (!empty($field['required']) || ($field['type'] ?? '') === 'enum') {
                admin_record_error('Complete all required fields.');
            }
            $clean[$key] = null;
            continue;
        }

        if (($field['type'] ?? '') === 'enum') {
            if (!in_array($value, $field['options'], true)) {
                admin_record_error('Choose a valid option for ' . $key . '.');
            }
        } elseif (($field['type'] ?? '') === 'date') {
            if (!preg_match('/\A(\d{4})-(\d{2})-(\d{2})\z/', $value, $parts)
                || !checkdate((int) $parts[2], (int) $parts[3], (int) $parts[1])) {
                admin_record_error('Enter a valid date for ' . $key . '.');
            }
        } elseif (($field['type'] ?? '') === 'time') {
            if (!preg_match('/\A(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?\z/', $value)) {
                admin_record_error('Enter a valid time for ' . $key . '.');
            }
            if (strlen($value) === 5) {
                $value .= ':00';
            }
        } elseif (($field['type'] ?? '') === 'email') {
            if (strlen($value) > $field['max'] || !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                admin_record_error('Enter a valid email address.');
            }
        } elseif (($field['type'] ?? '') === 'studentId') {
            if (!preg_match('/\A[A-Za-z0-9][A-Za-z0-9\/-]{3,22}[A-Za-z0-9]\z/', $value)) {
                admin_record_error('Enter a valid student ID.');
            }
        } else {
            $length = preg_match_all('/./us', $value);
            if ($length === false || $length > $field['max']) {
                admin_record_error('The ' . $key . ' field is too long.');
            }
        }
        $clean[$key] = $value;
    }

    return $clean;
}

function admin_select_application_records(PDO $pdo, ?string $id = null): array
{
    $query = 'SELECT application.id,
                     application.student_name AS studentName,
                     application.student_id AS studentId,
                     COALESCE(student.email, \'\') AS studentEmail,
                     application.club,
                     DATE_FORMAT(application.submitted_on, \'%Y-%m-%d\') AS submittedOn,
                     application.status,
                     application.notes,
                     COALESCE(reviewer.full_name, \'\') AS reviewedBy,
                     DATE_FORMAT(application.reviewed_at, \'%Y-%m-%d %H:%i\') AS reviewedAt
              FROM sportshub_membership_applications AS application
              LEFT JOIN sportshub_users AS student
                ON student.user_id = application.user_id
                OR (application.user_id IS NULL AND student.student_id = application.student_id)
              LEFT JOIN administrators AS reviewer
                ON reviewer.admin_id = application.reviewed_by';
    if ($id !== null) {
        $statement = $pdo->prepare($query . ' WHERE application.id = :id');
        $statement->execute(['id' => $id]);
        $record = $statement->fetch();
        return $record === false ? [] : [$record];
    }

    return $pdo->query($query . ' ORDER BY application.created_at DESC')->fetchAll();
}

function admin_select_event_registration_records(PDO $pdo, array $definition, ?string $id = null): array
{
    $query = 'SELECT CAST(registration.registration_id AS CHAR) AS id,
                     registration.' . $definition['eventColumn'] . ' AS eventName,
                     registration.student_name AS studentName,
                     registration.student_id AS studentId,
                     registration.email,
                     registration.faculty,
                     registration.year_of_study AS yearOfStudy,
                     DATE_FORMAT(registration.created_at, \'%Y-%m-%d %H:%i\') AS submittedAt,
                     registration.status,
                     COALESCE(reviewer.full_name, \'\') AS reviewedBy,
                     DATE_FORMAT(registration.reviewed_at, \'%Y-%m-%d %H:%i\') AS reviewedAt
              FROM ' . $definition['table'] . ' AS registration
              LEFT JOIN administrators AS reviewer
                ON reviewer.admin_id = registration.reviewed_by';
    if ($id !== null) {
        $statement = $pdo->prepare($query . ' WHERE registration.registration_id = :id');
        $statement->execute(['id' => $id]);
        $record = $statement->fetch();
        return $record === false ? [] : [$record];
    }

    return $pdo->query($query . ' ORDER BY registration.created_at DESC LIMIT 200')->fetchAll();
}

function admin_select_records(PDO $pdo, array $entity, ?string $entityName = null): array
{
    if ($entityName === 'applications') {
        return admin_select_application_records($pdo);
    }

    $idColumn = $entity['idColumn'] ?? 'id';
    $columns = [$idColumn . ' AS id'];
    foreach ($entity['fields'] as $key => $field) {
        $expression = ($field['type'] ?? '') === 'time'
            ? "TIME_FORMAT({$field['column']}, '%H:%i')"
            : $field['column'];
        $columns[] = $expression . ' AS ' . $key;
    }
    if (!empty($entity['includeAccount'])) {
        $columns[] = 'CASE WHEN user_id IS NULL THEN 0 ELSE 1 END AS hasAccount';
    }
    $orderBy = $entity['orderBy'] ?? 'created_at DESC';
    $records = $pdo->query('SELECT ' . implode(', ', $columns) . ' FROM ' . $entity['table'] . ' ORDER BY ' . $orderBy)
        ->fetchAll();
    if (!empty($entity['includeAccount'])) {
        foreach ($records as &$record) {
            $record['hasAccount'] = (bool) $record['hasAccount'];
        }
        unset($record);
    }
    return $records;
}

function admin_valid_id(string $entityName, string $id): bool
{
    if ($entityName === 'events') {
        return preg_match('/\A[A-Za-z0-9][A-Za-z0-9_-]{0,63}\z/', $id) === 1;
    }
    return preg_match('/\A[0-9a-f-]{36}\z/i', $id) === 1;
}

function admin_store_activity(PDO $pdo, string $description): void
{
    $statement = $pdo->prepare('INSERT INTO sportshub_admin_activity (description) VALUES (:description)');
    preg_match('/\A.{0,255}/us', $description, $matches);
    $statement->execute(['description' => $matches[0] ?? 'Record updated']);
}

try {
    $pdo = sportshubDatabaseConnection();
    $method = $_SERVER['REQUEST_METHOD'] ?? '';

    if ($method === 'GET') {
        $requested = (string) ($_GET['entity'] ?? '');
        if ($requested === 'all') {
            $records = [];
            foreach ($entities as $name => $definition) {
                $records[$name] = admin_select_records($pdo, $definition, $name);
            }
            foreach ($eventRegistrationEntities as $name => $definition) {
                $records[$name] = admin_select_event_registration_records($pdo, $definition);
            }
            $records['activity'] = $pdo->query(
                "SELECT description AS text, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') AS time
                 FROM sportshub_admin_activity ORDER BY activity_id DESC LIMIT 50"
            )->fetchAll();
            auth_respond(200, ['success' => true, 'records' => $records]);
        }
        if (!isset($entities[$requested])) {
            admin_record_error('Choose a valid record type.');
        }
        auth_respond(200, [
            'success' => true,
            'records' => admin_select_records($pdo, $entities[$requested], $requested),
        ]);
    }

    if (!in_array($method, ['POST', 'PUT', 'DELETE'], true)) {
        auth_require_method('GET, POST, PUT, DELETE');
    }

    auth_require_csrf();
    $input = auth_read_json();
    $entityName = (string) ($input['entity'] ?? '');
    if (isset($eventRegistrationEntities[$entityName])) {
        if ($method !== 'PUT') {
            auth_respond(405, ['success' => false, 'message' => 'Event registrations can only be reviewed.']);
        }
        $data = $input['data'] ?? null;
        if (!is_array($data)
            || count($data) !== 1
            || !array_key_exists('status', $data)
            || !in_array($data['status'], ['Approved', 'Rejected'], true)) {
            admin_record_error('Choose Approve or Reject for this event registration.');
        }
        $id = (string) ($input['id'] ?? '');
        if (!preg_match('/\A[1-9][0-9]{0,19}\z/', $id)) {
            admin_record_error('Choose a valid event registration.');
        }

        $definition = $eventRegistrationEntities[$entityName];
        $pdo->beginTransaction();
        $review = $pdo->prepare(
            'UPDATE ' . $definition['table'] . '
             SET status = :status, reviewed_by = :admin_id, reviewed_at = CURRENT_TIMESTAMP
             WHERE registration_id = :id AND status = \'Pending\''
        );
        $review->execute([
            'status' => $data['status'],
            'admin_id' => (int) $_SESSION['admin_id'],
            'id' => $id,
        ]);
        if ($review->rowCount() !== 1) {
            $exists = $pdo->prepare(
                'SELECT 1 FROM ' . $definition['table'] . ' WHERE registration_id = :id'
            );
            $exists->execute(['id' => $id]);
            $pdo->rollBack();
            if (!$exists->fetchColumn()) {
                auth_respond(404, ['success' => false, 'message' => 'The event registration no longer exists.']);
            }
            auth_respond(409, ['success' => false, 'message' => 'This event registration has already been reviewed.']);
        }

        $records = admin_select_event_registration_records($pdo, $definition, $id);
        if (!$records) {
            $pdo->rollBack();
            auth_respond(404, ['success' => false, 'message' => 'The event registration no longer exists.']);
        }
        $record = $records[0];
        admin_store_activity(
            $pdo,
            $data['status'] . ' ' . $definition['eventLabel'] . ' registration for '
                . $record['studentName'] . ' (' . $record['studentId'] . ') to ' . $record['eventName']
        );
        $pdo->commit();
        auth_respond(200, ['success' => true, 'record' => $record]);
    }
    if (!isset($entities[$entityName])) {
        admin_record_error('Choose a valid record type.');
    }
    $entity = $entities[$entityName];
    $idColumn = $entity['idColumn'] ?? 'id';
    $id = (string) ($input['id'] ?? '');

    if ($entityName === 'applications') {
        if ($method !== 'PUT') {
            auth_respond(405, ['success' => false, 'message' => 'Applications can only be reviewed.']);
        }
        $data = $input['data'] ?? null;
        if (!is_array($data)
            || count($data) !== 1
            || !array_key_exists('status', $data)
            || !in_array($data['status'], ['Approved', 'Rejected'], true)) {
            admin_record_error('Choose Approve or Reject for this application.');
        }
        if (!admin_valid_id($entityName, $id)) {
            admin_record_error('Choose a valid application.');
        }

        $pdo->beginTransaction();
        $review = $pdo->prepare(
            "UPDATE sportshub_membership_applications
             SET status = :status, reviewed_by = :admin_id, reviewed_at = CURRENT_TIMESTAMP
             WHERE id = :id AND status = 'Pending'"
        );
        $review->execute([
            'status' => $data['status'],
            'admin_id' => (int) $_SESSION['admin_id'],
            'id' => $id,
        ]);
        if ($review->rowCount() !== 1) {
            $exists = $pdo->prepare('SELECT 1 FROM sportshub_membership_applications WHERE id = :id');
            $exists->execute(['id' => $id]);
            $pdo->rollBack();
            if (!$exists->fetchColumn()) {
                auth_respond(404, ['success' => false, 'message' => 'The application no longer exists.']);
            }
            auth_respond(409, ['success' => false, 'message' => 'This application has already been reviewed.']);
        }

        $activity = $pdo->prepare(
            'SELECT student_name, student_id, club
             FROM sportshub_membership_applications
             WHERE id = :id'
        );
        $activity->execute(['id' => $id]);
        $application = $activity->fetch();
        if ($application === false) {
            $pdo->rollBack();
            auth_respond(404, ['success' => false, 'message' => 'The application no longer exists.']);
        }
        admin_store_activity(
            $pdo,
            $data['status'] . ' membership application for ' . $application['student_name']
                . ' (' . $application['student_id'] . ') to ' . $application['club']
        );
        $pdo->commit();
        $records = admin_select_application_records($pdo, $id);
        auth_respond(200, ['success' => true, 'record' => $records[0]]);
    }

    if ($method === 'DELETE') {
        if (!admin_valid_id($entityName, $id)) {
            admin_record_error('Choose a valid record.');
        }
        $pdo->beginTransaction();
        if ($entityName === 'clubs') {
            $related = $pdo->prepare(
                'SELECT (SELECT COUNT(*) FROM sportshub_membership_applications WHERE club = clubs.name)
                      + (SELECT COUNT(*) FROM sportshub_training_sessions WHERE club = clubs.name)
                 FROM sportshub_clubs AS clubs WHERE id = :id FOR UPDATE'
            );
            $related->execute(['id' => $id]);
            if ((int) $related->fetchColumn() > 0) {
                $pdo->rollBack();
                auth_respond(409, ['success' => false, 'message' => 'This club has applications or training sessions. Mark it Inactive, or remove those records first.']);
            }
        }
        if ($entityName === 'events') {
            $entries = $pdo->prepare('DELETE FROM sportshub_tournament_registrations WHERE tournament_id = :id');
            $entries->execute(['id' => $id]);
        }
        if ($entityName === 'students') {
            $linkedAccount = $pdo->prepare(
                'SELECT user_id, student_id FROM admin_students WHERE id = :id FOR UPDATE'
            );
            $linkedAccount->execute(['id' => $id]);
            $studentRecord = $linkedAccount->fetch();
            if ($studentRecord === false) {
                $pdo->rollBack();
                auth_respond(404, ['success' => false, 'message' => 'The record no longer exists.']);
            }
            foreach (['sportshub_membership_applications', 'sportshub_tournament_registrations'] as $table) {
                $deleteRelated = $pdo->prepare('DELETE FROM ' . $table . ' WHERE student_id = :student_id');
                $deleteRelated->execute(['student_id' => $studentRecord['student_id']]);
            }
            if ($studentRecord['user_id'] !== null) {
              
                $deleteRegistrations = $pdo->prepare(
                    'DELETE FROM sportshub_tournament_registrations WHERE student_id = :student_id'
                );
                $deleteRegistrations->execute(['student_id' => $studentRecord['student_id']]);
                $deleteMatchRegistrations = $pdo->prepare(
                    'DELETE FROM sportshub_match_registrations WHERE student_id = :student_id'
                );
                $deleteMatchRegistrations->execute(['student_id' => $studentRecord['student_id']])
                $deleteAccount = $pdo->prepare('DELETE FROM sportshub_users WHERE user_id = :user_id');
                $deleteAccount->execute(['user_id' => $studentRecord['user_id']]);
            }
        }
        $delete = $pdo->prepare('DELETE FROM ' . $entity['table'] . ' WHERE ' . $idColumn . ' = :id');
        $delete->execute(['id' => $id]);
        if ($delete->rowCount() !== 1) {
            $pdo->rollBack();
            auth_respond(404, ['success' => false, 'message' => 'The record no longer exists.']);
        }
        admin_store_activity($pdo, 'Deleted ' . rtrim($entityName, 's'));
        $pdo->commit();
        auth_respond(200, ['success' => true, 'message' => 'Record deleted.']);
    }

    $data = $input['data'] ?? null;
    if (!is_array($data)) {
        admin_record_error('Record data is required.');
    }
    $pdo->beginTransaction();
    $previous = null;
    if ($method === 'PUT') {
        if (!admin_valid_id($entityName, $id)) {
            admin_record_error('Choose a valid record.');
        }
        $existing = $pdo->prepare('SELECT * FROM ' . $entity['table'] . ' WHERE ' . $idColumn . ' = :id FOR UPDATE');
        $existing->execute(['id' => $id]);
        $previous = $existing->fetch();
        if ($previous === false) {
            auth_respond(404, ['success' => false, 'message' => 'The record no longer exists.']);
        }
        $current = [];
        foreach ($entity['fields'] as $key => $field) {
            $current[$key] = $previous[$field['column']];
        }
        $data = array_replace($current, $data);
    }
    $values = admin_validate_record($entity, $data);
    $label = (string) ($values['name'] ?? $values['title'] ?? $values['studentName'] ?? $values['resource'] ?? rtrim($entityName, 's'));

    if ($entityName === 'events' && !empty($values['date']) && !empty($values['registrationDeadline'])
        && $values['registrationDeadline'] > $values['date']) {
        admin_record_error('The registration deadline cannot be after the event date.');
    }
    if (in_array($entityName, ['applications', 'training'], true)) {
        $club = $pdo->prepare('SELECT name FROM sportshub_clubs WHERE name = :name FOR UPDATE');
        $club->execute(['name' => $values['club']]);
        $clubName = $club->fetchColumn();
        if ($clubName === false) {
            admin_record_error('Choose an existing club. Add the club in Sports Clubs first.');
        }
        $values['club'] = $clubName;
    }
    if ($entityName === 'applications') {
        $student = $pdo->prepare('SELECT name, student_id FROM admin_students WHERE student_id = :student_id');
        $student->execute(['student_id' => $values['studentId']]);
        $studentDetails = $student->fetch();
        if ($studentDetails === false) {
            admin_record_error('Choose an existing student. Add the student in Students first.');
        }
        $values['studentName'] = $studentDetails['name'];
        $values['studentId'] = $studentDetails['student_id'];
        $duplicate = $pdo->prepare(
            'SELECT id FROM sportshub_membership_applications
             WHERE student_id = :student_id AND club = :club AND id <> :id LIMIT 1'
        );
        $duplicate->execute(['student_id' => $values['studentId'], 'club' => $values['club'], 'id' => $id]);
        if ($duplicate->fetchColumn()) {
            auth_respond(409, ['success' => false, 'message' => 'This student already has an application for this club. Edit that application instead.']);
        }
    }
    if ($entityName === 'facilities') {
        $start = $values['startTime'] ?? null;
        $end = $values['endTime'] ?? null;
        if (($start === null) !== ($end === null) || ($start !== null && $end <= $start)) {
            admin_record_error('Enter both booking times, with the end time after the start time. Leave both blank for an all-day booking.');
        }
        if (($values['status'] ?? '') === 'Approved') {
            $overlap = $pdo->prepare(
                "SELECT id FROM sportshub_facility_bookings
                 WHERE resource = :resource AND type = :type AND event_date = :date
                   AND status = 'Approved' AND id <> :id
                   AND COALESCE(start_time, '00:00:00') < :end_time
                   AND COALESCE(end_time, '23:59:59') > :start_time FOR UPDATE"
            );
            $overlap->execute([
                'resource' => $values['resource'], 'type' => $values['type'], 'date' => $values['date'],
                'id' => $id, 'start_time' => $start ?? '00:00:00', 'end_time' => $end ?? '23:59:59',
            ]);
            if ($overlap->fetchColumn()) {
                auth_respond(409, ['success' => false, 'message' => 'This resource already has an approved booking during that time.']);
            }
        }
    }

    if ($method === 'POST') {
        $id = admin_uuid();
        $columns = [$idColumn];
        $placeholders = [':id'];
        $parameters = ['id' => $id];
        if ($entityName === 'events') {
            $section = !empty($values['date']) ? 'scheduled' : 'upcoming';
            $order = $pdo->prepare(
                'SELECT COALESCE(MAX(display_order), 0) + 1
                 FROM sports_fixtures WHERE section = :section'
            );
            $order->execute(['section' => $section]);
            $columns[] = 'section';
            $placeholders[] = ':section';
            $parameters['section'] = $section;
            $columns[] = 'display_order';
            $placeholders[] = ':display_order';
            $parameters['display_order'] = (int) $order->fetchColumn();
        }
        foreach ($values as $key => $value) {
            $columns[] = $entity['fields'][$key]['column'];
            $placeholder = 'field_' . $key;
            $placeholders[] = ':' . $placeholder;
            $parameters[$placeholder] = $value;
        }
        $insert = $pdo->prepare(
            'INSERT INTO ' . $entity['table'] . ' (' . implode(', ', $columns) . ')
             VALUES (' . implode(', ', $placeholders) . ')'
        );
        $insert->execute($parameters);
        admin_store_activity($pdo, 'Created ' . $label);
        $status = 201;
    } else {
        if (!admin_valid_id($entityName, $id)) {
            $pdo->rollBack();
            admin_record_error('Choose a valid record.');
        }
        $exists = $pdo->prepare('SELECT 1 FROM ' . $entity['table'] . ' WHERE ' . $idColumn . ' = :id');
        $exists->execute(['id' => $id]);
        if (!$exists->fetchColumn()) {
            $pdo->rollBack();
            auth_respond(404, ['success' => false, 'message' => 'The record no longer exists.']);
        }
        if ($values) {
            $assignments = [];
            $parameters = ['id' => $id];
            foreach ($values as $key => $value) {
                $placeholder = 'field_' . $key;
                $assignments[] = $entity['fields'][$key]['column'] . ' = :' . $placeholder;
                $parameters[$placeholder] = $value;
            }
            $update = $pdo->prepare(
                'UPDATE ' . $entity['table'] . ' SET ' . implode(', ', $assignments)
                . ' WHERE ' . $idColumn . ' = :id'
            );
            $update->execute($parameters);
        }
        if ($entityName === 'events') {
            $sectionUpdate = $pdo->prepare(
                "UPDATE sports_fixtures SET section = IF(event_date IS NULL, 'upcoming', 'scheduled')
                 WHERE fixture_id = :id"
            );
            $sectionUpdate->execute(['id' => $id]);
            if (($previous['opponent_name'] ?? null) !== ($values['opponent'] ?? null)) {
                $clearOpponentCode = $pdo->prepare(
                    'UPDATE sports_fixtures SET opponent_code = NULL
                     WHERE fixture_id = :id'
                );
                $clearOpponentCode->execute(['id' => $id]);
            }
            $entries = $pdo->prepare('UPDATE sportshub_tournament_registrations SET tournament_name = :title WHERE tournament_id = :id');
            $entries->execute(['title' => $values['title'], 'id' => $id]);
        }
        if ($entityName === 'clubs' && $previous['name'] !== $values['name']) {
            foreach (['sportshub_membership_applications', 'sportshub_training_sessions'] as $table) {
                $rename = $pdo->prepare('UPDATE ' . $table . ' SET club = :new_name WHERE club = :old_name');
                $rename->execute(['new_name' => $values['name'], 'old_name' => $previous['name']]);
            }
            $rename = $pdo->prepare('UPDATE sports_fixtures SET home_team = :new_name WHERE home_team = :old_name');
            $rename->execute(['new_name' => $values['name'], 'old_name' => $previous['name']]);
        }
        if ($entityName === 'students') {
            $applications = $pdo->prepare(
                'UPDATE sportshub_membership_applications SET student_id = :new_id, student_name = :name WHERE student_id = :old_id'
            );
            $applications->execute(['new_id' => $values['studentId'], 'name' => $values['name'], 'old_id' => $previous['student_id']]);
            $entries = $pdo->prepare(
                'UPDATE sportshub_tournament_registrations SET student_id = :new_id, student_name = :name,
                 email = :email, faculty = :faculty, year_of_study = :year WHERE student_id = :old_id'
            );
            $entries->execute([
                'new_id' => $values['studentId'], 'name' => $values['name'], 'email' => $values['email'] ?? '',
                'faculty' => $values['faculty'] ?? null, 'year' => $values['batch'] ?? null, 'old_id' => $previous['student_id'],
            ]);
            $linkedAccount = $pdo->prepare('SELECT user_id FROM admin_students WHERE id = :id');
            $linkedAccount->execute(['id' => $id]);
            $userId = $linkedAccount->fetchColumn();
            if ($userId !== false && $userId !== null) {
                if (empty($values['email'])) {
                    $pdo->rollBack();
                    admin_record_error('A registered student must have an email address.');
                }
                $accountUpdate = $pdo->prepare(
                    'UPDATE sportshub_users
                     SET full_name = :name, student_id = :student_id, email = :email,
                         faculty = :faculty, academic_year = :academic_year
                     WHERE user_id = :user_id'
                );
                $accountUpdate->execute([
                    'name' => $values['name'],
                    'student_id' => $values['studentId'],
                    'email' => $values['email'],
                    'faculty' => $values['faculty'] ?? null,
                    'academic_year' => $values['batch'] ?? null,
                    'user_id' => $userId,
                ]);
            }
        }
        admin_store_activity($pdo, 'Updated ' . $label);
        $status = 200;
    }

    $pdo->commit();
    $selectColumns = ['SELECT ' . $idColumn . ' AS id, ' . implode(', ', array_map(
            static fn (string $key, array $field): string => (($field['type'] ?? '') === 'time'
                ? "TIME_FORMAT({$field['column']}, '%H:%i')"
                : $field['column']) . ' AS ' . $key,
            array_keys($entity['fields']),
            array_values($entity['fields'])
        ))];
    if (!empty($entity['includeAccount'])) {
        $selectColumns[] = 'CASE WHEN user_id IS NULL THEN 0 ELSE 1 END AS hasAccount';
    }
    $select = $pdo->prepare(implode(', ', $selectColumns) . ' FROM ' . $entity['table'] . ' WHERE ' . $idColumn . ' = :id');
    $select->execute(['id' => $id]);
    $record = $select->fetch();
    if ($record !== false && !empty($entity['includeAccount'])) {
        $record['hasAccount'] = (bool) $record['hasAccount'];
    }
    auth_respond($status, ['success' => true, 'record' => $record]);
} catch (PDOException $error) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    if ($error->getCode() === '23000') {
        auth_respond(409, ['success' => false, 'message' => 'A record with the same unique value already exists.']);
    }
    error_log('Admin record request failed: ' . $error->getMessage());
    auth_respond(503, ['success' => false, 'message' => 'The administration service is temporarily unavailable.']);
} catch (Throwable $error) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('Admin record request failed: ' . $error->getMessage());
    auth_respond(500, ['success' => false, 'message' => 'The record request could not be completed.']);
}
