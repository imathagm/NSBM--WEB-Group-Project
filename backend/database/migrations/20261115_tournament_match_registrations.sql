USE nsbm_sportshub;

SET @column_exists = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'sportshub_tournament_registrations'
    AND COLUMN_NAME = 'user_id'
);
SET @column_sql = IF(
  @column_exists = 0,
  'ALTER TABLE sportshub_tournament_registrations ADD COLUMN user_id BIGINT UNSIGNED NULL AFTER registration_id',
  'SELECT 1'
);
PREPARE column_statement FROM @column_sql;
EXECUTE column_statement;
DEALLOCATE PREPARE column_statement;

SET @column_exists = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'sportshub_tournament_registrations'
    AND COLUMN_NAME = 'status'
);
SET @column_sql = IF(
  @column_exists = 0,
  'ALTER TABLE sportshub_tournament_registrations ADD COLUMN status ENUM(''Pending'', ''Approved'', ''Rejected'') NOT NULL DEFAULT ''Pending'' AFTER year_of_study',
  'SELECT 1'
);
PREPARE column_statement FROM @column_sql;
EXECUTE column_statement;
DEALLOCATE PREPARE column_statement;

SET @column_exists = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'sportshub_tournament_registrations'
    AND COLUMN_NAME = 'reviewed_by'
);
SET @column_sql = IF(
  @column_exists = 0,
  'ALTER TABLE sportshub_tournament_registrations ADD COLUMN reviewed_by BIGINT UNSIGNED NULL AFTER status',
  'SELECT 1'
);
PREPARE column_statement FROM @column_sql;
EXECUTE column_statement;
DEALLOCATE PREPARE column_statement;

SET @column_exists = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'sportshub_tournament_registrations'
    AND COLUMN_NAME = 'reviewed_at'
);
SET @column_sql = IF(
  @column_exists = 0,
  'ALTER TABLE sportshub_tournament_registrations ADD COLUMN reviewed_at DATETIME NULL AFTER reviewed_by',
  'SELECT 1'
);
PREPARE column_statement FROM @column_sql;
EXECUTE column_statement;
DEALLOCATE PREPARE column_statement;

UPDATE sportshub_tournament_registrations AS registration
JOIN sportshub_users AS student
  ON student.student_id = registration.student_id
SET registration.user_id = student.user_id
WHERE registration.user_id IS NULL;

SET @event_id_nullable = (
  SELECT IS_NULLABLE = 'YES'
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'sportshub_tournament_registrations'
    AND COLUMN_NAME = 'tournament_id'
);
SET @column_sql = IF(
  @event_id_nullable = 0,
  'ALTER TABLE sportshub_tournament_registrations MODIFY COLUMN tournament_id VARCHAR(64) NULL',
  'SELECT 1'
);
PREPARE column_statement FROM @column_sql;
EXECUTE column_statement;
DEALLOCATE PREPARE column_statement;

SET @index_exists = (
  SELECT COUNT(*) FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'sportshub_tournament_registrations'
    AND INDEX_NAME = 'uq_tournament_user'
);
SET @index_sql = IF(
  @index_exists = 0,
  'ALTER TABLE sportshub_tournament_registrations ADD UNIQUE KEY uq_tournament_user (tournament_id, user_id)',
  'SELECT 1'
);
PREPARE index_statement FROM @index_sql;
EXECUTE index_statement;
DEALLOCATE PREPARE index_statement;

SET @index_exists = (
  SELECT COUNT(*) FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'sportshub_tournament_registrations'
    AND INDEX_NAME = 'idx_tournament_registration_status'
);
SET @index_sql = IF(
  @index_exists = 0,
  'ALTER TABLE sportshub_tournament_registrations ADD KEY idx_tournament_registration_status (status, created_at)',
  'SELECT 1'
);
PREPARE index_statement FROM @index_sql;
EXECUTE index_statement;
DEALLOCATE PREPARE index_statement;

SET @constraint_exists = (
  SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'sportshub_tournament_registrations'
    AND CONSTRAINT_NAME = 'fk_sportshub_tournament_user'
);
SET @constraint_sql = IF(
  @constraint_exists = 0,
  'ALTER TABLE sportshub_tournament_registrations ADD CONSTRAINT fk_sportshub_tournament_user FOREIGN KEY (user_id) REFERENCES sportshub_users(user_id) ON DELETE SET NULL',
  'SELECT 1'
);
PREPARE constraint_statement FROM @constraint_sql;
EXECUTE constraint_statement;
DEALLOCATE PREPARE constraint_statement;

SET @constraint_exists = (
  SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'sportshub_tournament_registrations'
    AND CONSTRAINT_NAME = 'fk_sportshub_tournament_reviewer'
);
SET @constraint_sql = IF(
  @constraint_exists = 0,
  'ALTER TABLE sportshub_tournament_registrations ADD CONSTRAINT fk_sportshub_tournament_reviewer FOREIGN KEY (reviewed_by) REFERENCES administrators(admin_id) ON DELETE SET NULL',
  'SELECT 1'
);
PREPARE constraint_statement FROM @constraint_sql;
EXECUTE constraint_statement;
DEALLOCATE PREPARE constraint_statement;

SET @constraint_exists = (
  SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'sportshub_tournament_registrations'
    AND CONSTRAINT_NAME = 'fk_sportshub_tournament_event'
);
SET @constraint_sql = IF(
  @constraint_exists = 0,
  'ALTER TABLE sportshub_tournament_registrations ADD CONSTRAINT fk_sportshub_tournament_event FOREIGN KEY (tournament_id) REFERENCES sports_fixtures(fixture_id) ON DELETE SET NULL',
  'SELECT 1'
);
PREPARE constraint_statement FROM @constraint_sql;
EXECUTE constraint_statement;
DEALLOCATE PREPARE constraint_statement;

CREATE TABLE IF NOT EXISTS sportshub_match_registrations (
  registration_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NULL,
  fixture_id VARCHAR(64) NULL,
  match_name VARCHAR(160) NOT NULL,
  student_name VARCHAR(120) NOT NULL,
  student_id VARCHAR(24) NOT NULL,
  email VARCHAR(254) NOT NULL,
  faculty VARCHAR(120) NULL,
  year_of_study VARCHAR(40) NULL,
  status ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
  reviewed_by BIGINT UNSIGNED NULL,
  reviewed_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_match_registration_user (fixture_id, user_id),
  KEY idx_match_registration_fixture (fixture_id),
  KEY idx_match_registration_status (status, created_at),
  CONSTRAINT fk_sportshub_match_registration_user
    FOREIGN KEY (user_id)
    REFERENCES sportshub_users(user_id)
    ON DELETE SET NULL,
  CONSTRAINT fk_sportshub_match_registration_fixture
    FOREIGN KEY (fixture_id)
    REFERENCES sports_fixtures(fixture_id)
    ON DELETE SET NULL,
  CONSTRAINT fk_sportshub_match_registration_reviewer
    FOREIGN KEY (reviewed_by)
    REFERENCES administrators(admin_id)
    ON DELETE SET NULL
) ENGINE=InnoDB;
