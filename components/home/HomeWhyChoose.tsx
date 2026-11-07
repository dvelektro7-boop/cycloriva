import Image from "next/image";

import {
  Leaf,
  BadgeCheck,
  Headset,
  Globe2,
  type LucideIcon,
} from "lucide-react";

import { resolveLocale, type SiteLocale } from "@/lib/site-i18n";

// =====================================================
// CYCLORIVA — POURQUOI CHOISIR CYCLORIVA ?
// =====================================================
//
// Architecture officielle PC et mobile.
//
// PC :
// - Titre à gauche
// - 4 avantages horizontaux
// - Image des deux cyclistes à droite
//
// Mobile :
// - Titre en haut
// - 4 avantages compacts sur une ligne
// - Adaptation aux petits écrans
//
// Image officielle : /images/accueil.png
//
// Langues : FR, EN, DE, IT, ES
//
// =====================================================

// =====================================================
// TYPES
// =====================================================

type BenefitKey = "mobility" | "selection" | "expert" | "europe";

type Benefit = {
  key: BenefitKey;
  icon: LucideIcon;
};

type BenefitTranslation = {
  title: string;
  description: string;
};

type WhyChooseTranslation = {
  heading: string;
  imageAlt: string;
  benefits: Record<BenefitKey, BenefitTranslation>;
};

type HomeWhyChooseProps = {
  locale: SiteLocale;
  className?: string;
};

// =====================================================
// CONFIGURATION DES QUATRE AVANTAGES
// =====================================================

const benefits: Benefit[] = [
  {
    key: "mobility",
    icon: Leaf,
  },
  {
    key: "selection",
    icon: BadgeCheck,
  },
  {
    key: "expert",
    icon: Headset,
  },
  {
    key: "europe",
    icon: Globe2,
  },
];

// =====================================================
// TRADUCTIONS
// =====================================================

const translations: Record<SiteLocale, WhyChooseTranslation> = {
  fr: {
    heading: "Pourquoi choisir CYCLORIVA ?",
    imageAlt: "Deux cyclistes profitant d'une sortie à vélo",
    benefits: {
      mobility: {
        title: "Mobilité durable",
        description:
          "Des solutions de mobilité pour vos déplacements quotidiens.",
      },
      selection: {
        title: "Sélection de vélos",
        description:
          "Découvrez nos vélos et accessoires pour différents usages.",
      },
      expert: {
        title: "Un accompagnement",
        description: "Des informations pour vous aider à choisir votre vélo.",
      },
      europe: {
        title: "Présence en Europe",
        description:
          "Une boutique destinée aux cyclistes de plusieurs pays européens.",
      },
    },
  },

  en: {
    heading: "Why choose CYCLORIVA?",
    imageAlt: "Two cyclists enjoying a bike ride",
    benefits: {
      mobility: {
        title: "Sustainable mobility",
        description: "Mobility solutions for your everyday journeys.",
      },
      selection: {
        title: "Bike selection",
        description: "Explore bikes and accessories for different uses.",
      },
      expert: {
        title: "Helpful guidance",
        description: "Information to help you choose your bicycle.",
      },
      europe: {
        title: "Across Europe",
        description:
          "A shop designed for cyclists in several European countries.",
      },
    },
  },

  de: {
    heading: "Warum CYCLORIVA wählen?",
    imageAlt: "Zwei Radfahrer bei einer gemeinsamen Fahrradtour",
    benefits: {
      mobility: {
        title: "Nachhaltige Mobilität",
        description: "Mobilitätslösungen für Ihre täglichen Wege.",
      },
      selection: {
        title: "Fahrradauswahl",
        description:
          "Entdecken Sie Fahrräder und Zubehör für verschiedene Einsatzzwecke.",
      },
      expert: {
        title: "Hilfreiche Beratung",
        description:
          "Informationen, die Ihnen bei der Wahl Ihres Fahrrads helfen.",
      },
      europe: {
        title: "In Europa",
        description: "Ein Shop für Radfahrer in mehreren europäischen Ländern.",
      },
    },
  },

  it: {
    heading: "Perché scegliere CYCLORIVA?",
    imageAlt: "Due ciclisti durante una piacevole passeggiata in bicicletta",
    benefits: {
      mobility: {
        title: "Mobilità sostenibile",
        description: "Soluzioni di mobilità per gli spostamenti quotidiani.",
      },
      selection: {
        title: "Selezione di biciclette",
        description: "Scopri biciclette e accessori per diverse esigenze.",
      },
      expert: {
        title: "Supporto nella scelta",
        description: "Informazioni utili per scegliere la tua bicicletta.",
      },
      europe: {
        title: "In Europa",
        description:
          "Un negozio pensato per i ciclisti di diversi paesi europei.",
      },
    },
  },

  es: {
    heading: "¿Por qué elegir CYCLORIVA?",
    imageAlt: "Dos ciclistas disfrutando de un paseo en bicicleta",
    benefits: {
      mobility: {
        title: "Movilidad sostenible",
        description:
          "Soluciones de movilidad para tus desplazamientos diarios.",
      },
      selection: {
        title: "Selección de bicicletas",
        description:
          "Descubre bicicletas y accesorios para diferentes necesidades.",
      },
      expert: {
        title: "Ayuda para elegir",
        description: "Información útil para ayudarte a elegir tu bicicleta.",
      },
      europe: {
        title: "En Europa",
        description:
          "Una tienda dirigida a ciclistas de varios países europeos.",
      },
    },
  },
};

