# Spreadbridge Frontend

Spreadbridge website with shared public-page styling, server-rendered member views, and same-site Google authentication backed by the existing API.

## Homepage v6 review branch

The `codex/html-home-v6` branch replaces the complete homepage with the supplied
Basis Lab v6 reference. The original is retained in `docs/design/basislab-home-v6.html`;
the React homepage implementation and composition styles live in `src/components/home-v6/`.

Run `npm run dev -- --hostname 127.0.0.1 --port 3210` to review it locally.
The homepage derives guest, unsubscribed and subscribed views from verified backend
identity and membership data. The prototype state switches are removed. Member names,
plans, slot limits and expiration dates come from the account API; the paid summary
and recent trades come from the member's own SPREADBRIDGE trade history. API failures
show an unavailable state and never unlock paid data. The guest report card contains neutral locked placeholders. Community leaderboards,
invented earnings and spread distribution are not presented as live member data.

The countdown uses one shared deadline in `src/lib/launch-promotion.ts`, temporarily
October 31, 2026 at 23:59:59 KST. Refreshing does not reset it. Reference copy
(including stop-loss) is retained. The published homepage allows search indexing;
login and private account pages remain excluded.

The footer also links to `/notices/`, `/terms/`, `/risk/`, and `/api-consent/`.
These pages share the dark homepage theme and cross-link to the other policies.
Notices currently has an empty list; no publication history is invented. The policy
texts are local review drafts based on current product behavior, not approved
published terms. Confirm operator details, commercial/refund conditions, effective
dates and final legal wording before production publication. Reading the API
information page does not collect consent or activate a trading connection.

## Shared public-site design

Every route uses the v6 HTML's dark theme. `src/styles/tokens.css` is the single
source for colors, fonts, spacing, radii and shared effects. `src/styles/site.css`
defines shared buttons, navigation, footer, document typography, tables, cards,
pricing grids and onboarding steps. These files are loaded once in the root layout.

`PublicHeader`, `SiteFooter` and `Brand` are reused by the homepage and every inner
page. `SitePage` owns the common page frame; `InformationPage` adds policy navigation
for notices and legal documents, including privacy. Route files contain content
and composition, with no inline presentation styles or page-specific theme CSS.
Homepage section composition remains scoped in
`src/components/home-v6/home-v6.css`; blog composition lives in
`src/styles/insights.css` and inherits the same shared tokens. The previous light landing stylesheet is no
longer loaded. Change shared tokens/components to update all public pages together.

At widths up to 900px, the shared header uses a menu disclosure for navigation and
account actions. It closes after choosing a link, pressing Escape, or clicking
outside. The collapsed header stays one row for signed-in and guest visitors.
Shared header-height and anchor-offset tokens keep article and section links clear
of the sticky header. At widths up to 700px, the trade and subscription tables use
labelled cards and subscription summary cards become compact rows.

Subscription history displays ten records per page using `historyPage` in the URL,
with previous/next links targeting `#subscription-history`. Out-of-range pages are
clamped. Credentials and receipt fetching stay server-side. The current API supplies
at most the latest 100 receipts, so paging operates within that returned dataset.

## Authentication and subscription integration

`/login/` belongs to this frontend. Google authorization starts at
`/api/session/google/start/`; the callback exchanges the one-time PKCE code on the
server. Access and refresh credentials use HttpOnly, SameSite=Lax cookies (Secure
in production); neither is exposed through session JSON, browser storage or member
HTML. The refresh cookie is limited to `/api/session`. Logout revokes the backend
session and expires both cookies. Session state is checked on focus and every minute.
`/api/member/summary/` independently verifies membership before returning private data.

`SPREADBRIDGE_API_URL` is server-only and defaults to the deployed API at
`https://api.thespreadbridge.com/v1`, using that server's member and subscription records.
`.env.example` documents an explicit local API override for isolated test accounts.
No Google client secret or API signing secret belongs in this frontend.
`SPREADBRIDGE_SITE_ORIGIN` optionally supplies a canonical origin behind a proxy.

For local review, open **http://127.0.0.1:3210/** rather than localhost. The API's
existing loopback OAuth flow returns a short-lived code to this origin; the frontend
immediately forwards it to its own callback, sets the session and removes the code
from the final URL. The deployed backend's registered Google callback is
`https://api.thespreadbridge.com/v1/auth/google/desktop/callback`. The Google
consent-screen service name is managed in the Spreadbridge Cloud OAuth registration.

### Google consent branding (2026-10-24)

The live authorization endpoint and the private server credential file already use
the `spreadbridge` Google Cloud project (project number `343250169455`) and its
`Spreadbridge Server` Web OAuth client. The project app name is already
`Spreadbridge`; changing the credential pair alone does not change the consent label.

The Google Auth Platform branding homepage and privacy links have been changed to
`https://thespreadbridge.com/` and `https://thespreadbridge.com/privacy/` and the
branding authorized-domain list now contains only `thespreadbridge.com`;
`growbee.ai` was removed at the user's request. The API callback URI
is registered separately in the server OAuth client, and a fresh Google
authorization request still opens the Spreadbridge account chooser. The public homepage and privacy URLs both return HTTP 200;
the unpublished terms draft is not linked from Google branding.

