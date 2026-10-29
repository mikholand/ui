/* mikholand UI — поведение компонентов. Без зависимостей.
   Модуль ничего не делает при импорте и не обращается к window до вызова функций,
   поэтому его безопасно импортировать при SSR. */

var CHEVRON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
var uid = 0;
function nextId(prefix) { uid += 1; return prefix + "-" + uid; }
function reduced() { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
function on(el, type, fn, opts) { el.addEventListener(type, fn, opts); return function () { el.removeEventListener(type, fn, opts); }; }

/* Двигает индикатор (absolute) под целевой элемент внутри контейнера. */
function placeIndicator(container, indicator, target, vertical) {
  if (!target) { indicator.style.width = "0px"; return; }
  var x = target.offsetLeft;
  var y = target.offsetTop;
  if (vertical) {
    indicator.style.height = target.offsetHeight + "px";
    indicator.style.width = target.offsetWidth + "px";
    indicator.style.transform = "translate(" + x + "px," + y + "px)";
  } else {
    indicator.style.width = target.offsetWidth + "px";
    indicator.style.transform = "translateX(" + x + "px)";
  }
}

function observeResize(el, fn) {
  if (typeof ResizeObserver === "undefined") return on(window, "resize", fn);
  var ro = new ResizeObserver(function () { fn(); });
  ro.observe(el);
  return function () { ro.disconnect(); };
}

/* ---------- Segmented ---------- */
function segmented(root, options) {
  options = options || {};
  var buttons = Array.prototype.slice.call(root.querySelectorAll("button"));
  if (!root.getAttribute("role")) root.setAttribute("role", "radiogroup");
  var indicator = root.querySelector(".mk-segmented__indicator");
  if (!indicator) {
    indicator = document.createElement("span");
    indicator.className = "mk-segmented__indicator";
    indicator.setAttribute("aria-hidden", "true");
    root.insertBefore(indicator, root.firstChild);
  }
  var offs = [];

  function current() { return buttons.filter(function (b) { return b.getAttribute("aria-checked") === "true"; })[0] || buttons[0]; }
  function sync(animate) {
    var cur = current();
    if (!animate || reduced()) { indicator.style.transition = "none"; }
    placeIndicator(root, indicator, cur, true);
    if (!animate || reduced()) { void indicator.offsetWidth; indicator.style.transition = ""; }
  }
  function select(btn, focus) {
    if (!btn || btn.disabled) return;
    buttons.forEach(function (b) {
      var onBtn = b === btn;
      b.setAttribute("aria-checked", onBtn ? "true" : "false");
      b.tabIndex = onBtn ? 0 : -1;
    });
    if (focus) btn.focus();
    sync(true);
    var value = btn.getAttribute("data-value") || btn.textContent.trim();
    root.setAttribute("data-value", value);
    root.dispatchEvent(new CustomEvent("mk:change", { bubbles: true, detail: { value: value } }));
    if (options.onChange) options.onChange(value);
  }

  buttons.forEach(function (b, i) {
    b.type = "button";
    b.setAttribute("role", "radio");
    if (!b.hasAttribute("aria-checked")) b.setAttribute("aria-checked", "false");
    offs.push(on(b, "click", function () { select(b, false); }));
    offs.push(on(b, "keydown", function (e) {
      var step = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0;
      if (!step) return;
      e.preventDefault();
      select(buttons[(i + step + buttons.length) % buttons.length], true);
    }));
  });
  var cur = current();
  buttons.forEach(function (b) { b.setAttribute("aria-checked", b === cur ? "true" : "false"); b.tabIndex = b === cur ? 0 : -1; });
  sync(false);
  offs.push(observeResize(root, function () { sync(false); }));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { sync(false); });

  return {
    get value() { var c = current(); return c ? (c.getAttribute("data-value") || c.textContent.trim()) : null; },
    set: function (value) { select(buttons.filter(function (b) { return (b.getAttribute("data-value") || b.textContent.trim()) === value; })[0], false); },
    destroy: function () { offs.forEach(function (f) { f(); }); }
  };
}

