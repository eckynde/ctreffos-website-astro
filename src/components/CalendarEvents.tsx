import ICAL from "ical.js";
import { addDays, format } from "date-fns";
import { TZDate } from "@date-fns/tz";
import { getLocale } from "../i18n/utils";

const upcomingEvents = async () => {
  const returnEvents: {
    startDate: TZDate;
    summary?: string;
    location?: string;
  }[] = [];

  const icalUrl =
    "https://vc1.brainfact.de/nextcloud/remote.php/dav/public-calendars/LqyiwT8aRjkbLako/?export";

  const response = await fetch(icalUrl);

  if (response.ok) {
    const text = await response.text();

    const jcalData = ICAL.parse(text);

    const comp = new ICAL.Component(jcalData);
    const vevent = comp.getAllSubcomponents("vevent");

    const rangeStart = ICAL.Time.fromDateString(new Date().toISOString());
    const rangeEnd = ICAL.Time.fromDateString(
      addDays(new Date(), 14).toISOString()
    );

    for (const v of vevent) {
      const dtstart = v.getFirstPropertyValue("dtstart");

      if (!dtstart) {
        continue;
      }

      const expand = new ICAL.RecurExpansion({
        component: v,
        // @ts-expect-error Should usually be string, so this is fine
        dtstart,
      });

      for (
        let next = expand.next();
        next && next.compare(rangeEnd) < 0;
        next = expand.next()
      ) {
        if (next.compare(rangeStart) < 0) {
          continue;
        }

        returnEvents.push({
          summary: v.getFirstPropertyValue("summary")?.toString(),
          location: v.getFirstPropertyValue("location")?.toString(),
          startDate: new TZDate(
            expand.last.toJSDate(),
            expand.last.zone.toString()
          ),
        });
      }
    }
  }

  return returnEvents;
};

export const CalendarEvents = async ({ lang }: { lang: string }) => {
  const events = await upcomingEvents();

  if (!events.length) {
    return null;
  }

  return (
    <div>
      <ul>
        {events.map((event, index) => (
          <li key={index}>
            <div className="font-bold">
              {format(event.startDate, "Pp", {
                locale: getLocale(lang),
              })}
            </div>
            <div>
              {event.summary} {event.location && ` (${event.location})`}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
