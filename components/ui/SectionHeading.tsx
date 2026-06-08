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
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <p className="retro-badge mb-4 inline-block rounded-sm px-3 py-1 text-[0.7rem]">
        ★ {eyebrow} ★
      </p>
      <h2 className="font-display text-4xl uppercase leading-none text-foreground sm:text-5xl">
        {title}
      </h2>
      <div className="section-heading-rule mx-auto mt-4 h-1 w-16" />
      {description ? (
        <p className="mt-5 text-base leading-7 text-muted">{description}</p>
      ) : null}
    </div>
  );
}
