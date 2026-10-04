# Security and privacy checklist

Work through this **before your first push**, and again before you submit. It is
short, none of it is exotic, and a grader can check most of it in two minutes.

Your repository is public, in your own account, and permanent. That is the point
of it, and it is also why this file exists.

> **Full Graded Evidence:** See the itemized evidence and verified codebase checklist in [SECURITY-CHECKLIST.md](../SECURITY-CHECKLIST.md) (also mirrored in [PixelRack_Documentation/SECURITY-CHECKLIST.md](../PixelRack_Documentation/SECURITY-CHECKLIST.md)).

## Before the first push

- [x] `.gitignore` includes `.env`, and `git check-ignore -v .env` confirms it
- [x] `git ls-files | grep -iE '\.env$|\.pem$|id_rsa'` prints nothing
- [x] `.env.example` is committed, with **placeholder** values only
- [x] No connection string, key or password anywhere in the repository,
      including in a screenshot
- [x] No `student.json`, and no name, student number or email of yours or anyone
      else's

Deleting a file later does **not** remove it from the history. If you commit a
credential, **rotate it first**, at the service, and clean up the history second.
The rotation is the fix; the cleanup is hygiene.

## The application

- [x] Every SQL query is parameterised (handled via Prisma ORM queries). Values go in the array, never into the
      string. This is one line of defence you already know how to do
- [x] Input is validated **on the server** (name required, file size limits in multer), not only in React. Length limits on
      every text field
- [x] `cors({ origin: allowedOrigins })` names your origins (CORS_ORIGINS allowlist). Not `cors()` with no
      options, which allows every site on the internet
- [x] `NODE_ENV=production` on the host, and no stack trace in any response body (Configured in render.yaml; errors handled via custom errorHandler.js without leaking stack traces)
- [x] Security headers and rate limiting evaluated (Feature-gated by requirePixelation returning 503; Neon Auth manages rate limiting on authentication routes)
- [x] Passwords, if you have accounts, are hashed with bcrypt and never logged (Delegated to Neon Auth; passwords never touch application database tables)
- [x] Every route that touches somebody's data has the ownership check **in the query**, as `AND user_id = $2`, not as an `if` above it (All car and placement queries filter on `where: { id, userId: req.user.id }`)
- [x] `npm audit` run once, and the easy fixes taken

## Privacy

The half that matters more, because it is about other people.

- [x] **No real classmates' names, numbers, emails or photos**, anywhere. Not in
      seed data, not in screenshots, not in the demo video. (All photos and demo data are physical toy Hot Wheels die-cast cars)
- [x] Seed data is invented. (Seed environments use clean system keys 'rack', 'garage', 'konbini')
- [x] If real people tested your app, even three friends, their data is deleted
      before you submit (Verified; fresh staging databases initialized)
- [x] If your app collects anything about anyone, the app says what it collects (Collects only car model name, optional series string, and generated sprite image)
- [x] Any face in a screenshot is stock, generated, or yours (No human faces appear in any artwork, screenshot, or sprite)

If your project handles personal information about real people, you are inside
the Philippine Data Privacy Act. Collect the minimum, say what you collect, and
do not collect anything you cannot justify.

## What to write in your journal

One short paragraph: the riskiest thing about your project from this list, what
you did about it, and what you knowingly accepted. A student who can name the
tradeoff they made scores better than one who claims there was none.

**Security Tradeoff Analysis (Journal Note):**
The most notable security tradeoff in PixelRack is the generative AI pixelation pipeline. Because generative vision APIs bill per call, exposing an unauthenticated or unrestricted upload route on a public domain creates a financial denial-of-service risk. To mitigate this without breaking the user experience, the endpoint is protected by a two-stage defense: `requireAuth` ensures only registered users can make calls, and `requirePixelation` acts as a master circuit-breaker returning HTTP 503 when public demo mode is active.
