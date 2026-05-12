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
      if (v.length === 0) {
        lines.push(`${k}: []`)
      } else {
        lines.push(`${k}:`)
        v.forEach(item => lines.push(`  - ${item}`))
      }
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

// Log the column names from the first record so you can verify
if (records.length > 0) {
  console.log('CSV columns:', Object.keys(records[0]))
}

for (const row of records) {
  // Column names from actual CSV headers
  const title = (row['Title'] || '').trim()
  if (!title) continue

  const slug              = toSlug(title)
  const categories        = parseJsonArray(row['Regeneratie categorie'] || '')
  const category          = categoryMap[categories[0]] || 'products'
  const servicesRaw       = parseJsonArray(row['Diensten'] || '')
  const services          = servicesRaw.map(s => servicesMap[s]).filter(Boolean)
  const featured          = (row['Toon op homepage'] || '') === 'TRUE'
  const order             = parseInt(row['Order nr'] || '') || 99
  const year              = (row['Jaar'] || '').trim()
  const description       = (row['Korte omschrijving'] || '').replace(/\n/g, ' ').trim()
  const challenge         = (row['Uitdaging/context'] || '').replace(/\n/g, ' ').trim()
  const role              = (row['Onze rol'] || '').replace(/\n/g, ' ').trim()
  const result            = extractRichText(row['Resultaat'] || '')
  const image             = extractImagePath(row['Image'] || '')
  const imageAlt          = (row['Image alt text'] || title).trim()
  const typeProject       = (row['Type project'] || '').trim()

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
