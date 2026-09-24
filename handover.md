# CampusFlow Handover

Updated: 2026-09-24

## Project structure

- Frontend: `Frontend/`
- Backend: `Backend/`
- Frontend: React 19, Vite 8, JavaScript/JSX, Tailwind CSS 4
- shadcn configuration: `Frontend/components.json`
- UI component directory: `Frontend/src/components/ui/`
- Landing composition: `Frontend/src/pages/landing.jsx`
- Home content: `Frontend/src/components/home.jsx`
- Navbar: `Frontend/src/components/navbar.jsx`
- Footer: `Frontend/src/components/footer.jsx`
- Static campus data: `Frontend/src/lib/useCampusStore.js`
- Role dashboards: `Frontend/src/pages/dashboard.jsx`
- Dashboard styles: `Frontend/src/pages/dashboard.css`
- Shared palettes: `Frontend/src/common.js`

## Homepage structure

The homepage no longer includes the Glyph Portal transition, B.Tech subjects, or timetable content after the hero.

Current order:

1. Navbar
2. Horizon hero
3. Stacking cards
4. Story sections
5. Website feature cards
6. Footer

The Glyph Portal component remains available in `Frontend/src/components/ui/glyph-portal.jsx` but is not mounted on the homepage.

## Navigation and preloader

- The homepage overlay/side menu is no longer mounted.
- `Frontend/src/components/navbar.jsx` provides the persistent regular navbar with Home, Features, Dashboard, and Join CampusFlow actions.
- The navbar is composed inside `landing.jsx` and uses a sticky light header over the hero.
- The preloader runs on every fresh full-page load and once during that page session.
- Every `CAMPUSFLOW` preloader letter uses spicy paprika; the single-letter zoom artifact was replaced with a subtle whole-word scale.

## Role dashboards

`Frontend/src/pages/dashboard.jsx` now renders a shared responsive portal shell with dedicated views for:

- Student: timetable, announcements, assignments, and course progress.
- Faculty: lectures, department activity, submissions, and section overview.
- HOD: performance trends, approvals, faculty status, resources, and events.
- Placement Office: placement trends, department distribution, recruitment drives, offers, and eligibility.
- Admin: active users, module usage, quick actions, audit activity, sessions, and diagnostics.

The views follow the supplied dark-sidebar dashboard references without adding a chart dependency. Charts use inline SVG and donut charts use CSS gradients. Student curriculum data remains limited to the `CSE-DSA` third-year first-semester curriculum; unavailable schedules render an explicit empty state.

Admin authentication is enabled through the user role enum, `check-auth`, user listing, and self-service password change. Admin and HOD roles cannot be created through public signup. HOD-managed updates are limited to editable profile fields and cannot modify or deactivate privileged accounts.

## Functional workspace (all roles)

`Frontend/src/pages/dashboardFeatures.jsx` powers every sidebar feature and routes through `/dashboard/:section`. Each section loads only its scoped data and every action calls a real, authenticated backend endpoint.

Feature sections and permissions:

| Section | Reads (role-scoped) | Writes |
| --- | --- | --- |
| Courses | `/subject-api/all` (non-student) or `/subject-api/curriculum/btech-3` (student) | — |
| Schedule | `/timetable-api/current?branch&year&semester` | — |
| Assignments | `/assignment-api/all`, `/submission-api/all` | Teacher/HOD/Admin create via `POST /assignment-api/create` (multipart); Student submits via `POST /submission-api/create/:id` (multipart) |
| Attendance | `/attendance-api/all` (own/subject scoped) | Teacher/HOD/Admin `POST /attendance-api/mark` |
| Grades | `/submission-api/all` | Teacher/HOD/Admin `PATCH /submission-api/review/:id` |
| Events | `/event-api/all` | All roles `POST /event-api/create`; non-privileged events are stored pending |
| Announcements | `/announcement-api/all` | Teacher/HOD/Admin/Placement `POST /announcement-api/create` |
| Requests & Leave | `/request-api/all` (own for non-reviewers) | All roles `POST /request-api/create` (multipart, optional file); HOD/Admin `PATCH /request-api/review/:id` |
| Placement | `/company-api/all`, `/drive-api/all` | Admin/HOD/Placement create companies and drives |
| People | `/user-api/all` (role-scoped) | Admin updates roles and deactivates users |
| Reports | aggregates the section APIs | Client-side CSV export |

Uploads (assignment briefs, student answers, request attachments) are stored on disk under `Backend/uploads` via `Backend/middleware/upload.js` (10 MB limit, extension allowlist). Upload endpoints accept `multipart/form-data` and the frontend `api.upload`/`api.download` helpers handle FormData and blob downloads.

The demo teacher (`teacher.demo@campusflow.local`) is added to every seeded subject as additional faculty, so the demo teacher can create assignments for all subjects. `seed-academic-data.js` re-runs safely.

