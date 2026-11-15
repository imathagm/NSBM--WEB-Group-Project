# NSBM SportsHub - Group 28

A student project for sports clubs, membership applications, training, matches,
tournaments and announcements. Students and administrators have separate portals.
The project uses HTML, CSS, JavaScript, PHP 8.1+ and MySQL/MariaDB.

## Run the project

1. Install XAMPP with PHP 8.1 or newer and start **MySQL**.
2. Open phpMyAdmin and import **backend/database/schema.sql** into a fresh database.
   If you already have project data, follow [the backend migration instructions](backend/README.md)
   instead of importing over it.
3. Open PowerShell in this project folder and start PHP:

   ~~~powershell
   & "C:\xampp\php\php.exe" -S localhost:8000 -t .
   ~~~

4. Leave the terminal open and visit **http://localhost:8000/**.

The default database settings are localhost, port 3306, database
**nsbm_sportshub**, user **root**, and an empty password. If your settings differ,
set these in the same terminal before starting PHP:

~~~powershell
$env:NSBM_DB_HOST = "127.0.0.1"
$env:NSBM_DB_PORT = "3306"
$env:NSBM_DB_NAME = "nsbm_sportshub"
$env:NSBM_DB_USER = "root"
$env:NSBM_DB_PASSWORD = "your local database password"
~~~

Opening an HTML file directly or using Live Server alone will not run PHP.
If a page says its records are unavailable, check that MySQL is running, the
schema has been imported, and PHP is using the correct database settings.

## Accounts and using the portals

- Create a student account using **Create Account** on the sign-in page.
- To create an administrator, open another terminal with the same database
  settings and run:

  ~~~powershell
  & "C:\xampp\php\php.exe" backend/database/create_admin.php
  ~~~

  Then use the **Administrator** tab on the account portal.
- Add clubs through the Admin Portal first. Students can use **Join Club** to
  submit applications. Administrators approve or reject them in **Applications**.
- Add training sessions, matches, tournaments and announcements through the
  Admin Portal. These appear on the student and public pages as appropriate.
- Tournaments need a registration deadline before students can register.
- Fresh databases contain no example clubs or events, so empty lists are normal
  until an administrator adds records.

## Password reset emails

From **backend/**, run **composer install**, then copy
**config/mail-config.example.php** to **config/mail-config.php**. Enter the SMTP
account details and set **app_base_url** to your project address, for example
**http://localhost:8000**. Keep real passwords out of Git.

Email delivery requires a working SMTP account. The app shows a clear error if
mail is not configured. Password reset tokens and password changes can be tested
separately using the checks below.

## Project checks

The project includes simple checks with no Node package installation required:

~~~powershell
node tests/check-project.mjs
node --test tests/check-auth-client.mjs
~~~

See [tests/README.md](tests/README.md) for database and password reset checks.
These checks use a separate test database.

Main portal styles are in **frontend/app.css**, scoped with **data-css-page**.
The club application form and profile also have their existing local styles.
Older duplicate page URLs redirect to the working portal pages.
