(function () {
  "use strict";
  var K = window.KK, C = K.C, P = K.P, $ = K.$, esc = K.esc, app = $("#app"), page = document.body.getAttribute("data-page");
  var pages = {};
  function head(e, t, s) { return '<div class="pghead"><p class="eyebrow">' + e + '</p><h1 class="d">' + t + "</h1>" + (s ? '<p class="lead">' + s + "</p>" : "") + "</div>"; }
  function grid(l) { return '<div class="grid">' + l.map(K.card).join("") + "</div>"; }
  function none(t) { return head("Oops", t) + '<section class="wrap"><a class="btn solid" href="index.html">Back to home</a></section>'; }
  function rowSection(t, l) { return l.length ? '<section class="wrap"><h2 class="d sh">' + t + "</h2>" + grid(l) + "</section>" : ""; }
  function brandStrip() {
    var b = []; P.forEach(function (p) { if (b.indexOf(p.brand) < 0) b.push(p.brand); });
    return b.length ? '<nav class="brands" aria-label="Brands"><span>Brands</span>' + b.map(function (x) { return '<a href="search.html?q=' + encodeURIComponent(x) + '">' + esc(x) + "</a>"; }).join("") + "</nav>" : "";
  }
  function inStockFirst(l) { return l.slice().sort(function (a, b) { return Number(b.stock) - Number(a.stock); }); }
  function mins(po) { return Math.max(1, Math.round(po.body.join(" ").split(/\s+/).length / 200)); }
  function removedNote() { if (K.removed.length) { K.toast("Removed unavailable items: " + K.removed.join(", ")); K.removed = []; } }

  function listing(items, mount, o) {
    o = o || {};
    var st = { s: "feat", stock: false, brand: "All", cat: "All" }, brands = ["All"], cats = ["All"];
    items.forEach(function (p) { if (brands.indexOf(p.brand) < 0) brands.push(p.brand); if (cats.indexOf(p.cat) < 0) cats.push(p.cat); });
    mount.innerHTML = '<div class="tools">' + (brands.length > 2 ? '<div class="chips" id="bf" role="group" aria-label="Filter by brand"></div>' : "") +
      (o.cats && cats.length > 2 ? '<label class="sel"><span class="sr">Category</span><select id="cf">' + cats.map(function (c) { return "<option>" + esc(c) + "</option>"; }).join("") + "</select></label>" : "") +
      '<label class="chk"><input type="checkbox" id="stock"> In stock only</label><label class="sel"><span class="sr">Sort products</span><select id="sort"><option value="feat">Featured</option><option value="lo">Price: low to high</option><option value="hi">Price: high to low</option><option value="az">Name: A to Z</option></select></label><p class="fine rc" id="rc" role="status"></p></div><div id="res"></div>';
    function chips() { var bf = $("#bf", mount); if (bf) bf.innerHTML = brands.map(function (b) { return '<button class="chip" type="button" data-b="' + esc(b) + '" aria-pressed="' + (b === st.brand) + '">' + esc(b) + "</button>"; }).join(""); }
    function draw() {
      var r = inStockFirst(items.filter(function (p) { return (!st.stock || p.stock) && (st.brand === "All" || p.brand === st.brand) && (st.cat === "All" || p.cat === st.cat); }));
      if (st.s === "lo") r.sort(function (a, b) { return a.price - b.price; });
      if (st.s === "hi") r.sort(function (a, b) { return b.price - a.price; });
      if (st.s === "az") r.sort(function (a, b) { return a.name.replace(/^\W+/, "").localeCompare(b.name.replace(/^\W+/, "")); });
      $("#rc").textContent = r.length + (r.length === 1 ? " product" : " products");
      $("#res", mount).innerHTML = r.length ? grid(r) : '<p class="empty">No products match these filters. Try clearing a filter or turning off "In stock only".</p>';
    }
    $("#stock", mount).addEventListener("change", function (e) { st.stock = e.target.checked; draw(); });
    $("#sort", mount).addEventListener("change", function (e) { st.s = e.target.value; draw(); });
    var cf = $("#cf", mount); if (cf) cf.addEventListener("change", function (e) { st.cat = e.target.value; draw(); });
    var bf = $("#bf", mount); if (bf) bf.addEventListener("click", function (e) { var b = e.target.closest ? e.target.closest("[data-b]") : null; if (b) { st.brand = b.getAttribute("data-b"); chips(); draw(); } });
    chips(); draw();
  }
  function catTile(c) {
    var n = P.filter(function (p) { return p.cat === c.name; }).length;
    return '<a class="col" href="' + K.cu(c.name) + '"><span class="ct">' + (n ? n + (n === 1 ? " item" : " items") : "Coming soon") + '</span><span class="n d">' + esc(c.name) + '</span><span class="s">' + esc(c.d) + '</span><span class="go" aria-hidden="true">&rarr;</span></a>';
  }
  function postTile(x, big) {
    return '<a class="col post' + (big ? " big" : "") + '" href="blog.html?p=' + encodeURIComponent(x.slug) + '"><span class="ct">' + esc(x.tag) + " &middot; " + K.date(x.date) + " &middot; " + mins(x) + ' min read</span><span class="n d">' + esc(x.title) + '</span><span class="s">' + esc(x.summary) + '</span><span class="go" aria-hidden="true">&rarr;</span></a>';
  }

  pages.home = function () {
    var S = [
      { h: "Small cars.<br><b>Serious</b> collection.", e: "1:64 scale &middot; Curated for collectors", t: "Hand-picked Hot Wheels, imports and collector finds.", b: "Shop all", l: "search.html", c: "#C9A45C" },
      { h: "Fresh in the <b>garage</b>.", e: "New arrivals", t: "The latest pieces to land, ready for your collection.", b: "See new arrivals", l: "#arrivals", c: "#2F6FB5" },
      { h: "Imported <b>finds</b>.", e: "Malaysian and US imports", t: "Hard-to-find editions you will not see on local shelves.", b: "Shop imports", l: K.cu("Imported"), c: "#C23B3B" }
    ];
    var wa = C.whatsapp ? "https://wa.me/" + esc(String(C.whatsapp).replace(/\D/g, "")) : "contact.html";
    app.innerHTML = '<h1 class="sr">Keepsake Kart: premium die-cast collectibles</h1><section class="hero" aria-roledescription="carousel" aria-label="Featured banners">' +
      S.map(function (s, i) { return '<div class="slide" role="group" aria-label="Banner ' + (i + 1) + ' of ' + S.length + '"' + (i ? " hidden" : "") + '><div><p class="eyebrow">' + s.e + '</p><h2 class="hh d">' + s.h + '</h2><p class="lead">' + s.t + '</p><a class="btn solid" href="' + s.l + '">' + s.b + '</a></div><div class="heroart" aria-hidden="true">' + K.car(s.c) + "</div></div>"; }).join("") +
      '<div class="dots"><button type="button" id="pv" aria-label="Previous banner">&lsaquo;</button><button type="button" id="ps" aria-label="Pause banner rotation">Pause</button><button type="button" id="nx" aria-label="Next banner">&rsaquo;</button><span id="dt" aria-live="off">1 / ' + S.length + '</span></div></section>' +
      brandStrip() + rowSection("Recently viewed", K.recent(null, 4)) + '<section class="wrap"><p class="eyebrow">Shop by</p><h2 class="d sh">Featured Collections</h2><div class="grid3">' + K.cats.slice(0, 4).map(catTile).join("") + '</div><p><a class="btn" href="collections.html">All collections</a></p></section>' +
      '<section class="wrap" id="arrivals"><p class="eyebrow">Just landed</p><h2 class="d sh">New Arrivals</h2>' + grid(inStockFirst(P).slice(0, 8)) + '<p><a class="btn" href="search.html">View all products</a></p></section>' +
      '<section class="wrap feats">' + C.highlights.map(function (h) { return '<div><h3 class="d">' + esc(h.t) + "</h3><p>" + esc(h.d) + "</p></div>"; }).join("") + "</section>" +
      (K.posts.length ? '<section class="wrap"><p class="eyebrow">Journal</p><h2 class="d sh">From the Blog</h2><div class="grid3">' + K.posts.slice(0, 3).map(function (x) { return postTile(x); }).join("") + "</div></section>" : "") +
      '<section class="wrap"><div class="cta"><div><h2 class="d">Hunting a specific casting?</h2><p>Tell us what you are after and we will try to source it.</p></div><a class="btn solid" href="' + wa + '"' + (C.whatsapp ? ' rel="noopener"' : "") + ">" + (C.whatsapp ? "Message us on WhatsApp" : "Contact us") + "</a></div></section>";
    var sl = Array.prototype.slice.call(app.querySelectorAll(".slide")), i = 0, timer = null, paused = false;
    function show(n) { i = (n + sl.length) % sl.length; sl.forEach(function (s, k) { s.hidden = k !== i; }); $("#dt").textContent = (i + 1) + " / " + sl.length; }
    function stop() { clearInterval(timer); timer = null; }
    function play() { if (!paused && !timer) timer = setInterval(function () { show(i + 1); }, 6500); }
    $("#pv").addEventListener("click", function () { show(i - 1); });
    $("#nx").addEventListener("click", function () { show(i + 1); });
    $("#ps").addEventListener("click", function () { paused = !paused; this.textContent = paused ? "Play" : "Pause"; this.setAttribute("aria-label", paused ? "Resume banner rotation" : "Pause banner rotation"); paused ? stop() : play(); });
    var hero = $(".hero");
    hero.addEventListener("mouseenter", stop); hero.addEventListener("mouseleave", play);
    hero.addEventListener("focusin", stop); hero.addEventListener("focusout", play);
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { paused = true; $("#ps").textContent = "Play"; $("#ps").setAttribute("aria-label", "Resume banner rotation"); } else play();
    K.ld({ "@context": "https://schema.org", "@type": "Organization", name: C.store, url: K.abs("") || undefined });
  };

  pages.collections = function () {
    app.innerHTML = head("Browse", "All Collections", "Every product category in one place.") + '<section class="wrap"><div class="grid3">' + K.cats.map(catTile).join("") + "</div></section>";
  };

  pages.category = function () {
    var name = K.qs.get("c") || "", c = K.cats.filter(function (x) { return x.name.toLowerCase() === name.toLowerCase(); })[0];
    if (!c) { K.meta("Category not found - " + C.store, "This category does not exist."); app.innerHTML = none("Category not found"); return; }
    K.meta(c.name + " die-cast cars - " + C.store, c.d + " Shop " + c.name + " at " + C.store + ".");
    var items = P.filter(function (p) { return p.cat === c.name; });
    app.innerHTML = head('<a href="collections.html">Collections</a> / ' + esc(c.name), esc(c.name), esc(c.d)) + '<section class="wrap" id="list"></section>';
    if (items.length) listing(items, $("#list"));
    else $("#list").innerHTML = '<p class="empty">Coming soon. Want something from this category? <a href="contact.html">Message us</a> and we will try to source it.</p>';
  };

  pages.product = function () {
    var p = K.byId(K.qs.get("id") || "");
    if (!p) { K.meta("Product not found - " + C.store, "This product does not exist."); app.innerHTML = none("Product not found"); return; }
    K.seen(p.id);
    K.meta(p.name + " - " + C.store, p.desc + " " + K.money(p.price) + (p.stock ? " - in stock." : " - currently sold out."));
    var auto = !(p.images && p.images.length);
    var imgs = !auto ? p.images.slice() : (C.photos ? ["assets/img/" + p.id + ".jpg"] : []);
    var rv = K.reviewsFor(p.id), avg = rv.length ? rv.reduce(function (n, r) { return n + r.rating; }, 0) / rv.length : 0;
    var stk = p.stock ? (K.low(p) ? "Only " + p.qty + " left" : "In stock") : "Sold out", dis = p.stock ? "" : " disabled";
    var gal = imgs.length ? '<button class="zoom" id="zm" type="button" aria-label="Enlarge photo"><img class="pimg" id="mainimg" src="' + esc(imgs[0]) + '" alt="' + esc(p.name) + '" width="800" height="600" data-c="' + esc(p.color) + '"></button><div class="thumbs" id="thb"></div>' : K.car(p.color, p.name);
    var revs = rv.length ? rv.map(function (r) { return '<div class="rev"><div>' + K.stars(r.rating) + " <b>" + esc(r.name) + '</b> <span class="fine">' + K.date(r.date) + "</span></div><p>" + esc(r.text) + "</p></div>"; }).join("") : '<p class="empty">No reviews yet. Bought this? <a href="contact.html?review=' + encodeURIComponent(p.id) + '">Share your review</a>.</p>';
    app.innerHTML = '<section class="wrap pd"><div><nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> / <a href="' + K.cu(p.cat) + '">' + esc(p.cat) + '</a> / <span aria-current="page">' + esc(p.name) + '</span></nav><div class="gal">' + gal + '</div></div><div class="info buybox"><p class="eyebrow">' + esc(p.brand) + " &middot; " + esc(p.cat) + '</p><h1 class="d">' + esc(p.name) + "</h1>" + (rv.length ? '<p class="rate">' + K.stars(avg) + ' <a href="#reviews">' + avg.toFixed(1) + " (" + rv.length + ")</a></p>" : "") + '<p class="pp big">' + K.money(p.price) + '</p><p class="stk ' + (p.stock ? (K.low(p) ? "low" : "in") : "no") + '">' + stk + "</p><p>" + esc(p.desc) + '</p><div class="buy"><label class="sr" for="pq">Quantity</label><div class="qty q2"><button type="button" id="qd" aria-label="Decrease quantity"' + dis + '>&minus;</button><input id="pq" type="number" min="1" max="' + Math.max(1, K.avail(p)) + '" value="1"' + dis + '><button type="button" id="qu" aria-label="Increase quantity"' + dis + '>+</button></div><button id="addq" class="btn solid" type="button"' + dis + ">" + (p.stock ? "Add to cart" : "Sold out") + '</button></div><p class="acts"><button id="buyn" class="btn" type="button"' + dis + ">Buy now</button>" + K.wishBtn(p, true) + '</p><p class="fine">Up to ' + K.avail(p) + ' per order. <a href="policies.html">Shipping, payment &amp; returns</a></p>' + (p.stock ? "" : '<p class="fine">Want it back in stock? <a href="contact.html">Message us</a>.</p>') + '</div></section><section class="wrap" id="details"><h2 class="d sh">Details</h2><dl class="dl"><dt>Brand</dt><dd>' + esc(p.brand) + "</dd><dt>Category</dt><dd>" + esc(p.cat) + "</dd><dt>Availability</dt><dd>" + stk + "</dd><dt>Product code</dt><dd>" + esc(p.id) + '</dd></dl></section><section class="wrap" id="reviews"><h2 class="d sh">Reviews</h2>' + revs + "</section>" +
      rowSection("You may also like", K.reco([p], 4, [p.id])) + rowSection("Recently viewed", K.recent(p.id, 4)) +
      '<div class="mbar"><span class="pp">' + K.money(p.price) + '</span><button id="addm" class="btn solid" type="button"' + dis + ">" + (p.stock ? "Add to cart" : "Sold out") + "</button></div>";
    function add() {
      var q = Math.floor(Number($("#pq").value));
      if (!(q >= 1)) { K.toast("Enter a quantity of 1 or more"); return false; }
      var room = K.avail(p) - (K.cart[p.id] || 0);
      if (room <= 0) { K.toast(K.avail(p) < C.maxQty ? "You already have all " + K.avail(p) + " available in your cart" : "You already have the maximum (" + C.maxQty + ") in your cart"); return !!K.cart[p.id]; }
      var n = Math.min(q, room); K.add(p.id, n);
      K.toast(n < q ? "Added " + n + " (only " + K.avail(p) + " available per order)" : n + (n === 1 ? " item" : " items") + " added to cart");
      return true;
    }
    function step(d) { var el = $("#pq"), v = Math.floor(Number(el.value)) || 1; el.value = Math.max(1, Math.min(K.avail(p), v + d)); }
    $("#addq").addEventListener("click", add);
    $("#addm").addEventListener("click", add);
    $("#buyn").addEventListener("click", function () { if (add()) window.location.href = "checkout.html"; });
    $("#qd").addEventListener("click", function () { step(-1); });
    $("#qu").addEventListener("click", function () { step(1); });
    function thumbs() {
      var t = $("#thb"); if (!t) return;
      t.innerHTML = imgs.length > 1 ? imgs.map(function (u, k) { return '<button type="button" class="thb" data-src="' + esc(u) + '" aria-label="Show photo ' + (k + 1) + " of " + imgs.length + '"><img src="' + esc(u) + '" alt="" width="64" height="64"></button>'; }).join("") : "";
    }
    function probe(k) {
      if (k > 5 || typeof Image === "undefined") return;
      var im = new Image(), u = "assets/img/" + p.id + "-" + k + ".jpg";
      im.onload = function () { imgs.push(u); thumbs(); probe(k + 1); };
      im.src = u;
    }
    if (imgs.length) { thumbs(); if (auto && C.photos) probe(2); }
    app.addEventListener("click", function (e) {
      var t = e.target.closest ? e.target.closest(".thb") : null, m = $("#mainimg");
      if (t && m) { m.src = t.getAttribute("data-src"); return; }
      var z = e.target.closest ? e.target.closest("#zm") : null;
      if (z && m && m.tagName === "IMG") lightbox(m.src, p.name, z);
    });
    if (K.abs("")) {
      var ld = { "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.desc, sku: p.id, brand: { "@type": "Brand", name: p.brand }, offers: { "@type": "Offer", url: K.abs(K.pu(p.id)), priceCurrency: "INR", price: p.price, availability: "https://schema.org/" + (p.stock ? "InStock" : "OutOfStock") } };
      if (rv.length) ld.aggregateRating = { "@type": "AggregateRating", ratingValue: avg.toFixed(1), reviewCount: rv.length };
      K.ld(ld);
    }
  };
  function lightbox(src, alt, back) {
    var d = document.createElement("div");
    d.className = "lb"; d.setAttribute("role", "dialog"); d.setAttribute("aria-modal", "true"); d.setAttribute("aria-label", "Photo viewer");
    d.innerHTML = '<button type="button" class="x" aria-label="Close photo">&times;</button><img src="' + esc(src) + '" alt="' + esc(alt) + '">';
    document.body.appendChild(d);
    function close() { d.remove(); document.removeEventListener("keydown", key); if (back && back.focus) back.focus(); }
    function key(e) { if (e.key === "Escape") close(); }
    d.addEventListener("click", close); document.addEventListener("keydown", key);
    d.querySelector(".x").focus();
  }

  pages.search = function () {
    var q = (K.qs.get("q") || "").trim().slice(0, 80), ql = q.toLowerCase();
    var items = P.filter(function (p) { return !ql || (p.name + " " + p.brand + " " + p.cat).toLowerCase().indexOf(ql) > -1; });
    K.meta((q ? "Search: " + q : "All products") + " - " + C.store, "Search die-cast cars by name or brand at " + C.store + ".");
    app.innerHTML = head("Search", q ? "Results for &ldquo;" + esc(q) + "&rdquo;" : "All Products", "Search by name or brand using the box at the top of the page.") + '<section class="wrap" id="list"></section>';
    if (items.length) listing(items, $("#list"), { cats: true });
    else $("#list").innerHTML = '<p class="empty">Nothing matched &ldquo;' + esc(q) + '&rdquo;. Try a brand like Hot Wheels, or browse <a href="collections.html">all collections</a>.</p>';
  };

  function cartHtml() {
    var ids = Object.keys(K.cart);
    if (!ids.length) return '<div class="empty box"><p>Your cart is empty.</p><a class="btn solid" href="search.html">Browse products</a></div>';
    var cp = K.couponNow(), sub = K.subtotal(), disc = cp && !cp.err ? cp.discount : 0;
    return '<div class="cartgrid"><div class="box">' + ids.map(function (id) {
      var p = K.byId(id), q = K.cart[id], full = q >= K.avail(p);
      return '<div class="it"><a class="th" href="' + K.pu(id) + '" tabindex="-1" aria-hidden="true">' + K.img(p, "") + '</a><div><a class="pn" href="' + K.pu(id) + '">' + esc(p.name) + '</a><div class="fine">' + K.money(p.price) + ' each</div><div class="qty"><button type="button" data-act="dec" data-id="' + id + '" aria-label="Decrease quantity of ' + esc(p.name) + '">&minus;</button><span aria-live="polite">' + q + '</span><button type="button" data-act="inc" data-id="' + id + '" aria-label="Increase quantity of ' + esc(p.name) + '"' + (full ? " disabled" : "") + ">+</button></div>" + (full ? '<div class="fine">' + (K.avail(p) < C.maxQty ? "All available stock is in your cart" : "Maximum per order") + "</div>" : K.low(p) ? '<div class="fine">Only ' + p.qty + " left</div>" : "") + '</div><div><b>' + K.money(p.price * q) + '</b><br><button class="rm" type="button" data-act="rm" data-id="' + id + '" aria-label="Remove ' + esc(p.name) + '">Remove</button></div></div>';
    }).join("") + '</div><aside class="box sum" aria-label="Order summary"><h2 class="d">Summary</h2><div class="sl"><span>' + K.count() + (K.count() === 1 ? " item" : " items") + "</span><span></span></div>" +
      '<div class="sl"><span>Subtotal</span><span>' + K.money(sub) + "</span></div>" +
      (disc ? '<div class="sl"><span>Coupon ' + esc(cp.code) + ' <button class="rm" type="button" data-act="rmc">Remove</button></span><span>-' + K.money(disc) + "</span></div>" : "") +
      '<div class="tot"><span>Total</span><b>' + K.money(sub - disc) + "</b></div>" +
      (K.coupons().length && !disc ? '<form id="cpf" class="cpn" novalidate><label class="sr" for="cpc">Coupon code</label><input id="cpc" name="code" placeholder="Coupon code" autocomplete="off" maxlength="30"><button class="btn sm" type="submit">Apply</button></form>' : "") +
      (cp && cp.err ? '<p class="err">' + esc(cp.err) + "</p>" : "") +
      '<p class="fine">Shipping and payment are chosen at checkout.</p><a class="btn solid" href="checkout.html">Checkout</a><a class="btn" href="search.html">Continue shopping</a></aside></div>';
  }
  pages.cart = function () {
    function draw() {
      var ids = Object.keys(K.cart);
      app.innerHTML = head("Your order", "Cart") + '<section class="wrap">' + cartHtml() + "</section>" + (ids.length ? rowSection("You may also like", K.reco(ids.map(function (id) { return K.byId(id); }), 4, ids)) : "") + rowSection("Recently viewed", K.recent(null, 4));
    }
    removedNote(); draw(); document.addEventListener("kk:cart", draw);
    app.addEventListener("submit", function (e) {
      if (e.target.id !== "cpf") return;
      e.preventDefault();
      var v = e.target.elements.code.value.trim();
      if (!v) { K.toast("Enter a coupon code"); return; }
      var r = K.couponCheck(v, K.subtotal());
      if (r.err) { K.toast(r.err); return; }
      K.set("kk_coupon", r.code); K.toast("Coupon applied: " + r.code); document.dispatchEvent(new Event("kk:cart"));
    });
  };

  pages.checkout = function () {
    var done = false, placing = false;
    function shipSel() { var r = document.querySelector('input[name="ship"]:checked'); var id = r ? r.value : C.shipping[0].id; return C.shipping.filter(function (s) { return s.id === id; })[0] || C.shipping[0]; }
    function paySel() { var r = document.querySelector('input[name="pay"]:checked'); var id = r ? r.value : C.payments[0].id; return C.payments.filter(function (s) { return s.id === id; })[0] || C.payments[0]; }
    function totals() { var sh = shipSel(), cp = K.couponNow(), d = cp && !cp.err ? cp.discount : 0; $("#ssub").textContent = K.money(K.subtotal()); $("#srow").hidden = !d; if (d) { $("#sdl").textContent = "Coupon " + cp.code; $("#sdv").textContent = "-" + K.money(d); } $("#sshp").textContent = K.money(sh.price); $("#stot").textContent = K.money(K.subtotal() - d + sh.price); }
    function radios(n, l) { return l.map(function (o, k) { return '<label class="opt"><input type="radio" name="' + n + '" value="' + esc(o.id) + '"' + (k ? "" : " checked") + "><span>" + esc(o.label) + (o.price !== undefined ? " &mdash; " + K.money(o.price) : "") + "</span></label>"; }).join(""); }
    function draw() {
      if (done) return;
      if (!K.count()) { app.innerHTML = head("Checkout", "Checkout") + '<section class="wrap"><div class="empty box"><p>Your cart is empty.</p><a class="btn solid" href="search.html">Browse products</a></div></section>'; return; }
      var u = K.get("kk_user", {}) || {};
      var sum = Object.keys(K.cart).map(function (id) { var p = K.byId(id); return '<div class="sl"><span>' + esc(p.name) + " &times; " + K.cart[id] + "</span><span>" + K.money(p.price * K.cart[id]) + "</span></div>"; }).join("");
      var opts = '<option value="">Select state</option>' + K.STATES.map(function (s) { return "<option>" + esc(s) + "</option>"; }).join("");
      app.innerHTML = head("Almost there", "Checkout") + '<section class="wrap"><div class="cartgrid"><form id="co" class="form box" novalidate><h2 class="d">1. Delivery address</h2><div class="two">' + K.field("Full name", "name", 'autocomplete="name" maxlength="60" value="' + esc(u.name || "") + '"') + K.field("Mobile number (WhatsApp)", "phone", 'autocomplete="tel" inputmode="tel" maxlength="16" value="' + esc(u.phone || "") + '"') + "</div>" + K.field("Email", "email", 'type="email" autocomplete="email" maxlength="120" value="' + esc(u.email || "") + '"') + K.field("Address (house, street, area)", "address", 'rows="3" maxlength="200" autocomplete="street-address"', "textarea") + '<div class="two">' + K.field("City", "city", 'autocomplete="address-level2" maxlength="50"') + K.field("State", "state", 'autocomplete="address-level1"', "select", opts) + "</div>" + K.field("PIN code", "pin", 'inputmode="numeric" maxlength="6" autocomplete="postal-code"') + '<h2 class="d">2. Shipping</h2><div class="opts" role="radiogroup" aria-label="Shipping method">' + radios("ship", C.shipping) + '</div><h2 class="d">3. Payment</h2><div class="opts" role="radiogroup" aria-label="Payment method">' + radios("pay", C.payments) + '</div><p class="fine">' + esc(C.checkoutNote) + ' <a href="policies.html">Read our policies</a>.</p><div class="fld"><label class="chk"><input type="checkbox" id="f-consent" name="consent"> I have checked my address and order details.</label><span class="err" id="e-consent"></span></div><button class="btn solid" id="place" type="submit">Place order</button></form><aside class="box sum" aria-label="Order summary"><h2 class="d">Order summary</h2>' + sum + '<div class="sl"><span>Subtotal</span><span id="ssub"></span></div><div class="sl" id="srow" hidden><span id="sdl"></span><span id="sdv"></span></div><div class="sl"><span>Shipping</span><span id="sshp"></span></div><div class="tot"><span>Total</span><b id="stot"></b></div><a class="btn" href="cart.html">Edit cart</a></aside></div></section>';
      totals();
      $("#co").addEventListener("change", totals);
      $("#co").addEventListener("submit", onSubmit);
    }
    function onSubmit(e) {
      e.preventDefault(); if (placing) return;
      var f = e.target;
      var rm = K.fix();
      if (rm.length) { K.toast("Removed unavailable items: " + rm.join(", ")); draw(); return; }
      if (!K.count()) { draw(); return; }
      var cp0 = K.couponNow();
      if (cp0 && cp0.err) { K.set("kk_coupon", ""); K.toast("Coupon removed: " + cp0.err); draw(); return; }
      var dsc = cp0 ? cp0.discount : 0;
      var ok = K.validate(f, ["name", "phone", "email", "address", "city", "state", "pin"]);
      var ce = $("#e-consent"), cc = f.elements.consent;
      ce.textContent = cc.checked ? "" : "Please confirm before placing your order."; cc.setAttribute("aria-invalid", String(!cc.checked));
      if (!cc.checked && ok) { cc.focus(); ok = false; }
      if (!cc.checked) ok = false;
      if (!ok) { K.toast("Please fix the highlighted fields"); return; }
      placing = true; $("#place").disabled = true;
      var sh = shipSel(), pay = paySel(), v = function (n) { return f.elements[n].value.trim(); };
      var items = Object.keys(K.cart).map(function (id) { var p = K.byId(id); return { id: id, name: p.name, price: p.price, qty: K.cart[id] }; });
      var sub = items.reduce(function (n, i) { return n + i.price * i.qty; }, 0);
      var o = { id: "KK" + Date.now().toString(36).toUpperCase(), date: new Date().toISOString(), items: items, subtotal: sub, discount: dsc, coupon: dsc ? cp0.code : "", shipping: sh.price, shipLabel: sh.label, total: sub - dsc + sh.price, pay: pay.label, status: "Awaiting confirmation", customer: { name: v("name"), phone: K.phoneNorm(v("phone")), email: v("email"), address: v("address") + ", " + v("city") + ", " + v("state") + " - " + v("pin") } };
      var orders = K.get("kk_orders", []); if (!Array.isArray(orders)) orders = [];
      orders.unshift(o); K.set("kk_orders", orders);
      var msg = "New order " + o.id + " - " + C.store + "\n\n" + items.map(function (i) { return "- " + i.name + " x " + i.qty + " = " + K.money(i.price * i.qty); }).join("\n") + "\n\nSubtotal: " + K.money(o.subtotal) + (o.discount ? "\nCoupon " + o.coupon + ": -" + K.money(o.discount) : "") + "\n" + o.shipLabel + ": " + K.money(o.shipping) + "\nTotal: " + K.money(o.total) + "\nPayment: " + o.pay + "\n\nName: " + o.customer.name + "\nPhone: " + o.customer.phone + "\nEmail: " + o.customer.email + "\nAddress: " + o.customer.address;
      done = true; K.cart = {}; K.set("kk_coupon", ""); K.saveCart();
      var sent = K.wa(msg);
      K.meta("Order placed - " + C.store, "Your order has been placed.");
      app.innerHTML = head("Thank you", "Order placed") + '<section class="wrap"><div class="box ok"><p>Your order number is <b>' + esc(o.id) + "</b>. " + (sent ? "WhatsApp opened with your order details. Please send the message so we can confirm stock and payment." : "Please copy your order details below and send them to us so we can confirm stock and payment.") + '</p><label class="sr" for="ordtxt">Order details</label><textarea id="ordtxt" rows="10" readonly>' + esc(msg) + '</textarea><p class="acts"><button class="btn" id="cp" type="button">Copy order details</button>' + (sent ? "" : "") + '<a class="btn solid" href="account.html">View my orders</a></p></div></section>';
      $("#cp").addEventListener("click", function () { K.copy(msg, "Order details copied"); });
    }
    removedNote(); draw();
  };

  pages.contact = function () {
    app.innerHTML = head("We are here to help", "Contact Us", "Questions, special requests or help with an order? Send us a message.") + '<section class="wrap cartgrid"><form id="cf" class="form box" novalidate>' + K.field("Your name", "name", 'autocomplete="name" maxlength="60"') + K.field("Email", "email", 'type="email" autocomplete="email" maxlength="120"') + K.field("How can we help?", "msg", 'rows="6" maxlength="1000"', "textarea") + '<button class="btn solid" type="submit">Send message</button></form><aside class="box sum" aria-label="Contact details"><h2 class="d">Support</h2>' + (C.whatsapp ? '<p>WhatsApp: <a href="https://wa.me/' + esc(String(C.whatsapp).replace(/\D/g, "")) + '" rel="noopener">+' + esc(String(C.whatsapp).replace(/\D/g, "")) + "</a></p>" : "") + (C.email ? '<p>Email: <a href="mailto:' + esc(C.email) + '">' + esc(C.email) + "</a></p>" : "") + (C.instagram ? '<p><a href="' + esc(C.instagram) + '" rel="noopener">Instagram</a></p>' : "") + (!C.whatsapp && !C.email ? '<p class="fine">Use the form and we will get back to you.</p>' : "") + '<p class="fine"><a href="policies.html">Shipping, payment &amp; returns</a></p></aside></section>';
    var rid = K.qs.get("review"), rp = rid ? K.byId(rid) : null;
    if (rp) $("#f-msg").value = "Review for " + rp.name + ":\nRating (1 to 5): \nMy review: ";
    $("#cf").addEventListener("submit", function (e) {
      e.preventDefault(); var f = e.target;
      if (!K.validate(f, ["name", "email", "msg"])) return;
      var m = "Message from " + f.elements.name.value.trim() + " (" + f.elements.email.value.trim() + "):\n\n" + f.elements.msg.value.trim();
      if (K.wa(m)) { K.toast("Opening WhatsApp"); f.reset(); }
      else if (C.email) window.location.href = "mailto:" + C.email + "?subject=" + encodeURIComponent("Message from the website") + "&body=" + encodeURIComponent(m);
      else K.copy(m, "Message copied. Add your WhatsApp or email in config.js so messages can be sent directly.");
    });
  };

  pages.about = function () {
    app.innerHTML = head("Our story", "About Us", "Mini treasures that turn small moments into keepsakes that last forever.") + '<section class="wrap prose"><p>Keepsake Kart is a store for die-cast collectors. We hand-pick Hot Wheels, imported editions and collector finds so you can build a collection you are proud of.</p><p>We confirm every order personally, so you always know what is in stock and how to pay before anything ships.</p><p>Cannot find a casting you are hunting? <a href="contact.html">Tell us</a> and we will try to source it.</p><p class="acts"><a class="btn solid" href="collections.html">Explore collections</a><a class="btn" href="policies.html">Shipping, payment &amp; returns</a></p></section>';
  };

  pages.policies = function () {
    var pol = C.policies || {}, any = pol.shipping || pol.payment || pol.returns;
    function sec(t, s) { return s ? "<h2 class=\"d\">" + t + "</h2>" + String(s).split(/\n\s*\n/).map(function (x) { return "<p>" + esc(x) + "</p>"; }).join("") : ""; }
    app.innerHTML = head("Good to know", "Shipping, Payment &amp; Returns") + '<section class="wrap prose">' + (any ? sec("Shipping", pol.shipping) + sec("Payment", pol.payment) + sec("Returns", pol.returns) : '<p>Our shipping, payment and returns details are being finalised. Please <a href="contact.html">contact us</a> before ordering and we will confirm everything with you.</p>') + '<p class="acts"><a class="btn" href="contact.html">Contact us</a></p></section>';
  };

  pages.blog = function () {
    var slug = K.qs.get("p"), idx = -1;
    K.posts.forEach(function (x, k) { if (x.slug === slug) idx = k; });
    if (slug && idx < 0) { K.meta("Post not found - " + C.store, "This blog post does not exist."); app.innerHTML = none("Post not found"); return; }
    if (idx >= 0) {
      var po = K.posts[idx], nx = K.posts[idx - 1], pv = K.posts[idx + 1];
      K.meta(po.title + " - " + C.store, po.summary);
      app.innerHTML = head('<a href="blog.html">Blog</a> / ' + esc(po.tag), esc(po.title), K.date(po.date) + " &middot; " + mins(po) + " min read") + '<article class="wrap prose">' + po.body.map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("") + '</article><nav class="wrap pn2" aria-label="More posts">' + (pv ? '<a href="blog.html?p=' + encodeURIComponent(pv.slug) + '" rel="prev"><span>&larr; Older</span>' + esc(pv.title) + "</a>" : "<span></span>") + (nx ? '<a href="blog.html?p=' + encodeURIComponent(nx.slug) + '" rel="next"><span>Newer &rarr;</span>' + esc(nx.title) + "</a>" : "<span></span>") + "</nav>";
      if (K.abs("")) K.ld({ "@context": "https://schema.org", "@type": "BlogPosting", headline: po.title, datePublished: po.date, description: po.summary, mainEntityOfPage: K.abs("blog.html?p=" + po.slug) });
      return;
    }
    var tags = ["All"]; K.posts.forEach(function (x) { if (tags.indexOf(x.tag) < 0) tags.push(x.tag); });
    var cur = "All";
    app.innerHTML = head("Journal", "Blog", "Collecting guides and store announcements.") + '<section class="wrap"><div class="chips" id="tg" role="group" aria-label="Filter posts"></div><div class="grid3" id="pl" aria-live="polite"></div></section>';
    function draw() {
      $("#tg").innerHTML = tags.map(function (t) { return '<button class="chip" type="button" data-t="' + esc(t) + '" aria-pressed="' + (t === cur) + '">' + esc(t) + "</button>"; }).join("");
      var l = K.posts.filter(function (x) { return cur === "All" || x.tag === cur; });
      $("#pl").innerHTML = l.length ? l.map(function (x) { return postTile(x); }).join("") : '<p class="empty">No posts yet.</p>';
    }
    $("#tg").addEventListener("click", function (e) { var b = e.target.closest ? e.target.closest("[data-t]") : null; if (b) { cur = b.getAttribute("data-t"); draw(); } });
    draw();
  };

  pages.account = function () {
    function help(o) { var m = "Hi, I need help with order " + o.id + "."; if (!K.wa(m)) K.copy(m, "Message copied. Send it to us from the contact page."); }
    function draw() {
      var u = K.get("kk_user", null);
      var note = '<p class="fine box">Your profile and orders are saved in this browser only. They will not appear on other devices and will be lost if you clear your browser data.</p>';
      if (!u || typeof u !== "object") {
        app.innerHTML = head("My account", "Sign in", "Create a profile on this device to speed up checkout and keep your order history.") + '<section class="wrap"><form id="uf" class="form box" novalidate>' + K.field("Full name", "name", 'autocomplete="name" maxlength="60"') + K.field("Email", "email", 'type="email" autocomplete="email" maxlength="120"') + K.field("Mobile number (WhatsApp)", "phone", 'autocomplete="tel" inputmode="tel" maxlength="16"') + '<button class="btn solid" type="submit">Continue</button></form>' + note + "</section>";
        $("#uf").addEventListener("submit", function (e) {
          e.preventDefault(); var f = e.target;
          if (!K.validate(f, ["name", "email", "phone"])) return;
          K.set("kk_user", { name: f.elements.name.value.trim(), email: f.elements.email.value.trim(), phone: K.phoneNorm(f.elements.phone.value) });
          draw();
        });
        return;
      }
      var tab = window.location.hash === "#profile" ? "profile" : "orders", orders = K.get("kk_orders", []); if (!Array.isArray(orders)) orders = [];
      var body;
      if (tab === "orders") {
        body = orders.length ? orders.map(function (o, k) {
          return '<details class="box ord"' + (k === 0 ? " open" : "") + '><summary><b>' + esc(o.id) + '</b><span>' + K.date(o.date) + '</span><span class="stat">' + esc(o.status) + '</span><b>' + K.money(o.total) + '</b></summary>' + o.items.map(function (i) { return '<div class="sl"><span>' + esc(i.name) + " &times; " + i.qty + "</span><span>" + K.money(i.price * i.qty) + "</span></div>"; }).join("") + '<div class="sl"><span>Subtotal</span><span>' + K.money(o.subtotal) + '</span></div>' + (o.discount ? '<div class="sl"><span>Coupon ' + esc(o.coupon) + '</span><span>-' + K.money(o.discount) + "</span></div>" : "") + '<div class="sl"><span>' + esc(o.shipLabel || "Shipping") + '</span><span>' + K.money(o.shipping) + '</span></div><div class="tot"><span>Total</span><b>' + K.money(o.total) + '</b></div><p class="fine">Payment: ' + esc(o.pay) + '<br>Deliver to: ' + esc(o.customer.name) + ", " + esc(o.customer.address) + '<br>Contact: ' + esc(o.customer.phone) + '</p><p class="acts"><button class="btn sm" type="button" data-o="' + k + '" data-a="again">Order again</button><button class="btn sm" type="button" data-o="' + k + '" data-a="help">Ask about this order</button></p></details>';
        }).join("") + '<p><button class="rm" type="button" id="clr">Clear order history from this device</button></p>' : '<div class="empty box"><p>You have not placed any orders yet.</p><a class="btn solid" href="search.html">Start shopping</a></div>';
      } else {
        body = '<form id="pf" class="form box" novalidate>' + K.field("Full name", "name", 'autocomplete="name" maxlength="60" value="' + esc(u.name || "") + '"') + K.field("Email", "email", 'type="email" autocomplete="email" maxlength="120" value="' + esc(u.email || "") + '"') + K.field("Mobile number (WhatsApp)", "phone", 'autocomplete="tel" inputmode="tel" maxlength="16" value="' + esc(u.phone || "") + '"') + '<button class="btn solid" type="submit">Save profile</button></form>';
      }
      app.innerHTML = head("My account", "Hi, " + esc(String(u.name).split(" ")[0])) + '<section class="wrap"><nav class="chips" aria-label="Account sections"><a class="chip" href="#orders"' + (tab === "orders" ? ' aria-current="page"' : "") + ">Orders (" + orders.length + ')</a><a class="chip" href="#profile"' + (tab === "profile" ? ' aria-current="page"' : "") + '>Profile</a><button class="chip" id="so" type="button">Sign out</button></nav><div class="acc">' + body + note + "</div></section>";
      $("#so").addEventListener("click", function () { try { localStorage.removeItem("kk_user"); } catch (e) {} draw(); });
      var pf = $("#pf");
      if (pf) pf.addEventListener("submit", function (e) {
        e.preventDefault(); var f = e.target;
        if (!K.validate(f, ["name", "email", "phone"])) return;
        K.set("kk_user", { name: f.elements.name.value.trim(), email: f.elements.email.value.trim(), phone: K.phoneNorm(f.elements.phone.value) });
        K.toast("Profile saved"); draw();
      });
      var clr = $("#clr");
      if (clr) clr.addEventListener("click", function () { if (window.confirm("Remove all saved orders from this device?")) { K.set("kk_orders", []); draw(); } });
      var acc = $(".acc");
      acc.addEventListener("click", function (e) {
        var b = e.target.closest ? e.target.closest("[data-a]") : null; if (!b) return;
        var o = orders[Number(b.getAttribute("data-o"))]; if (!o) return;
        if (b.getAttribute("data-a") === "help") { help(o); return; }
        var added = 0, skipped = 0;
        o.items.forEach(function (i) { var p = K.byId(i.id); if (p && p.stock) { K.add(i.id, Math.min(i.qty, C.maxQty)); added++; } else skipped++; });
        K.toast(added ? "Added to cart" + (skipped ? " (" + skipped + " unavailable item" + (skipped > 1 ? "s" : "") + " skipped)" : "") : "These items are no longer available");
      });
    }
    draw(); window.addEventListener("hashchange", draw);
  };

  pages.wishlist = function () {
    function draw() {
      var l = K.wl.map(function (id) { return K.byId(id); }).filter(Boolean);
      app.innerHTML = head("Saved for later", "Wishlist", l.length ? l.length + (l.length === 1 ? " saved car" : " saved cars") : "") + '<section class="wrap">' + (l.length ? grid(l) + '<p><button class="btn" id="wall" type="button">Add all in-stock to cart</button></p>' : '<div class="empty box"><p>Your wishlist is empty. Tap the heart on any car to save it. Your list is saved in this browser.</p><a class="btn solid" href="search.html">Browse products</a></div>') + "</section>";
      var b = $("#wall");
      if (b) b.addEventListener("click", function () { var n = 0; l.forEach(function (p) { if (p.stock && K.add(p.id, 1) === 1) n++; }); K.toast(n ? n + " added to cart" : "Nothing new to add"); });
    }
    draw(); document.addEventListener("kk:wish", draw);
  };

  pages.notfound = function () { K.meta("Page not found - " + C.store, "This page does not exist."); app.innerHTML = none("Page not found"); };

  if (pages[page]) pages[page]();
})();
