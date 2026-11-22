# Security notes for Keepsake Kart

No website can be guaranteed unhackable. This page lists what is built in, and what only the store owner can do.

## Built into the site
- **Nothing to break into on the site itself.** It is a static site: no server, database, admin login or stored passwords.
- **Strict Content Security Policy on every page.** Only scripts from this site can run. Injected scripts, frames and plugins are blocked. Styles and fonts load only from this site and Google Fonts.
- **Visitor input is escaped.** Anything typed or placed in the web address (search, collection, product, blog) is shown as text and never as code.
- **Safe links from settings.** Instagram must be an `https://` link, emails must be plain addresses, and WhatsApp numbers are reduced to digits. Outside links open with `noopener noreferrer`.
- **Frame protection** so other sites cannot show your store inside their page, and a referrer policy that limits what is shared when visitors click away.
- **No card details or passwords** are collected. A visitor's details stay in their own browser until they send them to you.

## Only you can do these (most real attacks target accounts)
1. **GitHub account:** turn on two-factor authentication (a passkey is best), and review who has access to the repository.
2. **Protect the `main` branch:** Settings, Branches, require a pull request and block force pushes.
3. **Turn on secret scanning and Dependabot alerts** in the repository's Security settings.
4. **GitHub Pages:** tick *Enforce HTTPS*.
5. **Custom domain:** use two-factor and a transfer lock at the registrar, and turn on DNSSEC. A free Cloudflare account in front of the site adds security headers (such as HSTS and frame blocking), bot protection and a firewall.
6. **Never put passwords or private keys in the repository.** A Supabase *publishable* key (`sb_publishable_...`) is public by design, but the *secret* key (`sb_secret_...`) and any old `service_role` key must never be shared or committed.
7. **Check every order before accepting it.** Totals are worked out in the visitor's browser, so a determined visitor could change them. Compare each WhatsApp order with your own price list.
8. **Protect payments:** share UPI details only inside the WhatsApp chat the customer started, and tell customers you never ask for OTPs or PINs.

## Login
Login with a mobile number and OTP is a **demo** until SMS is connected: the code is shown on the screen, so it does not protect an account. Accounts live only in the visitor's own browser, so nothing is exposed to other people, but real protection arrives with the backend.

## Limits
GitHub Pages cannot send HTTP security headers, so a few protections (such as frame blocking) are done inside the page. Cloudflare closes that gap.

## When the backend is added
The server must re-check prices, stock and coupons itself (the draft `backend/schema.sql` does this in `place_order`), use row level security, limit request rates, and take payments only through a payment gateway.
