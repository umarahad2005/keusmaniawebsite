# HOW TO USE THIS AGENT SYSTEM WITH CLAUDE CODE
## Run in your terminal — one agent at a time

---

## STEP 0 — Setup
```bash
# Copy the entire agents/ folder into your project root
cp -r agents/ ~/your-projects/keu-rebuild/
cd ~/your-projects/keu-rebuild/

# Open Claude Code
claude
```

---

## STEP 1 — Design Agent
Paste this into Claude Code:
```
Read agents/skills/01-design-agent.md carefully and execute your role completely.
Project root is ./keu-website. Create all files specified in the Output Required section.
When done, update agents/project-state.json status.design to "done".
```

---

## STEP 2 — Structure Agent
```
Read agents/skills/02-structure-agent.md and execute fully.
Read agents/project-state.json first to confirm design is done.
Scaffold the complete Vite project at ./keu-website with all pages and folders.
```

---

## STEP 3 — 3D Scene Agent
```
Read agents/skills/03-3d-scene-agent.md and execute fully.
Read agents/project-state.json first. Build the Three.js hero scene in src/js/scene.js.
Add the hero HTML section to index.html. Add hero CSS to components.css.
```

---

## STEP 4 — Animation Agent
```
Read agents/skills/04-animation-agent.md and execute fully.
Implement all GSAP and Lenis animations in src/js/animations.js.
Add the stats section to index.html and stats CSS to components.css.
```

---

## STEP 5 — Content Agent
```
Read agents/skills/05-content-agent.md and execute fully.
Write all page copy into the HTML files. Add SEO meta tags to all pages.
Create src/data/packages.json with all package data.
```

---

## STEP 6 — UI Components Agent
```
Read agents/skills/06-ui-components-agent.md and execute fully.
Build and insert: nav, package cards, testimonials, footer, WhatsApp float button.
Add all CSS to components.css.
```

---

## STEP 7 + 8 + 9 — WhatsApp, Performance, QA
```
Read agents/skills/07-08-09-whatsapp-perf-qa-agents.md and execute all three roles in sequence:
1. First complete WhatsApp integration
2. Then run performance optimizations  
3. Then run full QA checklist and fix all issues
Finally deploy to Vercel and update project-state.json with the live URL.
```

---

## POWER USER: Run multiple agents in one prompt
If you want Claude Code to handle more at once:
```
Read agents/MASTER_PROMPT.md to understand the full project.
Then read and execute agents/skills/03-3d-scene-agent.md and agents/skills/04-animation-agent.md in sequence.
Check project-state.json before starting each one.
```

---

## Tips
- Always let one agent finish completely before starting the next
- If an agent makes an error, tell Claude Code: "Fix the error and continue from where you left off"
- You can ask Claude Code to "review what the last agent built and suggest improvements" before moving on
- Add your real WhatsApp number to project-state.json contact.whatsapp BEFORE running Step 6
