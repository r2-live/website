# R2-Live / Kurt & The Gang Website

Dual-brand Austropop website built with Next.js, Decap CMS, and Vercel.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `DECAP_OAUTH_REDIRECT_URI` for Decap CMS
- `RESEND_API_KEY`, `CONTACT_TO_EMAIL` for the contact form

## Decap CMS

- Admin UI: `/admin`
- Local editing without auth: `npx decap-server` (uses `local_backend: true`)
- Production auth: GitHub OAuth via `/api/decap-auth`

### GitHub OAuth App setup

1. Create an OAuth App in GitHub Developer Settings
2. Callback URL: `https://<your-domain>/api/decap-callback`
3. Add env vars in Vercel

Editors need write access to the GitHub repository.

## Content structure

- `content/bands/` — band profiles
- `content/gallery/{band}/` — gallery images
- `content/setlist/{band}/` — repertoire samples
- `content/shared/` — events, venues, contact, legal

Media uploads from Decap go to `public/media/uploads/`.

## Deploy on Vercel

1. Import the GitHub repository in Vercel
2. Set environment variables
3. Update `public/admin/config.yml` `base_url`, `site_url`, and `display_url` to your production domain
4. Deploy — content changes via Decap trigger rebuilds on `main`

## Keyboard shortcuts

- `1`–`5` — jump to band sections
- `6`–`9` — jump to shared sections
- `R` / `G` — switch between R2-Live and Kurt & The Gang (while navbar visible)
