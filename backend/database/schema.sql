CREATE DATABASE IF NOT EXISTS nsbm_sportshub
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE nsbm_sportshub;

CREATE TABLE IF NOT EXISTS sports_fixtures (
  fixture_id VARCHAR(64) NOT NULL PRIMARY KEY,
  section ENUM('upcoming', 'scheduled') NOT NULL,
  display_order SMALLINT UNSIGNED NOT NULL,
  sport VARCHAR(40) NOT NULL,
  competition VARCHAR(160) NOT NULL,
  home_team VARCHAR(120) NOT NULL,
  opponent_name VARCHAR(160) NULL,
  opponent_code VARCHAR(12) NULL,
  event_date DATE NULL,
  start_time TIME NULL,
  venue VARCHAR(180) NULL,
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  kind ENUM('Match', 'Tournament') NOT NULL DEFAULT 'Match',
  status ENUM('Draft', 'Scheduled', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Scheduled',
  result VARCHAR(180) NULL,
  INDEX idx_fixtures_section_order (section, display_order)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS administrators (
  admin_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS sportshub_users (
  user_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NULL,
  student_id VARCHAR(24) NULL UNIQUE,
  email VARCHAR(254) NOT NULL UNIQUE,
  contact_number VARCHAR(24) NULL,
  sport_of_interest VARCHAR(40) NULL,
  faculty VARCHAR(120) NULL,
  degree_program VARCHAR(160) NULL,
  academic_year VARCHAR(40) NULL,
  profile_photo MEDIUMTEXT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

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

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  reset_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  used_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_password_reset_user_expiry (user_id, expires_at),
  CONSTRAINT fk_password_reset_user
    FOREIGN KEY (user_id)
    REFERENCES sportshub_users(user_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS student_remember_tokens (
  token_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_student_remember_user_expiry (user_id, expires_at),
  CONSTRAINT fk_student_remember_user
    FOREIGN KEY (user_id)
    REFERENCES sportshub_users(user_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT IGNORE INTO sports_fixtures (
  fixture_id, section, display_order, sport, competition, home_team,
  opponent_name, opponent_code, event_date, start_time, venue, is_demo
) VALUES
  ('upcoming-badminton', 'upcoming', 1, 'Badminton', 'Inter-University Badminton Series', 'NSBM Badminton', 'SLIIT Badminton', 'SLIIT', NULL, NULL, NULL, FALSE),
  ('upcoming-cricket', 'upcoming', 2, 'Cricket', 'Inter-University T20', 'NSBM Cricket', 'KDU Cricket', 'KDU', NULL, NULL, NULL, FALSE),
  ('upcoming-football', 'upcoming', 3, 'Football', 'Inter-University Football Cup', 'NSBM Football', 'SLIIT Football', 'SLIIT', NULL, NULL, NULL, FALSE),
  ('upcoming-basketball', 'upcoming', 4, 'Basketball', 'University Basketball Challenge', 'NSBM Basketball', 'USJ Basketball', 'USJ', NULL, NULL, NULL, FALSE),
  ('scheduled-inter-faculty-football', 'scheduled', 1, 'Football', 'Inter Faculty Football Cup', 'NSBM Football', 'SLIIT', 'SLIIT', '2026-11-14', '09:00:00', 'NSBM Football Ground', TRUE),
  ('scheduled-badminton', 'scheduled', 2, 'Badminton', 'Badminton Cup', 'NSBM Badminton', 'SLIIT', 'SLIIT', '2026-11-17', '10:00:00', 'NSBM Indoor Sports Complex', TRUE),
  ('scheduled-basketball', 'scheduled', 3, 'Basketball', 'Basketball Tournament', 'NSBM Basketball', 'University of Moratuwa', 'UOM', '2026-11-20', '14:00:00', 'NSBM Basketball Court', TRUE),
  ('scheduled-volleyball', 'scheduled', 4, 'Volleyball', 'Volleyball Tournament', 'NSBM Volleyball', 'University of Kelaniya', 'UOK', '2026-11-24', '09:00:00', 'NSBM Indoor Sports Complex', TRUE),
  ('scheduled-cricket', 'scheduled', 5, 'Cricket', 'Cricket T20 League', 'NSBM Cricket', 'General Sir John Kotelawala Defence University', 'KDU', '2026-11-28', '08:30:00', 'NSBM Cricket Ground', TRUE),
  ('scheduled-netball', 'scheduled', 6, 'Netball', 'Netball Tournament', 'NSBM Netball', NULL, NULL, '2026-12-02', '10:00:00', 'NSBM Sports Ground', FALSE),
  ('scheduled-hockey', 'scheduled', 7, 'Hockey', 'Hockey Tournament', 'NSBM Hockey', 'University of Peradeniya', 'UOP', '2026-12-05', '09:00:00', 'NSBM Sports Ground', TRUE);
