import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context: { site: string }) {
  const news = (await getCollection("news")).filter((item) =>
    item.slug.startsWith("en/")
  );

  return rss({
    title: "Chaostreff Osnabrück e.V. - RSS Feed",
    description: "News and Updates from the Chaostreff Osnabrück e.V.",
    site: context.site,
    items: news.map((item) => ({
      title: item.data.title,
      author: item.data.author,
      pubDate: item.data.date,
      link: `${context.site}/${item.slug}`,
      content: item.body,
    })),
    customData: `<language>en</language>`,
  });
}
