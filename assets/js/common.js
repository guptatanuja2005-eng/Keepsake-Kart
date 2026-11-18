(function () {
  "use strict";
  var C = window.KK_CONFIG, P = window.KK_PRODUCTS, K = (window.KK = { C: C, P: P, cats: window.KK_CATS, posts: window.KK_POSTS });
  K.$ = function (s, r) { return (r || document).querySelector(s); };
  K.esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  K.money = function (n) { return C.currency + Number(n).toLocaleString("en-IN"); };
  K.byId = function (id) { return P.filter(function (p) { return p.id === id; })[0]; };
  K.get = function (k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v === null || v === undefined ? d : v; } catch (e) { return d; } };
  K.set = function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  K.qs = new URLSearchParams(window.location.search);
  K.pu = function (id) { return "product.html?id=" + encodeURIComponent(id); };
  K.cu = function (c) { return "category.html?c=" + encodeURIComponent(c); };
  K.car = function (c) {
    return '<svg viewBox="0 0 200 100" role="img" aria-label="Model car"><path d="M10 70c0-9 4-13 12-15l30-7 22-19c3-3 6-4 10-4h50c6 0 10 2 14 6l18 17 22 5c8 2 12 6 12 14v9H10z" fill="' + c + '"/><path d="M70 33h36v15H56zM114 33h22l16 15h-38z" fill="#0B0B0D" opacity=".55"/><circle cx="55" cy="80" r="15" fill="#0B0B0D"/><circle cx="55" cy="80" r="6" fill="#8d8d93"/><circle cx="150" cy="80" r="15" fill="#0B0B0D"/><circle cx="150" cy="80" r="6" fill="#8d8d93"/></svg>';
  };
  K.cart = K.get("kk_cart", {});
  if (typeof K.cart !== "object" || K.cart === null) K.cart = {};
  Object.keys(K.cart).forEach(function (id) { if (!K.byId(id) || !(K.cart[id] > 0)) delete K.cart[id]; });
  K.count = function () { return Object.keys(K.cart).reduce(function (n, id) { return n + K.cart[id]; }, 0); };
  K.subtotal = function () { return Object.keys(K.cart).reduce(function (n, id) { return n + K.byId(id).price * K.cart[id]; }, 0); };
  K.badge = function () { var b = K.$("#cnt"); if (b) b.textContent = K.count(); };
  K.saveCart = function () { K.set("kk_cart", K.cart); K.badge(); document.dispatchEvent(new Event("kk:cart")); };
  K.toast = function (m) {
    var t = K.$("#toast"); if (!t) return;
    t.textContent = m; t.classList.add("on"); clearTimeout(K.toast.t);
    K.toast.t = setTimeout(function () { t.classList.remove("on"); }, 2400);
  };
  K.add = function (id, d) {
    var p = K.byId(id); if (!p || (d > 0 && !p.stock)) return false;
    K.cart[id] = Math.min(99, (K.cart[id] || 0) + d);
    if (K.cart[id] <= 0) delete K.cart[id];
    K.saveCart(); return true;
  };
  K.wa = function (msg) {
    var n = String(C.whatsapp || "").replace(/\D/g, ""); if (!n) return false;
    window.open("https://wa.me/" + n + "?text=" + encodeURIComponent(msg), "_blank", "noopener"); return true;
  };
  K.copy = function (t, ok) {
    try { navigator.clipboard.writeText(t).then(function () { K.toast(ok); }, function () { K.toast("Could not copy"); }); } catch (e) { K.toast("Could not copy"); }
  };
  K.card = function (p) {
    return '<article class="card' + (p.stock ? "" : " out") + '"><a class="ph" href="' + K.pu(p.id) + '" aria-label="View ' + K.esc(p.name) + '"><span class="tag' + (p.stock ? "" : " out") + '">' + (p.stock ? K.esc(p.cat) : "Sold out") + "</span>" + K.car(p.color) + '</a><div class="cb"><a class="pn" href="' + K.pu(p.id) + '">' + K.esc(p.name) + '</a><div class="row"><span class="pp">' + K.money(p.price) + '</span><button class="btn" type="button" data-act="add" data-id="' + p.id + '"' + (p.stock ? "" : " disabled") + ">" + (p.stock ? "Add" : "Sold out") + "</button></div></div></article>";
  };
  K.chrome = function () {
    var pg = document.body.getAttribute("data-page"), esc = K.esc;
    var links = [["Home", "index.html", "home"], ["Collections", "collections.html", "collections"], ["Blog", "blog.html", "blog"], ["About", "about.html", "about"], ["Contact", "contact.html", "contact"]];
    var h = K.$("#hdr"), f = K.$("#ftr");
    if (h) h.innerHTML = '<div class="bar">All-India delivery · 100% authentic · Prepaid orders</div><header class="hd" id="hd"><a class="logo d" href="index.html">Keepsake <b>Kart</b></a><button class="menu" id="mn" type="button" aria-label="Menu" aria-expanded="false">☰</button><nav class="nav" aria-label="Main">' +
      links.map(function (l) { return '<a href="' + l[1] + '"' + (l[2] === pg ? ' aria-current="page"' : "") + ">" + l[0] + "</a>"; }).join("") +
      '</nav><form class="srch" action="search.html" method="get" role="search"><label class="sr" for="hq">Search</label><input id="hq" name="q" type="search" placeholder="Search name or brand…" autocomplete="off" value="' + (pg === "search" ? esc(K.qs.get("q") || "") : "") + '"></form><a class="cartbtn" href="account.html">Account</a><a class="cartbtn" href="cart.html">Cart <span id="cnt">0</span></a></header>';
    if (f) f.innerHTML = '<footer class="ft"><div><div class="logo d">Keepsake <b>Kart</b></div><p>Mini treasures that turn small moments into keepsakes that last forever.</p></div><div class="fl"><b>Shop</b><a href="collections.html">All collections</a><a href="search.html">All products</a><a href="cart.html">Cart</a></div><div class="fl"><b>Store</b><a href="about.html">About us</a><a href="blog.html">Blog</a><a href="contact.html">Contact</a><a href="account.html">My account</a></div><div class="fl"><b>Reach us</b>' +
      (C.whatsapp ? "<span>WhatsApp: +" + esc(String(C.whatsapp).replace(/\D/g, "")) + "</span>" : "") + (C.email ? '<a href="mailto:' + esc(C.email) + '">' + esc(C.email) + "</a>" : "") + (C.instagram ? '<a href="' + esc(C.instagram) + '" rel="noopener">Instagram</a>' : "") + '<a href="contact.html">Contact form</a></div><p class="fine fw">All items are collectibles and all sales are final. © 2026 Keepsake Kart.</p></footer>';
    var mn = K.$("#mn");
    if (mn) mn.addEventListener("click", function () { var o = K.$("#hd").classList.toggle("open"); mn.setAttribute("aria-expanded", String(o)); });
    K.badge();
  };
  document.addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest("[data-act]") : null; if (!b) return;
    var a = b.getAttribute("data-act"), id = b.getAttribute("data-id");
    if (a === "add") { if (K.add(id, 1)) K.toast("Added to cart"); }
    else if (a === "inc") K.add(id, 1); else if (a === "dec") K.add(id, -1);
    else if (a === "rm") { delete K.cart[id]; K.saveCart(); }
  });
  K.chrome();
})();
