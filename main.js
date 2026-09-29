(function () {
  'use strict';
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const wrap = (h) => ((h % 24) + 24) % 24;
  const setHTML = (el, html) => {
    if (el._h !== html) { el.innerHTML = html; el._h = html; }
  };

  const throttle = (ms, fn) => {
    let last = 0;
    return (...args) => {
      const now = performance.now();
      if (now - last >= ms) { last = now; fn(...args); }
    };
  };
// time with the help of a lot of mdn and a bit of claude to refine and double check my code whenever it wasn't working
const params = new URLSearchParams(location.search);
  const forcedHour = params.has('hour') ? parseFloat(params.get('hour')) : null;
  const isPreview = forcedHour !== null && !Number.isNaN(forcedHour);
  const loadedAt = performance.now();
  const hasTemporal = typeof window.Temporal !== 'undefined' && !!window.Temporal.Now;
  // current time of day but in a different conversion 
  function nowHours() {
    if (isPreview) return wrap(forcedHour + (performance.now() - loadedAt) / 3600000);
    if (hasTemporal) {
      const t = Temporal.Now.plainTimeISO();
      return t.hour + t.minute / 60 + t.second / 3600;
    }
    const d = new Date();
    return d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600;
  }
function formatClock(hf) {
    const h = wrap(hf);
    const hr = Math.floor(h);
    const min = Math.floor((h - hr) * 60);
    const h12 = hr % 12 === 0 ? 12 : hr % 12;
    return `${h12}:${String(min).padStart(2, '0')} ${hr < 12 ? 'am' : 'pm'}`;
  }

