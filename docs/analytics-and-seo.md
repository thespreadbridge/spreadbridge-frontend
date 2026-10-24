# Analytics and search setup

## GA4

- Account: Spreadbridge (`413297096`)
- Property: Spreadbridge Web (`560569464`), Korea time, KRW
- Web stream: Spreadbridge Website (`16193395363`)
- Measurement ID: `G-PR09649NG7` (public identifier; not a secret)
- Console: https://analytics.google.com/analytics/web/#/a413297096p560569464/
- Runtime configuration: `src/lib/analytics-config.ts`. Production hostname only; localhost requires explicit debug mode. Vercel preview hosts are excluded.

The shared root tracker covers current and future pages/controls. Page views are explicit and deduplicated across identity refreshes and hash navigation. GA enhanced measurement is disabled to avoid duplicate SPA views and automatic unsanitized capture.

| Event | Trigger |
| --- | --- |
| `page_view` | Initial page and route/history-page navigation |
| `ui_click` | Links, buttons, FAQ controls, article details; disabled controls excluded |
| `login_start` | Google sign-in link click |
| `login` | Authenticated session after this tab began Google sign-in (10-minute marker) |
| `login_error` | Login failure screen, once per attempt |
| `logout` | Server-confirmed successful logout |
| `file_download` | Published installer link click; not installation completion |
| `begin_checkout` | Enabled checkout link click; not purchase completion |
| `contact_click` | Contact email link click |
| `faq_toggle` | FAQ opened/closed by mouse or keyboard |
| `filter_change` | Explicitly marked filters; selected account/trade values excluded |
| `scroll_depth` | 25/50/75/90% page depth, once per page |
| `article_read` | Blog page open for at least 30 seconds and at least 75% depth; reading estimate |

Key events: `login`, `file_download`, `begin_checkout`; no default monetary value. No `purchase` or `sign_up` is fabricated. Add those only after a confirmed backend result exists.

Registered event-scoped dimensions: `control_id`, `control_type`, `ui_area`, `destination_path`, `member_state`, `subscription_state`, `article_slug`, `platform`.

Authenticated API `userId` UUIDs use GA's built-in `user_id`. Do not register `user_id` as a custom dimension. Identity is cleared when the session is guest/unknown or enters an auth callback. No email, display name, account number, API key, individual trade or P&L is sent. Unknown URLs/control destinations are replaced with fixed safe labels; arbitrary query parameters and hashes are not page-view data. Safe campaign/ad-click parameters are retained. OAuth/own API referrers are ignored. Google Signals and ad personalization are disabled; DNT/GPC are honored.

Google-side email and query redaction supplements the client allowlist. Analytics cookies are configured for one year. Local QA: `NEXT_PUBLIC_GA_DEBUG_MODE=true npm run dev -- --webpack --port 3211`. Production QA: `?ga_debug=1`. Debug console output reports only whether an ID is set, never its raw value. Verify receipt in GA DebugView; standard reports/custom definitions can need processing time.

## Acquisition

Use the GA traffic acquisition report with **Session source / medium**, campaign, landing page, and key events. Compare new visitors using the user acquisition report. Google Search Console supplies organic search queries, impressions, clicks, and search positions; these are aggregated search data, not a member's search history.

Use consistent UTM links for ads, partners, social and email. Example:
`https://thespreadbridge.com/?utm_source=naver&utm_medium=cpc&utm_campaign=launch_202610&utm_content=hero_a`

Keep campaign names stable and exclude personal identifiers from UTM values. Referral domains are retained; external referrer paths/search text are stripped. Hash menu clicks are `ui_click`, not additional page views.

## SEO

Public page titles/descriptions/canonicals share `src/lib/site-pages.ts` and `src/lib/seo.ts`. Public pages have OG/Twitter images, Korean document language, Organization/WebSite/SoftwareApplication structured data. Blog posts retain article/breadcrumb metadata and primary source references. Login, payments and member race pages are noindex and excluded from sitemap. Auth API paths are disallowed in robots.txt.

`node scripts/generate-content.mjs` (also run by build) generates the 24-URL canonical sitemap and blog RSS. Keep actual article update dates; do not invent reviews or ratings for structured data. Search Console domain property: `sc-domain:thespreadbridge.com`.

Legacy `www` CloudFront distribution `E1STP7ULOKCRWK` uses `infra/cloudfront/www-canonical.js` for permanent canonical website redirects. S3 installers/assets keep their existing URI and routing; DNS and mail records are unchanged. Distribution config/function snapshots for rollback are held in the private diagnostics directory, outside Git. Restore the prior viewer-request function association to roll back the redirect.

## Validation

`npm test`, `npm run typecheck`, and a production build cover URL redaction, attribution, User-ID lifecycle, duplicate suppression, metadata, sitemap and immutable-file routing. Browser QA must additionally confirm real GA receipt, authenticated state, production route changes, and the live www redirect after deploy.
