USE nsbm_sportshub;

ALTER TABLE sports_fixtures
  ADD COLUMN registration_deadline DATE NULL AFTER start_time;

DELETE FROM sports_fixtures
WHERE fixture_id IN (
  'upcoming-badminton',
  'upcoming-cricket',
  'upcoming-football',
  'upcoming-basketball',
  'scheduled-inter-faculty-football',
  'scheduled-badminton',
  'scheduled-basketball',
  'scheduled-volleyball',
  'scheduled-cricket',
  'scheduled-netball',
  'scheduled-hockey'
);
