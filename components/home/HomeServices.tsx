import Link from "next/link";
import {
  informationPagePath,
  serviceInformationRoutes,
} from "@/lib/site-routes";

import {
  Truck,
  ShieldCheck,
  RefreshCw,
  BadgeCheck,
  Headset,
  type LucideIcon,
} from "lucide-react";

import { resolveLocale, type SiteLocale } from "@/lib/site-i18n";

// =========================================================
// CYCLORIVA — BANDEAU DES SERVICES
// =========================================================
//
// Maquette officielle :
//
// PC : 5 services sur une ligne
// Mobile : bandeau horizontal compact
//
// Couleurs :
// - Fond vert très clair
// - Icônes vertes
// - Textes bleu marine
// - Séparateurs vert/gris
//
// Langues : FR, EN, DE, IT, ES
//
// Aucun service externe n'est connecté ici.
// =========================================================

// =========================================================
// TYPES
// =========================================================

type ServiceKey = "delivery" | "payment" | "returns" | "warranty" | "support";

type ServiceItem = {
  key: ServiceKey;
  icon: LucideIcon;
};

type ServiceTranslation = {
  title: string;
  description: string;
};

type HomeServicesProps = {
  locale: SiteLocale;
  className?: string;
};

// =========================================================
// CONFIGURATION DES CINQ SERVICES
// =========================================================

const services: ServiceItem[] = [
  {
    key: "delivery",
    icon: Truck,
  },
  {
    key: "payment",
    icon: ShieldCheck,
  },
  {
    key: "returns",
    icon: RefreshCw,
  },
  {
    key: "warranty",
    icon: BadgeCheck,
  },
  {
    key: "support",
    icon: Headset,
  },
];

// =========================================================
// TRADUCTIONS DES SERVICES
// =========================================================

const translations: Record<
  SiteLocale,
  Record<ServiceKey, ServiceTranslation>
> = {
  fr: {
    delivery: {
      title: "Livraison en Europe",
      description: "Délais selon destination",
    },
    payment: {
      title: "Paiement sécurisé",
      description: "Selon les modes activés",
    },
    returns: {
      title: "Retours et remboursements",
      description: "Selon nos conditions",
    },
    warranty: {
      title: "Garantie des produits",
      description: "Selon le fabricant",
    },
    support: {
      title: "Service client",
      description: "Assistance CYCLORIVA",
    },
  },

  en: {
    delivery: {
      title: "Delivery in Europe",
      description: "Times vary by destination",
    },
    payment: {
      title: "Secure payment",
      description: "Subject to enabled methods",
    },
    returns: {
      title: "Returns and refunds",
      description: "Subject to our policy",
    },
    warranty: {
      title: "Product warranty",
      description: "Depending on manufacturer",
    },
    support: {
      title: "Customer service",
      description: "CYCLORIVA assistance",
    },
  },

  de: {
    delivery: {
      title: "Lieferung in Europa",
      description: "Je nach Lieferziel",
    },
    payment: {
      title: "Sichere Zahlung",
      description: "Je nach aktivierter Zahlungsart",
    },
    returns: {
      title: "Rückgabe und Erstattung",
      description: "Gemäß unseren Bedingungen",
    },
    warranty: {
      title: "Produktgarantie",
      description: "Je nach Hersteller",
    },
    support: {
      title: "Kundenservice",
      description: "CYCLORIVA Unterstützung",
    },
  },

  it: {
    delivery: {
      title: "Consegna in Europa",
      description: "Tempi secondo la destinazione",
    },
    payment: {
      title: "Pagamento sicuro",
      description: "Secondo i metodi attivati",
    },
    returns: {
      title: "Resi e rimborsi",
      description: "Secondo le nostre condizioni",
    },
    warranty: {
      title: "Garanzia prodotti",
      description: "Secondo il produttore",
    },
    support: {
      title: "Servizio clienti",
      description: "Assistenza CYCLORIVA",
    },
  },

  es: {
    delivery: {
      title: "Entrega en Europa",
      description: "Plazos según el destino",
    },
    payment: {
      title: "Pago seguro",
      description: "Según métodos habilitados",
    },
    returns: {
      title: "Devoluciones y reembolsos",
      description: "Según nuestras condiciones",
    },
    warranty: {
      title: "Garantía de productos",
      description: "Según el fabricante",
    },
    support: {
      title: "Atención al cliente",
      description: "Asistencia CYCLORIVA",
    },
  },
};

// =========================================================
// COMPOSANT PRINCIPAL
// =========================================================

export function HomeServices({ locale, className = "" }: HomeServicesProps) {
  const currentLocale = resolveLocale(locale);
  const content = translations[currentLocale];

  return (
    <section
      aria-label={
        {
          fr: "Services CYCLORIVA",
          en: "CYCLORIVA services",
          de: "CYCLORIVA Serviceleistungen",
          it: "Servizi CYCLORIVA",
          es: "Servicios CYCLORIVA",
        }[currentLocale]
      }
      className={`w-full bg-white py-2 sm:py-3 ${className}`}
    >
      <div className="cycloriva-container">
        <div
          className="
            grid grid-cols-4
            overflow-hidden
            rounded-lg
            border border-[#e8f3e5]
            bg-[#f2faef]
            px-2 py-3
            sm:px-4
            lg:grid-cols-5
          "
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            const translation = content[service.key];

            return (
              <Link
                href={informationPagePath(
                  locale,
                  serviceInformationRoutes[service.key],
                )}
                key={service.key}
                className={`
                  flex min-w-0 items-center
                  justify-center gap-2
                  px-2
                  ${index > 0 ? "border-l border-[#cdd8ca]" : ""}
                  ${index === 3 ? "lg:border-l" : ""}
                  ${index === 4 ? "hidden lg:flex" : ""}
                  lg:gap-3 lg:px-3
                `}
              >
                {/* ICÔNE VERTE */}
                <Icon
                  aria-hidden="true"
                  size={29}
                  strokeWidth={1.8}
                  className="
                    h-6 w-6 shrink-0
                    text-[#24b715]
                    sm:h-7 sm:w-7
                    lg:h-8 lg:w-8
                  "
                />

                {/* TEXTE DU SERVICE */}
                <div className="min-w-0">
                  <h3
                    className="
                      text-[9px] font-extrabold
                      leading-tight text-[#102b39]
                      sm:text-[11px]
                      lg:text-xs
                    "
                  >
                    {translation.title}
                  </h3>

                  <p
                    className="
                      mt-0.5 hidden
                      text-[9px] leading-tight
                      text-slate-600
                      sm:block
                      lg:text-[10px]
                    "
                  >
                    {translation.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HomeServices;