/* ---------- Tabs ---------- */
function tabs(root, options) {
  options = options || {};
  var list = root.querySelector(".mk-tabs__list");
  var tabEls = Array.prototype.slice.call(list.querySelectorAll(".mk-tabs__tab"));
  var panels = Array.prototype.slice.call(root.querySelectorAll(".mk-tabs__panel"));
  list.setAttribute("role", "tablist");
  var indicator = list.querySelector(".mk-tabs__indicator");
  if (!indicator) {
    indicator = document.createElement("span");
    indicator.className = "mk-tabs__indicator";
    indicator.setAttribute("aria-hidden", "true");
    list.appendChild(indicator);
  }
  var offs = [];

  tabEls.forEach(function (t, i) {
    t.type = "button";
    t.setAttribute("role", "tab");
    if (!t.id) t.id = nextId("mk-tab");
    var p = panels[i];
    if (p) {
      if (!p.id) p.id = nextId("mk-tabpanel");
      p.setAttribute("role", "tabpanel");
      p.setAttribute("aria-labelledby", t.id);
      p.tabIndex = 0;
      t.setAttribute("aria-controls", p.id);
    }
  });

  function current() { return tabEls.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0] || tabEls[0]; }
  function sync(animate) {
    if (!animate || reduced()) indicator.style.transition = "none";
    placeIndicator(list, indicator, current(), false);
    if (!animate || reduced()) { void indicator.offsetWidth; indicator.style.transition = ""; }
  }
  function select(tab, focus) {
    if (!tab || tab.disabled) return;
    tabEls.forEach(function (t, i) {
      var sel = t === tab;
      t.setAttribute("aria-selected", sel ? "true" : "false");
      t.tabIndex = sel ? 0 : -1;
      if (panels[i]) panels[i].hidden = !sel;
    });
    if (focus) tab.focus();
    if (tab.scrollIntoView) tab.scrollIntoView({ block: "nearest", inline: "nearest" });
    sync(true);
    var idx = tabEls.indexOf(tab);
    root.dispatchEvent(new CustomEvent("mk:change", { bubbles: true, detail: { index: idx, id: tab.id } }));
    if (options.onChange) options.onChange(idx);
  }

  tabEls.forEach(function (t, i) {
    offs.push(on(t, "click", function () { select(t, false); }));
    offs.push(on(t, "keydown", function (e) {
      var n = null;
      if (e.key === "ArrowRight") n = tabEls[(i + 1) % tabEls.length];
      else if (e.key === "ArrowLeft") n = tabEls[(i - 1 + tabEls.length) % tabEls.length];
      else if (e.key === "Home") n = tabEls[0];
      else if (e.key === "End") n = tabEls[tabEls.length - 1];
      if (!n) return;
      e.preventDefault();
      select(n, true);
    }));
  });
  var cur = current();
  tabEls.forEach(function (t, i) {
    var sel = t === cur;
    t.setAttribute("aria-selected", sel ? "true" : "false");
    t.tabIndex = sel ? 0 : -1;
    if (panels[i]) panels[i].hidden = !sel;
  });
  sync(false);
  offs.push(observeResize(list, function () { sync(false); }));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { sync(false); });

  return {
    get index() { return tabEls.indexOf(current()); },
    select: function (index) { select(tabEls[index], false); },
    destroy: function () { offs.forEach(function (f) { f(); }); }
  };
}

