# Protopia Studio Website

Astro website for Protopia Studio. The site is built as a static site, uses
content collections for pages and articles, and includes a Decap CMS admin
environment for editing content.

## Tech Stack

- Astro
- Tailwind CSS
- Decap CMS
- Vitest
- Netlify

## Requirements

- Node.js `>=22.12.0`
- pnpm `9.x`

This repository declares pnpm in `package.json`, so pnpm is the preferred local
package manager.

## Getting Started

Install dependencies from the repository root:

```sh
pnpm install
```

Start the Astro dev server:

```sh
pnpm dev
```

Open the site at:

```text
http://localhost:4321
```

## Useful Commands

| Command | Action |
| :-- | :-- |
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start the local Astro dev server |
| `pnpm cms:local` | Start the local Decap CMS proxy server |
| `pnpm test` | Run Vitest tests |
| `pnpm test:ui` | Run the Vitest UI |
| `pnpm build` | Run Astro checks and build the production site |
| `pnpm preview` | Preview the production build locally |
| `pnpm astro ...` | Run Astro CLI commands |

## Project Structure

```text
/
├── public/
│   ├── admin/          # Decap CMS admin config and entry page
│   ├── assets/         # Static site assets
│   └── uploads/        # CMS-uploaded media
├── src/
│   ├── components/     # Reusable Astro components
│   ├── content/        # Blog, project, and team content collections
│   ├── i18n/           # Translation helpers and copy
│   ├── pages/          # Astro routes
│   └── styles/         # Global styles
├── astro.config.mjs
├── netlify.toml
└── package.json
```

## Local CMS Testing

The CMS is configured with `local_backend: true`, so you can test content edits
locally without pushing to GitHub or triggering a Netlify deploy.

Run these in two separate terminals:

```sh
pnpm cms:local
```

```sh
pnpm dev
```

Then open:

```text
http://localhost:4321/admin
```

Local CMS edits write directly to files in this repository. Content entries are
stored under `src/content/`, and uploaded media is stored under
`public/uploads/`.

After editing in the CMS, review the file changes:

```sh
git status
git diff
```

Then run the normal checks:

```sh
pnpm test
pnpm build
```

Commit the CMS-generated file changes only after the site builds successfully.

## Content Model

The CMS currently manages:

- Projects in `src/content/projects`
- Blog posts in `src/content/blog`
- Team members in `src/content/team-members`

The site supports Dutch and English content. Decap CMS is configured with
multiple locale folders, using `nl` as the default locale and `en` as the
English locale.

## Branch and Deployment Workflow

Use `dev` for ongoing work and testing. Keep `main` for production releases.

Netlify is expected to deploy from `main`, so merging or pushing to `main` can
trigger a production deployment. To reduce unnecessary Netlify usage, keep daily
development on `dev` and merge to `main` only when a release is ready.

### Update `dev` from `main`

If `dev` is behind `main`, bring it up to date like this:

```sh
git fetch origin
git switch dev
git merge origin/main
git push origin dev
```

### Release `dev` to `main`

When the changes on `dev` are tested and ready to deploy:

```sh
git fetch origin
git switch main
git pull origin main
git merge origin/dev
git push origin main
```

Pushing `main` is the release step. Netlify will build and deploy the production
site from that branch.

## Netlify

Netlify uses:

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

The `/admin` route is redirected to the Decap CMS admin page:

```toml
[[redirects]]
  from = "/admin"
  to = "/admin/index.html"
  status = 200
```

Production CMS authentication uses the GitHub backend configured in
`public/admin/config.yml`.
