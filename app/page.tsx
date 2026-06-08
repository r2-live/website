import Image from "next/image";

export default function HomePage() {
  return (
    <main className="page">
      <div className="card">
        <Image
          className="logo"
          src="/logos/r2-live.svg"
          alt="R2-Live"
          width={220}
          height={105}
          priority
        />
        <p className="eyebrow">Austropop live on stage</p>
        <h1>Demnächst online</h1>
        <p className="lead">
          Wir arbeiten an unserer neuen Website für <strong>R2-Live</strong> und{" "}
          <strong>KURT &amp; THE GANG</strong>. Bald findet ihr hier Termine,
          Fotos, Setlists und alle Infos für eure nächste Feier.
        </p>
        <p className="contact">
          Buchungsanfragen:{" "}
          <a href="mailto:info@r2-live.at">info@r2-live.at</a>
        </p>
      </div>
    </main>
  );
}
