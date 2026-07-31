import type { Metadata } from "next";
import { Noto_Sans_Myanmar } from "next/font/google";
import { PublicProviders } from "@/components/public/PublicProviders";
import { getServerLocale } from "@/lib/i18n/server";
import "./globals.css";

const notoSansMyanmar = Noto_Sans_Myanmar({
  subsets: ["myanmar"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-myanmar",
});

export const metadata: Metadata = {
  title: "AyesayRent",
  description:
    "Trusted apartment rental assistance for Myanmar people in Thailand",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialLocale = await getServerLocale();

  return (
    <html
      lang={initialLocale === "my" ? "my" : "en"}
      className={`h-full antialiased ${initialLocale === "my" ? "my-locale" : ""}`}
      suppressHydrationWarning
    >
      <body
        className={`${notoSansMyanmar.variable} flex min-h-full flex-col font-sans`}
      >
        <PublicProviders initialLocale={initialLocale}>
          {children}
        </PublicProviders>
      </body>
    </html>
  );
}
