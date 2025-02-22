import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import ical, {
  ICalCalendarMethod,
  ICalEventRepeatingFreq,
  type ICalDescription,
} from "ical-generator";
const parser = new MarkdownIt();

const lang = "de";

export async function GET(context: { site: string }) {
  const events = (await getCollection("events"))
    .toSorted((a, b) => b.data.startDate.getTime() - a.data.startDate.getTime())
    .filter((item) => item.slug.startsWith(`${lang}/`));

  const calendar = ical({ name: "Chaostreff Osnabrück e.V" });

  // A method is required for outlook to display event as an invitation
  calendar.method(ICalCalendarMethod.REQUEST);

  calendar.createEvent({
    start: new Date(2024, 8, 6, 19),
    end: new Date(2024, 8, 6, 23),
    summary: "Chaostreff",
    description: {
      plain: "Das woechentliche Treffen jeden Donnerstag um 19:00 Uhr statt.",
    } as ICalDescription,
    location: "Uni AStA Osnabrueck, Alte Muenze 12, 49074 Osnabrueck",
    repeating: {
      freq: ICalEventRepeatingFreq.WEEKLY,
    },
    timezone: "Europe/Berlin",
  });

  events.forEach((event) => {
    calendar.createEvent({
      start: event.data.startDate,
      end: event.data.endDate,
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
      location: event.data.location,
      url: `${context.site}about#${event.slug}`,
      timezone: "Europe/Berlin",
    });
  });

  return new Response(calendar.toString(), {
    headers: {
      "Content-Type": "text/calendar",
    },
  });
}
