CREATE DATABASE IF NOT EXISTS nsbm_sports_hub
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE nsbm_sports_hub;

CREATE TABLE IF NOT EXISTS students (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(120) NOT NULL,
  student_id VARCHAR(40) NOT NULL,
  email VARCHAR(254) NOT NULL,
  contact_number VARCHAR(30) NOT NULL,
  sport_of_interest VARCHAR(80) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_students_student_id (student_id),
  UNIQUE KEY uq_students_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS administrators (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_administrators_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  student_id BIGINT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_reset_token_hash (token_hash),
  KEY idx_reset_student (student_id),
  CONSTRAINT fk_reset_student FOREIGN KEY (student_id)
    REFERENCES students (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS student_remember_tokens (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  student_id BIGINT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_remember_token_hash (token_hash),
  KEY idx_remember_student (student_id),
  CONSTRAINT fk_remember_student FOREIGN KEY (student_id)
    REFERENCES students (id) ON DELETE CASCADE
) ENGINE=InnoDB;
