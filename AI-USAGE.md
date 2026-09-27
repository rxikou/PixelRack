# AI usage

This project was built with AI assistance. This file is the record of how I used AI tools, where they failed and needed my intervention, and which parts of the application I engineered myself.

## My Approach to AI

For this project, I used AI tools (Claude and Gemini) as an interactive pair programmer and companion rather than an automated code generator. Instead of asking an AI to 'build an app' for me, I planned my features first, tried building the components or backend routes myself, and then used AI to check my syntax, teach me newer library patterns (like Prisma 7 and Neon Auth), and help me debug weird errors.

Whenever the AI suggested code that was overly complex, had security gaps, or didn't match how a Hot Wheels collector actually organizes cars, I pushed back and redesigned the approach.

---

## 1. How I used AI

### 2026-09-21 - Splitting the dashboard into modular components
- **Tool:** Claude
- **What I asked for:** How to split my initial monolithic App.jsx into clean subcomponents (Rack, UploadPanel, RackHeader) and use derived state with useMemo so searching and filtering don't trigger slow re-renders.
- **What it gave back:** A component hierarchy with a useMemo pattern calculating visible cars and series options.
- **What I kept, what I changed, and why:** I kept the useMemo filtering logic. I manually wrote the custom pixel borders, shelf plank styling, and slot props for ShelfCarSlot so the cars actually looked like physical toys parked on a wooden rack.
- **Commit:** https://github.com/rxikou/PixelRack/commit/2d0830826e23f39fd65362ea46761dd77a20f617

### 2026-09-21 - Multi-scene routing with a shared ScenePage
- **Tool:** Claude
- **What I asked for:** How to configure React Router 7 routes for the Virtual Garage and 7-Eleven Konbini scenes without copying and pasting the exact same page code twice.
- **What it gave back:** A reusable ScenePage component parameterized by an environmentId prop and routing in App.jsx.
- **What I kept, what I changed, and why:** I kept the shared component structure. I changed the slot coordinate system so cars are positioned as percentage offsets across the artwork, ensuring parking spots stay aligned when resizing the browser window.
- **Commit:** https://github.com/rxikou/PixelRack/commit/cf55b671efbf203d0be587bad75f59f7869b3f19

### 2026-09-22 - Modal accessibility and keyboard navigation
- **Tool:** Claude
- **What I asked for:** How to make the CarPickerModal accessible so keyboard and screen-reader users don't get trapped behind the modal overlay.
- **What it gave back:** A dialog pattern using role="dialog", aria-modal="true", and an Escape key event listener.
- **What I kept, what I changed, and why:** I kept the ARIA roles and Escape key dismissal. I changed the slot buttons to have descriptive aria-labels ('Empty slot, click to add a car' instead of a bare '+' sign) and added backdrop dismissal.
- **Commit:** https://github.com/rxikou/PixelRack/commit/d4e2edb5f9870838517ffd4e37539c91f86dbf55

### 2026-09-26 - Setting up Prisma 7 with Neon PostgreSQL driver adapter
- **Tool:** Claude
- **What I asked for:** Prisma 7 moved database URLs out of schema.prisma and into prisma.config.mjs. I asked how to configure the PrismaNeon adapter for Express without breaking migrations.
- **What it gave back:** The prisma.config.mjs configuration loading pooled DATABASE_URL and direct DATABASE_URL_UNPOOLED, with initial schema models.
- **What I kept, what I changed, and why:** I kept the adapter setup and connection pooling. I changed the environment table to use stable string keys ('rack', 'garage', 'konbini') instead of random UUIDs so my frontend could easily link them to specific scene art.
- **Commit:** https://github.com/rxikou/PixelRack/commit/25187a654a3c1bc1688a5c867d2d9af1790dabc0

### 2026-09-26 - Securing Express routes with Neon Auth JWT verification
- **Tool:** Claude
- **What I asked for:** How to verify JWT tokens issued by Neon Auth in Express using the jose library without hardcoding a static shared secret.
- **What it gave back:** A requireAuth middleware using createRemoteJWKSet pointing to Neon's JWKS endpoint.
- **What I kept, what I changed, and why:** I kept the JWKS cryptographic verification. I modified the middleware to attach decoded user claims to req.user (specifically req.user.id) so all downstream database queries in my controllers are automatically scoped to the logged-in user.
- **Commit:** https://github.com/rxikou/PixelRack/commit/25187a654a3c1bc1688a5c867d2d9af1790dabc0

### 2026-09-27 - Connecting client to live Express API with AuthContext
- **Tool:** Claude
- **What I asked for:** How to transition the React client from the mockApi to real Axios calls while preserving auth state across page refreshes.
- **What it gave back:** An AuthContext provider with token management and an API client with an Authorization header interceptor.
- **What I kept, what I changed, and why:** Kept the global context pattern and auth header injection. Added custom error handling so that if the backend is waking up from a Render free-tier cold start, the UI shows a friendly retro loading banner rather than throwing unhandled promise rejections.
- **Commit:** https://github.com/rxikou/PixelRack/commit/a96e0a151382f79b76cc0f8e4749f846c71b7a03

