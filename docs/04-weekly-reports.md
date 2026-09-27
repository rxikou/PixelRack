# Weekly reports

Five minutes a week. Add a new section at the top; never edit an old one.

---

## Week of 2026-09-27 (Week 2)

**Done.** Replaced mock backend with real Express 5 REST API and Neon PostgreSQL via Prisma 7. Integrated Neon Auth session verification with JWTs using jose. Connected React client to live endpoints for cars, environments, and placements. Added dedicated scene views for /garage and /konbini with atomic slot persistence and CSS effects. Added render.yaml and client/vercel.json for cloud deployment.

**Stuck.** Render's free tier spins down after 15 minutes of inactivity, causing a ~50-second delay on the first request. Fixed by adding a friendly retro loading state in the client so the UI never crashes during cold starts. Uploaded photos on local disk are wiped on redeploy, so persistent remote storage (Cloudinary) is planned.

**Hours.** ~18 hours.

**Next.** Connect Cloudinary for persistent sprite storage and write automated API test suites.

---

## Week of 2026-09-20 (Week 1)

**Done.** Scaffolded the React + Vite frontend, established the retro arcade aesthetic inspired by Tuber Simulator, built the 9-slot wooden shelf grid with sort and filter controls, and created the interactive image crop component.

**Stuck.** Trying to make pixel art from Hot Wheels photos using plain image filters (downsampling, posterization). It produced crunchy, blurry photos instead of flat retro sprites. Decided to adopt a two-stage hybrid approach using Gemini to redraw the car and Sharp to frame it.

**Hours.** ~15 hours.

**Next.** Set up real backend with Express, Prisma, and Neon Auth.
