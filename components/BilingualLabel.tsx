export function BilingualLabel({
  myanmar,
  english,
}: {
  myanmar: string;
  english: string;
}) {
  return (
    <span className="flex flex-col gap-0.5">
      <span>{myanmar}</span>
      <span className="text-xs font-normal text-zinc-500">{english}</span>
    </span>
  );
}
