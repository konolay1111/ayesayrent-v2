export function SectionHeading({
  myanmar,
  english,
  description,
  descriptionMm,
}: {
  myanmar: string;
  english: string;
  description?: string;
  descriptionMm?: string;
}) {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
        {myanmar}
      </h2>
      <p className="mt-1 text-sm font-medium text-emerald-600">{english}</p>
      {(descriptionMm || description) && (
        <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-zinc-600">
          {descriptionMm}
          {descriptionMm && description && (
            <span className="mt-1 block text-sm text-zinc-500">{description}</span>
          )}
          {!descriptionMm && description}
        </p>
      )}
    </div>
  );
}
