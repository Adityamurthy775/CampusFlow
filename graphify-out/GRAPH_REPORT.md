# Graph Report - CampusFlow  (2026-09-23)

## Corpus Check
- 45 files · ~16,051 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: .http 15, (none) 3, .css 1)

## Summary
- 246 nodes · 326 edges · 17 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `375b2ddf`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- server.js
- 🎓 CampusFlow
- Frontend/package.json
- Backend/package.json
- Module Details
- 📡 API Endpoint Reference
- App.jsx
- devDependencies
- Apis/submission.js
- dependencies
- Apis/drive.js
- Apis/events.js
- Apis/faculty.js
- Apis/subject.js
- React + Vite

## God Nodes (most connected - your core abstractions)
1. `express` - 17 edges
2. `mongoose` - 17 edges
3. `📡 API Endpoint Reference` - 16 edges
4. `Module Details` - 15 edges
5. `🎓 CampusFlow` - 14 edges
6. `🔄 System Flowcharts` - 11 edges
7. `🚀 Setup & Installation` - 6 edges
8. `scripts` - 5 edges
9. `🌐 Frontend — Structure & Working` - 5 edges
10. `react` - 4 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (17 total, 0 thin omitted)

### Community 0 - "server.js"
Cohesion: 0.07
Nodes (30): announcementapp, attendanceapp, collegeapp, companyapp, courseapp, deptapp, requestapp, studentapp (+22 more)

### Community 1 - "🎓 CampusFlow"
Cohesion: 0.05
Nodes (38): 10. Soft Delete & Error Handling Flow, 1. Clone & Navigate, 1. Overall Request Flow, 2. Backend Setup, 2. User Registration & Authentication Flow, 3. Assignment & Submission Flow, 3. Frontend Setup, 4. Attendance Flow (+30 more)

### Community 2 - "Frontend/package.json"
Cohesion: 0.08
Nodes (26): dependencies, gsap, lucide-react, react, react-dom, name, private, scripts (+18 more)

### Community 3 - "Backend/package.json"
Cohesion: 0.11
Nodes (19): userapp, verifyToken(), usermodel, author, description, keywords, license, main (+11 more)

### Community 4 - "Module Details"
Cohesion: 0.12
Nodes (17): 📢 Announcement Module (`modules/announcement.js`), 📝 Assignment Module (`modules/assignment.js`), 📅 Attendance Module (`modules/attendance.js`), ⚙️ Backend — Modules & APIs, 🏫 College Module (`modules/college.js`), 🏢 Company Module (`modules/company.js`), 📚 Course Module (`modules/courses.js`), 🏢 Department Module (`modules/department.js`) (+9 more)

### Community 5 - "📡 API Endpoint Reference"
Cohesion: 0.12
Nodes (16): Announcement API (`/announcement-api`), 📡 API Endpoint Reference, Assignment API (`/assignment-api`), Attendance API (`/attendance-api`), College API (`/college-api`), Company API (`/company-api`), Course API (`/course-api`), Department API (`/dept-api`) (+8 more)

### Community 6 - "App.jsx"
Cohesion: 0.23
Nodes (9): App(), links, cards, Feature(), colors, Hero(), gsap, lucide-react (+1 more)

### Community 7 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, tailwindcss, @tailwindcss/vite (+4 more)

### Community 8 - "Apis/submission.js"
Cohesion: 0.27
Nodes (6): assignmentapp, submissionapp, assignmentmodel, assignmentschema, submissionmodel, submissionschema

### Community 9 - "dependencies"
Cohesion: 0.22
Nodes (9): dependencies, bcryptjs, cookie-parser, dotenv, express, jsonwebtoken, mongoose, multer (+1 more)

### Community 10 - "Apis/drive.js"
Cohesion: 0.50
Nodes (3): driveapp, drivemodel, driveschema

### Community 11 - "Apis/events.js"
Cohesion: 0.50
Nodes (3): eventapp, eventmodel, eventschema

### Community 12 - "Apis/faculty.js"
Cohesion: 0.50
Nodes (3): facultyapp, facultymodel, facultySchema

### Community 13 - "Apis/subject.js"
Cohesion: 0.50
Nodes (3): subjectapp, subjectmodel, subjectschema

### Community 14 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

## Knowledge Gaps
- **129 isolated node(s):** `rateLimitStore`, `userschema`, `announcementschema`, `assignmentschema`, `attendanceschema` (+124 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 137 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `mongoose` connect `server.js` to `Backend/package.json`, `Apis/submission.js`, `Apis/drive.js`, `Apis/events.js`, `Apis/faculty.js`, `Apis/subject.js`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `🎓 CampusFlow` connect `🎓 CampusFlow` to `Module Details`, `📡 API Endpoint Reference`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Why does `express` connect `server.js` to `Backend/package.json`, `Apis/submission.js`, `Apis/drive.js`, `Apis/events.js`, `Apis/faculty.js`, `Apis/subject.js`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **What connects `rateLimitStore`, `userschema`, `announcementschema` to the rest of the system?**
  _129 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `server.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06509803921568627 - nodes in this community are weakly interconnected._
- **Should `🎓 CampusFlow` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `Frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.0812807881773399 - nodes in this community are weakly interconnected._