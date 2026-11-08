# NSBM SportsHub Admin Portal

This folder contains nine standalone Admin Portal entry pages. They share the
same header, sidebar, theme, responsive layout, and page interactions through
`admin.css` and `admin.js`.

## Pages

- `dashboard.html` — administrative overview and quick actions
- `students.html` — student directory and membership pathways
- `clubs.html` — sports club records and related members/schedules
- `applications.html` — membership application review
- `training.html` — training schedule management
- `matches-tournaments.html` — matches, tournaments, fixtures, and results
- `announcements.html` — draft, preview, and publication workflow
- `facilities.html` — facility/equipment booking requests and session-only booking overview
- `reports.html` — derived counts and CSV export

## Current implementation boundary

The inspected project database does not currently define the student, club,
membership, training, announcement, or booking data needed by these pages.
Consequently, there are no seeded records and the displayed counts start at
zero. Records entered in this prototype are held in browser `sessionStorage`
for the current tab session only. Do not enter real student or confidential
information.

This frontend is **not an authenticated admin system**. The project needs
server-side sign-in, role authorization on every management endpoint, and
appropriate database tables/API behavior before using real data or deploying
administrative operations. Hiding or showing navigation in the browser is not
access control.

Serve the `frontend` directory using a local web server and open
`Admin-Portal/dashboard.html`. The portal uses the shared `frontend/assets`
NSBM logo and remote Google Fonts/Font Awesome resources.
