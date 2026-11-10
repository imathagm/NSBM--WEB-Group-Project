# SportsHub fixture database

The Matches & Tournaments page loads match dates, times, venues, and scheduled opponents from `api/fixtures.php`.

## Database setup

1. Run `database/schema.sql` with a MySQL account that can create the `nsbm_sportshub` database and table.
   For an existing installation, run `database/migrations/20261031_update_scheduled_demo_opponents.sql` to add the SLIIT and KDU demonstration opponents while leaving the netball opponent unannounced.
2. Configure the PHP process environment with `NSBM_DB_HOST`, `NSBM_DB_NAME`, and `NSBM_DB_USER`. Set `NSBM_DB_PASSWORD` and optionally `NSBM_DB_PORT` as needed. Do not put credentials in the repository.
3. Use a PHP installation with PDO MySQL enabled and serve the repository root through PHP or a web server configured to execute PHP.
4. Open `frontend/Student-Matches and Tournaments(Arshi)/index.html` through that same web server. The page requests `backend/api/fixtures.php`; opening the HTML directly as a `file://` URL cannot access the API.

The seeded Upcoming Matches deliberately have null dates, times, and venues because no verified values were available. They display as “To Be Announced” until updated in MySQL. Scheduled event dates, times, and venues retain the proposed values supplied for the page. A subset of opponent pairings is flagged as demonstration data and is not an officially confirmed fixture.