/* ---------- Select ---------- */
function select(root, options) {
  options = options || {};
  var native = root.querySelector("select");
  if (!native) throw new Error("mk-select: внутри нужен <select> с вариантами");
  var placeholder = root.getAttribute("data-placeholder") || "Выберите";
  var trigger = root.querySelector(".mk-select__trigger");
  if (!trigger) {
    trigger = document.createElement("button");
    trigger.className = "mk-select__trigger";
    trigger.innerHTML = '<span class="mk-select__value"></span>' + CHEVRON;
    root.appendChild(trigger);
  }
  trigger.type = "button";
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("aria-expanded", "false");
  trigger.disabled = native.disabled;
  if (native.id) {
    var lbl = document.querySelector('label[for="' + native.id + '"]');
    if (lbl) {
      if (!lbl.id) lbl.id = nextId("mk-label");
      trigger.setAttribute("aria-labelledby", lbl.id + " " + (trigger.id || (trigger.id = nextId("mk-select-trigger"))));
      lbl.addEventListener("click", function (e) { e.preventDefault(); trigger.focus(); });
    }
  }
  var valueEl = trigger.querySelector(".mk-select__value");
  var listbox = null;
  var activeIndex = -1;
  var offs = [];
  var openOffs = [];
  var typed = "";
  var typedAt = 0;

  function opts() { return Array.prototype.slice.call(native.options); }
  function render() {
    var o = native.options[native.selectedIndex];
    var empty = !o || o.value === "";
    valueEl.textContent = empty ? placeholder : o.textContent;
    if (empty) valueEl.setAttribute("data-placeholder", ""); else valueEl.removeAttribute("data-placeholder");
  }

  function position() {
    if (!listbox) return;
    var r = trigger.getBoundingClientRect();
    var vh = window.innerHeight, vw = window.innerWidth, gap = 6, margin = 8;
    var below = vh - r.bottom - gap - margin;
    var above = r.top - gap - margin;
    listbox.style.minWidth = r.width + "px";
    listbox.style.maxWidth = Math.max(r.width, Math.min(360, vw - margin * 2)) + "px";
    listbox.style.maxHeight = "none";
    var natural = listbox.scrollHeight;
    var placeBelow = natural <= below || below >= above;
    var room = Math.max(120, placeBelow ? below : above);
    listbox.style.maxHeight = Math.min(natural, room, 320) + "px";
    var h = listbox.offsetHeight;
    var left = Math.min(Math.max(margin, r.left), vw - listbox.offsetWidth - margin);
    listbox.style.left = left + "px";
    listbox.style.top = (placeBelow ? r.bottom + gap : r.top - gap - h) + "px";
  }

  function setActive(i, scroll) {
    var items = listbox ? listbox.children : [];
    if (activeIndex >= 0 && items[activeIndex]) items[activeIndex].removeAttribute("data-active");
    activeIndex = i;
    if (i >= 0 && items[i]) {
      items[i].setAttribute("data-active", "");
      listbox.setAttribute("aria-activedescendant", items[i].id);
      if (scroll !== false && items[i].scrollIntoView) items[i].scrollIntoView({ block: "nearest" });
    }
  }
  function step(from, dir) {
    var list = opts();
    for (var i = from + dir; i >= 0 && i < list.length; i += dir) { if (!list[i].disabled && !list[i].hidden) return i; }
    return from;
  }

  function choose(i) {
    var o = native.options[i];
    if (!o || o.disabled || o.hidden) return;
    var changed = native.selectedIndex !== i;
    native.selectedIndex = i;
    render();
    close(true);
    if (changed) {
      native.dispatchEvent(new Event("change", { bubbles: true }));
      root.dispatchEvent(new CustomEvent("mk:change", { bubbles: true, detail: { value: o.value } }));
      if (options.onChange) options.onChange(o.value);
    }
  }

  function open() {
    if (listbox || trigger.disabled) return;
    listbox = document.createElement("ul");
    listbox.className = "mk-select__list";
    listbox.id = nextId("mk-listbox");
    listbox.setAttribute("role", "listbox");
    listbox.setAttribute("data-mk-floating", "");
    listbox.tabIndex = -1;
    if (trigger.getAttribute("aria-labelledby")) listbox.setAttribute("aria-labelledby", trigger.getAttribute("aria-labelledby"));
    opts().forEach(function (o, i) {
      var li = document.createElement("li");
      li.className = "mk-select__option";
      li.id = listbox.id + "-" + i;
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", i === native.selectedIndex ? "true" : "false");
      if (o.disabled) li.setAttribute("aria-disabled", "true");
      if (o.hidden) li.hidden = true;
      li.innerHTML = "<span></span>" + CHECK;
      li.firstChild.textContent = o.textContent;
      li.addEventListener("mousedown", function (e) { e.preventDefault(); });
      li.addEventListener("click", function () { choose(i); });
      li.addEventListener("mousemove", function () { if (!o.disabled && activeIndex !== i) setActive(i, false); });
      listbox.appendChild(li);
    });
    document.body.appendChild(listbox);
    trigger.setAttribute("aria-expanded", "true");
    trigger.setAttribute("aria-controls", listbox.id);
    position();
    setActive(native.selectedIndex >= 0 ? native.selectedIndex : step(-1, 1));
    listbox.focus({ preventScroll: true });
    listbox.addEventListener("keydown", onKey);
    listbox.addEventListener("blur", function () { setTimeout(function () { if (listbox && document.activeElement !== listbox) close(false); }, 0); });
    openOffs.push(on(document, "pointerdown", function (e) { if (listbox && !listbox.contains(e.target) && !trigger.contains(e.target)) close(false); }, true));
    openOffs.push(on(window, "resize", position));
    openOffs.push(on(window, "scroll", function (e) { if (listbox && !listbox.contains(e.target)) position(); }, true));
  }

  function close(refocus) {
    if (!listbox) return;
    openOffs.forEach(function (f) { f(); });
    openOffs = [];
    if (listbox.parentNode) listbox.parentNode.removeChild(listbox);
    listbox = null;
    activeIndex = -1;
    trigger.setAttribute("aria-expanded", "false");
    trigger.removeAttribute("aria-controls");
    if (refocus) trigger.focus();
  }

  function typeahead(ch) {
    var now = Date.now();
    typed = now - typedAt > 600 ? ch : typed + ch;
    typedAt = now;
    var list = opts();
    var start = listbox ? activeIndex : native.selectedIndex;
    for (var k = 1; k <= list.length; k++) {
      var i = (start + k) % list.length;
      if (!list[i].disabled && !list[i].hidden && list[i].textContent.trim().toLowerCase().indexOf(typed) === 0) return i;
    }
    return -1;
  }

  function onKey(e) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive(step(activeIndex, 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive(step(activeIndex, -1)); }
    else if (e.key === "Home") { e.preventDefault(); setActive(step(-1, 1)); }
    else if (e.key === "End") { e.preventDefault(); setActive(step(native.options.length, -1)); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (activeIndex >= 0) choose(activeIndex); }
    else if (e.key === "Escape") { e.preventDefault(); close(true); }
    else if (e.key === "Tab") { close(false); }
    else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      var i = typeahead(e.key.toLowerCase());
      if (i >= 0) setActive(i);
    }
  }

  offs.push(on(trigger, "click", function () { if (listbox) close(true); else open(); }));
  offs.push(on(trigger, "keydown", function (e) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      var i = typeahead(e.key.toLowerCase());
      if (i >= 0) { native.selectedIndex = i; render(); native.dispatchEvent(new Event("change", { bubbles: true })); }
    }
  }));
  offs.push(on(native, "change", render));
  render();

  return {
    get value() { return native.value; },
    set: function (value) { native.value = value; render(); },
    open: open,
    close: function () { close(false); },
    destroy: function () { close(false); offs.forEach(function (f) { f(); }); }
  };
}

