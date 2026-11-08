import { redirect } from "next/navigation";
import { defaultSiteLocale } from "@/lib/site-i18n";

export default function RootPage() {
  redirect(`/${defaultSiteLocale}`);
}
