import "@/components/site/InformationPages.css";
import { Suspense } from "react";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Building2,
  ChevronRight,
  Code2,
  FileText,
  Globe2,
  House,
  Mail,
  Server,
  ShieldCheck,
} from "lucide-react";

/**
 * CYCLORIVA — MENTIONS LÉGALES
 *
 * Fichier :
 * app/[locale]/mentions-legales/page.tsx
 *
 * Page serveur Next.js 16.
 * Cinq langues : FR / EN / DE / IT / ES.
 *
 * Aucun header ni footer supplémentaire.
 * Les éléments juridiques non confirmés
 * sont signalés comme restant à compléter.
 */

type Locale = "fr" | "en" | "de" | "it" | "es";

type Props = {
  params: Promise<{ locale: string }>;
};

type LegalText = {
  home: string;
  title: string;
  subtitle: string;
  eyebrow: string;
  description: string;

  siteTitle: string;
  siteDescription: string;
  siteName: string;
  siteActivity: string;
  activity: string;

  publisherTitle: string;
  publisherDescription: string;
  publisherPending: string;

  creatorsTitle: string;
  creatorsDescription: string;
  france: string;
  germany: string;

  hostingTitle: string;
  hostingDescription: string;
  hostingProvider: string;
  hostingNote: string;
  hostingWebsite: string;

  contactTitle: string;
  contactDescription: string;
  generalEmail: string;
  salesEmail: string;

  rightsTitle: string;
  rightsDescription: string;

  privacyTitle: string;
  privacyDescription: string;
  privacyLink: string;
  termsLink: string;

  finalTitle: string;
  finalDescription: string;
  contactButton: string;
};

const LOCALES: Locale[] = ["fr", "en", "de", "it", "es"];

const EMAIL_CONTACT = "contact@cycloriva.com";
const EMAIL_SALES = "sell@cycloriva.com";
const HOSTINGER_URL = "https://www.hostinger.com";

