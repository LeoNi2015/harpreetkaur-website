# Harpreet Kaur — Personal Website

A cinematic, storytelling personal portfolio for **Harpreet Kaur**, Staff Technical Solutions Consultant at Google. Built with React, Vite, and GSAP for scroll-driven animations and professional presentation.

## Features

- **Hero** — Animated entrance with stats, portrait, and rotating accent ring
- **Story** — Scroll-triggered narrative chapters from 2008 to today
- **Career Journey** — Horizontal scroll-pinned timeline of 16+ years
- **Expertise** — Animated skill cards and technology cloud
- **Credentials** — Certifications, awards, and education
- **Contact** — LinkedIn and email CTAs
- **Particle field** — Subtle animated background network
- **Accessibility** — Respects `prefers-reduced-motion`

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Customize

1. **Profile photo** — Replace the hero image URL in `src/components/Hero.tsx` with your own photo
2. **Email** — Update `profile.email` in `src/data/profile.ts`
3. **Content** — All copy is centralized in `src/data/profile.ts`

## Tech Stack

- React 19 + TypeScript
- Vite
- GSAP + ScrollTrigger + @gsap/react

## Build & Deploy

```bash
npm run build   # outputs static files to dist/
npm run preview # local preview of production build
```

### Deploy to GCP (GCS + Cloud CDN)

This site is **fully static** after build — ideal for Google Cloud Storage with Cloud CDN.

```bash
export GCS_BUCKET="your-unique-bucket-name"
npm run deploy:gcs
```

See **[docs/FULL-DEPLOY-GUIDE.md](docs/FULL-DEPLOY-GUIDE.md)** for complete steps: GitHub repo → GCS → GXALB → CDN.
