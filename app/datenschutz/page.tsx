import Link from "next/link";
import { getLegal } from "@/lib/content";

export default function DatenschutzPage() {
  const page = getLegal("datenschutz");

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="text-sm text-muted hover:text-foreground">
        ← Zurück zur Startseite
      </Link>
      <h1 className="mt-6 font-display text-4xl font-semibold">{page.title}</h1>
      <div
        className="prose-legal mt-8 space-y-4"
        dangerouslySetInnerHTML={{
          __html: page.body
            .split("\n\n")
            .map((block) => {
              if (block.startsWith("## ")) {
                return `<h2>${block.replace("## ", "")}</h2>`;
              }
              return `<p>${block.replace(/\n/g, "<br />")}</p>`;
            })
            .join(""),
        }}
      />
    </main>
  );
}
