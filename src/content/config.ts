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
