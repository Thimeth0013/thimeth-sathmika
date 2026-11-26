// The time of day, before the first paint. Vite inlines this file into each page's <head> (the
// `sky-boot` plugin in vite.config.js, at the `<!-- sky-boot -->` marker), so it is a plain script, no imports.
// The sky drifts through the day: each phase (morning, noon, evening, night) holds for a while and then
// blends into the next (KEYS), so the page at 9:15 is partly morning, partly noon. The blend is a weight
// per phase; from it this sets, on <html>:
//   --sky / --sky-m   the hero and About sky (phones: --sky-m), one gradient
//   --footer-sky / --footer-haze   the footer's sky and the colour under its meadow
//   --w-night     how much night there is (the stars, the moon)
//   --fog / data-fog   the meadow's fog: morning and night only
//   --glow        the hero computer's screen glow (none at noon, most at night)
//   --cloud-grade / --ground-grade / --cloud-alpha   the photo layers' grades
//   data-sky      the main phase (the loader, the stage colour, the browser bar, the Enderman's "next")
//   data-daypart  the main phase on the visitor's clock
//   data-theme    dark if the page opens at night (DARK_AT of it), else light; decided once, so the white sections
//                 never flip while someone is reading
// Two phases' skies are mixed stop by stop in OKLCH, the hue going round the warm side of the wheel
// (through violet, pink and orange, never green): cross-fading them averaged blue and amber to grey.
// ?time=morning|noon|evening|night shows one phase (for testing); a phase picked with the Enderman this
// visit (sessionStorage `sky`) wins over the clock. window.__sky is for src/lib/theme.js, which picks
// phases (easing to them) and re-blends every minute.
(function () {
  var root = document.documentElement;
  var PHASES = ['morning', 'noon', 'evening', 'night'];
  // [hour, phase]: a phase holds between its two keys and blends into the next phase between keys.
  // Set for Sri Lanka (sunrise about 6:00, sunset about 6:10, dark by 7): dawn 5:00–6:30, morning until
  // 8:00, into noon by 9:30, noon until 14:30, golden by 16:00, then dusk all the way to night at 19:00.
  var KEYS = [[5, 'night'], [6.5, 'morning'], [8, 'morning'], [9.5, 'noon'], [14.5, 'noon'], [16, 'evening'], [19, 'night']];
  // The skies, as [position %, colour] stops. SKY: the hero and About (noon is the original photo's);
  // SKY_M: phones, where the headline sits lower, so the warm band does too; FOOT: the footer, deep
  // most of the way down so its white text reads; HAZE: the colour under the footer's meadow.
  var SKY = {
    morning: [[0, '#3C77B8'], [16, '#4E86C4'], [32, '#6A9BD2'], [45, '#8FB2DD'], [54, '#B6C6DE'], [61, '#DCCBD0'], [67, '#F2CDBE'], [75, '#FBDCC3'], [88, '#FFEBD6'], [100, '#FFF6EC']],
    noon: [[0, '#1B6AAE'], [10, '#2270B3'], [20, '#2A77BB'], [30, '#3480C4'], [40, '#4089CD'], [50, '#5197D9'], [60, '#68A6E5'], [70, '#89BAF4'], [80, '#B3D3FD'], [90, '#E9F1FE'], [100, '#FFFFFF']],
    evening: [[0, '#2A3A6E'], [12, '#3E4C80'], [24, '#66639A'], [34, '#A07F96'], [42, '#D69B7E'], [50, '#F1B467'], [57, '#FAC85A'], [66, '#FDD872'], [80, '#FFE69E'], [100, '#FFF1C8']],
    night: [[0, '#060C1D'], [25, '#0A1530'], [45, '#0F1E44'], [58, '#18295A'], [70, '#24366A'], [85, '#33477C'], [100, '#3E5287']],
  };
  var SKY_M = {
    morning: [[0, '#3C77B8'], [20, '#4E86C4'], [40, '#6A9BD2'], [55, '#86AEDB'], [64, '#A6BEDD'], [72, '#D2C8D2'], [80, '#F0CDBE'], [88, '#FBDCC3'], [100, '#FFEBD6']],
    noon: [[0, '#0156D2'], [10, '#015AD7'], [20, '#035FDB'], [30, '#0564E3'], [40, '#096BE9'], [50, '#1174F0'], [60, '#1D81F8'], [70, '#3395FD'], [80, '#44A4FD'], [90, '#4DACFF'], [100, '#58B5FF']],
    evening: [[0, '#2A3A6E'], [18, '#3E4C80'], [36, '#55598F'], [50, '#77699A'], [60, '#9C7A96'], [68, '#C99080'], [76, '#EDAE68'], [84, '#F9C65A'], [92, '#FDD872'], [100, '#FFE69E']],
    night: SKY.night,
  };
  var FOOT = {
    morning: [[0, '#3A73BE'], [24, '#4A82C8'], [48, '#6393D2'], [70, '#8AA9DA'], [86, '#B4BCD8'], [96, '#EBCCC2'], [100, '#FBE3D2']],
    noon: [[0, '#2F78CC'], [24, '#3E86DC'], [48, '#5594E3'], [70, '#6EA8EB'], [86, '#8EBDF2'], [96, '#C8E0FB'], [100, '#EEF6FF']],
    evening: [[0, '#2A3D75'], [24, '#41508A'], [46, '#6B6A98'], [64, '#A98A92'], [80, '#DDA877'], [93, '#F6C56A'], [100, '#FDDB8E']],
    night: [[0, '#060C1D'], [30, '#0A1530'], [58, '#112048'], [80, '#1D2F62'], [93, '#33477C'], [100, '#4A5C8C']],
  };
  // Grades: [brightness, sepia, hue-rotate (deg), saturate], mixed by the weights. Night's clouds turn
  // the long way round (-175, not 185), through dusky purples rather than greens.
  var CLOUD = { morning: [1.02, 0.2, -12, 1.3], noon: [1, 0, 0, 1], evening: [1, 0.6, -8, 1.6], night: [0.5, 0.5, -175, 1.8] };
  var GROUND = { morning: [0.98, 0, 6, 0.86], noon: [1, 0, 0, 1], evening: [0.88, 0.3, -4, 1.2], night: [0.36, 0, -14, 0.7] };
  var GLOW = { morning: 0.35, noon: 0, evening: 0.65, night: 1 }; // the hero computer's screen glow
  var DARK_AT = 0.75; // how much night opens the page in the dark theme
  var FOG_NIGHT = 0.6; // the meadow's fog: full in the morning, this at night, none at noon or in the evening
  var BAR = { morning: '#4A80BF', noon: '#2F7CC4', evening: '#2E3D72', night: '#0C1321' };

  // --- Colour: hex <-> OKLCH (Björn Ottosson's OKLab). ---
  function lin(c) {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }
  function gam(c) {
    c = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    return Math.round(Math.min(1, Math.max(0, c)) * 255);
  }
  function toLch(hex) {
    var r = lin(parseInt(hex.slice(1, 3), 16));
    var g = lin(parseInt(hex.slice(3, 5), 16));
    var b = lin(parseInt(hex.slice(5, 7), 16));
    var l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    var m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    var s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    var L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
    var A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
    var B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
    return [L, Math.sqrt(A * A + B * B), ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360];
  }
  function toHex(lch) {
    var A = lch[1] * Math.cos((lch[2] * Math.PI) / 180);
    var B = lch[1] * Math.sin((lch[2] * Math.PI) / 180);
    var l = Math.pow(lch[0] + 0.3963377774 * A + 0.2158037573 * B, 3);
    var m = Math.pow(lch[0] - 0.1055613458 * A - 0.0638541728 * B, 3);
    var s = Math.pow(lch[0] - 0.0894841775 * A - 1.291485548 * B, 3);
    var rgb = [
      gam(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
      gam(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
      gam(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
    ];
    return '#' + rgb.map(function (v) { return (v < 16 ? '0' : '') + v.toString(16); }).join('');
  }
  // The way round the hue wheel from h1 to h2 that avoids the greens (about 100°–190°).
  function hueTo(h1, h2) {
    var up = (h2 - h1 + 360) % 360; // going up (counter-clockwise)
    var down = up - 360; // going down
    function green(d) {
      for (var i = 1; i < 10; i++) {
        var h = (h1 + (d * i) / 10 + 360) % 360;
        if (h > 100 && h < 190) return true;
      }
      return false;
    }
    var short = Math.abs(down) < up ? down : up;
    var long = short === up ? down : up;
    return green(short) && !green(long) ? long : short;
  }
  function mixHex(c1, c2, t) {
    if (t <= 0) return c1;
    if (t >= 1) return c2;
    var a = toLch(c1);
    var b = toLch(c2);
    // A near-grey colour has no hue to speak of: take the other's.
    if (a[1] < 0.02) a[2] = b[2];
    if (b[1] < 0.02) b[2] = a[2];
    return toHex([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, (a[2] + hueTo(a[2], b[2]) * t + 360) % 360]);
  }
  // A gradient's colour at a position (linear between its stops, in sRGB; the stops are close).
  function at(stops, pos) {
    for (var i = 1; i < stops.length; i++) {
      if (pos <= stops[i][0]) {
        var f = (pos - stops[i - 1][0]) / (stops[i][0] - stops[i - 1][0]);
        var c1 = stops[i - 1][1];
        var c2 = stops[i][1];
        var out = '#';
        for (var k = 1; k < 7; k += 2) {
          var v = Math.round(parseInt(c1.slice(k, k + 2), 16) * (1 - f) + parseInt(c2.slice(k, k + 2), 16) * f);
          out += (v < 16 ? '0' : '') + v.toString(16);
        }
        return out;
      }
    }
    return stops[stops.length - 1][1];
  }
  // A change from one phase to the next is a soft-edged front crossing the sky, like a real one: the
  // warm light of evening and of dawn rises from the horizon (UP: noon → evening, night → morning), and
  // night, and noon's high blue, come down from the top (evening → night, morning → noon). EDGE is how
  // soft the front is, in % of the sky's height; colours are mixed only inside it.
  var UP = { evening: true, morning: true };
  var EDGE = 45;
  function front(next, t, pos) {
    var u = UP[next] ? (pos - (100 - t * (100 + EDGE))) / EDGE : (t * (100 + EDGE) - pos) / EDGE;
    u = Math.min(1, Math.max(0, u));
    return u * u * (3 - 2 * u);
  }
  // The colour at a position of the phases' gradients mixed by the weights: between a phase and the
  // next, the front; otherwise (three for a moment while easing to a picked phase) folded in one phase
  // at a time.
  function colour(set, w, pos) {
    var on = PHASES.filter(function (p) { return w[p] > 0.0005; });
    if (on.length === 2) {
      var first = PHASES.indexOf(on[0]);
      var second = PHASES.indexOf(on[1]);
      // on[] is in PHASES order, so the later one is "next", unless it is night → morning.
      var from = (first + 1) % 4 === second ? on[0] : on[1];
      var to = from === on[0] ? on[1] : on[0];
      if ((PHASES.indexOf(from) + 1) % 4 === PHASES.indexOf(to)) return mixHex(at(set[from], pos), at(set[to], pos), front(to, w[to], pos));
    }
    var out = null;
    var sum = 0;
    for (var i = 0; i < PHASES.length; i++) {
      var p = PHASES[i];
      if (w[p] <= 0.0005) continue;
      sum += w[p];
      var c = at(set[p], pos);
      out = out === null ? c : mixHex(out, c, w[p] / sum);
    }
    return out || at(set.noon, pos);
  }
  // The mixed gradient, sampled every 5%.
  function gradient(set, w, dir) {
    var parts = [];
    for (var pos = 0; pos <= 100; pos += 5) parts.push(colour(set, w, pos) + ' ' + pos + '%');
    return 'linear-gradient(' + (dir ? dir + ', ' : '') + parts.join(', ') + ')';
  }

  // --- The blend. ---
  function oneHot(phase) {
    var w = { morning: 0, noon: 0, evening: 0, night: 0 };
    w[phase] = 1;
    return w;
  }
  // The weights for an hour of the day (0–24, fractional).
  function blend(hour) {
    for (var i = 0; i < KEYS.length; i++) {
      var a = KEYS[i];
      var b = KEYS[(i + 1) % KEYS.length];
      var h0 = a[0];
      var h1 = b[0] + (b[0] <= h0 ? 24 : 0);
      var h = hour < h0 ? hour + 24 : hour;
      if (h >= h0 && h < h1) {
        var t = (h - h0) / (h1 - h0);
        t = t * t * (3 - 2 * t);
        var w = oneHot(a[1]);
        w[a[1]] = 1 - t;
        w[b[1]] += t;
        return w;
      }
    }
    return oneHot('noon');
  }
  function main(w) {
    var best = 'noon';
    for (var i = 0; i < PHASES.length; i++) if (w[PHASES[i]] > w[best]) best = PHASES[i];
    return best;
  }
  function grade(table, w) {
    var v = [0, 0, 0, 0];
    for (var i = 0; i < PHASES.length; i++) for (var k = 0; k < 4; k++) v[k] += w[PHASES[i]] * table[PHASES[i]][k];
    // No change at all (noon): no filter, which costs nothing (an identity filter still costs).
    if (Math.abs(v[0] - 1) < 0.002 && v[1] < 0.002 && Math.abs(v[2]) < 0.2 && Math.abs(v[3] - 1) < 0.002) return 'none';
    return 'brightness(' + v[0].toFixed(3) + ') sepia(' + v[1].toFixed(3) + ') hue-rotate(' + v[2].toFixed(1) + 'deg) saturate(' + v[3].toFixed(3) + ')';
  }
  // What a blend looks like.
  function look(w) {
    var fog = w.morning + FOG_NIGHT * w.night;
    return {
      sky: gradient(SKY, w),
      skyM: gradient(SKY_M, w),
      foot: gradient(FOOT, w, 'to bottom'),
      haze: colour(FOOT, w, 100),
      night: w.night.toFixed(3),
      fog: fog.toFixed(3),
      fogOn: fog > 0.01,
      glow: (w.morning * GLOW.morning + w.evening * GLOW.evening + w.night * GLOW.night).toFixed(3),
      cloud: grade(CLOUD, w),
      ground: grade(GROUND, w),
      alpha: (1 - 0.45 * w.night).toFixed(3),
      main: main(w),
    };
  }
  function marks(v) {
    if (root.dataset.sky !== v.main) root.dataset.sky = v.main;
    var fog = v.fogOn ? 'on' : 'off';
    if (root.dataset.fog !== fog) root.dataset.fog = fog;
    var bar = document.querySelector('meta[name="theme-color"]');
    if (bar && bar.hasAttribute('data-sky-bar') && bar.getAttribute('content') !== BAR[v.main]) bar.setAttribute('content', BAR[v.main]);
  }
  // At startup (in <head>, before the page's content exists, so it costs nothing): the values as
  // variables on <html>, which everything reads.
  function boot(v) {
    var s = root.style;
    s.setProperty('--sky', v.sky);
    s.setProperty('--sky-m', v.skyM);
    s.setProperty('--footer-sky', v.foot);
    s.setProperty('--footer-haze', v.haze);
    s.setProperty('--w-night', v.night);
    s.setProperty('--fog', v.fog);
    s.setProperty('--glow', v.glow);
    s.setProperty('--cloud-grade', v.cloud);
    s.setProperty('--ground-grade', v.ground);
    s.setProperty('--cloud-alpha', v.alpha);
    marks(v);
  }
  // Later (the clock, the Enderman): never <html>'s variables again (changing one restyled the whole
  // page, ~30 ms on a laptop and far more on a phone, every frame of an ease). Each sky (.sky-paint) gets
  // a new layer, a copy of its first, with the new gradients as its own variables, which fades in over
  // the old one (opacity only, which the GPU does) and then replaces it; the grades, the stars, the moon
  // and the fog are written straight onto their few elements, which have their own transitions.
  function paint(v, ms) {
    var hosts = document.querySelectorAll('.sky-paint');
    for (var i = 0; i < hosts.length; i++) {
      var host = hosts[i];
      var layer = host.firstElementChild.cloneNode(false);
      var st = layer.style;
      st.setProperty('--sky', v.sky);
      st.setProperty('--sky-m', v.skyM);
      st.setProperty('--footer-sky', v.foot);
      st.setProperty('--footer-haze', v.haze);
      st.opacity = '0';
      st.transition = 'opacity ' + ms + 'ms ease';
      host.appendChild(layer);
      (function (host, layer) {
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            layer.style.opacity = '1';
          });
        });
        setTimeout(function () {
          // Faded in: the layers under it can go.
          while (host.firstElementChild && host.firstElementChild !== layer && host.contains(layer)) host.removeChild(host.firstElementChild);
        }, ms + 100);
      })(host, layer);
    }
    var set = function (selector, prop, value) {
      var els = document.querySelectorAll(selector);
      for (var j = 0; j < els.length; j++) els[j].style[prop] = value;
    };
    set('.grade-clouds', 'opacity', v.alpha);
    set('.grade-clouds img', 'filter', v.cloud);
    set('img.grade-ground, .grade-ground > *', 'filter', v.ground);
    set('.stars, .night-only', 'opacity', v.night);
    set('.meadow-fog', 'opacity', v.fog);
    set('.screen-glow', 'opacity', v.glow);
    marks(v);
  }
  function now() {
    var d = new Date();
    return d.getHours() + d.getMinutes() / 60;
  }

  var forced = (location.search.match(/[?&]time=(morning|noon|evening|night)\b/) || [])[1];
  var picked = null;
  try {
    picked = sessionStorage.getItem('sky');
  } catch {
    picked = null; // storage unavailable: the clock decides
  }
  if (forced || !/^(morning|noon|evening|night)$/.test(picked || '')) picked = null;
  var fixed = forced || picked;
  var current = fixed ? oneHot(fixed) : blend(now());
  root.dataset.daypart = main(blend(now()));
  boot(look(current));
  // Dark sections only once night is mostly in (about 18:15), not as soon as it leads the long dusk.
  root.dataset.theme = fixed ? (fixed === 'night' ? 'dark' : 'light') : current.night >= DARK_AT ? 'dark' : 'light';
  var bar = document.querySelector('meta[name="theme-color"]');
  if (bar && !bar.hasAttribute('data-sky-bar')) bar.setAttribute('content', bar.getAttribute('data-' + root.dataset.theme));
  window.__sky = {
    PHASES: PHASES,
    blend: blend,
    oneHot: oneHot,
    now: now,
    fixed: !!fixed,
    current: function () { return current; },
    // Show weights w, fading there over ms. A big change (a pick: one phase to the next) goes in a few
    // steps, so the front still seems to cross the sky; a small one (the minute clock) in one.
    apply: function (w, ms) {
      var from = current;
      var far = 0;
      for (var i = 0; i < PHASES.length; i++) far = Math.max(far, Math.abs(w[PHASES[i]] - from[PHASES[i]]));
      if (far < 0.002) return; // nothing visible to change (a phase holding: most of the day)
      current = w;
      var steps = far > 0.25 ? 3 : 1;
      var each = (ms || 400) / steps;
      var n = 0;
      var step = function () {
        if (current !== w) return; // something newer took over
        n += 1;
        var k = n / steps;
        var mix = {};
        for (var p = 0; p < PHASES.length; p++) mix[PHASES[p]] = from[PHASES[p]] * (1 - k) + w[PHASES[p]] * k;
        paint(look(mix), each);
        if (n < steps) setTimeout(step, each);
      };
      step();
    },
  };
})();
