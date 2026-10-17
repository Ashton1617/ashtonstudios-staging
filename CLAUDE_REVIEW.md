# Review brief: search titles and descriptions

Please review this change independently. Do not take the character counts below on trust. Recount the decoded text yourself.

This is the staging site for Ashton Studios (ashtonstudios.uk), a one-person web design studio in Hatfield, Hertfordshire. Staging is a GitHub Pages subpath and the pages use relative hrefs. The branch must stay a draft. Do not merge it, and do not push to `main`.

## How to count

Count the text a search result or social card shows, after HTML decoding.

- `£`, the em dash `—`, and a normal space are one character each.
- `&amp;` in the HTML source is one character (`&`), not five.
- Do not count the tags, quotes, or attribute names.

In Python, unescape the attribute value and use `len()`. A title over 60 characters is too long. A description over 160 characters is too long. The homepage meta description must sit between 150 and 160 characters inclusive.

Google truncates titles at about 60 characters and descriptions at about 155–160. The cut-off sentence loses the price, the town, or the call to action, which lowers click-through rate. Each page needs its own wording so the local pages do not look like duplicates.

## What changed

On every page below, the same new description is used in three places that previously shared one long sentence: `meta name="description"`, `meta property="og:description"`, and the JSON-LD `description`. Where a title changed, `<title>`, `og:title`, and (on the two case studies) the JSON-LD `name` use the same new title. There is no `twitter:description` tag on these pages. Twitter uses `og:description` because `twitter:card` is `summary_large_image`.

The homepage is the exception: only `meta name="description"` changed. Its `og:description` was already under 160 characters and was left as it was.

### 1. Homepage — `index.html`

**Problem.** The meta description was 178 characters. A health check of the live site on 16 Oct 2026 found Google cutting this snippet off at about 175 characters.

**Why it matters.** This is the snippet for the main query (web design and hosting for local businesses). The truncated ending was hiding "Free mockup first." The rewrite keeps "local businesses", the £700 build, the 5 working day promise, hosting and care from £45/month, and the free mockup.

**Before (178):** I design, build and host fast, honest websites for local businesses. Builds from £700, live in 5 working days of your content, hosting and care from £45/month. Free mockup first.

**After (155):** I design, build and host fast, honest websites for local businesses. From £700, live in 5 working days, hosting and care from £45/month. Free mockup first.

**File.** `index.html`, the `meta name="description"` tag only.

**Verify.** Decoded length is 155. The sentence still says local businesses, £700, 5 working days, hosting and care from £45/month, and a free mockup. `og:description` is still the older 147-character sentence (see Left open).

### 2. Hatfield — `web-design-hatfield/index.html`

**Problem.** Description was 193 characters. The title was already 39 and was left.

**Why it matters.** "Web design Hatfield" is the home-town query. The useful local line is that the designer lives in Hatfield. That line was in the first sentence, so it survived, but the price and hosting were at risk of being cut off.

**Before (193):** Web design and hosting for Hatfield businesses, by a designer who lives in Hatfield. Free preview of your homepage first, £700 build you own outright, £45/month hosting, live in 5 working days.

**After (155):** Web design and hosting for Hatfield businesses, by a designer who lives in Hatfield. Free homepage preview, £700 build you own outright, £45/month hosting.

**Verify.** Meta description, `og:description`, and JSON-LD `description` are the same 155-character sentence. Title is still `Web Design in Hatfield | Ashton Studios` (39).

### 3. Hertford — `web-design-hertford/index.html`

**Problem.** Description was 183 characters. Title was already 39 and was left.

**Why it matters.** This page has to stay distinct from Hatfield. The town, the trades/salons/clinics list, and "designer in Hatfield" are the local keywords.

**Before (183):** Web design and hosting for Hertford independents, trades, salons and clinics, from a designer in Hatfield. Free homepage preview first, £700 build you own outright, £45/month hosting.

**After (151):** Web design and hosting for Hertford independents, trades, salons and clinics, from a designer in Hatfield. Free preview, £700 build, £45/month hosting.

