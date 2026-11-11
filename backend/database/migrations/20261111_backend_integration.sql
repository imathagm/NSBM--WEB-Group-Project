
USE nsbm_sportshub;

SET @profile_photo_exists = (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'sportshub_users'
    AND COLUMN_NAME = 'profile_photo'
);
SET @profile_photo_sql = IF(
  @profile_photo_exists = 0,
  'ALTER TABLE sportshub_users ADD COLUMN profile_photo MEDIUMTEXT NULL AFTER sport_of_interest',
  'SELECT 1'
);
PREPARE profile_photo_statement FROM @profile_photo_sql;
EXECUTE profile_photo_statement;
DEALLOCATE PREPARE profile_photo_statement;

SET @profile_column = 'faculty';
SET @profile_column_exists = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'sportshub_users' AND COLUMN_NAME = @profile_column
);
SET @profile_column_sql = IF(@profile_column_exists = 0, 'ALTER TABLE sportshub_users ADD COLUMN faculty VARCHAR(120) NULL AFTER sport_of_interest', 'SELECT 1');
PREPARE profile_column_statement FROM @profile_column_sql;
EXECUTE profile_column_statement;
DEALLOCATE PREPARE profile_column_statement;

SET @fixture_kind_exists = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'sports_fixtures' AND COLUMN_NAME = 'kind'
);
SET @fixture_kind_sql = IF(
  @fixture_kind_exists = 0,
  'ALTER TABLE sports_fixtures ADD COLUMN kind ENUM(''Match'', ''Tournament'') NOT NULL DEFAULT ''Match'' AFTER is_demo',
  'SELECT 1'
);
PREPARE fixture_kind_statement FROM @fixture_kind_sql;
EXECUTE fixture_kind_statement;
DEALLOCATE PREPARE fixture_kind_statement;

SET @fixture_status_exists = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'sports_fixtures' AND COLUMN_NAME = 'status'
);
SET @fixture_status_sql = IF(
  @fixture_status_exists = 0,
  'ALTER TABLE sports_fixtures ADD COLUMN status ENUM(''Draft'', ''Scheduled'', ''Completed'', ''Cancelled'') NOT NULL DEFAULT ''Scheduled'' AFTER kind',
  'SELECT 1'
);
PREPARE fixture_status_statement FROM @fixture_status_sql;
EXECUTE fixture_status_statement;
DEALLOCATE PREPARE fixture_status_statement;

SET @fixture_result_exists = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'sports_fixtures' AND COLUMN_NAME = 'result'
);
SET @fixture_result_sql = IF(
  @fixture_result_exists = 0,
  'ALTER TABLE sports_fixtures ADD COLUMN result VARCHAR(180) NULL AFTER status',
  'SELECT 1'
);
PREPARE fixture_result_statement FROM @fixture_result_sql;
EXECUTE fixture_result_statement;
DEALLOCATE PREPARE fixture_result_statement;

SET @profile_column = 'degree_program';
SET @profile_column_exists = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'sportshub_users' AND COLUMN_NAME = @profile_column
);
SET @profile_column_sql = IF(@profile_column_exists = 0, 'ALTER TABLE sportshub_users ADD COLUMN degree_program VARCHAR(160) NULL AFTER faculty', 'SELECT 1');
PREPARE profile_column_statement FROM @profile_column_sql;
EXECUTE profile_column_statement;
DEALLOCATE PREPARE profile_column_statement;

SET @profile_column = 'academic_year';
SET @profile_column_exists = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'sportshub_users' AND COLUMN_NAME = @profile_column
);
SET @profile_column_sql = IF(@profile_column_exists = 0, 'ALTER TABLE sportshub_users ADD COLUMN academic_year VARCHAR(40) NULL AFTER degree_program', 'SELECT 1');
PREPARE profile_column_statement FROM @profile_column_sql;
EXECUTE profile_column_statement;
DEALLOCATE PREPARE profile_column_statement;

CREATE TABLE IF NOT EXISTS admin_students (
  id CHAR(36) NOT NULL PRIMARY KEY,
  user_id BIGINT UNSIGNED NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  student_id VARCHAR(24) NOT NULL UNIQUE,
  email VARCHAR(254) NULL,
  faculty VARCHAR(120) NULL,
  batch VARCHAR(40) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_admin_student_user
    FOREIGN KEY (user_id)
    REFERENCES sportshub_users(user_id)
    ON DELETE SET NULL
) ENGINE=InnoDB;

