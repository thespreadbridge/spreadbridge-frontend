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