**Verify.** All three description copies match and are 151 characters. Title is still `Web Design in Hertford | Ashton Studios` (39).

### 4. St Albans — `web-design-st-albans/index.html`

**Problem.** Description was 185 characters. Title was already 40 and was left.

**Why it matters.** St Albans is distinguished by the trade list and by Goodfellas Barbershop, the real client. Those had to stay. The £45/month price was the phrase removed so the client name still fits.

**Before (185):** Web design and hosting for St Albans businesses — barbers, clinics, restaurants, builders. Real client work for Goodfellas Barbershop. Free preview first, £700 build, £45/month hosting.

**After (158):** Web design and hosting for St Albans businesses — barbers, clinics, restaurants and builders. Client work for Goodfellas Barbershop. Free preview, £700 build.

**Verify.** All three description copies match and are 158 characters. Goodfellas Barbershop and St Albans are both still in the sentence. Title is still `Web Design in St Albans | Ashton Studios` (40).

### 5. Stevenage — `web-design-stevenage/index.html`

**Problem.** Description was 191 characters. Title was already 40 and was left.

**Why it matters.** Stevenage is the page that names mechanics as well as trades, barbers, and clinics. That list is what stops it matching the other town pages.

**Before (191):** Web design and hosting for Stevenage trades, barbers, mechanics, clinics and independents. Free homepage preview first, £700 build you own outright, £45/month hosting, live in 5 working days.

**After (152):** Web design and hosting for Stevenage trades, barbers, mechanics, clinics and independents. Free homepage preview, £700 build you own, £45/month hosting.

**Verify.** All three description copies match and are 152 characters. "mechanics" is still present. Title is still `Web Design in Stevenage | Ashton Studios` (40).

### 6. Watford — `web-design-watford/index.html`

**Problem.** Description was 179 characters. Title was already 38 and was left.

**Why it matters.** Watford Handyman, launching October 2026, is the proof on this page. The launch line has to remain visible, with the town and the £700 / £45 price.

**Before (179):** Web design and hosting for Watford trades, salons, clinics and shops. Client: Watford Handyman, launching October 2026. Free homepage preview first, £700 build, £45/month hosting.

**After (156):** Web design and hosting for Watford trades, salons, clinics and shops. Client: Watford Handyman, launching October 2026. Free preview, £700 build, £45/month.

**Verify.** All three description copies match and are 156 characters. The launch wording is still "launching October 2026". Title is still `Web Design in Watford | Ashton Studios` (38).

### 7. Welwyn Garden City — `web-design-welwyn-garden-city/index.html`

**Problem.** Description was 179 characters. Title was already 49 and was left.

**Why it matters.** The full town name is long, so the description had less room. The town name plus trades, salons, and independents is the local keyword set.

**Before (179):** Web design and hosting for Welwyn Garden City trades, salons and independents. Free homepage preview first, £700 build you own outright, £45/month hosting, live in 5 working days.

**After (149):** Web design and hosting for Welwyn Garden City trades, salons and independents. Free homepage preview, £700 build you own outright, £45/month hosting.

**Verify.** All three description copies match and are 149 characters (under 160; the homepage is the only description that had to land in 150–160). Title is still `Web Design in Welwyn Garden City | Ashton Studios` (49).

### 8. Barbers and salons — `websites-for-barbers-and-salons/index.html`

**Problem.** Title was 79 characters. Description was 211.

**Why it matters.** The title was losing "| Ashton Studios" and part of the offer in the search result. Booking, prices, and the gallery moved into the description, which is where Google has room for them. Hertfordshire and Goodfellas in St Albans stay, so the page remains a local result rather than a generic salon page.

**Title before (79):** Websites for Barbers & Salons — Booking First, Prices, Gallery | Ashton Studios

**Title after (46):** Websites for Barbers & Salons | Ashton Studios

**Description before (211):** Websites for barbershops, hair salons and nail bars in Hertfordshire: booking link front and centre, full price list, gallery, reviews. Real client build for Goodfellas Barbershop, St Albans. Free preview first.

