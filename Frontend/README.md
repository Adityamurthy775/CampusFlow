# CampusFlow Frontend

The CampusFlow frontend is a React 19 single-page application built with Vite. It provides the public landing experience, authentication, and role-aware dashboards for students, faculty, HODs, placement officers, and administrators.

## 🏗️ Architecture

The UI sends authenticated HTTP requests through `src/lib/api.js` to the Express backend. The backend applies middleware and role checks, then reads or writes MongoDB through Mongoose models.

[![CampusFlow backend request architecture](../docs/diagrams/campusflow-architecture.png)](../docs/diagrams/campusflow-architecture.html)

Additional diagrams:

- [Browser request flow](../docs/diagrams/campusflow-request-flow.html)
- [JWT authentication sequence](../docs/diagrams/campusflow-authentication-sequence.html)
- [Backend setup and API reference](../Backend/README.md)

## 🛠️ Stack

- React 19 and React DOM
- Vite 8
- Tailwind CSS 4 through the Vite plugin
- ESLint 10
- Motion and GSAP for interface animation
- Three.js for the introduction visual

## 🚀 Getting started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm
- CampusFlow backend running on port `4000`

### Install and run

```bash
cd Frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

To use another API origin, create `Frontend/.env.local`:

```env
VITE_API_URL=http://127.0.0.1:4000
```

Restart Vite after changing environment variables.

## 📁 Project structure

```text
Frontend/
├── public/                 # Favicon and static public assets
└── src/
    ├── components/         # Landing-page sections and reusable UI
    ├── lib/
    │   ├── api.js          # Fetch wrapper and API base URL
    │   ├── auth.jsx        # Authentication context and session refresh
    │   ├── router.jsx      # Lightweight hash router
    │   └── useCampusStore.js
    ├── pages/
    │   ├── landing.jsx
    │   ├── login.jsx
    │   ├── signup.jsx
    │   ├── dashboard.jsx
    │   └── dashboardFeatures.jsx
    ├── App.jsx             # Providers, routes, and intro preloader
    ├── common.js           # Shared design tokens and content
    └── index.css           # Global styles
```

## 🧭 Routes and state

CampusFlow uses a small hash router so it can be hosted without server-side route rewrites:

- `#/` — landing page
- `#/login` — login
- `#/signup` — student registration
- `#/dashboard` — authenticated dashboard
- `#/dashboard/<feature>` — dashboard feature views

`AuthProvider` calls `/user-api/check-auth` on startup. Login and other browser requests use `credentials: "include"` so the backend's HTTP-only `token` cookie is sent automatically. Authenticated dashboard routes redirect to login when no active user is found.

Dashboard navigation is adapted to the current role. Student, faculty, HOD, placement-office, and admin views expose different feature menus while sharing the same API and page shell.

## ✅ Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## 🔗 Backend integration

The API wrapper supports JSON requests, `FormData` uploads, authenticated downloads, and structured API errors. The default backend origin is `http://127.0.0.1:4000`; set `VITE_API_URL` to override it.

The backend only permits configured browser origins and uses credentialed cookies. Keep `CLIENT_ORIGIN` on the backend aligned with the origin used to open the frontend.
