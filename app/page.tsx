
import { redirect } from "next/navigation";

import {
  defaultSiteLocale,
} from "@/lib/site-i18n";

// =====================================================
// CYCLORIVA — PAGE RACINE
// =====================================================
//
// Route : /
//
// Fonction :
// Rediriger automatiquement les visiteurs
// vers la page d'accueil française.
//
// / -> /fr
//
// Les autres langues restent accessibles :
// /en
// /de
// /it
// /es
//
// La véritable page d'accueil est gérée par :
// app/[locale]/page.tsx
//
// =====================================================

export default function RootPage() {
  redirect(`/${defaultSiteLocale}`);
}