var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function firstFocusable(container) {
  if (!container) return null;
  var list = container.querySelectorAll(FOCUSABLE);
  for (var i = 0; i < list.length; i++) { if (list[i].offsetParent !== null || list[i].getClientRects().length) return list[i]; }
  return null;
}

/* ---------- Всплывающие слои: позиционирование и общий жизненный цикл ---------- */
function placeFloating(trigger, panel, align) {
  var r = trigger.getBoundingClientRect();
  var vw = window.innerWidth, vh = window.innerHeight, gap = 6, margin = 8;
  panel.style.maxHeight = "none";
  var natural = panel.scrollHeight;
  var below = vh - r.bottom - gap - margin, above = r.top - gap - margin;
  var placeBelow = natural <= below || below >= above;
  panel.style.maxHeight = Math.max(120, Math.min(natural, placeBelow ? below : above)) + "px";
  var w = panel.offsetWidth, h = panel.offsetHeight;
  var left = align === "start" ? r.left : r.right - w;
  left = Math.min(Math.max(margin, left), vw - w - margin);
  panel.style.left = Math.round(left) + "px";
  panel.style.top = Math.round(placeBelow ? r.bottom + gap : r.top - gap - h) + "px";
}

function floating(root, triggerSel, panelSel, kind, setup, panelEl) {
  var trigger = root.querySelector(triggerSel);
  var panel = panelEl || root.querySelector(panelSel);
  if (!trigger || !panel) throw new Error("mk-" + kind + ": нужны " + triggerSel + " и " + panelSel);
  if (!panel.id) panel.id = nextId("mk-" + kind);
  panel.hidden = true;
  panel.setAttribute("data-mk-floating", "");
  // Панель уже может лежать в body (React-портал): тогда не трогаем DOM-структуру
  var moved = panel.parentNode !== document.body;
  if (moved) document.body.appendChild(panel);
  trigger.setAttribute("aria-haspopup", kind === "menu" ? "menu" : "dialog");
  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("aria-controls", panel.id);
  var align = root.getAttribute("data-align") === "start" ? "start" : "end";
  var openOffs = [], offs = [];
  var api = { trigger: trigger, panel: panel, isOpen: function () { return !panel.hidden; } };

  function insideAnyFloating(target) {
    if (!target || !target.closest) return false;
    if (panel.contains(target) || trigger.contains(target)) return true;
    var layer = target.closest("[data-mk-floating]");
    return !!layer && layer !== panel;
  }
  api.open = function (focusWhere) {
    if (!panel.hidden) return;
    panel.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    placeFloating(trigger, panel, align);
    if (setup.onOpen) setup.onOpen(focusWhere);
    openOffs.push(on(document, "pointerdown", function (e) { if (!insideAnyFloating(e.target)) api.close(false); }, true));
    openOffs.push(on(document, "keydown", function (e) {
      if (e.key === "Escape" && !e.defaultPrevented) { e.preventDefault(); api.close(true); }
    }));
    openOffs.push(on(document, "focusin", function (e) { if (!insideAnyFloating(e.target)) api.close(false); }));
    openOffs.push(on(window, "resize", function () { placeFloating(trigger, panel, align); }));
    openOffs.push(on(window, "scroll", function (e) { if (!panel.contains(e.target)) placeFloating(trigger, panel, align); }, true));
    root.dispatchEvent(new CustomEvent("mk:toggle", { bubbles: true, detail: { open: true } }));
  };
  api.close = function (refocus) {
    if (panel.hidden) return;
    openOffs.forEach(function (f) { f(); });
    openOffs = [];
    panel.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    if (refocus) trigger.focus({ preventScroll: true });
    root.dispatchEvent(new CustomEvent("mk:toggle", { bubbles: true, detail: { open: false } }));
  };
  offs.push(on(trigger, "click", function () { if (panel.hidden) api.open("first"); else api.close(true); }));
  api.destroy = function () {
    api.close(false);
    offs.forEach(function (f) { f(); });
    if (moved && panel.parentNode === document.body) root.appendChild(panel);
  };
  api.offs = offs;
  return api;
}

