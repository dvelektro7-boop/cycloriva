import type { ReactNode } from "react";
import "../globals.css";
import { RootDocument } from "@/components/site/RootDocument";
export { metadata, viewport } from "@/lib/site-metadata";

export default function EntryLayout({ children }: { children: ReactNode }) {
  return <RootDocument locale="fr">{children}</RootDocument>;
}