SET @admin_student_user_id_exists = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'admin_students' AND COLUMN_NAME = 'user_id'
);
SET @admin_student_user_id_sql = IF(
  @admin_student_user_id_exists = 0,
  'ALTER TABLE admin_students ADD COLUMN user_id BIGINT UNSIGNED NULL UNIQUE',
  'SELECT 1'
);
PREPARE admin_student_user_id_statement FROM @admin_student_user_id_sql;
EXECUTE admin_student_user_id_statement;
DEALLOCATE PREPARE admin_student_user_id_statement;

SET @admin_student_user_fk_exists = (
  SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'admin_students'
    AND CONSTRAINT_NAME = 'fk_admin_student_user'
);
SET @admin_student_user_fk_sql = IF(
  @admin_student_user_fk_exists = 0,
  'ALTER TABLE admin_students ADD CONSTRAINT fk_admin_student_user FOREIGN KEY (user_id) REFERENCES sportshub_users(user_id) ON DELETE SET NULL',
  'SELECT 1'
);
PREPARE admin_student_user_fk_statement FROM @admin_student_user_fk_sql;
EXECUTE admin_student_user_fk_statement;
DEALLOCATE PREPARE admin_student_user_fk_statement;

CREATE TABLE IF NOT EXISTS sportshub_clubs (
  id CHAR(36) NOT NULL PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  sport VARCHAR(40) NOT NULL,
  coach VARCHAR(120) NULL,
  venue VARCHAR(180) NULL,
  description TEXT NULL,
  status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS sportshub_membership_applications (
  id CHAR(36) NOT NULL PRIMARY KEY,
  student_name VARCHAR(120) NOT NULL,
  student_id VARCHAR(24) NOT NULL,
  club VARCHAR(120) NOT NULL,
  submitted_on DATE NULL,
  status ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
  notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_membership_student (student_id),
  KEY idx_membership_club (club),
  KEY idx_membership_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS sportshub_training_sessions (
  id CHAR(36) NOT NULL PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  club VARCHAR(120) NOT NULL,
  event_date DATE NOT NULL,
  start_time TIME NULL,
  venue VARCHAR(180) NULL,
  coach VARCHAR(120) NULL,
  status ENUM('Scheduled', 'Cancelled', 'Completed') NOT NULL DEFAULT 'Scheduled',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_training_date (event_date)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS sportshub_announcements (
  id CHAR(36) NOT NULL PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  audience ENUM('All students', 'Club members', 'Administrators') NOT NULL DEFAULT 'All students',
  status ENUM('Draft', 'Published') NOT NULL DEFAULT 'Draft',
  publish_date DATE NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS sportshub_facility_bookings (
  id CHAR(36) NOT NULL PRIMARY KEY,
  type ENUM('Facility', 'Equipment') NOT NULL DEFAULT 'Facility',
  resource VARCHAR(160) NOT NULL,
  requester VARCHAR(120) NULL,
  event_date DATE NOT NULL,
  start_time TIME NULL,
  end_time TIME NULL,
  purpose TEXT NULL,
  status ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_facility_bookings_date (event_date),
  KEY idx_facility_bookings_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS sportshub_admin_activity (
  activity_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  description VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_admin_activity_created (created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS sportshub_tournament_registrations (
  registration_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  tournament_id VARCHAR(64) NOT NULL,
  tournament_name VARCHAR(160) NOT NULL,
  student_name VARCHAR(120) NOT NULL,
  student_id VARCHAR(24) NOT NULL,
  email VARCHAR(254) NOT NULL,
  faculty VARCHAR(120) NULL,
  year_of_study VARCHAR(40) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_tournament_student (tournament_id, student_id),
  KEY idx_tournament_registration (tournament_id)
) ENGINE=InnoDB;

INSERT IGNORE INTO admin_students (id, user_id, name, student_id, email, faculty, batch)
SELECT UUID(), user_id, full_name, student_id, email, faculty, academic_year
FROM sportshub_users
WHERE student_id IS NOT NULL AND full_name IS NOT NULL;
