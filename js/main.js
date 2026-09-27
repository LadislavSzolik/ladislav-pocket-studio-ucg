/* ==========================================================
   Ladi — UGC Portfolio — interactions
   1) Mobile nav toggle
   2) Click-to-play video embeds (YouTube, loaded on demand)
   3) Contact form — AJAX submit to Netlify Forms
   ========================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 0) Email links (kept out of the HTML/JS source as a
     plain "user@domain" string) ----------
     Scrapers that harvest spam targets almost always just download
     the page's static HTML/JS and regex it for an "@" pattern — they
     don't run a full browser. Building the address here means the
     literal string never sits in any file; it only exists once this
     script actually runs in a visitor's browser. This does nothing
     against a scraper sophisticated enough to render the page like a
     browser, but that's a small minority of what actually harvests
     addresses in the wild. Every ".js-email-link" (hero + footer) is
     wired up from here.
  ---------------------------------------------------------- */
  var emailAddress = ['ladislav', 'studio'].join('.') + '@' + ['proton', 'me'].join('.');
  document.querySelectorAll('.js-email-link').forEach(function (link) {
    link.href = 'mailto:' + emailAddress;
  });

  /* ---------- 1) Mobile nav ---------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- 2) Click-to-play video embeds ----------
     Each .lite-embed has data-video-id (a YouTube video ID) and
     data-title. Clicking the play button injects the iframe, so
     six YouTube players never load on page visit — only the one
     the visitor actually presses play on.

     To use: upload each finished video to YouTube as "Unlisted"
     and paste its video ID (the part after v= in the URL) into
     the matching data-video-id attribute in index.html.
  ---------------------------------------------------------- */
  document.querySelectorAll('.lite-embed').forEach(function (embed) {
    var playButton = embed.querySelector('.reel-play');
    if (!playButton) return;

    // Show the real YouTube thumbnail behind the play button, so the grid
    // reads as an actual reel rather than blank dark cards. Try the
    // high-res thumbnail first (1280x720); not every video has one, so
    // fall back to the smaller default if it's missing.
    var thumbId = embed.getAttribute('data-video-id');
    if (thumbId) {
      var hiRes = 'https://i.ytimg.com/vi/' + encodeURIComponent(thumbId) + '/maxresdefault.jpg';
      var loRes = 'https://i.ytimg.com/vi/' + encodeURIComponent(thumbId) + '/hqdefault.jpg';

      var probe = new Image();
      probe.onload = function () {
        // When maxresdefault doesn't exist, YouTube still returns a 200
        // but with a tiny 120x90 grey placeholder instead of a real photo.
        var isRealHiRes = probe.naturalWidth > 120;
        embed.style.backgroundImage = 'url(' + (isRealHiRes ? hiRes : loRes) + ')';
      };
      probe.onerror = function () {
        embed.style.backgroundImage = 'url(' + loRes + ')';
      };
      probe.src = hiRes;
    }

    playButton.addEventListener('click', function () {
      var videoId = embed.getAttribute('data-video-id');
      var title = embed.getAttribute('data-title') || 'Video';

      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(videoId) + '?autoplay=1&rel=0';
      iframe.title = title;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;

      embed.innerHTML = '';
      embed.appendChild(iframe);
    });
  });

  /* ---------- 3) Contact form (Netlify Forms, AJAX) ---------- */
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');

  if (form && status) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var submitButton = form.querySelector('.btn-submit');
      var formData = new FormData(form);
      var encoded = new URLSearchParams(formData).toString();

      submitButton.disabled = true;
      status.textContent = 'Sending…';
      status.removeAttribute('data-state');

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encoded
      })
        .then(function (response) {
          if (response.ok) {
            status.textContent = "Thanks — that's sent. I'll get back to you within a few days.";
            status.setAttribute('data-state', 'success');
            form.reset();
          } else {
            throw new Error('Form submission failed');
          }
        })
        .catch(function () {
          status.textContent = "Something went wrong sending that — please email " + emailAddress + " directly.";
          status.setAttribute('data-state', 'error');
        })
        .finally(function () {
          submitButton.disabled = false;
        });
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});