const TEXTS: Record<Locale, LegalText> = {
  fr: {
    home: "Accueil",
    title: "Mentions légales",
    subtitle: "Informations sur CYCLORIVA",
    eyebrow: "INFORMATIONS OFFICIELLES",
    description:
      "Retrouvez les informations essentielles concernant la boutique CYCLORIVA, sa création, son hébergement et ses coordonnées.",

    siteTitle: "Présentation du site",
    siteDescription:
      "CYCLORIVA est une boutique en ligne consacrée aux vélos, vélos électriques et accessoires.",
    siteName: "Nom commercial",
    siteActivity: "Activité",
    activity: "Vente en ligne de vélos et accessoires",

    publisherTitle: "Éditeur du site",
    publisherDescription:
      "L'identité juridique du professionnel qui exploite la boutique doit figurer ici.",
    publisherPending:
      "Raison sociale, adresse du siège, immatriculation et autres informations légales applicables : à compléter.",

    creatorsTitle: "Création de la boutique",
    creatorsDescription:
      "La création de la boutique CYCLORIVA est attribuée aux personnes suivantes.",
    france: "Français",
    germany: "Allemand",

    hostingTitle: "Hébergement du site",
    hostingDescription: "La boutique CYCLORIVA est hébergée chez Hostinger.",
    hostingProvider: "Hébergeur",
    hostingNote:
      "La raison sociale exacte, l'adresse et le téléphone de l'entité Hostinger contractante doivent être confirmés à partir du contrat d'hébergement.",
    hostingWebsite: "Site de l'hébergeur",

    contactTitle: "Nous contacter",
    contactDescription:
      "Pour toute question concernant la boutique, vous pouvez utiliser les coordonnées suivantes.",
    generalEmail: "Contact général",
    salesEmail: "Commandes et ventes",

    rightsTitle: "Propriété intellectuelle",
    rightsDescription:
      "Les éléments du site, notamment son identité visuelle, ses textes et ses images, sont soumis aux droits de leurs titulaires respectifs. Toute réutilisation doit respecter les droits applicables.",

    privacyTitle: "Confidentialité et conditions de vente",
    privacyDescription:
      "Les informations relatives aux données personnelles et aux achats sont disponibles sur les pages dédiées.",
    privacyLink: "Politique de confidentialité",
    termsLink: "Conditions générales de vente",

    finalTitle: "Besoin d'une information ?",
    finalDescription:
      "L'équipe CYCLORIVA reste joignable pour répondre à vos questions.",
    contactButton: "Contacter CYCLORIVA",
  },

  en: {
    home: "Home",
    title: "Legal Notice",
    subtitle: "Information about CYCLORIVA",
    eyebrow: "OFFICIAL INFORMATION",
    description:
      "Essential information about the CYCLORIVA store, its creators, hosting provider and contact details.",

    siteTitle: "About the website",
    siteDescription:
      "CYCLORIVA is an online store dedicated to bicycles, electric bicycles and accessories.",
    siteName: "Trading name",
    siteActivity: "Business activity",
    activity: "Online sales of bicycles and accessories",

    publisherTitle: "Website publisher",
    publisherDescription:
      "The legal identity of the business operating this online store must be provided here.",
    publisherPending:
      "Legal business name, registered address, registration and other applicable details: to be completed.",

    creatorsTitle: "Website creators",
    creatorsDescription:
      "The CYCLORIVA store was created by the following individuals.",
    france: "French",
    germany: "German",

    hostingTitle: "Website hosting",
    hostingDescription: "The CYCLORIVA website is hosted by Hostinger.",
    hostingProvider: "Hosting provider",
    hostingNote:
      "The exact contracting Hostinger entity, its address and telephone number must be confirmed from the hosting agreement.",
    hostingWebsite: "Hosting website",

    contactTitle: "Contact us",
    contactDescription:
      "For questions about CYCLORIVA, please use the following contact information.",
    generalEmail: "General enquiries",
    salesEmail: "Orders and sales",

    rightsTitle: "Intellectual property",
    rightsDescription:
      "The website's branding, texts, images and other materials are subject to the rights of their respective owners. Reuse must comply with applicable rights.",

    privacyTitle: "Privacy and terms of sale",
    privacyDescription:
      "More information about personal data and purchases is available on the dedicated pages.",
    privacyLink: "Privacy Policy",
    termsLink: "Terms and Conditions of Sale",

    finalTitle: "Need more information?",
    finalDescription: "The CYCLORIVA team is available for your questions.",
    contactButton: "Contact CYCLORIVA",
  },

  de: {
    home: "Startseite",
    title: "Impressum",
    subtitle: "Informationen über CYCLORIVA",
    eyebrow: "OFFIZIELLE INFORMATIONEN",
    description:
      "Informationen über den CYCLORIVA-Shop, die Erstellung, den Hostinganbieter und die Kontaktmöglichkeiten.",

    siteTitle: "Über die Website",
    siteDescription:
      "CYCLORIVA ist ein Online-Shop für Fahrräder, E-Bikes und Zubehör.",
    siteName: "Handelsname",
    siteActivity: "Geschäftstätigkeit",
    activity: "Online-Verkauf von Fahrrädern und Zubehör",

    publisherTitle: "Verantwortlicher Anbieter",
    publisherDescription:
      "Die rechtlichen Angaben zum Betreiber des Online-Shops müssen hier veröffentlicht werden.",
    publisherPending:
      "Rechtlicher Firmenname, Geschäftsanschrift, Registerangaben und weitere erforderliche Informationen: noch zu ergänzen.",

    creatorsTitle: "Erstellung des Online-Shops",
    creatorsDescription:
      "Der CYCLORIVA-Shop wurde von folgenden Personen erstellt.",
    france: "Französisch",
    germany: "Deutsch",

    hostingTitle: "Hosting",
    hostingDescription: "Die CYCLORIVA-Website wird bei Hostinger gehostet.",
    hostingProvider: "Hosting-Anbieter",
    hostingNote:
      "Die genaue vertragliche Hostinger-Gesellschaft sowie deren Anschrift und Telefonnummer müssen anhand des Hostingvertrags bestätigt werden.",
    hostingWebsite: "Website des Anbieters",

    contactTitle: "Kontakt",
    contactDescription:
      "Für Fragen zu CYCLORIVA stehen folgende Kontaktdaten zur Verfügung.",
    generalEmail: "Allgemeine Anfragen",
    salesEmail: "Bestellungen und Verkauf",

    rightsTitle: "Urheberrecht",
    rightsDescription:
      "Marken, Texte, Bilder und weitere Inhalte unterliegen den Rechten ihrer jeweiligen Inhaber. Jede Verwendung muss die geltenden Rechte beachten.",

    privacyTitle: "Datenschutz und Verkaufsbedingungen",
    privacyDescription:
      "Informationen zu personenbezogenen Daten und Einkäufen finden Sie auf den entsprechenden Seiten.",
    privacyLink: "Datenschutzerklärung",
    termsLink: "Allgemeine Geschäftsbedingungen",

    finalTitle: "Noch Fragen?",
    finalDescription:
      "Das CYCLORIVA-Team steht Ihnen für Fragen zur Verfügung.",
    contactButton: "CYCLORIVA kontaktieren",
  },

  it: {
    home: "Home",
    title: "Note legali",
    subtitle: "Informazioni su CYCLORIVA",
    eyebrow: "INFORMAZIONI UFFICIALI",
    description:
      "Informazioni sul negozio CYCLORIVA, i creatori, l'hosting e i contatti.",

    siteTitle: "Presentazione del sito",
    siteDescription:
      "CYCLORIVA è un negozio online dedicato a biciclette, biciclette elettriche e accessori.",
    siteName: "Nome commerciale",
    siteActivity: "Attività",
    activity: "Vendita online di biciclette e accessori",

    publisherTitle: "Titolare del sito",
    publisherDescription:
      "L'identità legale dell'operatore commerciale deve essere indicata qui.",
    publisherPending:
      "Ragione sociale, sede legale, registrazione e altre informazioni applicabili: da completare.",

    creatorsTitle: "Creazione del negozio",
    creatorsDescription:
      "Il negozio CYCLORIVA è stato creato dalle seguenti persone.",
    france: "Francese",
    germany: "Tedesco",

    hostingTitle: "Hosting del sito",
    hostingDescription: "Il sito CYCLORIVA è ospitato da Hostinger.",
    hostingProvider: "Fornitore di hosting",
    hostingNote:
      "La società Hostinger contrattuale, l'indirizzo e il telefono devono essere verificati nel contratto di hosting.",
    hostingWebsite: "Sito dell'hosting",

    contactTitle: "Contattaci",
    contactDescription:
      "Per informazioni su CYCLORIVA puoi utilizzare questi contatti.",
    generalEmail: "Contatto generale",
    salesEmail: "Ordini e vendite",

    rightsTitle: "Proprietà intellettuale",
    rightsDescription:
      "Marchi, testi, immagini e altri contenuti sono soggetti ai diritti dei rispettivi titolari. Ogni riutilizzo deve rispettare i diritti applicabili.",

    privacyTitle: "Privacy e condizioni di vendita",
    privacyDescription:
      "Ulteriori informazioni sui dati personali e sugli acquisti sono disponibili nelle pagine dedicate.",
    privacyLink: "Informativa sulla privacy",
    termsLink: "Condizioni generali di vendita",

    finalTitle: "Hai bisogno di informazioni?",
    finalDescription: "Il team CYCLORIVA è a disposizione per le tue domande.",
    contactButton: "Contatta CYCLORIVA",
  },

  es: {
    home: "Inicio",
    title: "Aviso legal",
    subtitle: "Información sobre CYCLORIVA",
    eyebrow: "INFORMACIÓN OFICIAL",
    description:
      "Información esencial de la tienda CYCLORIVA, sus creadores, alojamiento y contacto.",

    siteTitle: "Presentación del sitio",
    siteDescription:
      "CYCLORIVA es una tienda online dedicada a bicicletas, bicicletas eléctricas y accesorios.",
    siteName: "Nombre comercial",
    siteActivity: "Actividad",
    activity: "Venta online de bicicletas y accesorios",

    publisherTitle: "Titular del sitio",
    publisherDescription:
      "La identidad legal de la empresa que opera la tienda debe indicarse aquí.",
    publisherPending:
      "Razón social, domicilio legal, registro y demás información aplicable: pendiente de completar.",

    creatorsTitle: "Creación de la tienda",
    creatorsDescription:
      "La tienda CYCLORIVA fue creada por las siguientes personas.",
    france: "Francés",
    germany: "Alemán",

    hostingTitle: "Alojamiento web",
    hostingDescription: "El sitio CYCLORIVA está alojado en Hostinger.",
    hostingProvider: "Proveedor de alojamiento",
    hostingNote:
      "La entidad Hostinger contratada, su dirección y teléfono deben confirmarse mediante el contrato de alojamiento.",
    hostingWebsite: "Web del proveedor",

    contactTitle: "Contacto",
    contactDescription:
      "Para consultas sobre CYCLORIVA utiliza los siguientes medios.",
    generalEmail: "Consultas generales",
    salesEmail: "Pedidos y ventas",

    rightsTitle: "Propiedad intelectual",
    rightsDescription:
      "Las marcas, textos, imágenes y demás contenidos están sujetos a los derechos de sus respectivos titulares. Su reutilización debe respetar los derechos aplicables.",

    privacyTitle: "Privacidad y condiciones de venta",
    privacyDescription:
      "La información sobre datos personales y compras se encuentra en las páginas correspondientes.",
    privacyLink: "Política de privacidad",
    termsLink: "Condiciones generales de venta",

    finalTitle: "¿Necesitas información?",
    finalDescription:
      "El equipo CYCLORIVA está disponible para responder tus preguntas.",
    contactButton: "Contactar con CYCLORIVA",
  },
};

