# Editing the Keepsake Kart store

All store content lives in `assets/js/`. No build step: edit, save, refresh.

| File | What to change |
|---|---|
| `config.js` | WhatsApp, email, Instagram, shipping and payment options, policies, coupons, order limits, low-stock level, `photos` switch |
| `products.js` | Products: id, name, price, category, in stock (1/0), colour, and an optional 7th number = units in stock |
| `reviews.js` | Customer reviews you have approved |
| `blog.js` | Blog posts |

## Stock quantities
Add a number as the 7th value in a product row, for example `["camaro10","...",299,"Imported",1,"#E0B13C",5]`.
- With a number, the shop shows "Only N left" at or below `lowStock`, and stops orders above N.
- A number of 0 marks the product sold out. With no number, the product is simply "in stock".
- Stock is not reduced automatically when an order arrives. Update the number after you confirm each order.

## Product photos
1. Put photos in `assets/img/` named `<product id>.jpg` (for example `camaro10.jpg`). Extra photos: `camaro10-2.jpg`, `camaro10-3.jpg` (up to `-5`).
2. Set `photos: true` in `config.js`.
Use landscape 4:3 photos, about 1200 x 900 px. A missing photo falls back to the drawn car.

## Coupons
Add entries to `coupons` in `config.js` (see the example in that file). They are checked in the browser, so use them for public promo codes and re-check each order when you confirm it.

## Reviews
Copy the example in `reviews.js`. Only add reviews from real customers.

## Wishlist, recently viewed, cart
These are saved in each visitor's own browser. They are not shared between devices.

## Pre-orders
Give a product the category `"Pre-Orders"` in `products.js`. It appears in the Pre-Orders collection with a "Pre-order" button, and checkout adds a note that pre-order items ship when stock arrives.

## Legal pages
`privacy.html` and `terms.html` describe how this site actually works (details saved in the visitor's browser, orders sent by WhatsApp or email). They are plain-language templates, not legal advice. Please read them, change anything that does not match how you run the store, and consider a legal review before you take real orders.

## Share image
`assets/img/share.png` is the preview shown when links are shared on WhatsApp or social media. The address inside each page's `og:image` tag assumes the GitHub Pages address, so update it if your site address differs.

## Backend
See `backend/README.md`. The database design is a draft and is not connected to the site yet.
