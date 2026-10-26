/*! Accessibility widget: drop in with <script src="a11y-widget.js" defer></script> */
(function () {
  if (document.getElementById('a11y-root')) return;

  var KEY = 'a11y-prefs';
  var SIZES = [100, 112, 125, 150, 175]; // % of base font size
  var TOGGLES = [
    ['links', 'Highlight links'],
    ['font', 'Readable font'],
    ['spacing', 'Wider text spacing'],
    ['contrast', 'High contrast'],
    ['gray', 'Grayscale'],
    ['still', 'Pause animations']
  ];

  var state = { size: 0 };
  TOGGLES.forEach(function (t) { state[t[0]] = false; });
  try {
    var saved = JSON.parse(localStorage.getItem(KEY) || '{}');
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
      TOGGLES.forEach(function (t) {
        if (typeof saved[t[0]] === 'boolean') state[t[0]] = saved[t[0]];
      });
    }
  } catch (e) {}

  /* ---------- styles ---------- */
  var page = 'body > *:not(#a11y-root)';
  var css = [
    /* effects on the page (the widget itself is never affected) */
    'html.a11y-links a{background:#ff0!important;color:#000!important;text-decoration:underline!important}',
    'html.a11y-font ' + page + ',html.a11y-font ' + page + ' *{font-family:Verdana,Arial,sans-serif!important}',
    'html.a11y-spacing ' + page + ',html.a11y-spacing ' + page + ' *{line-height:1.8!important;letter-spacing:.04em!important;word-spacing:.12em!important}',
    'html.a11y-contrast ' + page + '{filter:contrast(1.5)}',
    'html.a11y-gray ' + page + '{filter:grayscale(1)}',
    'html.a11y-gray.a11y-contrast ' + page + '{filter:grayscale(1) contrast(1.5)}',
    'html.a11y-still body *{animation:none!important;transition:none!important;scroll-behavior:auto!important}',

    /* widget UI */
    '#a11y-root{position:fixed;right:16px;bottom:16px;z-index:2147483647;font:16px/1.4 system-ui,Arial,sans-serif;color:#1b2333}',
    '#a11y-root *{box-sizing:border-box;font-family:inherit}',
    '#a11y-open{width:52px;height:52px;border-radius:50%;border:2px solid #fff;background:#70c21f;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.3)}',
    '#a11y-panel{position:absolute;right:0;bottom:64px;width:min(320px,calc(100vw - 32px));max-height:calc(100vh - 100px);overflow:auto;background:#fff;border:2px solid #1b2333;border-radius:10px;padding:14px}',
    '#a11y-panel[hidden]{display:none}',
    '#a11y-panel h2{margin:0 0 10px;font-size:1.05rem}',
    '#a11y-root button:focus-visible{outline:3px solid #f59e0b;outline-offset:2px}',
    '.a11y-row{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}',
    '.a11y-btn{display:flex;width:100%;align-items:center;justify-content:space-between;gap:8px;padding:10px 12px;margin-bottom:6px;border:1.5px solid #1b2333;border-radius:8px;background:#fff;color:#1b2333;font-size:.95rem;cursor:pointer;text-align:left}',
    '.a11y-btn[aria-pressed="true"]{background:#1b2333;color:#fff}',
    '.a11y-step{width:44px;height:44px;border:1.5px solid #1b2333;border-radius:8px;background:#fff;color:#1b2333;font-size:1rem;font-weight:700;cursor:pointer}',
    '.a11y-step:disabled{opacity:.4;cursor:not-allowed}',
    '#a11y-reset{margin-top:4px;background:#f1f3f7}'
  ].join('\n');
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- helpers ---------- */
  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    for (var k in (attrs || {})) n.setAttribute(k, attrs[k]);
    if (text) n.textContent = text;
    return n;
  }

  /* ---------- markup ---------- */
  var root = el('div', { id: 'a11y-root' });

  var openBtn = el('button', {
    id: 'a11y-open', type: 'button',
    'aria-label': 'Accessibility options',
    'aria-expanded': 'false', 'aria-controls': 'a11y-panel'
  });
  openBtn.innerHTML =
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">' +
    '<circle cx="12" cy="4.5" r="2.2"/><path d="M4 8.5l8 1.5 8-1.5v2l-5.5 1.2v3.3l1.7 6h-2.2L12 15.4 10 20.5H7.8l1.7-6v-3.3L4 10.5z"/></svg>';

  var panel = el('div', { id: 'a11y-panel', role: 'dialog', 'aria-labelledby': 'a11y-title', hidden: '' });
  panel.appendChild(el('h2', { id: 'a11y-title' }, 'Accessibility options'));

  // text size row
  var sizeRow = el('div', { class: 'a11y-row' });
  var minus = el('button', { type: 'button', class: 'a11y-step', 'aria-label': 'Decrease text size' }, 'A\u2212');
  var plus = el('button', { type: 'button', class: 'a11y-step', 'aria-label': 'Increase text size' }, 'A+');
  var sizeLabel = el('span', { 'aria-live': 'polite' });
  sizeRow.append(minus, sizeLabel, plus);
  panel.appendChild(sizeRow);

  // toggle buttons
  var toggleBtns = {};
  TOGGLES.forEach(function (t) {
    var b = el('button', { type: 'button', class: 'a11y-btn', 'aria-pressed': 'false' });
    b.append(el('span', {}, t[1]), el('span', { 'data-state': '' }));
    b.addEventListener('click', function () { state[t[0]] = !state[t[0]]; update(); });
    toggleBtns[t[0]] = b;
    panel.appendChild(b);
  });

  var reset = el('button', { type: 'button', class: 'a11y-btn', id: 'a11y-reset' }, 'Reset all');
  panel.appendChild(reset);

  root.append(panel, openBtn);
  document.body.appendChild(root);

  /* ---------- behaviour ---------- */
  function update() {
    var html = document.documentElement;
    html.style.fontSize = SIZES[state.size] === 100 ? '' : SIZES[state.size] + '%';
    sizeLabel.textContent = 'Text size ' + SIZES[state.size] + '%';
    minus.disabled = state.size === 0;
    plus.disabled = state.size === SIZES.length - 1;
    TOGGLES.forEach(function (t) {
      var on = !!state[t[0]];
      html.classList.toggle('a11y-' + t[0], on);
      toggleBtns[t[0]].setAttribute('aria-pressed', on);
      toggleBtns[t[0]].lastChild.textContent = on ? 'On' : 'Off';
    });
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }

  function setOpen(open) {
    panel.hidden = !open;
    openBtn.setAttribute('aria-expanded', open);
    if (open) minus.focus(); else openBtn.focus();
  }

  minus.addEventListener('click', function () { if (state.size > 0) { state.size--; update(); } });
  plus.addEventListener('click', function () { if (state.size < SIZES.length - 1) { state.size++; update(); } });
  reset.addEventListener('click', function () {
    state.size = 0;
    TOGGLES.forEach(function (t) { state[t[0]] = false; });
    update();
  });
  openBtn.addEventListener('click', function () { setOpen(panel.hidden); });
  root.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !panel.hidden) setOpen(false);
  });

  update();
})();
