(function () {
  "use strict";
  var C = window.KK_CONFIG, P = window.KK_PRODUCTS, K = (window.KK = { C: C, P: P, cats: window.KK_CATS });
  K.posts = (window.KK_POSTS || []).slice().sort(function (a, b) { return b.date.localeCompare(a.date); });
  C.maxQty = C.maxQty > 0 ? C.maxQty : 10;
  K.$ = function (s, r) { return (r || document).querySelector(s); };
  K.esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  K.money = function (n) { return C.currency + Number(n).toLocaleString("en-IN"); };
  K.byId = function (id) { return P.filter(function (p) { return p.id === id; })[0]; };
  K.get = function (k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v === null || v === undefined ? d : v; } catch (e) { return d; } };
  K.set = function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  K.qs = new URLSearchParams(window.location.search);
  K.pu = function (id) { return "product.html?id=" + encodeURIComponent(id); };
  K.cu = function (c) { return "category.html?c=" + encodeURIComponent(c); };
  K.abs = function (p) { return C.siteUrl ? String(C.siteUrl).replace(/\/$/, "") + "/" + p : ""; };
  K.date = function (d) { return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); };
  K.car = function (c, label) {
    return '<svg viewBox="0 0 200 100" role="img" aria-label="' + K.esc(label || "Model car") + '"><path d="M10 70c0-9 4-13 12-15l30-7 22-19c3-3 6-4 10-4h50c6 0 10 2 14 6l18 17 22 5c8 2 12 6 12 14v9H10z" fill="' + c + '"/><path d="M70 33h36v15H56zM114 33h22l16 15h-38z" fill="#0B0B0D" opacity=".55"/><circle cx="55" cy="80" r="15" fill="#0B0B0D"/><circle cx="55" cy="80" r="6" fill="#8d8d93"/><circle cx="150" cy="80" r="15" fill="#0B0B0D"/><circle cx="150" cy="80" r="6" fill="#8d8d93"/></svg>';
  };
  /* Product picture: p.images[0], else assets/img/<id>.jpg when config.photos is true, else the product's illustration (p.art).
     If a photo file is missing, the illustration is used; if that is missing too, the drawn car. */
  K.imgSrc = function (p) { return p.images && p.images.length ? p.images[0] : (C.photos ? "assets/img/" + p.id + ".jpg" : (p.art || "")); };
  K.img = function (p, alt, eager) {
    var s = K.imgSrc(p), fb = !(p.images && p.images.length) && C.photos && p.art ? p.art : "";
    var a = alt === undefined ? p.name + (s && s === p.art ? " (illustration)" : "") : alt;
    return s ? '<img class="pimg" src="' + K.esc(s) + '" alt="' + K.esc(a) + '" width="800" height="600"' + (eager ? "" : ' loading="lazy"') + ' decoding="async" data-c="' + K.esc(p.color) + '"' + (fb ? ' data-fb="' + K.esc(fb) + '"' : "") + ">" : K.car(p.color, alt === undefined ? p.name : "Model car");
  };
  document.addEventListener("error", function (e) {
    var t = e.target;
    if (!t || !t.classList || !t.classList.contains("pimg")) return;
    var fb = t.getAttribute("data-fb");
    if (fb) { t.removeAttribute("data-fb"); t.src = fb; } else t.outerHTML = K.car(t.getAttribute("data-c") || "#C9A45C");
  }, true);
  K.meta = function (title, desc) {
    document.title = title;
    [['meta[name="description"]', desc], ['meta[property="og:title"]', title], ['meta[property="og:description"]', desc]].forEach(function (m) { var el = K.$(m[0]); if (el && m[1]) el.setAttribute("content", m[1]); });
  };
  K.ld = function (o) { try { var s = document.createElement("script"); s.type = "application/ld+json"; s.textContent = JSON.stringify(o); document.head.appendChild(s); } catch (e) {} };

  /* ---- cart ---- */
  K.cart = K.get("kk_cart", {});
  if (typeof K.cart !== "object" || K.cart === null || Array.isArray(K.cart)) K.cart = {};
  K.count = function () { return Object.keys(K.cart).reduce(function (n, id) { return n + K.cart[id]; }, 0); };
  K.subtotal = function () { return Object.keys(K.cart).reduce(function (n, id) { return n + K.byId(id).price * K.cart[id]; }, 0); };
  K.badge = function () { var b = K.$("#cnt"), w = K.$("#wcnt"); if (b) b.textContent = K.count(); if (w && K.wl) w.textContent = K.wl.length; };
  K.saveCart = function () { K.set("kk_cart", K.cart); K.badge(); if (K.sync) K.sync(); document.dispatchEvent(new Event("kk:cart")); };
  K.isPre = function (p) { return !!p && p.cat === "Pre-Orders"; };
  K.hasQty = function (p) { return typeof p.qty === "number"; };
  K.avail = function (p) { return K.hasQty(p) ? Math.max(0, Math.min(C.maxQty, p.qty)) : C.maxQty; };
  /* Remove unknown or sold-out products and cap quantities. Returns the names removed. */
  K.fix = function () {
    var out = [];
    Object.keys(K.cart).forEach(function (id) {
      var p = K.byId(id), q = Math.floor(Number(K.cart[id]));
      if (!p || !p.stock || !(q > 0)) { out.push(p ? p.name : id); delete K.cart[id]; }
      else K.cart[id] = Math.min(q, K.avail(p));
    });
    if (out.length) K.saveCart();
    return out;
  };
  K.removed = K.fix();
  /* Returns 1 added, -1 capped at the per-order limit, 0 not possible. */
  K.add = function (id, d) {
    var p = K.byId(id); if (!p || (d > 0 && !p.stock)) return 0;
    var cur = K.cart[id] || 0, n = Math.max(0, Math.min(K.avail(p), cur + d));
    if (n === cur) return d > 0 ? -1 : 0;
    if (n === 0) delete K.cart[id]; else K.cart[id] = n;
    K.saveCart(); if (n > cur && K.bump) K.bump("+" + (n - cur)); return 1;
  };
  K.toast = function (m) {
    var t = K.$("#toast"); if (!t) return;
    t.textContent = m; t.classList.add("on"); clearTimeout(K.toast.t);
    K.toast.t = setTimeout(function () { t.classList.remove("on"); }, 2800);
  };
  K.wa = function (msg) {
    var n = String(C.whatsapp || "").replace(/\D/g, ""); if (!n) return false;
    window.open("https://wa.me/" + n + "?text=" + encodeURIComponent(msg), "_blank", "noopener"); return true;
  };
  K.copy = function (t, ok) {
    try { navigator.clipboard.writeText(t).then(function () { K.toast(ok); }, function () { K.toast("Could not copy. Please copy it manually."); }); } catch (e) { K.toast("Could not copy. Please copy it manually."); }
  };

  /* ---- validation ---- */
  K.STATES = ["Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"];
  K.phoneNorm = function (s) { var m = /^(?:\+?91|0)?([6-9]\d{9})$/.exec(String(s).replace(/[\s-]/g, "")); return m ? "+91" + m[1] : null; };
  K.rules = {
    name: function (s) { return /^[\p{L}][\p{L} .'-]{1,59}$/u.test(s) ? "" : "Enter your full name (letters only)."; },
    phone: function (s) { return K.phoneNorm(s) ? "" : "Enter a valid 10-digit Indian mobile number."; },
    email: function (s) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s) && s.length <= 120 ? "" : "Enter a valid email address."; },
    address: function (s) { return s.length >= 8 && s.length <= 200 ? "" : "Enter your full address (house, street, area)."; },
    city: function (s) { return /^[\p{L}][\p{L} .'-]{1,49}$/u.test(s) ? "" : "Enter your city."; },
    state: function (s) { return K.STATES.indexOf(s) > -1 ? "" : "Select your state."; },
    pin: function (s) { return /^[1-9]\d{5}$/.test(s) ? "" : "Enter a valid 6-digit PIN code."; },
    msg: function (s) { return s.length >= 10 && s.length <= 1000 ? "" : "Please write at least 10 characters."; }
  };
  K.field = function (label, name, attrs, tag, inner) {
    var a = ' id="f-' + name + '" name="' + name + '" aria-describedby="e-' + name + '" ' + (attrs || "");
    var c = tag === "textarea" ? "<textarea" + a + "></textarea>" : tag === "select" ? "<select" + a + ">" + inner + "</select>" : "<input" + a + ">";
    return '<div class="fld"><label for="f-' + name + '">' + label + "</label>" + c + '<span class="err" id="e-' + name + '"></span></div>';
  };
  K.validate = function (f, names) {
    var first = null;
    names.forEach(function (n) {
      var el = f.elements[n], m = K.rules[n](String(el.value).trim()), er = K.$("#e-" + n);
      if (er) er.textContent = m;
      el.setAttribute("aria-invalid", m ? "true" : "false"); el.classList.toggle("bad", !!m);
      if (m && !first) first = el;
    });
    if (first && first.focus) first.focus();
    return !first;
  };

  /* ---- stock, wishlist, recently viewed, recommendations, coupons ---- */
  C.lowStock = C.lowStock > 0 ? C.lowStock : 3;
  K.low = function (p) { return !!(p.stock && K.hasQty(p) && p.qty <= C.lowStock); };
  K.wl = K.get("kk_wish", []);
  if (!Array.isArray(K.wl)) K.wl = [];
  K.wl = K.wl.filter(function (id) { return !!K.byId(id); });
  K.rv = K.get("kk_rv", []);
  if (!Array.isArray(K.rv)) K.rv = [];
  K.seen = function (id) { K.rv = [id].concat(K.rv.filter(function (x) { return x !== id; })).slice(0, 10); K.set("kk_rv", K.rv); };
  K.recent = function (ex, n) { return K.rv.filter(function (id) { return id !== ex; }).map(function (id) { return K.byId(id); }).filter(Boolean).slice(0, n || 4); };
  K.reviewsFor = function (id) { return (window.KK_REVIEWS || []).filter(function (r) { return r.product === id && r.rating >= 1 && r.rating <= 5; }); };
  K.stars = function (n) { n = Math.round(n); return '<span class="stars" role="img" aria-label="' + n + ' out of 5 stars">' + "&#9733;".repeat(n) + "&#9734;".repeat(5 - n) + "</span>"; };
  K.reco = function (base, n, ex) {
    var cats = {}, brands = {}, avg = 0;
    base.forEach(function (b) { cats[b.cat] = 1; brands[b.brand] = 1; avg += b.price; });
    avg = base.length ? avg / base.length : 0; ex = ex || [];
    return P.filter(function (p) { return p.stock && ex.indexOf(p.id) < 0; }).map(function (p, i) {
      return { p: p, i: i, s: (cats[p.cat] ? 3 : 0) + (brands[p.brand] ? 1 : 0) + (avg && Math.abs(p.price - avg) / avg <= 0.4 ? 2 : 0) };
    }).sort(function (a, b) { return b.s - a.s || a.i - b.i; }).slice(0, n).map(function (x) { return x.p; });
  };
  K.toggleWish = function (id) {
    var p = K.byId(id); if (!p) return;
    var i = K.wl.indexOf(id); if (i > -1) K.wl.splice(i, 1); else K.wl.unshift(id);
    K.set("kk_wish", K.wl);
    var on = i < 0, bs = document.querySelectorAll('[data-act="wish"]');
    Array.prototype.forEach.call(bs, function (b) {
      if (b.getAttribute("data-id") !== id) return;
      var t = b.getAttribute("data-t");
      b.setAttribute("aria-pressed", String(on));
      b.setAttribute("aria-label", (on ? "Remove " : "Save ") + p.name + (on ? " from" : " to") + " wishlist");
      b.innerHTML = (on ? "&#9829;" : "&#9825;") + (t ? " " + (on ? "Saved" : "Add to wishlist") : "");
    });
    K.badge(); K.toast(on ? "Saved to wishlist" : "Removed from wishlist");
    document.dispatchEvent(new Event("kk:wish"));
  };
  K.wishBtn = function (p, txt) {
    var on = K.wl.indexOf(p.id) > -1;
    return '<button class="wish' + (txt ? " txt" : "") + '" type="button" data-act="wish" data-id="' + p.id + '"' + (txt ? ' data-t="1"' : "") + ' aria-pressed="' + on + '" aria-label="' + (on ? "Remove " : "Save ") + K.esc(p.name) + (on ? " from" : " to") + ' wishlist">' + (on ? "&#9829;" : "&#9825;") + (txt ? " " + (on ? "Saved" : "Add to wishlist") : "") + "</button>";
  };
  K.coupons = function () { return Array.isArray(C.coupons) ? C.coupons : []; };
  /* Checks a coupon code against the cart subtotal. Returns {code, discount} or {err}. */
  K.couponCheck = function (code, sub) {
    code = String(code || "").trim().toUpperCase();
    var c = K.coupons().filter(function (x) { return String(x.code).toUpperCase() === code; })[0];
    if (!c || c.active === false) return { err: "This code is not valid." };
    if (c.expires && new Date() > new Date(c.expires + "T23:59:59")) return { err: "This code has expired." };
    if (c.min && sub < c.min) return { err: "Add " + K.money(c.min - sub) + " more to use this code." };
    var d = c.type === "flat" ? Number(c.value) : Math.round(sub * Number(c.value) / 100);
    if (c.max) d = Math.min(d, c.max);
    d = Math.max(0, Math.min(d, sub));
    return { code: code, discount: d };
  };
  K.couponNow = function () {
    var code = K.get("kk_coupon", ""); if (!code) return null;
    var r = K.couponCheck(code, K.subtotal());
    return r.err ? { code: code, err: r.err, discount: 0 } : r;
  };

  /* ---- shared UI ---- */
  K.cardAct = function (p) {
    var q = K.cart[p.id] || 0, n = K.esc(p.name);
    if (!p.stock) return '<button class="btn sm" type="button" disabled aria-label="' + n + ' is sold out">Sold out</button>';
    if (q > 0) return '<span class="qty cq"><button type="button" data-act="dec" data-id="' + p.id + '" aria-label="Remove one ' + n + '">&minus;</button><span aria-live="polite" aria-label="' + q + ' in cart">' + q + '</span><button type="button" data-act="inc" data-id="' + p.id + '" aria-label="Add one more ' + n + '"' + (q >= K.avail(p) ? ' disabled title="Maximum ' + K.avail(p) + ' per order"' : "") + ">+</button></span>";
    return '<button class="btn sm" type="button" data-act="add" data-id="' + p.id + '" aria-label="Add ' + n + ' to cart">' + (K.isPre(p) ? "Pre-order" : "Add") + "</button>";
  };
  /* Refresh every product card's Add / quantity control after the cart changes. */
  K.sync = function () {
    var ae = document.activeElement, keep = ae && ae.closest ? ae.closest(".act[data-id]") : null;
    var kid = keep ? keep.getAttribute("data-id") : null, which = ae && ae.getAttribute ? ae.getAttribute("data-act") : null;
    Array.prototype.forEach.call(document.querySelectorAll(".act[data-id]"), function (el) { var p = K.byId(el.getAttribute("data-id")); if (p) el.innerHTML = K.cardAct(p); });
    if (kid) {
      var want = which === "add" ? "inc" : which, sel = '.act[data-id="' + kid + '"] ';
      var nb = document.querySelector(sel + '[data-act="' + want + '"]:not([disabled])') || document.querySelector(sel + "button:not([disabled])");
      if (nb && nb.focus) nb.focus();
    }
  };
  /* Small "+1" / "+2" pop next to the cart button when something is added. */
  K.bump = function (t) {
    try {
      var b = K.$("#cnt"); if (!b || !b.parentNode) return;
      var sp = document.createElement("span"); sp.className = "plus"; sp.textContent = t; b.parentNode.appendChild(sp);
      setTimeout(function () { if (sp.parentNode) sp.parentNode.removeChild(sp); }, 1200);
    } catch (e) {}
  };
  K.refreshAcct = function () { var a = K.$("a.acct"), u = K.get("kk_user", null); if (a) a.textContent = u && u.name ? "Hi, " + String(u.name).split(" ")[0] : "Create account"; };
  K.card = function (p) {
    var low = K.low(p);
    return '<article class="card' + (p.stock ? "" : " out") + '">' + K.wishBtn(p) + '<a class="ph" href="' + K.pu(p.id) + '" tabindex="-1" aria-hidden="true"><span class="tag' + (p.stock ? (low ? " low" : "") : " out") + '">' + (p.stock ? (low ? "Only " + p.qty + " left" : K.esc(p.cat)) : "Sold out") + "</span>" + K.img(p, "") + '</a><div class="cb"><a class="pn" href="' + K.pu(p.id) + '">' + K.esc(p.name) + '</a><div class="row"><span class="pp">' + K.money(p.price) + '</span><span class="act" data-id="' + p.id + '">' + K.cardAct(p) + "</span></div></div></article>";
  };
  K.chrome = function () {
    var pg = document.body.getAttribute("data-page"), esc = K.esc;
    var links = [["Home", "index.html", "home"], ["Collections", "collections.html", "collections"], ["Blog", "blog.html", "blog"], ["About", "about.html", "about"], ["Contact", "contact.html", "contact"]];
    var h = K.$("#hdr"), f = K.$("#ftr"), uu = K.get("kk_user", null);
    var acct = uu && uu.name ? "Hi, " + esc(String(uu.name).split(" ")[0]) : "Create account";
    if (h) h.innerHTML = '<div class="bar">' + esc(C.notice || "") + '</div><header class="hd" id="hd"><a class="logo d" href="index.html">Keepsake <b>Kart</b></a><button class="menu" id="mn" type="button" aria-label="Menu" aria-expanded="false" aria-controls="nav">&#9776;</button><nav class="nav" id="nav" aria-label="Main">' +
      links.map(function (l) { return '<a href="' + l[1] + '"' + (l[2] === pg ? ' aria-current="page"' : "") + ">" + l[0] + "</a>"; }).join("") +
      '</nav><form class="srch" action="search.html" method="get" role="search"><label class="sr" for="hq">Search products</label><input id="hq" name="q" type="search" placeholder="Search name or brand" autocomplete="off" value="' + (pg === "search" ? esc(K.qs.get("q") || "") : "") + '"></form><a class="cartbtn" href="wishlist.html"' + (pg === "wishlist" ? ' aria-current="page"' : "") + '>Wishlist <span id="wcnt" aria-label="saved items">0</span></a><a class="cartbtn acct" href="account.html"' + (pg === "account" ? ' aria-current="page"' : "") + '>' + acct + '</a><a class="cartbtn" href="cart.html"' + (pg === "cart" ? ' aria-current="page"' : "") + '>Cart <span id="cnt" aria-label="items in cart">0</span></a></header>';
    if (f) f.innerHTML = '<footer class="ft"><div><div class="logo d">Keepsake <b>Kart</b></div><p>Mini treasures that turn small moments into keepsakes that last forever.</p></div><nav class="fl" aria-label="Shop"><b>Shop</b><a href="collections.html">All collections</a><a href="search.html">All products</a><a href="category.html?c=Pre-Orders">Pre-orders</a><a href="cart.html">Cart</a></nav><nav class="fl" aria-label="Store"><b>Store</b><a href="about.html">About us</a><a href="blog.html">Blog</a><a href="policies.html">Shipping, payment &amp; returns</a><a href="privacy.html">Privacy policy</a><a href="terms.html">Terms of use</a><a href="account.html">My account</a></nav><div class="fl"><b>Reach us</b>' +
      (C.whatsapp ? '<a href="https://wa.me/' + esc(String(C.whatsapp).replace(/\D/g, "")) + '" rel="noopener">WhatsApp</a>' : "") + (C.email ? '<a href="mailto:' + esc(C.email) + '">' + esc(C.email) + "</a>" : "") + (C.instagram ? '<a href="' + esc(C.instagram) + '" rel="noopener">Instagram</a>' : "") + '<a href="contact.html">Contact form</a></div><p class="fine fw">&copy; 2026 Keepsake Kart.</p></footer>';
    var mn = K.$("#mn");
    if (mn) {
      mn.addEventListener("click", function () { var o = K.$("#hd").classList.toggle("open"); mn.setAttribute("aria-expanded", String(o)); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape" && K.$("#hd").classList.contains("open")) { K.$("#hd").classList.remove("open"); mn.setAttribute("aria-expanded", "false"); mn.focus(); } });
    }
    K.badge();
  };
  document.addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest("[data-act]") : null; if (!b) return;
    var a = b.getAttribute("data-act"), id = b.getAttribute("data-id"), r;
    if (a === "add" || a === "inc") { r = K.add(id, 1); if (r === 1 && a === "add") K.toast("Added to cart"); if (r === -1) { var pp = K.byId(id); K.toast(pp && K.avail(pp) < C.maxQty ? "Only " + K.avail(pp) + " available" : "Maximum " + C.maxQty + " per order for this item"); } }
    else if (a === "dec") K.add(id, -1);
    else if (a === "rm") { delete K.cart[id]; K.saveCart(); }
    else if (a === "rmc") { K.set("kk_coupon", ""); document.dispatchEvent(new Event("kk:cart")); }
    else if (a === "wish") K.toggleWish(id);
  });
  K.chrome();
})();
