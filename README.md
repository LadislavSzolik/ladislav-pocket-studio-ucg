# Ladi — UGC Portfolio

A simple, static one-page portfolio: header/about, a 6-video work grid, services,
and a contact form. No build step, no framework — just `index.html`, `css/styles.css`,
and `js/main.js`. You (or I) can open `index.html` directly in a browser to preview it.

## 1. Status — what's real, what's still open

Email, Instagram, your photo, and all 6 videos (from @ChasingStrokes-r2c) are wired
in with real content. Two small things left:

- **Voiceover badges.** The original design tags videos that carry a written &
  recorded voiceover. Tell me which of the 6 that applies to and I'll add the badge
  back in — I left it off rather than guess.
- **Video visibility.** Your 6 links were shared in the standard `.../shorts/ID`
  format, which doesn't tell me whether they're set to Public or Unlisted on
  YouTube. Either works fine for embedding — Unlisted just means they also won't
  show up on your channel page or in YouTube search. Worth a quick check in
  YouTube Studio → Content if you'd rather they stayed off your public channel.
- **A 7th video, later.** The grid is built for 6; when you send the next one I can
  either swap it in for one of the current 6 or extend the grid to 7 — your call
  when we get there.

To swap or add a video ID yourself: find the `data-video-id="..."` attribute on the
matching `<article class="reel-card">` block in `index.html` — in
`https://youtube.com/shorts/aBc123XyZ`, the ID is the part after `/shorts/`
(`aBc123XyZ`).

## 2. Deploying — Netlify

Netlify over Vercel, for two reasons specific to this project:

- **Commercial use.** Vercel's free Hobby tier is restricted to personal, non-commercial
  projects and they do enforce it — a site meant to land paid brand deals doesn't
  comfortably fit that. Netlify's free tier doesn't carry that restriction.
- **A contact form with no backend.** Netlify can detect and handle a plain HTML
  `<form>` automatically (see §4) — no server, no third-party form service, no API
  keys. Vercel has no equivalent for a static site.

To deploy:

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag the whole `ladi-ugc-portfolio` folder onto the page.
3. Netlify gives you a live URL immediately (something like
   `random-name-123.netlify.app`). That's it — no account setup required to get
   a first working link, though you'll want to sign up (free) to keep the site
   long-term and see form submissions.

For easier future updates, the slightly better long-term setup is connecting a
GitHub repo to Netlify instead of drag-and-drop, so every change you push redeploys
automatically — happy to set that up if you'd like.

**A custom domain later:** once you own one, add it under Site settings → Domain
management in Netlify. Until then the free `.netlify.app` subdomain works fine and
costs nothing.

## 3. Why the videos aren't just uploaded straight to the host

You mentioned over 500MB of video. A few reasons that's handled via YouTube
(unlisted) rather than uploaded directly into this folder:

- Netlify's free tier now runs on a monthly credit pool that works out to roughly
  **10GB storage / 15GB bandwidth** — a page that serves 500MB of video directly
  would burn through that in a small number of visits, and once it's gone your
  whole site goes offline until the next month.
- YouTube hosting is free with no bandwidth ceiling, handles video compression
  and multiple resolutions for you, and the click-to-play setup on the site means
  visitors only load a lightweight thumbnail until they actually press play.

If you'd rather not have any YouTube branding on the player at all, the alternative
is **Cloudflare R2** (cheap storage, zero bandwidth fees) with a plain HTML5
`<video>` tag instead of the YouTube embed — more setup work, cleaner look. Say
the word if you want that swapped in instead.

## 4. The contact form

The form in `index.html` (`id="contactForm"`) is wired for **Netlify Forms**:
the `data-netlify="true"` attribute and hidden `form-name` field are what Netlify
looks for when it builds the site, and it will automatically create a backend for
it — no signup form service, no API key, nothing to configure beyond deploying.

- **Where submissions go:** Netlify dashboard → your site → Forms. You can turn on
  an email notification (Site settings → Forms → Form notifications) so each
  submission also lands in your inbox.
- **Spam:** there's a hidden honeypot field (invisible to real visitors, catnip for
  bots) already wired in, which handles the bulk of spam without adding a CAPTCHA.
- **Submit behaviour:** `js/main.js` submits the form over `fetch` so the page
  doesn't reload — visitors see a "sent" message in place. If JavaScript is
  disabled, the form still works via a normal page submit; you'd just want to add
  a `/thanks` page for that edge case if it matters to you (rare, but let me know
  if you want it covered).
- **Free tier note:** Netlify made form submissions free on every plan (including
  Free) as of this year, so this costs nothing at your current volume.

## 5. File structure

```
ladi-ugc-portfolio/
├── index.html          → all page content and structure
├── css/styles.css       → all visual design
├── js/main.js            → mobile nav, click-to-play video, form submit
├── images/                  → put your photo(s) here
└── README.md          → this file
```

Everything is plain HTML/CSS/JS on purpose — no build step, so you (or I, later)
can hand-edit any piece of copy directly without touching tooling.
