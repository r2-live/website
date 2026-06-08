"use server";

import { Resend } from "resend";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  inquiryFor: z.enum(["r2-live", "katg", "beide"]),
  message: z.string().min(10).max(5000),
  company: z.string().max(0).optional(),
});

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    inquiryFor: formData.get("inquiryFor"),
    message: formData.get("message"),
    company: formData.get("company") || "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Bitte prüfe deine Eingaben und versuche es erneut.",
    };
  }

  if (parsed.data.company) {
    return { status: "success", message: "Danke für deine Nachricht!" };
  }

  const to = process.env.CONTACT_TO_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;

  if (!to || !apiKey) {
    return {
      status: "error",
      message:
        "Das Kontaktformular ist noch nicht konfiguriert. Bitte schreib uns direkt per E-Mail.",
    };
  }

  const resend = new Resend(apiKey);
  const inquiryLabel =
    parsed.data.inquiryFor === "beide"
      ? "Beide / unsicher"
      : parsed.data.inquiryFor === "katg"
        ? "KURT & THE GANG"
        : "R2-Live";

  const { error } = await resend.emails.send({
    from: "R2-Live Website <onboarding@resend.dev>",
    to,
    replyTo: parsed.data.email,
    subject: `Neue Buchungsanfrage (${inquiryLabel})`,
    text: [
      `Name: ${parsed.data.name}`,
      `E-Mail: ${parsed.data.email}`,
      `Anfrage für: ${inquiryLabel}`,
      "",
      parsed.data.message,
    ].join("\n"),
  });

  if (error) {
    return {
      status: "error",
      message: "Beim Senden ist ein Fehler aufgetreten. Bitte versuche es später erneut.",
    };
  }

  return {
    status: "success",
    message: "Danke! Wir melden uns so schnell wie möglich bei dir.",
  };
}
