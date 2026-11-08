"use client";

import { useParams } from "next/navigation";
import { resolveLocale } from "@/lib/site-i18n";

const messages = {
  fr: { title: "Une erreur est survenue", description: "Veuillez réessayer dans un instant.", retry: "Réessayer" },
  en: { title: "Something went wrong", description: "Please try again in a moment.", retry: "Try again" },
  de: { title: "Ein Fehler ist aufgetreten", description: "Bitte versuchen Sie es gleich noch einmal.", retry: "Erneut versuchen" },
  es: { title: "Se ha producido un error", description: "Vuelve a intentarlo dentro de un momento.", retry: "Reintentar" },
  it: { title: "Si è verificato un errore", description: "Riprova tra un momento.", retry: "Riprova" },
};

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const params = useParams<{ locale?: string }>();
  const text = messages[resolveLocale(params?.locale)];
  return <main className="mx-auto w-full max-w-3xl p-8 text-center"><h1 className="text-2xl font-bold">{text.title}</h1><p className="my-4">{text.description}</p><button type="button" className="rounded-lg bg-green-700 px-5 py-3 font-bold text-white" onClick={reset}>{text.retry}</button></main>;
}
