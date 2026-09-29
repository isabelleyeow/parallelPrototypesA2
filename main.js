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
