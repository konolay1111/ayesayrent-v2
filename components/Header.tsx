import { BilingualLabel } from "./BilingualLabel";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <a
          href="#home"
          className="shrink-0 text-xl font-bold tracking-tight text-emerald-600"
        >
          AyesayRent
        </a>

        <nav
          className="hidden items-center gap-6 lg:flex"
          aria-label="Main navigation"
        >
          <a
            href="#home"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-emerald-600"
          >
            <BilingualLabel myanmar="ပင်မ" english="Home" />
          </a>
          <a
            href="#search"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-emerald-600"
          >
            <BilingualLabel myanmar="အခန်းရှာရန်" english="Search" />
          </a>
          <a
            href="#how-it-works"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-emerald-600"
          >
            <BilingualLabel myanmar="လုပ်ဆောင်ပုံ" english="How It Works" />
          </a>
          <a
            href="#contact"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-emerald-600"
          >
            <BilingualLabel myanmar="ဆက်သွယ်ရန်" english="Contact" />
          </a>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <span
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white"
            aria-current="true"
          >
            မြန်မာ
          </span>
          <span className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-500">
            English
          </span>
        </div>

        <details className="group relative lg:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-center rounded-lg border border-zinc-200 p-2 [&::-webkit-details-marker]:hidden">
            <svg
              className="h-5 w-5 text-zinc-700"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
            <span className="sr-only">Open menu</span>
          </summary>
          <nav
            className="absolute right-0 mt-2 w-56 rounded-xl border border-zinc-100 bg-white py-2 shadow-lg"
            aria-label="Mobile navigation"
          >
            <a
              href="#home"
              className="block px-4 py-2.5 text-sm font-medium text-zinc-600 hover:bg-emerald-50 hover:text-emerald-600"
            >
              <BilingualLabel myanmar="ပင်မ" english="Home" />
            </a>
            <a
              href="#search"
              className="block px-4 py-2.5 text-sm font-medium text-zinc-600 hover:bg-emerald-50 hover:text-emerald-600"
            >
              <BilingualLabel myanmar="အခန်းရှာရန်" english="Search" />
            </a>
            <a
              href="#how-it-works"
              className="block px-4 py-2.5 text-sm font-medium text-zinc-600 hover:bg-emerald-50 hover:text-emerald-600"
            >
              <BilingualLabel myanmar="လုပ်ဆောင်ပုံ" english="How It Works" />
            </a>
            <a
              href="#contact"
              className="block px-4 py-2.5 text-sm font-medium text-zinc-600 hover:bg-emerald-50 hover:text-emerald-600"
            >
              <BilingualLabel myanmar="ဆက်သွယ်ရန်" english="Contact" />
            </a>
            <div className="mt-2 flex gap-2 border-t border-zinc-100 px-4 pt-3">
              <span className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white">
                မြန်မာ
              </span>
              <span className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-500">
                English
              </span>
            </div>
          </nav>
        </details>
      </div>
    </header>
  );
}
