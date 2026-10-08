/* Google Analytics (GA4) behind a consent choice — Ashton, 8 Oct 2026.
   Consent Mode v2: analytics storage is DENIED until the visitor taps
   "allow", so GA sets no cookies before then (PECR) and only sends
   cookieless pings. The choice is remembered in localStorage and can be
   changed from the privacy page ([data-cookie-settings]).
   Only the live domain reports — staging and local previews never load GA. */
(function () {
  var GA_ID = 'G-NVJX3B370N';
  var LIVE_HOSTS = ['ashtonstudios.uk', 'www.ashtonstudios.uk'];
  var STORE_KEY = 'as-analytics-consent'; // 'granted' | 'denied'
  var isLive = LIVE_HOSTS.indexOf(location.hostname) !== -1;

  function readChoice() {
    try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; }
  }
  function saveChoice(value) {
    try { localStorage.setItem(STORE_KEY, value); } catch (e) { /* private mode: choice lasts this page only */ }
  }

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;

  var stored = readChoice();
  gtag('consent', 'default', {
    analytics_storage: stored === 'granted' ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });

  if (isLive) {
    var tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(tag);
    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  function choose(value, banner) {
    saveChoice(value);
    gtag('consent', 'update', { analytics_storage: value });
    if (banner) {
      banner.classList.remove('is-in');
      setTimeout(function () { banner.remove(); }, 400);
    }
  }

  function showBanner() {
    if (document.querySelector('.consent')) return;
    var banner = document.createElement('aside');
    banner.className = 'consent';
    banner.setAttribute('aria-label', 'Analytics choice');
    banner.innerHTML =
      '<p>can i count visits? google analytics tells me which pages help, nothing is sold or used for ads. ' +
      '<a href="' + privacyHref() + '">privacy</a></p>' +
      '<div class="consent-actions">' +
      '<button type="button" class="btn btn-ghost" data-consent="denied">no thanks</button>' +
      '<button type="button" class="btn btn-solid" data-consent="granted">allow</button>' +
      '</div>';
    banner.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-consent]');
      if (btn) choose(btn.getAttribute('data-consent'), banner);
    });
    document.body.appendChild(banner);
    requestAnimationFrame(function () { requestAnimationFrame(function () { banner.classList.add('is-in'); }); });
  }

  // privacy.html sits at the site root; work out the path from this script's own src.
  function privacyHref() {
    var self = document.querySelector('script[src$="consent.js"]');
    return self ? self.getAttribute('src').replace(/consent\.js$/, 'privacy.html') : '/privacy.html';
  }

  function init() {
    if (stored !== 'granted' && stored !== 'denied') showBanner();
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-cookie-settings]')) { e.preventDefault(); showBanner(); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
