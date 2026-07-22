import type { Metadata } from "next";
import { Noto_Sans_Myanmar } from "next/font/google";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body
        className={`${notoSansMyanmar.variable} flex min-h-full flex-col font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
