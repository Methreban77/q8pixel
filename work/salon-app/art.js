/* Laylak Beauty Lounge — hand-built SVG illustration kit (no external images). */
(function () {
  'use strict';
  var uid = 0;
  function nid(p) { uid += 1; return (p || 'a') + uid; }

  /* ---------- colour helpers ---------- */
  function hex2rgb(h) { h = h.replace('#', ''); return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]; }
  function rgb2hex(r) { return '#' + r.map(function (v) { v = Math.max(0, Math.min(255, Math.round(v))); return (v < 16 ? '0' : '') + v.toString(16); }).join(''); }
  function mix(a, b, t) { var x = hex2rgb(a), y = hex2rgb(b); return rgb2hex([x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t]); }
  function shade(c, t) { return t < 0 ? mix(c, '#2a0e25', -t) : mix(c, '#ffffff', t); }

  /* deterministic PRNG */
  function rng(seed) { var s = seed >>> 0; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

  /* ---------- primitives ---------- */
  var PETAL = 'M0 0C-.6-.28-.74-.84-.32-1C-.16-1.06-.05-1 0-.9C.05-1 .16-1.06.32-1C.74-.84.6-.28 0 0Z';
  function floret(cx, cy, r, fill, rot, center, op) {
    var s = '<g transform="translate(' + cx + ' ' + cy + ') rotate(' + (rot || 0) + ') scale(' + r + ')"' + (op ? ' opacity="' + op + '"' : '') + '>';
    for (var i = 0; i < 4; i++) s += '<path d="' + PETAL + '" transform="rotate(' + (i * 90) + ')" fill="' + fill + '"/>';
    if (center) s += '<circle r=".17" fill="' + center + '"/>';
    return s + '</g>';
  }
  function spk(x, y, r, c, o) {
    return '<path d="M' + x + ' ' + (y - r) + 'Q' + x + ' ' + y + ' ' + (x + r) + ' ' + y + 'Q' + x + ' ' + y + ' ' + x + ' ' + (y + r) +
      'Q' + x + ' ' + y + ' ' + (x - r) + ' ' + y + 'Q' + x + ' ' + y + ' ' + x + ' ' + (y - r) + 'Z" fill="' + c + '" opacity="' + (o == null ? 1 : o) + '"/>';
  }
  function pearl(x, y, r) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="url(#lk-pearl)"/>'; }
  function sh(B, cx, rx) { return '<ellipse cx="' + cx + '" cy="129.5" rx="' + rx + '" ry="4.2" fill="' + B.shadow + '" opacity=".17"/>'; }

  /* ---------- global gradient defs (referenced by every illustration) ---------- */
  function lg(id, stops, v) {
    var s = '<linearGradient id="' + id + '" x1="0" y1="0" x2="' + (v ? 0 : 1) + '" y2="' + (v ? 1 : 0) + '">';
    stops.forEach(function (st) { s += '<stop offset="' + st[0] + '" stop-color="' + st[1] + '"' + (st[2] != null ? ' stop-opacity="' + st[2] + '"' : '') + '/>'; });
    return s + '</linearGradient>';
  }
  var BG = {
    blush: { g: ['#FCEAE5', '#F3CDC5'], arch: '#FFF7F4', archO: .85, floor: '#C77E74', floorO: .13, glow: '#FFFFFF', spark: '#FFFFFF', line: '#D99C86', shadow: '#7A2E3E' },
    lilac: { g: ['#F4EEFA', '#DCCBEE'], arch: '#FDFAFF', archO: .85, floor: '#7E5FA3', floorO: .11, glow: '#FFFFFF', spark: '#FFFFFF', line: '#A88BC9', shadow: '#4B2D6B' },
    peach: { g: ['#FEF2E8', '#F6D3BD'], arch: '#FFFAF5', archO: .9, floor: '#C88A62', floorO: .13, glow: '#FFFFFF', spark: '#FFFFFF', line: '#D9A07E', shadow: '#7A4A2E' },
    plum:  { g: ['#6E2D62', '#2F0F2A'], arch: '#84427A', archO: .5, floor: '#000000', floorO: .22, glow: '#B35C93', spark: '#F6D3C2', line: '#E9B8A6', shadow: '#000000' },
    sage:  { g: ['#F1F6ED', '#D2E0CB'], arch: '#FBFDF9', archO: .9, floor: '#6F8F6A', floorO: .13, glow: '#FFFFFF', spark: '#FFFFFF', line: '#8FAE8C', shadow: '#2F4A33' },
    cream: { g: ['#FDF8F2', '#F0E2D4'], arch: '#FFFFFF', archO: .85, floor: '#A88466', floorO: .13, glow: '#FFFFFF', spark: '#FFFFFF', line: '#C9A487', shadow: '#5A3B26' }
  };
  function defs() {
    var d = '';
    d += lg('lk-rg', [[0, '#F8DACB'], [.45, '#DDA08A'], [.72, '#B9705E'], [1, '#EFBDA8']]);
    d += '<linearGradient id="lk-rgd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F8DACB"/><stop offset=".5" stop-color="#D99A84"/><stop offset="1" stop-color="#B46A58"/></linearGradient>';
    d += lg('lk-rgv', [[0, '#A9614F'], [.32, '#F4CDBB'], [.6, '#D6977F'], [1, '#9E5747']]);
    d += '<linearGradient id="lk-plum" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8A4280"/><stop offset="1" stop-color="#3E1638"/></linearGradient>';
    d += lg('lk-plumh', [[0, '#3E1638'], [.38, '#8B467F'], [.68, '#5E2556'], [1, '#33112D']]);
    d += lg('lk-red', [[0, '#9A2C47'], [.34, '#DE6E83'], [.66, '#C04760'], [1, '#86223E']]);
    d += lg('lk-pink', [[0, '#DD929A'], [.34, '#FADADA'], [.66, '#EDB2B4'], [1, '#D2858D']]);
    d += lg('lk-nude', [[0, '#CF967F'], [.34, '#F4D3C1'], [.66, '#E3B39D'], [1, '#C4856E']]);
    d += lg('lk-lilac', [[0, '#9677BA'], [.34, '#E1D2F1'], [.66, '#BFA5DD'], [1, '#8C6BAE']]);
    d += lg('lk-amber', [[0, '#9C4C1A'], [.34, '#EDAE6A'], [.66, '#CF8443'], [1, '#8A4216']]);
    d += lg('lk-gold', [[0, '#A9762F'], [.34, '#F5DCA6'], [.64, '#D9AE6C'], [1, '#9A6A28']]);
    d += lg('lk-frost', [[0, '#E2AEB3'], [.36, '#FCE6E5'], [.68, '#F0C6C8'], [1, '#D89CA2']]);
    d += lg('lk-cream', [[0, '#E3D1BE'], [.36, '#FFF9F2'], [.68, '#F3E6D7'], [1, '#DCC7B1']]);
    d += lg('lk-stone', [[0, '#6A5862'], [1, '#2C2027']], true);
    d += lg('lk-water', [[0, '#FCEDEA'], [1, '#F1C8C8']], true);
    d += lg('lk-soap', [[0, '#76603C'], [.45, '#46351F'], [1, '#231910']], true);
    d += lg('lk-kessa', [[0, '#5E5259'], [.5, '#463B42'], [1, '#2F272C']]);
    d += lg('lk-shell', [[0, '#FFFDFB'], [.6, '#F6EBE4'], [1, '#E7D3C8']], true);
    d += '<radialGradient id="lk-uv" cx=".5" cy=".95" r=".95"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".35" stop-color="#EEE3FF"/><stop offset=".75" stop-color="#C4ABEB"/><stop offset="1" stop-color="#9C7BCF"/></radialGradient>';
    d += '<linearGradient id="lk-leaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B9D0B0"/><stop offset="1" stop-color="#5F8A62"/></linearGradient>';
    d += '<linearGradient id="lk-hair" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9A6A48"/><stop offset="1" stop-color="#3E2216"/></linearGradient>';
    d += '<radialGradient id="lk-pearl" cx=".34" cy=".3" r=".78"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".45" stop-color="#FAF1EC"/><stop offset=".82" stop-color="#E4CDCD"/><stop offset="1" stop-color="#CBAFB4"/></radialGradient>';
    d += '<radialGradient id="lk-flame" cx=".5" cy=".7" r=".6"><stop offset="0" stop-color="#FFF6D8"/><stop offset=".6" stop-color="#F7C76A"/><stop offset="1" stop-color="#E58A3C"/></radialGradient>';
    Object.keys(BG).forEach(function (k) { d += lg('lk-bg-' + k, [[0, BG[k].g[0]], [1, BG[k].g[1]]], true); });
    return '<svg width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true" focusable="false"><defs>' + d + '</defs></svg>';
  }

  /* ---------- still-life motifs on a 200x160 stage, floor at y=129 ---------- */
  var M = {};
  M.polish = function (B, o) {
    var tone = (o && o.tone) || 'red';
    var body = { red: 'lk-red', pink: 'lk-pink', nude: 'lk-nude', lilac: 'lk-lilac', plum: 'lk-plumh' }[tone];
    var solid = { red: '#C9506A', pink: '#E9A3AA', nude: '#DDAA94', lilac: '#B49AD6', plum: '#6E2D63' }[tone];
    var back = tone === 'nude' ? 'lk-pink' : 'lk-nude';
    if (o && o.variant === 'gel') {
      /* gel manicure: glossy gel bottle beside an LED curing lamp with a freshly painted almond nail inside */
      var leds = '';
      for (var k = -3; k <= 3; k++) {
        var a = k * 0.36;
        leds += '<circle cx="' + (150 + 25 * Math.sin(a)).toFixed(1) + '" cy="' + (112 - 20.5 * Math.cos(a)).toFixed(1) + '" r="1.5" fill="#fff"/>';
      }
      return sh(B, 92, 44) +
        '<ellipse cx="150" cy="129" rx="42" ry="3.6" fill="' + B.shadow + '" opacity=".15"/>' +
        '<path d="M108 129V108C108 85 127 70 150 70S192 85 192 108V129Z" fill="url(#lk-shell)"/>' +
        '<path d="M113 104C116 86 131 75 150 75" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".9"/>' +
        '<path d="M118 129V112C118 96 132 86 150 86S182 96 182 112V129Z" fill="url(#lk-uv)"/>' + leds +
        '<ellipse cx="150" cy="127.4" rx="26" ry="3" fill="#fff" opacity=".75"/>' +
        '<g transform="rotate(-6 150 120)"><path d="M141.5 127.5c0-9.5 3.8-17 8.5-17s8.5 7.5 8.5 17z" fill="url(#lk-red)"/>' +
        '<path d="M145.2 124c.2-6 1.8-9.6 4.2-10.6" stroke="#fff" stroke-opacity=".85" stroke-width="1.8" fill="none" stroke-linecap="round"/></g>' +
        '<rect x="136" y="76.5" width="28" height="7.5" rx="3.75" fill="url(#lk-plumh)"/>' +
        '<rect x="140.5" y="79.3" width="11" height="1.9" rx=".95" fill="#F6D3C2"/><circle cx="158.5" cy="80.25" r="1.5" fill="#8FD8A3"/>' +
        '<rect x="46" y="80" width="46" height="49" rx="13" fill="url(#' + body + ')"/>' +
        '<path d="M52 98c0-9 4-13 10-13" stroke="#fff" stroke-opacity=".7" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="80" cy="91" rx="5" ry="2.6" fill="#fff" opacity=".35"/>' +
        '<rect x="56" y="102" width="26" height="15" rx="4" fill="#FFF6F2" opacity=".92"/>' + floret(69, 109.5, 4.6, solid, 45, '#fff') +
        '<rect x="60" y="72" width="18" height="10" rx="2" fill="#E8C3B5"/>' +
        '<rect x="58" y="34" width="22" height="40" rx="6" fill="url(#lk-rgv)"/>' +
        '<rect x="62" y="38" width="3.4" height="32" rx="1.7" fill="#fff" opacity=".55"/>' +
        spk(176, 50, 7, B.spark, .95) + spk(100, 52, 4.5, B.spark, .9) + spk(126, 64, 3.5, '#fff', .85) + pearl(32, 124, 4);
    }
    return sh(B, 108, 50) +
      '<rect x="128" y="97" width="30" height="32" rx="9" fill="url(#' + back + ')"/>' +
      '<rect x="133" y="101" width="4" height="22" rx="2" fill="#fff" opacity=".5"/>' +
      '<rect x="136" y="90" width="14" height="8" rx="2" fill="#E8C3B5"/>' +
      '<rect x="135" y="64" width="16" height="28" rx="4" fill="url(#lk-plumh)"/>' +
      '<rect x="138" y="67" width="2.6" height="22" rx="1.3" fill="#fff" opacity=".35"/>' +
      '<rect x="74" y="80" width="46" height="49" rx="12" fill="url(#' + body + ')"/>' +
      '<rect x="80" y="86" width="6" height="35" rx="3" fill="#fff" opacity=".45"/>' +
      '<rect x="98" y="88" width="14" height="3" rx="1.5" fill="#fff" opacity=".2"/>' +
      '<rect x="88" y="72" width="18" height="10" rx="2" fill="#E8C3B5"/>' +
      '<rect x="86" y="30" width="22" height="44" rx="6" fill="url(#lk-rgv)"/>' +
      '<rect x="90" y="34" width="3.4" height="36" rx="1.7" fill="#fff" opacity=".55"/>' +
      '<ellipse cx="54" cy="127.6" rx="14" ry="3.1" fill="' + solid + '"/>' +
      '<circle cx="63" cy="118" r="2.7" fill="' + solid + '"/><circle cx="58" cy="111" r="1.5" fill="' + solid + '" opacity=".8"/>' +
      spk(152, 42, 7, B.spark, .95) + spk(60, 58, 4, B.spark, .85) + pearl(38, 121, 4.2);
  };
  M.lipstick = function (B) {
    return sh(B, 108, 62) +
      '<rect x="48" y="88" width="24" height="41" rx="3" fill="url(#lk-plumh)"/>' +
      '<rect x="48" y="88" width="24" height="6" rx="2" fill="url(#lk-rgv)"/>' +
      '<rect x="52" y="98" width="2.8" height="27" rx="1.4" fill="#fff" opacity=".28"/>' +
      '<rect x="84" y="92" width="30" height="37" rx="3" fill="url(#lk-plumh)"/>' +
      '<rect x="88" y="96" width="2.8" height="29" rx="1.4" fill="#fff" opacity=".28"/>' +
      '<rect x="86" y="77" width="26" height="16" rx="2" fill="url(#lk-rgv)"/>' +
      '<path d="M90 77V54c0-7 4-11 10-14l9-4.5V77z" fill="url(#lk-red)"/>' +
      '<path d="M93.6 74V55.6c0-4.6 2-7.6 5.6-9.6" stroke="#fff" stroke-opacity=".5" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
      '<path d="M122 117v6a25 7.5 0 0 0 50 0v-6z" fill="#A9604F"/>' +
      '<ellipse cx="147" cy="117" rx="25" ry="7.5" fill="url(#lk-rgd)"/>' +
      '<g transform="translate(147 116.6) scale(1 .32)" opacity=".75">' + floret(0, 0, 10, '#FFF4EE', 45) + '</g>' +
      spk(152, 50, 7, B.spark, .95) + spk(68, 62, 4.5, B.spark, .85) + pearl(176, 126, 3.4);
  };
  M.dryer = function (B) {
    return sh(B, 100, 48) +
      '<g transform="rotate(-6 100 90)">' +
      '<g transform="rotate(10 99 84)"><rect x="88" y="80" width="22" height="49" rx="10" fill="url(#lk-plumh)"/>' +
      '<rect x="95" y="94" width="8" height="13" rx="3.5" fill="#F6D3C2"/></g>' +
      '<rect x="54" y="51" width="86" height="35" rx="17.5" fill="url(#lk-rgd)"/>' +
      '<path d="M136 55.5l22 4.5q3.2 9 0 18L136 82.5z" fill="#B06A58"/>' +
      '<rect x="82" y="56" width="48" height="5" rx="2.5" fill="#fff" opacity=".55"/>' +
      '<circle cx="62" cy="68.5" r="21" fill="#F8DED5"/>' +
      '<circle cx="62" cy="68.5" r="21" fill="none" stroke="#C98A73" stroke-width="2.6"/>' +
      '<circle cx="62" cy="68.5" r="13.5" fill="none" stroke="#DDA896" stroke-width="2"/>' +
      '<circle cx="62" cy="68.5" r="6" fill="url(#lk-rgd)"/>' +
      '</g>' +
      '<g stroke="' + B.line + '" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".9">' +
      '<path d="M164 56q6-3 12 0t12 0"/><path d="M167 69q5-3 10 0t10 0"/><path d="M164 82q6-3 12 0t12 0"/></g>' +
      spk(44, 38, 5, B.spark, .95) + spk(150, 118, 4, B.spark, .9);
  };
  M.scissors = function (B) {
    var teeth = '';
    for (var i = 0; i < 22; i++) teeth += '<rect x="' + (61 + i * 4) + '" y="119" width="2.2" height="10" rx="1" fill="#5E2556"/>';
    return sh(B, 104, 56) +
      '<g transform="rotate(-26 104 74)">' +
      '<circle cx="62" cy="62" r="11" fill="none" stroke="url(#lk-rgv)" stroke-width="6"/>' +
      '<circle cx="62" cy="88" r="11" fill="none" stroke="url(#lk-rgv)" stroke-width="6"/>' +
      '<path d="M71.5 67.5L104 75M71.5 82.5L104 75" stroke="#C98A73" stroke-width="6" stroke-linecap="round"/>' +
      '<path d="M100 72Q132 77 164 92Q131 85 100 79Z" fill="url(#lk-rgd)"/>' +
      '<path d="M100 78Q132 73 164 58Q131 67 100 71Z" fill="url(#lk-rg)"/>' +
      '<circle cx="104" cy="75" r="3.6" fill="#5E2556"/></g>' +
      '<rect x="57" y="111" width="94" height="9" rx="3.5" fill="url(#lk-plum)"/>' + teeth +
      '<rect x="62" y="113" width="40" height="2" rx="1" fill="#fff" opacity=".3"/>' +
      spk(150, 36, 6, B.spark, .95) + spk(48, 44, 4, B.spark, .85);
  };
  M.swatch = function (B) {
    var cols = ['#EAD3AB', '#C99A6B', '#A0623F', '#6B3F2E', '#3B2018'], ang = [-42, -21, 0, 21, 42], s = '';
    for (var i = 0; i < 5; i++) {
      s += '<g transform="rotate(' + ang[i] + ' 100 124)"><path d="M96.6 124C92.6 98 91.6 68 100 34C108.4 68 107.4 98 103.4 124Z" fill="' + cols[i] + '"/>' +
        '<path d="M100 116C98.6 94 98.6 70 100 44" stroke="#fff" stroke-opacity=".28" stroke-width="1.4" fill="none"/></g>';
    }
    return sh(B, 104, 54) + s +
      '<circle cx="100" cy="122" r="6.5" fill="url(#lk-rgd)"/><circle cx="100" cy="122" r="2.2" fill="#7A3B33"/>' +
      '<path d="M152 104L178 72" stroke="url(#lk-rgv)" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M134 107h40c0 14-9 22-20 22s-20-8-20-22z" fill="url(#lk-plum)"/>' +
      '<ellipse cx="154" cy="107" rx="20" ry="4.2" fill="#7C3570"/><ellipse cx="154" cy="107.4" rx="16" ry="2.8" fill="#8E5A3F"/>' +
      spk(48, 48, 5, B.spark, .95) + spk(158, 40, 6, B.spark, .95);
  };
  M.wave = function (B) {
    var shades = ['#3E2216', '#5C3524', '#7E4E34', '#A06A47', '#C48B62'], s = '';
    for (var i = 0; i < 5; i++) {
      s += '<path d="M' + (66 + i * 6) + ' 30C' + (122 + i * 5) + ' 44 ' + (58 + i * 6) + ' 84 ' + (106 + i * 5) + ' 100S' + (146 + i * 3) + ' 122 ' + (124 + i * 5) + ' 129" stroke="' + shades[i] + '" stroke-width="8.5" fill="none" stroke-linecap="round"/>';
    }
    return sh(B, 112, 46) + s +
      '<path d="M84 36C124 50 76 82 112 96" stroke="#F3D3B3" stroke-opacity=".7" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '<path d="M124 108C138 114 142 120 136 126" stroke="#F3D3B3" stroke-opacity=".6" stroke-width="1.6" fill="none" stroke-linecap="round"/>' +
      '<rect x="46" y="100" width="20" height="29" rx="6" fill="url(#lk-frost)"/>' +
      '<rect x="50" y="104" width="3" height="20" rx="1.5" fill="#fff" opacity=".55"/>' +
      '<rect x="49" y="91" width="14" height="10" rx="2.5" fill="url(#lk-rgv)"/>' +
      spk(150, 46, 7, B.spark, 1) + spk(140, 64, 4, B.spark, .9) + spk(70, 62, 4, B.spark, .9);
  };
  M.oil = function (B) {
    return sh(B, 104, 48) +
      '<path d="M62 129C48 110 50 86 66 72C70 92 70 112 62 129Z" fill="url(#lk-leaf)"/>' +
      '<path d="M64 129C60 112 61 96 66 76" stroke="#E8F0E2" stroke-width="1.2" fill="none" opacity=".7"/>' +
      '<path d="M66 129C70 108 84 94 104 88C96 106 84 120 66 129Z" fill="url(#lk-leaf)" opacity=".85"/>' +
      '<rect x="80" y="76" width="42" height="53" rx="11" fill="url(#lk-amber)"/>' +
      '<rect x="86" y="83" width="5" height="38" rx="2.5" fill="#fff" opacity=".4"/>' +
      '<rect x="89" y="96" width="25" height="21" rx="3" fill="#FFF6EC"/>' +
      floret(101.5, 106.5, 6.2, '#B9705E', 45, '#FFF6EC') +
      '<rect x="89" y="65" width="24" height="12" rx="2" fill="url(#lk-rgv)"/>' +
      '<path d="M93 65V47a8 8 0 0 1 16 0v18z" fill="url(#lk-plumh)"/>' +
      '<path d="M146 84c0 0-7 9-7 13.5a7 7 0 0 0 14 0C153 93 146 84 146 84z" fill="url(#lk-amber)"/>' +
      '<path d="M143.6 96.5a3 3 0 0 0 2.2 3" stroke="#fff" stroke-opacity=".6" stroke-width="1.4" fill="none" stroke-linecap="round"/>' +
      spk(150, 44, 6, B.spark, .95) + spk(132, 120, 3.5, B.spark, .9);
  };
  M.basin = function (B) {
    var pet = function (x, y, r, c) { return '<path d="M0 0c4-5.5 11.5-4.5 12.5 1c-3 4.5-9.5 5-12.5-1z" fill="' + c + '" transform="translate(' + x + ' ' + y + ') rotate(' + r + ')"/>'; };
    return sh(B, 100, 62) +
      '<rect x="116" y="70" width="44" height="25" rx="12.5" fill="#FFF8F2"/>' +
      '<rect x="142" y="70" width="5" height="25" fill="#EDB9B3"/>' +
      '<circle cx="128.5" cy="82.5" r="12.5" fill="#F3E3D7"/><circle cx="128.5" cy="82.5" r="7.5" fill="none" stroke="#E2CBBB" stroke-width="1.6"/><circle cx="128.5" cy="82.5" r="2.6" fill="#E2CBBB"/>' +
      '<path d="M42 101h116c-2 19-25 29-58 29s-56-10-58-29z" fill="url(#lk-rgv)"/>' +
      '<ellipse cx="100" cy="101" rx="58" ry="11.5" fill="#C98A73"/>' +
      '<ellipse cx="100" cy="101.6" rx="53" ry="8.8" fill="url(#lk-water)"/>' +
      '<ellipse cx="94" cy="102.4" rx="17" ry="3" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="1.2"/>' +
      '<ellipse cx="94" cy="102.4" rx="30" ry="5.4" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="1"/>' +
      pet(70, 99, -20, '#D9667B') + pet(112, 97, 25, '#E99AA5') + pet(128, 103, -60, '#C9506A') + pet(84, 104, 40, '#F1B9C0') +
      spk(54, 64, 5, B.spark, .95) + spk(168, 54, 4, B.spark, .9) + pearl(36, 124, 3.6);
  };
  M.gems = function (B) {
    function bottle(x, w, h, body, capH) {
      var top = 129 - h;
      return '<rect x="' + x + '" y="' + top + '" width="' + w + '" height="' + h + '" rx="' + (w * .26) + '" fill="url(#' + body + ')"/>' +
        '<rect x="' + (x + 4) + '" y="' + (top + 4) + '" width="3.4" height="' + (h - 10) + '" rx="1.7" fill="#fff" opacity=".45"/>' +
        '<rect x="' + (x + w / 2 - 6) + '" y="' + (top - 7) + '" width="12" height="8" rx="2" fill="#E8C3B5"/>' +
        '<rect x="' + (x + w / 2 - 7.5) + '" y="' + (top - 7 - capH) + '" width="15" height="' + (capH + 1) + '" rx="4" fill="url(#lk-rgv)"/>';
    }
    function gem(x, y, s, c) { return '<path d="M' + x + ' ' + y + 'l' + (5 * s) + ' ' + (-6 * s) + 'l' + (5 * s) + ' ' + (6 * s) + 'l' + (-5 * s) + ' ' + (8 * s) + 'z" fill="' + c + '"/><path d="M' + x + ' ' + y + 'h' + (10 * s) + '" stroke="#fff" stroke-opacity=".7" stroke-width=".8"/>'; }
    return sh(B, 100, 60) +
      bottle(56, 28, 36, 'lk-lilac', 22) + bottle(86, 32, 46, 'lk-red', 28) + bottle(122, 26, 32, 'lk-nude', 20) +
      gem(150, 124, 1, '#F6D3C2') + gem(44, 126, .8, '#E1D2F1') + gem(160, 112, .6, '#FFFFFF') +
      '<circle cx="62" cy="64" r="2.4" fill="#F6D3C2"/><circle cx="146" cy="70" r="2" fill="#E1D2F1"/>' +
      spk(150, 40, 7, B.spark, 1) + spk(56, 44, 5, B.spark, .9) + spk(104, 30, 3.5, '#fff', .9);
  };
  M.palette = function (B) {
    return sh(B, 100, 56) +
      '<rect x="56" y="34" width="88" height="60" rx="14" fill="url(#lk-rgd)"/>' +
      '<rect x="62" y="40" width="76" height="48" rx="10" fill="#FDF3F1"/>' +
      '<path d="M70 84L98 44h11L81 84z" fill="#fff" opacity=".85"/><path d="M86 84l28-40h5L91 84z" fill="#fff" opacity=".6"/>' +
      '<rect x="92" y="92" width="16" height="6" rx="2" fill="#A9604F"/>' +
      '<rect x="54" y="96" width="92" height="33" rx="11" fill="url(#lk-rgd)"/>' +
      '<rect x="60" y="101" width="80" height="23" rx="7" fill="#F2D5C8"/>' +
      '<circle cx="77" cy="112.5" r="8.5" fill="#F3B39E"/><circle cx="100" cy="112.5" r="8.5" fill="#E58C97"/><circle cx="123" cy="112.5" r="8.5" fill="#C98663"/>' +
      '<path d="M72 109a5 5 0 0 1 5-3M95 109a5 5 0 0 1 5-3M118 109a5 5 0 0 1 5-3" stroke="#fff" stroke-opacity=".6" stroke-width="1.5" fill="none" stroke-linecap="round"/>' +
      '<g transform="rotate(-48 160 112)"><rect x="128" y="108.5" width="40" height="7" rx="3.5" fill="url(#lk-plumh)"/><rect x="166" y="107.5" width="10" height="9" rx="1.5" fill="url(#lk-rgv)"/>' +
      '<path d="M176 106c10-2.5 19 1.5 19 6s-9 8.5-19 6z" fill="#EBCDB9"/></g>' +
      spk(158, 38, 6, B.spark, .95) + spk(44, 70, 4, B.spark, .9);
  };
  M.pearls = function (B) {
    var s = '<path d="M56 44Q100 152 144 44" stroke="#CDB0A8" stroke-width="1.2" fill="none"/>';
    for (var i = 0; i <= 16; i++) {
      var t = i / 16, x = (1 - t) * (1 - t) * 56 + 2 * (1 - t) * t * 100 + t * t * 144, y = (1 - t) * (1 - t) * 44 + 2 * (1 - t) * t * 152 + t * t * 44;
      var r = 4.2 + 2.2 * Math.sin(Math.PI * t);
      s += pearl(x.toFixed(1), y.toFixed(1), r.toFixed(1));
    }
    var jas = '';
    for (var k = 0; k < 5; k++) jas += '<ellipse cx="0" cy="-8" rx="5" ry="8.5" fill="#FFFDFB" stroke="#EADBD3" stroke-width=".8" transform="rotate(' + (k * 72) + ')"/>';
    return sh(B, 100, 46) + s +
      '<path d="M100 103c-6 8-8.5 12.5-8.5 16.5a8.5 8.5 0 0 0 17 0c0-4-2.5-8.5-8.5-16.5z" fill="url(#lk-pearl)"/>' +
      '<rect x="97.5" y="98" width="5" height="6" rx="1.5" fill="url(#lk-gold)"/>' +
      '<g transform="translate(152 40) rotate(12)">' + jas + '<circle r="3.2" fill="#E9D58C"/></g>' +
      '<g transform="translate(164 64) rotate(-20) scale(.55)">' + jas + '<circle r="3.2" fill="#E9D58C"/></g>' +
      '<path d="M140 52c6 4 14 6 22 4" stroke="url(#lk-leaf)" stroke-width="2" fill="none"/>' +
      '<ellipse cx="52" cy="124" rx="10" ry="4.5" fill="none" stroke="url(#lk-gold)" stroke-width="2.6"/>' +
      '<path d="M48 118l4-5 4 5-4 3z" fill="#fff" stroke="#E1D2F1" stroke-width=".8"/>' +
      spk(46, 40, 6, B.spark, 1) + spk(128, 120, 4, B.spark, .9);
  };
  /* Moroccan bath: horseshoe arch with a khatam star, steaming brass tasa of rose water, black soap and a kessa glove */
  M.bowl = function (B) {
    var cid = nid('kc'), hatch = '';
    for (var k = -8; k < 12; k++) hatch += '<path d="M' + (k * 3.4) + ' 2l14 -34" stroke="#7A6C74" stroke-width=".8" opacity=".75"/>';
    var pet = function (x, y, r, c) { return '<path d="M0 0c3-4 8.5-3.4 9.4.8c-2.3 3.4-7.1 3.8-9.4-.8z" fill="' + c + '" transform="translate(' + x + ' ' + y + ') rotate(' + r + ')"/>'; };
    return sh(B, 104, 66) +
      '<path d="M71 129V90A31 31 0 1 1 129 90V129" fill="#fff" fill-opacity=".38" stroke="#D9A07E" stroke-width="1.8"/>' +
      '<path d="M77 129V91A25.5 25.5 0 1 1 123 91V129" fill="none" stroke="#D9A07E" stroke-opacity=".5" stroke-width="1"/>' +
      '<g transform="translate(100 63)" fill="#FFF8F2" stroke="url(#lk-gold)" stroke-width="1.5"><rect x="-6.5" y="-6.5" width="13" height="13"/><rect x="-6.5" y="-6.5" width="13" height="13" transform="rotate(45)"/></g>' +
      '<circle cx="100" cy="63" r="2.4" fill="#D9AE6C"/>' +
      '<g stroke="#D3AE98" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".75"><path d="M64 97c-4-5 4-9 0-14s4-9 0-14"/><path d="M77 95c-4-6 4-10 0-16s4-10 0-16"/><path d="M89 98c-3.4-4.6 3.4-8 0-12.6"/></g>' +
      '<rect x="124" y="96" width="52" height="14" rx="5" fill="#FFF8F2"/><rect x="124" y="102" width="52" height="3" fill="#EDB9B3"/>' +
      '<rect x="128" y="110" width="48" height="19" rx="5" fill="#F4D7CF"/><rect x="128" y="117" width="48" height="3" fill="#FFF8F2" opacity=".8"/>' +
      '<path d="M38 106h76c-1.6 14-17 23-38 23s-36.4-9-38-23z" fill="url(#lk-gold)"/>' +
      '<path d="M45 115h62" stroke="#9E6F2C" stroke-width="1.2" stroke-dasharray="2.5 3.5" opacity=".7"/>' +
      '<path d="M53 122h46" stroke="#9E6F2C" stroke-width="1" stroke-dasharray="1.5 4" opacity=".6"/>' +
      '<ellipse cx="76" cy="106" rx="38" ry="6.6" fill="#C9984F"/>' +
      '<ellipse cx="76" cy="106.6" rx="34" ry="4.8" fill="url(#lk-water)"/>' +
      '<ellipse cx="70" cy="107" rx="12" ry="1.9" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="1"/>' +
      pet(82, 105.6, -14, '#D9667B') + pet(56, 106.4, 20, '#F1B9C0') +
      '<path d="M101 124h34c-1 3.8-7.4 5.4-17 5.4s-16-1.6-17-5.4z" fill="#E9D7CB"/>' +
      '<ellipse cx="118" cy="124" rx="17" ry="3.3" fill="#FFF8F2"/><ellipse cx="118" cy="124" rx="17" ry="3.3" fill="none" stroke="#6E2D63" stroke-opacity=".55" stroke-width="1"/>' +
      '<path d="M107 124.4c1-6.4 5.4-9.6 11-9.6s10 3.2 11 9.6z" fill="url(#lk-soap)"/>' +
      '<path d="M111.4 120.6c1.4-2.6 4-4.2 7-4.4" stroke="#fff" stroke-opacity=".6" stroke-width="1.4" fill="none" stroke-linecap="round"/>' +
      '<g transform="translate(150 129) rotate(9)">' +
      '<clipPath id="' + cid + '"><path d="M0 0h23v-21a11.5 11.5 0 0 0-23 0z"/></clipPath>' +
      '<path d="M2 -13c-6.6-.6-9.6-6.4-7.4-10.6c1.8-3.2 5.6-2.6 7.4.6z" fill="url(#lk-kessa)"/>' +
      '<path d="M0 0h23v-21a11.5 11.5 0 0 0-23 0z" fill="url(#lk-kessa)"/>' +
      '<g clip-path="url(#' + cid + ')">' + hatch + '</g>' +
      '<rect x="-1" y="-6.5" width="25" height="6.5" rx="2" fill="url(#lk-rgv)"/>' +
      '<path d="M5 -26a7 7 0 0 1 6-4" stroke="#fff" stroke-opacity=".35" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>' +
      spk(40, 54, 5, B.spark, .95) + spk(160, 62, 6, B.spark, .95) + spk(146, 86, 3.4, B.spark, .85);
  };
  M.serum = function (B) {
    return sh(B, 106, 54) +
      '<rect x="68" y="72" width="36" height="57" rx="9" fill="url(#lk-frost)"/>' +
      '<rect x="74" y="79" width="5" height="42" rx="2.5" fill="#fff" opacity=".6"/>' +
      '<rect x="80" y="98" width="18" height="14" rx="2" fill="#fff" opacity=".55"/>' +
      floret(89, 105, 4.4, '#C9506A', 45, '#fff', .9) +
      '<rect x="74" y="61" width="24" height="12" rx="2" fill="url(#lk-rgv)"/>' +
      '<path d="M79 61V44a7 7 0 0 1 14 0v17z" fill="url(#lk-plumh)"/>' +
      '<rect x="110" y="103" width="48" height="26" rx="8" fill="url(#lk-cream)"/>' +
      '<rect x="108" y="93" width="52" height="13" rx="5" fill="url(#lk-rgv)"/>' +
      '<rect x="114" y="95.5" width="22" height="2.4" rx="1.2" fill="#fff" opacity=".5"/>' +
      '<path d="M124 52c0 0-6 8-6 12a6 6 0 0 0 12 0c0-4-6-12-6-12z" fill="#F4C3C6"/>' +
      '<path d="M122 63a2.6 2.6 0 0 0 2 2.6" stroke="#fff" stroke-width="1.3" fill="none" stroke-linecap="round"/>' +
      spk(152, 44, 7, B.spark, 1) + spk(56, 50, 4.5, B.spark, .9) + pearl(170, 126, 3.4);
  };
  M.stones = function (B) {
    var leaves = '', pts = [[56, 108, -30], [50, 94, -50], [60, 82, -20], [52, 70, -40], [64, 60, -10], [58, 50, -30]];
    pts.forEach(function (p, i) { leaves += '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="9" ry="6" fill="url(#lk-leaf)" transform="rotate(' + (p[2] + (i % 2 ? 60 : 0)) + ' ' + p[0] + ' ' + p[1] + ')"/>'; });
    return sh(B, 100, 60) +
      '<path d="M66 129C60 104 58 80 66 46" stroke="#6F8F6A" stroke-width="1.6" fill="none"/>' + leaves +
      '<circle cx="148" cy="84" r="16" fill="#FFE8B8" opacity=".35"/>' +
      '<rect x="137" y="96" width="22" height="33" rx="4" fill="url(#lk-cream)"/>' +
      '<ellipse cx="148" cy="96" rx="11" ry="2.6" fill="#F6EADC"/>' +
      '<path d="M148 92.5v-3" stroke="#3E2A22" stroke-width="1.2"/>' +
      '<path d="M148 76c0 0-5.5 6.5-5.5 10.5a5.5 5.5 0 0 0 11 0C153.5 82.5 148 76 148 76z" fill="url(#lk-flame)"/>' +
      '<ellipse cx="96" cy="120" rx="36" ry="9.5" fill="url(#lk-stone)"/>' +
      '<ellipse cx="98" cy="105" rx="27" ry="8" fill="url(#lk-stone)"/>' +
      '<ellipse cx="95" cy="92" rx="19" ry="6.6" fill="url(#lk-stone)"/>' +
      '<ellipse cx="97" cy="81.5" rx="11.5" ry="4.6" fill="url(#lk-stone)"/>' +
      '<ellipse cx="84" cy="116.5" rx="12" ry="2.6" fill="#fff" opacity=".16"/><ellipse cx="88" cy="102" rx="9" ry="2.2" fill="#fff" opacity=".16"/>' +
      '<ellipse cx="89" cy="89.5" rx="6" ry="1.8" fill="#fff" opacity=".18"/><ellipse cx="93.5" cy="79.6" rx="4" ry="1.3" fill="#fff" opacity=".2"/>' +
      spk(124, 50, 6, B.spark, .95) + spk(170, 112, 3.5, B.spark, .9);
  };
  M.eye = function (B, o) {
    var v = (o && o.variant) || 'thread';
    var ink = '#3E1638', brow = v === 'lash' ? '#5B3A2E' : '#4A2A20';
    // lashes along lid curve (cubic from 58,96 c(78,114)(122,114)(144,96))
    var lash = '', len = v === 'lash' ? 15 : 10;
    for (var i = 1; i <= 8; i++) {
      var t = 0.08 + i * 0.105, mt = 1 - t;
      var x = mt * mt * mt * 58 + 3 * mt * mt * t * 78 + 3 * mt * t * t * 122 + t * t * t * 144;
      var y = mt * mt * mt * 96 + 3 * mt * mt * t * 114 + 3 * mt * t * t * 114 + t * t * t * 96;
      var dx = (t - .5) * 14, cx = x + dx * .5, cy = y + len * .7;
      lash += '<path d="M' + x.toFixed(1) + ' ' + y.toFixed(1) + 'Q' + (cx - 1).toFixed(1) + ' ' + cy.toFixed(1) + ' ' + (x + dx + (t - .5) * 6).toFixed(1) + ' ' + (y + len).toFixed(1) + '" stroke="' + ink + '" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
    }
    var extra = '';
    if (v === 'spoolie') {
      var br = '';
      for (var k = 0; k < 9; k++) br += '<path d="M' + (144 + k * 3.2) + ' 34v14" stroke="#3E1638" stroke-width="1.4" stroke-linecap="round"/>';
      extra = '<g transform="rotate(-28 150 52)"><rect x="90" y="38" width="50" height="6" rx="3" fill="url(#lk-rgv)"/>' + br + '</g>';
    } else if (v === 'thread') {
      extra = '<path d="M34 40C70 26 104 36 120 30S160 18 176 30" stroke="#C98A73" stroke-width="1.4" fill="none"/>' +
        '<path d="M34 46C70 34 106 42 122 36S160 26 176 36" stroke="#C98A73" stroke-width="1.4" fill="none" opacity=".7"/>';
    } else {
      /* mascara: tube standing at the side, wand resting against it */
      extra = '<ellipse cx="166" cy="129.5" rx="12" ry="2.6" fill="' + B.shadow + '" opacity=".16"/>' +
        '<rect x="159" y="86" width="14" height="43" rx="5" fill="url(#lk-plumh)"/>' +
        '<rect x="162" y="90" width="2.6" height="34" rx="1.3" fill="#fff" opacity=".3"/>' +
        '<rect x="160" y="78" width="12" height="10" rx="2" fill="url(#lk-rgv)"/>' +
        '<g transform="rotate(-24 150 112)"><rect x="147" y="64" width="6" height="34" rx="3" fill="url(#lk-rgv)"/>' +
        '<rect x="148.5" y="98" width="3" height="12" fill="#5B3A2E"/><rect x="146" y="110" width="8" height="16" rx="4" fill="#2E1A22"/></g>';
    }
    return extra +
      '<path d="M50 72C58 60 78 52 102 48C122 45 140 48 154 59C140 55 124 54 106 57C86 60 66 66 50 72Z" fill="' + brow + '"/>' +
      '<path d="M60 68C74 60 92 55 110 53" stroke="#fff" stroke-opacity=".2" stroke-width="1.2" fill="none"/>' +
      '<path d="M58 96C78 114 122 114 144 96" stroke="' + ink + '" stroke-width="3.6" fill="none" stroke-linecap="round"/>' + lash +
      '<ellipse cx="72" cy="112" rx="8" ry="4" fill="#E58A8A" opacity=".18"/>' +
      (v === 'lash' ? spk(150, 34, 7, B.spark, 1) + spk(44, 104, 4.5, B.spark, .9) + pearl(36, 124, 3.5) :
        spk(156, 92, 7, B.spark, 1) + spk(44, 104, 4.5, B.spark, .9) + pearl(166, 122, 3.5));
  };
  M.cone = function (B) {
    return sh(B, 100, 56) +
      '<path d="M56 112c-11-1-15-14-7-22 7-7 18-4 20 4 2 8-5 16-13 18zM56 103c-3.5-.5-5-4.5-2.5-7.5" stroke="#8A3B1E" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '<g fill="#8A3B1E"><circle cx="74" cy="104" r="1.7"/><circle cx="72" cy="114" r="1.4"/><circle cx="42" cy="104" r="1.4"/><circle cx="60" cy="122" r="1.6"/></g>' +
      '<path d="M86 124c8-6 18-6 26 0M90 120c6-4 12-4 18 0" stroke="#8A3B1E" stroke-width="1.6" fill="none" stroke-linecap="round"/>' +
      '<g transform="rotate(38 120 70)">' +
      '<path d="M108 24h26l-11 92h-4z" fill="url(#lk-cream)"/>' +
      '<path d="M112 30l9 76" stroke="#fff" stroke-opacity=".7" stroke-width="2"/>' +
      '<path d="M117 116l2 7 2-7z" fill="#8A3B1E"/>' +
      '<rect x="105" y="18" width="32" height="10" rx="2.5" fill="url(#lk-rgv)"/>' +
      '<path d="M108 52h26M110 72h22" stroke="#E2CDB8" stroke-width="1"/></g>' +
      spk(56, 50, 6, B.spark, .95) + spk(160, 112, 4, B.spark, .9);
  };

  function scene(motif, bg, opt) {
    var B = BG[bg] || BG.blush;
    return '<svg class="art" viewBox="0 0 200 160" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' +
      '<rect width="200" height="160" fill="url(#lk-bg-' + (BG[bg] ? bg : 'blush') + ')"/>' +
      '<circle cx="172" cy="20" r="48" fill="' + B.glow + '" opacity=".38"/>' +
      '<path d="M50 160V82a50 50 0 0 1 100 0v78z" fill="' + B.arch + '" opacity="' + B.archO + '"/>' +
      '<rect y="129" width="200" height="31" fill="' + B.floor + '" opacity="' + B.floorO + '"/>' +
      (M[motif] || M.polish)(B, opt || {}) + '</svg>';
  }
  function serviceArt(s) { return scene(s.motif, s.bg, { tone: s.tone, variant: s.variant }); }
  function motifOnly(motif, bg, opt) {
    var B = BG[bg] || BG.blush;
    return '<svg class="art" viewBox="30 20 150 120" aria-hidden="true" focusable="false">' + (M[motif] || M.polish)(B, opt || {}) + '</svg>';
  }

  /* ---------- illustrated portraits ---------- */
  function avatar(L, label) {
    var id = nid('av'), sk = L.skin, hr = L.hair, sd = shade(sk, -.14), dk = shade(hr, -.18);
    var back = '', front = '', neck = '<path d="M51.5 68h17v14c0 7-17 7-17 0z" fill="' + sd + '"/>', ear = true, hij = '';
    switch (L.style) {
      case 'hijab':
        ear = false; neck = '';
        hij = '<path d="M60 22.5c-17.5 0-27.5 13-27.5 30.5 0 13 3.5 22-2.5 34-3.4 6.6-7.5 13-9 24h78c-1.5-11-5.6-17.4-9-24-6-12-2.5-21-2.5-34 0-17.5-10-30.5-27.5-30.5z" fill="' + hr + '"/>' +
          '<path d="M41 79c7 8 31 8 38 0" stroke="' + dk + '" stroke-width="1.6" fill="none" opacity=".55"/>' +
          '<path d="M36 96c10 5 38 5 48 0" stroke="' + dk + '" stroke-width="1.4" fill="none" opacity=".35"/>';
        front = '<path d="M42.6 47.5c2-11.5 9-17 17.4-17s15.4 5.5 17.4 17c-4.4-6.2-10.4-9.3-17.4-9.3s-13 3.1-17.4 9.3z" fill="' + dk + '"/>';
        break;
      case 'long':
        back = '<path d="M37 52c-2-21 10-28 23-28s25 7 23 28c-1 16 3 30 9 46 2 6-6 10-14 10H42c-8 0-16-4-14-10 6-16 10-30 9-46z" fill="' + hr + '"/>';
        front = '<path d="M41.6 52c-1.6-16 8.4-25.6 20.4-25.6 12.8 0 20.8 9 19.8 24-6-9-14-14-24-13-6 1-11.2 5.8-16.2 14.6z" fill="' + hr + '"/>' +
          '<path d="M50 34c8-4 18-3 24 3" stroke="' + shade(hr, .25) + '" stroke-width="1.4" fill="none" opacity=".6"/>';
        break;
      case 'bob':
        back = '<path d="M37.5 56c-2-20.5 8.5-31 22.5-31s24.5 10.5 22.5 31l2 15.5c-6 4.5-14 5.5-24.5 5.5S41.5 76 35.5 71.5z" fill="' + hr + '"/>';
        front = '<path d="M41 47.5c0-13.5 8-21.5 19-21.5s19 8 19 21.5c-5-3.2-11-4.7-19-4.7s-14 1.5-19 4.7z" fill="' + hr + '"/>' +
          '<path d="M48 33c6-3 15-3 21 1" stroke="' + shade(hr, .25) + '" stroke-width="1.4" fill="none" opacity=".6"/>';
        break;
      case 'bun':
        back = '<circle cx="60" cy="24" r="10.5" fill="' + hr + '"/><path d="M53 22c3-3 9-3 13 0" stroke="' + shade(hr, .2) + '" stroke-width="1.2" fill="none"/>';
        front = '<path d="M41.2 53c-2.2-16.5 6.3-26.5 18.8-26.5S81 36.5 78.8 53c-3-9.3-10.3-14.3-18.8-14.3S44.2 43.7 41.2 53z" fill="' + hr + '"/>';
        break;
      case 'pony':
        back = '<path d="M76 38c11 4 15 17 11 31-2.4 7.6-6.4 12.6-10.4 14.6 3-8.6 4-16.6 2-24.6-1.4-8-4-14-7.6-18z" fill="' + hr + '"/>';
        front = '<path d="M41.2 53c-2.2-16.5 6.3-26.5 18.8-26.5S81 36.5 78.8 53c-3-9.3-10.3-14.3-18.8-14.3S44.2 43.7 41.2 53z" fill="' + hr + '"/>' +
          '<path d="M48 34c7-4 17-4 23 1" stroke="' + shade(hr, .22) + '" stroke-width="1.3" fill="none" opacity=".6"/>';
        break;
      case 'curly':
        var r = rng(7), c = '';
        for (var a = 0; a < 15; a++) {
          var ang = Math.PI * (0.92 + a * (1.16 / 14)), cx = 60 + Math.cos(ang) * 25, cy = 52 + Math.sin(ang) * 24;
          c += '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + (8.5 + r() * 2.5).toFixed(1) + '" fill="' + hr + '"/>';
        }
        c += '<circle cx="36" cy="66" r="8.5" fill="' + hr + '"/><circle cx="84" cy="66" r="8.5" fill="' + hr + '"/><circle cx="38" cy="76" r="7" fill="' + hr + '"/><circle cx="82" cy="76" r="7" fill="' + hr + '"/>';
        back = '<ellipse cx="60" cy="52" rx="26" ry="26" fill="' + hr + '"/>' + c;
        front = '<circle cx="49" cy="35" r="6.5" fill="' + hr + '"/><circle cx="59.5" cy="32" r="7" fill="' + hr + '"/><circle cx="70.5" cy="35" r="6.5" fill="' + hr + '"/><circle cx="44" cy="42" r="4.5" fill="' + hr + '"/><circle cx="76" cy="42" r="4.5" fill="' + hr + '"/>';
        break;
    }
    var s = '<svg class="avatar-svg" viewBox="0 0 120 120"' + (label ? ' role="img" aria-label="' + label + '"' : ' aria-hidden="true"') + ' focusable="false">' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + L.bg[0] + '"/><stop offset="1" stop-color="' + L.bg[1] + '"/></linearGradient></defs>' +
      '<rect width="120" height="120" fill="url(#' + id + ')"/>' +
      '<circle cx="60" cy="58" r="44" fill="#fff" opacity=".22"/>' + back +
      '<path d="M18 124c2-25 20-36 42-36s40 11 42 36z" fill="' + L.outfit + '"/>' +
      '<path d="M48 90c4 5 20 5 24 0" stroke="' + shade(L.outfit, -.12) + '" stroke-width="1.4" fill="none" opacity=".5"/>' +
      neck + hij +
      '<ellipse cx="60" cy="53.5" rx="' + (L.style === 'hijab' ? 16.6 : 17.5) + '" ry="20.5" fill="' + sk + '"/>' + front +
      '<path d="M49.4 55.2q3.2 2.6 6.4 0M64.2 55.2q3.2 2.6 6.4 0" stroke="#3B1A2A" stroke-width="1.7" fill="none" stroke-linecap="round"/>' +
      '<path d="M48.6 49.6q3.6-2 7.4-.6M64 49q3.8-1.4 7.4.6" stroke="' + (L.style === 'hijab' ? '#3B1F18' : shade(hr, -.05)) + '" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".75"/>' +
      '<circle cx="48.6" cy="61.6" r="3.6" fill="#E8858A" opacity=".3"/><circle cx="71.4" cy="61.6" r="3.6" fill="#E8858A" opacity=".3"/>' +
      '<path d="M60 56.6q-1.4 4 .9 5" stroke="' + sd + '" stroke-width="1.2" fill="none" stroke-linecap="round"/>' +
      '<path d="M55.6 66q2.2-1.4 4.4-.3 2.2-1.1 4.4.3-1.8 3.4-4.4 3.4t-4.4-3.4z" fill="#B8475E"/>' +
      (ear ? '<circle cx="42.4" cy="60.5" r="2.2" fill="url(#lk-pearl)"/><circle cx="77.6" cy="60.5" r="2.2" fill="url(#lk-pearl)"/>' : '') +
      '</svg>';
    return s;
  }

  /* ---------- brand ---------- */
  /* Laylak mark: a lilac floret (lilac = laylak) framed by the lounge's arched doorway */
  function mark(cls) {
    return '<svg class="' + (cls || 'mark') + '" viewBox="-1.25 -1.25 2.5 2.5" aria-hidden="true" focusable="false">' +
      '<path d="M-.84 1.06V-.1A.84.84 0 0 1 .84-.1V1.06Z" fill="none" stroke="url(#lk-rgd)" stroke-width=".15" stroke-linejoin="round" transform="translate(0 -.06)"/>' +
      floret(0, .14, .63, 'url(#lk-rgd)', 0, null) + '<circle cy=".14" r=".12" fill="url(#lk-pearl)"/></svg>';
  }

  function lilacCluster(cx, top, h, w, seed, n) {
    var r = rng(seed), s = '', cols = ['#F1E8F9', '#E2D2F1', '#CDB6E6', '#B898D8', '#A283C9', '#D9C2EC', '#8E6BB8', '#F6EFFB'], items = [];
    for (var i = 0; i < n; i++) {
      var u = Math.pow(r(), .85), y = top + u * h, half = w * Math.pow(Math.sin(Math.PI * Math.min(.98, u * .95 + .02)), .8) * (.32 + .68 * u);
      var x = cx + (r() * 2 - 1) * half;
      var shadeIdx = Math.min(cols.length - 1, Math.floor(r() * cols.length));
      items.push([y, x, 6 + r() * 4.5, cols[shadeIdx], r() * 90]);
    }
    items.sort(function (a, b) { return a[0] - b[0]; });
    items.forEach(function (it) { s += floret(it[1].toFixed(1), it[0].toFixed(1), it[2].toFixed(1), it[3], it[4].toFixed(0), '#FFF3E6'); });
    return s;
  }

  /* ---------- onboarding illustrations (300x300) ---------- */
  function onboard(i, specs) {
    var s = '<svg class="ob-art" viewBox="0 0 300 300" aria-hidden="true" focusable="false">';
    if (i === 0) {
      s += '<circle cx="150" cy="156" r="132" fill="#fff" opacity=".45"/>' +
        '<path d="M70 296V150a80 80 0 0 1 160 0v146z" fill="url(#lk-bg-plum)"/>' +
        '<path d="M82 296V152a68 68 0 0 1 136 0v144" fill="none" stroke="url(#lk-rg)" stroke-width="1.4" opacity=".8"/>' +
        '<path d="M150 296C152 250 150 214 156 184" stroke="#7FA07D" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<path d="M150 262c-22-2-38-14-42-34 20 0 36 12 42 34z" fill="url(#lk-leaf)"/>' +
        '<path d="M152 250c18-10 36-10 50 2-16 10-34 10-50-2z" fill="url(#lk-leaf)" opacity=".9"/>' +
        lilacCluster(153, 84, 130, 50, 11, 78) +
        pearl(54, 122, 7) + pearl(250, 94, 9) + pearl(254, 214, 5.5) + pearl(44, 230, 4.5) +
        spk(240, 150, 10, '#fff', .95) + spk(62, 180, 7, '#D99C86', .9) + spk(110, 60, 6, '#D99C86', .7);
    } else if (i === 1) {
      var ids = [nid('oc'), nid('oc'), nid('oc')];
      var pos = [[78, 128, 46], [222, 128, 46], [150, 112, 60]];
      var order = [0, 1, 2];
      s += '<circle cx="150" cy="150" r="132" fill="#fff" opacity=".45"/>' +
        '<path d="M60 250V130a90 90 0 0 1 180 0v120z" fill="#FBEFEA" opacity=".9"/>';
      order.forEach(function (k) {
        var p = pos[k], sp = specs[k];
        s += '<clipPath id="' + ids[k] + '"><circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + p[2] + '"/></clipPath>' +
          '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (p[2] + 5) + '" fill="#fff"/>' +
          '<g clip-path="url(#' + ids[k] + ')"><svg x="' + (p[0] - p[2]) + '" y="' + (p[1] - p[2]) + '" width="' + (p[2] * 2) + '" height="' + (p[2] * 2) + '" viewBox="0 0 120 120">' +
          avatar(sp.look).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '') + '</svg></g>';
      });
      s += '<rect x="78" y="196" width="144" height="58" rx="18" fill="#fff"/>' +
        '<rect x="78" y="196" width="144" height="58" rx="18" fill="none" stroke="#F1DCD5"/>';
      for (var k = 0; k < 5; k++) s += star(98 + k * 18, 214, 7, k < 5 ? '#D9A24E' : '#EADBD6');
      s += '<rect x="94" y="232" width="74" height="7" rx="3.5" fill="#EBDDE6"/><rect x="174" y="229" width="34" height="13" rx="6.5" fill="#6E2D63"/>' +
        spk(246, 70, 9, '#D99C86', .9) + spk(52, 74, 6, '#fff', 1) + pearl(258, 196, 6) + pearl(40, 200, 5) + floret(244, 248, 9, '#CDB6E6', 20, '#fff');
    } else {
      s += '<circle cx="150" cy="156" r="132" fill="#fff" opacity=".45"/>' +
        '<g transform="rotate(-6 150 160)"><rect x="66" y="78" width="168" height="168" rx="26" fill="#fff"/>' +
        '<path d="M66 104a26 26 0 0 1 26-26h116a26 26 0 0 1 26 26v14H66z" fill="url(#lk-plum)"/>' +
        '<rect x="104" y="66" width="9" height="26" rx="4.5" fill="url(#lk-rgv)"/><rect x="187" y="66" width="9" height="26" rx="4.5" fill="url(#lk-rgv)"/>';
      for (var row = 0; row < 4; row++) for (var col = 0; col < 5; col++) {
        var x = 92 + col * 29, y = 142 + row * 26;
        if (row === 1 && col === 3) s += '<circle cx="' + x + '" cy="' + y + '" r="14" fill="url(#lk-rgd)"/><path d="M' + (x - 6) + ' ' + y + 'l4.5 4.5 8-9" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
        else s += '<circle cx="' + x + '" cy="' + y + '" r="4.5" fill="' + ((row * 5 + col) % 4 === 0 ? '#E6D6F2' : '#F4E6E1') + '"/>';
      }
      s += '</g>' +
        '<g transform="translate(232 84) rotate(14)"><path d="M0-26c-14 0-22 11-22 24v14l-6 9h56l-6-9V-2C22-15 14-26 0-26z" fill="url(#lk-rgd)"/>' +
        '<path d="M-8 24a8 8 0 0 0 16 0z" fill="#B9705E"/><rect x="-3" y="-33" width="6" height="8" rx="3" fill="#B9705E"/>' +
        '<circle cx="16" cy="-18" r="8" fill="#6E2D63"/><circle cx="16" cy="-18" r="8" fill="none" stroke="#fff" stroke-width="2.5"/></g>' +
        '<rect x="34" y="236" width="70" height="36" rx="18" fill="#6E2D63"/><circle cx="86" cy="254" r="13" fill="#fff"/>' +
        spk(52, 92, 8, '#D99C86', .9) + spk(266, 170, 7, '#fff', 1) + pearl(262, 236, 7) + pearl(46, 168, 5) + floret(140, 274, 9, '#CDB6E6', 10, '#fff');
    }
    return s + '</svg>';
  }

  function star(cx, cy, r, fill) {
    var p = '';
    for (var i = 0; i < 10; i++) {
      var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r;
      p += (i ? 'L' : 'M') + (cx + Math.cos(a) * rr).toFixed(2) + ' ' + (cy + Math.sin(a) * rr).toFixed(2);
    }
    return '<path d="' + p + 'Z" fill="' + fill + '"/>';
  }

  /* ---------- offers ---------- */
  function offerArt(theme) {
    if (theme === 'plum') {
      return '<svg class="offer-art" viewBox="0 0 160 160" aria-hidden="true" focusable="false">' +
        '<circle cx="96" cy="78" r="58" fill="#fff" opacity=".06"/>' + floret(96, 78, 48, 'url(#lk-rgd)', 12, null) + '<circle cx="96" cy="78" r="9" fill="url(#lk-pearl)"/>' +
        floret(30, 130, 14, '#CDB6E6', 30, '#FFF3E6', .9) + floret(150, 20, 10, '#E1D2F1', 10, '#FFF3E6', .8) +
        pearl(36, 40, 6) + pearl(146, 140, 5) + spk(140, 60, 7, '#F6D3C2', .9) + '</svg>';
    }
    if (theme === 'blush') return motifOnly('serum', 'blush');
    return motifOnly('pearls', 'lilac');
  }

  /* ---------- salon map ---------- */
  function map() {
    return '<svg class="map-art" viewBox="0 0 340 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' +
      '<rect width="340" height="150" fill="#F6EEE6"/>' +
      '<path d="M190 0h150v150h-26c-6-22-20-34-40-42s-40-26-52-50S200 18 190 0z" fill="#D6E7EA"/>' +
      '<path d="M190 0c10 18 20 34 32 58s32 42 52 50 34 20 40 42" stroke="#EADFD3" stroke-width="5" fill="none"/>' +
      '<path d="M206 14c8 14 18 30 28 46" stroke="#fff" stroke-opacity=".7" stroke-width="1.4" fill="none" stroke-dasharray="5 6"/>' +
      '<g fill="#EFE2D5"><rect x="14" y="14" width="56" height="34" rx="6"/><rect x="82" y="14" width="64" height="34" rx="6"/><rect x="14" y="62" width="56" height="38" rx="6"/>' +
      '<rect x="14" y="114" width="56" height="30" rx="6"/><rect x="82" y="114" width="70" height="30" rx="6"/><rect x="164" y="104" width="44" height="40" rx="6"/></g>' +
      '<rect x="82" y="62" width="64" height="38" rx="8" fill="#DCE8D3"/><circle cx="102" cy="80" r="6" fill="#C5D9BA"/><circle cx="124" cy="76" r="8" fill="#C5D9BA"/>' +
      '<path d="M0 55H190M76 0V150M0 107h220M152 0l20 150" stroke="#fff" stroke-width="7" fill="none"/>' +
      '<path d="M0 55H190M0 107h220" stroke="#F3D9A8" stroke-width="2" fill="none" opacity=".7"/>' +
      '<circle cx="160" cy="80" r="26" fill="#6E2D63" opacity=".08"/><circle cx="160" cy="80" r="15" fill="#6E2D63" opacity=".12"/>' +
      '<path d="M160 86c-11-11-15-17-15-24a15 15 0 0 1 30 0c0 7-4 13-15 24z" fill="url(#lk-plum)" transform="translate(0 -8)"/>' +
      '<g transform="translate(160 54)">' + floret(0, 0, 7.5, 'url(#lk-rgd)', 0, '#fff') + '</g>' +
      '<ellipse cx="160" cy="80" rx="6" ry="2" fill="#3E1638" opacity=".2"/></svg>';
  }

  /* ---------- success bloom ---------- */
  function bloom() {
    var p = '', cols = ['url(#lk-rgd)', '#F3C9C3'];
    for (var i = 0; i < 8; i++) {
      p += '<g transform="rotate(' + (i * 45) + ' 80 80)"><path class="b-petal" style="--i:' + i + '" d="M80 80C64 66 64 32 80 18C96 32 96 66 80 80Z" fill="' + cols[i % 2] + '"/></g>';
    }
    return '<svg class="bloom" viewBox="0 0 160 160" aria-hidden="true" focusable="false">' +
      '<circle class="b-ring" cx="80" cy="80" r="64" fill="none" stroke="#E9B8B3" stroke-width="1.5"/>' +
      '<circle class="b-ring b-ring2" cx="80" cy="80" r="64" fill="none" stroke="#CDB6E6" stroke-width="1.5"/>' +
      '<g class="b-petals">' + p + '</g>' +
      '<circle class="b-core" cx="80" cy="80" r="27" fill="url(#lk-plum)"/>' +
      '<path class="b-check" d="M67.5 81l8.5 8.5 17-18" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/></svg>';
  }

  /* ---------- small empty-state art ---------- */
  function emptyArt(kind) {
    if (kind === 'search') {
      return '<svg class="empty-art" viewBox="0 0 160 120" aria-hidden="true" focusable="false"><circle cx="80" cy="60" r="52" fill="#FBEAE5"/>' +
        '<circle cx="72" cy="54" r="22" fill="#fff" stroke="url(#lk-rgd)" stroke-width="6"/>' + floret(72, 54, 10, '#CDB6E6', 20, '#fff') +
        '<path d="M88 70l18 18" stroke="url(#lk-plum)" stroke-width="9" stroke-linecap="round"/>' + spk(122, 30, 6, '#D99C86', .9) + pearl(36, 88, 4) + '</svg>';
    }
    return '<svg class="empty-art" viewBox="0 0 160 120" aria-hidden="true" focusable="false"><circle cx="80" cy="60" r="52" fill="#FBEAE5"/>' +
      '<rect x="48" y="34" width="64" height="58" rx="12" fill="#fff"/><path d="M48 46a12 12 0 0 1 12-12h40a12 12 0 0 1 12 12v6H48z" fill="url(#lk-plum)"/>' +
      '<rect x="62" y="28" width="5" height="12" rx="2.5" fill="url(#lk-rgv)"/><rect x="93" y="28" width="5" height="12" rx="2.5" fill="url(#lk-rgv)"/>' +
      floret(80, 72, 11, 'url(#lk-rgd)', 0, '#fff') + spk(126, 34, 6, '#D99C86', .9) + pearl(34, 86, 4) + floret(128, 92, 6, '#CDB6E6', 20, '#fff') + '</svg>';
  }

  /* ---------- category icons (32px line icons) ---------- */
  var CAT = {
    hair: '<path d="M5.5 12.5a6 6 0 0 1 6-6H22l5.5 2.2v7.6L22 18.5H11.5a6 6 0 0 1-6-6z"/><circle cx="11.5" cy="12.5" r="2.2"/><path d="M14.5 18.5l1.6 7.6a2 2 0 0 0 2 1.6h1.2a1.6 1.6 0 0 0 1.5-2.1l-2-7.1"/><path d="M29 10v5"/>',
    nails: '<rect x="9.5" y="15" width="13" height="13" rx="3.5"/><path d="M13 15v-3h6v3"/><rect x="13.5" y="3.5" width="5" height="8.5" rx="1.4"/><path d="M12.8 19.5v4"/>',
    makeup: '<path d="M11.5 28.5V17h9v11.5z"/><path d="M12.5 17v-3.6h7V17"/><path d="M13.8 13.4V7.2L18.2 4.5v8.9"/><path d="M14.5 21v4"/>',
    spa: '<path d="M16 27c-5.6 0-10.6-3.3-11.4-9.6 4.3 0 8.6 2.2 11.4 6.4 2.8-4.2 7.1-6.4 11.4-6.4C26.6 23.7 21.6 27 16 27z"/><path d="M16 23.6c-2.6-2.6-3.8-5.7-3.8-8.8S13.6 8.6 16 6c2.4 2.6 3.8 5.7 3.8 8.8s-1.2 6.2-3.8 8.8z"/>',
    brows: '<path d="M5 11.2c4.4-3.8 10-4.9 15.6-3.6"/><path d="M4 19.5c3.5 4.6 7.6 6.6 12 6.6s8.5-2 12-6.6c-3.5-4.6-7.6-6.6-12-6.6S7.5 14.9 4 19.5z"/><circle cx="16" cy="19.5" r="3.2"/>'
  };
  function catIcon(id) { return '<svg class="cat-ic" viewBox="0 0 32 32" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + (CAT[id] || '') + '</svg>'; }

  window.LAYLAK_ART = {
    defs: defs, scene: scene, serviceArt: serviceArt, motifOnly: motifOnly, avatar: avatar, mark: mark,
    onboard: onboard, offerArt: offerArt, map: map, bloom: bloom, emptyArt: emptyArt, catIcon: catIcon,
    floret: floret, star: star, lilacCluster: lilacCluster
  };
})();
