import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import ical, { ICalCalendarMethod } from "ical-generator";
const parser = new MarkdownIt();

const lang = "en";

export async function GET(context: { site: string }) {
  const events = (await getCollection("events"))
    .toSorted((a, b) => b.data.startDate.getTime() - a.data.startDate.getTime())
    .filter((item) => item.slug.startsWith(`${lang}/`));

  const calendar = ical({ name: "Chaostreff Osnabrück e.V" });

  // A method is required for outlook to display event as an invitation
  calendar.method(ICalCalendarMethod.REQUEST);

  events.forEach((event) => {
    calendar.createEvent({
      start: event.data.startDate,
      end: event.data.endDate,
      summary: event.data.title,
      description:
        event.body?.length > 0
          ? sanitizeHtml(parser.render(event.body))
          : undefined,
      location: event.data.location,
      url: `${context.site}about#${event.slug}`,
    });
  });

  return new Response(calendar.toString(), {
    headers: {
      "Content-Type": "text/calendar",
    },
  });
}
