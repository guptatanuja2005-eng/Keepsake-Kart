/* STORE SETTINGS — edit these values. whatsapp: country code + number, digits only (e.g. "91XXXXXXXXXX").
   Shipping prices and payment labels below are placeholders: change them to your real policy. */
window.KK_CONFIG = {
  store: "Keepsake Kart", currency: "Rs. ",
  whatsapp: "", email: "", instagram: "",
  shipping: [
    { id: "std", label: "Standard shipping", price: 60 },
    { id: "exp", label: "Express shipping", price: 120 }
  ],
  payments: [
    { id: "upi", label: "UPI (payment details shared on WhatsApp)" },
    { id: "bank", label: "Bank transfer / Net banking" }
  ]
};
