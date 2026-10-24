# Spreadbridge Frontend

Public website for Spreadbridge. Next.js static export for the home, download, guide, pricing, and privacy pages.

## Homepage v6 review branch

The `codex/html-home-v6` branch replaces the complete homepage with the supplied
Basis Lab v6 reference. The original is retained in `docs/design/basislab-home-v6.html`;
the React implementation and scoped styles live in `src/components/home-v6/`.

Run `npm run dev -- --hostname 127.0.0.1 --port 3210` to review it locally.
The navigation switch previews guest, unsubscribed, and subscribed screens. These
are presentation states, not authentication or access-control checks. Leaderboard,
spread distribution, account details, and the countdown are fixed reference data;
random profit increases and resetting countdown scripts are not executed. Live
data and authenticated subscription access still require backend integration.
Spreadbridge branding and contact information are applied. Reference copy (including stop-loss) and proposed pricing are retained
for discussion. The review homepage is marked noindex. Existing login, billing,
download, guide, and privacy destinations are connected where available.

## Development

Requires Node.js 24.

```sh
npm ci
npm run dev
```

## Build

```sh
npm run build
```

The static output is generated in `out/`. Vercel can build this repository with the Next.js preset.

Sign-in and billing links use the existing application at https://dollarflow.growbee.ai. Installers are served by the existing CloudFront distribution. No backend, account credentials, environment files, or installer binaries are included.

The public subscription catalog and published release metadata in `src/generated/` are build-time snapshots. Update those snapshots when prices or published app versions change. Versioned installer URLs must continue to reference immutable, verified release files.

## Publishing with Vercel

This repository is connected to the existing `spreadbridge` project in the Spreadbridge Hobby team. The production branch is `main`; pushes to it trigger a Vercel build and, on success, update the production deployment. Other branches receive preview deployments.

- Framework preset: Next.js
- Node.js: 24.x
- Install: detected from `package-lock.json`
- Build: `npm run build`
- Output: static export from `next.config.mjs`
- Vercel address: https://spreadbridge.vercel.app
- Custom domain: https://thespreadbridge.com (requires the root A record to be saved at HostingKR)

Keep DNS at HostingKR. The Vercel project currently requests `A / @ / 216.198.79.1`; retain the existing nameservers and Google Workspace mail records. No Vercel environment secrets are required for this public frontend.