/* ---------- Menu ---------- */
function menu(root, options) {
  options = options || {};
  var f;
  function items() { return Array.prototype.filter.call(f.panel.querySelectorAll(".mk-menu__item"), function (el) { return !el.disabled && el.getAttribute("aria-disabled") !== "true"; }); }
  function focusAt(i) { var list = items(); if (list.length) list[(i + list.length) % list.length].focus(); }
  f = floating(root, "[data-mk-menu-trigger]", ".mk-menu", "menu", {
    onOpen: function (where) { focusAt(where === "last" ? -1 : 0); }
  }, options.panel);
  f.panel.setAttribute("role", "menu");
  Array.prototype.forEach.call(f.panel.querySelectorAll(".mk-menu__item"), function (el) {
    el.setAttribute("role", "menuitem");
    el.tabIndex = -1;
    if (el.tagName === "BUTTON") el.type = "button";
  });
  Array.prototype.forEach.call(f.panel.querySelectorAll(".mk-menu__sep"), function (el) { el.setAttribute("role", "separator"); });
  var typed = "", typedAt = 0;
  f.offs.push(on(f.trigger, "keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); f.open("first"); }
    else if (e.key === "ArrowUp") { e.preventDefault(); f.open("last"); }
  }));
  f.offs.push(on(f.panel, "keydown", function (e) {
    var list = items(), i = list.indexOf(document.activeElement);
    if (e.key === "ArrowDown") { e.preventDefault(); focusAt(i + 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); focusAt(i - 1); }
    else if (e.key === "Home") { e.preventDefault(); focusAt(0); }
    else if (e.key === "End") { e.preventDefault(); focusAt(-1); }
    else if (e.key === "Tab") { f.close(false); }
    else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && e.key !== " ") {
      var now = Date.now();
      typed = now - typedAt > 600 ? e.key.toLowerCase() : typed + e.key.toLowerCase();
      typedAt = now;
      for (var k = 1; k <= list.length; k++) {
        var el = list[(i + k) % list.length];
        var label = (el.getAttribute("data-value") || el.textContent).trim().toLowerCase();
        if (label.indexOf(typed) === 0) { el.focus(); break; }
      }
    }
  }));
  f.offs.push(on(f.panel, "click", function (e) {
    var item = e.target.closest ? e.target.closest(".mk-menu__item") : null;
    if (!item || item.disabled || item.getAttribute("aria-disabled") === "true") return;
    var value = item.getAttribute("data-value");
    if (!value) {
      var clone = item.cloneNode(true);
      Array.prototype.forEach.call(clone.querySelectorAll(".mk-menu__hint"), function (h) { h.parentNode.removeChild(h); });
      value = clone.textContent.trim();
    }
    f.close(true);
    root.dispatchEvent(new CustomEvent("mk:select", { bubbles: true, detail: { value: value } }));
    if (options.onSelect) options.onSelect(value);
  }));
  return { get open() { return f.isOpen(); }, show: function () { f.open("first"); }, hide: function () { f.close(false); }, destroy: f.destroy };
}

