USE nsbm_sportshub;

UPDATE sports_fixtures
SET opponent_name = 'SLIIT',
    opponent_code = 'SLIIT',
    is_demo = TRUE
WHERE fixture_id = 'scheduled-inter-faculty-football'
  AND section = 'scheduled'
  AND opponent_name IS NULL;

UPDATE sports_fixtures
SET opponent_name = 'General Sir John Kotelawala Defence University',
    opponent_code = 'KDU',
    is_demo = TRUE
WHERE fixture_id = 'scheduled-cricket'
  AND section = 'scheduled'
  AND opponent_name IS NULL;

SELECT fixture_id, opponent_name, opponent_code, is_demo
FROM sports_fixtures
WHERE section = 'scheduled'
ORDER BY display_order, fixture_id;
