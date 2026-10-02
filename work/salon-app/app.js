/* Laylak Beauty Lounge — clickable app prototype (concept by Q8Pixel). Demo only: nothing is sent anywhere. */
(function () {
  'use strict';
  var D = window.LAYLAK_DATA, A = window.LAYLAK_ART;
  if (!D || !A) return;
  var doc = document, root = doc.documentElement;
  var RM = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  function $(s, r) { return (r || doc).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); }

  /* ================= dates ================= */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function ymd(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parseYmd(s) { var p = String(s).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function addDays(d, n) { var x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; }
  function today0() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }
  function dayDiff(s) { return Math.round((parseYmd(s) - today0()) / 864e5); }

  /* ================= state ================= */
  var KEY = 'laylak.v1';
  function seedBookings() {
    var t = today0();
    return [
      { id: 'b1', ref: 'LYK-2417', service: 'gel', addons: ['french'], spec: 'joanna', date: ymd(addDays(t, 2)), time: 1050, status: 'up', pay: 'salon' },
      { id: 'b2', ref: 'LYK-1983', service: 'blowdry', addons: ['scalp'], spec: 'noura', date: ymd(addDays(t, -12)), time: 660, status: 'done', pay: 'salon' },
      { id: 'b3', ref: 'LYK-1650', service: 'facial', addons: ['eyemask'], spec: 'mariam', date: ymd(addDays(t, -31)), time: 1140, status: 'done', pay: 'knet' },
      { id: 'b4', ref: 'LYK-1402', service: 'threading', addons: [], spec: 'lina', date: ymd(addDays(t, -46)), time: 960, status: 'cancel', pay: 'salon' }
    ];
  }
  function fresh(l) {
    return { v: 1, lang: l || null, onboarded: false, bookings: seedBookings(), notif: { remind: true, offers: true, sms: false }, user: { name: '', phone: '' }, fav: [], draft: null };
  }
  var S = (function () {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { s = null; }
    if (!s || s.v !== 1 || !Array.isArray(s.bookings)) s = fresh();
    s.notif = s.notif || { remind: true, offers: true, sms: false };
    s.user = s.user || { name: '', phone: '' };
    s.fav = s.fav || [];
    return s;
  })();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage unavailable: keep in memory */ } }

  var lang = root.lang === 'ar' ? 'ar' : 'en';
  (function () {
    var q = null;
    try { q = new URLSearchParams(location.search).get('lang'); } catch (e) { q = null; }
    if (q === 'ar' || q === 'en') {
      S.lang = q; save();
      try { history.replaceState(history.state, '', location.pathname + location.hash); } catch (e) { /* ignore */ }
    } else if (!S.lang) { S.lang = lang; }
  })();

  /* ================= i18n & format ================= */
  function T(key, vars) {
    var parts = key.split('.'), v = D.S[lang], i;
    for (i = 0; i < parts.length && v != null; i++) v = v[parts[i]];
    if (v == null) { v = D.S.en; for (i = 0; i < parts.length && v != null; i++) v = v[parts[i]]; }
    if (typeof v === 'string' && vars) v = v.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
    return v == null ? '' : v;
  }
  function L(o) { return o ? (o[lang] != null ? o[lang] : o.en) : ''; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function money(v) { var s = (Math.round(v * 1000) / 1000).toFixed(3); return lang === 'ar' ? s + ' د.ك' : s + ' KD'; }
  function dur(m) {
    var h = Math.floor(m / 60), mm = m % 60;
    if (lang !== 'ar') return h ? h + ' hr' + (mm ? ' ' + mm + ' min' : '') : mm + ' min';
    var mins = function (x) { return (x >= 3 && x <= 10) ? x + ' دقائق' : x + ' دقيقة'; };
    if (!h) return mins(mm);
    var hs = h === 1 ? 'ساعة' : (h === 2 ? 'ساعتان' : h + ' ساعات');
    if (!mm) return hs;
    if (mm === 30) return hs + ' ونصف';
    if (mm === 15) return hs + ' وربع';
    return hs + ' و' + mins(mm);
  }
  function tfmt(m) {
    var h = Math.floor(m / 60) % 24, mm = m % 60, h12 = h % 12 || 12;
    return h12 + ':' + pad(mm) + ' ' + (h < 12 ? (lang === 'ar' ? 'ص' : 'AM') : (lang === 'ar' ? 'م' : 'PM'));
  }
  function trange(m, d) { return tfmt(m) + ' – ' + tfmt(m + d); }
  function dname(d, short) { return D.days[lang + (short ? 'S' : '')][d.getDay()]; }
  function mname(d, short) { return lang === 'ar' ? D.months.ar[d.getMonth()] : D.months[short ? 'enS' : 'en'][d.getMonth()]; }
  function dshort(s) { var d = parseYmd(s); return lang === 'ar' ? dname(d) + ' ' + d.getDate() + ' ' + mname(d) : dname(d, true) + ', ' + d.getDate() + ' ' + mname(d, true); }
  function dlong(s) { var d = parseYmd(s); return lang === 'ar' ? dname(d) + '، ' + d.getDate() + ' ' + mname(d) : dname(d) + ', ' + d.getDate() + ' ' + mname(d); }
  function inDays(n) {
    if (lang !== 'ar') return 'In ' + n + ' days';
    if (n === 2) return 'بعد يومين';
    if (n <= 10) return 'بعد ' + n + ' أيام';
    return 'بعد ' + n + ' يومًا';
  }
  function relDay(s) { var n = dayDiff(s); if (n === 0) return T('today'); if (n === 1) return T('tomorrow'); if (n > 1) return inDays(n); return ''; }
  function whenShort(s, m) { var n = dayDiff(s); var day = n === 0 ? T('today') : n === 1 ? T('tomorrow') : dshort(s); return day + (lang === 'ar' ? '، ' : ', ') + tfmt(m); }
  function dayPhrase(s) {
    var n = dayDiff(s), d = parseYmd(s);
    if (n === 0) return lang === 'ar' ? 'اليوم' : 'today';
    if (n === 1) return lang === 'ar' ? 'غدًا' : 'tomorrow';
    if (n < 7) return T('onDay', { d: dname(d) });
    return T('onDay', { d: dshort(s) });
  }
  function digits(s) { return String(s || '').replace(/[٠-٩]/g, function (c) { return String(c.charCodeAt(0) - 0x0660); }).replace(/[۰-۹]/g, function (c) { return String(c.charCodeAt(0) - 0x06F0); }); }
  /* wrapped in LTR isolate marks so the number never reverses inside Arabic text */
  function fmtPhone(p) { p = digits(p).replace(/\D/g, ''); return '⁦' + (p.length === 8 ? '+965 ' + p.slice(0, 4) + ' ' + p.slice(4) : p) + '⁩'; }
  /* local 8-digit number from whatever was typed, pasted or autofilled (+965 / 00965 prefixes are dropped) */
  function localPhone(v) {
    var p = digits(v).replace(/\D/g, '');
    if (p.length > 8) { if (p.indexOf('00965') === 0) p = p.slice(5); else if (p.indexOf('965') === 0) p = p.slice(3); }
    return p.slice(0, 8);
  }
  function phoneView(p) { return p.length > 4 ? p.slice(0, 4) + ' ' + p.slice(4) : p; }
  function storeName(n) { n = (n || '').trim(); return (n === D.S.en.defaultName || n === D.S.ar.defaultName) ? '' : n; }

  /* ================= data helpers ================= */
  var SV = {}, SP = {}, CAT = {};
  D.services.forEach(function (s) { SV[s.id] = s; });
  D.specialists.forEach(function (s) { SP[s.id] = s; });
  D.categories.forEach(function (c) { CAT[c.id] = c; });
  function specsFor(s) { return D.specialists.filter(function (p) { return p.cats.indexOf(s.cat) >= 0; }); }
  function calc(b) {
    var s = SV[b.service], sub = s.price, d = s.dur;
    (b.addons || []).forEach(function (a) { var x = D.addons[a]; if (x) { sub += x.price; d += x.min; } });
    var p = b.promo && D.promos[b.promo], disc = p ? Math.round(sub * p.pct * 10) / 1000 : 0;
    return { sub: sub, disc: disc, total: Math.round((sub - disc) * 1000) / 1000, dur: d };
  }
  function hash(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function openHours(d) { return d.getDay() === 5 ? [840, 1320] : [600, 1320]; }
  function clashes(ds, m, ignore) {
    return S.bookings.some(function (b) {
      if (b.status !== 'up' || b.date !== ds || b.id === ignore) return false;
      return m < b.time + calc(b).dur && b.time < m + 30;
    });
  }
  /* Availability. A specialist id gives that person's diary; "any:<category>" is the union of every
     specialist who offers that category, so "Any specialist" is never later than a named one. */
  function specKey(d) { return (!d.spec || d.spec === 'any') ? 'any:' + SV[d.service].cat : d.spec; }
  function slotsFor(ds, spec, len, ignore) {
    if (String(spec).indexOf('any') === 0) {
      var cat = String(spec).slice(4), pool = D.specialists.filter(function (p) { return !cat || p.cats.indexOf(cat) >= 0; });
      var lists = pool.map(function (p) { return slotsFor(ds, p.id, len, ignore); });
      return lists[0].map(function (x, i) { return { m: x.m, ok: lists.some(function (l) { return l[i].ok; }) }; });
    }
    var d = parseYmd(ds), hr = openHours(d), out = [], now = new Date();
    var isToday = ymd(now) === ds, nowMin = now.getHours() * 60 + now.getMinutes() + 30;
    var full = hash(ds + spec + 'off') % 9 === 0;
    for (var m = hr[0]; m + len <= hr[1]; m += 30) {
      var busy = full || (isToday && m < nowMin);
      if (!busy) busy = hash(ds + '|' + spec + '|' + m) % 100 < 36;
      if (!busy) busy = clashes(ds, m, ignore);
      out.push({ m: m, ok: !busy });
    }
    return out;
  }
  /* who actually takes an "any specialist" booking: the best-matched person who is free at that time */
  function pickSpec(s, ds, m, len) {
    var list = specsFor(s).map(function (p, i) { return { p: p, i: i, sc: (s.lead === p.id ? 2 : 0) + (p.cats[0] === s.cat ? 1 : 0) }; })
      .sort(function (a, b) { return b.sc - a.sc || a.i - b.i; }).map(function (x) { return x.p; });
    for (var i = 0; i < list.length; i++) if (slotOk(ds, list[i].id, len, m)) return list[i].id;
    return list[0].id;
  }
  function next14() { var t = today0(), a = []; for (var i = 0; i < 14; i++) a.push(ymd(addDays(t, i))); return a; }
  function hasSlots(ds, spec, len, ignore) { return slotsFor(ds, spec, len, ignore).some(function (x) { return x.ok; }); }
  function nextAvail(spec, len) {
    var days = next14();
    for (var i = 0; i < days.length; i++) { var sl = slotsFor(days[i], spec, len); for (var j = 0; j < sl.length; j++) if (sl[j].ok) return { date: days[i], m: sl[j].m }; }
    return null;
  }
  function bookingTime(b) { var d = parseYmd(b.date); d.setMinutes(b.time); return d; }
  function upcoming() {
    var now = new Date();
    return S.bookings.filter(function (b) { return b.status === 'up' && bookingTime(b) > now; }).sort(function (a, b) { return bookingTime(a) - bookingTime(b); });
  }
  function pastList() {
    var now = new Date();
    return S.bookings.filter(function (b) { return b.status !== 'up' || bookingTime(b) <= now; }).sort(function (a, b) { return bookingTime(b) - bookingTime(a); });
  }
  function bStatus(b) { return b.status === 'up' && bookingTime(b) <= new Date() ? 'done' : b.status; }
  function draftFor(id) {
    if (!S.draft || S.draft.service !== id) S.draft = { service: id, addons: [], spec: null, date: null, time: null, promo: null, pay: 'salon', notes: '' };
    return S.draft;
  }
  function userName() { return S.user.name ? S.user.name.trim().split(/\s+/)[0] : T('defaultName'); }

  /* ================= icons ================= */
  var IC = {
    home: '<path d="M4 10.4 12 4l8 6.4V19a1.5 1.5 0 0 1-1.5 1.5H15v-5.2H9v5.2H5.5A1.5 1.5 0 0 1 4 19z"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="2.2"/><rect x="13" y="4" width="7" height="7" rx="2.2"/><rect x="4" y="13" width="7" height="7" rx="2.2"/><rect x="13" y="13" width="7" height="7" rx="2.2"/>',
    cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="3.2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    user: '<circle cx="12" cy="8.5" r="4"/><path d="M4.5 20.2c1.2-3.8 4-5.6 7.5-5.6s6.3 1.8 7.5 5.6"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>',
    bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    chev: '<path d="M9.5 5.5 16 12l-6.5 6.5"/>',
    down: '<path d="M7 10l5 5 5-5"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    close: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.6 3.6 5.4 3.6 8.5s-1.2 5.9-3.6 8.5c-2.4-2.6-3.6-5.4-3.6-8.5S9.6 6.1 12 3.5z"/>',
    chat: '<path d="M5 18.8V7a2.5 2.5 0 0 1 2.5-2.5h9A2.5 2.5 0 0 1 19 7v7a2.5 2.5 0 0 1-2.5 2.5H8.8z"/><path d="M9 9.8h6M9 12.8h4"/>',
    phone: '<path d="M7 3.5h3l1.5 4-2 1.3a10 10 0 0 0 5.7 5.7l1.3-2 4 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 5 5.5a2 2 0 0 1 2-2z"/>',
    refresh: '<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3"/><path d="M19.5 4.5v4h-4"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>',
    spark: '<path d="M12 3.5c.6 4.4 2.3 6.4 6.5 7-4.2.6-5.9 2.6-6.5 7-.6-4.4-2.3-6.4-6.5-7 4.2-.6 5.9-2.6 6.5-7z"/><path d="M18.5 3.5v3M17 5h3"/>',
    card: '<rect x="3.5" y="6" width="17" height="12.5" rx="2.5"/><path d="M3.5 10h17M7 15h3"/>',
    store: '<path d="M4.5 9.8V19a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V9.8"/><path d="M3.5 9.5 5 4.5h14l1.5 5a2.7 2.7 0 0 1-5.3.6 2.7 2.7 0 0 1-5.4 0 2.7 2.7 0 0 1-5.3-.6z"/><path d="M10 20v-5h4v5"/>',
    device: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.6"/><path d="M10.5 18.5h3"/>',
    edit: '<path d="M4.5 19.5l1-4L15.5 5.5a2.1 2.1 0 0 1 3 3L8.5 18.5z"/><path d="M13.5 7.5l3 3"/>',
    install: '<path d="M12 4v10.5M7.5 10l4.5 4.5 4.5-4.5M5 19.5h14"/>',
    ext: '<path d="M14 4.5h5.5V10M19.5 4.5 11 13"/><path d="M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10"/>',
    tag: '<path d="M3.5 12.2V5a1.5 1.5 0 0 1 1.5-1.5h7.2l8.3 8.3a1.5 1.5 0 0 1 0 2.1l-6.9 6.9a1.5 1.5 0 0 1-2.1 0z"/><circle cx="8" cy="8" r="1.5"/>',
    nav: '<path d="M20 4 4 11l7 2 2 7z"/>',
    users: '<circle cx="9" cy="8.5" r="3.5"/><path d="M3 19.5c.8-3.2 3.1-4.8 6-4.8s5.2 1.6 6 4.8"/><path d="M15.5 5.2a3.5 3.5 0 0 1 0 6.6M17.6 14.8c1.8.6 3 2.1 3.4 4.4"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/>',
    sunset: '<path d="M5 17a7 7 0 0 1 14 0"/><path d="M3 20.5h18M12 4v3M4.9 8.9l1.4 1.4M19.1 8.9l-1.4 1.4"/>',
    moon: '<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/>',
    alert: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5.5M12 16.2h.01"/>',
    shield: '<path d="M12 3.5 5 6v5.5c0 4.4 3 7.6 7 9 4-1.4 7-4.6 7-9V6z"/><path d="M9 12l2 2 4-4"/>',
    leaf: '<path d="M5 19c0-8 5-13.5 14-14 0 9-5.5 14-14 14z"/><path d="M5 19 13 11"/>'
  };
  function I(n, cls) { return '<svg class="ic' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (IC[n] || '') + '</svg>'; }
  function av(sp, cls) { return '<span class="av' + (cls ? ' ' + cls : '') + '">' + A.avatar(sp.look) + '</span>'; }
  function stars(r) { return '<span class="stars" style="--pct:' + Math.round(r / 5 * 100) + '%" role="img" aria-label="' + esc(T('rated', { r: r.toFixed(1) })) + '"></span>'; }

  /* ================= router ================= */
  var idx = 0, cur = null, pendingAfterPop = null, flowStart = -1, scrollMemo = {}, sheet = null, sheetPushed = false, lastFocus = null;
  /* after a booking: the entry the flow started from, and the history index of the success screen */
  var bookedBase = null, bookedIdx = -1, afterRoute = null;
  /* the desktop phone frame is scaled with CSS zoom: rects are zoomed, scroll offsets are not */
  function Z() { var d = doc.getElementById('device'); return (d && parseFloat(getComputedStyle(d).zoom)) || 1; }
  function focusEl(n) { if (!n) return; try { n.focus({ preventScroll: true }); } catch (e) { n.focus(); } }
  /* quiet = first paint / language re-render: content appears in its final state (no entrance motion) */
  var quiet = true;
  function mo(cls) { return quiet ? cls : cls + ' anim'; }
  function stagger(el) {
    $$('.sec, .search-wrap, .lt-head ~ .scroll .bcard, .group, .loyal, .profile-head, .svc-group', el).slice(0, 7).forEach(function (n, i) { n.classList.add('stg'); n.style.setProperty('--st', i); });
  }
  var views = $('#views'), tabbar = $('#tabbar'), glass = $('.screen-glass'), sheetLayer = $('#sheet-layer');

  function parse(h) {
    var p = String(h || '').replace(/^#/, '').split('?')[0], m;
    if (!p || p === '/') return { redirect: S.onboarded ? '/home' : '/welcome' };
    if (p === '/welcome') return { screen: 'welcome', key: 'welcome' };
    if ((m = p.match(/^\/home(?:\/(salon))?$/))) return { screen: 'home', key: 'home', sheet: m[1] ? { type: 'salon' } : null };
    if ((m = p.match(/^\/services(?:\/([a-z]+))?$/))) return { screen: 'services', key: 'services', cat: m[1] && CAT[m[1]] ? m[1] : 'all' };
    if (p === '/search') return { screen: 'search', key: 'search' };
    if ((m = p.match(/^\/service\/([a-z]+)$/)) && SV[m[1]]) return { screen: 'service', key: 'service/' + m[1], id: m[1] };
    if ((m = p.match(/^\/book\/([a-z]+)\/(specialist|time|summary)$/)) && SV[m[1]]) {
      var sc = { specialist: 'spec', time: 'time', summary: 'summary' }[m[2]];
      return { screen: sc, key: 'book/' + m[1] + '/' + m[2], id: m[1] };
    }
    if ((m = p.match(/^\/booked\/([\w-]+)$/))) return { screen: 'booked', key: 'booked/' + m[1], bid: m[1] };
    if ((m = p.match(/^\/bookings(?:\/(past))?$/))) return { screen: 'bookings', key: 'bookings', seg: m[1] ? 'past' : 'up' };
    if ((m = p.match(/^\/bookings\/(cancel|reschedule)\/([\w-]+)$/))) return { screen: 'bookings', key: 'bookings', seg: 'up', sheet: { type: m[1], id: m[2] } };
    if ((m = p.match(/^\/profile(?:\/(reset|details|salon|install))?$/))) return { screen: 'profile', key: 'profile', sheet: m[1] ? { type: m[1] } : null };
    return { redirect: S.onboarded ? '/home' : '/welcome' };
  }
  function basePath(r) {
    if (r.screen === 'home') return '/home';
    if (r.screen === 'bookings') return r.seg === 'past' ? '/bookings/past' : '/bookings';
    if (r.screen === 'profile') return '/profile';
    return location.hash.slice(1);
  }
  function go(path, opt) {
    opt = opt || {};
    if (!opt.replace && '#' + path === location.hash) return;
    try {
      if (opt.replace) history.replaceState({ i: idx }, '', '#' + path);
      else { idx += 1; history.pushState({ i: idx }, '', '#' + path); }
    } catch (e) { location.hash = path; return; }
    route(opt.dir || (opt.replace ? 'replace' : 'fwd'));
  }
  function back(fallback) { if (idx > 0) history.back(); else go(fallback || '/home', { replace: true, dir: 'back' }); }
  function fallbackFor(r) {
    switch (r.screen) {
      case 'service': return '/services/' + SV[r.id].cat;
      case 'spec': return '/service/' + r.id;
      case 'time': return '/book/' + r.id + '/specialist';
      case 'summary': return '/book/' + r.id + '/time';
      case 'booked': return '/bookings';
      default: return '/home';
    }
  }
  window.addEventListener('popstate', function (e) {
    var st = e.state, dir = 'fwd';
    if (st && typeof st.i === 'number') { dir = st.i < idx ? 'back' : 'fwd'; idx = st.i; }
    else { idx += 1; try { history.replaceState({ i: idx }, '', location.hash); } catch (er) { /* ignore */ } }
    if (pendingAfterPop) {
      var p = pendingAfterPop; pendingAfterPop = null;
      var pr = parse('#' + p);
      if (pr.screen === 'booked') { bookedBase = location.hash.slice(1); go(p, { dir: 'fwd' }); bookedIdx = idx; return; }
      if (parse(location.hash).key === pr.key) { route('back'); return; }
      go(p, { dir: 'back' });
      return;
    }
    var nr = parse(location.hash);
    /* Back from the success screen must never land in a half-finished booking flow */
    if (cur && cur.r.screen === 'booked' && /^(spec|time|summary)$/.test(nr.screen)) { go('/home', { replace: true, dir: 'back' }); return; }
    /* after "Reset demo", Back keeps the visitor in onboarding instead of the old app state */
    if (!S.onboarded && nr.screen && nr.screen !== 'welcome') { go('/welcome', { replace: true, dir: 'back' }); return; }
    route(dir);
  });

  var SCREENS = {};
  function route(dir) {
    var r = parse(location.hash);
    if (r.redirect) { try { history.replaceState({ i: idx }, '', '#' + r.redirect); } catch (e) { /* ignore */ } r = parse('#' + r.redirect); }
    if (cur && cur.key === r.key && dir !== 'force') {
      var prevR = cur.r; cur.r = r;
      if (cur.def.update) cur.def.update(cur.el, r, prevR);
      syncSheet(r, dir);
    } else {
      closeSheet(true);
      render(r, dir === 'force' ? 'init' : dir);
      syncSheet(r, 'init');
    }
    if (afterRoute) { var f = afterRoute; afterRoute = null; f(); }
  }
  function render(r, dir) {
    var def = SCREENS[r.screen];
    if (def.guard) { var g = def.guard(r); if (g) { go(g, { replace: true }); return; } }
    var prev = cur;
    if (prev) { var ps = $('.scroll', prev.el); if (ps) scrollMemo[prev.key] = ps.scrollTop; }
    var el = doc.createElement('section');
    el.className = 'screen scr-' + r.screen + (def.tab ? ' has-tabs' : '');
    el.setAttribute('data-screen', r.screen);
    quiet = dir === 'init' || dir === 'lang' || RM.matches;
    el.innerHTML = def.render(r);
    quiet = false;
    cur = { key: r.key, r: r, el: el, def: def };
    if (r.screen === 'service' && dir === 'fwd' && prev && prev.def.level <= 2 && prev.r.screen !== 'service') flowStart = idx;
    var anim = 'none';
    if (prev && dir !== 'init' && dir !== 'lang' && !RM.matches) {
      var pl = prev.def.level, nl = def.level;
      if (prev.r.screen === 'welcome') anim = 'fade';
      else if (def.modal && nl > pl) anim = 'modal';
      else if (prev.def.modal && nl < pl) anim = 'unmodal';
      else if (nl > pl) anim = 'push';
      else if (nl < pl) anim = 'pop';
      else anim = def.tab ? 'fade' : (dir === 'back' ? 'pop' : 'push');
    }
    if (anim === 'fade') stagger(el);
    swap(prev && prev.el, el, anim);
    if (def.mount) def.mount(el, r, dir);
    enhanceRows(el);
    if (dir === 'back' || dir === 'lang') { var sc = $('.scroll', el); if (sc && scrollMemo[r.key]) sc.scrollTop = scrollMemo[r.key]; }
    setTabs(def.tab);
    setChrome(def.sb || 'dark', def.hi || 'dark');
    if (dir !== 'init' && dir !== 'lang') {
      var h = $('[data-focus]', el) || $('h1', el);
      if (h) { h.setAttribute('tabindex', '-1'); focusEl(h); }
    }
  }
  function swap(old, el, anim) {
    $$('.screen.leaving', views).forEach(function (n) { n.remove(); });
    views.appendChild(el);
    if (!old) return;
    old.classList.add('leaving'); old.setAttribute('aria-hidden', 'true'); old.inert = true;
    if (anim === 'none' || !el.animate) { old.remove(); return; }
    var X = root.dir === 'rtl' ? -1 : 1, E = 'cubic-bezier(.32,.72,0,1)', Tm = 470, a;
    var done = function () { if (old.parentNode) old.remove(); };
    if (anim === 'push') {
      el.style.zIndex = 3;
      el.animate([{ transform: 'translateX(' + (100 * X) + '%)', boxShadow: '0 0 0 rgba(30,8,26,0)' }, { transform: 'translateX(0)', boxShadow: (-14 * X) + 'px 0 40px rgba(30,8,26,.16)' }], { duration: Tm, easing: E });
      a = old.animate([{ transform: 'translateX(0)', opacity: 1 }, { transform: 'translateX(' + (-30 * X) + '%)', opacity: .7 }], { duration: Tm, easing: E, fill: 'forwards' });
    } else if (anim === 'pop') {
      old.style.zIndex = 3;
      el.animate([{ transform: 'translateX(' + (-30 * X) + '%)', opacity: .7 }, { transform: 'translateX(0)', opacity: 1 }], { duration: Tm, easing: E });
      a = old.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(' + (100 * X) + '%)' }], { duration: Tm, easing: E, fill: 'forwards' });
    } else if (anim === 'modal') {
      el.style.zIndex = 3;
      el.animate([{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }], { duration: 560, easing: E });
      a = old.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: .5, transform: 'scale(.96)' }], { duration: 560, easing: E, fill: 'forwards' });
    } else if (anim === 'unmodal') {
      old.style.zIndex = 3;
      el.animate([{ opacity: .5, transform: 'scale(.96)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 500, easing: E });
      a = old.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(100%)' }], { duration: 500, easing: E, fill: 'forwards' });
    } else {
      el.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 300, easing: 'cubic-bezier(.2,.8,.2,1)' });
      a = old.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' });
    }
    a.onfinish = done; a.oncancel = done;
    /* safety net: if the animation clock is paused (background tab), settle into the final state anyway */
    setTimeout(function () {
      [el, old].forEach(function (n) { if (n.getAnimations) n.getAnimations().forEach(function (x) { if (x.playState !== 'finished') { try { x.finish(); } catch (er) { /* ignore */ } } }); });
      done(); el.style.zIndex = '';
    }, 700);
  }
  function setChrome(sb, hi) { if (glass) { glass.setAttribute('data-sb', sb); glass.setAttribute('data-hi', hi); } }

  /* ================= tab bar ================= */
  var TABS = [['home', '/home', 'home', 'tabHome'], ['services', '/services', 'grid', 'tabServices'], ['bookings', '/bookings', 'cal', 'tabBookings'], ['profile', '/profile', 'user', 'tabProfile']];
  function renderTabs() {
    tabbar.setAttribute('aria-label', T('mainNav'));
    var n = upcoming().length;
    tabbar.innerHTML = TABS.map(function (t) {
      return '<a class="tab" href="#' + t[1] + '" data-tab="' + t[0] + '">' + '<span class="tab-ic">' + I(t[2]) + '</span><span>' + T(t[3]) + '</span>' +
        (t[0] === 'bookings' ? '<span class="sr-only tab-sr">' + (n ? esc(T('upcomingSr', { n: n })) : '') + '</span>' : '') +
        (t[0] === 'bookings' && n ? '<span class="tab-badge" aria-hidden="true">' + n + '</span>' : '') + '</a>';
    }).join('');
    setTabs(cur && cur.def.tab);
  }
  function setTabs(active) {
    tabbar.classList.toggle('is-hidden', !active);
    tabbar.inert = !active;
    $$('.tab', tabbar).forEach(function (a) { if (a.getAttribute('data-tab') === active) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  }
  function refreshBadge() {
    var b = $('[data-tab="bookings"]', tabbar); if (!b) return;
    var n = upcoming().length, el = $('.tab-badge', b), sr = $('.tab-sr', b);
    if (sr) sr.textContent = n ? T('upcomingSr', { n: n }) : '';
    if (n) { if (!el) { el = doc.createElement('span'); el.className = 'tab-badge'; el.setAttribute('aria-hidden', 'true'); b.appendChild(el); } el.textContent = n; } else if (el) el.remove();
  }

  /* ================= toasts ================= */
  function toast(msg, icon) {
    var box = $('#toasts'), t = doc.createElement('div');
    while (box.children.length > 1) box.firstChild.remove();
    t.className = 'toast'; t.innerHTML = I(icon || 'info') + '<span>' + esc(msg) + '</span>';
    box.appendChild(t);
    setTimeout(function () { t.classList.add('out'); setTimeout(function () { t.remove(); }, 320); }, 2800);
  }

  /* ================= shared pieces ================= */
  function appbar(title, sub) {
    return '<header class="appbar"><button class="icon-btn" type="button" data-act="back" aria-label="' + esc(T('back')) + '">' + I('back', 'i-dir') + '</button>' +
      '<div class="appbar-title"><h1>' + esc(title) + '</h1>' + (sub ? '<p>' + esc(sub) + '</p>' : '') + '</div><span class="appbar-spacer"></span></header>';
  }
  function steps(n) { var s = '<div class="' + mo('steps') + '" aria-hidden="true">'; for (var i = 1; i <= 3; i++) s += '<span class="' + (i < n ? 'on done' : i === n ? 'on' : '') + '"></span>'; return s + '</div>'; }
  function svcRow(s) {
    return '<a class="svc-row" href="#/service/' + s.id + '"><span class="thumb">' + A.serviceArt(s) + '</span><span class="svc-info"><strong>' + esc(L(s)) + '</strong>' +
      '<span class="svc-desc">' + esc(L(s.d)) + '</span><span class="svc-meta">' + I('clock') + '<span>' + dur(s.dur) + '</span><span class="sep" aria-hidden="true"></span><span class="price">' + money(s.price) + '</span></span></span>' +
      '<span class="chev" aria-hidden="true">' + I('chev', 'i-dir') + '</span></a>';
  }
  function demoFoot() { return '<p class="demo-foot">' + I('info') + '<span>' + esc(T('demoFoot')) + ' <a href="../../">' + esc(T('demoLink')) + '</a></span></p>'; }
  /* list separator for accessible names */
  function cm() { return lang === 'ar' ? '، ' : ', '; }
  function dateBadge(ds) { var d = parseYmd(ds); return '<span class="date-badge" aria-hidden="true"><span>' + dname(d, true) + '</span><b>' + d.getDate() + '</b><span>' + mname(d, true) + '</span></span>'; }

  /* ================= screens ================= */
  /* ---- welcome ---- */
  SCREENS.welcome = {
    level: 0, sb: 'dark',
    render: function () {
      var specs = [SP.hala, SP.noura, SP.joanna];
      var slides = T('ob').map(function (s, i) {
        return '<div class="slide' + (i ? '' : ' is-active') + '" role="group" aria-roledescription="slide" aria-label="' + esc(T('slideOf', { n: i + 1, m: 3 })) + '">' +
          '<div class="ob-wrap">' + A.onboard(i, specs) + '</div><h2 class="ob-title">' + esc(s.t) + '</h2><p class="ob-text">' + esc(s.p) + '</p></div>';
      }).join('');
      return '<div class="wel-top"><span class="wel-brand">' + A.mark('mark') + '<span class="wordmark">' + esc(T('brand')) + '<small>' + esc(T('brandSub')) + '</small></span></span>' +
        '<button class="link-btn" type="button" data-act="ob-skip">' + esc(T('skip')) + '</button></div>' +
        '<h1 class="sr-only">' + esc(T('appName')) + '</h1>' +
        '<div class="slides" tabindex="0" aria-roledescription="carousel" aria-label="' + esc(T('appName')) + '">' + slides + '</div>' +
        '<div class="wel-foot"><div class="dots" aria-hidden="true"><span class="on"></span><span></span><span></span></div>' +
        '<button class="btn btn-primary wel-next" type="button" data-act="ob-next"><span>' + esc(T('next')) + '</span>' + I('chev', 'i-dir') + '</button></div>' +
        '<p class="wel-note">' + esc(T('obNote')) + '</p>';
    },
    mount: function (el) {
      var sl = $('.slides', el), slides = $$('.slide', el), dots = $$('.dots span', el), btn = $('.wel-next span', el), at = 0;
      var lock = 0;
      function paint(i) {
        at = i;
        slides.forEach(function (s, k) { s.classList.toggle('is-active', k === at); s.setAttribute('aria-hidden', String(k !== at)); });
        dots.forEach(function (d, k) { d.classList.toggle('on', k === at); });
        btn.textContent = at === slides.length - 1 ? T('getStarted') : T('next');
      }
      function sync() {
        if (Date.now() < lock) return;
        var r = sl.getBoundingClientRect(), best = 0, bd = 1e9;
        slides.forEach(function (s, i) { var d = Math.abs(s.getBoundingClientRect().left - r.left); if (d < bd) { bd = d; best = i; } });
        if (best !== at) paint(best);
      }
      paint(0);
      sl.addEventListener('scroll', sync, { passive: true });
      sl.addEventListener('scrollend', function () { lock = 0; sync(); });
      sl.addEventListener('keydown', function (e) {
        var fwd = root.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight', bwd = root.dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
        if (e.key === fwd && at < slides.length - 1) { e.preventDefault(); goTo(at + 1); }
        if (e.key === bwd && at > 0) { e.preventDefault(); goTo(at - 1); }
      });
      function goTo(i) {
        var dx = slides[i].getBoundingClientRect().left - sl.getBoundingClientRect().left;
        lock = Date.now() + 700; paint(i);
        sl.scrollBy({ left: dx, behavior: RM.matches ? 'auto' : 'smooth' });
      }
      el.addEventListener('click', function (e) {
        var t = e.target.closest('[data-act]'); if (!t) return;
        if (t.dataset.act === 'ob-skip') finishOnboarding();
        if (t.dataset.act === 'ob-next') { if (at >= slides.length - 1) finishOnboarding(); else goTo(at + 1); }
      });
    }
  };
  function finishOnboarding() { S.onboarded = true; save(); go('/home', { replace: true }); }

  /* ---- home ---- */
  function greeting() { var h = new Date().getHours(); return T(h < 12 ? 'gMorning' : (h < 17 ? 'gAfternoon' : 'gEvening')); }
  function heroDeco() {
    return '<svg viewBox="0 0 190 230" aria-hidden="true" focusable="false"><path d="M118 236C120 196 116 160 124 126" stroke="#9DB79A" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/>' +
      '<path d="M120 200c-18-2-30-12-34-28 16 0 28 10 34 28z" fill="url(#lk-leaf)" opacity=".75"/>' +
      A.lilacCluster(122, 30, 112, 40, 5, 54) + '</svg>';
  }
  SCREENS.home = {
    level: 1, tab: 'home', sb: 'light',
    render: function () {
      var up = upcoming()[0], h = '';
      h += '<div class="mini-head" aria-hidden="true">' + A.mark('mark') + '<span>' + esc(T('brand')) + '</span></div><div class="scroll">';
      h += '<header class="home-hero"><div class="hero-deco" aria-hidden="true">' + heroDeco() + '</div>' +
        '<div class="hero-top"><span class="brand-chip">' + A.mark('mark') + '<span>' + esc(T('brand')) + '</span></span>' +
        '<a class="loc-btn" href="#/home/salon" aria-label="' + esc(T('salonLoc')) + '">' + I('pin') + '<span>' + esc(T('location')) + '</span>' + I('down') + '</a>' +
        '<button class="icon-btn on-dark" type="button" data-act="notifs" aria-label="' + esc(T('notifs')) + '">' + I('bell') + '</button></div>' +
        '<h1 class="hero-title"><span class="hero-greet">' + esc(greeting()) + '</span> <span class="hero-name">' + esc(userName()) + '</span></h1><p class="hero-sub">' + esc(T('homeSub')) + '</p></header>';
      h += '<div class="search-wrap"><a class="search-field" href="#/search" aria-label="' + esc(T('searchLabel')) + '">' + I('search') + '<span>' + esc(T('searchPh')) + '</span></a></div>';
      h += '<section class="sec" aria-labelledby="h-cats"><div class="sec-head"><h2 id="h-cats">' + esc(T('categories')) + '</h2><a href="#/services">' + esc(T('seeAll')) + '</a></div><div class="cats">' +
        D.categories.map(function (c) { return '<a class="cat-tile c-' + c.id + '" href="#/services/' + c.id + '"><span class="cat-ic-wrap">' + A.catIcon(c.id) + '</span><span>' + esc(L(c)) + '</span></a>'; }).join('') + '</div></section>';
      if (up) {
        var s = SV[up.service], sp = SP[up.spec];
        h += '<section class="sec" aria-labelledby="h-next"><div class="sec-head"><h2 id="h-next">' + esc(T('nextVisit')) + '</h2><a href="#/bookings">' + esc(T('seeAll')) + '</a></div>' +
          '<a class="next-card" href="#/bookings">' + dateBadge(up.date) + '<span class="next-info"><strong>' + esc(L(s)) + '</strong><span>' + esc(dshort(up.date)) + ' · ' + tfmt(up.time) + '</span>' +
          '<span>' + esc(T('withSpec', { s: L(sp) })) + '</span><span class="next-rel">' + I('clock') + esc(relDay(up.date)) + '</span></span>' + av(sp) + '</a></section>';
      }
      h += '<section class="sec" aria-labelledby="h-offers"><div class="sec-head"><h2 id="h-offers">' + esc(T('offers')) + '</h2></div><div class="hscroll offers">' +
        D.offers.map(function (o, i) {
          return '<a class="offer t-' + o.theme + '" href="#' + o.go + '" aria-label="' + esc(L(o.title) + '. ' + L(o.sub)) + '"><span class="offer-art">' + A.offerArt(o.theme) + '</span>' +
            '<span class="offer-tag">' + esc(L(o.tag)) + '</span><h3>' + esc(L(o.title)) + '</h3><p>' + esc(L(o.sub)) + '</p>' +
            '<span class="offer-cta">' + esc(T('offerCta')) + I('chev', 'i-dir') + '</span></a>';
        }).join('') + '</div><div class="dots offer-dots" aria-hidden="true">' + D.offers.map(function (o, i) { return '<span' + (i ? '' : ' class="on"') + '></span>'; }).join('') + '</div></section>';
      h += '<section class="sec" aria-labelledby="h-pop"><div class="sec-head"><h2 id="h-pop">' + esc(T('popular')) + '</h2><a href="#/services">' + esc(T('seeAll')) + '</a></div><div class="hscroll pops">' +
        D.services.filter(function (s) { return s.popular; }).map(function (s) {
          return '<a class="pop-card" href="#/service/' + s.id + '"><span class="pop-art">' + A.serviceArt(s) + '</span><span class="pop-body"><h3>' + esc(L(s)) + '</h3>' +
            '<span class="pop-meta"><span>' + dur(s.dur) + '</span><span class="price">' + money(s.price) + '</span></span></span></a>';
        }).join('') + '</div></section>';
      h += '<section class="sec" aria-labelledby="h-team"><div class="sec-head"><h2 id="h-team">' + esc(T('team')) + '</h2></div><div class="hscroll team">' +
        D.specialists.map(function (p) { return '<a class="team-card" href="#/services/' + p.cats[0] + '">' + av(p) + '<strong>' + esc(L(p)) + '</strong><span>' + esc(L(p.role)) + '</span></a>'; }).join('') + '</div></section>';
      /* the Q8Pixel pitch for phone visitors (the desktop frame shows it in the side panel instead) */
      h += '<a class="pitch" href="../../#contact"><span class="pitch-tag">' + I('spark') + esc(T('pitchTag')) + '</span><b>' + esc(T('pitchTitle')) + '</b><span class="pitch-body">' + esc(T('pitchBody')) + '</span>' +
        '<span class="pitch-cta">' + esc(T('pitchCta')) + I('chev', 'i-dir') + '</span></a>';
      h += demoFoot() + '</div>';
      return h;
    },
    mount: function (el) {
      var sc = $('.scroll', el), off = $('.offers', el), dots = $$('.offer-dots span', el);
      sc.addEventListener('scroll', function () {
        var on = sc.scrollTop > 190;
        if (on !== el.classList.contains('is-scrolled')) { el.classList.toggle('is-scrolled', on); setChrome(on ? 'dark' : 'light', 'dark'); }
      }, { passive: true });
      if (off) off.addEventListener('scroll', function () {
        var r = off.getBoundingClientRect(), cards = $$('.offer', off), best = 0, bd = 1e9;
        cards.forEach(function (c, i) { var d = Math.abs(c.getBoundingClientRect().left - r.left - 20); var d2 = Math.abs(c.getBoundingClientRect().right - r.right + 20); d = Math.min(d, d2); if (d < bd) { bd = d; best = i; } });
        dots.forEach(function (d, i) { d.classList.toggle('on', i === best); });
      }, { passive: true });
    }
  };

  /* ---- services ---- */
  function svcList(cat) {
    var h = '<div class="' + mo('svc-list') + '">';
    var cats = cat === 'all' ? D.categories : [CAT[cat]];
    cats.forEach(function (c) {
      var list = D.services.filter(function (s) { return s.cat === c.id; });
      h += '<section class="svc-group"><h2>' + esc(L(c.long)) + '<small>' + esc(svcCount(list.length)) + '</small></h2>' + list.map(svcRow).join('') + '</section>';
    });
    return h + '</div>';
  }
  function svcCount(n) {
    if (lang !== 'ar') return n + ' services';
    if (n === 1) return 'خدمة واحدة'; if (n === 2) return 'خدمتان'; if (n <= 10) return n + ' خدمات'; return n + ' خدمة';
  }
  function chipsHtml(active) {
    var c = '<a class="chip no-ic" href="#/services" data-replace="1" aria-current="' + (active === 'all') + '">' + esc(T('all')) + '</a>';
    D.categories.forEach(function (k) { c += '<a class="chip" href="#/services/' + k.id + '" data-replace="1" aria-current="' + (active === k.id) + '">' + A.catIcon(k.id) + esc(L(k)) + '</a>'; });
    return c;
  }
  SCREENS.services = {
    level: 1, tab: 'services',
    render: function (r) {
      return '<header class="lt-head"><h1>' + esc(T('services')) + '</h1><a class="icon-btn" href="#/search" aria-label="' + esc(T('search')) + '">' + I('search') + '</a></header>' +
        '<nav class="chips" aria-label="' + esc(T('categories')) + '">' + chipsHtml(r.cat) + '</nav>' +
        '<div class="scroll">' + svcList(r.cat) + '</div>';
    },
    mount: function (el, r) { centerChip(el); },
    update: function (el, r, prev) {
      if (prev && prev.cat === r.cat) return;
      $('.chips', el).innerHTML = chipsHtml(r.cat);
      var sc = $('.scroll', el); sc.innerHTML = svcList(r.cat); sc.scrollTop = 0;
      centerChip(el);
    }
  };
  function centerChip(el) {
    var bar = $('.chips', el), c = $('.chip[aria-current="true"]', bar); if (!c) return;
    var br = bar.getBoundingClientRect(), cr = c.getBoundingClientRect();
    bar.scrollBy({ left: ((cr.left + cr.width / 2) - (br.left + br.width / 2)) / Z(), behavior: 'auto' });
  }

  /* ---- search ---- */
  function norm(s) {
    s = String(s || '');
    try { s = s.normalize('NFD').replace(/[̀-ͯ]/g, '').normalize('NFC'); } catch (e) { /* old engines: keep accents */ }
    return s.toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[إأآا]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي')
      .replace(/[،؛؟٪-٭]/g, ' ').replace(/[^\w؀-ۿ\s]/g, ' ');
  }
  /* Each service is indexed in three tiers (name > category > description & add-ons). A word must start with the
     typed text (an Arabic ال/بال/وال/لل prefix is allowed); very short words must match whole. Adjacent words are
     also indexed joined, so "blowdry" finds "Blow-dry". */
  function idxField(arr) {
    var out = [];
    arr.forEach(function (t) {
      var w = norm(t).split(/\s+/).filter(Boolean);
      out = out.concat(w);
      for (var k = 0; k + 1 < w.length; k++) out.push(w[k] + w[k + 1]);
    });
    return ' ' + out.join(' ') + ' ';
  }
  var SEARCH_IDX = D.services.map(function (s, i) {
    var c = CAT[s.cat], adds = (s.addons || []).map(function (a) { return D.addons[a].en + ' ' + D.addons[a].ar; });
    return { s: s, i: i, f: [idxField([s.en, s.ar]), idxField([c.en, c.ar, c.long.en, c.long.ar]), idxField([s.d.en, s.d.ar].concat(adds))] };
  });
  function reEsc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function searchHtml(raw) {
    raw = String(raw || '').trim();
    var q = norm(raw).trim();
    if (!q) {
      return '<div class="search-sec"><h2>' + esc(T('popularSearches')) + '</h2><div class="pills">' +
        D.popularSearches.map(function (id) { var s = SV[id]; return '<a class="chip no-ic" href="#/service/' + id + '">' + esc(L(s)) + '</a>'; }).join('') + '</div></div>' +
        '<div class="search-sec"><h2>' + esc(T('categories')) + '</h2><div class="pills">' +
        D.categories.map(function (c) { return '<a class="chip" href="#/services/' + c.id + '">' + A.catIcon(c.id) + esc(L(c.long)) + '</a>'; }).join('') + '</div></div>';
    }
    var res = [];
    var res0 = q.split(/\s+/).map(function (t) { return new RegExp(' (?:ال|بال|وال|لل)?' + reEsc(t) + (t.length <= 2 ? ' ' : '')); });
    SEARCH_IDX.forEach(function (x) {
      var score = 0;
      for (var k = 0; k < res0.length; k++) {
        var best = 0;
        for (var f = 0; f < 3 && !best; f++) if (res0[k].test(x.f[f])) best = 3 - f;
        if (!best) return;
        score += best;
      }
      res.push({ s: x.s, i: x.i, sc: score });
    });
    res = res.sort(function (a, b) { return b.sc - a.sc || a.i - b.i; }).map(function (x) { return x.s; });
    if (!res.length) return '<div class="empty">' + A.emptyArt('search') + '<h2>' + esc(T('noResults', { q: raw })) + '</h2><p>' + esc(T('noResultsSub')) + '</p></div>';
    var n = res.length, label = lang === 'ar' ? (n === 1 ? 'نتيجة واحدة' : n === 2 ? 'نتيجتان' : n <= 10 ? n + ' نتائج' : n + ' نتيجة') : (n === 1 ? '1 result' : n + ' results');
    return '<p class="result-count">' + label + '</p><div class="svc-list">' + res.map(svcRow).join('') + '</div>';
  }
  SCREENS.search = {
    level: 2,
    render: function () {
      return '<header class="search-head"><button class="icon-btn" type="button" data-act="back" aria-label="' + esc(T('back')) + '">' + I('back', 'i-dir') + '</button>' +
        '<label class="search-box">' + I('search') + '<span class="sr-only">' + esc(T('searchLabel')) + '</span>' +
        '<input id="q" type="search" enterkeyhint="search" autocomplete="off" spellcheck="false" placeholder="' + esc(T('searchLabel')) + '">' +
        '<button class="clear-btn" type="button" data-act="q-clear" aria-label="' + esc(T('clear')) + '" hidden>' + I('close') + '</button></label></header>' +
        '<h1 class="sr-only">' + esc(T('search')) + '</h1><div class="scroll" id="results" aria-live="polite">' + searchHtml('') + '</div>';
    },
    mount: function (el, r, dir) {
      var q = $('#q', el), out = $('#results', el), clr = $('.clear-btn', el), t = 0;
      var saved = sessionGet('laylak.q');
      if (saved && dir === 'back') { q.value = saved; out.innerHTML = searchHtml(saved); clr.hidden = false; }
      q.addEventListener('input', function () { clearTimeout(t); clr.hidden = !q.value; t = setTimeout(function () { out.innerHTML = searchHtml(q.value); sessionSet('laylak.q', q.value); }, 120); });
      q.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); q.blur(); } });
      clr.addEventListener('click', function () { q.value = ''; clr.hidden = true; out.innerHTML = searchHtml(''); sessionSet('laylak.q', ''); q.focus(); });
      if (dir !== 'back' && dir !== 'lang') setTimeout(function () { if (doc.body.contains(q)) { try { q.focus({ preventScroll: true }); } catch (e) { q.focus(); } } }, RM.matches ? 0 : 480);
    }
  };
  function sessionGet(k) { try { return sessionStorage.getItem(k) || ''; } catch (e) { return ''; } }
  function sessionSet(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } }

  /* ---- service detail ---- */
  SCREENS.service = {
    level: 2, sb: 'dark',
    render: function (r) {
      var s = SV[r.id], d = draftFor(s.id), c = calc(d), specs = specsFor(s), fav = S.fav.indexOf(s.id) >= 0;
      var favBtn = function (cls) { return '<button class="icon-btn ' + cls + ' fav" type="button" data-act="fav" aria-pressed="' + fav + '" aria-label="' + esc(T('fav')) + '">' + I('heart') + '</button>'; };
      var h = '<div class="mini-bar"><button class="icon-btn flat" type="button" data-act="back" aria-label="' + esc(T('back')) + '">' + I('back', 'i-dir') + '</button>' +
        '<span class="mini-title" aria-hidden="true">' + esc(L(s)) + '</span>' + favBtn('flat') + '</div>';
      h += '<div class="scroll"><div class="detail-hero">' + A.serviceArt(s) + '<div class="hero-btns"><button class="icon-btn glass" type="button" data-act="back" aria-label="' + esc(T('back')) + '">' + I('back', 'i-dir') + '</button>' + favBtn('glass') + '</div></div>';
      h += '<div class="detail-body"><p class="eyebrow">' + esc(L(CAT[s.cat].long)) + '</p><h1>' + esc(L(s)) + '</h1>' +
        '<div class="facts"><span class="fact">' + I('clock') + dur(s.dur) + '</span><span class="fact">' + I('tag') + money(s.price) + '</span><span class="fact">' + I('users') + esc(specCount(specs.length)) + '</span></div>' +
        '<p class="desc">' + esc(L(s.d)) + '</p>';
      if (s.addons && s.addons.length) {
        h += '<h2 class="h2" id="h-addons">' + esc(T('addons')) + '</h2><p class="sub">' + esc(T('addonsHint')) + '</p><div class="addons" role="group" aria-labelledby="h-addons">' +
          s.addons.map(function (id) {
            var a = D.addons[id], on = d.addons.indexOf(id) >= 0;
            return '<label class="addon"><input type="checkbox" value="' + id + '"' + (on ? ' checked' : '') + '><span class="box" aria-hidden="true">' + I('check') + '</span>' +
              '<span class="addon-name">' + esc(L(a)) + (a.min ? '<small>+ ' + dur(a.min) + '</small>' : '') + '</span><span class="addon-price">+ ' + money(a.price) + '</span></label>';
          }).join('') + '</div>';
      }
      h += '<h2 class="h2">' + esc(T('goodToKnow')) + '</h2><ul class="notes">' + D.notes[s.cat].map(function (n) { return '<li>' + I('spark') + '<span>' + esc(L(n)) + '</span></li>'; }).join('') + '</ul></div></div>';
      h += '<div class="cta-bar"><div class="cta-sum"><small>' + esc(T('total')) + ' · <span class="cta-dur">' + dur(c.dur) + '</span></small><strong class="cta-total">' + money(c.sub) + '</strong></div>' +
        '<a class="btn btn-primary" href="#/book/' + s.id + '/specialist">' + esc(T('bookNow')) + I('chev', 'i-dir') + '</a></div>';
      return h;
    },
    mount: function (el, r) {
      var s = SV[r.id], d = draftFor(s.id), sc = $('.scroll', el), heroBtns = $('.hero-btns', el), mini = $('.mini-bar', el);
      /* only one back/favourite pair is reachable at a time: the hero pair, or the compact bar once scrolled */
      function pair(on) { heroBtns.inert = on; mini.inert = !on; if (on) heroBtns.setAttribute('aria-hidden', 'true'); else heroBtns.removeAttribute('aria-hidden'); }
      pair(false);
      sc.addEventListener('scroll', function () {
        var on = sc.scrollTop > 230;
        if (on !== el.classList.contains('is-scrolled')) { el.classList.toggle('is-scrolled', on); pair(on); }
      }, { passive: true });
      el.addEventListener('change', function (e) {
        if (!e.target.matches('.addon input')) return;
        d.addons = $$('.addon input', el).filter(function (i) { return i.checked; }).map(function (i) { return i.value; });
        save();
        var c = calc(d), tot = $('.cta-total', el);
        tot.textContent = money(c.sub); $('.cta-dur', el).textContent = dur(c.dur);
        tot.classList.remove('bump'); void tot.offsetWidth; tot.classList.add('bump');
      });
    }
  };
  function specCount(n) {
    if (lang !== 'ar') return n === 1 ? '1 specialist' : n + ' specialists';
    if (n === 1) return 'خبيرة واحدة'; if (n === 2) return 'خبيرتان'; return n + ' خبيرات';
  }

  /* ---- choose specialist ---- */
  SCREENS.spec = {
    level: 3,
    render: function (r) {
      var s = SV[r.id], d = draftFor(s.id), specs = specsFor(s), c;
      if (!d.spec || (d.spec !== 'any' && specs.every(function (p) { return p.id !== d.spec; }))) d.spec = 'any';
      c = calc(d);
      function nextLine(id) {
        var n = nextAvail(id, c.dur);
        return n ? '<span class="next-slot">' + I('clock') + esc(T('nextAvail')) + ': ' + esc(whenShort(n.date, n.m)) + '</span>' : '<span class="next-slot none">' + esc(T('fullyBooked')) + '</span>';
      }
      var list = '<label class="spec-card"><input type="radio" name="spec" value="any"' + (d.spec === 'any' ? ' checked' : '') + '>' +
        '<span class="av-stack" aria-hidden="true">' + specs.slice(0, 3).map(function (p) { return av(p); }).join('') + '</span>' +
        '<span class="spec-info"><strong>' + esc(T('anySpec')) + '</strong><span class="spec-role">' + esc(T('anySpecSub')) + '</span>' + nextLine(specKey({ service: s.id, spec: 'any' })) + '</span><span class="radio" aria-hidden="true"></span></label>';
      specs.forEach(function (p) {
        list += '<label class="spec-card"><input type="radio" name="spec" value="' + p.id + '"' + (d.spec === p.id ? ' checked' : '') + '>' + av(p) +
          '<span class="spec-info"><strong>' + esc(L(p)) + '</strong><span class="spec-role">' + esc(L(p.role)) + ' · ' + esc(L(p.langs)) + '</span>' +
          '<span class="rating-line">' + stars(p.rating) + '<span aria-hidden="true">' + p.rating.toFixed(1) + '</span></span>' + nextLine(p.id) + '</span><span class="radio" aria-hidden="true"></span></label>';
      });
      var adds = d.addons.length ? d.addons.map(function (a) { return '+ ' + L(D.addons[a]); }).join(' · ') : L(CAT[s.cat].long);
      var pick = '<section class="pick-sum" aria-labelledby="h-pick"><h2 id="h-pick">' + esc(T('yourBooking')) + '</h2><div class="pick-row"><span class="thumb">' + A.serviceArt(s) + '</span>' +
        '<span class="pick-txt"><b>' + esc(L(s)) + '</b><small>' + esc(adds) + '</small><small>' + I('clock') + dur(c.dur) + '</small></span><b class="price">' + money(c.sub) + '</b></div>' +
        '<p class="pick-tip">' + I('shield') + '<span>' + esc(T('specTip')) + '</span></p></section>';
      return appbar(T('chooseSpec'), T('step', { n: 1 })) + steps(1) +
        '<div class="scroll"><p class="lead-line">' + esc(T('forSvc', { s: L(s) })) + ' · ' + dur(c.dur) + '</p><div class="spec-list" role="radiogroup" aria-label="' + esc(T('chooseSpec')) + '">' + list + '</div>' + pick + '</div>' +
        '<div class="cta-bar"><a class="btn btn-primary btn-block" href="#/book/' + s.id + '/time">' + esc(T('continue')) + I('chev', 'i-dir') + '</a></div>';
    },
    mount: function (el, r) {
      var d = draftFor(r.id); save();
      el.addEventListener('change', function (e) { if (e.target.name === 'spec') { d.spec = e.target.value; d.time = null; save(); } });
    }
  };

  /* ---- date & time ---- */
  /* cur = { date, m } of the appointment being rescheduled, so its day and time are labelled "current" */
  function dateChips(sel, spec, len, ignore, cur) {
    return next14().map(function (ds, i) {
      var d = parseYmd(ds), full = !hasSlots(ds, spec, len, ignore), isCur = cur && cur.date === ds;
      var top = i === 0 ? T('today') : (i === 1 && T('tomorrowShort') ? T('tomorrowShort') : dname(d, true));
      return '<button class="date-chip' + (full ? ' full' : '') + (isCur ? ' is-current' : '') + '" type="button" data-date="' + ds + '" aria-pressed="' + (ds === sel) + '" aria-label="' +
        esc(dlong(ds) + (isCur ? cm() + T('currentTime') : '') + (full ? cm() + T('unavailable') : '')) + '">' +
        '<span class="dw">' + esc(top) + '</span><span class="dn">' + d.getDate() + '</span><span class="dm">' + esc(mname(d, true)) + '</span></button>';
    }).join('');
  }
  function slotsHtml(ds, spec, len, sel, ignore, cur) {
    var all = slotsFor(ds, spec, len, ignore), groups = [['morning', 'sun', 0, 720], ['afternoon', 'sunset', 720, 1020], ['evening', 'moon', 1020, 1440]], h = '<div class="' + mo('slots-wrap') + '">';
    var curM = cur && cur.date === ds ? cur.m : null;
    if (!all.some(function (x) { return x.ok && x.m !== curM; })) {
      return h + '<p class="slots-empty">' + esc(T('noSlots')) + (parseYmd(ds).getDay() === 5 ? '<br>' + esc(T('fridayNote')) : '') + '</p></div>';
    }
    groups.forEach(function (g) {
      var list = all.filter(function (x) { return x.m >= g[2] && x.m < g[3]; });
      if (!list.length) return;
      h += '<div class="slot-group" role="group" aria-label="' + esc(T(g[0])) + '"><h3>' + I(g[1]) + esc(T(g[0])) + '</h3><div class="slots">' + list.map(function (x) {
        if (x.m === curM) {
          return '<button class="slot is-current" type="button" data-m="' + x.m + '" disabled aria-label="' + esc(tfmt(x.m) + cm() + T('currentTime')) + '">' + tfmt(x.m) + '<span class="slot-cur" aria-hidden="true">' + esc(T('current')) + '</span></button>';
        }
        return '<button class="slot" type="button" data-m="' + x.m + '" aria-pressed="' + (x.m === sel) + '"' + (x.ok ? '' : ' disabled aria-label="' + esc(tfmt(x.m) + cm() + T('unavailable')) + '"') + '>' + tfmt(x.m) + '</button>';
      }).join('') + '</div></div>';
    });
    if (parseYmd(ds).getDay() === 5) h += '<p class="time-note">' + I('info') + esc(T('fridayNote')) + '</p>';
    return h + '</div>';
  }
  function monthLabel(ds) { var d = parseYmd(ds); return (lang === 'ar' ? D.months.ar : D.months.en)[d.getMonth()] + ' ' + d.getFullYear(); }
  function slotOk(ds, spec, len, m, ignore) { return slotsFor(ds, spec, len, ignore).some(function (x) { return x.m === m && x.ok; }); }
  function firstOpen(spec, len, ignore) { var days = next14(); for (var i = 0; i < days.length; i++) if (hasSlots(days[i], spec, len, ignore)) return days[i]; return days[0]; }
  SCREENS.time = {
    level: 4,
    render: function (r) {
      var s = SV[r.id], d = draftFor(s.id), c, k;
      if (!d.spec) d.spec = 'any';
      c = calc(d); k = specKey(d);
      if (!d.date || next14().indexOf(d.date) < 0) d.date = firstOpen(k, c.dur);
      if (d.time != null && !slotOk(d.date, k, c.dur, d.time)) d.time = null;
      var who = d.spec === 'any' ? '<span class="with-chip any">' + I('users') + esc(T('anySpec')) + '</span>' :
        '<span class="with-chip">' + av(SP[d.spec]) + esc(T('withSpec', { s: L(SP[d.spec]) })) + '</span>';
      return appbar(T('pickTime'), T('step', { n: 2 })) + steps(2) +
        '<div class="scroll"><div class="time-head"><h2 class="month">' + esc(monthLabel(d.date)) + '</h2>' + who + '</div>' +
        '<div class="dates" role="group" aria-label="' + esc(T('date')) + '">' + dateChips(d.date, k, c.dur) + '</div>' +
        '<div class="slots-host">' + slotsHtml(d.date, k, c.dur, d.time) + '</div></div>' +
        '<div class="cta-bar"><div class="cta-sum"><small class="sel-day">' + esc(dshort(d.date)) + '</small><strong class="sel-time">' + (d.time != null ? tfmt(d.time) : esc(T('selectTime'))) + '</strong></div>' +
        '<button class="btn btn-primary to-sum" type="button" data-go="/book/' + s.id + '/summary"' + (d.time == null ? ' disabled' : '') + '>' + esc(T('continue')) + I('chev', 'i-dir') + '</button></div>';
    },
    mount: function (el, r) {
      var s = SV[r.id], d = draftFor(s.id), len = calc(d).dur, k = specKey(d); save();
      scrollChipIntoView($('.dates', el));
      el.addEventListener('click', function (e) {
        var dc = e.target.closest('.date-chip'), sl = e.target.closest('.slot');
        if (dc) {
          if (dc.getAttribute('aria-pressed') === 'true') return;
          d.date = dc.getAttribute('data-date');
          if (d.time != null && !slotOk(d.date, k, len, d.time)) d.time = null;
          save();
          $$('.date-chip', el).forEach(function (b) { b.setAttribute('aria-pressed', String(b === dc)); });
          $('.slots-host', el).innerHTML = slotsHtml(d.date, k, len, d.time);
          $('.month', el).textContent = monthLabel(d.date);
          updateCta();
        } else if (sl && !sl.disabled) {
          d.time = +sl.getAttribute('data-m'); save();
          $$('.slot', el).forEach(function (b) { b.setAttribute('aria-pressed', String(b === sl)); });
          updateCta(true);
        }
      });
      function updateCta(bump) {
        $('.sel-day', el).textContent = dshort(d.date);
        var st = $('.sel-time', el); st.textContent = d.time != null ? tfmt(d.time) : T('selectTime');
        $('.to-sum', el).disabled = d.time == null;
        if (bump) { st.classList.remove('bump'); void st.offsetWidth; st.classList.add('bump'); }
      }
    }
  };
  function scrollChipIntoView(bar) {
    if (!bar) return; var c = $('[aria-pressed="true"]', bar); if (!c) return;
    var br = bar.getBoundingClientRect(), cr = c.getBoundingClientRect();
    if (cr.left < br.left + 16 || cr.right > br.right - 16) bar.scrollBy({ left: ((cr.left + cr.width / 2) - (br.left + br.width / 2)) / Z() });
  }

  /* ---- summary & confirm ---- */
  function ensureSlot(d) {
    var len = calc(d).dur, k;
    if (!d.spec) d.spec = 'any';
    k = specKey(d);
    if (!d.date || next14().indexOf(d.date) < 0) d.date = firstOpen(k, len);
    if (d.time == null || !slotOk(d.date, k, len, d.time)) {
      var sl = slotsFor(d.date, k, len).filter(function (x) { return x.ok; });
      if (!sl.length) { d.date = firstOpen(k, len); sl = slotsFor(d.date, k, len).filter(function (x) { return x.ok; }); }
      d.time = sl.length ? sl[0].m : null;
    }
    return d.time != null;
  }
  function promoCheck(code, d) {
    var p = D.promos[code];
    if (!code) return { err: T('promoEmpty') };
    if (!p) return { err: T('promoBad') };
    if (p.services && p.services.indexOf(d.service) < 0) return { err: T('promoGlow') };
    if (p.days && p.days.indexOf(parseYmd(d.date).getDay()) < 0) return { err: T('promoGlow') };
    return { ok: true };
  }
  function totalsHtml(d) {
    var c = calc(d);
    return '<div class="trow"><span>' + esc(T('subtotal')) + '</span><span>' + money(c.sub) + '</span></div>' +
      (c.disc ? '<div class="trow disc"><span>' + esc(T('discount')) + ' (' + esc(d.promo) + ')</span><span>− ' + money(c.disc) + '</span></div>' : '') +
      '<div class="trow total"><span>' + esc(T('total')) + '</span><span>' + money(c.total) + '</span></div>';
  }
  function promoMsg(d) { return d.promo ? '<p class="ok">' + I('check') + esc(T('promoOk', { code: d.promo, pct: D.promos[d.promo].pct })) + '</p>' : ''; }
  SCREENS.summary = {
    level: 5,
    guard: function (r) { var d = draftFor(r.id); return ensureSlot(d) ? null : '/book/' + r.id + '/time'; },
    render: function (r) {
      var s = SV[r.id], d = draftFor(s.id), c = calc(d), dropped = null;
      /* a code that stopped applying (e.g. GLOW20 after moving to a Thursday) is removed, and the visitor is told why */
      if (d.promo && promoCheck(d.promo, d).err) { dropped = d.promo; d.promo = null; save(); }
      c = calc(d);
      var anyPick = d.spec === 'any' ? SP[pickSpec(s, d.date, d.time, c.dur)] : null;
      var sp = d.spec === 'any' ? anyPick : SP[d.spec];
      var adds = d.addons.length ? d.addons.map(function (a) { return '+ ' + L(D.addons[a]); }).join(' · ') : L(CAT[s.cat].long);
      var u = S.user, nameVal = u.name || (lang === 'ar' ? '' : '');
      var h = appbar(T('review'), T('step', { n: 3 })) + steps(3) + '<div class="scroll"><form id="sum-form" novalidate>';
      h += '<div class="card"><div class="sum-svc"><span class="thumb">' + A.serviceArt(s) + '</span><div><h2>' + esc(L(s)) + '</h2><p>' + esc(adds) + '</p></div>' +
        '<a class="link-btn sm" href="#/service/' + s.id + '" aria-label="' + esc(T('change') + ': ' + L(s)) + '">' + esc(T('change')) + '</a></div><dl class="sum-list">' +
        '<div class="sum-row"><dt>' + I('cal') + esc(T('date')) + '</dt><dd>' + esc(dlong(d.date)) + '</dd></div>' +
        '<div class="sum-row"><dt>' + I('clock') + esc(T('time')) + '</dt><dd>' + trange(d.time, c.dur) + '</dd></div>' +
        '<div class="sum-row"><dt>' + I('user') + esc(T('specialist')) + '</dt><dd>' + av(sp) + '<span>' + esc(L(sp)) + (anyPick ? '<small class="dd-sub">' + esc(T('firstFree')) + '</small>' : '') + '</span></dd></div>' +
        '<div class="sum-row"><dt>' + I('pin') + esc(T('location2')) + '</dt><dd>' + esc(T('salonShort')) + '</dd></div></dl></div>';
      h += '<section class="form-sec"><h2 class="h2">' + esc(T('yourDetails')) + '</h2>' +
        '<div class="field"><label for="f-name">' + esc(T('fullName')) + '</label><input class="input" id="f-name" name="name" autocomplete="name" maxlength="60" value="' + esc(nameVal || T('defaultName')) + '" aria-describedby="e-name" required><p class="err" id="e-name" aria-live="polite"></p></div>' +
        '<div class="field"><label for="f-phone">' + esc(T('mobile')) + '</label><div class="phone-wrap" dir="ltr"><span class="cc">' + kwFlag() + '+965</span>' +
        '<input id="f-phone" name="phone" type="tel" inputmode="numeric" autocomplete="tel-national" maxlength="17" placeholder="5XXX XXXX" value="' + esc(phoneView(u.phone || '')) + '" aria-describedby="h-phone e-phone" required></div>' +
        '<p class="hint" id="h-phone">' + esc(T('mobileHint')) + '</p><p class="err" id="e-phone" aria-live="polite"></p></div>' +
        '<div class="field"><label for="f-notes">' + esc(T('notes')) + '</label><textarea class="textarea" id="f-notes" name="notes" maxlength="200" placeholder="' + esc(T('notesPh')) + '" aria-describedby="c-notes">' + esc(d.notes || '') + '</textarea><span class="counter" id="c-notes">' + (d.notes || '').length + '/200</span></div></section>';
      h += '<section class="form-sec"><h2 class="h2"><label for="f-promo">' + esc(T('promo')) + '</label></h2><div class="promo-row"><input class="input" id="f-promo" name="promo" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="12" placeholder="' + esc(T('promoPh')) + '" value="' + esc(d.promo || '') + '" aria-describedby="e-promo">' +
        '<button class="btn btn-soft promo-btn" type="button" data-act="promo">' + esc(d.promo ? T('remove') : T('apply')) + '</button></div><div id="e-promo" aria-live="polite">' +
        (dropped ? '<p class="err">' + I('alert') + '<span>' + esc(T('promoGone', { code: dropped })) + '</span></p>' : promoMsg(d)) + '</div></section>';
      h += '<section class="form-sec"><h2 class="h2" id="h-pay">' + esc(T('payment')) + '</h2><div role="radiogroup" aria-labelledby="h-pay">' +
        [['salon', 'store', 'paySalon', 'paySalonSub'], ['knet', 'card', 'payKnet', 'payKnetSub'], ['apple', 'device', 'payApple', 'payAppleSub']].map(function (p) {
          return '<label class="pay"><input type="radio" name="pay" value="' + p[0] + '"' + (d.pay === p[0] ? ' checked' : '') + '><span class="pay-ic" aria-hidden="true">' + I(p[1]) + '</span>' +
            '<span class="pay-txt"><b>' + esc(T(p[2])) + '</b><small>' + esc(T(p[3])) + '</small></span><span class="radio" aria-hidden="true"></span></label>';
        }).join('') + '</div><p class="fine">' + I('shield') + esc(T('payNote')) + '</p>' +
        '<div class="card totals" style="margin:18px 0 12px">' + totalsHtml(d) + '</div></section>' +
        '<p class="policy">' + I('check') + esc(T('policy')) + '</p></form></div>';
      h += '<div class="cta-bar"><button class="btn btn-primary btn-block confirm-btn" type="submit" form="sum-form">' + esc(T('confirm', { p: money(c.total) })) + '</button></div>';
      return h;
    },
    mount: function (el, r) {
      var s = SV[r.id], d = draftFor(s.id), form = $('#sum-form', el), nameI = $('#f-name', el), phoneI = $('#f-phone', el), notes = $('#f-notes', el), promoI = $('#f-promo', el);
      var touched = {};
      save();
      function vName() { var v = nameI.value.trim(); return !v ? T('errName') : (v.replace(/\s/g, '').length < 2 ? T('errNameShort') : ''); }
      function vPhone() { var v = localPhone(phoneI.value); return !v ? T('errPhone') : (/^[4569]\d{7}$/.test(v) ? '' : T('errPhoneBad')); }
      function show(input, wrap, errEl, msg) {
        errEl.innerHTML = msg ? I('alert') + '<span>' + esc(msg) + '</span>' : '';
        input.setAttribute('aria-invalid', msg ? 'true' : 'false');
        if (wrap) wrap.classList.toggle('invalid', !!msg);
      }
      function check(which) {
        if (which !== 'phone') show(nameI, null, $('#e-name', el), vName());
        if (which !== 'name') show(phoneI, $('.phone-wrap', el), $('#e-phone', el), vPhone());
      }
      nameI.addEventListener('blur', function () { touched.name = true; show(nameI, null, $('#e-name', el), vName()); });
      nameI.addEventListener('input', function () { if (touched.name) show(nameI, null, $('#e-name', el), vName()); });
      phoneI.addEventListener('blur', function () { touched.phone = true; show(phoneI, $('.phone-wrap', el), $('#e-phone', el), vPhone()); });
      phoneI.addEventListener('input', function () {
        phoneI.value = phoneView(localPhone(phoneI.value));
        if (touched.phone) show(phoneI, $('.phone-wrap', el), $('#e-phone', el), vPhone());
      });
      notes.addEventListener('input', function () { d.notes = notes.value; $('#c-notes', el).textContent = notes.value.length + '/200'; save(); });
      el.addEventListener('change', function (e) { if (e.target.name === 'pay') { d.pay = e.target.value; save(); } });
      function refreshTotals() {
        $('.totals', el).innerHTML = totalsHtml(d);
        $('.confirm-btn', el).textContent = T('confirm', { p: money(calc(d).total) });
      }
      $('.promo-btn', el).addEventListener('click', function () {
        var box = $('#e-promo', el), btn = this;
        if (d.promo) { d.promo = null; promoI.value = ''; box.innerHTML = ''; btn.textContent = T('apply'); promoI.removeAttribute('aria-invalid'); save(); refreshTotals(); return; }
        var code = promoI.value.trim().toUpperCase(), res = promoCheck(code, d);
        if (res.err) { box.innerHTML = '<p class="err">' + I('alert') + '<span>' + esc(res.err) + '</span></p>'; promoI.setAttribute('aria-invalid', 'true'); return; }
        d.promo = code; promoI.value = code; promoI.setAttribute('aria-invalid', 'false'); box.innerHTML = promoMsg(d); btn.textContent = T('remove'); save(); refreshTotals();
      });
      promoI.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); $('.promo-btn', el).click(); } });
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        touched.name = touched.phone = true; check();
        var bad = $('[aria-invalid="true"]:not(#f-promo)', form);
        var btn = $('.confirm-btn', el);
        if (bad) {
          btn.classList.remove('shake'); void btn.offsetWidth; btn.classList.add('shake');
          toast(T('fixErrors'), 'alert');
          /* scroll only this screen's own list (never the app shell), then focus without a browser scroll */
          var sc = $('.scroll', el), field = bad.closest('.field') || bad;
          var top = field.getBoundingClientRect().top - sc.getBoundingClientRect().top;
          sc.scrollTo({ top: Math.max(0, sc.scrollTop + top / Z() - sc.clientHeight / 3), behavior: RM.matches ? 'auto' : 'smooth' });
          focusEl(bad);
          return;
        }
        if (!slotOk(d.date, specKey(d), calc(d).dur, d.time)) { go('/book/' + s.id + '/time', { replace: true }); return; }
        btn.classList.add('is-loading'); btn.disabled = true;
        btn.innerHTML = '<span class="spinner" aria-hidden="true"></span>' + esc(T('confirming'));
        setTimeout(function () { confirmBooking(s, d, nameI.value.trim(), localPhone(phoneI.value)); }, RM.matches ? 200 : 950);
      });
    }
  };
  function kwFlag() {
    return '<svg class="flag" viewBox="0 0 30 15" aria-hidden="true"><rect width="30" height="5" fill="#007A3D"/><rect y="5" width="30" height="5" fill="#fff"/><rect y="10" width="30" height="5" fill="#CE1126"/><path d="M0 0l7.5 5v5L0 15z" fill="#000"/></svg>';
  }
  function confirmBooking(s, d, name, phone) {
    var spec = d.spec === 'any' ? pickSpec(s, d.date, d.time, calc(d).dur) : d.spec;
    var id = 'b' + Date.now().toString(36);
    var b = { id: id, ref: 'LYK-' + (1000 + hash(id) % 9000), service: s.id, addons: d.addons.slice(), spec: spec, date: d.date, time: d.time, status: 'up', pay: d.pay, promo: d.promo || null, notes: d.notes || '' };
    S.bookings.push(b);
    S.user.name = storeName(name); S.user.phone = phone;
    S.draft = null; save();
    refreshBadge();
    /* Rewind the booking steps out of history first, so Back from the success screen returns to where the
       flow started (like a native app) instead of an empty "pick a time" step. */
    if (flowStart > 0 && idx >= flowStart) {
      var n = flowStart - 1 - idx; flowStart = -1;
      pendingAfterPop = '/booked/' + id;
      history.go(n);
    } else {
      flowStart = -1; bookedBase = null;
      go('/booked/' + id, { replace: true, dir: 'fwd' });
      bookedIdx = idx;
    }
  }

  /* ---- success ---- */
  SCREENS.booked = {
    level: 6, modal: true, sb: 'dark',
    guard: function (r) { return S.bookings.some(function (b) { return b.id === r.bid; }) ? null : '/bookings'; },
    render: function (r) {
      var b = S.bookings.filter(function (x) { return x.id === r.bid; })[0], s = SV[b.service], sp = SP[b.spec], c = calc(b);
      var conf = '', cols = ['#E9B8A6', '#CDB6E6', '#F3C9C3', '#C98A73', '#B898D8', '#F6D3C2'], rn = 7;
      for (var i = 0; i < 30; i++) {
        rn = (rn * 9301 + 49297) % 233280; var a = rn / 233280; rn = (rn * 9301 + 49297) % 233280; var bq = rn / 233280;
        conf += '<i style="--x:' + (a * 100).toFixed(1) + '%;--s:' + (8 + bq * 8).toFixed(1) + 'px;--c:' + cols[i % cols.length] + ';--d:' + (3.4 + bq * 2).toFixed(2) + 's;--dl:' + (.2 + ((i * 0.37) % 1) * 1.6).toFixed(2) + 's;--dx:' + ((bq - .5) * 140).toFixed(0) + 'px;--r:' + (180 + a * 540).toFixed(0) + 'deg"></i>';
      }
      return '<div class="scroll"><div class="success' + (quiet ? '' : ' celebrate') + '">' + (quiet ? '' : '<div class="confetti" aria-hidden="true">' + conf + '</div>') +
        '<div class="bloom-wrap">' + A.bloom() + '</div><h1>' + esc(T('booked')) + '</h1>' +
        '<p class="success-sub">' + esc(T('bookedSub', { day: dayPhrase(b.date), name: userName() })) + '</p>' +
        '<div class="ticket"><div class="ticket-top"><span class="thumb">' + A.serviceArt(s) + '</span><div><span class="tg-k">' + esc(T('bookingRef')) + ' <span class="ref">' + esc(b.ref) + '</span></span><h2>' + esc(L(s)) + '</h2></div></div>' +
        '<div class="ticket-cut" aria-hidden="true"></div><div class="ticket-grid">' +
        '<div><span class="tg-k">' + esc(T('date')) + '</span><span class="tg-v">' + esc(dshort(b.date)) + '</span></div>' +
        '<div><span class="tg-k">' + esc(T('time')) + '</span><span class="tg-v">' + tfmt(b.time) + '</span></div>' +
        '<div><span class="tg-k">' + esc(T('specialist')) + '</span><span class="tg-v">' + esc(L(sp)) + '</span></div>' +
        '<div><span class="tg-k">' + esc(T('total')) + '</span><span class="tg-v">' + money(c.total) + '</span></div></div></div>' +
        '<div class="success-actions"><button class="btn btn-primary btn-block" type="button" data-act="done" data-to="/bookings">' + esc(T('viewBookings')) + '</button>' +
        '<button class="btn btn-ghost btn-block" type="button" data-act="cal">' + I('cal') + esc(T('addCal')) + '</button>' +
        '<button class="link-btn" type="button" data-act="done" data-to="/home">' + esc(T('backHome')) + '</button></div></div></div>';
    }
  };
  /* leave the success screen: step back if that is where we are going anyway, otherwise replace it */
  function done(to) {
    to = to || '/home';
    if (bookedBase && idx === bookedIdx && idx > 0 && bookedBase === to) { bookedBase = null; history.back(); return; }
    bookedBase = null;
    go(to, { replace: true, dir: 'back' });
  }

  /* ---- my bookings ---- */
  function bookingCard(b) {
    var s = SV[b.service], sp = SP[b.spec], c = calc(b), st = bStatus(b), past = st !== 'up';
    var stLabel = { up: T('stUp'), done: T('stDone'), cancel: T('stCancel') }[st];
    /* one pattern on every card: [when ·] duration · add-ons */
    var meta = (past ? [] : [relDay(b.date)]).concat([dur(c.dur)], b.addons.map(function (a) { return '+ ' + L(D.addons[a]); })).filter(Boolean).join(' · ');
    return '<article class="bcard' + (past ? ' past' : ' up') + '" data-id="' + b.id + '" aria-label="' + esc(L(s) + cm() + dlong(b.date) + cm() + tfmt(b.time)) + '">' +
      '<div class="bcard-top">' + dateBadge(b.date) + '<div class="binfo"><h3>' + esc(L(s)) + '</h3><p>' + I('clock') + '<span>' + trange(b.time, c.dur) + '</span></p>' +
      '<p>' + av(sp) + '<span>' + esc(T('withSpec', { s: L(sp) })) + '</span></p></div><span class="status s-' + st + '">' + esc(stLabel) + '</span></div>' +
      '<div class="bcard-meta"><span>' + esc(meta) + '</span><b>' + money(c.total) + '</b></div>' +
      '<div class="bcard-foot">' + (past ? '<a class="btn btn-soft btn-sm" href="#/service/' + s.id + '">' + I('refresh') + esc(T('bookAgain')) + '</a>' :
        '<a class="btn btn-soft btn-sm" href="#/bookings/reschedule/' + b.id + '">' + I('cal') + esc(T('reschedule')) + '</a><a class="btn btn-ghost btn-sm" href="#/bookings/cancel/' + b.id + '">' + esc(T('cancel')) + '</a>') +
      '</div></article>';
  }
  function blistHtml(seg) {
    var list = seg === 'past' ? pastList() : upcoming();
    if (!list.length) {
      return '<div class="empty">' + A.emptyArt('cal') + '<h2>' + esc(T(seg === 'past' ? 'emptyPast' : 'emptyUp')) + '</h2><p>' + esc(T(seg === 'past' ? 'emptyPastSub' : 'emptyUpSub')) + '</p>' +
        (seg === 'past' ? '' : '<a class="btn btn-primary" href="#/services">' + esc(T('browse')) + '</a>') + '</div>';
    }
    var h = list.map(bookingCard).join('');
    if (seg !== 'past' && list.length < 3) {
      h += '<a class="suggest" href="#/services"><span class="suggest-art">' + A.motifOnly('lipstick', 'blush') + '</span><span class="suggest-txt"><b>' + esc(T('suggestTitle')) + '</b><small>' + esc(T('suggestSub')) + '</small></span>' +
        '<span class="chev" aria-hidden="true">' + I('chev', 'i-dir') + '</span></a>';
    }
    return h;
  }
  function segHtml(seg) {
    var n = upcoming().length;
    /* two plain links with aria-current (a simple view switch, not an ARIA tabs widget) */
    return '<span class="seg-thumb" aria-hidden="true"></span>' +
      '<a href="#/bookings" data-replace="1"' + (seg === 'up' ? ' aria-current="page"' : '') + '>' + esc(T('upcoming')) + (n ? ' <span class="count">' + n + '</span>' : '') + '</a>' +
      '<a href="#/bookings/past" data-replace="1"' + (seg === 'past' ? ' aria-current="page"' : '') + '>' + esc(T('past')) + '</a>';
  }
  SCREENS.bookings = {
    level: 1, tab: 'bookings',
    render: function (r) {
      return '<header class="lt-head"><h1>' + esc(T('myBookings')) + '</h1></header>' +
        '<nav class="seg" aria-label="' + esc(T('myBookings')) + '" data-i="' + (r.seg === 'past' ? 1 : 0) + '">' + segHtml(r.seg) + '</nav>' +
        '<div class="scroll"><div class="' + mo('blist') + '" id="blist">' + blistHtml(r.seg) + '</div></div>';
    },
    update: function (el, r, prev) {
      var seg = $('.seg', el), hadFocus = seg.contains(doc.activeElement);
      seg.setAttribute('data-i', r.seg === 'past' ? 1 : 0); seg.innerHTML = segHtml(r.seg);
      if (hadFocus) focusEl($('[aria-current="page"]', seg));
      if (!prev || prev.seg !== r.seg || el.__dirty) {
        el.__dirty = false;
        var sc = $('.scroll', el); sc.innerHTML = '<div class="blist anim" id="blist">' + blistHtml(r.seg) + '</div>';
        if (!prev || prev.seg !== r.seg) sc.scrollTop = 0;
      }
    }
  };

  /* ---- profile ---- */
  function profileHtml() {
    var u = S.user, nm = u.name || T('defaultName');
    var sw = function (k, title, sub) {
      return '<div class="row"><span class="row-txt"><b id="sw-' + k + '">' + esc(T(title)) + '</b><small>' + esc(T(sub)) + '</small></span>' +
        '<button class="switch" type="button" role="switch" data-act="switch" data-k="' + k + '" aria-checked="' + !!S.notif[k] + '" aria-labelledby="sw-' + k + '"></button></div>';
    };
    var row = function (href, ic, title, sub, extra) {
      return '<a class="row" href="' + href + '"' + (extra || '') + '><span class="row-ic' + (ic === 'refresh' ? ' danger' : '') + '">' + I(ic) + '</span><span class="row-txt"><b>' + esc(title) + '</b>' + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</span>' +
        '<span class="chev" aria-hidden="true">' + I(href.indexOf('../') === 0 ? 'ext' : 'chev', href.indexOf('../') === 0 ? '' : 'i-dir') + '</span></a>';
    };
    return '<div class="scroll"><header class="profile-head"><span class="p-av" aria-hidden="true">' + esc(nm.charAt(0).toUpperCase()) + '</span>' +
      '<div class="p-txt"><h1>' + esc(nm) + '</h1><p>' + esc(T('memberLine')) + '</p></div>' +
      '<a class="icon-btn" href="#/profile/details" aria-label="' + esc(T('editDetails')) + '">' + I('edit') + '</a></header>' +
      '<div class="loyal"><div class="loyal-top"><span>' + esc(T('memberCard')) + '</span>' + A.mark('mark') + '</div><h2>' + esc(T('pearlClub')) + '</h2>' +
      '<p class="loyal-pts">' + esc(T('points', { n: 240 })) + '</p><div class="lp" aria-hidden="true"><span></span></div><small>' + esc(T('nextReward')) + '</small></div>' +
      '<section class="group"><h2>' + esc(T('account')) + '</h2><div class="list">' + row('#/profile/details', 'user', T('editDetails'), u.phone ? fmtPhone(u.phone) : T('addMobile')) +
      row('#/bookings', 'cal', T('myBookings'), '') + '</div></section>' +
      '<section class="group"><h2 id="h-lang">' + esc(T('language')) + '</h2><div class="seg lang-seg" role="group" aria-labelledby="h-lang" data-i="' + (lang === 'ar' ? 1 : 0) + '"><span class="seg-thumb" aria-hidden="true"></span>' +
      '<button type="button" data-act="set-lang" data-lang="en" lang="en" aria-pressed="' + (lang === 'en') + '">English</button><button type="button" data-act="set-lang" data-lang="ar" lang="ar" aria-pressed="' + (lang === 'ar') + '">العربية</button></div></section>' +
      '<section class="group"><h2>' + esc(T('notifications')) + '</h2><div class="list">' + sw('remind', 'nRemind', 'nRemindSub') + sw('offers', 'nOffers', 'nOffersSub') + sw('sms', 'nSms', 'nSmsSub') + '</div></section>' +
      '<section class="group"><h2>' + esc(T('salon')) + '</h2><div class="list">' + row('#/profile/salon', 'pin', T('salonInfo'), T('address')) +
      '<button class="row" type="button" data-act="contact"><span class="row-ic">' + I('chat') + '</span><span class="row-txt"><b>' + esc(T('contact')) + '</b></span><span class="chev" aria-hidden="true">' + I('chev', 'i-dir') + '</span></button>' +
      row('#/profile/install', 'install', T('install'), T('installSub')) + '</div></section>' +
      '<section class="group"><h2>' + esc(T('demo')) + '</h2><div class="list">' + row('#/profile/reset', 'refresh', T('reset'), T('resetSub')) + row('../../', 'spark', T('about'), T('aboutSub')) + '</div></section>' +
      demoFoot() + '<p class="version">' + esc(T('version')) + '</p></div>';
  }
  SCREENS.profile = {
    level: 1, tab: 'profile',
    render: function () { return profileHtml(); },
    update: function (el, r) { if (el.__dirty) { el.__dirty = false; var sc = $('.scroll', el), t = sc.scrollTop; el.innerHTML = profileHtml(); $('.scroll', el).scrollTop = t; } }
  };

  /* ================= bottom sheets ================= */
  var SHEETS = {
    salon: function () {
      return '<h2 class="sheet-title" id="sheet-title">' + esc(T('appName')) + '</h2><div class="sheet-body"><div class="map-wrap">' + A.map() + '</div>' +
        '<ul class="info-list"><li>' + I('pin') + '<span>' + esc(T('address')) + '</span></li>' +
        '<li>' + I('clock') + '<table class="hours"><caption class="sr-only">' + esc(T('hours')) + '</caption><tr><td>' + esc(T('satThu')) + '</td><td>' + esc(T('satThuH')) + '</td></tr><tr><td>' + esc(T('fri')) + '</td><td>' + esc(T('friH')) + '</td></tr></table></li>' +
        '<li>' + I('spark') + '<span>' + esc(T('salonPerks')) + '</span></li></ul></div>' +
        '<div class="sheet-actions btn-row"><button class="btn btn-soft" type="button" data-act="demo">' + I('nav') + esc(T('directions')) + '</button><button class="btn btn-primary" type="button" data-act="demo">' + I('phone') + esc(T('call')) + '</button></div>';
    },
    cancel: function (sh) {
      var b = findB(sh.id); if (!b || bStatus(b) !== 'up') return null;
      var s = SV[b.service];
      return '<h2 class="sheet-title" id="sheet-title">' + esc(T('cancelTitle')) + '</h2><div class="sheet-body"><p class="sheet-text">' + esc(T('cancelBody')) + '</p>' +
        '<div class="sheet-card"><span class="thumb">' + A.serviceArt(s) + '</span><span><b>' + esc(L(s)) + '</b><small>' + esc(dlong(b.date)) + ' · ' + tfmt(b.time) + '</small></span></div></div>' +
        '<div class="sheet-actions"><button class="btn btn-danger btn-block" type="button" data-act="do-cancel" data-id="' + b.id + '">' + esc(T('cancelYes')) + '</button>' +
        '<button class="btn btn-ghost btn-block" type="button" data-act="sheet-close">' + esc(T('keep')) + '</button></div>';
    },
    reschedule: function (sh) {
      var b = findB(sh.id); if (!b || bStatus(b) !== 'up') return null;
      var s = SV[b.service], len = calc(b).dur, now = { date: b.date, m: b.time };
      var ds = next14().indexOf(b.date) >= 0 ? b.date : firstOpen(b.spec, len, b.id);
      sheet.date = ds; sheet.time = null;
      return '<h2 class="sheet-title" id="sheet-title">' + esc(T('reschedTitle')) + '</h2><div class="sheet-body">' +
        '<div class="sheet-card"><span class="thumb">' + A.serviceArt(s) + '</span><span><b>' + esc(L(s)) + '</b><small>' + esc(T('withSpec', { s: L(SP[b.spec]) })) + ' · ' + dur(len) + '</small>' +
        '<small class="cur-line">' + I('cal') + esc(T('currently', { w: dshort(b.date) + ' · ' + tfmt(b.time) })) + '</small></span></div>' +
        '<div class="dates" role="group" aria-label="' + esc(T('date')) + '">' + dateChips(ds, b.spec, len, b.id, now) + '</div><div class="slots-host">' + slotsHtml(ds, b.spec, len, null, b.id, now) + '</div></div>' +
        '<div class="sheet-actions"><button class="btn btn-primary btn-block" type="button" data-act="do-resched" data-id="' + b.id + '" disabled>' + esc(T('reschedConfirm')) + '</button></div>';
    },
    reset: function () {
      return '<h2 class="sheet-title" id="sheet-title">' + esc(T('resetTitle')) + '</h2><div class="sheet-body"><p class="sheet-text">' + esc(T('resetBody')) + '</p></div>' +
        '<div class="sheet-actions"><button class="btn btn-danger btn-block" type="button" data-act="do-reset">' + esc(T('resetYes')) + '</button><button class="btn btn-ghost btn-block" type="button" data-act="sheet-close">' + esc(T('cancel')) + '</button></div>';
    },
    details: function () {
      var u = S.user;
      return '<h2 class="sheet-title" id="sheet-title">' + esc(T('editDetails')) + '</h2><form class="sheet-body" id="det-form" novalidate>' +
        '<div class="field"><label for="d-name">' + esc(T('fullName')) + '</label><input class="input" id="d-name" autocomplete="name" maxlength="60" value="' + esc(u.name || T('defaultName')) + '" aria-describedby="de-name"><p class="err" id="de-name"></p></div>' +
        '<div class="field"><label for="d-phone">' + esc(T('mobile')) + '</label><div class="phone-wrap" dir="ltr"><span class="cc">' + kwFlag() + '+965</span><input id="d-phone" type="tel" inputmode="numeric" autocomplete="tel-national" maxlength="17" placeholder="5XXX XXXX" value="' + esc(phoneView(u.phone || '')) + '" aria-describedby="dh-phone de-phone"></div>' +
        '<p class="hint" id="dh-phone">' + esc(T('mobileHint')) + '</p><p class="err" id="de-phone"></p></div></form>' +
        '<div class="sheet-actions"><button class="btn btn-primary btn-block" type="submit" form="det-form">' + esc(T('save')) + '</button></div>';
    },
    install: function () {
      return '<h2 class="sheet-title" id="sheet-title">' + esc(T('installTitle')) + '</h2><div class="sheet-body"><p class="sheet-text">' + esc(T('installLead')) + '</p>' +
        '<ol class="steps-list">' + T('iosSteps').map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol><p class="fine" style="margin-top:14px">' + I('device') + esc(T('androidStep')) + '</p></div>' +
        '<div class="sheet-actions">' + (installEvt ? '<button class="btn btn-primary btn-block" type="button" data-act="do-install">' + I('install') + esc(T('installNow')) + '</button>' : '') +
        '<button class="btn btn-ghost btn-block" type="button" data-act="sheet-close">' + esc(T('gotIt')) + '</button></div>';
    }
  };
  function findB(id) { return S.bookings.filter(function (b) { return b.id === id; })[0]; }
  function syncSheet(r, dir) {
    var want = r.sheet;
    if (!want) { if (sheet) closeSheet(); return; }
    if (sheet && sheet.type === want.type && sheet.id === want.id) return;
    if (sheet) closeSheet(true);
    openSheet(want, dir === 'fwd');
  }
  function openSheet(want, pushed) {
    sheet = { type: want.type, id: want.id };
    var html = SHEETS[want.type](sheet);
    if (!html) { sheet = null; try { history.replaceState({ i: idx }, '', '#' + basePath(cur.r)); } catch (e) { /* ignore */ } cur.r = parse(location.hash); return; }
    sheetPushed = pushed;
    lastFocus = doc.activeElement;
    sheetLayer.innerHTML = '<div class="scrim" data-act="sheet-close"></div><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title"><div class="grabber" aria-hidden="true"></div>' +
      '<button class="icon-btn sheet-x" type="button" data-act="sheet-close" aria-label="' + esc(T('close')) + '">' + I('close') + '</button>' + html + '</div>';
    sheetLayer.hidden = false;
    if (cur) cur.el.inert = true; tabbar.inert = true;
    var sh = $('.sheet', sheetLayer);
    void sh.offsetWidth;
    sheetLayer.classList.add('open');
    mountSheet(want.type, sh);
    enhanceRows(sh);
    /* focus the sheet's heading (no ring on first render); Tab then moves through the sheet */
    var ttl = $('.sheet-title', sh); if (ttl) ttl.setAttribute('tabindex', '-1');
    setTimeout(function () { if (sheet && ttl) focusEl(ttl); }, RM.matches ? 0 : 380);
    dragSheet(sh);
  }
  function closeSheet(instant) {
    if (!sheet) return;
    sheet = null;
    sheetLayer.classList.remove('open');
    if (cur) cur.el.inert = false;
    tabbar.inert = !(cur && cur.def.tab);
    var fin = function () { if (!sheet) { sheetLayer.hidden = true; sheetLayer.innerHTML = ''; } };
    if (instant || RM.matches) fin(); else setTimeout(fin, 460);
    if (!instant && lastFocus && doc.body.contains(lastFocus)) { try { lastFocus.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
  }
  function dismissSheet() {
    if (!sheet) return;
    if (sheetPushed && idx > 0) { sheetPushed = false; history.back(); return; }
    try { history.replaceState({ i: idx }, '', '#' + basePath(cur.r)); } catch (e) { /* ignore */ }
    cur.r = parse(location.hash);
    closeSheet();
  }
  function mountSheet(type, sh) {
    if (type === 'reschedule') {
      var b = findB(sheet.id), len = calc(b).dur, btn = $('[data-act="do-resched"]', sh);
      scrollChipIntoView($('.dates', sh));
      sh.addEventListener('click', function (e) {
        var dc = e.target.closest('.date-chip'), sl = e.target.closest('.slot');
        if (dc) {
          sheet.date = dc.getAttribute('data-date'); sheet.time = null; btn.disabled = true;
          $$('.date-chip', sh).forEach(function (x) { x.setAttribute('aria-pressed', String(x === dc)); });
          $('.slots-host', sh).innerHTML = slotsHtml(sheet.date, b.spec, len, null, b.id, { date: b.date, m: b.time });
        } else if (sl && !sl.disabled) {
          sheet.time = +sl.getAttribute('data-m'); btn.disabled = false;
          $$('.slot', sh).forEach(function (x) { if (!x.classList.contains('is-current')) x.setAttribute('aria-pressed', String(x === sl)); });
        }
      });
    }
    if (type === 'details') {
      var f = $('#det-form', sh), n = $('#d-name', sh), p = $('#d-phone', sh);
      p.addEventListener('input', function () { p.value = phoneView(localPhone(p.value)); });
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var nv = n.value.trim(), pv = localPhone(p.value);
        var en = !nv ? T('errName') : (nv.replace(/\s/g, '').length < 2 ? T('errNameShort') : '');
        var ep = !pv ? T('errPhone') : (/^[4569]\d{7}$/.test(pv) ? '' : T('errPhoneBad'));
        $('#de-name', sh).innerHTML = en ? I('alert') + '<span>' + esc(en) + '</span>' : ''; n.setAttribute('aria-invalid', en ? 'true' : 'false');
        $('#de-phone', sh).innerHTML = ep ? I('alert') + '<span>' + esc(ep) + '</span>' : ''; p.setAttribute('aria-invalid', ep ? 'true' : 'false');
        $('.phone-wrap', sh).classList.toggle('invalid', !!ep);
        if (en || ep) { focusEl(en ? n : p); return; }
        S.user.name = storeName(nv); S.user.phone = pv; save();
        if (cur) cur.el.__dirty = true;
        dismissSheet(); toast(T('saved'), 'check');
        if (!sheetPushed) SCREENS.profile.update(cur.el, cur.r);
      });
    }
  }
  function dragSheet(sh) {
    var g = $('.grabber', sh), y0 = null, dy = 0, z = 1;
    g.addEventListener('pointerdown', function (e) {
      y0 = e.clientY; dy = 0; z = parseFloat(getComputedStyle($('#device')).zoom) || 1;
      sh.classList.add('dragging'); try { g.setPointerCapture(e.pointerId); } catch (er) { /* ignore */ }
    });
    g.addEventListener('pointermove', function (e) { if (y0 == null) return; dy = Math.max(0, (e.clientY - y0) / z); sh.style.transform = 'translateY(' + dy + 'px)'; });
    function end() { if (y0 == null) return; y0 = null; sh.classList.remove('dragging'); sh.style.transform = ''; if (dy > 90) dismissSheet(); }
    g.addEventListener('pointerup', end); g.addEventListener('pointercancel', end);
  }

  /* ================= horizontal rows: mouse wheel, drag and hover arrows ================= */
  /* Phones swipe these rows natively. With a mouse (the desktop phone frame) a vertical wheel scrolls the row
     sideways, a click-drag pans it, and small arrows appear on hover. */
  var ROWS = '.hscroll, .chips, .dates';
  function rowMax(el) { return el.scrollWidth - el.clientWidth; }
  function rowPos(el) { return Math.abs(el.scrollLeft); } /* RTL rows use negative scrollLeft */
  function rowCan(el, dir) { var mx = rowMax(el); if (mx < 2) return false; return dir > 0 ? rowPos(el) < mx - 1 : rowPos(el) > 1; }
  function rowIsRtl(el) { return getComputedStyle(el).direction === 'rtl'; }
  function rowStep(el) {
    if (el.classList.contains('hscroll')) {
      var c = el.firstElementChild, gap = parseFloat(getComputedStyle(el).columnGap) || 12;
      if (c) return Math.min(el.clientWidth * .9, c.getBoundingClientRect().width / Z() + gap);
    }
    return Math.max(120, el.clientWidth * .6);
  }
  function rowBy(el, dir) { el.scrollBy({ left: dir * rowStep(el) * (rowIsRtl(el) ? -1 : 1), behavior: RM.matches ? 'auto' : 'smooth' }); }
  function rowSync(el) {
    var w = el.parentNode; if (!w || !w.classList || !w.classList.contains('row-wrap')) return;
    w.classList.toggle('can-prev', rowCan(el, -1)); w.classList.toggle('can-next', rowCan(el, 1));
  }
  function enhanceRows(scope) {
    $$(ROWS, scope).forEach(function (el) {
      if (el.__rows) return; el.__rows = true;
      if (!el.parentNode.classList.contains('row-wrap')) {
        var w = doc.createElement('div'); w.className = 'row-wrap' + (el.classList.contains('chips') ? ' is-chips' : '') + (el.classList.contains('dates') ? ' is-dates' : '');
        el.parentNode.insertBefore(w, el); w.appendChild(el);
        w.insertAdjacentHTML('beforeend', '<button class="row-nav prev" type="button" tabindex="-1" aria-hidden="true" data-act="row" data-dir="-1">' + I('back', 'i-dir') + '</button>' +
          '<button class="row-nav next" type="button" tabindex="-1" aria-hidden="true" data-act="row" data-dir="1">' + I('chev', 'i-dir') + '</button>');
      }
      el.addEventListener('scroll', function () { rowSync(el); }, { passive: true });
      requestAnimationFrame(function () { rowSync(el); });
    });
  }
  var lastPageWheel = -1e9;
  doc.addEventListener('wheel', function (e) {
    if (e.ctrlKey) return;
    var el = e.target.closest ? e.target.closest(ROWS) : null;
    if (!el) { lastPageWheel = e.timeStamp; return; }
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;           /* sideways trackpad swipe: native */
    if (e.timeStamp - lastPageWheel < 280) { lastPageWheel = e.timeStamp; return; } /* mid page-scroll: don't hijack */
    var dir = e.deltaY > 0 ? 1 : -1;
    if (!rowCan(el, dir)) return;
    e.preventDefault();
    if (el.__wheelUntil && e.timeStamp < el.__wheelUntil) return;
    el.__wheelUntil = e.timeStamp + 300;
    rowBy(el, dir);
  }, { passive: false });
  var drag = null;
  doc.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    var el = e.target.closest ? e.target.closest(ROWS) : null;
    if (!el || rowMax(el) < 2) return;
    drag = { el: el, x: e.clientX, s: el.scrollLeft, z: Z(), moved: false, id: e.pointerId };
  });
  doc.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    var dx = (e.clientX - drag.x) / drag.z;
    if (!drag.moved) {
      if (Math.abs(dx) < 6) return;
      drag.moved = true; drag.el.classList.add('is-dragging');
      try { drag.el.setPointerCapture(e.pointerId); } catch (er) { /* ignore */ }
    }
    drag.el.scrollLeft = drag.s - dx;
  });
  function endDrag() {
    if (!drag) return;
    var d = drag; drag = null;
    if (!d.moved) return;
    /* a drag is not a tap: swallow the click that follows it */
    var kill = function (ev) { ev.preventDefault(); ev.stopPropagation(); doc.removeEventListener('click', kill, true); };
    doc.addEventListener('click', kill, true);
    setTimeout(function () { doc.removeEventListener('click', kill, true); }, 400);
    settleRow(d.el);
  }
  doc.addEventListener('pointerup', endDrag);
  doc.addEventListener('pointercancel', endDrag);
  doc.addEventListener('dragstart', function (e) { if (e.target.closest && e.target.closest(ROWS)) e.preventDefault(); });
  /* after a drag, glide to the nearest card so snapping rows don't jump */
  function settleRow(el) {
    if (el.classList.contains('chips')) { el.classList.remove('is-dragging'); return; }
    var rtl = rowIsRtl(el), z = Z(), r = el.getBoundingClientRect(), pad = parseFloat(getComputedStyle(el).scrollPaddingInlineStart) || 20, bd = null;
    Array.prototype.forEach.call(el.children, function (c) {
      var cr = c.getBoundingClientRect(), dd = rtl ? (r.right - pad * z) - cr.right : cr.left - (r.left + pad * z);
      if (bd === null || Math.abs(dd) < Math.abs(bd)) bd = dd;
    });
    if (bd) el.scrollBy({ left: (rtl ? -bd : bd) / z, behavior: RM.matches ? 'auto' : 'smooth' });
    setTimeout(function () { el.classList.remove('is-dragging'); }, RM.matches ? 0 : 450);
  }
  window.addEventListener('resize', function () { $$(ROWS).forEach(rowSync); });

  /* The app shell must never scroll itself (only each screen's list does). overflow:clip blocks it in modern
     browsers; this guard covers older ones, e.g. when a focused field asks the browser to scroll it into view. */
  doc.addEventListener('scroll', function (e) {
    var t = e.target;
    if (t && t.nodeType === 1 && /(^| )(app|views|screen|screen-glass)( |$)/.test(t.className) && (t.scrollTop || t.scrollLeft)) { t.scrollTop = 0; t.scrollLeft = 0; }
  }, true);

  function focusBookings(id) {
    if (!cur || cur.r.screen !== 'bookings') return;
    var n = (id && $('.bcard[data-id="' + id + '"] .btn', cur.el)) || $('.bcard.up .btn', cur.el) || $('h1', cur.el);
    if (n && n.tagName === 'H1') n.setAttribute('tabindex', '-1');
    focusEl(n);
  }

  /* ================= global actions ================= */
  doc.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#/"]');
    if (a && !e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      var path = a.getAttribute('href').slice(1);
      /* the desktop panel's quick links skip onboarding */
      if (a.hasAttribute('data-jump') && !S.onboarded) { S.onboarded = true; save(); }
      go(path, a.hasAttribute('data-replace') ? { replace: true, dir: 'fwd' } : {});
      return;
    }
    var t = e.target.closest('[data-act], [data-go]');
    if (!t) return;
    if (t.hasAttribute('data-go') && !t.disabled) { go(t.getAttribute('data-go')); return; }
    var act = t.getAttribute('data-act');
    switch (act) {
      case 'back': back(fallbackFor(cur.r)); break;
      case 'lang': setLang(lang === 'ar' ? 'en' : 'ar'); break;
      case 'set-lang': setLang(t.getAttribute('data-lang')); break;
      case 'notifs': toast(T('notifEmpty'), 'bell'); break;
      case 'sheet-close': dismissSheet(); break;
      case 'demo': toast(T('demoToast'), 'info'); break;
      case 'contact': toast(T('contactToast'), 'chat'); break;
      case 'cal': toast(T('calToast'), 'cal'); break;
      case 'done': done(t.getAttribute('data-to')); break;
      case 'row': {
        var rw = t.closest('.row-wrap'), row = rw && $(ROWS, rw);
        if (row) rowBy(row, +t.getAttribute('data-dir'));
        break;
      }
      case 'fav': {
        var id = cur.r.id, i = S.fav.indexOf(id), on = i < 0;
        if (on) S.fav.push(id); else S.fav.splice(i, 1);
        save();
        $$('.fav', cur.el).forEach(function (b) { b.setAttribute('aria-pressed', String(on)); });
        toast(T(on ? 'favOn' : 'favOff'), 'heart');
        break;
      }
      case 'switch': {
        var k = t.getAttribute('data-k'); S.notif[k] = !S.notif[k]; save();
        t.setAttribute('aria-checked', String(S.notif[k])); toast(T('nToast'), 'bell');
        break;
      }
      case 'do-cancel': {
        var b = findB(t.getAttribute('data-id'));
        if (b) { b.status = 'cancel'; save(); }
        var card = cur.el.querySelector('.bcard[data-id="' + (b && b.id) + '"]');
        if (card && !RM.matches) card.classList.add('leaving');
        cur.el.__dirty = true;
        var wasPushed = sheetPushed;
        if (wasPushed) afterRoute = function () { focusBookings(); };
        dismissSheet();
        if (!wasPushed) { SCREENS.bookings.update(cur.el, cur.r, cur.r); focusBookings(); }
        refreshBadge(); toast(T('cancelled'), 'check');
        break;
      }
      case 'do-resched': {
        var rb = findB(t.getAttribute('data-id'));
        if (rb && sheet && sheet.time != null) {
          rb.date = sheet.date; rb.time = sheet.time; save();
          cur.el.__dirty = true;
          var wp = sheetPushed, msg = T('rescheduled', { w: whenShort(rb.date, rb.time) });
          if (wp) afterRoute = function () { focusBookings(rb.id); };
          dismissSheet();
          if (!wp) { SCREENS.bookings.update(cur.el, cur.r, cur.r); focusBookings(rb.id); }
          refreshBadge(); toast(msg, 'cal');
        }
        break;
      }
      case 'do-reset': {
        var keep = lang;
        S = fresh(keep); save();
        closeSheet(true);
        renderTabs();
        go('/welcome', { replace: true, dir: 'force' });
        var wh = cur && $('h1', cur.el); if (wh) { wh.setAttribute('tabindex', '-1'); focusEl(wh); }
        toast(T('resetDone'), 'refresh');
        break;
      }
      case 'do-install': {
        if (installEvt) { installEvt.prompt(); installEvt = null; }
        dismissSheet();
        break;
      }
    }
  });
  doc.addEventListener('keydown', function (e) {
    if (!sheet) return;
    if (e.key === 'Escape') { e.preventDefault(); dismissSheet(); return; }
    if (e.key === 'Tab') {
      var f = $$('.sheet a[href], .sheet button:not([disabled]), .sheet input, .sheet textarea, .sheet [tabindex]:not([tabindex="-1"])', sheetLayer).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (f.indexOf(doc.activeElement) < 0) { e.preventDefault(); (e.shiftKey ? last : first).focus(); return; }
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ================= language ================= */
  function staticI18n() {
    doc.title = T('metaTitle');
    $$('[data-i18n]').forEach(function (n) { n.textContent = T(n.getAttribute('data-i18n')); });
    $$('[data-i18n-aria]').forEach(function (n) { n.setAttribute('aria-label', T(n.getAttribute('data-i18n-aria'))); });
    var lst = $('#intro-list'), icons = ['clock', 'globe', 'cal', 'install'];
    if (lst) lst.innerHTML = T('intro.b').map(function (x, i) { return '<li><span class="li-ic">' + I(icons[i]) + '</span><span>' + esc(x) + '</span></li>'; }).join('');
    var lg = $('#intro-logo');
    if (lg) lg.innerHTML = '<span class="mark-tile">' + A.mark('mark') + '</span><span class="wordmark">' + esc(T('brand')) + '<small>' + esc(T('brandSub')) + '</small></span>';
    /* the visible name of the other language is spoken in that language; the button label stays in the UI language */
    var jl = $('#intro-jumps'), J = T('intro.jumps');
    if (jl && J) {
      jl.innerHTML = '<a class="jump" href="#/service/gel" data-jump>' + I('spark') + '<span>' + esc(J[0]) + '</span></a>' +
        '<a class="jump" href="#/bookings" data-jump>' + I('cal') + '<span>' + esc(J[1]) + '</span></a>' +
        '<button class="jump" type="button" data-act="lang" aria-label="' + esc(T('switchLabel')) + '">' + I('globe') + '<span class="lang-name">' + esc(T('switchTo')) + '</span></button>';
    }
    $$('.lang-name').forEach(function (n) { n.setAttribute('lang', lang === 'ar' ? 'en' : 'ar'); });
  }
  function setLang(l) {
    if (l !== 'ar' && l !== 'en') return;
    if (l === lang) return;
    lang = l; S.lang = l; save();
    root.lang = l; root.dir = l === 'ar' ? 'rtl' : 'ltr';
    var fa = doc.activeElement, fromJump = !!(fa && fa.closest && fa.closest('#intro-jumps'));
    staticI18n(); renderTabs();
    if (fromJump) focusEl($('#intro-jumps [data-act="lang"]'));
    if (cur) {
      var r = cur.r, hadSheet = !!sheet;
      closeSheet(true);
      scrollMemo[cur.key] = ($('.scroll', cur.el) || {}).scrollTop || 0;
      var old = cur.el; cur = null; old.remove();
      render(r, 'lang');
      if (hadSheet) syncSheet(r, 'init');
      if (r.screen === 'profile') { var bt = $('[data-lang="' + l + '"]', views); if (bt) { try { bt.focus({ preventScroll: true }); } catch (e) { bt.focus(); } } }
    }
  }

  /* ================= PWA ================= */
  var installEvt = null;
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); installEvt = e; });
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    window.addEventListener('load', function () { try { navigator.serviceWorker.register('sw.js').catch(function () { /* optional */ }); } catch (e) { /* optional */ } });
  }

  /* ================= boot ================= */
  doc.body.insertAdjacentHTML('afterbegin', A.defs());
  staticI18n();
  try {
    idx = history.state && typeof history.state.i === 'number' ? history.state.i : 0;
    history.replaceState({ i: idx }, '', location.hash || '#/');
  } catch (e) { idx = 0; }
  /* a shared deep link (e.g. #/service/gel) opens that screen directly; onboarding is only for the front door */
  (function () { var r0 = parse(location.hash); if (r0.screen && r0.screen !== 'welcome' && !S.onboarded) { S.onboarded = true; save(); } })();
  renderTabs();
  route('init');
  window.addEventListener('pageshow', function () { if (window.__fitDevice) window.__fitDevice(); });
})();