All role names map to backend role strings: `teacher` → faculty, `placement-office` → placement, plus `student`, `hod`, `admin`.

## API security

- Every write route in `college-api`, `course-api`, `dept-api`, `faculty-api`, and `student-api` now requires an authenticated role; reads on `college-api`/`course-api`/`dept-api` remain public.
- `verifyToken` resolves the live role from the database (`req.role`), so a stale token's role claim is never trusted on its own.
- Assignment create/update/delete, submission review, attendance mark, event/announcement mutation, and request review all enforce ownership or privilege checks server-side (no IDOR).
- `/user-api/forgot` returns 410; password changes require the authenticated change-password flow.
- Public signup only creates `student` accounts.

## Card palette

Large stacking cards use the Coolors palette stored in `colorPalettes.bigCardThemes`:

- `#0d1321`
- `#1d2d44`
- `#3e5c76`
- `#748cab`
- Text: `#f0ebd8`

Large cards use solid backgrounds, palette-matched borders/shadows, and no gradient, shine, filter, or text-shadow treatment.

Feature cards use the complete five-family 100–900 palette and gradients from `colorPalettes.cardThemes`, with no text-shadow, brightness, or saturation shine effects.

The four story cards beginning with `01 — The day` use the second Coolors palette from `colorPalettes.storyCardThemes`:

- `#dad7cd`
- `#a3b18a`
- `#588157`
- `#3a5a40`
- `#344e41`

Each section receives a solid background plus contrast-safe text, rule, accent, muted copy, and button colors.

## Website features

`Frontend/src/lib/useCampusStore.js` exports static navigation, experience-card, story, feature, and footer data through a tiny native selector.

`Frontend/src/components/home.jsx` consumes that store and renders feature cards for:

- Unified dashboard
- Role-based access
- Academic progress
- Campus opportunities
- Announcements and events
- Shared workflows

The feature section appears after the story cards and before the footer. Project-detail cards were removed.

## Student curriculum

Curriculum is shown only after an authenticated user reaches `Frontend/src/pages/dashboard.jsx`.

Backend data:

- `Backend/modules/btech3Curriculum.js`
- B.Tech Data Science
- Branch `CSE-DSA`
- Year 3, Semester 1
- 12 subjects
- 6 weekly schedule days

Endpoints:

```text
GET /subject-api/curriculum/btech-3
GET /subject-api/curriculum/btech-3?day=Monday
```

The dashboard fetches the curriculum for a third-year first-semester student and renders the subject list in the schedule card. No curriculum data is rendered by `landing.jsx`.

The subject schema supports `year`, `semester`, and `branch`. Teacher population uses a safe projection and does not expose password hashes.

## Academic schemas and timetable seed

The backend now includes:

- Extended faculty records: employee code, department/college links, designation, qualifications, specialization, office, phone, office hours, and profile image.
- Room records: code, name, room type, building, floor, capacity, and active state.
- Timetable records: branch, year, semester, academic year, day, period times, period type, subject, faculty, and room references.
- Subject co-faculty references through `additionalFaculty`.

Seed all supplied B.Tech III academic data with:

```bash
cd Backend
npm run seed:academic
```

The seed is repeatable and creates/updates the college, Data Science department, B.Tech Data Science course, faculty users/profiles, rooms, subjects, and the published weekly timetable.

Authenticated endpoints:

```text
GET /faculty-api/all
GET /room-api/all
GET /room-api/info/:id
GET /timetable-api/current?branch=CSE-DSA&year=3&semester=1
GET /timetable-api/day/Monday?branch=CSE-DSA&year=3&semester=1
```

All timetable and room reads require a logged-in campus user and return populated safe faculty/subject/room fields.

## Registration conflict handling

Duplicate email or Campus ID correctly returns HTTP 409.

The response identifies the conflicting fields:

```json
{
  "message": "Email and Campus ID are already registered",
  "fields": ["email", "id"]
}
```

The frontend displays the message and provides a `Sign in instead` action.

The local database contains a legacy unique `studentid` index. Registration now writes both `id` and `studentid`, and conflict handling maps `studentid` back to the Campus ID field. Public signup is limited to student accounts only; Teacher, Placement Office, Admin, and HOD accounts are provisioned through the demo/academic seeds.

## Demo role logins

The four original demo accounts were login-verified against the running backend. The Admin demo account is included in the repeatable seed and is pending verification because the command runner is unavailable.

```text
Admin
Email: admin.demo@campusflow.local
Password: CampusFlow@2026
Campus ID: CF-DEMO-ADMIN

Student
Email: student.demo@campusflow.local
Password: CampusFlow@2026
Campus ID: CF-DEMO-3Y-DSA

Teacher
Email: teacher.demo@campusflow.local
Password: CampusFlow@2026
Campus ID: CF-DEMO-TEACHER

HOD
Email: hod.demo@campusflow.local
Password: CampusFlow@2026
Campus ID: CF-DEMO-HOD

Placement Office
Email: placement.demo@campusflow.local
Password: CampusFlow@2026
Campus ID: CF-DEMO-PLACEMENT
```

