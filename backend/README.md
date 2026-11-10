# SportsHub fixture database

The Matches & Tournaments page loads match dates, times, venues, and scheduled opponents from `api/fixtures.php`.

## Database setup

1. Run `database/schema.sql` with a MySQL account that can create the `nsbm_sportshub` database and table.
   For an existing installation, run `database/migrations/20261031_update_scheduled_demo_opponents.sql` to add the SLIIT and KDU demonstration opponents while leaving the netball opponent unannounced.
   The schema includes account, password-reset, remember-session, and administrator tables. For an existing installation, apply `database/migrations/20261104_password_recovery.sql`, `database/migrations/20261109_account_tables.sql`, and `database/migrations/20261110_student_auth_profile.sql` in that order.
2. Configure the PHP process environment with `NSBM_DB_HOST`, `NSBM_DB_NAME`, and `NSBM_DB_USER`. Set `NSBM_DB_PASSWORD` and optionally `NSBM_DB_PORT` as needed. Do not put credentials in the repository.
3. Use a PHP installation with PDO MySQL enabled and serve the repository root through PHP or a web server configured to execute PHP. With XAMPP, start MySQL, import `database/schema.sql` in phpMyAdmin, then run this from PowerShell in the repository root (replace the password placeholder with your local MySQL password):

   ```powershell
   $env:NSBM_DB_HOST = "127.0.0.1"
   $env:NSBM_DB_NAME = "nsbm_sportshub"
   $env:NSBM_DB_USER = "root"
   $env:NSBM_DB_PASSWORD = "<your local MySQL password>"
   & "C:\xampp\php\php.exe" -S localhost:8000 -t .
   ```

   Keep that PowerShell window open. The PHP server runs the APIs; VS Code Live Server alone cannot run PHP.
4. Open `http://localhost:8000/frontend/student/matches-tournaments.html` to use the fixtures API. Opening HTML directly as a `file://` URL cannot access the API.
5. Student registration and sign-in use `api/auth/register.php`, `api/auth/login.php`, `api/auth/session.php`, and `api/auth/logout.php`. Open `http://localhost:8000/frontend/login/login.html` or `http://localhost:8000/frontend/pages/login.html`. Student portal pages require a valid PHP session; the “Remember me” option uses a rotating, HTTP-only cookie.
6. Create an administrator from the command line with `php database/create_admin.php`. This creates an administrator credential record only; server-side administrator sign-in and management APIs are not implemented.

The seeded Upcoming Matches deliberately have null dates, times, and venues because no verified values were available. They display as “To Be Announced” until updated in MySQL. Scheduled event dates, times, and venues retain the proposed values supplied for the page. A subset of opponent pairings is flagged as demonstration data and is not an officially confirmed fixture.