// =====================================================
// COMPOSANT PRINCIPAL
// =====================================================

export function HomeWhyChoose({ locale, className = "" }: HomeWhyChooseProps) {
  const currentLocale = resolveLocale(locale);

  const content = translations[currentLocale];

  return (
    <section
      id="why-choose-cycloriva"
      aria-labelledby="why-choose-title"
      className={`w-full bg-white py-5 sm:py-7 ${className}`}
    >
      <div className="cycloriva-container">
        {/* =========================================
            TITRE PRINCIPAL
        ========================================= */}

        <div className="mb-4 sm:mb-5">
          <h2
            id="why-choose-title"
            className="
              text-xl font-extrabold
              tracking-tight text-[#102b39]
              sm:text-2xl
            "
          >
            {content.heading}
          </h2>

          <div
            aria-hidden="true"
            className="
              mt-1.5 h-0.75 w-9
              rounded-full bg-[#24b715]
            "
          />
        </div>

        {/* =========================================
            CONTENU PRINCIPAL
        ========================================= */}

        <div
          className="
            grid grid-cols-1
            gap-4
            xl:grid-cols-[minmax(0,1fr)_330px]
            xl:items-center
            xl:gap-6
          "
        >
          {/* =======================================
              QUATRE AVANTAGES
          ======================================= */}

          <div
            className="
              grid grid-cols-4
              gap-0
              rounded-lg bg-white
            "
          >
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;

              const translation = content.benefits[benefit.key];

              return (
                <div
                  key={benefit.key}
                  className={`
                    flex min-w-0
                    flex-col gap-2
                    px-2 py-2
                    sm:flex-row
                    sm:items-start
                    sm:gap-3
                    sm:px-4
                    ${index > 0 ? "border-l border-slate-200" : ""}
                  `}
                >
                  {/* ICÔNE */}
                  <div className="shrink-0">
                    <Icon
                      size={29}
                      strokeWidth={1.7}
                      aria-hidden="true"
                      className="
                        h-6 w-6 text-[#24b715]
                        sm:h-8 sm:w-8
                      "
                    />
                  </div>

                  {/* TEXTE */}
                  <div className="min-w-0">
                    <h3
                      className="
                        text-[10px] font-extrabold
                        leading-tight text-[#102b39]
                        sm:text-xs
                        lg:text-sm
                      "
                    >
                      {translation.title}
                    </h3>

                    <p
                      className="
                        mt-1 text-[9px]
                        leading-snug text-slate-600
                        sm:text-[10px]
                        lg:text-xs
                      "
                    >
                      {translation.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* =======================================
              IMAGE OFFICIELLE
          ======================================= */}

          <div
            className="
              hidden overflow-hidden
              rounded-lg bg-[#f3f7f9]
              xl:block
            "
          >
            <Image
              sizes="33vw"
              src="/images/accueil.png"
              alt={content.imageAlt}
              loading="lazy"
              decoding="async"
              width={660}
              height={260}
              className="
                h-32 w-full
                object-cover object-center
                transition-transform duration-300
                hover:scale-105
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeWhyChoose;
