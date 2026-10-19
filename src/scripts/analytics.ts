const CONSENT_KEY = 'felineAnalyticsConsentV1';
const MAX_AGE = 180 * 24 * 60 * 60 * 1000;

// Basic consent mode: no Google script or request before an explicit opt-in.
export function initAnalyticsConsent({ win = window, doc = document, now = () => Date.now(), Observer = ResizeObserver } = {}) {
  const banner = doc.getElementById('cookie-banner');
  const accept = doc.getElementById('accept-cookies');
  const reject = doc.getElementById('reject-cookies');
  if (!banner || !accept || !reject) return;
  const id = banner.dataset.measurementId || '';
  const enabled = banner.dataset.analyticsEnabled === 'true' && /^G-[A-Z0-9]+$/.test(id)
    && ['feline-consulting.be', 'www.feline-consulting.be'].includes(win.location.hostname);
  const state = win as Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; [key: `ga-disable-${string}`]: boolean };
  let loaded = false;
  const reserve = () => doc.documentElement.style.setProperty('--cookie-banner-height', `${banner.offsetHeight}px`);
  const show = () => { banner.classList.remove('hidden'); reserve(); };
  const hide = () => { banner.classList.add('hidden'); reserve(); };
  const save = (decision: string) => {
    try { win.localStorage.setItem(CONSENT_KEY, JSON.stringify({ decision, time: now() })); } catch { /* This visit only. */ }
  };
  const clearCookies = () => {
    for (const cookie of doc.cookie.split(';')) {
      const name = cookie.split('=')[0].trim();
      if (!/^_ga(?:_|$)|^_gid$|^_gat(?:_|$)/.test(name)) continue;
      for (const domain of ['', win.location.hostname, '.feline-consulting.be']) {
        doc.cookie = `${name}=; Max-Age=0; path=/;${domain ? ` domain=${domain};` : ''} SameSite=Lax; Secure`;
      }
    }
  };
  const disable = () => { state[`ga-disable-${id}`] = true; clearCookies(); };
  const start = () => {
    if (!enabled || loaded) return;
    loaded = true;
    state[`ga-disable-${id}`] = false;
    state.dataLayer = state.dataLayer || [];
    state.gtag = function () { state.dataLayer!.push(arguments); };
    state.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    state.gtag('consent', 'update', { analytics_storage: 'granted' });
    state.gtag('js', new Date(now()));
    // Exclude query strings/fragments and never send contact-form values.
    let referrer = '';
    try { const url = new URL(doc.referrer); referrer = url.origin + url.pathname; } catch { /* No referrer. */ }
    state.gtag('config', id, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, cookie_expires: 180 * 24 * 60 * 60, page_location: win.location.origin + win.location.pathname, page_referrer: referrer });
    state.gtag('event', 'page_view', { page_location: win.location.origin + win.location.pathname, page_title: doc.title, page_referrer: referrer });
    const script = doc.createElement('script');
    script.async = true; script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    script.id = 'feline-google-analytics';
    doc.head.appendChild(script);
  };
  let decision = '';
  try {
    const stored = JSON.parse(win.localStorage.getItem(CONSENT_KEY) || 'null');
    if (stored && ['granted', 'denied'].includes(stored.decision) && Number.isFinite(stored.time) && now() >= stored.time && now() - stored.time < MAX_AGE) decision = stored.decision;
  } catch { /* Fresh consent when storage is blocked or invalid. */ }
  // The old cookiesAccepted setting predates tracking and is intentionally ignored.
  if (decision === 'granted') { hide(); start(); }
  else { disable(); if (decision === 'denied') hide(); else show(); }
  accept.addEventListener('click', () => { save('granted'); hide(); start(); });
  reject.addEventListener('click', () => {
    save('denied'); disable(); hide();
    // Unload Google's code after withdrawing a previously granted choice.
    if (loaded) win.location.reload();
  });
  doc.querySelectorAll('[data-cookie-settings]').forEach(button => button.addEventListener('click', () => { show(); accept.focus(); }));
  doc.getElementById('reset-cookie-choice')?.addEventListener('click', () => {
    try { win.localStorage.removeItem(CONSENT_KEY); } catch { /* This visit only. */ }
    disable();
    if (loaded) { win.location.reload(); return; }
    show(); accept.focus();
    const status = doc.getElementById('cookie-reset-status');
    if (status) status.textContent = 'Statistieken zijn uitgeschakeld. Je kan opnieuw kiezen.';
  });
  new Observer(reserve).observe(banner);
  reserve();
}
