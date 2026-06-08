import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} R2-Live / KURT & THE GANG</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/impressum" className="hover:text-foreground">
            Impressum
          </Link>
          <Link href="/datenschutz" className="hover:text-foreground">
            Datenschutz
          </Link>
        </div>
        <p className="text-xs">
          Tastenkürzel: 1–9 Abschnitte · R/K Band wechseln
        </p>
      </div>
    </footer>
  );
}
