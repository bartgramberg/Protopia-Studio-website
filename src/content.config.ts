import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'zod'

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
  thumbnail:   z.string().optional(),
  images:      z.array(z.string()).default([]),
  featured:    z.boolean().default(false),
  howWeWorkSection: z.preprocess(
    value => value === '' ? undefined : value,
    z.enum(['research', 'design', 'realisation']).optional(),
  ),
  order:       z.number(),
  link:        z.preprocess(
    value => {
      if (typeof value === 'string') return value.trim() === '' ? undefined : value
      if (value && typeof value === 'object' && 'url' in value) {
        const url = value.url
        return typeof url === 'string' && url.trim() !== '' ? url : undefined
      }
      return undefined
    },
    z.string().optional(),
  ),
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
  projects: defineCollection({ loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }), schema: projectSchema }),
  blog:     defineCollection({ loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),     schema: blogSchema }),
}

export type ProjectData = z.infer<typeof projectSchema>
export type BlogData    = z.infer<typeof blogSchema>
