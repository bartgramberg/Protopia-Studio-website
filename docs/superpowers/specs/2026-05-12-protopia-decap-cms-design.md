# Protopia Studio Website — Design Spec
**Date:** 2026-05-12
**Scope:** Full website build with Decap CMS for projects and blog

---

## 1. Overview

Build the Protopia Studio marketing website from scratch using Astro, Tailwind CSS, and Decap CMS. The site is Dutch-primary with a full English translation. Projects and blog posts are managed through a Git-backed CMS (Decap) hosted on Netlify. All other pages (Waarom, Hoe, Wie, Contact) are static Astro pages.

**Stack:**
- Framework: Astro 4 (`output: 'static'`)
- Styling: Tailwind CSS + CSS custom properties for brand tokens
- CMS: Decap CMS (Git Gateway backend)
- Hosting: Netlify
- Repo: https://github.com/bartgramberg/Protopia-Studio-website

---

## 2. Design source

The visual design comes from the handoff bundle at `Protopia Studio Design System-handoff.zip`, specifically `protopiastudio-redesign.html`. All components must be implemented pixel-accurately against that prototype.

**Brand tokens (registered in `tailwind.config.mjs`):**
| Token | Value |
|---|---|
| `green` | `#48735B` |
| `green-dark` | `#3a5e49` |
| `creme` | `#F2EFE9` |
| `magenta` | `#D90D7D` |
| `blue` | `#347EBF` |
| `dark` | `#1A1A1A` |
| `mid` | `#4A4A4A` |
| `light` | `#7A7A7A` |
| `border` | `#DEDAD4` |

**Typography:** Poppins loaded via local `@font-face` (from `fonts/` in the design bundle). Never use Google Fonts CDN.

---

## 3. Project structure

```
protopia-studio-website/
├── src/
│   ├── content/
│   │   ├── config.ts               ← Zod schemas for content collections
│   │   ├── projects/
│   │   │   ├── nl/[slug].md
│   │   │   └── en/[slug].md
│   │   └── blog/
│   │       ├── nl/[slug].md
│   │       └── en/[slug].md
│   ├── pages/
│   │   ├── index.astro             ← Home (NL)
│   │   ├── waarom.astro
│   │   ├── hoe.astro
│   │   ├── projecten/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── wie.astro
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── contact.astro
│   │   └── en/
│   │       ├── index.astro
│   │       ├── why.astro
│   │       ├── how.astro
│   │       ├── projects/
│   │       │   ├── index.astro
│   │       │   └── [slug].astro
│   │       ├── who.astro
│   │       ├── blog/
│   │       │   ├── index.astro
│   │       │   └── [slug].astro
│   │       └── contact.astro
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Footer.astro
│   │   ├── ProjectCard.astro
│   │   ├── BlogCard.astro
│   │   └── LanguageSwitcher.astro
│   ├── layouts/
│   │   └── Base.astro              ← HTML shell, fonts, meta tags
│   ├── styles/
│   │   └── global.css              ← Tailwind directives + brand CSS vars
│   └── i18n/
│       └── translations.ts         ← UI string translations (nav, labels, CTAs)
├── public/
│   ├── admin/
│   │   ├── index.html              ← Decap CMS UI entry point
│   │   └── config.yml              ← CMS collections config
│   ├── uploads/                    ← Images uploaded via CMS
│   └── assets/                     ← Static brand assets (logo, fonts)
├── astro.config.mjs
├── tailwind.config.mjs
├── netlify.toml
└── package.json
```

---

## 4. Content collections schema

### 4.1 Projects

File path pattern: `src/content/projects/{locale}/{slug}.md`

**Frontmatter (Zod schema):**
```ts
{
  title:       z.string(),
  description: z.string(),
  challenge:   z.string(),
  role:        z.string(),
  result:      z.string(),
  imageAlt:    z.string(),
  typeProject: z.string(),
  category:    z.enum(['environments', 'businesses', 'products']),
  services:    z.array(z.enum(['research', 'design', 'realisation'])),
  year:        z.string(),
  image:       z.string(),
  featured:    z.boolean().default(false),
  order:       z.number(),
  link:        z.string().optional(),
}
```

**Category display labels:**
| Key | NL | EN |
|---|---|---|
| `environments` | Regeneratieve omgevingen | Regenerative environments |
| `businesses` | Regeneratieve bedrijven | Regenerative businesses |
| `products` | Regeneratieve producten | Regenerative products |

**Services display labels:**
| Key | NL | EN |
|---|---|---|
| `research` | Onderzoek & Strategie | Research & Strategy |
| `design` | Concept & Ontwerp | Concept & Design |
| `realisation` | Co-creatie & Realisatie | Co-creation & Realisation |

### 4.2 Blog

File path pattern: `src/content/blog/{locale}/{slug}.md`

**Frontmatter (Zod schema):**
```ts
{
  title:       z.string(),
  category:    z.string(),
  author:      z.string(),
  date:        z.date(),
  image:       z.string().optional(),
  readingTime: z.number(),
}
```

---

## 5. Decap CMS configuration

**File:** `public/admin/config.yml`

