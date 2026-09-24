---
type: "query"
date: "2026-09-23T16:31:13.502162+00:00"
question: "Trace CampusFlow frontend entry to landing and audit requested UI concepts"
contributor: "graphify"
outcome: "useful"
source_nodes: ["main.jsx", "App.jsx", "App\\(\\)", "Hero.jsx", "Hero\\(\\)", "Features.jsx", "Feature\\(\\)", "cards", "colors", "links"]
---

# Q: Trace CampusFlow frontend entry to landing and audit requested UI concepts

## Answer

Graph path: main.jsx imports App.jsx/App() at Frontend/src/main.jsx:L4; App.jsx imports Features.jsx and Hero.jsx at L4-L5. Features.jsx has cards L4 and Feature() L31; Hero.jsx has colors L4 and Hero() L11. No graph nodes or edges were found for preloader, Sterling Gate navigation, stacking cards, story sections, big-card sections, shared buttons, handover, common.js, light palette, router, route, landing-page node, or Micro-Volunteer Match. Generic links node is inside App.jsx L9. Report metadata: 45 files, 20 unclassified including one CSS; absence is graph absence, not filesystem proof. Built commit 375b2ddf matches git HEAD 375b2ddf53c775a32d0a126be676dea42453903f.

## Outcome

- Signal: useful

## Source Nodes

- main.jsx
- App.jsx
- App\(\)
- Hero.jsx
- Hero\(\)
- Features.jsx
- Feature\(\)
- cards
- colors
- links