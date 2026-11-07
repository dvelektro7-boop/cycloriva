"use client";

import { useId, useState } from "react";

import { Bike, ChevronDown, ChevronUp, CircleHelp } from "lucide-react";

import {
  normalizeCheckoutLocale,
  type CheckoutLocale,
} from "@/lib/checkout-i18n";

/**
 * ============================================================
 * CYCLORIVA — FAQ DE LA PAGE CONTACT
 * ============================================================
 *
 * Fichier :
 * components/contact/ContactFAQ.tsx
 *
 * Technologies :
 * - Next.js 16
 * - React 19
 * - TypeScript
 * - Tailwind CSS 4
 * - Lucide React
 *
 * Architecture PC :
 * - Grande carte blanche
 * - Colonne gauche : introduction FAQ
 * - Colonne droite : accordéon
 * - Première question ouverte initialement
 * - Réponse sur fond vert clair
 *
 * Architecture mobile :
 * - Titre FAQ compact
 * - Sous-titre
 * - Questions empilées verticalement
 * - Accordéon interactif
 * - Aucun débordement horizontal
 *
 * Langues :
 * - FR
 * - EN
 * - DE
 * - IT
 * - ES
 *
 * Sécurité :
 * - Aucun HTML externe
 * - Aucun appel réseau
 * - Aucune donnée personnelle
 * - Aucun contenu commercial fictif
 *
 * ============================================================
 */

// ============================================================
// 1. TYPES
// ============================================================

export type ContactFAQProps = {
  locale: CheckoutLocale | string;

  /**
   * Question ouverte au chargement.
   *
   * 0 : livraison
   * 1 : retour
   * 2 : suivi
   * 3 : garantie
   * 4 : contact
   *
   * null : aucune question ouverte.
   */
  initialOpenIndex?: number | null;

  /**
   * Identifiant HTML facultatif.
   * Utile pour accéder à la FAQ par #faq.
   */
  id?: string;

  /**
   * Classes CSS supplémentaires.
   */
  className?: string;
};

type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

type FAQContent = {
  title: string;
  subtitle: string;
  introduction: string;
  questions: FAQItem[];
};

// ============================================================
// 2. DONNÉES FAQ — 5 LANGUES
// ============================================================
//
// Les réponses restent factuelles.
//
// Aucun délai de livraison, politique de retour
// ou durée de garantie non confirmé n'est promis.
//
// ============================================================

