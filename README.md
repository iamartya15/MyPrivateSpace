# MyPrivateSpace

React + Vite + TanStack Router app configured for GitHub Pages deployment.

## Local development

```bash
npm install
npm run dev
```

- Vite default URL: `http://localhost:5173`
- Optional alternate URL supported in OAuth provider settings: `http://localhost:8080`

## Environment variables

Copy `.env.example` to `.env` and fill values:

```bash
cp .env.example .env
```

Required:

- `VITE_GOOGLE_CLIENT_ID`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Never commit `.env` or any private service-role/database secrets.

## Build and preview

```bash
npm run build
npm run preview
```

For GitHub Pages fallback testing:

```bash
npm run build:pages
```

## GitHub Pages deployment

The repository uses `.github/workflows/deploy.yml`:

- builds on push to `main`
- uploads `dist` artifact
- deploys through GitHub Pages
- generates `dist/404.html` for SPA refresh fallback

Set repository secrets:

- `VITE_GOOGLE_CLIENT_ID`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Live URL: `https://iamartya15.github.io/MyPrivateSpace/`
