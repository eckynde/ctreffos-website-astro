import rss, { type RSSFeedItem } from "@astrojs/rss";
import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
const parser = new MarkdownIt();

const lang = "de";

export async function GET(context: { site: URL }) {
  const news = (await getCollection("news"))
    .toSorted((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .filter((item) => item.slug.startsWith(`${lang}/`));

  return rss({
    title: "Chaostreff Osnabrück e.V. - RSS Feed",
    description: "Neuigkeiten und Updates vom Chaostreff Osnabrück e.V.",
    site: context.site,
    items: news.map(
      (item) =>
        ({
          title: item.data.title,
          author: item.data.author,
          pubDate: item.data.date,
          link: `${context.site.origin}${import.meta.env.BASE_URL}/${
            item.slug.split("/")[0] +
            "/" +
            item.collection +
            "/" +
            item.slug.split("/")[1]
          }`,
          content: sanitizeHtml(parser.render(item.body), {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
          }),
        } as RSSFeedItem)
    ),
    customData: `<language>de</language>`,
  });
}
