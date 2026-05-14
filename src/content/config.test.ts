import { describe, it, expect } from 'vitest'
import { z } from 'zod'

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
      thumbnail:   z.string().optional(),
      images:      z.array(z.string()).default([]),
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
      thumbnail: '/uploads/test-thumb.jpg',
      images: ['/uploads/test.jpg', '/uploads/test-2.jpg'],
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
