export default async function SiteNotice({ lang }: { lang: string }) {
  if (lang === "de") {
    return <SiteNoticeDe />;
  } else {
    return <SiteNoticeEn />;
  }
}

const SiteNoticeDe = () => {
  return (
    <div>
      <h1>Impressum</h1>

      <p>
        Verantwortlich für den Inhalt dieser Seiten ist der Chaostreff Osnabrück
        e.V..
      </p>

      <dl>
        <dt>E-Mail</dt>
        <dd>
          <a href="mailto:info@chaostreff-osnabrueck.de">
            info@chaostreff-osnabrueck.de
          </a>
        </dd>
        <dt>Internet-Präsenz</dt>
        <dd>
          <a href="https://chaostreff-osnabrueck.de/">
            https://chaostreff-osnabrueck.de/
          </a>
        </dd>
        <dt>Anschrift</dt>
        <dd>
          Tim Klausmeyer
          <br />
          Chaostreff Osnabrück e.V.
          <br />
          c/o AStA der Universität Osnabrück
          <br />
          Alte Münze 12
          <br />
          49074 Osnabrück
        </dd>
      </dl>

      <p>
        Weitere Kontaktmöglichkeiten finden sich auf der Startseite unserer
        Internet-Präsenz.
      </p>

      <p>
        Der Chaostreff Osnabrück e.V. ist eingetragen im Vereinsregister des
        Amtsgerichts Osnabrück und wird unter der Vereinsregister-Nummer 201413
        geführt.
      </p>

      <h1 className="mt-20">Rechtliche Hinweise</h1>

      <h2>Haftungsbeschränkung</h2>

      <p>
        Diese Website enthält Verknüpfungen (Verlinkungen) zu Websites Dritter
        (externe Links). Diese Websites unterliegen der Haftung der jeweiligen
        Betreiber. Die Inhalte der verküpften Websites wurden bei der
        erstmaligen Verknüpfung von uns (dem Anbieter der aktuellen Website) auf
        etwaige Rechtsverstöße überprüft, und es waren keine Rechtsverstöße
        ersichtlich. Auf die Inhalte der verlinkten Seiten haben wir keinerlei
        Einfluss. Eine ständige Kontrolle dieser externen Links ist für den
        Anbieter ohne konkrete Hinweise auf Rechtsverstöße nicht zumutbar. Bei
        Kenntnis von Rechtsverstößen werden jedoch derartige externe Links
        unverzüglich gelöscht.
      </p>
    </div>
  );
};

const SiteNoticeEn = () => {
  //   metadata.title = "Chaostreff Osnabrück e.V. - Site Notice";
  return (
    <div>
      <h1>Site Notice</h1>

      <p>
        Responsible for the content of these pages is the Chaostreff Osnabrück
        e.V..
      </p>

      <dl>
        <dt>E-Mail</dt>
        <dd>
          <a href="mailto:info@chaostreff-osnabrueck.de">
            info@chaostreff-osnabrueck.de
          </a>
        </dd>
        <dt>Internet site</dt>
        <dd>
          <a href="https://chaostreff-osnabrueck.de/">
            https://chaostreff-osnabrueck.de/
          </a>
        </dd>
        <dt>Address</dt>
        <dd>
          Tim Klausmeyer
          <br />
          Chaostreff Osnabrück e.V.
          <br />
          c/o AStA der Universität Osnabrück
          <br />
          Alte Münze 12
          <br />
          49074 Osnabrück
        </dd>
      </dl>

      <p>
        Further ways to contact us are listed on the start page of our website.
      </p>

      <p>
        The Chaostreff Osnabrück e.V. is registered in the register of
        accociations at the Amtsgericht Osnabrück under the number 201413.
      </p>

      <h1 className="mt-20">Legal Notices</h1>

      <h2>Diclaimer</h2>

      <p>
        This website contains links to third party websites (external links).
        These websites are the responsibilities of the respective operators. The
        content of the linked websites has been checked by us (the operator of
        the current website) on their first linkage with respect to possible
        statutory violation and we have not found any legal violation. We have
        no influence on the content of the linked pages. We cannot permanently
        control these externally linked pages with respect to statutory
        violation without concrete hints. On awareness of statutory violation
        these external links are removed immediately.
      </p>
    </div>
  );
};