With the user's explicit approval, `hoho0443@gmail.com` was added as a Search
Console owner while preserving `hoho@thespreadbridge.com`, connecting the verified
domain to the Cloud project owner. Google automatic brand verification passed and
the verified branding was published. A fresh Google authorization request now shows
“to continue to Spreadbridge” and links to the official domain's privacy policy.
No credential values were rotated or added to frontend code for this correction.

The Cloud project now has two active owners: `hoho0443@gmail.com` and
`hoho@thespreadbridge.com`. The second owner was added with explicit user approval
through the Google Cloud console's invitation flow, and the invitation was accepted.
Both `roles/owner` bindings were confirmed in the project's actual IAM policy.

For public HTTPS deployment, the API's web OAuth return URL must match
`https://<this-site>/api/session/google/callback`. The API fixes that return URL to
its `APP_PUBLIC_URL`, configured for `https://thespreadbridge.com` in the deployed backend.
Local review uses the separate loopback flow above. This frontend checks the API's returned destination and
shows its own error page if it would otherwise return the user to the legacy site.
Changing only frontend environment variables does not alter the API's callback rules.

`/payments/` also stays on this site. It reads the real subscription catalog and
account receipts. Checkout is available only if the API supplies an HTTPS checkout
URL and the verified active account has OWNER access. A missing checkout URL is
shown as unavailable and does not create an order.

## Development and verification

Requires Node.js 24.

```sh
npm ci
npm run dev -- --hostname 127.0.0.1 --port 3210
npm test
npm run typecheck
npm run build
```

Tests cover login state/PKCE matching, same-origin mutation checks, cookie handling,
session refresh/logout, subscription expiration and protected member data. Test
identities and credentials are isolated fixtures; no production entitlement is changed.

## Runtime and deployment

The app now requires the **Next.js server runtime** for same-site sessions. Build
output is `.next/`; it is no longer a static `out/` export.

```sh
npm run build
npm start -- --hostname 127.0.0.1 --port 3210
```

Vercel should use its Next.js preset, Node.js 24.x and framework-detected output.
Set a reachable server-only API origin and the correct site origin for the deployment.
Verify the web OAuth callback configuration above when using another public origin.
Keep existing DNS nameservers and Google Workspace mail records when managing domains.

The repository's production branch is `main`. The reviewed `codex/html-home-v6`
homepage is merged into `main` for the owner's requested production release.
The homepage, `/pricing/`, and `/payments/` all fetch `/public/subscriptions/catalog`
from the configured API without a stored-price fallback. Only enabled products are
shown; lookup failures are distinct from an empty catalog. Checkout requires a valid
HTTPS URL from the server. `/download/` fetches `/desktop/updates/latest` for each
platform and architecture, validates published artifact metadata, and displays only
the API's current releases. The historical JSON in `src/generated/` is no longer used
by these pages. Versioned installer URLs must reference immutable release files.

### Local API verification (2026-10-24)

The dedicated API reports `ready` with `database: ok`. Local Google sign-in returns
through the new API callback and retains the original `/payments/` destination.
Initial verification used an unsubscribed account (0 slots): the homepage, header and
subscription page agreed, and the private member summary rejected that session.
Following the owner's explicit request, the same account received an administrator
grant named `테스트 구독 · 5슬롯` with 5 slots and no expiration date. This creates no
payment receipt or recurring charge. The real API session, paid homepage, subscription
page and protected trade summary all reflected the grant. With no recorded trades,
the report correctly displayed zero realized P&L, zero entries and an empty history.
Automated tests also cover subscription expiry and access restrictions.

The owner also requested populated website verification for the same account. The
dataset contains eight synthetic PAPER execution records and four synthetic
subscription receipts (active, expired, revoked and scheduled). Records use the
`website-preview:` namespace and are identified by API test flags and per-row labels.
The page-wide test notice was removed at the owner's request. These records do not represent broker
orders or payment-provider transactions. The fixture grant has a 30-day preview
period so the website can render both remaining days and a dated expiration.
The seed transaction records its prior membership and exact inserted IDs for
scoped cleanup. No other account's data or published catalog is modified.

The deployed catalog currently has three products and no checkout URL. No published
installers are currently registered on the new server. Payment configuration and a
new desktop release are required before those actions can be exercised. Announcements
and policy/blog content remain site content; the API has no announcement CMS or
launch-alert registration endpoint. The future-product action links to announcements.
The countdown still uses the provisional review deadline documented above; it is not
a server-managed promotion schedule.

## Blog navigation and articles

The common header and footer link to `/blog/`. The index and 14 previously
published articles are included locally from the reviewed `3ac2d60` content,
using the shared public header, footer, session provider and dark site tokens.
Blog navigation stays on the current origin and preserves the member session.
Article bodies, IDs, slugs, publication dates, sources and canonical URLs are retained.
The few article inline layout styles were moved into the shared blog stylesheet.

`src/content/insights.json` contains the reviewed content. The build runs
`scripts/generate-content.mjs` to regenerate the 14-item RSS feed and a sitemap
covering public pages and all articles. Login and private account routes are
excluded from the sitemap.

Blog introductions and excerpts use the public site's concise product guidance tone.
`src/components/blog/BlogStart.tsx` owns the shared installation/guide call to action
for the index and article pages so its wording stays consistent across the blog.
