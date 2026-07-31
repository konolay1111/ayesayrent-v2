import Link from "next/link";
import { signOutAction } from "@/app/admin/actions";

type AdminHeaderProps = {
  currentPath: "/admin" | "/admin/requests" | "/admin/properties";
};

type NavItem = {
  href: "/admin" | "/admin/requests" | "/admin/properties";
  myanmar: string;
  english: string;
};

const navItems: NavItem[] = [
  {
    href: "/admin",
    myanmar: "ဒက်ရှ်ဘုတ်",
    english: "Dashboard",
  },
  {
    href: "/admin/requests",
    myanmar: "တောင်းဆိုချက်များ",
    english: "Availability Requests",
  },
  {
    href: "/admin/properties",
    myanmar: "ပိုင်ဆိုင်မှုများ",
    english: "Properties",
  },
];

export function AdminHeader({ currentPath }: AdminHeaderProps) {
  return (
    <header className="border-b border-zinc-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link
              href="/admin"
              className="text-xl font-bold tracking-tight text-emerald-600"
            >
              AyesayRent Admin
            </Link>
            <p className="mt-1 text-xs text-zinc-500">
              Internal operations dashboard
            </p>
          </div>

          <nav
            aria-label="Admin navigation"
            className="flex flex-wrap items-center gap-2"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={currentPath === item.href ? "page" : undefined}
                className={`inline-flex flex-col rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  currentPath === item.href
                    ? "bg-emerald-600 text-white"
                    : "border border-zinc-200 text-zinc-600 hover:border-emerald-200 hover:text-emerald-700"
                }`}
              >
                <span>{item.myanmar}</span>
                <span
                  className={
                    currentPath === item.href
                      ? "text-emerald-100"
                      : "text-zinc-500"
                  }
                >
                  {item.english}
                </span>
              </Link>
            ))}

            <form action={signOutAction}>
              <button
                type="submit"
                className="inline-flex flex-col rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 transition-colors hover:border-red-300 hover:bg-red-100"
              >
                <span>ထွက်ရန်</span>
                <span className="text-red-600/80">Logout</span>
              </button>
            </form>
          </nav>
        </div>
      </div>
    </header>
  );
}

export function AdminPageHeading({
  titleMyanmar,
  titleEnglish,
  description,
}: {
  titleMyanmar: string;
  titleEnglish: string;
  description?: string;
}) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
        {titleMyanmar}
      </h1>
      <p className="mt-1 text-sm font-medium text-emerald-600">{titleEnglish}</p>
      {description ? (
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-600">
          {description}
        </p>
      ) : null}
    </div>
  );
}
