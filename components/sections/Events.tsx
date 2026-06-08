import type { EventItem } from "@/lib/types";
import { SECTION_IDS } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";

function formatDate(date: string, time: string) {
  const parsed = new Date(`${date}T${time}`);
  if (Number.isNaN(parsed.getTime())) return `${date} · ${time}`;
  return new Intl.DateTimeFormat("de-AT", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

export function EventsSection({ events }: { events: EventItem[] }) {
  return (
    <section id={SECTION_IDS.events} className="section-shell px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Gemeinsam"
          title="Termine"
          description="Komm vorbei — R2-Live oder KURT & THE GANG live on stage."
        />
        {events.length === 0 ? (
          <p className="text-center text-muted">
            Aktuell sind keine Termine geplant. Schreib uns für Buchungsanfragen.
          </p>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <article
                key={event.slug}
                className="retro-card rounded-md p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-display text-2xl uppercase tracking-wide">
                      {event.name}
                    </h3>
                    <p className="mt-1 text-muted">
                      {event.venue} · {event.location}
                    </p>
                  </div>
                  <p className="font-display text-sm uppercase tracking-wider text-accent-katg">
                    {formatDate(event.date, event.time)}
                  </p>
                </div>
                {event.url ? (
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex text-sm font-medium text-accent-katg underline-offset-4 hover:underline"
                  >
                    Mehr Infos
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
