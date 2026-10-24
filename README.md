# Spreadbridge Frontend

Public website for Spreadbridge. Next.js static export for the home, download, guide, pricing, and privacy pages.

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
