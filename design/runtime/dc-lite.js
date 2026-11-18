/* dc-lite.js — renders Kumbida design files in any browser.
   The design canvas stores each screen as a template (holes like {{name}}, loops, conditionals)
   plus a small "Component" class that computes the values. This file runs those templates as a
   normal web page so the screens look and behave like the approved design. Reference only:
   build the real app with React/Next.js, using these pages as the visual spec. */
(function () {
  'use strict';

  class DCLogic {
    constructor(props) { this.props = props || {}; this.state = {}; }
    setState(update, cb) {
      var patch = typeof update === 'function' ? update(this.state, this.props) : update;
      this.state = Object.assign({}, this.state, patch);
      if (this.__schedule) this.__schedule();
      if (cb) setTimeout(cb, 0);
    }
    forceUpdate() { if (this.__schedule) this.__schedule(); }
  }
  window.DCLogic = DCLogic;

  var HOLE = /\{\{\s*([^}]+?)\s*\}\}/g;
  var WHOLE = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/;
  var BOOL_ATTRS = { disabled: 1, checked: 1, selected: 1, readonly: 1, required: 1, hidden: 1, open: 1, multiple: 1, autofocus: 1 };

  function lookup(scope, path) {
    path = path.trim();
    if (path === 'true') return true;
    if (path === 'false') return false;
    if (path === 'null') return null;
    if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
    if (/^'.*'$|^".*"$/.test(path)) return path.slice(1, -1);
    var parts = path.split('.'), v = scope;
    for (var i = 0; i < parts.length; i++) {
      if (v == null) return undefined;
      v = v[parts[i]];
    }
    return v;
  }
  function interp(str, scope) {
    return str.replace(HOLE, function (_, p) { var v = lookup(scope, p); return v == null ? '' : String(v); });
  }
  function camel(s) { return s.replace(/-([a-z])/g, function (_, c) { return c.toUpperCase(); }); }
  function kids(node) { return node.content ? node.content.childNodes : node.childNodes; }

  function compile(tpl) {
    var script = tpl.querySelector('script[data-dc-script]');
    var xdc = tpl.querySelector('x-dc');
    var props = {};
    try {
      var decl = JSON.parse(script.getAttribute('data-props') || '{}');
      Object.keys(decl).forEach(function (k) { if (k[0] !== '$' && decl[k] && 'default' in decl[k]) props[k] = decl[k]['default']; });
    } catch (e) { console.warn('dc-lite: bad data-props', e); }
    var Cls = new Function('DCLogic', script.textContent + '\nreturn Component;')(DCLogic);
    return { Cls: Cls, xdc: xdc, defaults: props };
  }

  var REGISTRY = {};
  var compiled = {};
  function getDef(name) {
    if (!compiled[name]) compiled[name] = compile(REGISTRY[name]);
    return compiled[name];
  }

  function eventName(attr, el) {
    var n = attr.slice(2).toLowerCase();
    if (n === 'change') {
      var t = (el.getAttribute('type') || '').toLowerCase();
      if (el.localName === 'select' || t === 'checkbox' || t === 'radio' || t === 'file') return 'change';
      return 'input';
    }
    if (n === 'doubleclick') return 'dblclick';
    return n;
  }
  function bind(el, type, fn) {
    el.__h = el.__h || {};
    el.__h[type] = fn;
    el.__reg = el.__reg || {};
    if (!el.__reg[type]) {
      el.__reg[type] = true;
      el.addEventListener(type, function (ev) { var h = el.__h && el.__h[type]; if (h) h(ev); });
    }
  }

  function Instance(def, props) {
    this.def = def;
    this.logic = new def.Cls(Object.assign({}, def.defaults, props || {}));
    this.children = {};
  }
  Instance.prototype.render = function () {
    var vals = this.logic.renderVals() || {};
    var frag = document.createDocumentFragment();
    this.counter = {};
    var self = this;
    kids(this.def.xdc).forEach(function (n) { renderNode(n, vals, frag, self); });
    return frag;
  };

  function renderNode(node, scope, out, inst) {
    if (node.nodeType === 3) { out.appendChild(document.createTextNode(interp(node.nodeValue, scope))); return; }
    if (node.nodeType !== 1) return;
    var tag = node.localName;
    var sc = node.getAttribute('data-sc');
    if (tag === 'helmet') return;
    if (sc === 'if' || tag === 'sc-if') {
      var cond = node.getAttribute('value') || '';
      var m = cond.match(WHOLE);
      var ok = m ? lookup(scope, m[1]) : cond;
      if (ok) Array.prototype.forEach.call(kids(node), function (c) { renderNode(c, scope, out, inst); });
      return;
    }
    if (sc === 'for' || tag === 'sc-for') {
      var lm = (node.getAttribute('list') || '').match(WHOLE);
      var list = lm ? lookup(scope, lm[1]) : null;
      var as = node.getAttribute('as') || 'item';
      (list || []).forEach(function (item, i) {
        var s = Object.create(scope); s[as] = item; s.$index = i;
        Array.prototype.forEach.call(kids(node), function (c) { renderNode(c, s, out, inst); });
      });
      return;
    }
    if (tag === 'dc-import') {
      var name = node.getAttribute('name');
      if (!REGISTRY[name]) { console.warn('dc-lite: missing component', name); return; }
      var props = {};
      Array.prototype.forEach.call(node.attributes, function (a) {
        if (a.name === 'name' || a.name.indexOf('hint-') === 0) return;
        var wm = a.value.match(WHOLE);
        props[camel(a.name)] = wm ? lookup(scope, wm[1]) : interp(a.value, scope);
      });
      inst.counter[name] = (inst.counter[name] || 0) + 1;
      var key = name + '#' + inst.counter[name];
      var child = inst.children[key];
      if (!child) { child = inst.children[key] = new Instance(getDef(name), props); child.parent = inst; child.logic.__schedule = inst.logic.__schedule; }
      else child.logic.props = Object.assign({}, child.def.defaults, props);
      var wrap = document.createElement('div');
      wrap.style.display = 'contents';
      wrap.appendChild(child.render());
      out.appendChild(wrap);
      return;
    }
    var el = document.createElementNS(node.namespaceURI, node.localName);
    var propsToSet = null;
    Array.prototype.forEach.call(node.attributes, function (a) {
      var n = a.name;
      if (n.indexOf('hint-') === 0) return;
      var wm = a.value.match(WHOLE);
      if (wm) {
        var raw = lookup(scope, wm[1]);
        if (n.slice(0, 2) === 'on' && n.length > 2) { if (typeof raw === 'function') bind(el, eventName(n, node), raw); return; }
        if ((n === 'value' || n === 'checked') && node.namespaceURI === 'http://www.w3.org/1999/xhtml') { (propsToSet = propsToSet || {})[n] = raw; if (n === 'checked' && raw) el.setAttribute('checked', ''); if (n === 'value' && raw != null) el.setAttribute('value', String(raw)); return; }
        if (BOOL_ATTRS[n]) { if (raw) el.setAttribute(n, ''); return; }
        if (n.indexOf('aria-') === 0) { if (raw != null) el.setAttribute(n, String(raw)); return; }
        if (raw === false || raw == null) return;
        el.setAttribute(n, raw === true ? '' : String(raw));
        return;
      }
      el.setAttribute(n, interp(a.value, scope));
    });
    Array.prototype.forEach.call(kids(node), function (c) { renderNode(c, scope, el, inst); });
    if (propsToSet) el.__props = propsToSet;
    if (el.localName === 'textarea' && !el.__props) el.__props = { value: el.textContent };
    applyProps(el);
    out.appendChild(el);
  }

  function applyProps(el) {
    if (!el.__props) return;
    Object.keys(el.__props).forEach(function (k) {
      var v = el.__props[k];
      if (k === 'value') { v = v == null ? '' : String(v); if (el.value !== v) el.value = v; }
      else if (el[k] !== v) el[k] = v;
    });
  }

  function morph(a, b) {
    if (a.nodeType !== b.nodeType || a.nodeName !== b.nodeName || (a.namespaceURI !== b.namespaceURI)) { a.parentNode.replaceChild(b, a); return; }
    if (a.nodeType === 3) { if (a.nodeValue !== b.nodeValue) a.nodeValue = b.nodeValue; return; }
    if (a.nodeType !== 1) return;
    Array.prototype.slice.call(a.attributes).forEach(function (at) { if (!b.hasAttribute(at.name)) a.removeAttribute(at.name); });
    Array.prototype.forEach.call(b.attributes, function (at) { if (a.getAttribute(at.name) !== at.value) a.setAttribute(at.name, at.value); });
    a.__h = {};
    if (b.__h) Object.keys(b.__h).forEach(function (t) { bind(a, t, b.__h[t]); });
    morphChildren(a, b);
    a.__props = b.__props;
    applyProps(a);
  }
  function morphChildren(a, b) {
    var ac = Array.prototype.slice.call(a.childNodes), bc = Array.prototype.slice.call(b.childNodes);
    for (var i = 0; i < bc.length; i++) {
      if (i < ac.length) morph(ac[i], bc[i]); else a.appendChild(bc[i]);
    }
    for (var j = bc.length; j < ac.length; j++) a.removeChild(ac[j]);
  }

  function mount() {
    document.querySelectorAll('template[data-dc-component]').forEach(function (t) {
      REGISTRY[t.getAttribute('data-dc-component')] = t.content;
    });
    var rootTpl = document.getElementById('dc-root');
    if (!rootTpl) return;
    var def = compile(rootTpl.content);
    var inst = new Instance(def, {});
    var host = document.createElement('div');
    host.setAttribute('data-dc-host', '');
    host.style.display = 'contents';
    rootTpl.parentNode.insertBefore(host, rootTpl);
    var queued = false;
    function draw() {
      queued = false;
      var fresh = document.createElement('div');
      fresh.appendChild(inst.render());
      morphChildren(host, fresh);
    }
    inst.logic.__schedule = function () { if (!queued) { queued = true; Promise.resolve().then(draw); } };
    draw();
    if (typeof inst.logic.componentDidMount === 'function') inst.logic.componentDidMount();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
