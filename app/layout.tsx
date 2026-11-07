
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "./globals.css";

// ==========================================
// CYCLORIVA — CONFIGURATION GÉNÉRALE
// ==========================================

const SITE_NAME = "CYCLORIVA";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

const SITE_DESCRIPTION =
  "Découvrez CYCLORIVA, votre boutique spécialisée dans les vélos électriques, VTT, vélos cargo, vélos de ville et accessoires de mobilité en Europe.";

// ==========================================
// MÉTADONNÉES GLOBALES
// ==========================================

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  applicationName: SITE_NAME,

  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },

  description: SITE_DESCRIPTION,

  // ICÔNE OFFICIELLE DU NAVIGATEUR
  icons: {
    icon: [
      {
        url: "/images/cycloriva-icon.png",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/images/cycloriva-icon.png",
        type: "image/png",
      },
    ],
    shortcut: "/images/cycloriva-icon.png",
  },

  // PARTAGE SUR LES RÉSEAUX SOCIAUX
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/images/resaux.png",
        width: 1200,
        height: 630,
        alt: "CYCLORIVA — Vélos et mobilité en Europe",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/images/resaux.png"],
  },

  // RÉFÉRENCEMENT
  robots: {
    index: process.env.NODE_ENV === "production",
    follow: process.env.NODE_ENV === "production",
  },

  category: "shopping",
};

// ==========================================
// CONFIGURATION RESPONSIVE
// ==========================================

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#102b39",
  colorScheme: "light",
};

// ==========================================
// ROOT LAYOUT
// ==========================================

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html
      lang="fr"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-white text-[#102b39]">
        {children}
      </body>
    </html>
  );
}
