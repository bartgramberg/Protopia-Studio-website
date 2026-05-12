# Protopia Studio Website — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full Protopia Studio marketing website in Astro with Tailwind CSS and Decap CMS managing projects and blog posts in Dutch and English.

**Architecture:** Astro 4 static site with content collections (Zod-validated Markdown) for projects and blog. Dutch pages at root, English under `/en/`. Decap CMS writes Markdown to `src/content/projects/{nl,en}/` and `src/content/blog/{nl,en}/` via GitHub Git Gateway on Netlify.

**Tech Stack:** Astro 4, Tailwind CSS 3, Decap CMS, Vitest, Netlify Identity + Git Gateway, TypeScript

**Design source:** `protopiastudio-redesign.html` in the handoff zip — all visual implementation must match this prototype pixel-accurately.

**Spec:** `docs/superpowers/specs/2026-05-12-protopia-decap-cms-design.md`

---

## File map

```
src/
  content/
    config.ts                         ← Zod schemas for both collections
    projects/nl/*.md                  ← 19 NL project files (seeded)
    projects/en/*.md                  ← 19 EN stub files (seeded)
    blog/nl/*.md                      ← placeholder blog posts
    blog/en/*.md                      ← placeholder blog posts
  i18n/
    translations.ts                   ← All UI strings for nl + en
  layouts/
    Base.astro                        ← HTML shell, fonts, meta
  components/
    Nav.astro                         ← Fixed nav, language switcher
    Footer.astro                      ← Dark footer, 3-col grid
    ProjectCard.astro                 ← Card used on home + projecten pages
    BlogCard.astro                    ← Card used on home + blog page
  styles/
    global.css                        ← Tailwind directives + CSS vars + @font-face
  pages/
    index.astro                       ← Home NL
    waarom.astro                      ← Waarom regeneratie NL
    hoe.astro                         ← Hoe we werken NL
    wie.astro                         ← Wie we zijn NL
    contact.astro                     ← Contact NL
    projecten/
      index.astro                     ← Projects overview NL (filterable)
      [slug].astro                    ← Project detail NL
    blog/
      index.astro                     ← Blog overview NL
      [slug].astro                    ← Blog post NL
    en/
      index.astro                     ← Home EN
      why.astro
      how.astro
      who.astro
      contact.astro
      projects/
        index.astro
        [slug].astro
      blog/
        index.astro
        [slug].astro
public/
  admin/
    index.html                        ← Decap CMS UI entry point
    config.yml                        ← CMS collections config
  assets/
    fonts/                            ← Poppins TTF files (copied from zip)
    logo/                             ← PS logo PNG files (copied from zip)
scripts/
  seed-projects.mjs                   ← Reads CSV → writes 19 NL + 19 EN .md files
astro.config.mjs
tailwind.config.mjs
netlify.toml
package.json
tsconfig.json
```

---

## Task 1: Scaffold the Astro project

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tailwind.config.mjs`
- Create: `netlify.toml`
- Create: `tsconfig.json`

- [ ] **Step 1: Initialise the project**

```bash
cd /Users/bartgramberg/Library/CloudStorage/Dropbox/Coding/Protopia-Studio-website
npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git
npm install
npm install -D @astrojs/tailwind tailwindcss
npm install -D vitest @vitest/ui
npm install csv-parse
```

- [ ] **Step 2: Write `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'

export default defineConfig({
  integrations: [tailwind()],
  output: 'static',
})
```

- [ ] **Step 3: Write `tailwind.config.mjs`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts,jsx,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        green:   { DEFAULT: '#48735B', dark: '#3a5e49' },
        creme:   '#F2EFE9',
        magenta: '#D90D7D',
        blue:    '#347EBF',
        dark:    '#1A1A1A',
        mid:     '#4A4A4A',
        light:   '#7A7A7A',
        border:  '#DEDAD4',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      maxWidth: {
        content: '1100px',
      },
      borderRadius: {
        pill: '999px',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 4: Write `netlify.toml`**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/admin"
  to = "/admin/index.html"
  status = 200
```

- [ ] **Step 5: Write `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

- [ ] **Step 6: Add vitest config to `package.json`** (merge into the existing scripts block)

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "test": "vitest run",
    "test:ui": "vitest --ui"
  }
}
```

- [ ] **Step 7: Verify scaffold builds**

