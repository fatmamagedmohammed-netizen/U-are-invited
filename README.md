# Farah & Mahmoud — Engagement Invitation Site

A single-page invitation for the engagement on the Nile — navy & pearl theme, an
animated yacht drifting on illuminated water, a glowing moon, falling stars, warm
words from the couple (in English and Arabic, with a language switch), a
countdown, and a QR code guests use to send photos straight into a Google Drive
folder. No build tools, no server, no database — plain HTML/CSS/JS that runs
straight from GitHub Pages for free.

```
nile-engagement/
├── index.html          ← the invitation itself
├── upload.html          ← the page the QR code opens, for guest photo uploads
├── assets/
│   ├── sky.jpg           ← dusk sky over the Nile
│   ├── water.jpg          ← illuminated water
│   ├── skyline.png         ← Cairo skyline silhouette (transparent)
│   ├── yacht.png           ← the yacht (transparent)
│   ├── cover.jpg           ← composed preview image (WhatsApp/social preview)
│   ├── icon.svg             ← browser tab icon
│   └── music.mp4            ← ADD YOUR MUSIC FILE HERE (see step 2 — not included)
├── apps-script/
│   └── Code.gs            ← Google Apps Script backend that saves uploads to Drive
└── README.md
```

Everything above is ready to go except your music file — add that and follow
steps 3 and 4 below to finish the setup.

## What changed from the first draft

The earlier version (built with v0/Vercel) had grown into a full Next.js app
with a database-backed RSVP form and server routes — which is why it burned
through credits, and it also isn't something GitHub Pages can run (GitHub
Pages only serves static files, no server or database). This version keeps
everything the brief actually asked for — the animated scene, welcome message,
countdown, and QR photo upload — rebuilt as plain static HTML/CSS/JS, so it's
free to host and has nothing to keep paying for. It also fixed a real bug in
the generated art: the yacht and skyline images had a checkerboard
"transparency" pattern baked into their pixels instead of an actual alpha
channel, so they'd have shown up with a checkerboard background — that's been
cleaned up.

I left the **RSVP form** out on purpose — a real one needs a database and a
server to store responses, which isn't free to host on GitHub Pages. The
simplest no-cost substitute is to ask guests to reply over WhatsApp or a phone
call; if you'd like, I can wire an RSVP button that opens a pre-filled
WhatsApp message instead (just needs a phone number).

## 1. Put it on GitHub Pages (free hosting)

- Create a new GitHub repository (e.g. `engagement`).
- Upload everything in this folder to it (keep the folder structure).
- Go to **Settings → Pages**, set "Deploy from a branch," branch `main`,
  folder `/root`, and save.

GitHub gives you a live URL that looks like:

```
https://YOUR-USERNAME.github.io/YOUR-REPO/
```

That URL is your invitation — send it to guests directly, or wrap it in a
link-in-bio / WhatsApp message.

## 2. Add your music

Add your music file to the `assets` folder and name it `music.mp4` (or
`music.mp3` — both are already wired up in `index.html`). No code changes
needed.

**Note on autoplay:** phones and browsers block audio from starting on page
load without a tap. That's why the invitation opens behind a soft "Open the
invitation" curtain — the tap that reveals the site is also what starts the
music, so it still feels automatic to your guests. There's also a small music
note button in the top-right corner if anyone wants to mute it.

## 3. Make the WhatsApp preview show your photo

WhatsApp needs a full public URL (not a relative path) to fetch the preview
image. Once your site is live on GitHub Pages:

- Open `index.html`, find the two lines containing
  `https://YOUR-USERNAME.github.io/YOUR-REPO/...` (near the top, in the
  `<meta property="og:...">` tags).
- Replace them with your real published URL, e.g.
  `https://faramahmoud.github.io/engagement/assets/cover.jpg` for the image,
  and `https://faramahmoud.github.io/engagement/` for the page URL.
- Push the change, then test it with Facebook's
  [Sharing Debugger](https://developers.facebook.com/tools/debug/) or
  WhatsApp's own preview (send the link to yourself first) — WhatsApp caches
  previews, so if it looks stale, re-scrape it in the debugger.

The `cover.jpg` image is already generated for you (a still frame of the
scene — moon, stars, skyline, and the yacht on the water) — no design work
needed unless you'd like to swap it for a real photo.

## 4. Connect the QR code to the bride's Google Drive

The QR code on the site already works out of the box — it always points to
your site's own `upload.html`, wherever it's hosted. What still needs a
one-time setup is where those uploaded photos actually *land*. Google requires
uploads to go through a verified script running under a real Google account,
so:

- Go to [script.google.com](https://script.google.com), sign in as the
  **bride** (uploads will land in whichever account deploys this).
- **New project** → delete the placeholder code → paste in the contents of
  `apps-script/Code.gs`.
- Click **Deploy → New deployment**.
  - Type: **Web app**
  - Execute as: **Me**
  - Who has access: **Anyone**
- Click **Deploy**, authorize the permissions it asks for (it needs Drive
  access to create the folder and save files), and copy the **Web app URL**
  it gives you.
- Open `upload.html`, find this line near the bottom of the script:

  ```js
  var SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
  ```

  and paste your URL in between the quotes.
- Push the change to GitHub.

From then on, every photo or video a guest uploads is saved into a folder
named **"my engagement"** in the bride's Drive — the script creates that
folder automatically the first time someone uploads. Guests can upload
several files at once and see a per-file progress list. Files over 20MB are
skipped with a note (Apps Script has a request-size ceiling) — that's plenty
for phone photos and short video clips.

Until this step is done, guests who try to upload will see a friendly notice
instead of a silent failure, so nothing looks broken in the meantime.

## 5. The location button

Already wired to your Google Maps link:

```
https://maps.app.goo.gl/WJKt9VPi8GZ446KL8?g_st=ic
```

— guests tap **"Open in Maps"** in the Details section and it opens directly
in Google Maps or their browser. The embedded map preview above it uses a
generic "Nile River, Cairo" search since Google Maps embeds need a public
Places API key for exact pins — the button is what actually takes guests to
your saved location.

## 6. Editing the text

All wording lives in one place: open `index.html` and search for
`var dict = {` near the bottom. There are two blocks — `en` and `ar` — each
with the same set of fields (`entry`, `hero`, `welcome`, `details`,
`countdown`, `share`, `dressFaq`, `footer`). Edit the value on the right of
each `:` and save; there's nothing else to touch.

Handy fields to check first:

- **Welcome message** — `welcome.body` in each language block.
- **Date/time details** — `details.dateValue` and `details.timeValue`.
- **Countdown target** — the `EVENT_DATE_ISO` constant near the top of the
  script (currently `2026-09-23T18:00:00+02:00`, 6:00 PM Cairo time). The
  "Add to calendar" links share this same date automatically.
- **Dress code / FAQ answers** — `dressFaq.items` in each language block.

`upload.html` has its own small `dict` block at the top of its script for the
upload-page wording, in the same style.

That's it — everything else (the yacht's motion, the falling stars, the
moon's glow, the water reflections, the language switch) is self-contained
and needs no editing.