### 2026-09-27 - Production feature gating and Render deployment blueprint
- **Tool:** Claude
- **What I asked for:** How to deploy the Express API to Render while keeping the Gemini image generation step disabled by default to prevent unexpected billing.
- **What it gave back:** A requirePixelation middleware returning HTTP 503 and a render.yaml blueprint.
- **What I kept, what I changed, and why:** Kept the blueprint and feature flag. I placed requirePixelation ahead of multer in the route pipeline so rejected requests are turned away immediately before the server wastes bandwidth receiving the file upload.
- **Commit:** https://github.com/rxikou/PixelRack/commit/cd5ccd4d51947b95eab60d8b57501e021f0b2b48

---

## 2. Where the AI got it wrong

### Case 1: Trying to generate pixel art with simple image filters
- **What it gave me:** When I first asked how to turn a Hot Wheels photo into a pixel art sprite, the AI suggested using Sharp to downsample the image, posterize it, and apply nearest-neighbor scaling. It told me this would look like 16-bit pixel art without needing any external APIs.
- **What was wrong with it:** I tested it on a real photo of my die-cast car and it looked awful. Downscaling a photograph doesn't magically turn it into drawn pixel art; it just makes a tiny, blurry, pixelated photograph.
- **What I did instead:** I realized you cannot reach a hand-drawn sprite look with filters alone. I redesigned the pipeline into a two-stage hybrid process: Stage 1 uses Gemini to genuinely redraw the car as a flat pixel art sprite on a clean background, and Stage 2 uses Sharp strictly to trim, center on a 96x72 canvas, and cap colors.
- **Commit:** https://github.com/rxikou/PixelRack/commit/25187a654a3c1bc1688a5c867d2d9af1790dabc0

### Case 2: Forcing car colors onto the app's UI color palette
- **What it gave me:** The AI tried to write a color quantization pass that mapped all car sprite pixels onto the color palette defined in my style.md file.
- **What was wrong with it:** My UI color palette uses blues, purples, and teals inspired by retro games, but it doesn't contain bright red, orange, or yellow. When the script ran, my red Ferrari and yellow Corvette were remapped to dull blue-gray cars. It ruined the most important part of the app: recognizing your own physical cars.
- **What I did instead:** I told the AI to stop remapping onto the UI palette. Instead, I changed the Sharp quantization step to a simple count cap (maximum 16 colors per car) rather than a fixed hue remap. That kept the car's actual paint colors and decals intact while keeping file sizes small.
- **Commit:** https://github.com/rxikou/PixelRack/commit/25187a654a3c1bc1688a5c867d2d9af1790dabc0

### Case 3: Naive slot updates that allowed car cloning
- **What it gave me:** When writing the backend placement endpoint, the AI gave me a basic prisma.placement.create() query that only checked if the requested slot was currently vacant.
- **What was wrong with it:** A physical die-cast car can only be in one parking bay at a time. Under the AI's logic, if I assigned car #1 to slot 0, and then assigned car #1 to slot 1, the database saved both rows. The user ended up with duplicate clones of the same car parked in the same scene.
- **What I did instead:** I added compound uniqueness constraints in Prisma: @@unique([userId, environmentId, slotIndex]) and @@unique([userId, environmentId, carId]). Then I rewrote the controller into a database transaction that deletes any existing placement of that car in that environment before assigning it to the new slot. Placing a car now moves it cleanly instead of duplicating it.
- **Commit:** https://github.com/rxikou/PixelRack/commit/25187a654a3c1bc1688a5c867d2d9af1790dabc0

---

## 3. Who wrote what

### Written by me

- **client/src/components/UploadPanel.jsx & ImageCropper.jsx:**
  I built the cropping and upload interface. Because Hot Wheels come in carded blister packs, passing the entire photo to background removal failed because the plastic card was treated as part of the car. I wrote the interactive cropping box where users tightly frame just the vehicle body before uploading. I also handled image blob conversions, preview cleanup, and form state.
- **client/src/components/ShelfCarSlot.jsx & CarPickerModal.jsx:**
  I designed the wooden shelf display and car slot cards. I spent hours getting the retro drop-shadows and plank contact shadows right so the cars look like they are physically resting on a shelf rather than floating in space. I also built the modal picker, empty-slot button states, and keyboard accessibility.
- **server/src/controllers/car.controller.js (User Data Scoping):**
  I wrote the query scoping across all car endpoints. I made sure every single database query explicitly filters by where: { id, userId: req.user.id }. That way, one collector can never view, edit, or delete another user's cars, even if they guess the UUID.

### The AI-written part I understand best

- **server/src/middleware/requireAuth.js:**
  This is the authentication guard middleware. I understand how it takes the Authorization: Bearer token from incoming request headers, strips the Bearer prefix, and passes it to jose.jwtVerify(). Instead of using a static symmetric secret, it queries Neon Auth's hosted JWKS endpoint to verify the cryptographic signature using public keys. If the token is expired or invalid, it immediately rejects with a 401 Unauthorized status; if valid, it extracts the sub claim and attaches it to req.user.id so my routes can safely identify who is making the request.