**Description after (152):** Websites for Hertfordshire barbershops, hair salons and nail bars: booking first, full price list, gallery and reviews. Built for Goodfellas, St Albans.

**Verify.** `<title>` and `og:title` both decode to the 46-character title (`&amp;` in the source). Meta description, `og:description`, and JSON-LD `description` are the 152-character sentence. The source must contain `&amp;`, not a raw `&`, inside the title attributes.

### 9. Clinics — `websites-for-clinics/index.html`

**Problem.** Title was 69 characters. Description was 221.

**Why it matters.** Osteopaths and physios are the searches this page should win, and they now fit in the title. Dentists and chiropractors remain in the description, with Hertfordshire, so the local and clinical terms are still on the page.

**Title before (69):** Websites for Clinics — Osteopaths, Physios, Dentists | Ashton Studios

**Title after (55):** Clinic Websites — Osteopaths & Physios | Ashton Studios

**Description before (221):** Websites for clinics in Hertfordshire — osteopaths, physios, chiropractors, dentists: online booking, treatment pages, practitioners, reviews and a proper privacy policy. Free preview first, £700 build, £45/month hosting.

**Description after (157):** Websites for clinics in Hertfordshire — osteopaths, physios, chiropractors, dentists. Booking, treatment pages, reviews. Free preview, £700 build, £45/month.

**Verify.** Title and `og:title` decode to 55 characters, with `&amp;` in the source. All three description copies are 157 characters and still name dentists and chiropractors.

### 10. Trades — `websites-for-trades/index.html`

**Problem.** Title was 80 characters. Description was 196.

**Why it matters.** Plumbers and electricians are the highest-intent trade terms and now fit in the title. Roofers and builders were dropped from the title, so the description now leads with all four. Hertfordshire stays on both.

**Title before (80):** Websites for Trades — Plumbers, Electricians, Roofers, Builders | Ashton Studios

**Title after (57):** Trade Websites — Plumbers & Electricians | Ashton Studios

**Description before (196):** Websites for tradespeople in Hertfordshire: one-tap call, before/after gallery, a page per job type, reviews on your own domain. Free preview first, £700 build you own outright, £45/month hosting.

**Description after (157):** Websites for Hertfordshire plumbers, electricians, roofers and builders: one-tap call, before/after gallery and reviews. Free preview, £700 build, £45/month.

**Verify.** Title and `og:title` decode to 57 characters, with `&amp;` in the source. All three description copies are 157 characters and name plumbers, electricians, roofers, and builders.

### 11. Goodfellas case study — `work/goodfellas-barbershop/index.html`

**Problem.** Title was 62 characters, just past the width Google usually keeps. Description was 198.

**Why it matters.** A clipped title was at risk of losing "Ashton Studios" or "Case Study", which is what separates this page from the barbershop's own site. St Albans was taken out of the title and kept at the start of the description, so the town still shows in the snippet. The 5.0 rating and the "not secure" / no-booking story are the click-through hook.

**Title before (62):** Goodfellas Barbershop, St Albans — Case Study | Ashton Studios

**Title after (51):** Goodfellas Barbershop — Case Study | Ashton Studios

**Description before (198):** How a 5.0-rated St Albans barbershop went from a 'not secure' site with no way to book to a booking-first build with the real price list, reviews and gallery. Web design by Ashton Studios, Hatfield.

**Description after (145):** How a 5.0-rated St Albans barbershop went from a 'not secure' site with no way to book to a booking-first build with prices, reviews and gallery.

**Verify.** `<title>`, `og:title`, and JSON-LD `name` are the 51-character title. Meta description, `og:description`, and JSON-LD `description` are the 145-character sentence. "St Albans" is in the description. The straight single quotes around `not secure` are still inside the double-quoted attribute.

### 12. Watford Handyman case study — `work/watford-handyman/index.html`

**Problem.** Title was 70 characters. Description was 209.

**Why it matters.** "launching October 2026" made the title wrap or cut. The place is already in the business name. The description keeps central Watford, the 2005 start, the missing privacy policy, and the launch date.

**Title before (70):** Watford Handyman — Case Study, launching October 2026 | Ashton Studios

