import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import ical, {
  ICalCalendarMethod,
  type ICalDescription,
  type ICalLocationWithTitle,
} from "ical-generator";
import { createTreffEvent } from "@/chaostreff";
const parser = new MarkdownIt();

const lang = "en";

export async function GET(context: { site: URL }) {
  const events = (await getCollection("events"))
    .toSorted((a, b) => b.data.startDate.getTime() - a.data.startDate.getTime())
    .filter((item) => item.slug.startsWith(`${lang}/`));

  const calendar = ical({
    name: "Chaostreff Osnabrück e.V",
    timezone: "Europe/Berlin",
    method: ICalCalendarMethod.PUBLISH,
    ttl: 60 * 60,
  });

  calendar.createEvent(
    createTreffEvent("The weekly meeting takes place every Thursday at 19:00.")
  );

  events.forEach((event) => {
    calendar.createEvent({
      start: event.data.startDate,
      end: event.data.endDate,
      allDay: event.data.endDate ? false : true,
      summary: event.data.title,
      description: {
        plain:
          event.body?.trim().length > 0
            ? sanitizeHtml(parser.render(event.body), {
                allowedTags: [],
                allowedAttributes: {},
              })
            : "",
        html:
          event.body?.trim().length > 0
            ? sanitizeHtml(parser.render(event.body))
            : "",
      } as ICalDescription,
      location:
        event.data.locationName ||
        (event.data.locationAddress &&
          ({
            title: event.data.locationName,
            address: event.data.locationAddress,
          } as ICalLocationWithTitle)),
      url: `${context.site.origin}${import.meta.env.BASE_URL}/${lang}/about#${
        event.slug
      }`,
      timezone: "Europe/Berlin",
    });
  });

  return new Response(calendar.toString(), {
    headers: {
      "Content-Type": "text/calendar",
    },
  });
}
