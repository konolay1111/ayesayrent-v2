import { typeH2Class, typeSmallClass } from "@/lib/public-ui";

export function SectionHeading({
  title,
  description,
  myanmar,
  english,
  descriptionMm,
}: {
  title?: string;
  description?: string;
  myanmar?: string;
  english?: string;
  descriptionMm?: string;
}) {
  const resolvedTitle = title ?? myanmar ?? english ?? "";
  const resolvedDescription = description ?? descriptionMm;

  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2 className={typeH2Class}>{resolvedTitle}</h2>
      {resolvedDescription ? (
        <p className={`mx-auto mt-5 max-w-xl ${typeSmallClass} sm:text-base`}>
          {resolvedDescription}
        </p>
      ) : null}
      {!title && myanmar && english ? (
        <p className={`mx-auto mt-2 max-w-xl ${typeSmallClass}`}>{english}</p>
      ) : null}
    </div>
  );
}
