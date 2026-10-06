/* Gayle Jessup White — site scripts (no libraries needed) */
(function () {
  'use strict';

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      nav.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
    });
    window.matchMedia('(min-width: 961px)').addEventListener('change', function (mq) {
      if (mq.matches) setOpen(false);
    });
  }

  /* ---------- In the News (data in js/news.js) ---------- */
  var newsList = document.getElementById('news-list');
  if (newsList && Array.isArray(window.GJW_NEWS)) {
    newsList.textContent = '';
    window.GJW_NEWS.forEach(function (item) {
      var a = document.createElement('a');
      a.className = 'news-card' + (item.featured ? ' news-card--featured' : '');
      a.href = item.url || '#';
      a.target = '_blank';
      a.rel = 'noopener';

      var meta = document.createElement('div');
      meta.className = 'news-card__meta';
      var kind = document.createElement('span');
      kind.className = 'news-card__kind';
      kind.textContent = item.kind || '';
      var date = document.createElement('span');
      date.className = 'news-card__date';
      date.textContent = item.date || '';
      meta.append(kind, date);

      var outlet = document.createElement('div');
      outlet.className = 'news-card__outlet';
      outlet.textContent = item.outlet || '';

      var title = document.createElement('div');
      title.className = 'news-card__title';
      title.textContent = item.title || '';

      a.append(meta, outlet, title);
      if (item.summary) {
        var p = document.createElement('p');
        p.className = 'news-card__summary';
        p.textContent = item.summary;
        a.append(p);
      }
      var sr = document.createElement('span');
      sr.className = 'visually-hidden';
      sr.textContent = ' (opens in a new tab)';
      a.append(sr);
      newsList.append(a);
    });
  }

  /* ---------- Contact form ---------- */
  var form = document.getElementById('contact-form');
  if (form) {
    var status = form.querySelector('.form-status');
    var submitBtn = form.querySelector('button[type="submit"]');
    var email = form.getAttribute('data-fallback-email') || '';

    var showStatus = function (msg, isError) {
      status.textContent = msg;
      status.classList.toggle('is-error', !!isError);
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;

      // Not set up yet: the action still has the placeholder ID.
      if (/YOUR_FORM_ID/.test(form.action)) {
        showStatus('The contact form isn’t connected yet. Please email ' + email + ' directly.', true);
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      showStatus('', false);

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed: ' + res.status);
          var done = document.createElement('div');
          done.className = 'form-success';
          done.setAttribute('role', 'status');
          done.setAttribute('tabindex', '-1');
          var h = document.createElement('h3');
          h.textContent = 'Thank you.';
          var p = document.createElement('p');
          p.textContent = form.getAttribute('data-success') || 'Your message is on its way to Gayle.';
          done.append(h, p);
          form.replaceChildren(done);
          done.focus();
        })
        .catch(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send message';
          showStatus('Sorry, something went wrong sending your message. Please try again, or email ' + email + '.', true);
          if (window.turnstile) { try { window.turnstile.reset(); } catch (err) {} }
        });
    });
  }

  /* ---------- Gallery lightbox ---------- */
  var gallery = document.querySelector('[data-gallery]');
  var dialog = document.getElementById('lightbox');
  if (gallery && dialog && typeof dialog.showModal === 'function') {
    var items = Array.prototype.slice.call(gallery.querySelectorAll('[data-full]'));
    var img = dialog.querySelector('.lightbox__figure img');
    var tTitle = dialog.querySelector('.lightbox__title');
    var tText = dialog.querySelector('.lightbox__text');
    var tCredit = dialog.querySelector('.lightbox__credit');
    var tCount = dialog.querySelector('.lightbox__count');
    var current = 0;
    var opener = null;

    var show = function (i) {
      current = (i + items.length) % items.length;
      var el = items[current];
      img.src = el.getAttribute('data-full');
      img.alt = el.getAttribute('data-alt') || el.getAttribute('data-title') || '';
      tTitle.textContent = el.getAttribute('data-title') || '';
      tText.textContent = el.getAttribute('data-caption') || '';
      tText.hidden = !tText.textContent;
      tCredit.textContent = el.getAttribute('data-credit') || '';
      tCredit.hidden = !tCredit.textContent;
      tCount.textContent = (current + 1) + ' / ' + items.length;
    };

    items.forEach(function (el, i) {
      el.addEventListener('click', function () {
        opener = el;
        show(i);
        dialog.showModal();
        document.body.style.overflow = 'hidden';
      });
    });

    dialog.querySelector('.lb-prev').addEventListener('click', function () { show(current - 1); });
    dialog.querySelector('.lb-next').addEventListener('click', function () { show(current + 1); });
    dialog.querySelector('.lb-close').addEventListener('click', function () { dialog.close(); });

    dialog.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1); }
    });
    // Click on the dark area (not the photo or buttons) closes it.
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog || e.target.classList.contains('lightbox__figure') || e.target.classList.contains('lightbox__inner')) dialog.close();
    });
    dialog.addEventListener('close', function () {
      document.body.style.overflow = '';
      if (opener) opener.focus();
    });

    // Swipe left/right on touch screens.
    var startX = null;
    dialog.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    dialog.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
      startX = null;
    });
  }
})();
