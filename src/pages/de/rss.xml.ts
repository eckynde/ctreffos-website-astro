import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
const parser = new MarkdownIt();

const lang = "de";

export async function GET(context: { site: string }) {
  const news = (await getCollection("news"))
    .toSorted((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .filter((item) => item.slug.startsWith(`${lang}/`));

  return rss({
    title: "Chaostreff Osnabrück e.V. - RSS Feed",
    description: "News und Updates vom Chaostreff Osnabrück e.V.",
    site: context.site,
    items: news.map((item) => ({
      title: item.data.title,
      author: item.data.author,
      pubDate: item.data.date,
      link: `${context.site}/${item.slug}`,
      content: sanitizeHtml(parser.render(item.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      }),
    })),
    customData: `<language>de</language>`,
  });
}
