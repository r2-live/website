import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t-4 border-double border-border-strong bg-surface-dark px-6 py-10 text-[#f2e8d5]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display uppercase tracking-[0.12em]">
          © {new Date().getFullYear()} R2-Live / Kurt & The Gang
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/impressum"
            className="underline-offset-4 hover:text-accent-gold hover:underline"
          >
            Impressum
          </Link>
          <Link
            href="/datenschutz"
            className="underline-offset-4 hover:text-accent-gold hover:underline"
          >
            Datenschutz
          </Link>
        </div>
        <p className="text-xs opacity-70">
          Tastenkürzel: 1–9 Abschnitte · R/K Band wechseln
        </p>
      </div>
    </footer>
  );
}
