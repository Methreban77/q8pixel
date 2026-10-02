/* Sadeem — hand-built SVG art: bottles, jars, gift boxes, scenes and illustrations */
(function () {
  'use strict';
  var uid = 0;

  /* ---------- colour helpers ---------- */
  function rgb(h) {
    h = h.replace('#', '');
    if (h.length === 3) h = h.replace(/(.)/g, '$1$1');
    var v = parseInt(h, 16);
    return [v >> 16 & 255, v >> 8 & 255, v & 255];
  }
  function hex(r, g, b) {
    return '#' + [r, g, b].map(function (v) {
      v = Math.max(0, Math.min(255, Math.round(v)));
      return (v < 16 ? '0' : '') + v.toString(16);
    }).join('');
  }
  function mix(a, b, t) {
    var A = rgb(a), B = rgb(b);
    return hex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t);
  }
  function dk(c, t) { return mix(c, '#000000', t); }
  function lt(c, t) { return mix(c, '#ffffff', t); }
  function seeded(str) {
    var s = 7;
    for (var i = 0; i < str.length; i++) s = (s * 31 + str.charCodeAt(i)) % 2147483647;
    return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  }
  function f(n) { return Math.round(n * 10) / 10; }

  var METAL = {
    gold: ['#6b4a1c', '#f3dca8', '#ad8442', '#d6b46f'],
    black: ['#0a0807', '#5d5045', '#1b1612', '#332a23'],
    silver: ['#77746f', '#fbfaf6', '#b3afa8', '#d9d5ce'],
    rose: ['#7c4637', '#f6d2bf', '#b4735f', '#d99d86']
  };

  var BG = {
    sand: { c: ['#f1e5cf', '#dcc6a1'] },
    blush: { c: ['#f4e0d8', '#dfb9ad'] },
    mist: { c: ['#eceee9', '#cdd3ce'] },
    pearl: { c: ['#edf1ef', '#cad6d6'] },
    lilac: { c: ['#efebf2', '#d3cadf'] },
    saffron: { c: ['#f5e1b9', '#e2b673'] },
    dusk: { c: ['#3d2f25', '#1a1410'], dark: true },
    wine: { c: ['#4d1b27', '#1f080e'], dark: true },
    ink: { c: ['#2f2823', '#110e0c'], dark: true }
  };

  /* ---------- logo ---------- */
  var MARK = {
    arch: 'M11 44V21.5C11 13.5 16.8 7.2 24 4.5C31.2 7.2 37 13.5 37 21.5V44',
    wisp: 'M24 39C19.5 35.5 28.5 31.5 24 27.5C19.5 23.5 28.5 19.5 24 15.5',
    base: 'M6 44H42'
  };
  function markG(color, sw) {
    sw = sw || 2.4;
    return '<g fill="none" stroke="' + color + '" stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="' + MARK.arch + '"/><path d="' + MARK.wisp + '"/><path d="' + MARK.base + '"/></g>';
  }
  function logo(cls) {
    return '<svg class="' + (cls || 'mark') + '" viewBox="0 0 48 48" aria-hidden="true" focusable="false">' + markG('currentColor', 2.6) + '</svg>';
  }

  /* ---------- gradients ---------- */
  function metalGrad(id, m) {
    var c = METAL[m] || METAL.gold;
    return '<linearGradient id="' + id + '" x1="0" x2="1" y1="0" y2="0">' +
      '<stop offset="0" stop-color="' + c[0] + '"/><stop offset=".2" stop-color="' + c[3] + '"/>' +
      '<stop offset=".36" stop-color="' + c[1] + '"/><stop offset=".62" stop-color="' + c[2] + '"/>' +
      '<stop offset="1" stop-color="' + c[0] + '"/></linearGradient>';
  }
  function hGrad(id, c, a, b) {
    return '<linearGradient id="' + id + '" x1="0" x2="1"><stop offset="0" stop-color="' + dk(c, a || .45) + '"/>' +
      '<stop offset=".18" stop-color="' + lt(c, .16) + '"/><stop offset=".48" stop-color="' + c + '"/>' +
      '<stop offset=".84" stop-color="' + dk(c, .22) + '"/><stop offset="1" stop-color="' + dk(c, b || .5) + '"/></linearGradient>';
  }
  function vGrad(id, top, bot) {
    return '<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + top + '"/><stop offset="1" stop-color="' + bot + '"/></linearGradient>';
  }

  /* ---------- glass bottle shapes (240×300 frame, base at y=272) ---------- */
  var SHAPES = {
    flacon: {
      body: 'M82 118H158Q174 118 174 134V256Q174 272 158 272H82Q66 272 66 256V134Q66 118 82 118Z',
      top: 118, bot: 272, neck: [106, 102, 28, 18], collar: [100, 92, 40, 11], label: [88, 166, 64, 58],
      hl: 'M77 134V250', hr: 'M164 140V196'
    },
    round: {
      body: 'M120 120A76 76 0 1 1 119.99 120Z',
      top: 120, bot: 272, neck: [107, 102, 26, 22], collar: [101, 92, 38, 11], label: [91, 176, 58, 46],
      hl: 'M60 198A60 60 0 0 1 95 142', hr: 'M180 212A60 60 0 0 1 171 236'
    },
    tall: {
      body: 'M90 78H150Q156 78 156.5 84L161 262Q161 272 151 272H89Q79 272 79.5 262L84 84Q84.5 78 90 78Z',
      top: 78, bot: 272, neck: [108, 64, 24, 16], collar: [102, 54, 36, 11], label: [95, 144, 50, 78],
      hl: 'M93 92L90 256', hr: 'M150 100L152 162'
    },
    facet: {
      body: 'M88 106H152L178 132V246L152 272H88L62 246V132Z',
      top: 106, bot: 272, neck: [106, 90, 28, 18], collar: [99, 80, 42, 11], label: [90, 158, 60, 60],
      hl: 'M72 140V236', hr: 'M169 146V192', facets: true
    },
    drop: {
      body: 'M120 108C142 140 184 176 184 214C184 250 155 272 120 272C85 272 56 250 56 214C56 176 98 140 120 108Z',
      top: 108, bot: 272, neck: [108, 94, 24, 20], collar: [102, 84, 36, 11], label: [97, 198, 46, 44],
      hl: 'M72 222C72 196 90 170 106 150', hr: 'M171 226C171 238 165 248 157 254'
    },
    attar: {
      body: 'M113 120H127L129 176C156 184 172 208 172 232C172 258 148 272 120 272C92 272 68 258 68 232C68 208 84 184 111 176Z',
      top: 120, bot: 272, neck: null, collar: [105, 110, 30, 11], label: [101, 214, 38, 36], liquidTop: 196,
      hl: 'M83 228C83 212 91 200 103 192', hr: 'M159 238C157 248 151 255 143 259'
    }
  };

  function cap(style, by, g) {
    var u = 'url(#' + g + ')';
    switch (style) {
      case 'cube':
        return '<rect x="99" y="' + (by - 40) + '" width="42" height="40" rx="3" fill="' + u + '"/>' +
          '<rect x="99" y="' + (by - 40) + '" width="42" height="5" rx="2" fill="#fff" opacity=".22"/>' +
          '<rect x="99" y="' + (by - 6) + '" width="42" height="6" fill="#000" opacity=".18"/>';
      case 'dome':
        return '<path d="M97 ' + by + 'V' + (by - 16) + 'A23 25 0 0 1 143 ' + (by - 16) + 'V' + by + 'Z" fill="' + u + '"/>' +
          '<path d="M104 ' + (by - 20) + 'A16 18 0 0 1 116 ' + (by - 36) + '" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="2.4" stroke-linecap="round"/>';
      case 'sphere':
        return '<rect x="113" y="' + (by - 8) + '" width="14" height="8" fill="' + u + '"/>' +
          '<circle cx="120" cy="' + (by - 28) + '" r="22" fill="' + u + '"/>' +
          '<circle cx="111" cy="' + (by - 36) + '" r="6" fill="#fff" opacity=".4"/>' +
          '<path d="M100 ' + (by - 22) + 'A22 22 0 0 0 140 ' + (by - 22) + '" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="3"/>';
      case 'crown':
        return '<rect x="97" y="' + (by - 10) + '" width="46" height="10" rx="2" fill="' + u + '"/>' +
          '<path d="M102 ' + (by - 10) + 'L108 ' + (by - 30) + 'H132L138 ' + (by - 10) + 'Z" fill="' + u + '"/>' +
          '<path d="M108 ' + (by - 14) + 'L111 ' + (by - 26) + 'M120 ' + (by - 14) + 'V' + (by - 26) + 'M132 ' + (by - 14) + 'L129 ' + (by - 26) + '" stroke="#000" stroke-opacity=".22" stroke-width="1.6"/>' +
          '<rect x="104" y="' + (by - 37) + '" width="32" height="8" rx="2" fill="' + u + '"/>' +
          '<path d="M110 ' + (by - 37) + 'Q120 ' + (by - 60) + ' 130 ' + (by - 37) + 'Z" fill="' + u + '"/>' +
          '<circle cx="120" cy="' + (by - 55) + '" r="3.6" fill="' + u + '"/>';
      case 'spire':
        return '<path d="M107 ' + by + 'L113 ' + (by - 26) + 'Q120 ' + (by - 76) + ' 127 ' + (by - 26) + 'L133 ' + by + 'Z" fill="' + u + '"/>' +
          '<rect x="105" y="' + (by - 8) + '" width="30" height="8" rx="2" fill="' + u + '"/>' +
          '<path d="M116 ' + (by - 30) + 'Q118 ' + (by - 52) + ' 120 ' + (by - 58) + '" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.6" stroke-linecap="round"/>' +
          '<circle cx="120" cy="' + (by - 72) + '" r="3.4" fill="' + u + '"/>';
      case 'slab':
        return '<rect x="91" y="' + (by - 30) + '" width="58" height="30" rx="2" fill="' + u + '"/>' +
          '<rect x="91" y="' + (by - 30) + '" width="58" height="4" fill="#fff" opacity=".2"/>' +
          '<path d="M98 ' + (by - 15) + 'H142" stroke="#c9a46a" stroke-opacity=".7" stroke-width="1"/>';
      case 'gem':
        return '<path d="M104 ' + by + 'L97 ' + (by - 18) + 'L110 ' + (by - 38) + 'H130L143 ' + (by - 18) + 'L136 ' + by + 'Z" fill="' + u + '"/>' +
          '<path d="M97 ' + (by - 18) + 'H143M110 ' + (by - 38) + 'L115 ' + (by - 18) + 'L120 ' + by + 'M130 ' + (by - 38) + 'L125 ' + (by - 18) + 'L120 ' + by + '" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1"/>';
      default: return '';
    }
  }

  function label(L, style, num) {
    var x = L[0], y = L[1], w = L[2], h = L[3], cx = x + w / 2;
    var dark = style === 'dark';
    var bg = dark ? '#17120e' : '#f5eddf', fg = dark ? '#d9ba7c' : '#7a5a2b';
    var ms = Math.min(w, h) / 48 * (h > 50 ? .5 : .44);
    var out = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="1.5" fill="' + bg + '" opacity=".97"/>' +
      '<rect x="' + (x + 2.5) + '" y="' + (y + 2.5) + '" width="' + (w - 5) + '" height="' + (h - 5) + '" rx="1" fill="none" stroke="' + fg + '" stroke-width=".7"/>' +
      '<g transform="translate(' + f(cx - 24 * ms) + ' ' + f(y + h * (h > 50 ? .14 : .1)) + ') scale(' + f(ms * 100) / 100 + ')">' + markG(fg, 2.6) + '</g>';
    var fs = Math.max(4.4, Math.min(7, w / 8.6));
    out += '<text x="' + cx + '" y="' + f(y + h * (h > 50 ? .74 : .82)) + '" text-anchor="middle" font-size="' + f(fs) + '" letter-spacing="' + f(fs * .22) + '" fill="' + fg + '" font-family="Cormorant Garamond, Georgia, serif" font-weight="600">SADEEM</text>';
    if (h > 50) out += '<text x="' + cx + '" y="' + f(y + h * .88) + '" text-anchor="middle" font-size="4.6" letter-spacing="1" fill="' + fg + '" font-family="Jost, Arial, sans-serif" opacity=".85">N° ' + num + '</text>';
    return out;
  }

  function glassBottle(a, id, num) {
    var S = SHAPES[a.shape];
    var g = a.glass, liq = a.liquid || g;
    var d = hGrad(id + 'g', g) +
      vGrad(id + 'l', lt(liq, .12), dk(liq, .32)) +
      '<linearGradient id="' + id + 'e" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".42"/><stop offset=".22" stop-color="#000" stop-opacity="0"/><stop offset=".74" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></linearGradient>' +
      metalGrad(id + 'm', a.metal) +
      '<clipPath id="' + id + 'c"><path d="' + S.body + '"/></clipPath>';
    var b = '';
    b += '<path d="' + S.body + '" fill="url(#' + id + 'g)"' + (a.frosted ? '' : ' opacity=".93"') + '/>';
    var ly = S.liquidTop || (S.top + (S.bot - S.top) * (1 - (a.level || .7)));
    b += '<g clip-path="url(#' + id + 'c)">';
    b += '<rect x="0" y="' + f(ly) + '" width="240" height="' + f(300 - ly) + '" fill="url(#' + id + 'l)" opacity="' + (a.frosted ? .28 : .9) + '"/>';
    if (!a.frosted) b += '<rect x="0" y="' + f(ly) + '" width="240" height="2" fill="' + lt(liq, .5) + '" opacity=".75"/>';
    b += '<path d="' + S.body + '" fill="url(#' + id + 'e)" opacity="' + (a.frosted ? .28 : .7) + '"/>';
    b += '<rect x="0" y="' + (S.bot - 9) + '" width="240" height="9" fill="' + dk(g, .4) + '" opacity=".45"/>';
    b += '</g>';
    if (S.facets) {
      b += '<path d="M96 120H144L164 140V238L144 258H96L76 238V140Z" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-opacity=".26" stroke-width="1"/>' +
        '<path d="M88 106L96 120M152 106L144 120M178 132L164 140M178 246L164 238M152 272L144 258M88 272L96 258M62 246L76 238M62 132L76 140" stroke="#fff" stroke-opacity=".22" stroke-width="1"/>';
    }
    if (a.label) b += label(S.label, a.label, num);
    b += '<path d="' + S.hl + '" fill="none" stroke="#fff" stroke-opacity="' + (a.frosted ? .7 : .42) + '" stroke-width="6" stroke-linecap="round"/>';
    b += '<path d="' + S.hr + '" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="2.6" stroke-linecap="round"/>';
    b += '<path d="' + S.body + '" fill="none" stroke="' + lt(g, .55) + '" stroke-opacity=".45" stroke-width="1.2"/>';
    if (S.neck) {
      var nk = S.neck;
      b += '<rect x="' + nk[0] + '" y="' + nk[1] + '" width="' + nk[2] + '" height="' + nk[3] + '" fill="url(#' + id + 'g)"/>' +
        '<rect x="' + (nk[0] + 4) + '" y="' + nk[1] + '" width="3" height="' + nk[3] + '" fill="#fff" opacity=".35"/>';
    }
    var c = S.collar;
    b += '<rect x="' + c[0] + '" y="' + c[1] + '" width="' + c[2] + '" height="' + c[3] + '" rx="2" fill="url(#' + id + 'm)"/>' +
      '<rect x="' + c[0] + '" y="' + (c[1] + c[3] - 2.5) + '" width="' + c[2] + '" height="2.5" fill="#000" opacity=".2"/>';
    b += cap(a.cap, c[1], id + 'm');
    return { defs: d, body: b };
  }

  /* ---------- bakhoor jar ---------- */
  function jar(a, id, num, seed) {
    var J = 'M70 152H170Q182 152 182 164V258Q182 272 168 272H72Q58 272 58 258V164Q58 152 70 152Z';
    var d = metalGrad(id + 'm', a.metal) + hGrad(id + 'g', a.glass, .35, .45) +
      '<clipPath id="' + id + 'c"><path d="' + J + '"/></clipPath>' +
      '<linearGradient id="' + id + 'e" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset=".25" stop-color="#000" stop-opacity="0"/><stop offset=".75" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></linearGradient>';
    var b = '';
    if (a.opaque) {
      b += '<path d="' + J + '" fill="url(#' + id + 'g)"/>';
      b += '<rect x="58" y="166" width="124" height="3" fill="url(#' + id + 'm)"/><rect x="58" y="252" width="124" height="3" fill="url(#' + id + 'm)"/>';
      b += sadu(62, 234, 116, 10, '#c9a46a', .7);
      if (a.label) b += label([90, 178, 60, 50], a.label, num);
    } else {
      var r = seeded(seed || id);
      b += '<path d="' + J + '" fill="' + lt(a.glass, .35) + '" opacity=".5"/>';
      b += '<g clip-path="url(#' + id + 'c)">';
      var cols = [a.liquid, dk(a.liquid, .25), lt(a.liquid, .18), dk(a.liquid, .45)];
      for (var i = 0; i < 46; i++) {
        var cx = 60 + r() * 122, cy = 206 + r() * 66 - (i > 30 ? 8 : 0), sz = 6 + r() * 9;
        var pts = [];
        for (var k = 0; k < 5; k++) {
          var ang = k / 5 * Math.PI * 2 + r() * .8, rr = sz * (.55 + r() * .5);
          pts.push(f(cx + Math.cos(ang) * rr) + ',' + f(cy + Math.sin(ang) * rr * .7));
        }
        b += '<polygon points="' + pts.join(' ') + '" fill="' + cols[i % 4] + '"/>';
      }
      b += '<path d="' + J + '" fill="url(#' + id + 'e)"/>';
      b += '</g>';
      if (a.label) b += label([92, 176, 56, 22], a.label === 'light' ? 'light' : 'dark', num).replace(/<text[^>]*>N[^<]*<\/text>/, '');
      b += '<path d="M68 166V256" stroke="#fff" stroke-opacity=".45" stroke-width="5" stroke-linecap="round"/>' +
        '<path d="M172 172V214" stroke="#fff" stroke-opacity=".25" stroke-width="2.4" stroke-linecap="round"/>' +
        '<path d="' + J + '" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.2"/>';
    }
    b += '<rect x="62" y="138" width="116" height="16" rx="3" fill="url(#' + id + 'm)"/>' +
      '<rect x="62" y="150" width="116" height="4" fill="#000" opacity=".2"/>' +
      '<path d="M68 138Q70 106 120 103Q170 106 172 138Z" fill="url(#' + id + 'm)"/>' +
      '<path d="M84 128Q90 114 110 110" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="2.4" stroke-linecap="round"/>' +
      '<rect x="116" y="94" width="8" height="10" fill="url(#' + id + 'm)"/><circle cx="120" cy="92" r="7" fill="url(#' + id + 'm)"/>';
    return { defs: d, body: b };
  }

  /* ---------- bakhoor tin ---------- */
  function tin(a, id) {
    var c = a.glass;
    var d = metalGrad(id + 'm', a.metal) + hGrad(id + 'g', c, .5, .55);
    var b = '<path d="M54 196V262A66 10 0 0 0 186 262V196Z" fill="url(#' + id + 'g)"/>' +
      sadu(58, 246, 124, 10, '#d6b46f', .8) +
      '<circle cx="120" cy="226" r="17" fill="none" stroke="#d6b46f" stroke-width="1.2"/>' +
      '<g transform="translate(110.4 216.4) scale(.4)">' + markG('#e6c88c', 2.6) + '</g>' +
      '<path d="M50 176V200A70 11 0 0 0 190 200V176Z" fill="url(#' + id + 'm)"/>' +
      '<ellipse cx="120" cy="176" rx="70" ry="12" fill="' + lt(METAL[a.metal || 'gold'][3], .2) + '"/>' +
      '<ellipse cx="120" cy="176" rx="58" ry="8.5" fill="none" stroke="#7a5a2b" stroke-opacity=".45" stroke-width="1"/>' +
      '<path d="M66 200V258" stroke="#fff" stroke-opacity=".22" stroke-width="5" stroke-linecap="round"/>';
    return { defs: d, body: b };
  }

  /* ---------- wooden oud chest ---------- */
  function chest(a, id, num, seed) {
    var w = a.glass;
    var d = metalGrad(id + 'm', 'gold') + hGrad(id + 'w', w, .45, .5) + vGrad(id + 'v', '#5a1724', '#2a0910');
    var b = '<rect x="52" y="128" width="136" height="72" rx="4" fill="' + dk(w, .35) + '"/>' +
      '<rect x="58" y="134" width="124" height="62" rx="2" fill="url(#' + id + 'v)"/>' +
      '<path d="M66 140H174" stroke="#c9a46a" stroke-opacity=".35"/>';
    var r = seeded(seed || id);
    for (var i = 0; i < 22; i++) {
      var cx = 62 + r() * 116, cy = 188 + r() * 12, sz = 6 + r() * 8, pts = [];
      for (var k = 0; k < 5; k++) {
        var ang = k / 5 * Math.PI * 2 + r() * .7, rr = sz * (.5 + r() * .5);
        pts.push(f(cx + Math.cos(ang) * rr * 1.3) + ',' + f(cy + Math.sin(ang) * rr * .6));
      }
      b += '<polygon points="' + pts.join(' ') + '" fill="' + ['#3a2213', '#5b3820', '#2a170c', '#74492a'][i % 4] + '"/>';
    }
    b += '<rect x="48" y="196" width="144" height="76" rx="3" fill="url(#' + id + 'w)"/>' +
      '<path d="M56 214C90 210 130 218 184 212M56 234C96 238 140 228 184 236M56 254C92 250 140 258 184 252" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="1.2"/>' +
      '<rect x="48" y="196" width="144" height="5" fill="url(#' + id + 'm)"/>' +
      '<path d="M48 214V199H63M192 214V199H177M48 254V269H63M192 254V269H177" fill="none" stroke="url(#' + id + 'm)" stroke-width="4"/>' +
      '<rect x="111" y="198" width="18" height="22" rx="2" fill="url(#' + id + 'm)"/><circle cx="120" cy="212" r="2.6" fill="#3a2516"/>' +
      '<rect x="98" y="236" width="44" height="18" rx="1" fill="#f3ead9" opacity=".92"/>' +
      '<text x="120" y="248" text-anchor="middle" font-size="6.4" letter-spacing="1.4" fill="#7a5a2b" font-family="Cormorant Garamond, Georgia, serif" font-weight="600">SADEEM</text>';
    return { defs: d, body: b };
  }

  /* ---------- gift box ---------- */
  function box(a, id) {
    var c = a.glass, rb = a.ribbon || '#c9a46a';
    var d = hGrad(id + 'b', c, .3, .38) + hGrad(id + 'l', lt(c, .06), .25, .3) + hGrad(id + 'r', rb, .3, .35);
    var b = '<rect x="50" y="170" width="140" height="102" fill="url(#' + id + 'b)"/>' +
      sadu(54, 252, 132, 10, rb, .55) +
      '<rect x="50" y="170" width="140" height="8" fill="#000" opacity=".18"/>' +
      '<rect x="112" y="170" width="16" height="102" fill="url(#' + id + 'r)"/>' +
      '<rect x="44" y="150" width="152" height="26" rx="2" fill="url(#' + id + 'l)"/>' +
      '<rect x="112" y="150" width="16" height="26" fill="url(#' + id + 'r)"/>' +
      '<path d="M120 150C102 120 76 124 86 144C90 152 106 153 120 150Z" fill="url(#' + id + 'r)"/>' +
      '<path d="M120 150C138 120 164 124 154 144C150 152 134 153 120 150Z" fill="url(#' + id + 'r)"/>' +
      '<path d="M112 148C100 140 92 140 92 140M128 148C140 140 148 140 148 140" stroke="#000" stroke-opacity=".2" stroke-width="1.4" fill="none"/>' +
      '<rect x="113" y="143" width="14" height="10" rx="3" fill="' + dk(rb, .1) + '"/>' +
      '<g transform="translate(68 196) scale(.5)" opacity=".85">' + markG(lt(rb, .1), 2.4) + '</g>';
    return { defs: d, body: b };
  }

  /* ---------- The Majlis Set: an open box holding a bottle and a bakhoor jar, brass mabkhara in front ---------- */
  function openBox(a, id) {
    var c = a.glass, rb = a.ribbon || '#c9a46a';
    var bt = glassBottle({ shape: 'facet', glass: '#2b1d16', liquid: '#9a5320', level: .72, cap: 'crown', metal: 'gold', label: 'light' }, id + 'b', '01');
    var jr = jar({ glass: '#d9c3a0', liquid: '#4a2614', metal: 'gold', label: 'light' }, id + 'j', '11', 'majlis-set');
    var d = bt.defs + jr.defs + hGrad(id + 'f', c, .3, .4) + metalGrad(id + 'm', 'gold') +
      vGrad(id + 's', '#6a1c2c', '#2a0910') + vGrad(id + 'in', '#0a0706', '#2a1712');
    var b = '';
    /* lid standing open behind the box, its inner face lined in wine satin */
    b += '<path d="M54 98H186L192 186H48Z" fill="' + dk(c, .15) + '"/>' +
      '<path d="M59 104H181L186 184H54Z" fill="url(#' + id + 's)"/>' +
      '<path d="M64.5 109.5H175.5L180 181H60Z" fill="none" stroke="' + rb + '" stroke-opacity=".55" stroke-width=".8"/>' +
      '<path d="M72 112C92 140 86 160 66 182" fill="none" stroke="#fff" stroke-opacity=".07" stroke-width="12"/>' +
      '<g transform="translate(108 113) scale(.5)">' + markG(lt(rb, .15), 2.4) + '</g>';
    /* the opening */
    b += '<path d="M48 186H192L198 201H42Z" fill="url(#' + id + 'in)"/>';
    /* what is inside */
    b += '<g transform="translate(88 238) scale(.5) translate(-120 -272)">' + bt.body + '</g>';
    b += '<g transform="translate(155 241) scale(.52) translate(-120 -272)">' + jr.body + '</g>';
    /* front of the box */
    b += '<rect x="42" y="200" width="156" height="72" fill="url(#' + id + 'f)"/>' +
      '<rect x="42" y="200" width="156" height="3.5" fill="url(#' + id + 'm)"/>' +
      sadu(46, 254, 148, 9, rb, .5) +
      '<rect x="101" y="211" width="38" height="14" rx="1.5" fill="url(#' + id + 'm)"/>' +
      '<text x="120" y="221" text-anchor="middle" font-size="6.2" letter-spacing="1.3" fill="#3a2516" font-family="Cormorant Garamond, Georgia, serif" font-weight="600">SADEEM</text>';
    /* brass mabkhara on the plinth */
    b += '<ellipse cx="120" cy="280" rx="25" ry="3.2" fill="#000" opacity=".28"/>' + mabkharaG(id + 'm', 120, 279, .5);
    return { defs: d, body: b };
  }

  /* ---------- Eid Gift Box: keepsake box with a crescent tag and three travel sprays ---------- */
  function eidBox(a, id) {
    var c = a.glass, rb = a.ribbon || '#7a1f30';
    var d = hGrad(id + 'b', c, .16, .26) + hGrad(id + 'l', lt(c, .12), .12, .2) + hGrad(id + 'r', rb, .3, .35) + metalGrad(id + 'm', 'gold') +
      '<linearGradient id="' + id + 'e" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".34"/><stop offset=".3" stop-color="#000" stop-opacity="0"/><stop offset=".7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".42"/></linearGradient>';
    var b = '';
    /* the box */
    b += '<rect x="98" y="182" width="100" height="90" fill="url(#' + id + 'b)"/>' +
      sadu(102, 257, 92, 8, rb, .3) +
      '<rect x="98" y="182" width="100" height="6" fill="#000" opacity=".1"/>' +
      '<rect x="98" y="214" width="100" height="12" fill="url(#' + id + 'r)"/>' +
      '<rect x="141" y="182" width="14" height="90" fill="url(#' + id + 'r)"/>' +
      '<rect x="92" y="164" width="112" height="22" rx="2" fill="url(#' + id + 'l)"/>' +
      '<rect x="92" y="183" width="112" height="3" fill="#000" opacity=".12"/>' +
      '<rect x="141" y="164" width="14" height="22" fill="url(#' + id + 'r)"/>';
    /* bow */
    b += '<path d="M148 164C130 136 106 142 116 158C120 165 136 166 148 164Z" fill="url(#' + id + 'r)"/>' +
      '<path d="M148 164C166 136 190 142 180 158C176 165 160 166 148 164Z" fill="url(#' + id + 'r)"/>' +
      '<path d="M126 152C132 150 140 156 146 162M170 152C164 150 156 156 150 162" fill="none" stroke="#000" stroke-opacity=".22" stroke-width="1.2"/>' +
      '<path d="M144 166L134 192L141 188L144 196L149 168Z" fill="' + dk(rb, .15) + '"/>' +
      '<rect x="142" y="157" width="12" height="10" rx="3" fill="' + dk(rb, .1) + '"/>';
    /* crescent tag on a gold cord */
    b += '<path d="M153 166C165 176 172 188 175.5 200" fill="none" stroke="#b08a4a" stroke-width="1.2"/>' +
      '<path d="M175.7 200.3A10 10 0 1 0 187.7 212.3A8.5 8.5 0 0 1 175.7 200.3Z" fill="url(#' + id + 'm)"/>' +
      sparkle(185, 204.5, 2.8, '#d6b46f');
    /* three travel sprays */
    var sp = [[56, 80, '#efe7da'], [77, 70, '#e7a3a1'], [98, 76, '#d98e2f']];
    b += '<ellipse cx="78" cy="276" rx="36" ry="3.2" fill="#000" opacity=".25"/>';
    sp.forEach(function (s) {
      var x = s[0], h = s[1], col = s[2], y0 = 276 - h, bh = h - 18;
      b += '<rect x="' + (x - 8) + '" y="' + (y0 + 18) + '" width="16" height="' + bh + '" rx="3" fill="' + col + '"/>' +
        '<rect x="' + (x - 8) + '" y="' + (y0 + 18) + '" width="16" height="' + bh + '" rx="3" fill="url(#' + id + 'e)"/>' +
        '<rect x="' + (x - 5) + '" y="' + (y0 + 22) + '" width="2.6" height="' + (bh - 10) + '" rx="1.3" fill="#fff" opacity=".5"/>' +
        '<rect x="' + (x - 8) + '" y="' + f(y0 + 18 + bh * .45) + '" width="16" height="11" fill="#17120e" opacity=".88"/>' +
        '<rect x="' + (x - 5) + '" y="' + f(y0 + 18 + bh * .45 + 5) + '" width="10" height="1" fill="#d6b46f"/>' +
        '<rect x="' + (x - 6) + '" y="' + (y0 + 12) + '" width="12" height="7" fill="url(#' + id + 'm)"/>' +
        '<path d="M' + (x - 7) + ' ' + (y0 + 12) + 'V' + (y0 + 3) + 'Q' + (x - 7) + ' ' + y0 + ' ' + (x - 4) + ' ' + y0 + 'H' + (x + 4) + 'Q' + (x + 7) + ' ' + y0 + ' ' + (x + 7) + ' ' + (y0 + 3) + 'V' + (y0 + 12) + 'Z" fill="url(#' + id + 'm)"/>' +
        '<rect x="' + (x - 4.5) + '" y="' + (y0 + 2) + '" width="2" height="9" rx="1" fill="#fff" opacity=".4"/>';
    });
    return { defs: d, body: b };
  }

  /* ---------- Bride's Trousseau: a two-tier Kuwaiti mandoos with brass studs, tied in blush silk ---------- */
  function mandoos(a, id) {
    var w = a.glass, rb = a.ribbon || '#e6b4a8', m = 'url(#' + id + 'm)';
    var d = hGrad(id + 'w', w, .4, .5) + hGrad(id + 'w2', lt(w, .1), .35, .45) + metalGrad(id + 'm', 'gold') + hGrad(id + 'r', rb, .2, .3);
    function stud(x, y, r) { return '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + (r || 1.5) + '" fill="' + m + '"/>'; }
    function row(x0, x1, y, step) {
      var o = '';
      for (var x = x0; x <= x1; x += step) if (x < 111 || x > 129) o += stud(x, y);
      return o;
    }
    function diamond(cx, cy, rx, ry, n) {
      var o = '', pts = [[cx, cy - ry], [cx + rx, cy], [cx, cy + ry], [cx - rx, cy]];
      for (var e = 0; e < 4; e++) {
        var p = pts[e], q = pts[(e + 1) % 4];
        for (var i = 0; i < n; i++) o += stud(p[0] + (q[0] - p[0]) * i / n, p[1] + (q[1] - p[1]) * i / n);
      }
      return o + stud(cx, cy, 3.2) + stud(cx - 7, cy, 1.3) + stud(cx + 7, cy, 1.3) + stud(cx, cy - 6, 1.3) + stud(cx, cy + 6, 1.3);
    }
    function corner(x, y, sx, sy) {
      return '<path d="M' + x + ' ' + y + 'h' + (14 * sx) + 'v' + (4 * sy) + 'h' + (-10 * sx) + 'v' + (10 * sy) + 'h' + (-4 * sx) + 'Z" fill="' + m + '"/>';
    }
    var b = '';
    /* feet */
    b += '<rect x="54" y="258" width="16" height="14" rx="2" fill="' + m + '"/><rect x="170" y="258" width="16" height="14" rx="2" fill="' + m + '"/>';
    /* lower chest */
    b += '<rect x="48" y="186" width="144" height="74" rx="2" fill="url(#' + id + 'w)"/>' +
      '<path d="M54 204C90 200 130 208 186 202M54 236C100 240 150 230 186 238" stroke="#000" stroke-opacity=".16" fill="none"/>' +
      '<rect x="44" y="176" width="152" height="13" rx="2" fill="url(#' + id + 'w2)"/>' +
      '<rect x="44" y="187" width="152" height="2.5" fill="' + m + '"/>' +
      '<rect x="48" y="252" width="144" height="3" fill="' + m + '"/>' +
      corner(48, 190, 1, 1) + corner(192, 190, -1, 1) + corner(48, 252, 1, -1) + corner(192, 252, -1, -1) +
      row(64, 178, 196, 7) + row(64, 178, 245, 7) +
      diamond(84, 221, 20, 15, 4) + diamond(156, 221, 20, 15, 4);
    /* upper tier */
    b += '<rect x="74" y="146" width="92" height="31" rx="2" fill="url(#' + id + 'w)"/>' +
      '<rect x="70" y="136" width="100" height="12" rx="2" fill="url(#' + id + 'w2)"/>' +
      '<rect x="70" y="146" width="100" height="2" fill="' + m + '"/>' +
      row(80, 162, 154, 7) + row(80, 162, 170, 7) +
      stud(95, 162, 2.6) + stud(145, 162, 2.6);
    /* blush silk ribbon and bow */
    b += '<rect x="113" y="136" width="14" height="124" fill="url(#' + id + 'r)"/>' +
      '<path d="M113 186H127M113 176H127" stroke="#000" stroke-opacity=".1"/>' +
      '<path d="M120 136C104 112 82 116 90 132C94 139 108 139 120 136Z" fill="url(#' + id + 'r)"/>' +
      '<path d="M120 136C136 112 158 116 150 132C146 139 132 139 120 136Z" fill="url(#' + id + 'r)"/>' +
      '<path d="M98 126C104 124 112 130 117 134M142 126C136 124 128 130 123 134" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="1.2"/>' +
      '<path d="M116 138L105 162L112 158L115 166L120 140Z" fill="' + dk(rb, .14) + '"/>' +
      '<path d="M124 138L135 162L128 158L125 166L120 140Z" fill="' + dk(rb, .1) + '"/>' +
      '<rect x="114" y="129" width="12" height="10" rx="3" fill="' + dk(rb, .06) + '"/>';
    return { defs: d, body: b };
  }

  /* ---------- discovery vials ---------- */
  function vials(a, id) {
    var cols = ['#9a5320', '#e58d2c', '#ecb7b5', '#efe5d3', '#8c1f33', '#7c9a9c'];
    var d = metalGrad(id + 'm', 'gold') + hGrad(id + 'w', '#3b2416', .4, .5);
    var b = '<rect x="36" y="226" width="168" height="12" rx="2" fill="#2a1a10"/>';
    for (var i = 0; i < 6; i++) {
      var x = 49 + i * 25;
      b += '<rect x="' + x + '" y="176" width="17" height="80" rx="4" fill="' + lt(cols[i], .55) + '" opacity=".55"/>' +
        '<rect x="' + (x + 1.5) + '" y="196" width="14" height="58" rx="3" fill="' + cols[i] + '" opacity=".9"/>' +
        '<rect x="' + (x + 3) + '" y="180" width="3" height="70" rx="1.5" fill="#fff" opacity=".5"/>' +
        '<rect x="' + (x - 1) + '" y="160" width="19" height="18" rx="2" fill="url(#' + id + 'm)"/>';
    }
    b += '<rect x="30" y="238" width="180" height="34" rx="3" fill="url(#' + id + 'w)"/>' +
      '<path d="M38 246H202" stroke="#c9a46a" stroke-opacity=".7" stroke-width="1"/>' +
      '<text x="120" y="262" text-anchor="middle" font-size="8" letter-spacing="2.4" fill="#e6c88c" font-family="Cormorant Garamond, Georgia, serif" font-weight="600">SADEEM</text>';
    return { defs: d, body: b };
  }

  /* ---------- sadu-inspired triangle band ---------- */
  function sadu(x, y, w, h, color, op) {
    var n = Math.floor(w / h), step = w / n, p = '';
    for (var i = 0; i < n; i++) {
      var x0 = x + i * step;
      p += 'M' + f(x0) + ' ' + (y + h) + 'L' + f(x0 + step / 2) + ' ' + y + 'L' + f(x0 + step) + ' ' + (y + h) + 'Z';
    }
    return '<path d="' + p + '" fill="' + color + '" opacity="' + (op || .6) + '"/>' +
      '<path d="M' + x + ' ' + (y - 2) + 'H' + (x + w) + 'M' + x + ' ' + (y + h + 2) + 'H' + (x + w) + '" stroke="' + color + '" stroke-opacity="' + (op || .6) + '" stroke-width=".8"/>';
  }

  function smoke(color, op) {
    return '<g class="wisps" fill="none" stroke="' + color + '" stroke-linecap="round">' +
      '<path class="wisp w1" d="M112 140C96 116 128 100 112 76C98 56 124 42 114 18" stroke-width="3" stroke-opacity="' + op + '"/>' +
      '<path class="wisp w2" d="M128 136C142 112 114 96 130 72C142 54 120 40 132 16" stroke-width="2.2" stroke-opacity="' + (op * .8) + '"/>' +
      '<path class="wisp w3" d="M120 146C110 124 132 110 120 88C110 70 128 58 122 36" stroke-width="1.6" stroke-opacity="' + (op * .7) + '"/></g>';
  }

  function productGroup(p, id) {
    var a = p.art, num = ('0' + (p.num || 1)).slice(-2);
    switch (a.shape) {
      case 'jar': return jar(a, id, num, p.id);
      case 'tin': return tin(a, id);
      case 'chest': return chest(a, id, num, p.id);
      case 'box': return box(a, id);
      case 'openbox': return openBox(a, id);
      case 'eidbox': return eidBox(a, id);
      case 'mandoos': return mandoos(a, id);
      case 'vials': return vials(a, id);
      default: return glassBottle(a, id, num);
    }
  }

  function sparkle(x, y, r, color, cls) {
    return '<path class="' + (cls || '') + '" d="M' + x + ' ' + (y - r) + 'Q' + x + ' ' + y + ' ' + (x + r) + ' ' + y + 'Q' + x + ' ' + y + ' ' + x + ' ' + (y + r) + 'Q' + x + ' ' + y + ' ' + (x - r) + ' ' + y + 'Q' + x + ' ' + y + ' ' + x + ' ' + (y - r) + 'Z" fill="' + color + '"/>';
  }

  /* ---------- full product scene: arch + plinth + product ---------- */
  function scene(p, opts) {
    opts = opts || {};
    var id = 'a' + (++uid);
    var bg = BG[p.art.bg] || BG.sand;
    var dark = !!bg.dark;
    var prod = productGroup(p, id + '_');
    var defs = vGrad(id + 'bg', bg.c[0], bg.c[1]) +
      '<radialGradient id="' + id + 'gl" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="' + (dark ? '#c9a46a' : '#ffffff') + '" stop-opacity="' + (dark ? .32 : .75) + '"/><stop offset="1" stop-color="' + (dark ? '#c9a46a' : '#ffffff') + '" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="' + id + 'sh" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#1a120c" stop-opacity=".42"/><stop offset="1" stop-color="#1a120c" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="' + id + 'pl" x1="0" x2="1"><stop offset="0" stop-color="#cfc0a6"/><stop offset=".45" stop-color="#f1e9dc"/><stop offset="1" stop-color="#c7b699"/></linearGradient>' +
      prod.defs;
    var b = '<path d="M24 300V136C24 74 66 38 120 20C174 38 216 74 216 136V300Z" fill="url(#' + id + 'bg)"/>' +
      '<path d="M34 300V140C34 84 72 52 120 34C168 52 206 84 206 140V300" fill="none" stroke="' + (dark ? '#c9a46a' : '#8a6a3a') + '" stroke-opacity="' + (dark ? .5 : .32) + '" stroke-width=".9"/>' +
      '<ellipse cx="120" cy="186" rx="96" ry="104" fill="url(#' + id + 'gl)"/>';
    if (dark) b += sparkle(58, 92, 4, '#e2c48e', 'tw t1') + sparkle(184, 120, 3, '#e2c48e', 'tw t2') + sparkle(170, 70, 2.4, '#e2c48e', 'tw t3');
    if (p.art.smoke) b += smoke(dark ? '#f4ead8' : '#5a3d28', dark ? .38 : .22);
    b += '<rect x="30" y="272" width="180" height="28" fill="url(#' + id + 'pl)"/>' +
      '<ellipse cx="120" cy="272" rx="90" ry="9" fill="#f6efe4"/>' +
      '<ellipse cx="120" cy="272" rx="90" ry="9" fill="none" stroke="#b9a685" stroke-opacity=".5" stroke-width=".8"/>' +
      '<ellipse cx="120" cy="272" rx="70" ry="7" fill="url(#' + id + 'sh)"/>';
    b += '<g class="prod">' + prod.body + '</g>';
    var label = opts.label || '';
    return '<svg class="art ' + (opts.cls || '') + '" viewBox="0 0 240 300" ' + (label ? 'role="img" aria-label="' + label + '"' : 'aria-hidden="true"') + ' focusable="false"><defs>' + defs + '</defs>' + b + '</svg>';
  }

  /* a product without the arch, for composing into larger illustrations */
  function placed(p, x, y, s, extra) {
    var id = 'a' + (++uid);
    var prod = productGroup(p, id);
    return {
      defs: prod.defs + '<radialGradient id="' + id + 'sh" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".45"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>',
      body: '<g class="' + (extra || '') + '"><g transform="translate(' + x + ' ' + y + ') scale(' + s + ') translate(-120 -272)">' +
        '<ellipse cx="120" cy="272" rx="72" ry="7" fill="url(#' + id + 'sh)"/>' + prod.body + '</g></g>'
    };
  }

  function plinth(id, cx, top, rx, bottom) {
    return '<rect x="' + (cx - rx) + '" y="' + top + '" width="' + (rx * 2) + '" height="' + (bottom - top) + '" fill="url(#' + id + ')"/>' +
      '<ellipse cx="' + cx + '" cy="' + bottom + '" rx="' + rx + '" ry="' + f(rx * .11) + '" fill="url(#' + id + ')"/>' +
      '<ellipse cx="' + cx + '" cy="' + top + '" rx="' + rx + '" ry="' + f(rx * .11) + '" fill="#f6efe4"/>' +
      '<ellipse cx="' + cx + '" cy="' + top + '" rx="' + rx + '" ry="' + f(rx * .11) + '" fill="none" stroke="#b9a685" stroke-opacity=".6" stroke-width=".8"/>';
  }

  /* ---------- mabkhara (incense burner) ---------- */
  function mabkharaG(id, x, y, s) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
      '<path d="M-36 0H36V-8H30V-15H-30V-8H-36Z" fill="url(#' + id + ')"/>' +
      '<path d="M-24 -15L-13 -54H13L24 -15Z" fill="url(#' + id + ')"/>' +
      '<path d="M-16 -22H16M-14 -30H14" stroke="#000" stroke-opacity=".25" stroke-width="1.2"/>' +
      '<path d="M-7 -36L0 -46L7 -36L0 -26Z" fill="#7a1f30" opacity=".85"/>' +
      '<rect x="-16" y="-60" width="32" height="7" rx="1.5" fill="url(#' + id + ')"/>' +
      '<path d="M-26 -60L-36 -88H36L26 -60Z" fill="url(#' + id + ')"/>' +
      '<path d="M-30 -70H30" stroke="#000" stroke-opacity=".25" stroke-width="1"/>' +
      '<path d="M-28 -80L-22 -72L-16 -80L-10 -72L-4 -80L2 -72L8 -80L14 -72L20 -80L26 -72" fill="none" stroke="#000" stroke-opacity=".28" stroke-width="1"/>' +
      '<rect x="-39" y="-93" width="78" height="6" rx="2" fill="url(#' + id + ')"/>' +
      '<ellipse cx="0" cy="-93" rx="26" ry="4" fill="#2a120a"/>' +
      '<ellipse cx="-6" cy="-94" rx="9" ry="3" fill="#e0662a"/><ellipse cx="8" cy="-94" rx="7" ry="2.6" fill="#f2a04a"/>' +
      '</g>';
  }

  function mabkhara(label) {
    var id = 'mb' + (++uid);
    return '<svg class="art" viewBox="0 0 240 300" ' + (label ? 'role="img" aria-label="' + label + '"' : 'aria-hidden="true"') + '><defs>' + metalGrad(id, 'gold') + '</defs>' +
      '<g transform="translate(0 40)">' + smoke('#f4ead8', .5) + '</g>' +
      '<ellipse cx="120" cy="272" rx="70" ry="7" fill="#000" opacity=".25"/>' +
      mabkharaG(id, 120, 272, 1.5) + '</svg>';
  }

  /* ---------- hero composition ---------- */
  function hero(P, label) {
    var id = 'h' + (++uid);
    var byId = {};
    P.forEach(function (p) { byId[p.id] = p; });
    var c = placed(byId['nokhatha'], 320, 438, 1.42, 'h-main');
    var l = placed(byId['dehn-malaki'], 160, 488, 1.02, 'h-left');
    var r = placed(byId['bakhoor-majlis'], 488, 494, .92, 'h-right');
    var defs = c.defs + l.defs + r.defs +
      '<linearGradient id="' + id + 'pl" x1="0" x2="1"><stop offset="0" stop-color="#b9a78a"/><stop offset=".42" stop-color="#efe6d6"/><stop offset="1" stop-color="#a8957a"/></linearGradient>' +
      '<radialGradient id="' + id + 'gl" cx=".5" cy=".55" r=".5"><stop offset="0" stop-color="#d9b46a" stop-opacity=".42"/><stop offset=".6" stop-color="#d9b46a" stop-opacity=".08"/><stop offset="1" stop-color="#d9b46a" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="' + id + 'ar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a1620"/><stop offset="1" stop-color="#140d0a"/></linearGradient>' +
      '<mask id="' + id + 'mo"><rect width="640" height="600" fill="#000"/><circle cx="472" cy="136" r="27" fill="#fff"/><circle cx="483" cy="128" r="24" fill="#000"/></mask>' +
      '<radialGradient id="' + id + 'fl" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#d9b46a" stop-opacity=".22"/><stop offset="1" stop-color="#d9b46a" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="' + id + 'ln" gradientUnits="userSpaceOnUse" x1="20" x2="620" y1="0" y2="0"><stop offset="0" stop-color="#c9a46a" stop-opacity="0"/><stop offset=".5" stop-color="#c9a46a" stop-opacity=".6"/><stop offset="1" stop-color="#c9a46a" stop-opacity="0"/></linearGradient>';
    var b = '';
    b += '<path d="M118 600V262C118 150 206 84 320 46C434 84 522 150 522 262V600Z" fill="url(#' + id + 'ar)"/>';
    b += '<ellipse cx="320" cy="360" rx="300" ry="260" fill="url(#' + id + 'gl)"/>';
    b += '<path d="M118 600V262C118 150 206 84 320 46C434 84 522 150 522 262V600" fill="none" stroke="#c9a46a" stroke-opacity=".55" stroke-width="1.2"/>';
    b += '<path d="M100 600V258C100 140 194 70 320 28C446 70 540 140 540 258V600" fill="none" stroke="#c9a46a" stroke-opacity=".22" stroke-width="1"/>';
    b += '<path d="M134 600V266C134 160 214 98 320 62C426 98 506 160 506 266V600" fill="none" stroke="#c9a46a" stroke-opacity=".18" stroke-width=".8" stroke-dasharray="2 5"/>';
    b += '<rect width="640" height="600" fill="#e2c48e" mask="url(#' + id + 'mo)" opacity=".95"/>';
    b += sparkle(212, 176, 6, '#e2c48e', 'tw t1') + sparkle(410, 96, 4, '#e2c48e', 'tw t2') + sparkle(250, 120, 3, '#e2c48e', 'tw t3') + sparkle(560, 212, 4, '#e2c48e', 'tw t2') + sparkle(86, 300, 3.4, '#e2c48e', 'tw t1');
    // floor glow
    b += '<ellipse cx="320" cy="566" rx="320" ry="44" fill="url(#' + id + 'fl)"/>';
    b += '<path d="M20 574C160 556 250 562 330 562C430 562 520 554 620 566" fill="none" stroke="url(#' + id + 'ln)" stroke-width="1"/>';
    b += '<path d="M70 590C190 576 260 580 340 580C430 580 500 574 600 584" fill="none" stroke="url(#' + id + 'ln)" stroke-opacity=".5" stroke-width="1"/>';
    // smoke from the right jar
    b += '<g transform="translate(368 300) scale(1.1)">' + smoke('#f4ead8', .42) + '</g>';
    // plinths
    b += '<g class="h-plinths">' + plinth(id + 'pl', 160, 488, 70, 560) + plinth(id + 'pl', 488, 494, 74, 560) + plinth(id + 'pl', 320, 438, 98, 566) + '</g>';
    b += l.body + r.body + c.body;
    // gold dust
    var dust = '';
    var rr = seeded('dust');
    for (var i = 0; i < 18; i++) {
      dust += '<circle class="dust d' + (i % 4) + '" cx="' + f(150 + rr() * 340) + '" cy="' + f(180 + rr() * 300) + '" r="' + f(.8 + rr() * 1.6) + '" fill="#f0d9a6" opacity="' + f(.35 + rr() * .5) + '"/>';
    }
    b += '<g class="dusts">' + dust + '</g>';
    return '<svg class="hero-art" viewBox="0 0 640 600" role="img" aria-label="' + label + '"><defs>' + defs + '</defs>' + b + '</svg>';
  }

  /* ---------- collection tile composition ---------- */
  function duo(P, ids, bgKey) {
    var id = 'd' + (++uid);
    var byId = {};
    P.forEach(function (p) { byId[p.id] = p; });
    var bg = BG[bgKey] || BG.sand;
    var dark = !!bg.dark;
    var single = ids.length === 1;
    var a = single ? placed(byId[ids[0]], 130, 280, .95, 'duo-a') : placed(byId[ids[0]], 92, 268, .78, 'duo-a');
    var b2 = single ? { defs: '', body: '' } : placed(byId[ids[1]], 172, 280, .9, 'duo-b');
    var smoky = byId[ids[0]].art.smoke || (!single && byId[ids[1]].art.smoke);
    var defs = a.defs + b2.defs + '<linearGradient id="' + id + 'pl" x1="0" x2="1"><stop offset="0" stop-color="#cfc0a6"/><stop offset=".45" stop-color="#f1e9dc"/><stop offset="1" stop-color="#c7b699"/></linearGradient>' +
      '<radialGradient id="' + id + 'gl" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="' + (dark ? '#c9a46a' : '#fff') + '" stop-opacity="' + (dark ? .3 : .7) + '"/><stop offset="1" stop-color="' + (dark ? '#c9a46a' : '#fff') + '" stop-opacity="0"/></radialGradient>';
    var body = '<ellipse cx="130" cy="200" rx="120" ry="110" fill="url(#' + id + 'gl)"/>' +
      '<path d="M40 300V150C40 92 80 56 130 38C180 56 220 92 220 150V300" fill="none" stroke="' + (dark ? '#c9a46a' : '#7a5a2b') + '" stroke-opacity="' + (dark ? .45 : .28) + '" stroke-width="1"/>' +
      (smoky ? '<g transform="translate(40 120) scale(.9)">' + smoke(dark ? '#f4ead8' : '#5a3d28', dark ? .4 : .2) + '</g>' : '') +
      (single ? plinth(id + 'pl', 130, 280, 94, 300) : plinth(id + 'pl', 92, 268, 56, 300) + plinth(id + 'pl', 172, 280, 62, 300)) + a.body + b2.body;
    return '<svg class="art duo" viewBox="0 0 260 300" aria-hidden="true" focusable="false"><defs>' + defs + '</defs>' + body + '</svg>';
  }

  /* ---------- the dhow (brand story) ---------- */
  function dhow(label) {
    var id = 'dh' + (++uid);
    var defs = '<linearGradient id="' + id + 'sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14100d"/><stop offset=".55" stop-color="#3b1520"/><stop offset="1" stop-color="#6e3a26"/></linearGradient>' +
      '<linearGradient id="' + id + 'sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1210"/><stop offset="1" stop-color="#0f0b09"/></linearGradient>' +
      '<clipPath id="' + id + 'cl"><path d="M20 560V200C20 104 110 42 240 14C370 42 460 104 460 200V560Z"/></clipPath>' +
      metalGrad(id + 'm', 'gold') +
      '<linearGradient id="' + id + 'sail" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6e7c4"/><stop offset="1" stop-color="#c9a46a"/></linearGradient>' +
      '<radialGradient id="' + id + 'sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#f2c06d" stop-opacity=".9"/><stop offset=".35" stop-color="#e08a3c" stop-opacity=".45"/><stop offset="1" stop-color="#e08a3c" stop-opacity="0"/></radialGradient>';
    var b = '<g clip-path="url(#' + id + 'cl)">' +
      '<rect width="480" height="560" fill="url(#' + id + 'sky)"/>' +
      '<circle cx="330" cy="352" r="150" fill="url(#' + id + 'sun)"/>' +
      '<circle cx="330" cy="352" r="34" fill="#f2c779" opacity=".95"/>' +
      sparkle(120, 120, 4, '#e2c48e', 'tw t1') + sparkle(360, 96, 3, '#e2c48e', 'tw t2') + sparkle(250, 70, 2.6, '#e2c48e', 'tw t3') + sparkle(80, 210, 2.4, '#e2c48e', 'tw t2') +
      '<rect y="368" width="480" height="200" fill="url(#' + id + 'sea)"/>' +
      '<path d="M296 380H364M282 398H378M304 416H356M316 434H344" stroke="#f2c779" stroke-opacity=".55" stroke-width="2" stroke-linecap="round"/>' +
      '<g class="waves" fill="none" stroke="#c9a46a" stroke-linecap="round">' +
      '<path d="M20 452C60 444 100 460 140 452S220 444 260 452S340 460 380 452S440 446 470 452" stroke-opacity=".35"/>' +
      '<path d="M20 486C60 478 100 494 140 486S220 478 260 486S340 494 380 486S440 480 470 486" stroke-opacity=".25"/>' +
      '<path d="M20 520C60 512 100 528 140 520S220 512 260 520S340 528 380 520S440 514 470 520" stroke-opacity=".15"/></g>' +
      // dhow
      '<g class="boat" transform="translate(70 214)">' +
      '<path d="M18 160L4 136L20 140C60 168 180 170 268 150L300 112L304 120L282 166C260 182 150 186 46 178Z" fill="#1a0f0b"/>' +
      '<path d="M22 150C70 166 170 168 270 150" fill="none" stroke="url(#' + id + 'm)" stroke-width="2.2"/>' +
      '<path d="M40 162C90 172 180 174 262 160" fill="none" stroke="#c9a46a" stroke-opacity=".5" stroke-width="1"/>' +
      '<path d="M128 156V20" stroke="#2a1a12" stroke-width="4"/>' +
      '<path d="M40 70L238 4" stroke="#2a1a12" stroke-width="3"/>' +
      '<path d="M44 72C110 54 180 30 234 8C224 66 200 120 150 148C120 150 82 150 60 146C70 120 64 96 44 72Z" fill="url(#' + id + 'sail)"/>' +
      '<path d="M90 64C120 80 140 110 146 146" fill="none" stroke="#7a5a2b" stroke-opacity=".35" stroke-width="1.2"/>' +
      '<path d="M150 40C170 70 176 104 170 140" fill="none" stroke="#7a5a2b" stroke-opacity=".3" stroke-width="1.2"/>' +
      '<path d="M210 140V60" stroke="#2a1a12" stroke-width="3"/><path d="M212 62L250 94L212 130Z" fill="url(#' + id + 'sail)" opacity=".92"/>' +
      '<path d="M128 20L140 26L128 30Z" fill="#7a1f30"/>' +
      '</g>' +
      '<g transform="translate(70 214)" opacity=".28"><path d="M46 192C150 200 250 196 282 180" stroke="#f2c779" stroke-width="2" fill="none"/></g>' +
      '</g>' +
      '<path d="M20 560V200C20 104 110 42 240 14C370 42 460 104 460 200V560" fill="none" stroke="#c9a46a" stroke-opacity=".6" stroke-width="1.4"/>' +
      '<path d="M6 560V196C6 96 100 30 240 0" fill="none" stroke="#c9a46a" stroke-opacity=".25"/>' +
      '<path d="M474 560V196C474 96 380 30 240 0" fill="none" stroke="#c9a46a" stroke-opacity=".25"/>';
    return '<svg class="art dhow" viewBox="0 0 480 560" role="img" aria-label="' + label + '"><defs>' + defs + '</defs>' + b + '</svg>';
  }

  /* ---------- small illustrations ---------- */
  function ritual(P, step, label) {
    var byId = {};
    P.forEach(function (p) { byId[p.id] = p; });
    var id = 'r' + (++uid);
    if (step === 3) return mabkhara(label);
    var pr = placed(byId[step === 1 ? 'dehn-malaki' : 'musk-ward'], 120, 272, step === 1 ? 1 : .86);
    var extra = '';
    if (step === 1) extra = '<path class="drip" d="M120 52C112 64 110 70 110 75A10 10 0 0 0 130 75C130 70 128 64 120 52Z" fill="#c98a3a" opacity=".85"/>';
    else {
      var rr = seeded('mist');
      for (var i = 0; i < 26; i++) extra += '<circle class="mist" cx="' + f(160 + rr() * 64) + '" cy="' + f(70 + rr() * 60) + '" r="' + f(.8 + rr() * 2.2) + '" fill="#f4ead8" opacity="' + f(.25 + rr() * .5) + '"/>';
    }
    return '<svg class="art" viewBox="0 0 240 300" role="img" aria-label="' + label + '"><defs>' + pr.defs + '</defs>' + extra + pr.body + '</svg>';
  }

  function empty(label, dark) {
    var id = 'e' + (++uid);
    return '<svg class="art empty-art" viewBox="0 0 240 300" ' + (label ? 'role="img" aria-label="' + label + '"' : 'aria-hidden="true"') + '><defs>' + vGrad(id + 'bg', '#f1e5cf', '#e3d2b4') +
      '<linearGradient id="' + id + 'pl" x1="0" x2="1"><stop offset="0" stop-color="#cfc0a6"/><stop offset=".45" stop-color="#f1e9dc"/><stop offset="1" stop-color="#c7b699"/></linearGradient></defs>' +
      '<path d="M24 300V136C24 74 66 38 120 20C174 38 216 74 216 136V300Z" fill="url(#' + id + 'bg)"/>' +
      '<path d="M34 300V140C34 84 72 52 120 34C168 52 206 84 206 140V300" fill="none" stroke="#8a6a3a" stroke-opacity=".3"/>' +
      '<g transform="translate(0 110)">' + smoke('#5a3d28', .25) + '</g>' +
      '<rect x="30" y="272" width="180" height="28" fill="url(#' + id + 'pl)"/><ellipse cx="120" cy="272" rx="90" ry="9" fill="#f6efe4"/>' +
      '<ellipse cx="120" cy="272" rx="90" ry="9" fill="none" stroke="#b9a685" stroke-opacity=".5" stroke-width=".8"/></svg>';
  }

  function giftArt(P, label) {
    var byId = {};
    P.forEach(function (p) { byId[p.id] = p; });
    var id = 'g' + (++uid);
    var bx = placed({ id: 'gift-band', art: { shape: 'box', glass: '#1a1512', ribbon: '#c9a46a' } }, 250, 300, 1.05);
    var bt = placed(byId['nokhatha'], 120, 300, .82);
    var at = placed(byId['dehn-malaki'], 372, 300, .62);
    return '<svg class="art gift-art" viewBox="0 0 480 330" role="img" aria-label="' + label + '"><defs>' + bx.defs + bt.defs + at.defs +
      '<radialGradient id="' + id + 'gl" cx=".5" cy=".6" r=".5"><stop offset="0" stop-color="#d9b46a" stop-opacity=".35"/><stop offset="1" stop-color="#d9b46a" stop-opacity="0"/></radialGradient></defs>' +
      '<ellipse cx="240" cy="220" rx="240" ry="150" fill="url(#' + id + 'gl)"/>' +
      sparkle(80, 80, 6, '#e2c48e', 'tw t1') + sparkle(420, 60, 4, '#e2c48e', 'tw t2') + sparkle(330, 120, 3, '#e2c48e', 'tw t3') +
      '<path d="M30 300H450" stroke="#c9a46a" stroke-opacity=".45"/>' +
      bt.body + at.body + bx.body + '</svg>';
  }

  function confirmArt(P, label) {
    var byId = {};
    P.forEach(function (p) { byId[p.id] = p; });
    var id = 'c' + (++uid);
    var bx = placed({ id: 'confirm-box', art: { shape: 'box', glass: '#e7c3b8', ribbon: '#b8925a' } }, 120, 268, .92);
    return '<svg class="art confirm-art" viewBox="0 0 240 300" role="img" aria-label="' + label + '"><defs>' + bx.defs + vGrad(id + 'bg', '#4d1b27', '#1f080e') + metalGrad(id + 'm', 'gold') + '</defs>' +
      '<path d="M24 300V136C24 74 66 38 120 20C174 38 216 74 216 136V300Z" fill="url(#' + id + 'bg)"/>' +
      '<path d="M34 300V140C34 84 72 52 120 34C168 52 206 84 206 140V300" fill="none" stroke="#c9a46a" stroke-opacity=".5"/>' +
      sparkle(64, 100, 5, '#e2c48e', 'tw t1') + sparkle(178, 84, 4, '#e2c48e', 'tw t2') + sparkle(186, 150, 3, '#e2c48e', 'tw t3') + sparkle(52, 170, 2.6, '#e2c48e', 'tw t2') +
      bx.body +
      '<g class="seal"><circle cx="120" cy="82" r="24" fill="url(#' + id + 'm)"/><circle cx="120" cy="82" r="19" fill="none" stroke="#5a3d1a" stroke-opacity=".5"/>' +
      '<path d="M110 82L117 89L131 75" fill="none" stroke="#2a1a10" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></g></svg>';
  }

  window.SADEEM_ART = {
    scene: scene, hero: hero, duo: duo, dhow: dhow, ritual: ritual, empty: empty,
    gift: giftArt, confirm: confirmArt, logo: logo, mabkhara: mabkhara, sadu: sadu
  };
})();