const FAQ_TRANSLATIONS: Record<CheckoutLocale, FAQContent> = {
  // ----------------------------------------------------------
  // FRANÇAIS
  // ----------------------------------------------------------

  fr: {
    title: "FAQ",

    subtitle: "Questions fréquentes",

    introduction:
      "Retrouvez ici les réponses aux questions les plus courantes.",

    questions: [
      {
        id: "delivery",
        question: "Quels sont les délais de livraison ?",
        answer:
          "Les délais dépendent du produit, de sa disponibilité et du pays de livraison. Contactez notre équipe à sell@cycloriva.com pour obtenir les informations correspondant à votre commande.",
      },
      {
        id: "returns",
        question: "Puis-je retourner un produit ?",
        answer:
          "Les possibilités de retour dépendent des conditions de vente applicables et de vos droits légaux. Écrivez à contact@cycloriva.com en précisant votre numéro de commande pour recevoir les instructions adaptées.",
      },
      {
        id: "tracking",
        question: "Comment suivre ma commande ?",
        answer:
          "Après l'enregistrement de votre commande, vous recevez un e-mail de confirmation. Pour obtenir des informations sur son traitement ou sa livraison, contactez sell@cycloriva.com en indiquant votre numéro de commande.",
      },
      {
        id: "warranty",
        question: "Les vélos sont-ils garantis ?",
        answer:
          "Les garanties applicables dépendent du produit, du fabricant et de la réglementation en vigueur. Notre équipe peut vous renseigner sur les garanties du vélo qui vous intéresse.",
      },
      {
        id: "contact",
        question: "Comment vous contacter rapidement ?",
        answer:
          "Vous pouvez nous joindre sur WhatsApp au +49 1573 0394552 (Allemagne) ou au +33 6 58 69 41 78 (France). Pour les commandes : sell@cycloriva.com. Pour les questions générales : contact@cycloriva.com.",
      },
    ],
  },

  // ----------------------------------------------------------
  // ANGLAIS
  // ----------------------------------------------------------

  en: {
    title: "FAQ",

    subtitle: "Frequently asked questions",

    introduction: "Find answers to the most common questions here.",

    questions: [
      {
        id: "delivery",
        question: "How long does delivery take?",
        answer:
          "Delivery times depend on the product, its availability and the destination country. Contact our team at sell@cycloriva.com for information about your order.",
      },
      {
        id: "returns",
        question: "Can I return a product?",
        answer:
          "Return options depend on the applicable terms of sale and your legal rights. Email contact@cycloriva.com with your order number to receive the appropriate instructions.",
      },
      {
        id: "tracking",
        question: "How can I track my order?",
        answer:
          "After your order has been recorded, you receive a confirmation email. For updates on processing or delivery, contact sell@cycloriva.com and provide your order number.",
      },
      {
        id: "warranty",
        question: "Do the bicycles come with a warranty?",
        answer:
          "Applicable warranties depend on the product, manufacturer and relevant law. Our team can provide information about the warranty coverage for the bicycle you are interested in.",
      },
      {
        id: "contact",
        question: "How can I contact you quickly?",
        answer:
          "You can reach us on WhatsApp at +49 1573 0394552 (Germany) or +33 6 58 69 41 78 (France). For orders: sell@cycloriva.com. For general enquiries: contact@cycloriva.com.",
      },
    ],
  },

  // ----------------------------------------------------------
  // ALLEMAND
  // ----------------------------------------------------------

  de: {
    title: "FAQ",

    subtitle: "Häufig gestellte Fragen",

    introduction: "Hier finden Sie Antworten auf die häufigsten Fragen.",

    questions: [
      {
        id: "delivery",
        question: "Wie lange dauert die Lieferung?",
        answer:
          "Die Lieferzeit hängt vom Produkt, seiner Verfügbarkeit und dem Lieferland ab. Für Informationen zu Ihrer Bestellung kontaktieren Sie unser Team unter sell@cycloriva.com.",
      },
      {
        id: "returns",
        question: "Kann ich ein Produkt zurückgeben?",
        answer:
          "Die Rückgabemöglichkeiten richten sich nach den geltenden Verkaufsbedingungen und Ihren gesetzlichen Rechten. Schreiben Sie mit Ihrer Bestellnummer an contact@cycloriva.com, um die passenden Anweisungen zu erhalten.",
      },
      {
        id: "tracking",
        question: "Wie kann ich meine Bestellung verfolgen?",
        answer:
          "Nach der Erfassung Ihrer Bestellung erhalten Sie eine Bestätigungs-E-Mail. Informationen zur Bearbeitung oder Lieferung erhalten Sie unter sell@cycloriva.com mit Angabe Ihrer Bestellnummer.",
      },
      {
        id: "warranty",
        question: "Haben die Fahrräder eine Garantie?",
        answer:
          "Die geltenden Garantien und Gewährleistungsrechte hängen vom Produkt, dem Hersteller und den gesetzlichen Bestimmungen ab. Unser Team informiert Sie gerne über das gewünschte Fahrrad.",
      },
      {
        id: "contact",
        question: "Wie kann ich Sie schnell erreichen?",
        answer:
          "Sie erreichen uns über WhatsApp unter +49 1573 0394552 (Deutschland) oder +33 6 58 69 41 78 (Frankreich). Für Bestellungen: sell@cycloriva.com. Für allgemeine Fragen: contact@cycloriva.com.",
      },
    ],
  },

  // ----------------------------------------------------------
  // ITALIEN
  // ----------------------------------------------------------

  it: {
    title: "FAQ",

    subtitle: "Domande frequenti",

    introduction: "Qui trovi le risposte alle domande più comuni.",

    questions: [
      {
        id: "delivery",
        question: "Quali sono i tempi di consegna?",
        answer:
          "I tempi di consegna dipendono dal prodotto, dalla disponibilità e dal paese di destinazione. Contatta il nostro team all'indirizzo sell@cycloriva.com per informazioni sul tuo ordine.",
      },
      {
        id: "returns",
        question: "Posso restituire un prodotto?",
        answer:
          "Le possibilità di reso dipendono dalle condizioni di vendita applicabili e dai tuoi diritti di legge. Scrivi a contact@cycloriva.com indicando il numero dell'ordine per ricevere le istruzioni appropriate.",
      },
      {
        id: "tracking",
        question: "Come posso seguire il mio ordine?",
        answer:
          "Dopo la registrazione dell'ordine riceverai un'e-mail di conferma. Per aggiornamenti sulla preparazione o sulla consegna, contatta sell@cycloriva.com indicando il numero dell'ordine.",
      },
      {
        id: "warranty",
        question: "Le biciclette sono coperte da garanzia?",
        answer:
          "Le garanzie applicabili dipendono dal prodotto, dal produttore e dalle disposizioni di legge. Il nostro team può fornire informazioni sulla copertura prevista per la bicicletta che ti interessa.",
      },
      {
        id: "contact",
        question: "Come posso contattarvi rapidamente?",
        answer:
          "Puoi contattarci su WhatsApp al +49 1573 0394552 (Germania) o al +33 6 58 69 41 78 (Francia). Per gli ordini: sell@cycloriva.com. Per domande generali: contact@cycloriva.com.",
      },
    ],
  },

  // ----------------------------------------------------------
  // ESPAGNOL
  // ----------------------------------------------------------

  es: {
    title: "FAQ",

    subtitle: "Preguntas frecuentes",

    introduction:
      "Encuentra aquí las respuestas a las preguntas más habituales.",

    questions: [
      {
        id: "delivery",
        question: "¿Cuáles son los plazos de entrega?",
        answer:
          "Los plazos de entrega dependen del producto, su disponibilidad y el país de destino. Contacta con nuestro equipo en sell@cycloriva.com para obtener información sobre tu pedido.",
      },
      {
        id: "returns",
        question: "¿Puedo devolver un producto?",
        answer:
          "Las opciones de devolución dependen de las condiciones de venta aplicables y de tus derechos legales. Escribe a contact@cycloriva.com con tu número de pedido para recibir las instrucciones correspondientes.",
      },
      {
        id: "tracking",
        question: "¿Cómo puedo seguir mi pedido?",
        answer:
          "Después de registrar tu pedido, recibirás un correo electrónico de confirmación. Para conocer su estado de preparación o entrega, contacta con sell@cycloriva.com e indica tu número de pedido.",
      },
      {
        id: "warranty",
        question: "¿Las bicicletas tienen garantía?",
        answer:
          "Las garantías aplicables dependen del producto, del fabricante y de la legislación vigente. Nuestro equipo puede informarte sobre la cobertura de la bicicleta que te interesa.",
      },
      {
        id: "contact",
        question: "¿Cómo puedo contactar rápidamente?",
        answer:
          "Puedes escribirnos por WhatsApp al +49 1573 0394552 (Alemania) o al +33 6 58 69 41 78 (Francia). Para pedidos: sell@cycloriva.com. Para consultas generales: contact@cycloriva.com.",
      },
    ],
  },
};

