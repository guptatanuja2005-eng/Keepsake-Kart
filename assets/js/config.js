/* ===== STORE SETTINGS \u2014 edit this file ===== */
window.KK_CONFIG = {
  store: "Keepsake Kart", currency: "Rs. ",
  /* Contact: WhatsApp = country code + number, digits only, e.g. "91XXXXXXXXXX". Instagram = full profile URL. */
  whatsapp: "", email: "", instagram: "",
  /* Full site address (no trailing slash) once published; enables canonical links and search-engine data. */
  siteUrl: "",
  /* Set to true after you add product photos to assets/img/ (named <product id>.jpg). */
  photos: false,
  /* Most units of one product per order. */
  maxQty: 10,
  /* Text in the top bar. */
  notice: "Authentic die-cast collectibles",
  /* Four short selling points on the home page. */
  highlights: [
    { t: "Hand-picked", d: "Every piece chosen with collectors in mind." },
    { t: "Authentic die-cast", d: "Genuine licensed Hot Wheels and imports." },
    { t: "Order on WhatsApp", d: "We confirm stock and payment with you personally." },
    { t: "Requests welcome", d: "Hunting a casting? Message us and we will try to source it." }
  ],
  /* Shipping options and prices are PLACEHOLDERS: replace with your real charges. */
  shipping: [
    { id: "std", label: "Standard shipping", price: 60 },
    { id: "exp", label: "Express shipping", price: 120 }
  ],
  /* Payment options shown at checkout. */
  payments: [
    { id: "upi", label: "UPI (details shared on WhatsApp)" },
    { id: "bank", label: "Bank transfer / Net banking" }
  ],
  checkoutNote: "We confirm stock and share payment details on WhatsApp before dispatch.",
  /* Policy text for the Shipping, Payment and Returns page. Separate paragraphs with a blank line (\n\n). */
  policies: { shipping: "", payment: "", returns: "" }
};