**Title after (46):** Watford Handyman — Case Study | Ashton Studios

**Description before (209):** A family handyman business in central Watford since 2005: a 450KB template site with no privacy policy and a form that was the whole front door, rebuilt light, fast and priced up front. Launching October 2026.

**Description after (154):** A family handyman in central Watford since 2005. The old site had no privacy policy and the form was the front door. Rebuilt fast, launching October 2026.

**Verify.** `<title>`, `og:title`, and JSON-LD `name` are the 46-character title. All three description copies are 154 characters and still say "launching October 2026".

## Checked and left as they were

- `privacy.html` title `Privacy — Ashton Studios` (24) and description `How Ashton Studios handles the details you send through the enquiry form, and why you may have had an email from me.` (116). No Open Graph description.
- Homepage title and `og:title` (58): Ashton Studios — web design & hosting for local businesses.
- Homepage `og:description` (147): Fast, honest websites for local businesses. Builds from £700, live in 5 working days of your content, care plans from £45/month. Free mockup first.
- Town-page titles, all under 60: Hatfield 39, Hertford 39, St Albans 40, Stevenage 40, Watford 38, Welwyn Garden City 49.
- No page outside `demos/` has a `twitter:description` tag. None was added.
- Every marketing page still starts with `<meta name="robots" content="noindex,nofollow">`.
- `robots.txt` is still `User-agent: *` and `Disallow: /`.
- `privacy.html` still also contains `<meta name="robots" content="index,follow">`. That second tag was not edited.
- `demos/` was not edited. Favicon files and every `link rel="icon"` / `apple-touch-icon` were not edited. Those belong to the separate favicon branch `cursor/swap-favicon-a-roof-88d4` (PR #1).

## Reviewer checklist

1. Recount every `<title>`, `meta name="description"`, `og:title`, and `og:description` outside `demos/`. Titles must be 60 characters or under. Descriptions must be 160 or under. The homepage meta description must be 150–160.
2. Confirm the twelve before/after pairs above match the files, including the JSON-LD `description` on each changed page and the JSON-LD `name` on the two case studies.
3. Confirm no two pages share a title or a meta description.
4. Read each new sentence on its own. It should sound like a person, keep the town or trade keywords, and not invent a price, a client, or a launch date.
5. Confirm `&` in titles is stored as `&amp;`, and that the Goodfellas description still uses straight quotes around `not secure`.
6. Confirm `git diff -- demos robots.txt` is empty, and that the diff does not touch favicon files or `rel="icon"` lines.
7. Confirm every `noindex,nofollow` tag and the privacy page's `index,follow` tag are unchanged, and that `robots.txt` still disallows `/`.
8. Confirm this pull request is a draft and that `main` was not updated.

## Left open

- Homepage `og:description` is 147 characters and was already short enough, so it was not rewritten. It is a different sentence from the new 155-character meta description. Social cards will show the older sentence. No `twitter:description` was added; Twitter falls back to that Open Graph description.
- The homepage JSON-LD `description` is a different sentence and was left: "Independent web design and hosting studio for local businesses. Builds from £700, live in 5 working days of your content, care plans from £45 to £75 per month." That is 159 characters. It does not name Hatfield or Hertfordshire.
- Offer descriptions inside JSON-LD (the £700 build and the £45 care plan) were left. They are not the search snippet.
- The St Albans snippet no longer says £45/month. The price is still in the page body. Putting it back means dropping Goodfellas or one of the trade words.
- The Goodfellas title no longer says St Albans. The town is the opening of the description. A title that keeps the town and drops "Barbershop" would be `Goodfellas, St Albans — Case Study | Ashton Studios` (51).
- `privacy.html` carries both `noindex,nofollow` and `index,follow`. Staging `robots.txt` disallows the whole site, so this does not change what Google can fetch today. It was left because the robots settings were not to be touched.
- `demos/` was not measured. Those pages are concept work and are already `noindex`.
- These snippets will not appear on Google until the owner approves the draft and the same tags are what the live site serves. Staging itself stays `noindex`.
