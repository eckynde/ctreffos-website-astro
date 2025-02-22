import { defineCollection, z } from "astro:content";

const newsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
    date: z.date(),
  }),
});

const eventsCollection = defineCollection({
  schema: z.object({
    date: z.date(),
    title: z.string(),
    speaker: z.string().optional(),
  }),
});

export const collections = {
  news: newsCollection,
  events: eventsCollection,
};
