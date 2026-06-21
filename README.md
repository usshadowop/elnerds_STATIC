# Extra Life Nerds

Static site for the Extra Life Nerds charity gaming team, raising funds for
Gillette Children's Hospital through Extra Life's 24-hour gaming marathon.

Live at [elnerds.com](https://elnerds.com).

## Tech stack

- [Vite](https://vite.dev/) + [React 19](https://react.dev/) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) for styling
- [lucide-react](https://lucide.dev/) for icons
- A small hand-rolled client-side router (`src/lib/router.tsx`) — no
  `react-router-dom` dependency
- [Bun](https://bun.sh/) as the package manager / task runner

## Project structure

```
src/
  assets/              images (team photos, patient photos, hero/carousel art)
  components/site/     homepage section components (Hero, Schedule, Donors, ...)
  hooks/               shared React hooks (e.g. countdown timer)
  lib/router.tsx        usePath() / navigate() for client-side routing
  pages/               routed pages: Home, Registration, GilletteChildrensHospital,
                       PatientProfiles
  App.tsx              top-level layout + route switch
```

## Development

```bash
bun install
bun run dev      # start the Vite dev server
bun run build    # production build to dist/ (also copies index.html to 404.html
                 # for GitHub Pages SPA fallback)
bun run preview  # preview the production build locally
bun run lint      # run ESLint
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the
site with Bun and publishes `dist/` via GitHub Pages. The custom domain is
pinned with `public/CNAME`.
