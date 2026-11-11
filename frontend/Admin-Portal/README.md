# NSBM SportsHub Admin Portal

The nine Admin Portal pages share the interface in `admin.js` and the shared
`frontend/app.css` stylesheet. The portal uses the PHP session APIs and
database-backed management APIs in `backend/api/admin/`.

## Pages

- `dashboard.html` — administrative overview and recent activity
- `students.html` — student directory and membership pathways
- `clubs.html` — sports club records and related members/schedules
- `applications.html` — membership application review
- `training.html` — training schedule management
- `matches-tournaments.html` — event management and student tournament entries
- `announcements.html` — draft, preview, publication, and maintenance
- `facilities.html` — facility/equipment booking requests and decisions
- `reports.html` — database-derived counts and CSV export

## Requirements

Import `backend/database/schema.sql` (or apply the backend migrations to an
existing database), configure the PHP database environment variables, and
create an administrator with `php database/create_admin.php` from the
`backend/` directory. Serve the repository root through PHP and sign in at
`frontend/login/login.html?view=admin#admin`. Directly opening an HTML file or
using Live Server alone will not run the APIs.

The student directory can include registered student accounts and
directory-only records. Directory-only entries do not have account credentials.
All management mutations are validated and authorized by the server; session
storage is used only for the visual theme preference.
