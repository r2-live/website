export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading mx-auto max-w-3xl text-center">
      <p className="retro-badge retro-badge-eyebrow mb-4 inline-block px-4 py-1.5 text-[0.7rem]">
        ★ {eyebrow} ★
      </p>
      <h2 className="font-display text-4xl uppercase leading-none text-foreground sm:text-5xl">
        {title}
      </h2>
      <div className="section-heading-rule mx-auto mt-4 w-56 sm:w-72" aria-hidden />
      {description ? (
        <p className="mt-5 text-base leading-7 text-muted">{description}</p>
      ) : null}
    </div>
  );
}
