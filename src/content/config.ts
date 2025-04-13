import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    img: z.string(),
    publishDate: z.date(),
  }),
});

export const collections = {
  blog,
};