Re-seed at any time:

```bash
cd Backend
npm run seed:demo
```

Run the academic seed too so the demo teacher is attached to every subject:

```bash
cd Backend
npm run seed:academic
```

## Environment

`Frontend/.env.local`:

```env
VITE_API_URL=http://localhost:4000
```

Start the backend:

```bash
cd Backend
npm start
```

Start the frontend:

```bash
cd Frontend
npm run dev
```

## Vite recovery

For `504 (Outdated Optimize Dep)`:

```bash
cd Frontend
rmdir /s /q node_modules\\.vite
npm run dev
```

Restart the dev server and hard-refresh the browser afterward.

## Verification completed

- Frontend ESLint and production build previously passed before the latest role-dashboard and native-store changes; both still need a fresh run.
- The static campus data selector removes the missing `zustand` runtime dependency, so Vite no longer needs an install to resolve `useCampusStore.js`.
- Vite dependency optimization — passed for React, Motion, GSAP, and `@gsap/react`.
- Backend syntax checks passed before the Admin and user-permission changes; the updated files still need a fresh syntax check.
- Curriculum data assertions — passed.
- Isolated curriculum HTTP endpoint — passed.
- Demo seed — passed for the original four roles; the new five-role seed is pending.
- The new role-dashboard source and Admin permission boundaries were reviewed statically; runtime checks remain blocked by the command runner.
- Student, teacher, HOD, and placement-office logins against `http://127.0.0.1:4000` — passed.
- Duplicate registration against MongoDB — returned the expected 409 contract.
- Homepage search confirmed no `B.Tech`, subject, timetable, curriculum, Glyph Portal, or landing-mounted navigation content.
- The new academic models, API routes, and `seed-academic-data.js` were added, but syntax/seed execution is pending because the command runner cannot spawn processes in this session.
- The functional workspace (`dashboardFeatures.jsx`), assignment/submission/request/attendance/event/announcement/company/drive APIs, and the drive-model ref relaxation were reviewed statically against the seed contracts; runtime is pending.
- Graphify refresh remains blocked on Windows by `bun: command not found: sh`.

## Manual release checks

- [ ] Hard-refresh and confirm the preloader appears.
- [ ] Confirm the regular navbar stays visible and the old overlay menu is absent.
- [ ] Confirm Home, Navbar, Footer, and feature data are separated into their component/store files.
- [ ] Confirm feature cards appear after the story sections and contain website features rather than project details.
- [ ] Confirm story cards 01–04 use the solid `#dad7cd` / `#a3b18a` / `#588157` / `#344e41` palette.
- [ ] Confirm large and feature cards have no shine, text-shadow, brightness, or saturation effects.
- [ ] Log in with each of the five role credentials, re-seed first so the Admin account exists.
- [ ] Confirm Student, Faculty, HOD, Placement Office, and Admin render their matching dashboard layouts.
- [ ] Confirm the Student timetable shows the current weekday and an empty state when no matching curriculum exists.
- [ ] Confirm the sidebar collapses on tablet and logout remains available on mobile.
- [ ] Confirm public signup does not offer or accept Admin/HOD roles.
- [ ] Run `npm run seed:academic` and confirm the published timetable, faculty, room, and subject counts.
- [ ] Log in and verify `/timetable-api/current` and `/timetable-api/day/Monday`.
- [ ] Confirm the dashboard displays the B.Tech third-year subjects.
- [ ] Confirm duplicate registration shows the field-specific 409 message and sign-in action.
- [ ] Log in as the demo teacher and create an assignment for any seeded subject (teacher is additional faculty on every subject).
- [ ] Log in as the demo student, submit the assignment, then log in as the teacher and review it with marks/grade/feedback.
- [ ] Student downloads an assignment brief and teacher downloads the student's answer file.
- [ ] As teacher, mark attendance for a subject; as student, the attendance record appears.
- [ ] As any role, create an event; as HOD/Admin/Placement, the event is published immediately, otherwise it is pending.
- [ ] As a student, submit a leave request; as HOD/Admin, review it and confirm the requester sees the decision.
- [ ] As placement office, add a company and create a drive; the student and other roles can view both.
- [ ] As admin, change a user's role and deactivate a user from the People section.
- [ ] Open each Reports card and export a non-empty CSV for records that exist.
- [ ] Confirm unauthenticated requests to `/college-api/info` (POST), `/course-api/update/:id`, and `/faculty-api/basic-info` are rejected with 401.
- [ ] Upload a file larger than 10 MB and confirm it is rejected.
