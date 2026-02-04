# Vibhav Portfolio (Astro)

This is the source for **vibhavchennamadhava.io** (Astro + Tailwind).

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL printed in the terminal (usually `http://localhost:4321`).

## Build / preview

```bash
npm run build
npm run preview
```

## Deploy (GitHub Pages)

This repo includes a GitHub Actions workflow that builds and publishes to GitHub Pages on every push to `main`.

### If using a custom domain

- Keep `public/CNAME` set to your domain.
- In GitHub: **Settings → Pages**
  - Source: **GitHub Actions**
  - Custom domain: your domain
  - Enforce HTTPS: enable

## Update your content

- Home page: `src/pages/index.astro`
- Projects: `src/data/projects.ts`
- About: `src/pages/about.astro`
- Contact: `src/pages/contact.astro`
- Resume PDF: `public/resume.pdf`
