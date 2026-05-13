# Decap CMS setup

The admin interface is available at `/admin` and uses Decap CMS with the GitHub backend.

## How content is stored

Decap writes content directly to this repository:

- Projects: `src/content/projects/{nl,en}/`
- Blog posts: `src/content/blog/{nl,en}/`
- Uploaded media: `public/uploads/`

The site reads those Markdown files at build time. There is no separate content database.

## Editor login

The CMS is configured to use GitHub authentication:

```yaml
backend:
  name: github
  repo: bartgramberg/Protopia-Studio-website
  branch: main
```

Editors must be able to authenticate with GitHub and have write access to the repository, unless a separate OAuth proxy is configured.

For Netlify hosting, configure GitHub as an authentication provider for the site so Decap can complete the OAuth flow from `/admin`.

## Netlify notes

The site already redirects `/admin` to `/admin/index.html` in `netlify.toml`.

Netlify Identity and Git Gateway are intentionally not used here. Git Gateway depends on Netlify Identity, and Netlify currently marks Git Gateway as deprecated, so the GitHub backend is the cleaner long-term default.

## First production test

After deploying this setup:

1. Open `https://YOUR_DOMAIN/admin`.
2. Log in with an authorized GitHub account.
3. Edit a non-critical blog post or project.
4. Save/publish the change.
5. Confirm a Git commit appears on `main`.
6. Confirm Netlify rebuilds and publishes the updated site.
