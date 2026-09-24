---
type: "query"
date: "2026-09-23T04:39:43.197652+00:00"
question: "Implementation plan for CampusFlow: redo landing page with 21st components + 5-color palette, add login/register pages, wire auth to backend?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["App.jsx", "main.jsx", "vite.config.js", "Frontend/package.json", "Hero.jsx", "Features.jsx", "userapi.js", "server.js", "User.js", "verifyToken.js"]
---

# Q: Implementation plan for CampusFlow: redo landing page with 21st components + 5-color palette, add login/register pages, wire auth to backend?

## Answer

Graph refreshed via raw CLI (native graphify_* tools fail: bun PATH bug). Blast radius: main.jsx -> App.jsx -> Hero.jsx + Features.jsx + inline nav/CTA/footer; index.css holds old #0a0b0a/#c8b4a0 theme; no react-router-dom installed. Plan: (1) tokens in index.css via Tailwind v4 @theme { --color-molten-lava:#780000; --color-brick-red:#c1121f; --color-papaya-whip:#fdf0d5; --color-deep-space-blue:#003049; --color-steel-blue:#669bbc; } + :root gradient vars (linear 0/45/90/135/180/225/270/315deg + radial). (2) add react-router-dom; main.jsx wraps BrowserRouter; create pages/Landing.jsx (moves nav+Hero+Features+CTA+footer+GSAP [data-reveal] effect out of App.jsx), pages/Login.jsx, pages/Register.jsx; routes /, /login, /register. (3) 21st picks: hero 8156 or 18625, bento features 27082/18898 (or keep local Features.jsx), pricing 8403, CTA 28155/28147, navbar 2046/4003, footer 8284/1614, auth 2677 (covers sign-in+sign-up+forgot) or 28499/2429/2431. (4) QUOTA RISK: get_component 0/2 left today - fallback = npx shadcn add install commands or hand-adapt local components with new palette. (5) Backend auth ready: POST /user-api/register, POST /user-api/login (httpOnly cookie token, JWT 1d), GET /user-api/logout, GET /user-api/check-auth, POST /user-api/forgot; model usermodel; middleware verifyToken; server port 4000, CORS *, cookie-parser; frontend fetch must use credentials:include; rate limit 1 req/min/IP - beware form retries. GSAP: keep existing gsap.context + data-reveal pattern, scoped per page.

## Outcome

- Signal: useful

## Source Nodes

- App.jsx
- main.jsx
- vite.config.js
- Frontend/package.json
- Hero.jsx
- Features.jsx
- userapi.js
- server.js
- User.js
- verifyToken.js