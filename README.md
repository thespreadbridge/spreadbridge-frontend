# Spreadbridge Frontend

Public website for Spreadbridge. Next.js website with same-site Google sign-in, HttpOnly sessions and subscription pages backed by the dedicated Spreadbridge API.

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

The server build is generated in `.next/`. Vercel uses the Next.js preset with no output directory override. Run `npm test` and `npm run typecheck` before publishing.

Sign-in and subscription links stay on this domain. Set `SPREADBRIDGE_API_URL=https://api.thespreadbridge.com/v1` and `SPREADBRIDGE_SITE_ORIGIN=https://thespreadbridge.com` in production. OAuth secrets stay on the API server in AWS; do not add them to this repository. Checkout remains unavailable until the API has a configured payment provider URL.

Installers continue to use the existing immutable CloudFront URLs. Previously installed desktop builds keep their packaged API address until a new build is distributed.

The public subscription catalog and published release metadata in `src/generated/` are build-time snapshots. Update those snapshots when prices or published app versions change. Versioned installer URLs must continue to reference immutable, verified release files.

## Publishing with Vercel

This repository is connected to the existing `spreadbridge` project in the Spreadbridge Hobby team. The production branch is `main`; pushes to it trigger a Vercel build and, on success, update the production deployment. Other branches receive preview deployments.

- Framework preset: Next.js
- Node.js: 24.x
- Install: detected from `package-lock.json`
- Build: `npm run build`
- Output: framework-detected Next.js server runtime
- Vercel address: https://spreadbridge.vercel.app
- Custom domain: https://thespreadbridge.com (connected through HostingKR DNS)

Keep DNS at HostingKR. The Vercel project currently requests `A / @ / 216.198.79.1`; retain the existing nameservers and Google Workspace mail records. The frontend uses only the two server-side configuration variables above; account and payment credentials remain in the backend.

## Insights

The `/blog/` index and fourteen article routes are rendered from `src/content/insights.json`. Edit reviewed article text, descriptions, references, table-of-contents anchors, and related IDs there. The public content contains no draft scripts, reading-progress controls, or private application code. Keep the series metadata and article IDs stable when updating published URLs.

Use actual publication and material-update timestamps; do not bump dates on unchanged articles. `npm run build` regenerates `public/sitemap.xml` and `public/feed.xml` from that content before building. Article pages include a canonical URL, social metadata, BlogPosting and breadcrumb structured data. Product behavior must be checked against the distributed app before making precise UI or execution claims.
