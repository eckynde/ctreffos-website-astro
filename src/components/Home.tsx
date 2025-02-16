import ICAL from "ical.js";
import { addDays, format } from "date-fns";
import { TZDate } from "@date-fns/tz";
import type { JSX } from "react/jsx-runtime";
import { getLocale } from "../i18n/utils";
import type { InferEntrySchema, Render, RenderedContent } from "astro:content";

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

const Events = ({
  events,
  lang,
}: {
  events: {
    startDate: TZDate;
    summary?: string;
    location?: string;
  }[];
  lang: string;
}) => {
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

export default async function Home({
  lang,
  news,
}: {
  lang: string;
  news: {
    id: string;
    render(): Render[".md"];
    slug: string;
    body: string;
    collection: "news";
    data: InferEntrySchema<"news">;
    rendered?: RenderedContent;
    filePath?: string;
  }[];
}) {
  const events = await upcomingEvents();

  const EventComponent = <Events events={events} lang={lang} />;

  if (lang === "de") {
    return <HomeDe events={EventComponent} news={news} />;
  } else {
    return <HomeEn events={EventComponent} news={news} />;
  }
}

const HomeDe = ({
  events,
  news,
}: {
  events: JSX.Element;
  news: {
    id: string;
    render(): Render[".md"];
    slug: string;
    body: string;
    collection: "news";
    data: InferEntrySchema<"news">;
    rendered?: RenderedContent;
    filePath?: string;
  }[];
}) => {
  news = news.filter((item) => item.slug.startsWith("de/"));

  return (
    <div>
      <h1>Chaostreff Osnabrück e.V. – All creatures welcome!</h1>
      <p>
        Fasziniert von Sicherheit, alternativen Betriebssystemen, freier (libre)
        Software und Netzpolitik? Willkommen beim{" "}
        <b>Chaostreff Osnabrück e.V.</b>, deiner Anlaufstelle für alle, die die
        Welt hacken und gestalten wollen.
      </p>
      <p>
        <b>Unsere Mission:</b> Wir sind eine Gruppe von Hacker*innen und
        Technikfreaks, die regelmäßig zusammenkommen, um Ideen zu teilen und
        Projekte zu entwickeln. Bei uns sind alle willkommen – ob erfahren oder
        neugierig.
      </p>
      <p>
        <b>Join us!</b> Besuche unsere Treffen und sei Teil unserer chaotischen
        Truppe. Wir freuen uns auf dich!
      </p>
      <h3>Neuigkeiten</h3>
      <ul>
        {news
          .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
          .map((item) => {
            const [lang, ...slug] = item.slug.split("/");

            return (
              <li key={item.slug}>
                <a
                  href={`${import.meta.env.BASE_URL}/${lang}/news/${slug.join(
                    "/"
                  )}/`}
                >
                  {new Date(item.data.date).toLocaleDateString(lang, {
                    dateStyle: "medium",
                  })}{" "}
                  - {item.data.title}
                </a>
              </li>
            );
          })}
      </ul>
      <h3>Regelmäßige Treffen</h3>
      <dd>
        Jeden Donnerstag treffen wir uns um 19:00 Uhr im{" "}
        <a href="/de/hackspace#anfahrt">
          AStA der Universität Osnabrück, Alte Münze 12, 49074 Osnabrück
        </a>{" "}
        in unserem Hackspace Rabbithole.
      </dd>
      {events}
      <h3>Veranstaltungen</h3>
      <dd>
        Alle Termine der nächsten Monate können online angesehen, als iCalendar
        abonniert oder als .ics-Datei heruntergeladen werden:{" "}
        <a
          href="https://vc1.brainfact.de/nextcloud/apps/calendar/p/LqyiwT8aRjkbLako"
          rel="noreferer"
          target="_blank"
        >
          zu unserem Kalender
        </a>
        .
      </dd>
      <h3>Chatraum</h3>
      <dd>
        Wir chatten regelmäßig in unserem{" "}
        <a
          href="https://matrix.to/#/#public_ctreffos:matrix.drpetervoigt.de"
          rel="noreferer"
          target="_blank"
        >
          öffentlichen Matrix-Raum
        </a>
        .
      </dd>
    </div>
  );
};

const HomeEn = ({
  events,
  news,
}: {
  events: JSX.Element;
  news: {
    id: string;
    render(): Render[".md"];
    slug: string;
    body: string;
    collection: "news";
    data: InferEntrySchema<"news">;
    rendered?: RenderedContent;
    filePath?: string;
  }[];
}) => {
  news = news.filter((item) => item.slug.startsWith("en/"));

  return (
    <div>
      <p>
        The Chaostreff Osnabrück e.V. is a group of people interested in topics
        like security, cryptography, alternative operating systems, free (libre)
        software, internet related politics and what else comes to mind.
      </p>

      <p>
        People interested in our topics are welcome at our regular meetings.
      </p>

      <h3>News</h3>

      <ul>
        {news
          .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
          .map((item) => {
            const [lang, ...slug] = item.slug.split("/");

            return (
              <li key={item.slug}>
                <a
                  href={`${import.meta.env.BASE_URL}/${lang}/news/${slug.join(
                    "/"
                  )}/`}
                >
                  {new Date(item.data.date).toLocaleDateString(lang, {
                    dateStyle: "medium",
                  })}{" "}
                  - {item.data.title}
                </a>
              </li>
            );
          })}
      </ul>

      <dl>
        <dt>Regular meetings</dt>
        <dd>
          Every Thursday we meet at 7 pm at the{" "}
          <a
            href="https://www.openstreetmap.org/?mlat=52.27274&mlon=8.04577#map=19/52.27274/8.04577"
            rel="noreferer"
            target="_blank"
          >
            AStA of the University of Osnabrück, Alte Münze 12, 49074 Osnabrück
          </a>{" "}
          in our hackspace Rabbithole.
        </dd>

        <dt>Calendar</dt>
        <dd>
          All events of the next months can be viewed online, be subscribed to
          as iCalendar or be downloaded as .ics file:{" "}
          <a
            href="https://vc1.brainfact.de/nextcloud/apps/calendar/p/LqyiwT8aRjkbLako"
            rel="noreferer"
            target="_blank"
          >
            to our calendar
          </a>
          .
        </dd>

        {events}

        <dt>Email</dt>
        <dd>
          <ul>
            <li>
              <a href="mailto:info@chaostreff-osnabrueck.de">Contact</a>
            </li>
            <li>
              <a href="mailto:presse@chaostreff-osnabrueck.de">
                Press requests
              </a>
            </li>
          </ul>
        </dd>

        <dt>Public Chatroom</dt>
        <dd>
          <ul>
            <li>
              Visitors are welcome in the{" "}
              <a
                href="xmpp:public@conference.jabber.chaostreff-osnabrueck.de?join"
                rel="noreferer"
                target="_blank"
              >
                public Jabber MUC
              </a>
              .
            </li>
            <li>
              The{" "}
              <a
                href="https://matrix.to/#/#public_ctreffos:matrix.drpetervoigt.de"
                rel="noreferer"
                target="_blank"
              >
                public Matrix room
              </a>{" "}
              is bidirectionally mirrored with the public Jabber MUC.
            </li>
          </ul>
        </dd>

        <dt>Mailing list</dt>
        <dd>
          For more detailed discussions about different topics we offer{" "}
          <a
            href="https://listserv.chaostreff-osnabrueck.de/sympa/arc/ctreffos-public/2023-02/msg00000.html"
            rel="noreferer"
            target="_blank"
          >
            our public mailinglist
          </a>
          .
        </dd>

        <dt>Social Media</dt>
        <dd>
          <ul>
            <li>
              Fediverse (Mastodon):{" "}
              <a
                href="https://chaos.social/@chaostreff_osnabrueck"
                rel="me"
                target="_blank"
              >
                @chaostreff_osnabrueck
              </a>
            </li>
          </ul>
        </dd>

        <dt>GitHub</dt>
        <dd>
          <a href="https://github.com/CTreffOS" rel="noreferer" target="_blank">
            github.com/CTreffOS
          </a>
        </dd>
      </dl>
    </div>
  );
};
