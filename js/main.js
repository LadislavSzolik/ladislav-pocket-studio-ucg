/* ==========================================================
   Ladi — UGC Portfolio — interactions
   1) Mobile nav toggle
   2) Click-to-play video embeds (YouTube, loaded on demand)
   3) Contact form — AJAX submit to Netlify Forms
   ========================================================== */

document.addEventListener('DOMContentLoaded', function () {

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
    // reads as an actual reel rather than blank dark cards.
    var thumbId = embed.getAttribute('data-video-id');
    if (thumbId) {
      embed.style.backgroundImage = 'url(https://i.ytimg.com/vi/' + encodeURIComponent(thumbId) + '/hqdefault.jpg)';
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
          status.textContent = "Something went wrong sending that — please email ladislav.studio@proton.me directly.";
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
