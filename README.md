# Pioneer Home Health Services Inc. — Website

A professional, accessible, and compliance-minded marketing/intake website for **Pioneer Home Health Services Inc.**, built directly from the company brochure.

> “Depend on us for quality home health care.”

## What's included

| Page | File | Purpose |
|------|------|---------|
| Home | `index.html` | Hero, services overview, mission/philosophy, how it works, coverage, CTAs |
| About | `about.html` | Mission, philosophy, core values, non-discrimination commitment |
| Services | `services.html` | Full skilled-nursing list + PT/OT/ST, social services, aide, equipment |
| FAQ | `faq.html` | Accordion of the brochure's Q&A (what/benefits/who/who pays) |
| Careers | `careers.html` | Open roles + application form |
| Contact | `contact.html` | Contact details, message form, embedded map |
| Make a Referral | `referral.html` | Patient referral intake form with validation |
| 404 | `404.html` | Friendly not-found page |

### Compliance pages (`/compliance/`)
- `privacy.html` — HIPAA **Notice of Privacy Practices**
- `patient-rights.html` — **Patient Rights & Responsibilities**
- `nondiscrimination.html` — **Non-Discrimination Notice** (Title VI / Section 504)
- `accessibility.html` — **Accessibility Statement** (WCAG 2.1 AA / ADA)

## Company details (from the brochure)
- **Address:** 13083 Van Nuys Blvd. Unit 1, Pacoima, CA 91331
- **Tel:** (818) 485-5303 · **Fax:** (818) 485-5393
- **Email:** pioneerhomehealthservices@gmail.com
- **Office hours:** Mon–Fri, 9:00 AM – 5:30 PM (on-call nurse after hours, weekends, holidays)

## Tech
- Pure static **HTML + CSS + vanilla JS** — no build step, no dependencies.
- Custom CSS design system in `assets/css/styles.css` (brand palette from the logo).
- SVG logo + hero illustration (`assets/img/`) — scalable, license-free.
- Accessible: skip link, keyboard nav, ARIA, reduced-motion support, semantic markup.
- SEO: meta descriptions, JSON-LD business schema, `sitemap.xml`, `robots.txt`.

## Run locally
```bash
cd pioneer-home-health-site
python3 -m http.server 8080
# open http://localhost:8080
```
Or just open `index.html` in a browser.

## Deploy
Drop the folder onto any static host — **Netlify, Vercel, GitHub Pages, Cloudflare Pages,** or any web server. No server-side code required.

## Forms — how they work (LIVE)
The referral, contact, and careers forms are **fully wired** and do two things on submit
(success shows **inline — no pop-up, no redirect**):

1. **Email the office** via [FormSubmit](https://formsubmit.co) — a no-server form-to-email
   relay. Submissions are emailed to `pioneerhomehealthservices@gmail.com`.
2. **Store a copy** in Supabase (Postgres) so nothing is ever lost.

If either path succeeds, the user sees a success message. A spam **honeypot** field is
injected automatically and a Supabase Row-Level-Security rule rejects bot submissions.

### ⚠️ One-time activation required for email
FormSubmit requires a single activation click before it will deliver mail:
1. Open the inbox for **pioneerhomehealthservices@gmail.com**.
2. Find the email from FormSubmit titled **“Activate Form”** and click the link.
3. Done — every submission from then on arrives in that inbox.

To change the destination address, edit `NOTIFY_EMAIL` in `assets/js/config.js`.

### Backend (Supabase)
Submissions are stored in three tables in the connected Supabase project
(`pioneer_referrals`, `pioneer_contact_messages`, `pioneer_job_applications`).
RLS allows the public (anon) key to **insert only** — the data cannot be read,
updated, or deleted from the website. View submissions in the Supabase dashboard.

> **Health-care compliance note:** the on-page forms warn users not to include sensitive
> medical details. FormSubmit and a standard Gmail inbox are fine for general contact/
> referral routing, but for protected health information (PHI) you should move to a
> **HIPAA-compliant** email/intake provider under a signed BAA before collecting PHI.

## Photography
All photos are real, **license-clear stock from Pexels** (Pexels License: free for
commercial use, no attribution required), curated for warm, happy, diverse home-care
moments and optimized for the web. The home hero is a cinematic cross-fading slideshow
with a slow Ken-Burns zoom (pure CSS — respects `prefers-reduced-motion`). Files live in
`assets/img/photos/`. You may swap any of them for the agency’s own photography.

## App features
- **Installable PWA** — `manifest.webmanifest` + `service-worker.js` (offline support,
  add-to-home-screen, app icons).
- **Eligibility Checker** (`eligibility.html`) — a 5-step interactive wizard that hands a
  pre-filled referral link to the referral form.
- Scroll progress bar, animated counters, reveal-on-scroll, floating call button, and a
  photo gallery.

## Compliance notes
The compliance pages are good-faith **templates** populated with Pioneer's details.
Before publishing, have the company's **privacy/compliance officer and legal counsel**
review and finalize the Notice of Privacy Practices, Patient Rights, and
Non-Discrimination notices to ensure they meet all current federal and California
requirements.

---
© Pioneer Home Health Services Inc. Built from the company brochure.