```yaml
backend:
  name: github
  repo: bartgramberg/Protopia-Studio-website
  branch: main

media_folder: public/uploads
public_folder: /uploads

i18n:
  structure: multiple_folders
  locales: [nl, en]
  default_locale: nl

collections:
  - name: projects
    label: Projects
    folder: src/content/projects
    create: true
    slug: "{{slug}}"
    i18n: true
    fields:
      - { label: Title,                   name: title,       widget: string,   i18n: true }
      - { label: Description,             name: description, widget: text,     i18n: true }
      - { label: Challenge,               name: challenge,   widget: text,     i18n: true }
      - { label: Our role,                name: role,        widget: text,     i18n: true }
      - { label: Result,                  name: result,      widget: markdown, i18n: true }
      - { label: Body (full detail page),  name: body,        widget: markdown, i18n: true }
      - { label: Image alt text,          name: imageAlt,    widget: string,   i18n: true }
      - { label: Project type,            name: typeProject, widget: string,   i18n: true }
      - label: Category
        name: category
        widget: select
        i18n: true
        options:
          - { label: "Regenerative environments", value: "environments" }
          - { label: "Regenerative businesses",   value: "businesses" }
          - { label: "Regenerative products",     value: "products" }
      - label: Services
        name: services
        widget: list
        i18n: true
        field:
          widget: select
          options:
            - { label: "Research & Strategy",       value: "research" }
            - { label: "Concept & Design",          value: "design" }
            - { label: "Co-creation & Realisation", value: "realisation" }
      - { label: Year,                    name: year,        widget: string,  i18n: duplicate }
      - { label: Image,                   name: image,       widget: image,   i18n: duplicate }
      - { label: Featured on homepage,    name: featured,    widget: boolean, i18n: duplicate, default: false }
      - { label: Display order,           name: order,       widget: number,  i18n: duplicate }
      - { label: External link,           name: link,        widget: string,  i18n: duplicate, required: false }

  - name: blog
    label: Blog
    folder: src/content/blog
    create: true
    slug: "{{slug}}"
    i18n: true
    fields:
      - { label: Title,              name: title,       widget: string,   i18n: true }
      - { label: Category,           name: category,    widget: string,   i18n: true }
      - { label: Body,               name: body,        widget: markdown, i18n: true }
      - { label: Author,             name: author,      widget: string,   i18n: duplicate }
      - { label: Date,               name: date,        widget: datetime, i18n: duplicate }
      - { label: Image,              name: image,       widget: image,    i18n: duplicate, required: false }
      - { label: Reading time (min), name: readingTime, widget: number,   i18n: duplicate }
```

**Authentication:** Netlify Identity + Git Gateway. Editors log in at `/admin`. Access is managed via Netlify Identity invites — no GitHub account required for editors.

---

## 6. Routing

Dutch is the default locale (no URL prefix). English lives under `/en/`.

| NL URL | EN URL | Page |
|---|---|---|
| `/` | `/en` | Home |
| `/waarom` | `/en/why` | Waarom regeneratie |
| `/hoe` | `/en/how` | Hoe we werken |
| `/projecten` | `/en/projects` | Projects overview |
| `/projecten/[slug]` | `/en/projects/[slug]` | Project detail |
| `/wie` | `/en/who` | Wie we zijn |
| `/blog` | `/en/blog` | Blog overview |
| `/blog/[slug]` | `/en/blog/[slug]` | Blog post |
| `/contact` | `/en/contact` | Contact |

**Language switcher** in Nav links to the counterpart page. Each page receives its `locale` and `slug` as props to construct the alternate URL.

**Static pages** (no CMS): `waarom`, `hoe`, `wie`, `contact`. Content hardcoded in Astro, matching the prototype.

---

## 7. i18n UI strings

Non-CMS UI text (nav labels, CTAs, section headings on static pages) lives in `src/i18n/translations.ts` — a typed key/value map per locale. Example:

```ts
export const translations = {
  nl: {
    nav: {
      waarom: 'Waarom',
      hoe: 'Hoe we werken',
      projecten: 'Projecten',
      wie: 'Wie we zijn',
      blog: 'Blog',
      contact: 'Contact',
    },
    projects: {
      filterAll: 'Alles',
      filterEnvironments: 'Regeneratieve omgevingen',
      filterBusinesses: 'Regeneratieve bedrijven',
      filterProducts: 'Regeneratieve producten',
      readMore: 'Lees meer',
    },
    // …
  },
  en: {
    nav: {
      waarom: 'Why',
      hoe: 'How we work',
      projecten: 'Projects',
      wie: 'Who we are',
      blog: 'Blog',
      contact: 'Contact',
    },
    projects: {
      filterAll: 'All',
      filterEnvironments: 'Regenerative environments',
      filterBusinesses: 'Regenerative businesses',
      filterProducts: 'Regenerative products',
      readMore: 'Read more',
    },
    // …
  },
}
```

---

## 8. Seed content

All 19 projects from `Protopia Projects.csv` will be seeded as NL Markdown files in `src/content/projects/nl/`. English versions created as stubs (title + description only) to be completed by the team.

**Projects with `featured: true` (shown in home grid):**
1. Amsterdam Regeneratieve Stad (order: 1)
2. ENT — Engage Nature Tool (order: 2)
3. Carbon Bank — Rabobank (order: 3)

**Note on images:** Original images are Wix CDN URLs and must be re-uploaded to `public/uploads/`. The seed data will use the original filenames from the CSV as placeholders; image paths must be updated after upload.

---

## 9. Netlify setup

**`netlify.toml`:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/admin"
  to = "/admin/index.html"
  status = 200
```

**Required Netlify settings (manual, post-deploy):**
1. Enable Netlify Identity (Site settings → Identity)
2. Enable Git Gateway (Identity → Services → Git Gateway)
3. Invite editors via Identity → Invite users

---

## 10. Key constraints

- No Google Fonts — Poppins loaded from `public/assets/fonts/` via `@font-face`
- No colors outside the brand palette — enforced via Tailwind config (no arbitrary values for color)
- No gradients, no icon libraries except Lucide if needed
- Tailwind utility classes for layout/spacing; brand color tokens via CSS vars + Tailwind theme extension
- All category/service filter logic uses language-neutral keys, not translated strings
- Project filter on `/projecten` uses client-side JS (no page reload) — matching the prototype behaviour
