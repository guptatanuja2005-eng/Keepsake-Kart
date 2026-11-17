(function () {
  "use strict";
  var C = window.KK_CONFIG, P = window.KK_PRODUCTS, cart = {}, st = { f: "All", q: "", s: "feat", stock: false };
  function $(s) { return document.querySelector(s); }
  try { cart = JSON.parse(localStorage.getItem("kk_cart") || "{}") || {}; } catch (e) { cart = {}; }
  function byId(id) { return P.filter(function (p) { return p.id === id; })[0]; }
  Object.keys(cart).forEach(function (id) { if (!byId(id) || !(cart[id] > 0)) delete cart[id]; });
  function save() { try { localStorage.setItem("kk_cart", JSON.stringify(cart)); } catch (e) {} }
  function money(n) { return C.currency + n.toLocaleString("en-IN"); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function car(c) {
    return '<svg viewBox="0 0 200 100" role="img" aria-label="Model car"><path d="M10 70c0-9 4-13 12-15l30-7 22-19c3-3 6-4 10-4h50c6 0 10 2 14 6l18 17 22 5c8 2 12 6 12 14v9H10z" fill="' + c + '"/><path d="M70 33h36v15H56zM114 33h22l16 15h-38z" fill="#0B0B0D" opacity=".55"/><circle cx="55" cy="80" r="15" fill="#0B0B0D"/><circle cx="55" cy="80" r="6" fill="#8d8d93"/><circle cx="150" cy="80" r="15" fill="#0B0B0D"/><circle cx="150" cy="80" r="6" fill="#8d8d93"/></svg>';
  }
  function list() {
    var q = st.q.toLowerCase(), r = P.filter(function (p) {
      return (st.f === "All" || p.cat === st.f) && (!st.stock || p.stock) && (!q || p.name.toLowerCase().indexOf(q) > -1);
    });
    if (st.s === "lo") r.sort(function (a, b) { return a.price - b.price; });
    else if (st.s === "hi") r.sort(function (a, b) { return b.price - a.price; });
    else r.sort(function (a, b) { return Number(b.stock) - Number(a.stock); });
    return r;
  }
  function render() {
    var r = list();
    $("#grid").innerHTML = r.map(function (p) {
      return '<article class="card' + (p.stock ? "" : " out") + '"><button class="ph" type="button" data-act="view" data-id="' + p.id + '" aria-label="View ' + esc(p.name) + '"><span class="tag' + (p.stock ? "" : " out") + '">' + (p.stock ? esc(p.cat) : "Sold out") + "</span>" + car(p.color) + '</button><div class="cb"><button class="pn" type="button" data-act="view" data-id="' + p.id + '">' + esc(p.name) + '</button><div class="row"><span class="pp">' + money(p.price) + '</span><button class="btn" type="button" data-act="add" data-id="' + p.id + '"' + (p.stock ? "" : " disabled") + ">" + (p.stock ? "Add" : "Sold out") + "</button></div></div></article>";
    }).join("");
    $("#empty").hidden = r.length > 0;
  }
  function chips() {
    var cats = ["All"]; P.forEach(function (p) { if (cats.indexOf(p.cat) < 0) cats.push(p.cat); });
    $("#chips").innerHTML = cats.map(function (c) { return '<button class="chip" type="button" data-act="cat" data-c="' + esc(c) + '" aria-pressed="' + (c === st.f) + '">' + esc(c) + "</button>"; }).join("");
  }
  function count() { return Object.keys(cart).reduce(function (n, id) { return n + cart[id]; }, 0); }
  function total() { return Object.keys(cart).reduce(function (n, id) { return n + byId(id).price * cart[id]; }, 0); }
  function drawCart() {
    var ids = Object.keys(cart);
    $("#cnt").textContent = count(); $("#sub").textContent = money(total());
    $("#items").innerHTML = ids.length ? ids.map(function (id) {
      var p = byId(id);
      return '<div class="it"><div class="th">' + car(p.color) + "</div><div><div>" + esc(p.name) + '</div><div class="qty"><button type="button" data-act="dec" data-id="' + id + '" aria-label="Decrease">−</button><span>' + cart[id] + '</span><button type="button" data-act="inc" data-id="' + id + '" aria-label="Increase">+</button></div></div><div><b>' + money(p.price * cart[id]) + '</b><br><button class="rm" type="button" data-act="rm" data-id="' + id + '">Remove</button></div></div>';
    }).join("") : '<p class="empty">Your cart is empty.</p>';
  }
  function toast(m) { var t = $("#toast"); t.textContent = m; t.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(function () { t.classList.remove("on"); }, 2200); }
  function openEl(sel) { closeAll(); $(sel).classList.add("on"); $(sel).setAttribute("aria-hidden", "false"); $("#ov").classList.add("on"); document.body.classList.add("lock"); }
  function closeAll() {
    ["#cart", "#modal"].forEach(function (s) { $(s).classList.remove("on"); $(s).setAttribute("aria-hidden", "true"); });
    $("#ov").classList.remove("on"); document.body.classList.remove("lock");
  }
  function view(id) {
    var p = byId(id); if (!p) return;
    $("#modal").innerHTML = '<div class="ph">' + car(p.color) + '</div><div class="md"><button class="x" type="button" data-act="close" aria-label="Close">✕</button><p class="eyebrow">' + esc(p.cat) + "</p><h2 class=\"d\">" + esc(p.name) + '</h2><span class="pp">' + money(p.price) + '</span><p class="fine">' + (p.stock ? "In stock — ships across India, prepaid." : "Currently sold out.") + '</p><button class="btn solid" type="button" data-act="add" data-id="' + p.id + '"' + (p.stock ? "" : " disabled") + ">" + (p.stock ? "Add to cart" : "Sold out") + "</button></div>";
    openEl("#modal");
  }
  function add(id, d) {
    var p = byId(id); if (!p || (d > 0 && !p.stock)) return;
    cart[id] = (cart[id] || 0) + d;
    if (cart[id] <= 0) delete cart[id];
    save(); drawCart(); if (d > 0) toast("Added to cart");
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-act]"); if (!b) return;
    var a = b.getAttribute("data-act"), id = b.getAttribute("data-id");
    if (a === "add") add(id, 1); else if (a === "inc") add(id, 1); else if (a === "dec") add(id, -1);
    else if (a === "rm") { delete cart[id]; save(); drawCart(); }
    else if (a === "view") view(id); else if (a === "cart") openEl("#cart"); else if (a === "close") closeAll();
    else if (a === "cat") { st.f = b.getAttribute("data-c"); chips(); render(); }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(); });
  $("#q").addEventListener("input", function (e) { st.q = e.target.value.trim(); render(); });
  $("#sort").addEventListener("change", function (e) { st.s = e.target.value; render(); });
  $("#stock").addEventListener("change", function (e) { st.stock = e.target.checked; render(); });
  $("#co").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target, ok = true;
    if (!count()) { toast("Your cart is empty"); return; }
    ["name", "phone", "address"].forEach(function (n) {
      var v = f.elements[n].value.trim(), good = n === "phone" ? /^[0-9+\s-]{10,15}$/.test(v) : v.length > 2;
      f.elements[n].classList.toggle("bad", !good); if (!good) ok = false;
    });
    if (!ok) { toast("Please fill in all details"); return; }
    var lines = Object.keys(cart).map(function (id) { var p = byId(id); return "• " + p.name + " × " + cart[id] + " — " + money(p.price * cart[id]); });
    var msg = "New order — " + C.store + "\n\n" + lines.join("\n") + "\n\nSubtotal: " + money(total()) + "\n\nName: " + f.elements.name.value.trim() + "\nPhone: " + f.elements.phone.value.trim() + "\nAddress: " + f.elements.address.value.trim();
    var num = String(C.whatsapp || "").replace(/\D/g, "");
    if (num) { window.open("https://wa.me/" + num + "?text=" + encodeURIComponent(msg), "_blank", "noopener"); return; }
    try { navigator.clipboard.writeText(msg); toast("Order copied. Set your WhatsApp number in config.js"); } catch (err) { toast("Set your WhatsApp number in assets/js/config.js"); }
  });
  $("#heroart").innerHTML = car("#C9A45C");
  chips(); render(); drawCart();
})();
