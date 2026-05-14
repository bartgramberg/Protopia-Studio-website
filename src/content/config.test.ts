import { describe, it, expect } from 'vitest'
import { z } from 'zod'

const optionalString = z.preprocess(
  value => typeof value === 'string' && value.trim() === '' || value === null ? undefined : value,
  z.string().optional(),
)

const optionalStringFromCms = z.preprocess(
  value => {
    if (typeof value === 'string') return value.trim() === '' ? undefined : value
    if (value && typeof value === 'object' && 'url' in value) {
      const url = value.url
      return typeof url === 'string' && url.trim() !== '' ? url : undefined
    }
    return undefined
  },
  z.string().optional(),
)

const imageList = z.preprocess(
  value => Array.isArray(value) ? value.filter(item => typeof item === 'string' && item.trim() !== '') : [],
  z.array(z.string()).default([]),
)

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
      image:       optionalString,
      thumbnail:   optionalString,
      images:      imageList,
      featured:    z.boolean().default(false),
      howWeWorkSection: z.preprocess(
        value => value === '' || value === null ? undefined : value,
        z.enum(['research', 'design', 'realisation']).optional(),
      ),
      order:       z.number(),
      link:        optionalStringFromCms,
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
      thumbnail: '/uploads/test-thumb.jpg',
      images: ['/uploads/test.jpg', '/uploads/test-2.jpg'],
      featured: true,
      howWeWorkSection: 'research',
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

  it('normalizes empty CMS how page section values', () => {
    const schema = z.object({
      howWeWorkSection: z.preprocess(
        value => value === '' || value === null ? undefined : value,
        z.enum(['research', 'design', 'realisation']).optional(),
      ),
    })
    expect(schema.parse({ howWeWorkSection: null }).howWeWorkSection).toBeUndefined()
    expect(schema.parse({ howWeWorkSection: '' }).howWeWorkSection).toBeUndefined()
  })

  it('normalizes CMS link objects', () => {
    const schema = z.object({
      link: optionalStringFromCms,
    })
    expect(schema.parse({ link: { url: 'https://example.com' } }).link).toBe('https://example.com')
    expect(schema.parse({ link: {} }).link).toBeUndefined()
    expect(schema.parse({ link: null }).link).toBeUndefined()
  })

  it('normalizes optional CMS image fields and lists', () => {
    const schema = z.object({
      image: optionalString,
      thumbnail: optionalString,
      images: imageList,
    })
    const result = schema.parse({
      image: null,
      thumbnail: '',
      images: ['/uploads/a.jpg', '', null, '/uploads/b.jpg'],
    })
    expect(result.image).toBeUndefined()
    expect(result.thumbnail).toBeUndefined()
    expect(result.images).toEqual(['/uploads/a.jpg', '/uploads/b.jpg'])
  })
})
