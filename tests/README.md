# Project checks

Run these from the project root. Node.js 20 or newer is needed for the JavaScript checks.
No npm packages are needed.

```powershell
node tests/check-project.mjs
node --test tests/check-auth-client.mjs
```

The first checks local links, images, styles, JavaScript syntax, merge markers
and duplicate HTML IDs. The second checks concurrent session requests, retrying
a failed request, and sending the CSRF token when signing in.

## Database checks

Use a **separate test database** and a PHP server configured to use it.
Import a copy of `backend/database/schema.sql`, replacing `nsbm_sportshub` with
your test database name in that copy. Create an admin in the test database using
`backend/database/create_admin.php` with the same database environment settings.

The API checks create records and remove them afterwards. Admin activity entries
remain in the test database. Do not point these checks at your normal project data.

For a test PHP server at `http://localhost:8001/`:

```powershell
$env:SPORTSHUB_TEST_URL = "http://localhost:8001/"
$env:SPORTSHUB_TEST_ADMIN_EMAIL = "your test administrator email"
$env:SPORTSHUB_TEST_ADMIN_PASSWORD = "your test administrator password"
node tests/check-api.mjs
```

The 22 checks cover authorization, session handling, input validation, account
creation, duplicate prevention, club applications, approval, schedules, renaming,
tournament registration, booking conflicts, announcements, profiles and deletion.

To test password reset tokens without sending emails, set `NSBM_DB_HOST`,
`NSBM_DB_PORT`, `NSBM_DB_NAME`, `NSBM_DB_USER` and `NSBM_DB_PASSWORD` to the **same
test database** used by that PHP server, then run:

```powershell
php tests/check-password-reset.php
```

This checks expired links, short passwords, the stored password change, single-use
tokens and removal of remembered logins. It creates and removes one test account.
It does not verify real SMTP delivery; that needs valid mail credentials.