```bash
npm run dev
```
Expected: dev server starts on `http://localhost:4321`, no errors.

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "feat: scaffold Astro project with Tailwind and Vitest"
```

---

## Task 2: Brand assets and global CSS

**Files:**
- Create: `public/assets/fonts/` (copy from zip)
- Create: `public/assets/logo/` (copy from zip)
- Create: `src/styles/global.css`

- [ ] **Step 1: Copy fonts from design bundle**

```bash
mkdir -p public/assets/fonts
cp /tmp/protopia-unzip/protopia-studio-design-system/project/fonts/*.ttf public/assets/fonts/
```

- [ ] **Step 2: Copy logo assets**

```bash
mkdir -p public/assets/logo
cp /tmp/protopia-unzip/protopia-studio-design-system/project/assets/PS-logo-main-green.png public/assets/logo/
cp /tmp/protopia-unzip/protopia-studio-design-system/project/assets/PS-logo-main-green-small.png public/assets/logo/
cp /tmp/protopia-unzip/protopia-studio-design-system/project/assets/PS-logo-email.png public/assets/logo/
cp "/tmp/protopia-unzip/protopia-studio-design-system/project/assets/PS-logo-klein.png" public/assets/logo/
```

- [ ] **Step 3: Write `src/styles/global.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ── Poppins local font-face ──────────────────────────────── */
@font-face { font-family: 'Poppins'; src: url('/assets/fonts/Poppins-Thin.ttf') format('truetype'); font-weight: 100; font-style: normal; font-display: swap; }
@font-face { font-family: 'Poppins'; src: url('/assets/fonts/Poppins-Light.ttf') format('truetype'); font-weight: 300; font-style: normal; font-display: swap; }
@font-face { font-family: 'Poppins'; src: url('/assets/fonts/Poppins-LightItalic.ttf') format('truetype'); font-weight: 300; font-style: italic; font-display: swap; }
@font-face { font-family: 'Poppins'; src: url('/assets/fonts/Poppins-Regular.ttf') format('truetype'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Poppins'; src: url('/assets/fonts/Poppins-Italic.ttf') format('truetype'); font-weight: 400; font-style: italic; font-display: swap; }
@font-face { font-family: 'Poppins'; src: url('/assets/fonts/Poppins-Medium.ttf') format('truetype'); font-weight: 500; font-style: normal; font-display: swap; }
@font-face { font-family: 'Poppins'; src: url('/assets/fonts/Poppins-SemiBold.ttf') format('truetype'); font-weight: 600; font-style: normal; font-display: swap; }
@font-face { font-family: 'Poppins'; src: url('/assets/fonts/Poppins-Bold.ttf') format('truetype'); font-weight: 700; font-style: normal; font-display: swap; }
@font-face { font-family: 'Poppins'; src: url('/assets/fonts/Poppins-BoldItalic.ttf') format('truetype'); font-weight: 700; font-style: italic; font-display: swap; }
@font-face { font-family: 'Poppins'; src: url('/assets/fonts/Poppins-ExtraBold.ttf') format('truetype'); font-weight: 800; font-style: normal; font-display: swap; }
@font-face { font-family: 'Poppins'; src: url('/assets/fonts/Poppins-Black.ttf') format('truetype'); font-weight: 900; font-style: normal; font-display: swap; }

/* ── CSS custom properties (mirrors Tailwind theme) ──────── */
:root {
  --green:      #48735B;
  --green-dark: #3a5e49;
  --creme:      #F2EFE9;
  --magenta:    #D90D7D;
  --blue:       #347EBF;
  --dark:       #1A1A1A;
  --mid:        #4A4A4A;
  --light:      #7A7A7A;
  --border:     #DEDAD4;
  --white:      #FFFFFF;
}

/* ── Base ─────────────────────────────────────────────────── */
html { scroll-behavior: smooth; }
body { -webkit-font-smoothing: antialiased; text-wrap: pretty; }
a { text-decoration: none; color: inherit; }
img { display: block; max-width: 100%; }

/* ── Client logo marquee animation ───────────────────────── */
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.animate-marquee { animation: marquee 60s linear infinite; }
.animate-marquee:hover { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) { .animate-marquee { animation: none; } }
```

- [ ] **Step 4: Import global CSS in `astro.config.mjs`** — the `@astrojs/tailwind` integration handles this automatically via the `global.css` path. Verify it's picked up:

```bash
npm run dev
```
Expected: page uses Poppins font (visible in browser devtools → Network → Fonts).

- [ ] **Step 5: Commit**

```bash
git add public/assets src/styles/global.css astro.config.mjs tailwind.config.mjs netlify.toml tsconfig.json package.json
git commit -m "feat: add brand assets, Poppins fonts, global CSS and Tailwind tokens"
```

---

## Task 3: Content collections schema

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/projects/nl/.gitkeep`
- Create: `src/content/projects/en/.gitkeep`
- Create: `src/content/blog/nl/.gitkeep`
- Create: `src/content/blog/en/.gitkeep`
- Create: `src/content/config.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/content/config.test.ts
import { describe, it, expect } from 'vitest'
import { z } from 'astro/zod'

describe('project schema', () => {
  it('accepts a valid project entry', () => {
    const schema = z.object({
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
    })
    const result = schema.safeParse({
      title: 'Test',
      description: 'desc',
      challenge: 'ch',
      role: 'r',
      result: 'res',
      imageAlt: 'alt',
      typeProject: 'type',
      category: 'products',
      services: ['research', 'design'],
      year: '2025',
      image: '/uploads/test.jpg',
      featured: true,
      order: 1,
    })
    expect(result.success).toBe(true)
  })

  it('rejects an invalid category', () => {
    const schema = z.object({
      category: z.enum(['environments', 'businesses', 'products']),
    })
    const result = schema.safeParse({ category: 'invalid' })
    expect(result.success).toBe(false)
  })
})
```

- [ ] **Step 2: Run test — expect failure** (module not found yet)

```bash
npm test
```
Expected: FAIL — `Cannot find module 'astro/zod'` or test file not found yet.

- [ ] **Step 3: Write `src/content/config.ts`**

```ts
import { defineCollection, z } from 'astro:content'

const projectSchema = z.object({
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
})

const blogSchema = z.object({
  title:       z.string(),
  category:    z.string(),
  author:      z.string(),
  date:        z.date(),
  image:       z.string().optional(),
  readingTime: z.number(),
})

export const collections = {
  projects: defineCollection({ type: 'content', schema: projectSchema }),
  blog:     defineCollection({ type: 'content', schema: blogSchema }),
}

export type ProjectData = z.infer<typeof projectSchema>
export type BlogData    = z.infer<typeof blogSchema>
```

- [ ] **Step 4: Fix test to import from `zod` directly**

Update `src/content/config.test.ts` — replace `from 'astro/zod'` with `from 'zod'`:

```ts
import { z } from 'zod'
```

- [ ] **Step 5: Create placeholder content folders**

```bash
mkdir -p src/content/projects/nl src/content/projects/en
mkdir -p src/content/blog/nl src/content/blog/en
touch src/content/projects/nl/.gitkeep src/content/projects/en/.gitkeep
touch src/content/blog/nl/.gitkeep src/content/blog/en/.gitkeep
```

- [ ] **Step 6: Run tests — expect pass**

```bash
npm test
```
Expected: PASS — 2 tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/content/
git commit -m "feat: add content collection schemas for projects and blog"
```

---

## Task 4: i18n translations module

**Files:**
- Create: `src/i18n/translations.ts`
- Create: `src/i18n/translations.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/i18n/translations.test.ts
import { describe, it, expect } from 'vitest'
import { translations } from './translations'

describe('translations', () => {
  it('has identical top-level keys for nl and en', () => {
    const nlKeys = Object.keys(translations.nl).sort()
    const enKeys = Object.keys(translations.en).sort()
    expect(nlKeys).toEqual(enKeys)
  })

  it('has identical nav keys for nl and en', () => {
    const nlKeys = Object.keys(translations.nl.nav).sort()
    const enKeys = Object.keys(translations.en.nav).sort()
    expect(nlKeys).toEqual(enKeys)
  })

  it('has identical projects keys for nl and en', () => {
    const nlKeys = Object.keys(translations.nl.projects).sort()
    const enKeys = Object.keys(translations.en.projects).sort()
    expect(nlKeys).toEqual(enKeys)
  })
})
```

- [ ] **Step 2: Run test — expect failure** (module not found)

```bash
npm test
```
Expected: FAIL — cannot find `./translations`.

- [ ] **Step 3: Write `src/i18n/translations.ts`**

```ts
export type Locale = 'nl' | 'en'

const nl = {
  nav: {
    waarom:    'Waarom',
    hoe:       'Hoe we werken',
    projecten: 'Projecten',
    wie:       'Wie we zijn',
    blog:      'Blog',
    contact:   'Contact',
    cta:       'Neem contact op',
  },
  projects: {
    eyebrow:            'Projecten waar we trots op zijn.',
    filterAll:          'Alles',
    filterEnvironments: 'Regeneratieve omgevingen',
    filterBusinesses:   'Regeneratieve bedrijven',
    filterProducts:     'Regeneratieve producten',
    readMore:           'Lees meer',
    viewAll:            'Bekijk alle projecten',
    categoryLabel: {
      environments: 'Regeneratieve omgeving',
      businesses:   'Regeneratief bedrijf',
      products:     'Regeneratief product',
    },
    servicesLabel: {
      research:    'Onderzoek & Strategie',
      design:      'Concept & Ontwerp',
      realisation: 'Co-creatie & Realisatie',
    },
    challenge: 'Uitdaging',
    role:      'Onze rol',
    result:    'Resultaat',
  },
  blog: {
    eyebrow:  'Journal',
    title:    'Dit inspireert ons.',
    lead:     'Gedachten, excursies en inzichten vanuit de praktijk.',
    viewAll:  'Bekijk alle blogposts',
    readMore: 'Lees meer',
    latestTitle: 'Laatste blogs.',
  },
  home: {
    heroTitle:    'Wij ontwerpen steden, projecten en producten voor een',
    heroAccent:   'veerkrachtige wereld.',
    heroSub:      'Wij ontwerpen en ontwikkelen steden, projecten en producten voor een veerkrachtige wereld.',
    heroTagline:  'Regenerative Design Studio',
    heroCta:      'Bekijk onze projecten',
    heroCtaAlt:   'Neem contact op',
    servicesTitle: 'Hoe we werken.',
    service1Num:  '1',
    service1Title: 'Onderzoek & Strategie',
    service1Desc: 'Complexe vraagstukken herleid tot concrete strategieën.',
    service2Num:  '2',
    service2Title: 'Concept & Ontwerp',
    service2Desc: 'Innovatieve concepten, businessmodellen en plekken — direct gebouwd en getest.',
    service3Num:  '3',
    service3Title: 'Co-creatie & Realisatie',
    service3Desc: 'Teams, labs en partnerschappen bouwen die tastbare resultaten leveren.',
    quoteText:    '"Geen utopie met abstracte idealen, maar concrete, haalbare stappen in de transitie naar een betere wereld."',
    quoteAttr:    '— Protopia Studio',
    ctaTitle:     'Klaar om samen te bouwen?',
    ctaSub:       'Van post-it, via pilot naar product. Van rapport naar resultaat.',
    ctaPrimary:   'Neem contact op',
    ctaSecondary: 'Bekijk het journal',
  },
  waarom: {
    eyebrow: 'Waarom regeneratie',
    title:   'Waarom regeneratief?',
    lead:    'Duurzaamheid is niet genoeg. We moeten verder gaan dan minder schade — naar actief herstel.',
  },
  hoe: {
    eyebrow: 'Hoe we werken',
    title:   'Hoe we werken',
    lead:    'Onze kracht ligt in het combineren van onderzoek, ontwerp en realisatie.',
  },
  wie: {
    eyebrow:      'Wie we zijn',
    title:        'Wij zijn Protopians.',
    missionTitle: 'Hoopvolle verandering, concreet gemaakt.',
    teamEyebrow:  'Het Protopia Team',
    teamTitle:    'De kern.',
    advisorEyebrow: 'Onze raad van advies',
    advisorTitle:   'Meer dan adviseurs.',
    partnerEyebrow: 'Samenwerkingspartners',
    partnerTitle:   'Met wie we bouwen.',
  },
  contact: {
    eyebrow: 'Contact',
    title:   'Laten we kennismaken.',
    lead:    'Heb je een vraag, een project of wil je gewoon een kop koffie drinken?',
  },
  footer: {
    tagline: 'Regenerative Design Studio',
    colNav:  'Navigatie',
    colWork: 'Werken bij',
    copy:    '© 2026 Protopia Studio',
  },
  lang: {
    toggle: 'EN',
    current: 'NL',
  },
}

const en: typeof nl = {
  nav: {
    waarom:    'Why',
    hoe:       'How we work',
    projecten: 'Projects',
    wie:       'Who we are',
    blog:      'Blog',
    contact:   'Contact',
    cta:       'Get in touch',
  },
  projects: {
    eyebrow:            'Projects we are proud of.',
    filterAll:          'All',
    filterEnvironments: 'Regenerative environments',
    filterBusinesses:   'Regenerative businesses',
    filterProducts:     'Regenerative products',
    readMore:           'Read more',
    viewAll:            'View all projects',
    categoryLabel: {
      environments: 'Regenerative environment',
      businesses:   'Regenerative business',
      products:     'Regenerative product',
    },
    servicesLabel: {
      research:    'Research & Strategy',
      design:      'Concept & Design',
      realisation: 'Co-creation & Realisation',
    },
    challenge: 'Challenge',
    role:      'Our role',
    result:    'Result',
  },
  blog: {
    eyebrow:  'Journal',
    title:    'What inspires us.',
    lead:     'Thoughts, excursions and insights from practice.',
    viewAll:  'View all posts',
    readMore: 'Read more',
    latestTitle: 'Latest posts.',
  },
  home: {
    heroTitle:    'We design cities, projects and products for a',
    heroAccent:   'resilient world.',
    heroSub:      'We design and develop cities, projects and products for a resilient world.',
    heroTagline:  'Regenerative Design Studio',
    heroCta:      'View our projects',
    heroCtaAlt:   'Get in touch',
    servicesTitle: 'How we work.',
    service1Num:  '1',
    service1Title: 'Research & Strategy',
    service1Desc: 'Complex questions distilled into concrete strategies.',
    service2Num:  '2',
    service2Title: 'Concept & Design',
    service2Desc: 'Innovative concepts, business models and places — built and tested immediately.',
    service3Num:  '3',
    service3Title: 'Co-creation & Realisation',
    service3Desc: 'Building teams, labs and partnerships that deliver tangible results.',
    quoteText:    '"No utopia with abstract ideals, but concrete, achievable steps in the transition to a better world."',
    quoteAttr:    '— Protopia Studio',
    ctaTitle:     'Ready to build together?',
    ctaSub:       'From post-it, via pilot to product. From report to result.',
    ctaPrimary:   'Get in touch',
    ctaSecondary: 'View the journal',
  },
  waarom: {
    eyebrow: 'Why regeneration',
    title:   'Why regenerative?',
    lead:    'Sustainability is not enough. We must go beyond less damage — towards active restoration.',
  },
  hoe: {
    eyebrow: 'How we work',
    title:   'How we work',
    lead:    'Our strength lies in combining research, design and realisation.',
  },
  wie: {
    eyebrow:      'Who we are',
    title:        'We are Protopians.',
    missionTitle: 'Hopeful change, made concrete.',
    teamEyebrow:  'The Protopia Team',
    teamTitle:    'The core.',
    advisorEyebrow: 'Our advisory board',
    advisorTitle:   'More than advisors.',
    partnerEyebrow: 'Collaboration partners',
    partnerTitle:   'Who we build with.',
  },
  contact: {
    eyebrow: 'Contact',
    title:   "Let's get acquainted.",
    lead:    'Have a question, a project or just want a coffee?',
  },
  footer: {
    tagline: 'Regenerative Design Studio',
    colNav:  'Navigation',
    colWork: 'Work with us',
    copy:    '© 2026 Protopia Studio',
  },
  lang: {
    toggle:  'NL',
    current: 'EN',
  },
}

export const translations = { nl, en }

export function t(locale: Locale) {
  return translations[locale]
}

/** Maps a NL page path to its EN counterpart and vice versa */
export const altPaths: Record<string, string> = {
  '/':           '/en',
  '/waarom':     '/en/why',
  '/hoe':        '/en/how',
  '/wie':        '/en/who',
  '/contact':    '/en/contact',
  '/projecten':  '/en/projects',
  '/blog':       '/en/blog',
  '/en':         '/',
  '/en/why':     '/waarom',
  '/en/how':     '/hoe',
  '/en/who':     '/wie',
  '/en/contact': '/contact',
  '/en/projects':'/projecten',
  '/en/blog':    '/blog',
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npm test
```
Expected: PASS — 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/i18n/
git commit -m "feat: add i18n translations module for nl and en"
```

---

## Task 5: Base layout

**Files:**
- Create: `src/layouts/Base.astro`

- [ ] **Step 1: Write `src/layouts/Base.astro`**

```astro
---
import '../styles/global.css'
import type { Locale } from '../i18n/translations'

interface Props {
  title: string
  description?: string
  locale: Locale
  altHref: string   // URL of this page in the other locale
}

const { title, description, locale, altHref } = Astro.props
const canonicalBase = 'https://protopiastudio.nl'
const canonical = canonicalBase + Astro.url.pathname
const altBase = locale === 'nl'
  ? canonicalBase + altHref
  : canonicalBase + altHref
---
<!DOCTYPE html>
<html lang={locale}>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title} | Protopia Studio</title>
  {description && <meta name="description" content={description} />}
  <link rel="canonical" href={canonical} />
  <link rel="alternate" hreflang={locale === 'nl' ? 'en' : 'nl'} href={altBase} />
  <link rel="icon" type="image/png" href="/assets/logo/PS-logo-main-green-small.png" />
</head>
<body class="font-sans bg-white text-dark antialiased">
  <slot />
</body>
</html>
```

- [ ] **Step 2: Verify it renders**

Create a temp page `src/pages/test.astro`:
```astro
---
import Base from '../layouts/Base.astro'
---
<Base title="Test" locale="nl" altHref="/en">
  <p class="text-green p-8">Brand green works.</p>
</Base>
```
Run `npm run dev` and visit `http://localhost:4321/test`. Expect: green text, Poppins font.
Delete `src/pages/test.astro` before committing.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/
git commit -m "feat: add Base layout with meta, canonical, hreflang"
```

---

## Task 6: Nav and Footer components

**Files:**
- Create: `src/components/Nav.astro`
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Write `src/components/Nav.astro`**

Match the prototype's fixed nav exactly: logo left, links centre, CTA button right, NL/EN toggle.

```astro
---
import type { Locale } from '../i18n/translations'
import { t } from '../i18n/translations'

interface Props {
  locale: Locale
  altHref: string
  activePage?: string
}
const { locale, altHref, activePage } = Astro.props
const tr = t(locale)
const base = locale === 'nl' ? '' : '/en'
---
<nav class="fixed top-0 left-0 right-0 z-50 bg-white/97 border-b border-border">
  <div class="max-w-content mx-auto px-10 h-16 flex items-center justify-between">

    <!-- Brand -->
    <a href={base + '/'} class="flex items-center gap-2.5">
      <img src="/assets/logo/PS-logo-main-green.png" alt="Protopia Studio" class="h-10" />
      <span class="text-[11px] font-medium text-light tracking-wide">{tr.nav.waarom.split('')[0] && tr.home.heroTagline}</span>
    </a>

    <!-- Links -->
    <ul class="hidden md:flex gap-7 list-none">
      {[
        { href: base + '/waarom',    label: tr.nav.waarom,    key: 'waarom' },
        { href: base + '/hoe',       label: tr.nav.hoe,       key: 'hoe' },
        { href: base + '/projecten', label: tr.nav.projecten, key: 'projecten' },
        { href: base + '/wie',       label: tr.nav.wie,       key: 'wie' },
        { href: base + '/blog',      label: tr.nav.blog,      key: 'blog' },
      ].map(link => (
        <li>
          <a
            href={link.href}
            class={`text-[13px] font-medium transition-colors duration-150 ${activePage === link.key ? 'text-green' : 'text-mid hover:text-green'}`}
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>

    <!-- Right: CTA + lang toggle -->
    <div class="flex items-center gap-3">
      <a
        href={altHref}
        class="text-[12px] font-semibold text-light hover:text-green transition-colors"
        aria-label="Switch language"
      >
        {tr.lang.toggle}
      </a>
      <a
        href={base + '/contact'}
        class="inline-flex items-center px-5 py-2 rounded-pill text-[13px] font-semibold bg-green text-white hover:bg-green-dark transition-colors"
      >
        {tr.nav.cta}
      </a>
    </div>
  </div>
</nav>
<!-- Spacer for fixed nav -->
<div class="h-16"></div>
```

- [ ] **Step 2: Write `src/components/Footer.astro`**

Match the prototype's dark footer exactly: 3-col grid, tagline, copyright.

```astro
---
import type { Locale } from '../i18n/translations'
import { t } from '../i18n/translations'

interface Props {
  locale: Locale
}
const { locale } = Astro.props
const tr = t(locale)
const base = locale === 'nl' ? '' : '/en'
---
<footer class="bg-dark pt-14 pb-8">
  <div class="max-w-content mx-auto px-10">
    <div class="grid grid-cols-3 gap-12 mb-12">

      <!-- Brand col -->
      <div>
        <img src="/assets/logo/PS-logo-main-green.png" alt="Protopia Studio" class="h-6 mb-3 brightness-0 invert opacity-80" />
        <p class="text-[13px] text-[#666] leading-relaxed max-w-[260px]">
          Regenerative Design Studio.<br />
          Wij ontwerpen en ontwikkelen steden, projecten en producten voor een veerkrachtige wereld.
        </p>
      </div>

      <!-- Nav col -->
      <div>
        <h4 class="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#555] mb-3.5">{tr.footer.colNav}</h4>
        <ul class="flex flex-col gap-2">
          {[
            { href: base + '/waarom',    label: tr.nav.waarom },
            { href: base + '/hoe',       label: tr.nav.hoe },
            { href: base + '/projecten', label: tr.nav.projecten },
            { href: base + '/wie',       label: tr.nav.wie },
            { href: base + '/blog',      label: tr.nav.blog },
            { href: base + '/contact',   label: tr.nav.contact },
          ].map(l => (
            <li><a href={l.href} class="text-[13px] text-[#777] hover:text-white transition-colors">{l.label}</a></li>
          ))}
        </ul>
      </div>

      <!-- Work col -->
      <div>
        <h4 class="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#555] mb-3.5">{tr.footer.colWork}</h4>
        <ul class="flex flex-col gap-2">
          <li><a href={base + '/contact'} class="text-[13px] text-[#777] hover:text-white transition-colors">{tr.nav.contact}</a></li>
        </ul>
      </div>
    </div>

    <div class="border-t border-[#2a2a2a] pt-5 flex justify-between items-center">
      <span class="text-[12px] text-[#555]">{tr.footer.copy}</span>
      <span class="text-[12px] text-green font-semibold">{tr.footer.tagline}</span>
    </div>
  </div>
</footer>
```

- [ ] **Step 3: Verify by building**

```bash
npm run build
```
Expected: build succeeds, no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Nav.astro src/components/Footer.astro
git commit -m "feat: add Nav and Footer components"
```

---

## Task 7: ProjectCard and BlogCard components

**Files:**
- Create: `src/components/ProjectCard.astro`
- Create: `src/components/BlogCard.astro`

- [ ] **Step 1: Write `src/components/ProjectCard.astro`**

Matches `.project-card` in the prototype exactly.

```astro
---
import type { Locale } from '../i18n/translations'
import { t } from '../i18n/translations'

interface Props {
  title: string
  description: string
  category: 'environments' | 'businesses' | 'products'
  image: string
  imageAlt: string
  href: string
  locale: Locale
}
const { title, description, category, image, imageAlt, href, locale } = Astro.props
const tr = t(locale)
const catLabel = tr.projects.categoryLabel[category]
---
<a
  href={href}
  class="block bg-white border border-border rounded-lg overflow-hidden cursor-pointer transition-shadow duration-200 hover:shadow-[0_4px_20px_rgba(72,115,91,0.12)]"
  data-cat={category}
>
  <div class="w-full h-60 bg-creme overflow-hidden flex items-center justify-center">
    {image
      ? <img src={image} alt={imageAlt} class="w-full h-full object-cover" />
      : <span class="text-[10px] text-border uppercase tracking-[0.1em]">Afbeelding</span>
    }
  </div>
  <div class="p-5">
    <div class="text-[10px] font-semibold uppercase tracking-[0.12em] text-light mb-1.5">{catLabel}</div>
    <div class="text-[15px] font-bold text-green leading-snug mb-2">{title}</div>
    <div class="text-[13px] text-mid leading-relaxed mb-3">{description}</div>
    <span class="inline-flex items-center gap-1.5 text-[13px] font-semibold text-green before:content-['>'] hover:text-magenta transition-colors">
      {tr.projects.readMore}
    </span>
  </div>
</a>
```

- [ ] **Step 2: Write `src/components/BlogCard.astro`**

Matches `.blog-card` in the prototype — horizontal layout with image left, text right.

```astro
---
import type { Locale } from '../i18n/translations'
import { t } from '../i18n/translations'

interface Props {
  title: string
  category: string
  author: string
  date: Date
  readingTime: number
  image?: string
  href: string
  locale: Locale
}
const { title, category, author, date, readingTime, image, href, locale } = Astro.props
const tr = t(locale)
const dateStr = date.toLocaleDateString(locale === 'nl' ? 'nl-NL' : 'en-GB', {
  day: 'numeric', month: 'long', year: 'numeric'
})
---
<a
  href={href}
  class="grid grid-cols-[160px_1fr] gap-5 items-start p-5 bg-white border border-border rounded-lg cursor-pointer transition-shadow duration-200 hover:shadow-[0_4px_16px_rgba(72,115,91,0.10)]"
>
  <div class="w-full aspect-[4/3] bg-creme rounded overflow-hidden">
    {image && <img src={image} alt={title} class="w-full h-full object-cover" />}
  </div>
  <div>
    <div class="text-[10px] font-semibold uppercase tracking-[0.12em] text-magenta mb-1.5">{category}</div>
    <div class="text-[15px] font-bold text-green leading-snug mb-2">{title}</div>
    <div class="text-[12px] text-light">{author} · {readingTime} min</div>
  </div>
</a>
```

- [ ] **Step 3: Verify**

```bash
npm run build
```
Expected: PASS — no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/ProjectCard.astro src/components/BlogCard.astro
git commit -m "feat: add ProjectCard and BlogCard components"
```

---

## Task 8: Decap CMS config

**Files:**
- Create: `public/admin/index.html`
- Create: `public/admin/config.yml`

- [ ] **Step 1: Write `public/admin/index.html`**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Protopia CMS</title>
  <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
</head>
<body>
  <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
</body>
</html>
```

- [ ] **Step 2: Write `public/admin/config.yml`**

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
      - { label: "Body (full detail page)", name: body,      widget: markdown, i18n: true }
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
      - { label: "Reading time (min)", name: readingTime, widget: number, i18n: duplicate }
```

- [ ] **Step 3: Add Netlify Identity snippet to Base.astro**

Add before `</head>` in `src/layouts/Base.astro`:

```astro
<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
```

And before `</body>`:

```astro
<script>
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on('init', user => {
      if (!user) {
        window.netlifyIdentity.on('login', () => {
          document.location.href = '/admin/'
        })
      }
    })
  }
</script>
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```
Expected: `dist/admin/index.html` and `dist/admin/config.yml` present in output.

- [ ] **Step 5: Commit**

```bash
git add public/admin/ src/layouts/Base.astro
git commit -m "feat: add Decap CMS config with bilingual projects and blog collections"
```

---

## Task 9: Seed project content from CSV

**Files:**
- Create: `scripts/seed-projects.mjs`
- Creates: `src/content/projects/nl/*.md` (19 files)
- Creates: `src/content/projects/en/*.md` (19 EN stubs)
- Creates: `src/content/blog/nl/volgermeerpolder.md`
- Creates: `src/content/blog/en/volgermeerpolder.md`

- [ ] **Step 1: Write `scripts/seed-projects.mjs`**

```js
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { parse } from 'csv-parse/sync'

const categoryMap = {
  'Regeneratieve omgevingen': 'environments',
  'Regeneratieve bedrijven':  'businesses',
  'Regeneratieve producten':  'products',
}

const servicesMap = {
  'Research & Strategy':       'research',
  'Concept & Design':          'design',
  'Co-creation & Realisation': 'realisation',
  'Concept & Ontwerp':         'design',
  'Onderzoek & Strategie':     'research',
  'Co-creatie & Realisatie':   'realisation',
}

function extractRichText(raw) {
  if (!raw) return ''
  try {
    const parsed = JSON.parse(raw)
    const texts = []
    function walk(node) {
      if (node?.textData?.text) texts.push(node.textData.text)
      ;(node?.nodes || []).forEach(walk)
    }
    ;(parsed.nodes || []).forEach(walk)
    return texts.join(' ').trim()
  } catch {
    return raw.trim()
  }
}

function parseJsonArray(str) {
  if (!str) return []
  try { return JSON.parse(str) } catch { return [] }
}

function toSlug(title) {
  return title.trim()
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function extractImagePath(wixUrl) {
  if (!wixUrl) return ''
  const match = wixUrl.match(/\/([^/]+\.(?:jpg|jpeg|png|webp))[#?]/i)
  return match ? `/uploads/${decodeURIComponent(match[1])}` : ''
}

function esc(str) {
  return (str || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ').trim()
}

function buildFrontmatter(fields, body) {
  const lines = ['---']
  for (const [k, v] of Object.entries(fields)) {
    if (Array.isArray(v)) {
      lines.push(`${k}:`)
      v.forEach(item => lines.push(`  - ${item}`))
    } else if (typeof v === 'boolean' || typeof v === 'number') {
      lines.push(`${k}: ${v}`)
    } else {
      lines.push(`${k}: "${esc(String(v))}"`)
    }
  }
  lines.push('---', '', body || '')
  return lines.join('\n')
}

mkdirSync('src/content/projects/nl', { recursive: true })
mkdirSync('src/content/projects/en', { recursive: true })

const csv = readFileSync('/Users/bartgramberg/Downloads/Protopia Projects.csv', 'utf-8')
const records = parse(csv, {
  columns: true,
  delimiter: ';',
  relaxQuotes: true,
  skipEmptyLines: true,
})

for (const row of records) {
  const title = row['Title'].trim()
  if (!title) continue

  const slug              = toSlug(title)
  const categories        = parseJsonArray(row['Regeneratie categorie'])
  const category          = categoryMap[categories[0]] || 'products'
  const servicesRaw       = parseJsonArray(row['Diensten'])
  const services          = servicesRaw.map(s => servicesMap[s]).filter(Boolean)
  const featured          = row['Toon op homepage'] === 'TRUE'
  const order             = parseInt(row['Order nr']) || 99
  const year              = row['Jaar'] || ''
  const description       = (row['Korte omschrijving'] || '').replace(/\n/g, ' ').trim()
  const challenge         = (row['Uitdaging/context'] || '').replace(/\n/g, ' ').trim()
  const role              = (row['Onze rol'] || '').replace(/\n/g, ' ').trim()
  const result            = extractRichText(row['Resultaat'])
  const image             = extractImagePath(row['Image'])
  const imageAlt          = row['Image alt text'] || title
  const typeProject       = row['Type project'] || ''

  const sharedFields = { year, image, featured, order }
  const nlFields = {
    title, description, challenge, role, result, imageAlt, typeProject,
    category, services,
    ...sharedFields,
  }

  writeFileSync(
    `src/content/projects/nl/${slug}.md`,
    buildFrontmatter(nlFields, description)
  )
  console.log(`✓ nl/${slug}.md`)

  const enFields = {
    title, description, challenge, role, result, imageAlt, typeProject,
    category, services,
    ...sharedFields,
  }

  writeFileSync(
    `src/content/projects/en/${slug}.md`,
    buildFrontmatter(enFields, `<!-- TODO: translate from NL -->\n\n${description}`)
  )
  console.log(`✓ en/${slug}.md`)
}

console.log('\nDone. Remember to re-upload images from Wix to public/uploads/')
```

- [ ] **Step 2: Run the seed script**

```bash
node scripts/seed-projects.mjs
```
Expected: 38 lines of `✓ nl/...` and `✓ en/...` output, then the image reminder.

- [ ] **Step 3: Verify 19 files in each locale**

```bash
ls src/content/projects/nl/ | wc -l
ls src/content/projects/en/ | wc -l
```
Expected: both print `19`.

- [ ] **Step 4: Create two placeholder blog posts**

Create `src/content/blog/nl/volgermeerpolder.md`:
```markdown
---
title: "De Volgermeerpolder: niet opruimen, maar werken met tijd"
category: "Excursies"
author: "Joris de Leeuw"
date: 2025-03-10
readingTime: 2
---

De Volgermeerpolder is een voormalig stortterrein in Noord-Amsterdam dat zichzelf aan het herstellen is. Geen grote opruimactie, maar geduld. Natuur die haar gang gaat. Wij bezochten het gebied en spraken met de beheerders over wat het betekent om een plek te laten worden wat zij wil worden.
```

Create `src/content/blog/en/volgermeerpolder.md`:
```markdown
---
title: "The Volgermeerpolder: not cleaning up, but working with time"
category: "Excursions"
author: "Joris de Leeuw"
date: 2025-03-10
readingTime: 2
---

<!-- TODO: translate from NL -->

The Volgermeerpolder is a former waste site in North Amsterdam that is healing itself. No major clean-up operation, but patience. Nature taking its course.
```

- [ ] **Step 5: Verify build with seed data**

```bash
npm run build
```
Expected: PASS — Astro validates all 19 project frontmatter fields against the Zod schema and all blog posts. Zero errors.

- [ ] **Step 6: Commit**

```bash
git add scripts/ src/content/
git commit -m "feat: seed 19 projects and 1 blog post from CSV data"
```

---

## Task 10: Home page (NL)

**Files:**
- Modify: `src/pages/index.astro`

Reference: `s-home` screen in `protopiastudio-redesign.html` (lines 837–1090 in the prototype).

- [ ] **Step 1: Write `src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro'
import Nav from '../components/Nav.astro'
import Footer from '../components/Footer.astro'
import ProjectCard from '../components/ProjectCard.astro'
import BlogCard from '../components/BlogCard.astro'
import { getCollection } from 'astro:content'
import { t } from '../i18n/translations'

const locale = 'nl'
const tr = t(locale)

const allProjects = await getCollection('projects', ({ id }) => id.startsWith('nl/'))
const featured = allProjects
  .filter(p => p.data.featured)
  .sort((a, b) => a.data.order - b.data.order)
  .slice(0, 3)

const allPosts = await getCollection('blog', ({ id }) => id.startsWith('nl/'))
const recentPosts = allPosts
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
  .slice(0, 2)
---
<Base title="Protopia Studio" description={tr.home.heroSub} locale={locale} altHref="/en">
  <Nav locale={locale} altHref="/en" activePage="home" />

  <!-- Hero -->
  <section class="bg-creme pt-24 pb-20">
    <div class="max-w-content mx-auto px-10">
      <div class="grid grid-cols-2 gap-[72px] items-center">
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-green pb-2 border-b-2 border-green inline-block mb-5">
            {tr.home.heroTagline}
          </p>
          <h1 class="text-[clamp(40px,5vw,72px)] font-bold leading-[1.05] tracking-[-0.03em] text-green text-balance">
            {tr.home.heroTitle} <em class="not-italic text-magenta">{tr.home.heroAccent}</em>
          </h1>
          <p class="mt-6 text-[17px] text-mid leading-[1.75] max-w-[540px]">{tr.home.heroSub}</p>
          <div class="flex gap-3.5 mt-8 flex-wrap items-center">
            <a href="/projecten" class="inline-flex items-center gap-1.5 px-[26px] py-[11px] rounded-pill text-[14px] font-semibold bg-green text-white hover:bg-green-dark transition-colors border border-green">
              {tr.home.heroCta}
            </a>
            <a href="/contact" class="inline-flex items-center gap-1.5 px-[26px] py-[11px] rounded-pill text-[14px] font-semibold text-green border border-green hover:bg-green hover:text-white transition-colors">
              {tr.home.heroCtaAlt}
            </a>
          </div>
        </div>
        <div class="aspect-square flex items-center justify-center">
          <img src="/assets/logo/PS-logo-main-green.png" alt="Protopia Studio" class="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  </section>

  <!-- Services strip -->
  <section class="py-20">
    <div class="max-w-content mx-auto px-10">
      <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-green pb-2 border-b-2 border-green inline-block mb-5">
        Hoe we werken
      </p>
      <h2 class="text-[clamp(28px,3.5vw,42px)] font-bold leading-[1.15] tracking-[-0.02em] text-green text-balance mb-10">
        {tr.home.servicesTitle}
      </h2>
      <div class="grid grid-cols-3 gap-px bg-border border border-border rounded-lg overflow-hidden">
        {[
          { num: tr.home.service1Num, title: tr.home.service1Title, desc: tr.home.service1Desc },
          { num: tr.home.service2Num, title: tr.home.service2Title, desc: tr.home.service2Desc },
          { num: tr.home.service3Num, title: tr.home.service3Title, desc: tr.home.service3Desc },
        ].map(s => (
          <div class="bg-white p-9">
            <div class="text-[56px] font-extrabold text-magenta leading-none mb-3">{s.num}</div>
            <div class="text-[15px] font-bold text-green mb-2">{s.title}</div>
            <p class="text-[13px] text-mid leading-[1.65]">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>

  <!-- Featured projects -->
  <section class="py-20 bg-creme">
    <div class="max-w-content mx-auto px-10">
      <span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-green pb-2 border-b-2 border-green inline-block mb-5">
        {tr.projects.eyebrow}
      </span>
      <div class="grid grid-cols-3 gap-5 mt-10">
        {featured.map(p => (
          <ProjectCard
            title={p.data.title}
            description={p.data.description}
            category={p.data.category}
            image={p.data.image}
            imageAlt={p.data.imageAlt}
            href={`/projecten/${p.id.replace('nl/', '')}`}
            locale={locale}
          />
        ))}
      </div>
      <div class="mt-8">
        <a href="/projecten" class="inline-flex items-center gap-1.5 text-[14px] font-semibold text-green before:content-['>'] hover:text-magenta transition-colors">
          {tr.projects.viewAll}
        </a>
      </div>
    </div>
  </section>

  <!-- Quote -->
  <section class="py-[88px] text-center">
    <div class="max-w-content mx-auto px-10">
      <blockquote class="text-[clamp(20px,2.5vw,28px)] italic font-light text-mid leading-[1.6] max-w-[760px] mx-auto text-balance">
        {tr.home.quoteText}
      </blockquote>
      <p class="text-[13px] text-light font-medium mt-5 tracking-[0.02em]">{tr.home.quoteAttr}</p>
    </div>
  </section>

  <!-- Blog preview -->
  <section class="py-20 bg-creme">
    <div class="max-w-content mx-auto px-10">
      <span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-green pb-2 border-b-2 border-green inline-block mb-5">
        {tr.blog.eyebrow}
      </span>
      <h2 class="text-[clamp(28px,3.5vw,42px)] font-bold leading-[1.15] tracking-[-0.02em] text-green text-balance mt-2 mb-10">
        {tr.blog.latestTitle}
      </h2>
      <div class="grid grid-cols-2 gap-6">
        {recentPosts.map(p => (
          <BlogCard
            title={p.data.title}
            category={p.data.category}
            author={p.data.author}
            date={p.data.date}
            readingTime={p.data.readingTime}
            image={p.data.image}
            href={`/blog/${p.id.replace('nl/', '')}`}
            locale={locale}
          />
        ))}
      </div>
      <div class="mt-8">
        <a href="/blog" class="inline-flex items-center gap-1.5 text-[14px] font-semibold text-green before:content-['>'] hover:text-magenta transition-colors">
          {tr.blog.viewAll}
        </a>
      </div>
    </div>
  </section>

  <!-- CTA banner -->
  <section class="bg-green py-[72px] text-center">
    <div class="max-w-content mx-auto px-10">
      <h2 class="text-[clamp(26px,3vw,38px)] font-bold text-white leading-[1.2] mb-2.5 text-balance">{tr.home.ctaTitle}</h2>
      <p class="text-[16px] text-white/70 mb-7">{tr.home.ctaSub}</p>
      <div class="flex gap-3.5 justify-center flex-wrap">
        <a href="/contact" class="inline-flex items-center gap-1.5 px-[26px] py-[11px] rounded-pill text-[14px] font-semibold bg-white text-green hover:bg-creme transition-colors">
          {tr.home.ctaPrimary}
        </a>
        <a href="/blog" class="inline-flex items-center gap-1.5 px-[26px] py-[11px] rounded-pill text-[14px] font-semibold text-white border border-white/50 hover:bg-white/12 transition-colors">
          {tr.home.ctaSecondary}
        </a>
      </div>
    </div>
  </section>

  <Footer locale={locale} />
</Base>
```

- [ ] **Step 2: Verify in browser**

```bash
npm run dev
```
Visit `http://localhost:4321`. Verify:
- Hero renders with green heading + magenta accent
- 3 featured project cards shown (ENT, Amsterdam Regen Stad, Carbon Bank)
- 2 blog cards shown
- All fonts are Poppins
- Colours match prototype exactly

- [ ] **Step 3: Build check**

```bash
npm run build
```
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add NL home page with hero, services, projects and blog preview"
```

---

## Task 11: Projects overview and detail pages (NL)

**Files:**
- Create: `src/pages/projecten/index.astro`
- Create: `src/pages/projecten/[slug].astro`

- [ ] **Step 1: Write `src/pages/projecten/index.astro`**

The filter is client-side JS — clicking a filter button shows/hides cards via `data-cat`. Matches prototype `s-doen` screen.

```astro
---
import Base from '../../layouts/Base.astro'
import Nav from '../../components/Nav.astro'
import Footer from '../../components/Footer.astro'
import ProjectCard from '../../components/ProjectCard.astro'
import { getCollection } from 'astro:content'
import { t } from '../../i18n/translations'

const locale = 'nl'
const tr = t(locale)

const projects = await getCollection('projects', ({ id }) => id.startsWith('nl/'))
projects.sort((a, b) => a.data.order - b.data.order)
---
<Base title="Projecten" description={tr.projects.eyebrow} locale={locale} altHref="/en/projects">
  <Nav locale={locale} altHref="/en/projects" activePage="projecten" />

  <div class="bg-creme pt-[88px] pb-16">
    <div class="max-w-content mx-auto px-10">
      <span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-green pb-2 border-b-2 border-green inline-block mb-5">Wat we doen</span>
      <h1 class="text-[clamp(36px,4.5vw,58px)] font-bold leading-[1.1] tracking-[-0.025em] text-green text-balance mb-5">
        {tr.projects.eyebrow}
      </h1>
      <p class="text-[18px] text-mid leading-[1.75] max-w-[680px]">Ondernemers, bedrijven en overheden met een missie.</p>
    </div>
  </div>

  <section class="py-20">
    <div class="max-w-content mx-auto px-10">
      <!-- Filters -->
      <div id="filters" class="flex gap-2 flex-wrap mb-10">
        {[
          { key: 'all',          label: tr.projects.filterAll },
          { key: 'environments', label: tr.projects.filterEnvironments },
          { key: 'businesses',   label: tr.projects.filterBusinesses },
          { key: 'products',     label: tr.projects.filterProducts },
        ].map(f => (
          <button
            data-filter={f.key}
            class="filter-btn cursor-pointer border border-border bg-white text-mid font-medium text-[13px] px-[22px] py-[9px] rounded-pill transition-all hover:bg-creme hover:text-green data-[active]:bg-green data-[active]:text-white data-[active]:border-green"
          >
            {f.label}
          </button>
        ))}
      </div>

      <!-- Grid -->
      <div id="projects-grid" class="grid grid-cols-3 gap-5">
        {projects.map(p => (
          <div data-cat={p.data.category} class="project-item">
            <ProjectCard
              title={p.data.title}
              description={p.data.description}
              category={p.data.category}
              image={p.data.image}
              imageAlt={p.data.imageAlt}
              href={`/projecten/${p.id.replace('nl/', '')}`}
              locale={locale}
            />
          </div>
        ))}
      </div>
    </div>
  </section>

  <Footer locale={locale} />
</Base>

<script>
  const buttons = document.querySelectorAll<HTMLButtonElement>('.filter-btn')
  const items   = document.querySelectorAll<HTMLElement>('.project-item')

  function setFilter(filter: string) {
    buttons.forEach(btn => {
      btn.dataset.active = btn.dataset.filter === filter ? 'true' : undefined as any
    })
    items.forEach(item => {
      const cat = item.dataset.cat
      item.style.display = filter === 'all' || cat === filter ? '' : 'none'
    })
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter ?? 'all'))
  })

  setFilter('all')
</script>
```

- [ ] **Step 2: Write `src/pages/projecten/[slug].astro`**

```astro
---
import Base from '../../layouts/Base.astro'
import Nav from '../../components/Nav.astro'
import Footer from '../../components/Footer.astro'
import { getCollection } from 'astro:content'
import { t } from '../../i18n/translations'

export async function getStaticPaths() {
  const projects = await getCollection('projects', ({ id }) => id.startsWith('nl/'))
  return projects.map(p => ({
    params: { slug: p.id.replace('nl/', '') },
    props:  { project: p },
  }))
}

const { project } = Astro.props
const { Content }  = await project.render()
const locale = 'nl'
const tr = t(locale)
const slug = project.id.replace('nl/', '')
const catLabel = tr.projects.categoryLabel[project.data.category]
---
<Base title={project.data.title} description={project.data.description} locale={locale} altHref={`/en/projects/${slug}`}>
  <Nav locale={locale} altHref={`/en/projects/${slug}`} activePage="projecten" />

  <!-- Hero -->
  <div class="bg-creme pt-[88px] pb-16">
    <div class="max-w-content mx-auto px-10">
      <span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-green pb-2 border-b-2 border-green inline-block mb-5">
        {catLabel}
      </span>
      <h1 class="text-[clamp(36px,4.5vw,58px)] font-bold leading-[1.1] tracking-[-0.025em] text-green text-balance mb-5">
        {project.data.title}
      </h1>
      <p class="text-[18px] text-mid leading-[1.75] max-w-[680px]">{project.data.description}</p>
      <div class="flex gap-2 flex-wrap mt-5">
        {project.data.services.map(s => (
          <span class="text-[11px] font-semibold uppercase tracking-[0.12em] px-3 py-1 rounded-pill border border-green text-green">
            {tr.projects.servicesLabel[s]}
          </span>
        ))}
        <span class="text-[11px] font-semibold uppercase tracking-[0.12em] px-3 py-1 rounded-pill bg-creme text-light">
          {project.data.year}
        </span>
      </div>
    </div>
  </div>

  <!-- Hero image -->
  {project.data.image && (
    <div class="max-w-content mx-auto px-10 my-10">
      <img
        src={project.data.image}
        alt={project.data.imageAlt}
        class="w-full aspect-[16/7] object-cover rounded-lg"
      />
    </div>
  )}

  <!-- 3-col detail -->
  <section class="py-16">
    <div class="max-w-content mx-auto px-10">
      <div class="grid grid-cols-3 gap-10">
        <div>
          <h3 class="text-[11px] font-semibold uppercase tracking-[0.14em] text-green pb-2 border-b-2 border-green inline-block mb-4">
            {tr.projects.challenge}
          </h3>
          <p class="text-[14px] text-mid leading-[1.75]">{project.data.challenge}</p>
        </div>
        <div>
          <h3 class="text-[11px] font-semibold uppercase tracking-[0.14em] text-green pb-2 border-b-2 border-green inline-block mb-4">
            {tr.projects.role}
          </h3>
          <p class="text-[14px] text-mid leading-[1.75]">{project.data.role}</p>
        </div>
        <div>
          <h3 class="text-[11px] font-semibold uppercase tracking-[0.14em] text-green pb-2 border-b-2 border-green inline-block mb-4">
            {tr.projects.result}
          </h3>
          <p class="text-[14px] text-mid leading-[1.75]">{project.data.result}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Body content -->
  <section class="py-12 bg-creme">
    <div class="max-w-content mx-auto px-10">
      <div class="prose prose-lg max-w-none text-mid">
        <Content />
      </div>
    </div>
  </section>

  {project.data.link && (
    <div class="max-w-content mx-auto px-10 py-8">
      <a href={project.data.link} target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 text-[14px] font-semibold text-blue before:content-['>'] hover:text-green transition-colors">
        Bekijk project
      </a>
    </div>
  )}

  <!-- Back link -->
  <div class="max-w-content mx-auto px-10 pb-16">
    <a href="/projecten" class="inline-flex items-center gap-1.5 text-[13px] font-semibold text-mid before:content-['<'] hover:text-green transition-colors">
      Alle projecten
    </a>
  </div>

  <Footer locale={locale} />
</Base>
```

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
```
Visit `http://localhost:4321/projecten`. Verify:
- All 19 projects render in a 3-col grid
- Filter buttons show/hide cards by category (no page reload)
- Click a project → detail page loads with title, 3-col challenge/role/result

- [ ] **Step 4: Build check**

```bash
npm run build
```
Expected: 19 project detail pages generated under `dist/projecten/`.

- [ ] **Step 5: Commit**

```bash
git add src/pages/projecten/
git commit -m "feat: add NL projects overview and detail pages"
```

---

## Task 12: Blog overview and post pages (NL)

**Files:**
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/[slug].astro`

- [ ] **Step 1: Write `src/pages/blog/index.astro`**

```astro
---
import Base from '../../layouts/Base.astro'
import Nav from '../../components/Nav.astro'
import Footer from '../../components/Footer.astro'
import BlogCard from '../../components/BlogCard.astro'
import { getCollection } from 'astro:content'
import { t } from '../../i18n/translations'

const locale = 'nl'
const tr = t(locale)

const posts = await getCollection('blog', ({ id }) => id.startsWith('nl/'))
posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
---
<Base title="Blog" description={tr.blog.lead} locale={locale} altHref="/en/blog">
  <Nav locale={locale} altHref="/en/blog" activePage="blog" />

  <div class="bg-creme pt-[88px] pb-16">
    <div class="max-w-content mx-auto px-10">
      <span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-green pb-2 border-b-2 border-green inline-block mb-5">
        {tr.blog.eyebrow}
      </span>
      <h1 class="text-[clamp(36px,4.5vw,58px)] font-bold leading-[1.1] tracking-[-0.025em] text-green text-balance mb-5">
        {tr.blog.title}
      </h1>
      <p class="text-[18px] text-mid leading-[1.75] max-w-[680px]">{tr.blog.lead}</p>
    </div>
  </div>

  <section class="py-20">
    <div class="max-w-content mx-auto px-10">
      <div class="grid grid-cols-2 gap-6">
        {posts.map(p => (
          <BlogCard
            title={p.data.title}
            category={p.data.category}
            author={p.data.author}
            date={p.data.date}
            readingTime={p.data.readingTime}
            image={p.data.image}
            href={`/blog/${p.id.replace('nl/', '')}`}
            locale={locale}
          />
        ))}
      </div>
    </div>
  </section>

  <Footer locale={locale} />
</Base>
```

- [ ] **Step 2: Write `src/pages/blog/[slug].astro`**

```astro
---
import Base from '../../layouts/Base.astro'
import Nav from '../../components/Nav.astro'
import Footer from '../../components/Footer.astro'
import { getCollection } from 'astro:content'
import { t } from '../../i18n/translations'

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ id }) => id.startsWith('nl/'))
  return posts.map(p => ({
    params: { slug: p.id.replace('nl/', '') },
    props:  { post: p },
  }))
}

const { post } = Astro.props
const { Content } = await post.render()
const locale = 'nl'
const tr = t(locale)
const slug = post.id.replace('nl/', '')
const dateStr = post.data.date.toLocaleDateString('nl-NL', {
  day: 'numeric', month: 'long', year: 'numeric'
})
---
<Base title={post.data.title} description={post.data.title} locale={locale} altHref={`/en/blog/${slug}`}>
  <Nav locale={locale} altHref={`/en/blog/${slug}`} activePage="blog" />

  <div class="bg-creme pt-[88px] pb-16">
    <div class="max-w-content mx-auto px-10">
      <span class="text-[10px] font-semibold uppercase tracking-[0.12em] text-magenta mb-4 inline-block">{post.data.category}</span>
      <h1 class="text-[clamp(32px,4vw,52px)] font-bold leading-[1.12] tracking-[-0.025em] text-green text-balance mb-5">
        {post.data.title}
      </h1>
      <p class="text-[13px] text-light">{post.data.author} · {dateStr} · {post.data.readingTime} min</p>
    </div>
  </div>

  {post.data.image && (
    <div class="max-w-content mx-auto px-10 my-10">
      <img src={post.data.image} alt={post.data.title} class="w-full aspect-[16/7] object-cover rounded-lg" />
    </div>
  )}

  <article class="py-12">
    <div class="max-w-[720px] mx-auto px-10">
      <div class="prose prose-lg text-mid">
        <Content />
      </div>
    </div>
  </article>

  <div class="max-w-content mx-auto px-10 pb-16">
    <a href="/blog" class="inline-flex items-center gap-1.5 text-[13px] font-semibold text-mid before:content-['<'] hover:text-green transition-colors">
      {tr.blog.eyebrow}
    </a>
  </div>

  <Footer locale={locale} />
</Base>
```

- [ ] **Step 3: Verify and build**

```bash
npm run dev
```
Visit `http://localhost:4321/blog` — blog card renders. Click it — post page loads.

```bash
npm run build
```
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/pages/blog/
git commit -m "feat: add NL blog overview and post pages"
```

---

## Task 13: Static pages (NL) — waarom, hoe, wie, contact

**Files:**
- Create: `src/pages/waarom.astro`
- Create: `src/pages/hoe.astro`
- Create: `src/pages/wie.astro`
- Create: `src/pages/contact.astro`

Reference sections `s-waarom`, `s-hoe`, `s-wie` and `s-contact` in `protopiastudio-redesign.html`.

- [ ] **Step 1: Write `src/pages/waarom.astro`**

```astro
---
import Base from '../layouts/Base.astro'
import Nav from '../components/Nav.astro'
import Footer from '../components/Footer.astro'
import { t } from '../i18n/translations'
const locale = 'nl'
const tr = t(locale)
---
<Base title="Waarom regeneratie" description={tr.waarom.lead} locale={locale} altHref="/en/why">
  <Nav locale={locale} altHref="/en/why" activePage="waarom" />

  <div class="bg-creme pt-[88px] pb-16">
    <div class="max-w-content mx-auto px-10">
      <span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-green pb-2 border-b-2 border-green inline-block mb-5">{tr.waarom.eyebrow}</span>
      <h1 class="text-[clamp(36px,4.5vw,58px)] font-bold leading-[1.1] tracking-[-0.025em] text-green text-balance mb-5">{tr.waarom.title}</h1>
      <p class="text-[18px] text-mid leading-[1.75] max-w-[680px]">{tr.waarom.lead}</p>
    </div>
  </div>

  <!-- Spectrum: degeneratief → duurzaam → regeneratief -->
  <section class="py-20">
    <div class="max-w-content mx-auto px-10">
      <div class="grid grid-cols-3 gap-px bg-border border border-border rounded-lg overflow-hidden">
        {[
          {
            step: 'Stap 1',
            title: 'Degeneratief',
            desc: 'Systemen die meer onttrekken dan ze bijdragen. Uitputting van grondstoffen, erosie van gemeenschappen, verlies van biodiversiteit.',
            img: '',
          },
          {
            step: 'Stap 2',
            title: 'Duurzaam',
            desc: 'Minder schade doen. Duurzaamheid is belangrijk, maar niet voldoende. We kunnen niet onze weg naar herstel "sustainen".',
            img: '',
          },
          {
            step: 'Stap 3',
            title: 'Regeneratief',
            desc: 'Systemen die meer teruggeven dan ze nemen. Actief herstel van ecologische, sociale en economische systemen.',
            img: '',
            active: true,
          },
        ].map(s => (
          <div class={`p-8 ${s.active ? 'bg-creme' : 'bg-white'}`}>
            <div class="text-[11px] font-semibold uppercase tracking-[0.12em] text-light mb-2.5">{s.step}</div>
            <div class="text-[20px] font-bold text-green mb-2.5">{s.title}</div>
            <p class="text-[14px] text-mid leading-[1.7]">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>

  <!-- 8 Principles -->
  <section class="py-20 bg-creme">
    <div class="max-w-content mx-auto px-10">
      <span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-green pb-2 border-b-2 border-green inline-block mb-5">8 principes</span>
      <h2 class="text-[clamp(28px,3.5vw,42px)] font-bold leading-[1.15] tracking-[-0.02em] text-green text-balance mb-10">De principes van regeneratief ontwerp.</h2>
      <div class="grid grid-cols-4 gap-4">
        {[
          { num: '01', title: 'Holistisch denken',          desc: 'Systemen begrijpen in hun geheel, niet als optelsom van onderdelen.' },
          { num: '02', title: 'Grondstoffenkringlopen',      desc: 'Materialen en energie blijven in gebruik — geen afval, alleen voedingsstoffen.' },
          { num: '03', title: 'Cyclische processen',         desc: 'Ontwerpen die vernieuwen en herstellen, in ritme met de natuur.' },
          { num: '04', title: 'Veerkracht',                  desc: 'Systemen die tegenslagen absorberen en sterker terugkomen.' },
          { num: '05', title: 'Inclusief',                   desc: 'Alle mensen en levende wezens tellen mee in het ontwerp.' },
          { num: '06', title: 'Intergenerationeel',          desc: 'Beslissingen die ook voor toekomstige generaties werken.' },
          { num: '07', title: 'Sociale regeneratie',         desc: 'Gemeenschappen en relaties herstellen en versterken.' },
          { num: '08', title: 'Commons & coöperatie',        desc: 'Gedeelde bronnen beheren op basis van vertrouwen en samenwerking.' },
        ].map(p => (
          <div class="bg-white border border-[rgba(72,115,91,0.12)] rounded-lg overflow-hidden flex flex-col">
            <div class="p-5">
              <div class="text-[28px] font-extrabold text-magenta leading-none mb-2">{p.num}</div>
              <div class="text-[14px] font-bold text-green mb-1.5">{p.title}</div>
              <p class="text-[12px] text-mid leading-[1.6]">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>

  <Footer locale={locale} />
</Base>
```

- [ ] **Step 2: Write `src/pages/hoe.astro`**

```astro
---
import Base from '../layouts/Base.astro'
import Nav from '../components/Nav.astro'
import Footer from '../components/Footer.astro'
import { t } from '../i18n/translations'
const locale = 'nl'
const tr = t(locale)
---
<Base title="Hoe we werken" description={tr.hoe.lead} locale={locale} altHref="/en/how">
  <Nav locale={locale} altHref="/en/how" activePage="hoe" />

  <div class="bg-creme pt-[88px] pb-16">
    <div class="max-w-content mx-auto px-10">
      <span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-green pb-2 border-b-2 border-green inline-block mb-5">{tr.hoe.eyebrow}</span>
      <h1 class="text-[clamp(36px,4.5vw,58px)] font-bold leading-[1.1] tracking-[-0.025em] text-green text-balance mb-5">{tr.hoe.title}</h1>
      <p class="text-[18px] text-mid leading-[1.75] max-w-[680px]">{tr.hoe.lead}</p>
    </div>
  </div>

  <section class="py-20">
    <div class="max-w-content mx-auto px-10">
      <div class="grid grid-cols-3 gap-px bg-border border border-border rounded-lg overflow-hidden">
        {[
          {
            num: '1',
            title: 'Onderzoek & Strategie',
            desc: 'Complexe vraagstukken herleid tot concrete strategieën. We analyseren context, stakeholders en systemen — en vertalen dat naar een heldere richting.',
            examples: ['Onderzoek naar best practices', 'Stakeholderanalyse', 'Strategische roadmap'],
          },
          {
            num: '2',
            title: 'Concept & Ontwerp',
            desc: 'Innovatieve concepten, businessmodellen en plekken — direct gebouwd en getest. Wij ontwerpen niet in een la, maar in de praktijk.',
            examples: ['Service design', 'Ruimtelijk ontwerp', 'Business model canvas'],
          },
          {
            num: '3',
            title: 'Co-creatie & Realisatie',
            desc: 'Teams, labs en partnerschappen bouwen die tastbare resultaten leveren. Van post-it, via pilot naar product.',
            examples: ['Design sprints', 'Pilot programmas', 'Community building'],
          },
        ].map(s => (
          <div class="bg-white p-9">
            <div class="text-[56px] font-extrabold text-magenta leading-none mb-3">{s.num}</div>
            <div class="text-[15px] font-bold text-green mb-2">{s.title}</div>
            <p class="text-[13px] text-mid leading-[1.65] mb-4">{s.desc}</p>
            <ul class="flex flex-col gap-1">
              {s.examples.map(e => (
                <li class="text-[12px] text-light before:content-['>'] before:mr-1.5">{e}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>

  <!-- CTA -->
  <div class="max-w-content mx-auto px-10 pb-20">
    <a href="/contact" class="inline-flex items-center gap-1.5 text-[14px] font-semibold text-green before:content-['>'] hover:text-magenta transition-colors">
      Samenwerken?
    </a>
  </div>

  <Footer locale={locale} />
</Base>
```

- [ ] **Step 3: Write `src/pages/wie.astro`**

```astro
---
import Base from '../layouts/Base.astro'
import Nav from '../components/Nav.astro'
import Footer from '../components/Footer.astro'
import { t } from '../i18n/translations'
const locale = 'nl'
const tr = t(locale)

const team = [
  { name: 'Joris de Leeuw',    role: 'Regeneratieve visionair, architect, system thinker en verbinder.', quote: '"Joris is het hart van ons gedachtegoed."', img: '' },
  { name: 'Maarten Langbroek', role: 'Ondernemer, business developer, lean startup expert en natuurfanaat.', quote: '"Niemand maakt iets sneller écht dan Maarten."', img: '' },
  { name: 'Bart Gramberg',     role: 'Strateeg, ontwerper, ecosysteem-bouwer en AI-enthousiast.', quote: '"Bart neemt je mee — into uncharted territory."', img: '' },
]
const advisors = [
  { name: 'Kim van der Leeuw', role: 'Serial impact entrepreneur, business designer, programmamanager & brok energie.', quote: '"Onze duurzaamheids-dinosaurus."', img: '' },
  { name: 'Zoë Red',           role: 'Communicatiestrateeg, klimaat-guru, impact investor & netwerkbouwer.', quote: '"Van meta-denken tot morgen doen."', img: '' },
]
---
<Base title="Wie we zijn" description="Wij zijn Protopians." locale={locale} altHref="/en/who">
  <Nav locale={locale} altHref="/en/who" activePage="wie" />

  <div class="bg-creme pt-[88px] pb-16">
    <div class="max-w-content mx-auto px-10">
      <span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-green pb-2 border-b-2 border-green inline-block mb-5">{tr.wie.eyebrow}</span>
      <h1 class="text-[clamp(36px,4.5vw,58px)] font-bold leading-[1.1] tracking-[-0.025em] text-green text-balance mb-5">
        Wij zijn <em class="not-italic text-magenta">Protopians</em>.
      </h1>
    </div>
  </div>

  <!-- Mission -->
  <section class="py-20">
    <div class="max-w-content mx-auto px-10">
      <div class="grid grid-cols-[1fr_2fr] gap-16">
        <div>
          <span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-green pb-2 border-b-2 border-green inline-block mb-5">{tr.wie.missionTitle.split(',')[0]}</span>
          <h2 class="text-[clamp(28px,3.5vw,42px)] font-bold leading-[1.15] tracking-[-0.02em] text-green text-balance">{tr.wie.missionTitle}</h2>
        </div>
        <div class="flex flex-col gap-4 text-[15px] text-mid leading-[1.8]">
          <p>Wij geloven dat de grote uitdagingen van onze tijd vragen om een regeneratieve systeemverandering, met oplossingen die de kracht van het leven versterken en onze relatie tot natuur en elkaar herstellen in duurzame balans.</p>
          <p>Wij staan voor hoopvolle verandering: geen utopie met abstracte idealen, maar concrete, haalbare stappen in de transitie naar een betere wereld.</p>
          <p>Wij zijn Protopians.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Team -->
  <section class="py-20 bg-creme">
    <div class="max-w-content mx-auto px-10">
      <span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-green pb-2 border-b-2 border-green inline-block mb-5">{tr.wie.teamEyebrow}</span>
      <h2 class="text-[clamp(28px,3.5vw,42px)] font-bold leading-[1.15] tracking-[-0.02em] text-green text-balance mt-2 mb-10">{tr.wie.teamTitle}</h2>
      <div class="grid grid-cols-3 gap-6">
        {team.map(m => (
          <div class="bg-white border border-border rounded-lg overflow-hidden">
            <div class="w-full aspect-square bg-creme flex items-center justify-center">
              {m.img ? <img src={m.img} alt={m.name} class="w-full h-full object-cover" /> : <span class="text-[10px] text-border uppercase tracking-[0.1em]">Foto</span>}
            </div>
            <div class="p-5">
              <div class="text-[15px] font-bold text-green mb-1">{m.name}</div>
              <div class="text-[13px] text-mid leading-[1.6] mb-3">{m.role}</div>
              <div class="text-[12px] text-light italic">{m.quote}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>

  <!-- Advisors -->
  <section class="py-20">
    <div class="max-w-content mx-auto px-10">
      <span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-green pb-2 border-b-2 border-green inline-block mb-5">{tr.wie.advisorEyebrow}</span>
      <h2 class="text-[clamp(28px,3.5vw,42px)] font-bold leading-[1.15] tracking-[-0.02em] text-green text-balance mt-2 mb-10">{tr.wie.advisorTitle}</h2>
      <div class="grid grid-cols-2 gap-6 max-w-[740px]">
        {advisors.map(m => (
          <div class="bg-white border border-border rounded-lg overflow-hidden">
            <div class="w-full aspect-square bg-creme flex items-center justify-center">
              {m.img ? <img src={m.img} alt={m.name} class="w-full h-full object-cover" /> : <span class="text-[10px] text-border uppercase tracking-[0.1em]">Foto</span>}
            </div>
            <div class="p-5">
              <div class="text-[15px] font-bold text-green mb-1">{m.name}</div>
              <div class="text-[13px] text-mid leading-[1.6] mb-3">{m.role}</div>
              <div class="text-[12px] text-light italic">{m.quote}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>

  <Footer locale={locale} />
</Base>
```

- [ ] **Step 4: Write `src/pages/contact.astro`**

```astro
---
import Base from '../layouts/Base.astro'
import Nav from '../components/Nav.astro'
import Footer from '../components/Footer.astro'
import { t } from '../i18n/translations'
const locale = 'nl'
const tr = t(locale)
---
<Base title="Contact" description={tr.contact.lead} locale={locale} altHref="/en/contact">
  <Nav locale={locale} altHref="/en/contact" activePage="contact" />

  <div class="bg-creme pt-[88px] pb-16">
    <div class="max-w-content mx-auto px-10">
      <span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-green pb-2 border-b-2 border-green inline-block mb-5">{tr.contact.eyebrow}</span>
      <h1 class="text-[clamp(36px,4.5vw,58px)] font-bold leading-[1.1] tracking-[-0.025em] text-green text-balance mb-5">{tr.contact.title}</h1>
      <p class="text-[18px] text-mid leading-[1.75] max-w-[680px]">{tr.contact.lead}</p>
    </div>
  </div>

  <section class="py-20">
    <div class="max-w-content mx-auto px-10 max-w-[600px]">
      <p class="text-[15px] text-mid leading-[1.8] mb-6">
        Stuur ons een e-mail op <a href="mailto:hello@protopiastudio.nl" class="text-green font-semibold hover:text-magenta transition-colors">hello@protopiastudio.nl</a> of vul het formulier in.
      </p>
      <form class="flex flex-col gap-4" netlify name="contact">
        <input type="hidden" name="form-name" value="contact" />
        <div class="flex flex-col gap-1.5">
          <label class="text-[12px] font-semibold uppercase tracking-[0.1em] text-light">Naam</label>
          <input name="name" type="text" required class="border border-border rounded-lg px-4 py-3 text-[14px] text-dark focus:outline-none focus:border-green" />
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="text-[12px] font-semibold uppercase tracking-[0.1em] text-light">E-mail</label>
          <input name="email" type="email" required class="border border-border rounded-lg px-4 py-3 text-[14px] text-dark focus:outline-none focus:border-green" />
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="text-[12px] font-semibold uppercase tracking-[0.1em] text-light">Bericht</label>
          <textarea name="message" rows="5" required class="border border-border rounded-lg px-4 py-3 text-[14px] text-dark focus:outline-none focus:border-green resize-none"></textarea>
        </div>
        <button type="submit" class="self-start inline-flex items-center gap-1.5 px-[26px] py-[11px] rounded-pill text-[14px] font-semibold bg-green text-white hover:bg-green-dark transition-colors">
          Verstuur
        </button>
      </form>
    </div>
  </section>

  <Footer locale={locale} />
</Base>
```

- [ ] **Step 5: Build check**

```bash
npm run build
```
Expected: PASS — all 4 static pages build successfully.

- [ ] **Step 6: Commit**

```bash
git add src/pages/waarom.astro src/pages/hoe.astro src/pages/wie.astro src/pages/contact.astro
git commit -m "feat: add NL static pages (waarom, hoe, wie, contact)"
```

---

## Task 14: English pages

**Files:**
- Create: `src/pages/en/index.astro`
- Create: `src/pages/en/why.astro`
- Create: `src/pages/en/how.astro`
- Create: `src/pages/en/who.astro`
- Create: `src/pages/en/contact.astro`
- Create: `src/pages/en/projects/index.astro`
- Create: `src/pages/en/projects/[slug].astro`
- Create: `src/pages/en/blog/index.astro`
- Create: `src/pages/en/blog/[slug].astro`

Each EN page is a copy of its NL counterpart with three changes:
1. `const locale = 'en'` instead of `'nl'`
2. `altHref` points to the NL URL
3. `getCollection` filter uses `id.startsWith('en/')` instead of `'nl/'`
4. `href` construction strips `en/` prefix and uses EN URL paths

- [ ] **Step 1: Create EN page directory**

```bash
mkdir -p src/pages/en/projects src/pages/en/blog
```

- [ ] **Step 2: Write `src/pages/en/index.astro`**

Copy `src/pages/index.astro` and apply:
- `const locale = 'en'`
- `altHref="/"` on Base and Nav
- `getCollection` filter: `id.startsWith('en/')`
- project `href`: `` `/en/projects/${p.id.replace('en/', '')}` ``
- blog `href`: `` `/en/blog/${p.id.replace('en/', '')}` ``
- links to `/en/projects`, `/en/blog`, `/en/contact`

- [ ] **Step 3: Write `src/pages/en/why.astro`**

Copy `src/pages/waarom.astro` and apply:
- `const locale = 'en'`
- `altHref="/waarom"` on Base and Nav

Content is the same structure — `tr.waarom.*` already returns EN strings when `locale='en'`.

- [ ] **Step 4: Write `src/pages/en/how.astro`**

Copy `src/pages/hoe.astro` and apply:
- `const locale = 'en'`
- `altHref="/hoe"`
- translate hardcoded NL strings to use `tr.*` keys (add any missing keys to `translations.ts`)

- [ ] **Step 5: Write `src/pages/en/who.astro`**

Copy `src/pages/wie.astro` and apply:
- `const locale = 'en'`
- `altHref="/wie"`
- translate hardcoded NL team/mission copy to EN equivalents (add to `translations.ts` if missing)

- [ ] **Step 6: Write `src/pages/en/contact.astro`**

Copy `src/pages/contact.astro` and apply:
- `const locale = 'en'`
- `altHref="/contact"`
- translate form labels to EN

- [ ] **Step 7: Write `src/pages/en/projects/index.astro`**

Copy `src/pages/projecten/index.astro` and apply:
- `const locale = 'en'`
- `altHref="/projecten"`
- `getCollection` filter: `id.startsWith('en/')`
- card `href`: `` `/en/projects/${p.id.replace('en/', '')}` ``

- [ ] **Step 8: Write `src/pages/en/projects/[slug].astro`**

Copy `src/pages/projecten/[slug].astro` and apply:
- `const locale = 'en'`
- `getStaticPaths` uses `id.startsWith('en/')`
- `params.slug = p.id.replace('en/', '')`
- `altHref`: `` `/projecten/${slug}` ``
- back link points to `/en/projects`

- [ ] **Step 9: Write `src/pages/en/blog/index.astro`**

Copy `src/pages/blog/index.astro` and apply:
- `const locale = 'en'`
- `altHref="/blog"`
- `getCollection` filter: `id.startsWith('en/')`
- post `href`: `` `/en/blog/${p.id.replace('en/', '')}` ``

- [ ] **Step 10: Write `src/pages/en/blog/[slug].astro`**

Copy `src/pages/blog/[slug].astro` and apply:
- `const locale = 'en'`
- `getStaticPaths` uses `id.startsWith('en/')`
- `params.slug = p.id.replace('en/', '')`
- `altHref`: `` `/blog/${slug}` ``
- `toLocaleDateString('en-GB', ...)`
- back link points to `/en/blog`

- [ ] **Step 11: Verify EN routes**

```bash
npm run dev
```
Visit `http://localhost:4321/en` — EN home renders with English copy.
Visit `http://localhost:4321/en/projects` — EN projects grid renders.
Click NL/EN toggle from any page — lands on correct counterpart URL.

- [ ] **Step 12: Full build and type check**

```bash
npm run build
```
Expected: PASS — all NL and EN pages generated, zero TypeScript errors.

- [ ] **Step 13: Commit**

```bash
git add src/pages/en/
git commit -m "feat: add complete EN page set mirroring NL routes"
```

---

## Task 15: Connect GitHub remote and push

- [ ] **Step 1: Add remote and push**

```bash
git remote add origin https://github.com/bartgramberg/Protopia-Studio-website.git
git push -u origin main
```
Expected: all commits pushed, GitHub shows the repo with content.

- [ ] **Step 2: Verify Netlify deployment**

1. Go to [app.netlify.com](https://app.netlify.com) → Add new site → Import from Git → GitHub → select `bartgramberg/Protopia-Studio-website`
2. Build command: `npm run build` (auto-detected from `netlify.toml`)
3. Publish directory: `dist`
4. Click Deploy — wait for green deploy.

- [ ] **Step 3: Enable Netlify Identity and Git Gateway**

In Netlify site dashboard:
1. Site configuration → Identity → Enable Identity
2. Identity → Services → Enable Git Gateway
3. Identity → Invite users → invite editors by email

- [ ] **Step 4: Verify CMS**

Visit `https://your-site.netlify.app/admin` — Decap CMS login screen appears. Log in with your Netlify Identity account. Verify Projects and Blog collections appear with all fields.

- [ ] **Step 5: Commit any final fixes**

```bash
git add -A
git status   # should be clean
```

---

## Self-review checklist

- [x] **Spec section 1 (stack)** → Task 1 (scaffold, Astro+Tailwind)
- [x] **Spec section 2 (design source)** → all page tasks reference prototype sections
- [x] **Spec section 3 (project structure)** → file map at top of this plan
- [x] **Spec section 4 (content schema)** → Task 3 (Zod schemas)
- [x] **Spec section 5 (Decap CMS config)** → Task 8
- [x] **Spec section 6 (routing)** → Tasks 10–14
- [x] **Spec section 7 (i18n UI strings)** → Task 4
- [x] **Spec section 8 (seed content)** → Task 9
- [x] **Spec section 9 (Netlify setup)** → Task 1 (netlify.toml) + Task 15
- [x] **Spec section 10 (constraints)** → Poppins via @font-face (Task 2), no arbitrary colors (tailwind.config), language-neutral keys throughout
