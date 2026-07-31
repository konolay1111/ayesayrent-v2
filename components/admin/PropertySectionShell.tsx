type SectionNavProps = {
  links: Array<{
    href: string;
    label: string;
  }>;
};

export function SectionNav({ links }: SectionNavProps) {
  return (
    <nav
      aria-label="Property section navigation"
      className="sticky top-0 z-20 mt-6 rounded-xl border border-gray-200 bg-white/95 p-3 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/90"
    >
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

type CollapsibleSectionProps = {
  id: string;
  title: string;
  description?: string;
  countLabel?: string;
  defaultOpen?: boolean;
  banner?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export function CollapsibleSection({
  id,
  title,
  description,
  countLabel,
  defaultOpen = false,
  banner,
  actions,
  children,
}: CollapsibleSectionProps) {
  return (
    <details
      id={id}
      open={defaultOpen}
      className="group mt-8 scroll-mt-28 rounded-xl border border-gray-200 bg-white"
    >
      <summary className="flex cursor-pointer list-none flex-col gap-3 p-6 marker:content-none sm:flex-row sm:items-start sm:justify-between [&::-webkit-details-marker]:hidden">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            {countLabel ? (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                {countLabel}
              </span>
            ) : null}
          </div>
          {description ? (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          ) : null}
        </div>

        <span className="text-sm font-semibold text-emerald-700 group-open:hidden">
          Expand
        </span>
        <span className="hidden text-sm font-semibold text-emerald-700 group-open:inline">
          Collapse
        </span>
      </summary>

      <div className="border-t border-gray-100 px-6 pb-6 pt-4">
        {actions ? <div className="mb-4 flex justify-end">{actions}</div> : null}
        {banner}
        {children}
      </div>
    </details>
  );
}

type PropertySectionProps = {
  id: string;
  title: string;
  description?: string;
  banner?: React.ReactNode;
  children: React.ReactNode;
};

export function PropertySection({
  id,
  title,
  description,
  banner,
  children,
}: PropertySectionProps) {
  return (
    <section
      id={id}
      className="mt-8 scroll-mt-28 rounded-xl border border-gray-200 bg-white p-6"
    >
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        ) : null}
      </div>

      {banner ? <div className="mt-4">{banner}</div> : null}
      {children}
    </section>
  );
}

export function SuccessBanner({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
      {message}
    </div>
  );
}
