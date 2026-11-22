# Backend (Phase 5): draft, not connected

`schema.sql` is the database design for a Supabase backend: products with stock, shipping options, coupons, orders, reviews, row level security, explicit grants, and a `place_order` function that checks stock, prices, shipping and coupons on the server and reduces stock automatically.

**Status:** written without a live database, so it is untested and the website does not use it yet. Run it on a test project first and fix anything it reports.

## Steps for you
1. **Create a project** at supabase.com (New project). Pick a region close to your customers. If you see "Automatically expose new tables", leave it unticked: `schema.sql` grants access itself.
2. **Run the script.** SQL Editor, paste `schema.sql`, Run. Fix any error it reports (or send it to me).
3. **Add your data** in the Table Editor: a row in `shipping_options` (label `Shipping`, price `150`), your products (copy them from `assets/js/products.js`, with `stock_qty`), and any coupons.
4. **Get the two values I need:** open the project, click *Connect* (or Project Settings, API Keys) and copy the **Project URL** and the **Publishable key** (`sb_publishable_...`). If only legacy keys are shown, click *Create new API keys*. Both are safe to share with me; they are meant to be public.
5. **Never share the Secret key** (`sb_secret_...`) or the old `service_role` key. They bypass every protection and must never be put in this repository. Supabase is retiring the old `anon` and `service_role` keys by the end of 2026.
6. **Turn on phone login** (needed for real OTP): Authentication, Providers, enable Phone, then choose an SMS provider (Twilio, MessageBird, Vonage, or the community-supported TextLocal) and enter its credentials. WhatsApp codes are supported only through Twilio. In India, commercial SMS senders must follow TRAI's DLT rules, so use a provider that can register your sender and templates. Set rate limits and CAPTCHA to keep SMS costs under control.
7. **Check the plan and limits** on Supabase's pricing page before launch (usage limits, inactivity, backups).

## What I will do once I have the URL and publishable key
- Talk to Supabase from the site with plain `fetch` requests (no extra library), so the strict content policy only needs one new allowed address: your project URL.
- Load products and live stock from the database, place orders through `place_order`, and replace the demo OTP with real SMS login.
- Show order history from the database on any device, and let customers submit reviews that you approve.
- Update the privacy policy: orders will then be stored on a server, not only in the visitor's browser.

I cannot test against your live project from here, so you will need to test each step on your side.

## Still needed after that
- Online payment (for example Razorpay) needs a server function and your gateway account.
- Order status emails and an admin screen. Supabase's table editor works as a basic admin in the meantime.
