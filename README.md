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
October 31, 2026 at 23:59:59 KST for local review. Confirm that deadline before
publishing. Refreshing does not reset it. Reference copy (including stop-loss) and
proposed pricing are retained for discussion. The review homepage remains noindex.

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
Only homepage-specific section composition remains scoped in
`src/components/home-v6/home-v6.css`. The previous light landing stylesheet is no
longer loaded. Change shared tokens/components to update all public pages together.

## Authentication and subscription integration

`/login/` belongs to this frontend. Google authorization starts at
`/api/session/google/start/`; the callback exchanges the one-time PKCE code on the
server. Access and refresh credentials use HttpOnly, SameSite=Lax cookies (Secure
in production); neither is exposed through session JSON, browser storage or member
HTML. The refresh cookie is limited to `/api/session`. Logout revokes the backend
session and expires both cookies. Session state is checked on focus and every minute.
`/api/member/summary/` independently verifies membership before returning private data.

`SPREADBRIDGE_API_URL` is server-only and defaults to the existing API at
`https://dollarflow.growbee.ai/v1`, using real member and subscription records.
`.env.example` documents an explicit local API override for isolated test accounts.
No Google client secret or API signing secret belongs in this frontend.
`SPREADBRIDGE_SITE_ORIGIN` optionally supplies a canonical origin behind a proxy.

For local review, open **http://127.0.0.1:3210/** rather than localhost. The API's
existing loopback OAuth flow returns a short-lived code to this origin; the frontend
immediately forwards it to its own callback, sets the session and removes the code
from the final URL. The backend's registered Google callback still passes through
its existing growbee.ai endpoint. The Google consent-screen service name is also
managed in that existing Google Cloud OAuth registration.

### Google consent branding (2026-10-24)

The live authorization endpoint and the private server credential file already use
the `spreadbridge` Google Cloud project (project number `343250169455`) and its
`Spreadbridge Server` Web OAuth client. The project app name is already
`Spreadbridge`; changing the credential pair alone does not change the consent label.

The Google Auth Platform branding homepage and privacy links have been changed to
`https://thespreadbridge.com/` and `https://thespreadbridge.com/privacy/` and the
branding authorized-domain list now contains only `thespreadbridge.com`;
`growbee.ai` was removed at the user's request. The existing API callback URI
remains registered separately in the server OAuth client, and a fresh Google
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
`https://<this-site>/api/session/google/callback`. The existing API currently fixes
that return URL to its `APP_PUBLIC_URL`. Configure/deploy support for the new site's
allowed web callback and verify the Google OAuth registration before enabling login
on another public origin. This frontend checks the API's returned destination and
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
Resolve the web OAuth callback configuration above before publishing this branch.
Keep existing DNS nameservers and Google Workspace mail records when managing domains.

The repository's production branch is `main`; this work remains on
`codex/html-home-v6`. No remote push or production deployment is part of this change.
Installers remain on the existing CloudFront distribution. Published release metadata
and the public pricing catalog in `src/generated/` are build-time snapshots; the signed-in
billing page reads the current API catalog. Versioned installer URLs must continue to
reference immutable release files.