/* ---------- Popover ---------- */
function popover(root, options) {
  options = options || {};
  var f = floating(root, "[data-mk-popover-trigger]", ".mk-popover", "popover", {
    onOpen: function () {
      var body = f.panel.querySelector(".mk-popover__body");
      var target = f.panel.querySelector("[autofocus]") || firstFocusable(body) || firstFocusable(f.panel);
      if (target) target.focus({ preventScroll: true }); else { f.panel.tabIndex = -1; f.panel.focus({ preventScroll: true }); }
    }
  }, options.panel);
  f.panel.setAttribute("role", "dialog");
  if (!f.panel.getAttribute("aria-label") && !f.panel.getAttribute("aria-labelledby")) {
    var title = f.panel.querySelector(".mk-popover__title");
    if (title) { if (!title.id) title.id = nextId("mk-popover-title"); f.panel.setAttribute("aria-labelledby", title.id); }
  }
  f.offs.push(on(f.panel, "click", function (e) {
    var closer = e.target.closest ? e.target.closest("[data-mk-popover-close]") : null;
    if (closer) f.close(true);
  }));
  return { get open() { return f.isOpen(); }, show: function () { f.open(); }, hide: function () { f.close(false); }, destroy: f.destroy };
}

/* ---------- Pagination ---------- */
var ARROW_L = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>';
var ARROW_R = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>';
function pageList(page, count) {
  if (count <= 7) { var all = []; for (var i = 1; i <= count; i++) all.push(i); return all; }
  var out = [1];
  var from = Math.max(2, page - 1), to = Math.min(count - 1, page + 1);
  if (page <= 3) { from = 2; to = 4; }
  if (page >= count - 2) { from = count - 3; to = count - 1; }
  if (from > 2) out.push("gap");
  for (var p = from; p <= to; p++) out.push(p);
  if (to < count - 1) out.push("gap");
  out.push(count);
  return out;
}
function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
function pagination(root, options) {
  options = options || {};
  var total = +(options.total != null ? options.total : root.getAttribute("data-total")) || 0;
  var size = +(options.pageSize != null ? options.pageSize : root.getAttribute("data-page-size")) || 20;
  var page = +(options.page != null ? options.page : root.getAttribute("data-page")) || 1;
  var noun = options.noun || root.getAttribute("data-noun") || "";
  if (root.tagName !== "NAV") root.setAttribute("role", "navigation");
  if (!root.getAttribute("aria-label")) root.setAttribute("aria-label", "Страницы");
  function count() { return Math.max(1, Math.ceil(total / size)); }
  function render() {
    var c = count();
    page = Math.min(Math.max(1, page), c);
    var pages = pageList(page, c).map(function (p) {
      if (p === "gap") return '<span class="mk-pagination__gap" aria-hidden="true">…</span>';
      return '<button type="button" class="mk-pagination__page" data-page="' + p + '"' + (p === page ? ' aria-current="page"' : "") + ' aria-label="Страница ' + p + '">' + p + "</button>";
    }).join("");
    var from = total ? (page - 1) * size + 1 : 0, to = Math.min(total, page * size);
    root.innerHTML =
      '<button type="button" class="mk-pagination__nav" data-page="' + (page - 1) + '" aria-label="Предыдущая страница"' + (page <= 1 ? " disabled" : "") + ">" + ARROW_L + "</button>" +
      '<span class="mk-pagination__pages">' + pages + "</span>" +
      '<button type="button" class="mk-pagination__nav" data-page="' + (page + 1) + '" aria-label="Следующая страница"' + (page >= c ? " disabled" : "") + ">" + ARROW_R + "</button>" +
      '<span class="mk-pagination__report" aria-live="polite">' + fmt(from) + "–" + fmt(to) + " из " + fmt(total) + (noun ? " " + noun : "") + "</span>";
    root.setAttribute("data-page", page);
  }
  function go(p, focusCurrent) {
    var c = count();
    p = Math.min(Math.max(1, p), c);
    if (p === page) return;
    page = p;
    render();
    if (focusCurrent) { var cur = root.querySelector('[aria-current="page"]'); if (cur) cur.focus(); }
    root.dispatchEvent(new CustomEvent("mk:change", { bubbles: true, detail: { page: page } }));
    if (options.onChange) options.onChange(page);
  }
  var off = on(root, "click", function (e) {
    var b = e.target.closest ? e.target.closest("[data-page]") : null;
    if (!b || b.disabled || !root.contains(b)) return;
    go(+b.getAttribute("data-page"), true);
  });
  render();
  return {
    get page() { return page; },
    go: function (p) { go(p, false); },
    update: function (o) { if (o.total != null) total = o.total; if (o.pageSize != null) size = o.pageSize; if (o.page != null) page = o.page; render(); },
    destroy: off
  };
}

