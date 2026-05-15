# primorum-site

Public website for **Primorum** — AI-native venture builder.

- Live: <https://primorum.ai>
- Pages preview: <https://primorum-site.pages.dev>
- Stack: Astro 5 (static), no JS framework
- Hosting: Cloudflare Pages (direct upload via `wrangler`, or GitHub Actions on push to `main`)

## Develop

```bash
npm install
npm run dev      # http://127.0.0.1:4321
npm run build    # → dist/
npm run preview  # serve dist/ locally
```

## Deploy

Push to `main` and the `.github/workflows/deploy.yml` workflow builds and uploads `dist/` to the
`primorum-site` Cloudflare Pages project.

For a manual one-shot deploy from this machine:

```bash
export CLOUDFLARE_ACCOUNT_ID=431d56f2b88e522f3afdd509866b3f55
export CLOUDFLARE_API_TOKEN=$(/opt/google-cloud-sdk/bin/gcloud secrets versions access latest \
  --secret=cloudflare-pages-deploy-token --project=brendanardagh-181305)
npm run build
npx wrangler pages deploy dist --project-name=primorum-site --branch=main --commit-dirty=true
```

## Content source

Copy is distilled from the source-of-truth thesis in the Obsidian vault at
`Projects/Primorum/Thesis.md` and `Projects/Primorum/Primorum.md`. Treat the vault as canonical —
update copy there first, then mirror the meaningful changes into the site.
