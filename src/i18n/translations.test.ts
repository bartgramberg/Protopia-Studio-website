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
