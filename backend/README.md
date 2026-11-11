# SportsHub backend

The backend is PHP 8.1+ with PDO MySQL and a MySQL/MariaDB database. Serve the
repository root through PHP or Apache; opening the HTML files directly or using
VS Code Live Server alone will not execute the APIs.

## Database setup

1. For a fresh database, import `database/schema.sql`. For an existing database,
   apply any migrations that have not already been run, in order:
   `20261031_update_scheduled_demo_opponents.sql`,
   `20261104_password_recovery.sql`,
   `20261109_account_tables.sql`,
   `20261110_student_auth_profile.sql`, and
   `20261111_backend_integration.sql`. If the existing database already has
   migrations through `20261110`, apply only `20261111_backend_integration.sql`.
   Do not rerun an already-applied `ALTER TABLE` migration.
2. Configure `NSBM_DB_HOST`, `NSBM_DB_NAME`, `NSBM_DB_USER`, and
   `NSBM_DB_PASSWORD` in the PHP process environment. `NSBM_DB_PORT` is
   optional. The default database name is `nsbm_sportshub`. Do not commit
   database or mail credentials.
3. Ensure PDO MySQL is enabled. With XAMPP, start Apache and MySQL, then run
   this in PowerShell from the repository root (replace the password locally):

   ```powershell
   $env:NSBM_DB_HOST = "127.0.0.1"
   $env:NSBM_DB_NAME = "nsbm_sportshub"
   $env:NSBM_DB_USER = "root"
   $env:NSBM_DB_PASSWORD = "<your local MySQL password>"
   & "C:\xampp\php\php.exe" -S localhost:8000 -t .
   ```

   Keep the terminal open while using the app. Open pages under
   `http://localhost:8000/`.

## Accounts and administration

- Student registration and sign-in use `api/auth/register.php` and
  `api/auth/login.php`. Student session checks and sign-out use
  `api/auth/session.php` and `api/auth/logout.php`. Authenticated students can
  update their profile and photo through `api/auth/profile.php`.
- Password recovery uses `api/forgot-password.php` and
  `api/reset-password.php`. Install the locked PHP dependencies with Composer
  from `backend/`, then create `config/mail-config.php` using
  `config/mail-config.example.php` as a template and set valid SMTP credentials
  and the app base URL. Without SMTP configuration, recovery reports that the
  service is unavailable rather than creating unusable reset links.

  ```powershell
  Set-Location backend
  composer install
  Copy-Item config\mail-config.example.php config\mail-config.php
  ```
- Create an administrator from a terminal in `backend/` with
  `php database/create_admin.php`. Use the administrator tab at
  `frontend/login/login.html?view=admin#admin`. Admin pages require a PHP
  session; all management API requests also check authorization and CSRF.
- Admin-managed student directory records, clubs, membership applications,
  training sessions, events, announcements, and facility bookings are stored
  in MySQL. Student accounts created through the registration form appear in
  the student directory; deleting a linked account from that directory also
  deletes its login account and tournament entries. Directory-only records do
  not create login accounts.
- Tournament entry submissions require a signed-in student and are saved in
  MySQL. Administrators can review them in the Admin Portal's Matches &
  Tournaments page.
- `api/fixtures.php` serves the seeded fixtures used by the student matches
  page. Unconfirmed demonstration pairings are marked as such in the database.

The seeded Upcoming Matches deliberately have null dates, times, and venues
because no verified values were available. They display as “To Be Announced”
until updated in MySQL.
