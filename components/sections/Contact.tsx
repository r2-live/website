"use client";

import { useActionState } from "react";
import type { ContactInfo } from "@/lib/types";
import { SECTION_IDS } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { submitContactForm, type ContactFormState } from "@/app/actions/contact";

const initialState: ContactFormState = { status: "idle" };

export function ContactSection({ contact }: { contact: ContactInfo }) {
  const [state, formAction, pending] = useActionState(
    submitContactForm,
    initialState,
  );

  return (
    <section id={SECTION_IDS.contact} className="section-shell section-padding">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <SectionHeading
            eyebrow="im duo & zu viert"
            title="Kontakt"
            description="Buchungsanfragen für R2-Live, Kurt & The Gang oder beide Formate."
          />
          <ul className="space-y-3 text-sm text-muted">
            <li>
              E-Mail:{" "}
              <a
                href={`mailto:${contact.email}`}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                {contact.email}
              </a>
            </li>
            {contact.phone ? <li>Telefon: {contact.phone}</li> : null}
            {contact.instagram ? (
              <li>
                Instagram:{" "}
                <a href={contact.instagram} className="underline-offset-4 hover:underline">
                  @r2live
                </a>
              </li>
            ) : null}
            {contact.facebook ? (
              <li>
                Facebook:{" "}
                <a href={contact.facebook} className="underline-offset-4 hover:underline">
                  R2-Live
                </a>
              </li>
            ) : null}
            {contact.youtube ? (
              <li>
                YouTube:{" "}
                <a href={contact.youtube} className="underline-offset-4 hover:underline">
                  Kanal
                </a>
              </li>
            ) : null}
          </ul>
        </div>

        <form
          action={formAction}
          className="retro-card rounded-md p-6"
        >
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm">
              <span>Name</span>
              <input
                name="name"
                required
                className="retro-input rounded-md px-4 py-3"
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span>E-Mail</span>
              <input
                type="email"
                name="email"
                required
                className="retro-input rounded-md px-4 py-3"
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span>Anfrage für</span>
              <select
                name="inquiryFor"
                className="retro-input rounded-md px-4 py-3"
                defaultValue="beide"
              >
                <option value="r2-live">R2-Live</option>
                <option value="katg">Kurt & The Gang</option>
                <option value="beide">Beide / unsicher</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm">
              <span>Nachricht</span>
              <textarea
                name="message"
                required
                rows={5}
                className="retro-input rounded-md px-4 py-3"
              />
            </label>
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="retro-btn mt-5 inline-flex rounded-md bg-accent-gold px-5 py-3 text-sm text-white disabled:opacity-60"
          >
            {pending ? "Wird gesendet…" : "Nachricht senden"}
          </button>
          {state.status === "success" ? (
            <p className="mt-4 text-sm text-green-700">{state.message}</p>
          ) : null}
          {state.status === "error" ? (
            <p className="mt-4 text-sm text-red-700">{state.message}</p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