// ============================================================
// 3. COMPOSANT QUESTION / RÉPONSE
// ============================================================

type FAQAccordionItemProps = {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  buttonId: string;
  panelId: string;
  isLast: boolean;
};

function FAQAccordionItem({
  item,
  isOpen,
  onToggle,
  buttonId,
  panelId,
  isLast,
}: FAQAccordionItemProps) {
  return (
    <div
      className={[
        "min-w-0",
        "rounded-lg",
        "border",
        "border-[#d8e2ea]",
        "bg-white",
        "transition-colors",
        isOpen
          ? "border-[#b8dfba] shadow-[0_2px_10px_rgba(16,155,36,0.06)]"
          : "shadow-[0_2px_7px_rgba(16,43,57,0.035)]",
      ].join(" ")}
      data-open={isOpen}
      data-question={item.id}
      data-last={isLast}
    >
      {/* ==================================================
          BOUTON QUESTION
      ================================================== */}

      <h3>
        <button
          id={buttonId}
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className={[
            "flex",
            "min-h-11",
            "w-full",
            "min-w-0",
            "items-center",
            "justify-between",
            "gap-3",
            "rounded-lg",
            "px-3",
            "py-3",
            "text-left",
            "text-[#102b39]",
            "transition-colors",
            "hover:bg-[#f6faf6]",
            "focus-visible:outline-2",
            "focus-visible:-outline-offset-2",
            "focus-visible:outline-[#109b24]",
            "sm:px-4",
          ].join(" ")}
        >
          <span
            className={[
              "min-w-0",
              "flex-1",
              "text-[12px]",
              "leading-5",
              "font-extrabold",
              "sm:text-[14px]",
              "lg:text-[15px]",
            ].join(" ")}
          >
            {item.question}
          </span>

          {isOpen ? (
            <ChevronUp
              size={19}
              strokeWidth={2.5}
              className="shrink-0 text-[#109b24]"
              aria-hidden="true"
            />
          ) : (
            <ChevronDown
              size={19}
              strokeWidth={2.5}
              className="shrink-0 text-[#102b39]"
              aria-hidden="true"
            />
          )}
        </button>
      </h3>

      {/* ==================================================
          RÉPONSE DÉPLIABLE
      ================================================== */}

      {isOpen && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          className="px-2 pb-2 sm:px-2.5 sm:pb-2.5"
        >
          <div
            className={[
              "rounded-md",
              "bg-[#eaf9e7]",
              "px-3",
              "py-3",
              "sm:px-4",
              "sm:py-3.5",
            ].join(" ")}
          >
            <p
              className={[
                "text-[12px]",
                "leading-[1.7]",
                "font-normal",
                "wrap-break-word",
                "text-[#102b39]",
                "sm:text-[13px]",
              ].join(" ")}
            >
              {item.answer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// 4. INTRODUCTION DESKTOP
// ============================================================

function FAQIntroduction({ content }: { content: FAQContent }) {
  return (
    <div
      className={[
        "relative",
        "hidden",
        "min-w-0",
        "overflow-hidden",
        "border-r",
        "border-[#e4ebf0]",
        "p-5",
        "lg:flex",
        "lg:flex-col",
        "lg:p-6",
      ].join(" ")}
    >
      {/* TITRE */}

      <div className="flex items-start gap-3">
        <CircleHelp
          size={39}
          strokeWidth={1.8}
          className="shrink-0 text-[#109b24]"
          aria-hidden="true"
        />

        <div className="min-w-0">
          <h2 className="text-[24px] leading-tight font-black tracking-tight text-[#102b39]">
            {content.title}
          </h2>

          <p className="mt-1 text-[13px] font-bold text-[#102b39]">
            {content.subtitle}
          </p>
        </div>
      </div>

      {/* DESCRIPTION */}

      <p className="mt-6 max-w-55 text-[13px] leading-6 text-[#102b39]">
        {content.introduction}
      </p>

      {/* DÉCORATION VÉLO */}

      <div
        aria-hidden="true"
        className="pointer-events-none mt-auto flex min-h-30 items-end justify-center pt-6"
      >
        <div className="absolute right-0 bottom-0 left-0 h-20 bg-linear-to-t from-[#effbef] to-transparent" />

        <Bike size={140} strokeWidth={1} className="relative text-[#8acb84]" />
      </div>
    </div>
  );
}

// ============================================================
// 5. EN-TÊTE MOBILE
// ============================================================

function FAQMobileHeading({ content }: { content: FAQContent }) {
  return (
    <div className="mb-4 flex items-start gap-3 lg:hidden">
      <CircleHelp
        size={32}
        strokeWidth={1.8}
        className="mt-0.5 shrink-0 text-[#109b24]"
        aria-hidden="true"
      />

      <div className="min-w-0">
        <h2 className="text-[19px] leading-6 font-black tracking-tight text-[#102b39]">
          {content.title}
        </h2>

        <p className="mt-1 text-[12px] font-semibold text-[#102b39]">
          {content.subtitle}
        </p>
      </div>
    </div>
  );
}

// ============================================================
// 6. COMPOSANT PRINCIPAL
// ============================================================

export default function ContactFAQ({
  locale: rawLocale,
  initialOpenIndex = 0,
  id = "faq",
  className = "",
}: ContactFAQProps) {
  // ----------------------------------------------------------
  // LANGUE
  // ----------------------------------------------------------

  const locale = normalizeCheckoutLocale(rawLocale);

  const content = FAQ_TRANSLATIONS[locale];

  // ----------------------------------------------------------
  // IDENTIFIANTS
  // ----------------------------------------------------------

  const generatedId = useId();

  // ----------------------------------------------------------
  // QUESTION OUVERTE
  // ----------------------------------------------------------

  const [openIndex, setOpenIndex] = useState<number | null>(() => {
    if (
      initialOpenIndex === null ||
      !Number.isInteger(initialOpenIndex) ||
      initialOpenIndex < 0 ||
      initialOpenIndex >= content.questions.length
    ) {
      return null;
    }

    return initialOpenIndex;
  });

  // ----------------------------------------------------------
  // OUVERTURE / FERMETURE
  // ----------------------------------------------------------

  function toggleQuestion(index: number) {
    setOpenIndex((current) => (current === index ? null : index));
  }

  // ----------------------------------------------------------
  // RENDU
  // ----------------------------------------------------------

  return (
    <section
      id={id}
      data-component="contact-faq"
      className={[
        "w-full",
        "min-w-0",
        "overflow-hidden",
        "rounded-xl",
        "border",
        "border-[#dbe5ec]",
        "bg-white",
        "shadow-[0_3px_14px_rgba(16,43,57,0.04)]",
        className,
      ].join(" ")}
      aria-label={`${content.title} — ${content.subtitle}`}
    >
      <div
        className={[
          "grid",
          "grid-cols-1",
          "lg:grid-cols-[minmax(0,0.36fr)_minmax(0,1fr)]",
        ].join(" ")}
      >
        {/* ==================================================
            INTRODUCTION DESKTOP
        ================================================== */}

        <FAQIntroduction content={content} />

        {/* ==================================================
            ACCORDÉON
        ================================================== */}

        <div className={["min-w-0", "p-3", "sm:p-4", "lg:p-4"].join(" ")}>
          {/* INTRODUCTION MOBILE */}

          <FAQMobileHeading content={content} />

          {/* LISTE DES QUESTIONS */}

          <div className="flex min-w-0 flex-col gap-2">
            {content.questions.map((item, index) => {
              const isOpen = openIndex === index;

              const buttonId = `${generatedId}-faq-button-${index}`;

              const panelId = `${generatedId}-faq-panel-${index}`;

              return (
                <FAQAccordionItem
                  key={item.id}
                  item={item}
                  isOpen={isOpen}
                  onToggle={() => toggleQuestion(index)}
                  buttonId={buttonId}
                  panelId={panelId}
                  isLast={index === content.questions.length - 1}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 7. EXPORT NOMMÉ
// ============================================================

export { ContactFAQ };

// ============================================================
// FIN — CYCLORIVA CONTACT FAQ
// ============================================================
