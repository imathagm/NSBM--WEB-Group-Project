# NSBM Sports Hub

## Account portal

The account portal is kept in `frontend/login/`; the existing club site remains
in place. The home page links to student sign-in/registration and the separate
administrator sign-in page. PHP endpoints use the shared database and session
helpers in `backend/config/`.

### Local setup

1. Install PHP with `pdo_mysql` enabled, MySQL, and a web server capable of
   executing PHP. From the repository root, import the schema. On PowerShell:

   ```powershell
   Get-Content .\backend\database\schema.sql | mysql -u root -p
   ```

2. Configure these environment variables for the PHP/web-server process. The
   database password belongs only in the server environment, never in frontend
   files:

   ```powershell
   $env:NSBM_DB_HOST = "127.0.0.1"
   $env:NSBM_DB_NAME = "nsbm_sports_hub"
   $env:NSBM_DB_USER = "your_mysql_user"
   $env:NSBM_DB_PASSWORD = "your_mysql_password"
   $env:NSBM_APP_BASE_URL = "http://localhost:8000"
   ```

   `NSBM_APP_BASE_URL` must be the externally reachable base URL of the site;
   use HTTPS in production. Password recovery sends email through PHP's
   configured `mail()` transport. Configure and test that transport before
   enabling account recovery in a deployed environment.

3. Configure the web document root as `frontend/`. For local development, set
   the environment variables in the same terminal session and run:

   ```powershell
   php -S localhost:8000 -t .\frontend
   ```

   Open `http://localhost:8000/index.html`. PHP must be available through a
   PHP-enabled web server; opening the files directly or using a static-only
   server will not run authentication.

4. Create the first administrator from a terminal in the repository root:

   ```powershell
   php .\backend\database\create_admin.php
   ```

   This CLI-only script stores only a `password_hash()` result and rejects
   duplicate administrator email addresses. Create additional administrators
   through the same controlled process.

The portal includes server-side student registration and login, a 30-day
remember-me token stored only as a hash, separate administrator sessions,
CSRF protection, protected dashboards, and one-hour single-use password reset
tokens. Reset requests intentionally return the same response whether or not
an email address is registered.
