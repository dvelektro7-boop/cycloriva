import type { ReactNode } from "react";
import type { SiteLocale } from "@/lib/site-i18n";

export function RootDocument({ children, locale }: { children: ReactNode; locale: SiteLocale }) {
  return (
    <html lang={locale} className="h-full antialiased">
      <body className="flex min-h-screen flex-col bg-white text-[#102b39]">{children}</body>
    </html>
  );
}
