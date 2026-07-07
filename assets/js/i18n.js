/**
 * i18n loader (vanilla JS, ~60 lines)
 * ------------------------------------------------------------------
 * Reads /locales/<lang>.json and fills elements marked with:
 *   - data-i18n="key.path"            → sets textContent
 *   - data-i18n-attr="attr:key.path"  → sets an attribute (aria-label, placeholder, ...)
 *   - data-i18n-list="key.path"       → repeats innerHTML template for array items
 *
 * Interpolation: {{var}} inside a string is replaced from data-i18n-vars.
 * Fallback: pt-BR → pt → en. Choice is persisted in localStorage.
 */
(function () {
  'use strict';

  var SUPPORTED = ['en', 'pt'];
  var DEFAULT_LANG = 'en';

  function detectLang() {
    var stored = null;
    try { stored = localStorage.getItem('lang'); } catch (e) {}
    if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;
    var nav = (navigator.language || '').toLowerCase();
    if (nav.indexOf('pt') === 0) return 'pt';
    return DEFAULT_LANG;
  }

  function getByPath(obj, path) {
    return path.split('.').reduce(function (o, k) {
      return o == null ? undefined : o[k];
    }, obj);
  }

  function interpolate(str, vars) {
    if (typeof str !== 'string' || !vars) return str;
    return str.replace(/\{\{(\w+)\}\}/g, function (_, k) {
      return vars[k] != null ? vars[k] : '';
    });
  }

  function parseVars(el) {
    var raw = el.getAttribute('data-i18n-vars');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  function applyTranslations(dict) {
    // textContent
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var val = getByPath(dict, key);
      if (typeof val === 'string') el.textContent = interpolate(val, parseVars(el));
    });

    // attributes (one or more, comma-separated: "aria-label:key.path,placeholder:other.key")
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      var vars = parseVars(el);
      el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
        var parts = pair.split(':');
        if (parts.length < 2) return;
        var attr = parts[0].trim();
        var key = parts.slice(1).join(':').trim();
        var val = getByPath(dict, key);
        if (typeof val === 'string') el.setAttribute(attr, interpolate(val, vars));
      });
    });

    // arrays (list items) — template = first child element, cloned per item
    document.querySelectorAll('[data-i18n-list]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-list');
      var arr = getByPath(dict, key);
      if (!Array.isArray(arr)) return;
      var template = el.querySelector('[data-i18n-list-template]');
      if (!template) return;
      arr.forEach(function (item) {
        var clone = template.cloneNode(true);
        clone.removeAttribute('data-i18n-list-template');
        clone.style.display = '';
        if (typeof item === 'string') {
          clone.textContent = item;
        } else {
          clone.querySelectorAll('[data-i18n-list-item]').forEach(function (slot) {
            var itemKey = slot.getAttribute('data-i18n-list-item');
            var itemVal = getByPath(item, itemKey);
            if (typeof itemVal === 'string') slot.textContent = itemVal;
          });
        }
        el.appendChild(clone);
      });
      template.style.display = 'none';
    });
  }

  // Updates the active state of language switcher buttons.
  function updateLangButtons(lang) {
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      var isActive = btn.getAttribute('data-lang') === lang;
      // Active: teal pill; inactive: muted, hover-highlight.
      btn.className = 'lang-btn px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ' +
        (isActive
          ? 'bg-[#81D8D0] text-black'
          : 'text-white/50 hover:text-white hover:bg-white/10');
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  // Public API
  window.I18N = {
    current: detectLang(),
    setLang: function (lang) {
      if (SUPPORTED.indexOf(lang) === -1) lang = DEFAULT_LANG;
      window.I18N.current = lang;
      try { localStorage.setItem('lang', lang); } catch (e) {}
      document.documentElement.lang = lang;
      updateLangButtons(lang);
      fetch('/locales/' + lang + '.json')
        .then(function (r) { return r.json(); })
        .then(applyTranslations)
        .catch(function (err) { console.error('[i18n] failed to load', lang, err); });
    },
    init: function () {
      window.I18N.setLang(window.I18N.current);
      // Wire up the switcher buttons.
      document.querySelectorAll('.lang-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          window.I18N.setLang(btn.getAttribute('data-lang'));
        });
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.I18N.init);
  } else {
    window.I18N.init();
  }
})();
