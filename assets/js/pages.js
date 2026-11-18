(function () {
  "use strict";
  var K = window.KK, C = K.C, P = K.P, $ = K.$, esc = K.esc, app = $("#app"), page = document.body.getAttribute("data-page");
  function head(e, t, s) { return '<div class="pghead"><p class="eyebrow">' + e + '</p><h1 class="d">' + t + "</h1>" + (s ? '<p class="lead">' + s + "</p>" : "") + "</div>"; }
  function grid(l) { return '<div class="grid">' + l.map(K.card).join("") + "</div>"; }
  function none(t) { return head("Oops", t) + '<p><a class="btn solid" href="index.html">Back to home</a></p>'; }
  function inStockFirst(l) { return l.slice().sort(function (a, b) { return Number(b.stock) - Number(a.stock); }); }
  function listing(items, mount) {
    var st = { s: "feat", stock: false };
    mount.innerHTML = '<div class="tools"><label class="chk"><input type="checkbox" id="stock"> In stock only</label><label class="sel"><span class="sr">Sort</span><select id="sort"><option value="feat">Featured</option><option value="lo">Price: low to high</option><option value="hi">Price: high to low</option></select></label></div><div id="res"></div>';
    function draw() {
      var r = inStockFirst(items.filter(function (p) { return !st.stock || p.stock; }));
      if (st.s === "lo") r.sort(function (a, b) { return a.price - b.price; });
      if (st.s === "hi") r.sort(function (a, b) { return b.price - a.price; });
      $("#res", mount).innerHTML = r.length ? grid(r) : '<p class="empty">No products found.</p>';
    }
    $("#stock", mount).addEventListener("change", function (e) { st.stock = e.target.checked; draw(); });
    $("#sort", mount).addEventListener("change", function (e) { st.s = e.target.value; draw(); });
    draw();
  }
  function catTile(c) {
    var n = P.filter(function (p) { return p.cat === c.name; }).length;
    return '<a class="col" href="' + K.cu(c.name) + '"><span class="n d">' + esc(c.name) + '</span><span class="s">' + esc(c.d) + '</span><span class="ct">' + (n ? n + " items" : "Coming soon") + "</span></a>";
  }
  function check(f, rules) {
    var ok = true;
    Object.keys(rules).forEach(function (n) {
      var el = f.elements[n], good = rules[n].test(el.value.trim());
      el.classList.toggle("bad", !good); if (!good) ok = false;
    });
    if (!ok) K.toast("Please check the highlighted fields");
    return ok;
  }
  var R = { name: /^.{2,}$/, phone: /^[0-9+\s-]{10,15}$/, email: /^\S+@\S+\.\S+$/, text: /^[\s\S]{3,}$/, pin: /^\d{6}$/ };
  var pages = {};

  pages.home = function () {
    var S = [
      { h: "Small cars.<br><b>Serious</b> collection.", e: "1:64 scale · Curated for collectors", t: "Hand-picked Hot Wheels, imports and collector finds, shipped across India.", b: "Shop all", l: "search.html", c: "#C9A45C" },
      { h: "Fresh in the <b>garage</b>.", e: "New arrivals", t: "The latest pieces to land, ready to ship.", b: "See new arrivals", l: "#arrivals", c: "#2F6FB5" },
      { h: "Imported <b>finds</b>.", e: "Malaysian & US imports", t: "Hard-to-find editions you won’t see on local shelves.", b: "Shop imports", l: K.cu("Imported"), c: "#C23B3B" }
    ];
    app.innerHTML = '<h1 class="sr">Keepsake Kart — premium die-cast collectibles</h1><section class="hero" aria-label="Featured banners">' +
      S.map(function (s, i) { return '<div class="slide' + (i ? "" : " on") + '"><div><p class="eyebrow">' + s.e + '</p><h2 class="hh d">' + s.h + '</h2><p class="lead">' + s.t + '</p><a class="btn solid" href="' + s.l + '">' + s.b + '</a></div><div class="heroart" aria-hidden="true">' + K.car(s.c) + "</div></div>"; }).join("") +
      '<div class="dots"><button type="button" id="pv" aria-label="Previous banner">‹</button><span id="dt">1 / 3</span><button type="button" id="nx" aria-label="Next banner">›</button></div></section>' +
      '<section class="wrap"><p class="eyebrow">Shop by</p><h2 class="d sh">Featured Collections</h2><div class="grid3">' + K.cats.slice(0, 4).map(catTile).join("") + '</div><p><a class="btn" href="collections.html">All collections</a></p></section>' +
      '<section class="wrap" id="arrivals"><p class="eyebrow">Just landed</p><h2 class="d sh">New Arrivals</h2>' + grid(inStockFirst(P).slice(0, 8)) + '<p><a class="btn" href="search.html">View all products</a></p></section>' +
      '<section class="wrap feats"><div><h3 class="d">Authentic only</h3><p>Genuine licensed pieces. No fakes, no repacks.</p></div><div><h3 class="d">Collector-safe packing</h3><p>Cards and blisters protected so it arrives mint.</p></div><div><h3 class="d">Delivered across India</h3><p>Shipping to every pin code. Prepaid only.</p></div><div><h3 class="d">Rare finds on request</h3><p>Hunting a casting? Message us and we’ll source it.</p></div></section>';
    var i = 0, sl = app.querySelectorAll ? Array.prototype.slice.call(app.querySelectorAll(".slide")) : [];
    function show(n) { i = (n + sl.length) % sl.length; sl.forEach(function (s, k) { s.classList.toggle("on", k === i); }); $("#dt").textContent = (i + 1) + " / " + sl.length; }
    $("#pv").addEventListener("click", function () { show(i - 1); });
    $("#nx").addEventListener("click", function () { show(i + 1); });
    if (!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) setInterval(function () { show(i + 1); }, 6500);
  };

  pages.collections = function () {
    app.innerHTML = head("Browse", "All Collections", "Every product category in one place.") + '<section class="wrap"><div class="grid3">' + K.cats.map(catTile).join("") + "</div></section>";
  };

  pages.category = function () {
    var name = K.qs.get("c") || "", c = K.cats.filter(function (x) { return x.name.toLowerCase() === name.toLowerCase(); })[0];
    if (!c) { app.innerHTML = none("Category not found"); return; }
    document.title = c.name + " — " + C.store;
    var items = P.filter(function (p) { return p.cat === c.name; });
    app.innerHTML = head('<a href="collections.html">Collections</a> / ' + esc(c.name), esc(c.name), esc(c.d)) + '<section class="wrap" id="list"></section>';
    if (items.length) listing(items, $("#list"));
    else $("#list").innerHTML = '<p class="empty">Coming soon. Want something from this category? <a href="contact.html">Message us</a> and we’ll source it.</p>';
  };

  pages.product = function () {
    var p = K.byId(K.qs.get("id") || "");
    if (!p) { app.innerHTML = none("Product not found"); return; }
    document.title = p.name + " — " + C.store;
    var im = p.images && p.images.length ? p.images : null;
    var gal = im ? '<img id="mainimg" src="' + esc(im[0]) + '" alt="' + esc(p.name) + '">' + (im.length > 1 ? '<div class="thumbs">' + im.map(function (u, k) { return '<button type="button" class="thb" data-src="' + esc(u) + '" aria-label="Image ' + (k + 1) + '"><img src="' + esc(u) + '" alt=""></button>'; }).join("") + "</div>" : "") : K.car(p.color);
    var rel = P.filter(function (x) { return x.id !== p.id && x.cat === p.cat; }).slice(0, 4);
    app.innerHTML = '<section class="wrap pd"><div><p class="crumbs"><a href="index.html">Home</a> / <a href="' + K.cu(p.cat) + '">' + esc(p.cat) + "</a></p><div class=\"gal\">" + gal + '</div></div><div class="info"><p class="eyebrow">' + esc(p.brand) + " · " + esc(p.cat) + '</p><h1 class="d">' + esc(p.name) + '</h1><p class="pp big">' + K.money(p.price) + '</p><p class="stk ' + (p.stock ? "in" : "no") + '">' + (p.stock ? "In stock" : "Sold out") + '</p><p>' + esc(p.desc) + '</p><div class="buy"><label class="sr" for="pq">Quantity</label><input id="pq" type="number" min="1" max="99" value="1"' + (p.stock ? "" : " disabled") + '><button id="addq" class="btn solid" type="button"' + (p.stock ? "" : " disabled") + ">" + (p.stock ? "Add to cart" : "Sold out") + '</button></div><p class="fine">Ships across India · prepaid orders · authenticity guaranteed.</p>' + (p.stock ? "" : '<p class="fine">Want it back in stock? <a href="contact.html">Message us</a>.</p>') + "</div></section>" +
      (rel.length ? '<section class="wrap"><h2 class="d sh">More from ' + esc(p.cat) + "</h2>" + grid(rel) + "</section>" : "");
    $("#addq").addEventListener("click", function () {
      var q = Math.max(1, Math.min(99, parseInt($("#pq").value, 10) || 1));
      if (K.add(p.id, q)) K.toast(q + " added to cart");
    });
    var m = $("#mainimg");
    if (m) app.addEventListener("click", function (e) { var t = e.target.closest(".thb"); if (t) m.src = t.getAttribute("data-src"); });
  };

  pages.search = function () {
    var q = (K.qs.get("q") || "").trim(), ql = q.toLowerCase();
    var items = P.filter(function (p) { return !ql || (p.name + " " + p.brand + " " + p.cat).toLowerCase().indexOf(ql) > -1; });
    app.innerHTML = head("Search", q ? "Results for “" + esc(q) + "”" : "All Products", items.length + (items.length === 1 ? " product" : " products") + " found. Search by name or brand.") + '<section class="wrap" id="list"></section>';
    if (items.length) listing(items, $("#list"));
    else $("#list").innerHTML = '<p class="empty">Nothing matched. Try a brand like “Hot Wheels” or browse <a href="collections.html">all collections</a>.</p>';
  };

  function cartHtml() {
    var ids = Object.keys(K.cart);
    if (!ids.length) return '<p class="empty">Your cart is empty. <a href="search.html">Browse products</a></p>';
    return '<div class="cartgrid"><div class="box">' + ids.map(function (id) {
      var p = K.byId(id);
      return '<div class="it"><a class="th" href="' + K.pu(id) + '">' + K.car(p.color) + '</a><div><a href="' + K.pu(id) + '">' + esc(p.name) + '</a><div class="qty"><button type="button" data-act="dec" data-id="' + id + '" aria-label="Decrease quantity">−</button><span>' + K.cart[id] + '</span><button type="button" data-act="inc" data-id="' + id + '" aria-label="Increase quantity">+</button></div></div><div><b>' + K.money(p.price * K.cart[id]) + '</b><br><button class="rm" type="button" data-act="rm" data-id="' + id + '">Remove</button></div></div>';
    }).join("") + '</div><aside class="box sum"><h2 class="d">Summary</h2><div class="tot"><span>Subtotal</span><b>' + K.money(K.subtotal()) + '</b></div><p class="fine">Shipping and payment are chosen at checkout.</p><a class="btn solid" href="checkout.html">Checkout</a></aside></div>';
  }
  pages.cart = function () {
    function draw() { app.innerHTML = head("Your order", "Cart") + '<section class="wrap">' + cartHtml() + "</section>"; }
    draw(); document.addEventListener("kk:cart", draw);
  };

  pages.checkout = function () {
    var done = false;
    function shipSel() { var r = document.querySelector('input[name="ship"]:checked'); var id = r ? r.value : C.shipping[0].id; return C.shipping.filter(function (s) { return s.id === id; })[0] || C.shipping[0]; }
    function totals() { var sh = shipSel(); $("#ssub").textContent = K.money(K.subtotal()); $("#sshp").textContent = K.money(sh.price); $("#stot").textContent = K.money(K.subtotal() + sh.price); }
    function draw() {
      if (done) return;
      if (!K.count()) { app.innerHTML = head("Checkout", "Checkout") + '<p class="empty">Your cart is empty. <a href="search.html">Browse products</a></p>'; return; }
      var u = K.get("kk_user", {}) || {};
      var sum = Object.keys(K.cart).map(function (id) { var p = K.byId(id); return "<div class=\"sl\"><span>" + esc(p.name) + " × " + K.cart[id] + "</span><span>" + K.money(p.price * K.cart[id]) + "</span></div>"; }).join("");
      function radios(n, l) { return l.map(function (o, k) { return '<label class="opt"><input type="radio" name="' + n + '" value="' + o.id + '"' + (k ? "" : " checked") + "><span>" + esc(o.label) + (o.price !== undefined ? " — " + K.money(o.price) : "") + "</span></label>"; }).join(""); }
      app.innerHTML = head("Almost there", "Checkout") + '<section class="wrap"><div class="cartgrid"><form id="co" class="form box" novalidate><h2 class="d">1. Delivery address</h2><div class="two"><input name="name" placeholder="Full name" autocomplete="name" value="' + esc(u.name || "") + '"><input name="phone" placeholder="Phone (WhatsApp)" autocomplete="tel" inputmode="tel" value="' + esc(u.phone || "") + '"></div><input name="email" placeholder="Email" autocomplete="email" value="' + esc(u.email || "") + '"><textarea name="address" rows="3" placeholder="House, street, area" autocomplete="street-address"></textarea><div class="two"><input name="city" placeholder="City" autocomplete="address-level2"><input name="state" placeholder="State" autocomplete="address-level1"></div><input name="pin" placeholder="PIN code" inputmode="numeric" maxlength="6" autocomplete="postal-code"><h2 class="d">2. Shipping</h2>' + radios("ship", C.shipping) + '<h2 class="d">3. Payment</h2>' + radios("pay", C.payments) + '<p class="fine">Prepaid orders only. We confirm stock and share payment details on WhatsApp before dispatch.</p><button class="btn solid" type="submit">Place order</button></form><aside class="box sum"><h2 class="d">Order summary</h2>' + sum + '<div class="sl"><span>Subtotal</span><span id="ssub"></span></div><div class="sl"><span>Shipping</span><span id="sshp"></span></div><div class="tot"><span>Total</span><b id="stot"></b></div></aside></div></section>';
      totals();
      $("#co").addEventListener("change", totals);
      $("#co").addEventListener("submit", function (e) {
        e.preventDefault();
        var f = e.target;
        if (!check(f, { name: R.name, phone: R.phone, email: R.email, address: /^[\s\S]{6,}$/, city: R.name, state: R.name, pin: R.pin })) return;
        var sh = shipSel(), pay = C.payments.filter(function (x) { return x.id === (document.querySelector('input[name="pay"]:checked') || {}).value; })[0] || C.payments[0];
        var items = Object.keys(K.cart).map(function (id) { var p = K.byId(id); return { id: id, name: p.name, price: p.price, qty: K.cart[id] }; });
        var v = function (n) { return f.elements[n].value.trim(); };
        var o = { id: "KK" + Date.now().toString(36).toUpperCase(), date: new Date().toISOString(), items: items, subtotal: K.subtotal(), shipping: sh.price, shipLabel: sh.label, total: K.subtotal() + sh.price, pay: pay.label, status: "Awaiting confirmation", customer: { name: v("name"), phone: v("phone"), email: v("email"), address: v("address") + ", " + v("city") + ", " + v("state") + " - " + v("pin") } };
        var orders = K.get("kk_orders", []); if (!Array.isArray(orders)) orders = [];
        orders.unshift(o); K.set("kk_orders", orders);
        var msg = "New order " + o.id + " — " + C.store + "\n\n" + items.map(function (i) { return "• " + i.name + " × " + i.qty + " — " + K.money(i.price * i.qty); }).join("\n") + "\n\nSubtotal: " + K.money(o.subtotal) + "\n" + o.shipLabel + ": " + K.money(o.shipping) + "\nTotal: " + K.money(o.total) + "\nPayment: " + o.pay + "\n\nName: " + o.customer.name + "\nPhone: " + o.customer.phone + "\nEmail: " + o.customer.email + "\nAddress: " + o.customer.address;
        done = true; K.cart = {}; K.saveCart();
        var sent = K.wa(msg);
        app.innerHTML = head("Thank you", "Order placed") + '<section class="wrap"><div class="box ok"><p>Your order number is <b>' + o.id + "</b>. " + (sent ? "WhatsApp opened with your order details. Send the message so we can confirm stock and payment." : "Copy your order details below and send them to us so we can confirm stock and payment.") + '</p><textarea id="ordtxt" rows="9" readonly>' + esc(msg) + '</textarea><p><button class="btn" id="cp" type="button">Copy order details</button> <a class="btn solid" href="account.html">View my orders</a></p></div></section>';
        $("#cp").addEventListener("click", function () { K.copy(msg, "Order copied"); });
      });
    }
    draw();
  };

  pages.contact = function () {
    app.innerHTML = head("We’re here", "Contact Us", "Questions, special requests or help with an order? Send us a message.") + '<section class="wrap cartgrid"><form id="cf" class="form box" novalidate><input name="name" placeholder="Your name" autocomplete="name"><input name="email" placeholder="Email" autocomplete="email"><textarea name="msg" rows="6" placeholder="How can we help?"></textarea><button class="btn solid" type="submit">Send message</button></form><aside class="box sum"><h2 class="d">Support</h2>' + (C.whatsapp ? "<p>WhatsApp: +" + esc(String(C.whatsapp).replace(/\D/g, "")) + "</p>" : "") + (C.email ? '<p>Email: <a href="mailto:' + esc(C.email) + '">' + esc(C.email) + "</a></p>" : "") + '<p class="fine">Replies on WhatsApp are usually fastest. Prepaid orders only; all sales are final.</p></aside></section>';
    $("#cf").addEventListener("submit", function (e) {
      e.preventDefault(); var f = e.target;
      if (!check(f, { name: R.name, email: R.email, msg: R.text })) return;
      var m = "Message from " + f.elements.name.value.trim() + " (" + f.elements.email.value.trim() + "):\n\n" + f.elements.msg.value.trim();
      if (K.wa(m)) { K.toast("Opening WhatsApp…"); f.reset(); }
      else if (C.email) { window.location.href = "mailto:" + C.email + "?subject=" + encodeURIComponent("Message from the website") + "&body=" + encodeURIComponent(m); }
      else K.copy(m, "Message copied. Add your WhatsApp or email in config.js to send directly.");
    });
  };

  pages.about = function () {
    app.innerHTML = head("Our story", "About Us", "Mini treasures that turn small moments into keepsakes that last forever.") + '<section class="wrap prose"><p>Keepsake Kart is an India-based store for die-cast collectors. We hand-pick Hot Wheels, imported editions and collector finds so you can build a collection you’re proud of.</p><p>Every piece is authentic and packed with care so it reaches you in collector condition. We ship across India and take prepaid orders, confirming every order on WhatsApp.</p><p>Can’t find a casting you’re hunting? <a href="contact.html">Tell us</a> and we’ll try to source it.</p><p><a class="btn solid" href="collections.html">Explore collections</a></p></section>';
  };

  pages.blog = function () {
    var slug = K.qs.get("p"), po = K.posts.filter(function (x) { return x.slug === slug; })[0];
    function fmt(d) { return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
    if (slug && !po) { app.innerHTML = none("Post not found"); return; }
    if (po) {
      document.title = po.title + " — " + C.store;
      app.innerHTML = head(esc(po.tag) + " · " + fmt(po.date), esc(po.title)) + '<section class="wrap prose">' + po.body.map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("") + '<p><a class="btn" href="blog.html">← All posts</a></p></section>';
      return;
    }
    app.innerHTML = head("Journal", "Blog", "Collecting guides and store announcements.") + '<section class="wrap"><div class="grid3">' + K.posts.map(function (x) { return '<a class="col post" href="blog.html?p=' + encodeURIComponent(x.slug) + '"><span class="ct">' + esc(x.tag) + " · " + fmt(x.date) + '</span><span class="n d">' + esc(x.title) + '</span><span class="s">' + esc(x.body[0]) + "</span></a>"; }).join("") + "</div></section>";
  };

  pages.account = function () {
    function draw() {
      var u = K.get("kk_user", null);
      if (!u || typeof u !== "object") {
        app.innerHTML = head("My account", "Sign in", "Create a profile on this device to save your details and see your orders.") + '<section class="wrap"><form id="uf" class="form box" novalidate><input name="name" placeholder="Full name" autocomplete="name"><input name="email" placeholder="Email" autocomplete="email"><input name="phone" placeholder="Phone (WhatsApp)" autocomplete="tel" inputmode="tel"><button class="btn solid" type="submit">Continue</button><p class="fine">Your profile and orders are stored only in this browser. There is no password to remember.</p></form></section>';
        $("#uf").addEventListener("submit", function (e) {
          e.preventDefault(); var f = e.target;
          if (!check(f, { name: R.name, email: R.email, phone: R.phone })) return;
          K.set("kk_user", { name: f.elements.name.value.trim(), email: f.elements.email.value.trim(), phone: f.elements.phone.value.trim() });
          draw();
        });
        return;
      }
      var tab = window.location.hash === "#profile" ? "profile" : "orders", orders = K.get("kk_orders", []); if (!Array.isArray(orders)) orders = [];
      var body;
      if (tab === "orders") {
        body = orders.length ? orders.map(function (o) {
          return '<div class="box ord"><div class="sl"><b>' + esc(o.id) + "</b><span>" + new Date(o.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) + '</span></div><p class="fine">' + esc(o.status) + " · " + esc(o.pay) + "</p>" + o.items.map(function (i) { return '<div class="sl"><span>' + esc(i.name) + " × " + i.qty + "</span><span>" + K.money(i.price * i.qty) + "</span></div>"; }).join("") + '<div class="tot"><span>Total</span><b>' + K.money(o.total) + "</b></div></div>";
        }).join("") : '<p class="empty">No orders yet. <a href="search.html">Start shopping</a></p>';
      } else {
        body = '<form id="pf" class="form box" novalidate><input name="name" placeholder="Full name" value="' + esc(u.name) + '"><input name="email" placeholder="Email" value="' + esc(u.email) + '"><input name="phone" placeholder="Phone" value="' + esc(u.phone) + '"><button class="btn solid" type="submit">Save profile</button></form>';
      }
      app.innerHTML = head("My account", "Hi, " + esc(String(u.name).split(" ")[0])) + '<section class="wrap"><div class="chips"><a class="chip" href="#orders" aria-pressed="' + (tab === "orders") + '">Orders</a><a class="chip" href="#profile" aria-pressed="' + (tab === "profile") + '">Profile</a><button class="chip" id="so" type="button">Sign out</button></div><div class="acc">' + body + "</div></section>";
      $("#so").addEventListener("click", function () { try { localStorage.removeItem("kk_user"); } catch (e) {} draw(); });
      var pf = $("#pf");
      if (pf) pf.addEventListener("submit", function (e) {
        e.preventDefault(); var f = e.target;
        if (!check(f, { name: R.name, email: R.email, phone: R.phone })) return;
        K.set("kk_user", { name: f.elements.name.value.trim(), email: f.elements.email.value.trim(), phone: f.elements.phone.value.trim() });
        K.toast("Profile saved"); draw();
      });
    }
    draw(); window.addEventListener("hashchange", draw);
  };

  if (pages[page]) pages[page]();
})();