const CONTAINER = "mx-auto w-full max-w-none px-4 sm:px-6 lg:px-6";

const CARD = "rounded-2xl border border-[#e0e8ed] bg-white p-3 sm:p-3";

function localeFrom(value: string): Locale {
  if (!LOCALES.includes(value as Locale)) {
    notFound();
  }

  return value as Locale;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = localeFrom(raw);
  const t = TEXTS[locale];

  return {
    title: `${t.title} | CYCLORIVA`,
    description: t.description,

    // Activer l'indexation après avoir complété
    // et validé les informations juridiques.
    robots: {
      index: false,
      follow: true,
    },

    alternates: {
      canonical: `/${locale}/mentions-legales`,
      languages: {
        fr: "/fr/mentions-legales",
        en: "/en/mentions-legales",
        de: "/de/mentions-legales",
        it: "/it/mentions-legales",
        es: "/es/mentions-legales",
        "x-default": "/fr/mentions-legales",
      },
    },
  };
}

async function LegalNoticePageContent({ params }: Props) {
  const { locale: raw } = await params;
  const locale = localeFrom(raw);
  const t = TEXTS[locale];

  return (
    <main
      data-page="legal-notice"
      className="info-page w-full min-w-0  bg-[#f8fafb] pb-2 text-[#102b39]"
    >
      {/* Bandeau PC */}

      <section className="relative hidden overflow-hidden bg-[#082b3e] lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/couverture.png')",
          }}
          aria-hidden="true"
        />

        <div
          className="absolute inset-0 bg-linear-to-r from-[#061f32]/95 via-[#061f32]/80 to-[#061f32]/15"
          aria-hidden="true"
        />

        <div
          className={`${CONTAINER} relative flex min-h-31.25 flex-col justify-center py-1`}
        >
          <p className="mb-2 text-xs font-extrabold tracking-wider text-[#a6edaa]">
            {t.eyebrow}
          </p>

          <h1 className="text-3xl font-black text-white sm:text-4xl">
            {t.title}
          </h1>
        </div>
      </section>

      <div className={CONTAINER}>
        {/* Fil d'Ariane */}

        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 py-1 text-xs text-[#607585]"
        >
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 hover:text-[#109b24]"
          >
            <House size={16} className="text-[#109b24]" />
            {t.home}
          </Link>

          <ChevronRight size={15} />

          <span aria-current="page" className="font-bold text-[#102b39]">
            {t.title}
          </span>
        </nav>

        {/* Introduction */}

        <section className="pb-4 pt-2 sm:pb-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#e6f8e8] px-3 py-2 text-xs font-bold text-[#098a20]">
            <FileText size={16} />
            CYCLORIVA
          </span>

          <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            {t.subtitle}
          </h2>

          <p className="mt-2 max-w-190 text-sm leading-7 text-[#5b7081]">
            {t.description}
          </p>
        </section>

        {/* Informations principales */}

        <div className="grid gap-3 md:grid-cols-2">
          <section className={CARD}>
            <Globe2 size={28} className="text-[#109b24]" />

            <h2 className="mt-2 text-xl font-black">{t.siteTitle}</h2>

            <p className="mt-3 text-sm leading-7 text-[#536c7b]">
              {t.siteDescription}
            </p>

            <div className="mt-2 space-y-3 rounded-xl bg-[#f3f8f5] p-3">
              <p className="text-sm">
                <strong>{t.siteName} :</strong> CYCLORIVA
              </p>

              <p className="text-sm leading-6">
                <strong>{t.siteActivity} :</strong> {t.activity}
              </p>
            </div>
          </section>

          <section className={CARD}>
            <Code2 size={28} className="text-[#109b24]" />

            <h2 className="mt-2 text-xl font-black">{t.creatorsTitle}</h2>

            <p className="mt-3 text-sm leading-7 text-[#536c7b]">
              {t.creatorsDescription}
            </p>

            <div className="mt-2 space-y-3">
              <div className="rounded-xl border border-[#e2ebed] bg-[#fbfcfd] p-3">
                <p className="font-extrabold">Rachid BELMENGOUD</p>
                <p className="mt-1 text-xs text-[#657987]">🇫🇷 {t.france}</p>
              </div>

              <div className="rounded-xl border border-[#e2ebed] bg-[#fbfcfd] p-3">
                <p className="font-extrabold">Peter Heide</p>
                <p className="mt-1 text-xs text-[#657987]">🇩🇪 {t.germany}</p>
              </div>
            </div>
          </section>
        </div>

        {/* Éditeur */}

        <section className={`${CARD} mt-2`}>
          <div className="flex items-center gap-3">
            <Building2 size={27} className="shrink-0 text-[#109b24]" />

            <h2 className="text-xl font-black">{t.publisherTitle}</h2>
          </div>

          <p className="mt-2 text-sm leading-7 text-[#536c7b]">
            {t.publisherDescription}
          </p>

          <p className="mt-3 rounded-lg border border-[#e8dfc5] bg-[#fffaf0] p-3 text-sm leading-6 text-[#745c31]">
            {t.publisherPending}
          </p>
        </section>

        {/* Hébergement */}

        <section className={`${CARD} mt-2`}>
          <div className="flex items-center gap-3">
            <Server size={27} className="shrink-0 text-[#109b24]" />

            <h2 className="text-xl font-black">{t.hostingTitle}</h2>
          </div>

          <p className="mt-2 text-sm leading-7 text-[#536c7b]">
            {t.hostingDescription}
          </p>

          <p className="mt-3 text-sm">
            <strong>{t.hostingProvider} :</strong> Hostinger
          </p>

          <a
            href={HOSTINGER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#098a20] hover:underline"
          >
            {t.hostingWebsite}
            <ArrowRight size={16} />
          </a>

          <p className="mt-2 text-xs leading-6 text-[#7b8791]">
            {t.hostingNote}
          </p>
        </section>

        {/* Contact */}

        <section className={`${CARD} mt-2`}>
          <div className="flex items-center gap-3">
            <Mail size={27} className="shrink-0 text-[#109b24]" />

            <h2 className="text-xl font-black">{t.contactTitle}</h2>
          </div>

          <p className="mt-2 text-sm leading-7 text-[#536c7b]">
            {t.contactDescription}
          </p>

          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <a
              href={`mailto:${EMAIL_CONTACT}`}
              className="rounded-xl border border-[#e0e9ed] bg-[#f9fcfa] p-3 hover:border-[#109b24]"
            >
              <p className="text-xs font-bold text-[#607585]">
                {t.generalEmail}
              </p>

              <p className="mt-2 break-all text-sm font-extrabold text-[#0a8421]">
                {EMAIL_CONTACT}
              </p>
            </a>

            <a
              href={`mailto:${EMAIL_SALES}`}
              className="rounded-xl border border-[#e0e9ed] bg-[#f9fcfa] p-3 hover:border-[#109b24]"
            >
              <p className="text-xs font-bold text-[#607585]">{t.salesEmail}</p>

              <p className="mt-2 break-all text-sm font-extrabold text-[#0a8421]">
                {EMAIL_SALES}
              </p>
            </a>
          </div>
        </section>

        {/* Propriété intellectuelle */}

        <section className={`${CARD} mt-2`}>
          <div className="flex items-center gap-3">
            <ShieldCheck size={27} className="shrink-0 text-[#109b24]" />

            <h2 className="text-xl font-black">{t.rightsTitle}</h2>
          </div>

          <p className="mt-2 text-sm leading-7 text-[#536c7b]">
            {t.rightsDescription}
          </p>
        </section>

        {/* Liens juridiques */}

        <section className={`${CARD} mt-2`}>
          <div className="flex items-center gap-3">
            <FileText size={27} className="shrink-0 text-[#109b24]" />

            <h2 className="text-xl font-black">{t.privacyTitle}</h2>
          </div>

          <p className="mt-2 text-sm leading-7 text-[#536c7b]">
            {t.privacyDescription}
          </p>

          <div className="mt-2 flex flex-wrap gap-3">
            <Link
              href={`/${locale}/politique-confidentialite`}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#d6e5dd] px-4 py-3 text-sm font-bold text-[#102b39] hover:bg-[#f0f9f0]"
            >
              {t.privacyLink}
              <ArrowRight size={16} />
            </Link>

            <Link
              href={`/${locale}/conditions-generales-vente`}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#d6e5dd] px-4 py-3 text-sm font-bold text-[#102b39] hover:bg-[#f0f9f0]"
            >
              {t.termsLink}
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* Conclusion */}

        <section className="mt-2 rounded-2xl bg-[#102b39] px-5 py-1 text-center sm:px-10">
          <h2 className="text-2xl font-black text-white sm:text-3xl">
            {t.finalTitle}
          </h2>

          <p className="mx-auto mt-3 max-w-155 text-sm leading-7 text-[#d4e4eb]">
            {t.finalDescription}
          </p>

          <Link
            href={`/${locale}/contact`}
            className="mt-3 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#109b24] px-6 py-3 text-sm font-extrabold text-white hover:bg-[#087e1a]"
          >
            <Mail size={18} />
            {t.contactButton}
            <ArrowRight size={17} />
          </Link>
        </section>
      </div>
    </main>
  );
}

export default function LegalNoticePage(
  props: Parameters<typeof LegalNoticePageContent>[0],
) {
  return (
    <Suspense fallback={<main aria-busy="true" className="w-full min-h-40" />}>
      <LegalNoticePageContent {...props} />
    </Suspense>
  );
}