/* ---------- App shell: мобильный drawer ---------- */
var MOBILE = "(max-width: 720px)";

function app(root, options) {
  options = options || {};
  var sidebar = root.querySelector(".mk-sidebar");
  var openers = Array.prototype.slice.call(root.querySelectorAll("[data-mk-drawer-open]"));
  var closers = Array.prototype.slice.call(root.querySelectorAll("[data-mk-drawer-close]"));
  var backdrop = root.querySelector(".mk-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("button");
    backdrop.type = "button";
    backdrop.className = "mk-backdrop";
    backdrop.tabIndex = -1;
    backdrop.setAttribute("aria-label", "Закрыть меню");
    root.appendChild(backdrop);
  }
  closers.push(backdrop);
  if (!sidebar.id) sidebar.id = nextId("mk-sidebar");
  var mq = window.matchMedia ? window.matchMedia(MOBILE) : null;
  var lastOpener = null;
  var offs = [];

  function isOpen() { return root.hasAttribute("data-drawer-open"); }
  function mobile() { return mq ? mq.matches : false; }
  function syncAria() {
    openers.forEach(function (b) {
      b.setAttribute("aria-controls", sidebar.id);
      b.setAttribute("aria-expanded", isOpen() ? "true" : "false");
    });
    if (mobile()) {
      sidebar.setAttribute("role", "dialog");
      sidebar.setAttribute("aria-modal", "true");
      if (!sidebar.getAttribute("aria-label")) sidebar.setAttribute("aria-label", "Меню");
      if (isOpen()) sidebar.removeAttribute("inert"); else sidebar.setAttribute("inert", "");
    } else {
      sidebar.removeAttribute("role");
      sidebar.removeAttribute("aria-modal");
      sidebar.removeAttribute("inert");
    }
  }
  function open(opener) {
    if (!mobile() || isOpen()) return;
    lastOpener = opener || document.activeElement;
    root.setAttribute("data-drawer-open", "");
    document.documentElement.classList.add("mk-scroll-locked");
    syncAria();
    var first = sidebar.querySelector('[aria-current="page"]') || firstFocusable(sidebar);
    if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 30);
    root.dispatchEvent(new CustomEvent("mk:drawer", { bubbles: true, detail: { open: true } }));
  }
  function close(restore) {
    if (!isOpen()) return;
    root.removeAttribute("data-drawer-open");
    document.documentElement.classList.remove("mk-scroll-locked");
    syncAria();
    if (restore !== false && lastOpener && lastOpener.focus) lastOpener.focus({ preventScroll: true });
    root.dispatchEvent(new CustomEvent("mk:drawer", { bubbles: true, detail: { open: false } }));
  }

  openers.forEach(function (b) { offs.push(on(b, "click", function () { if (isOpen()) close(); else open(b); })); });
  closers.forEach(function (b) { offs.push(on(b, "click", function () { close(); })); });
  offs.push(on(document, "keydown", function (e) {
    if (!isOpen()) return;
    if (e.key === "Escape") { e.preventDefault(); close(); return; }
    if (e.key !== "Tab") return;
    var items = Array.prototype.filter.call(sidebar.querySelectorAll(FOCUSABLE), function (el) { return el.offsetParent !== null || el === document.activeElement; });
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && (document.activeElement === first || !sidebar.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (document.activeElement === last || !sidebar.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
  }));
  offs.push(on(sidebar, "click", function (e) {
    var link = e.target.closest ? e.target.closest("a[href]") : null;
    if (link && isOpen() && options.closeOnNavigate !== false) close(false);
  }));
  function onMq() { if (!mobile()) close(false); syncAria(); }
  if (mq) {
    if (mq.addEventListener) { mq.addEventListener("change", onMq); offs.push(function () { mq.removeEventListener("change", onMq); }); }
    else if (mq.addListener) { mq.addListener(onMq); offs.push(function () { mq.removeListener(onMq); }); }
  }
  syncAria();

  return {
    get open() { return isOpen(); },
    show: function () { open(null); },
    hide: function () { close(); },
    destroy: function () { close(false); offs.forEach(function (f) { f(); }); }
  };
}

/* ---------- init ---------- */
var registry = typeof WeakMap !== "undefined" ? new WeakMap() : null;
function bind(el, factory) {
  if (registry && registry.has(el)) return registry.get(el);
  var inst = factory(el);
  if (registry) registry.set(el, inst);
  return inst;
}
function init(root) {
  root = root || document;
  var made = [];
  Array.prototype.forEach.call(root.querySelectorAll("[data-mk-segmented]"), function (el) { made.push(bind(el, segmented)); });
  Array.prototype.forEach.call(root.querySelectorAll("[data-mk-tabs]"), function (el) { made.push(bind(el, tabs)); });
  Array.prototype.forEach.call(root.querySelectorAll("[data-mk-select]"), function (el) { made.push(bind(el, select)); });
  Array.prototype.forEach.call(root.querySelectorAll("[data-mk-app]"), function (el) { made.push(bind(el, app)); });
  Array.prototype.forEach.call(root.querySelectorAll("[data-mk-menu]"), function (el) { made.push(bind(el, menu)); });
  Array.prototype.forEach.call(root.querySelectorAll("[data-mk-popover]"), function (el) { made.push(bind(el, popover)); });
  Array.prototype.forEach.call(root.querySelectorAll("[data-mk-pagination]"), function (el) { made.push(bind(el, pagination)); });
  return made;
}

export var version = "0.1.0";
export { init, segmented, tabs, select, app, menu, popover, pagination, placeFloating };
