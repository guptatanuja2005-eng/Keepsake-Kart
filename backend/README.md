# Backend (Phase 5): draft, not connected

`schema.sql` is the database design for a Supabase backend: products with stock, shipping options, coupons, orders, reviews, row level security, and a `place_order` function that checks stock, prices and coupons on the server and reduces stock automatically.

**Status:** written without a live database, so it is untested. The website does not use it yet.

## To go live (needs you)
1. Create a free Supabase project and choose a region near your customers.
2. Run `schema.sql` in the SQL editor on a test project and fix any errors it reports.
3. Add your products (with `stock_qty`), shipping options and coupons as rows.
4. Send the project URL and the public "anon" key. Never share the "service role" key.
5. The next patch connects the site: load products and stock from the database, place orders with `place_order`, email sign-in for order history, and customer-submitted reviews that you approve.

## Still needed after that
- Online payment (for example Razorpay) needs a server function and your gateway account.
- Order status emails and an admin screen for you to manage products and orders. Supabase's table editor can be used as a basic admin in the meantime.
