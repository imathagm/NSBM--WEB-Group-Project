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
  INDEX idx_fixtures_section_order (section, display_order)
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
