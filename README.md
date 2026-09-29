# TechBachat V2

TechBachat is a public, no-sign-in tech deals + articles website with an authenticated Supabase CMS.

## Included

- White, clean public UI
- No visitor account/login
- Products/deals with image upload
- Affiliate URL fields
- Featured deals and price-drop flags
- Articles with featured image upload
- Article HTML editor
- Insert an existing product card into an article
- Homepage controls from Admin
- Global social/contact/footer settings
- Category management
- Media upload area
- Supabase Auth + RLS
- Public published content only
- Admin-only write access

## Run

1. Create a Supabase project.
2. Open Supabase SQL Editor and run `supabase/schema.sql`.
3. Create an Authentication user.
4. Copy the user's UUID and run:
   `insert into public.profiles(id,email,is_admin) values('USER-UUID','EMAIL',true);`
5. Copy `.env.example` to `.env.local` and fill the Supabase URL + publishable key.
6. In PowerShell on Windows, if `npm` is blocked by execution policy, use `npm.cmd`.
7. Run:
   `npm.cmd install`
   `npm.cmd run dev`

Open `http://localhost:5173`.

Admin: `http://localhost:5173/admin`

## Image uploads

Images go to the `site-media` Supabase Storage bucket. The frontend never receives a service-role key. Only the authenticated admin can upload through the storage RLS policies.

## Article content

The V2 editor stores HTML. Use normal HTML such as `<h2>`, `<p>`, `<ul>`, `<img>`, and links. Product cards can be inserted from existing products using the admin dropdown.

## Before production

- Replace the placeholder legal/contact copy with your final business details.
- Configure a custom domain in your hosting provider.
- Verify affiliate program requirements and disclosures for each network you use.
- Add an image optimization/CDN strategy if the media library becomes large.
