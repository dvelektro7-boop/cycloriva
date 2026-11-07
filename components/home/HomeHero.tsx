import Image from "next/image";

import Link from "next/link";
import "./HomeHero.css";

import { ArrowRight, Zap, ShieldCheck, Leaf } from "lucide-react";

import { getHomeTranslations } from "@/lib/home-i18n";

import { resolveLocale, type SiteLocale } from "@/lib/site-i18n";

// =====================================================
// CYCLORIVA — COUVERTURE OFFICIELLE DE L'ACCUEIL
// =====================================================
//
// Next.js 16 • TypeScript • Tailwind CSS 4
//
// Image : /images/couverture.png
//
// PC :
// - Grand bandeau horizontal
// - Textes et boutons à gauche
// - Vélo visible sur la droite
// - Trois avantages sur la droite
//
// Mobile :
// - Titre sur plusieurs lignes
// - Image adaptée à la largeur
// - Boutons superposés
// - Avantages compacts sur la droite
//
// Traductions : FR, EN, DE, IT, ES
//
// =====================================================

// =====================================================
// TYPES
// =====================================================

type HomeHeroProps = {
  locale: SiteLocale;
  className?: string;
};

// =====================================================
// COMPOSANT PRINCIPAL
// =====================================================

export function HomeHero({ locale, className = "" }: HomeHeroProps) {
  const currentLocale = resolveLocale(locale);

  const text = getHomeTranslations(currentLocale).hero;

  const electricBikesUrl = `/${currentLocale}/produits?q=${encodeURIComponent(
    "électrique",
  )}`;

  const categoriesUrl = "#categories";

  const benefits = [
    {
      key: "performance",
      label: text.performance,
      icon: Zap,
    },
    {
      key: "reliable",
      label: text.reliable,
      icon: ShieldCheck,
    },
    {
      key: "durable",
      label: text.durable,
      icon: Leaf,
    },
  ];

  return (
    <section
      id="home-hero"
      aria-labelledby="home-hero-title"
      className={`
        relative isolate w-full
        overflow-hidden
        bg-[#102b39]
        text-white
        ${className}
      `}
    >
      {/* =================================================
          IMAGE DE COUVERTURE OFFICIELLE
      ================================================= */}

      <div aria-hidden="true" className="absolute inset-0 z-0">
        <Image
          fill
          sizes="100vw"
          loading="eager"
          src="/images/couverture.png"
          alt=""
          fetchPriority="high"
          decoding="async"
          className="
            h-full w-full
            object-cover
            object-[60%_center]
            sm:object-center
          "
        />
      </div>

      {/* =================================================
          VOILE POUR LA LISIBILITÉ DU TEXTE
      ================================================= */}

      <div
        aria-hidden="true"
        className="
          absolute inset-0 z-0
          bg-linear-to-r
          from-[#061b2d]/95
          via-[#102b39]/80
          to-[#102b39]/10
          sm:from-[#061b2d]/90
          sm:via-[#102b39]/45
          sm:to-transparent
          lg:from-[#061b2d]/75
          lg:via-[#102b39]/25
        "
      />

      {/* =================================================
          CONTENU PRINCIPAL
      ================================================= */}

      <div
        className={`
          cycloriva-container
          relative z-10
          flex min-h-112 flex-col
          justify-center
          py-7
          sm:min-h-110
          sm:py-10
          lg:min-h-88
          lg:py-10
          xl:min-h-100
          cycloriva-hero-content
        `}
      >
        <div
          className={`
            grid grid-cols-1
            gap-5
            lg:grid-cols-[minmax(0,1fr)_220px]
            lg:items-center
            lg:gap-6
            cycloriva-hero-layout
          `}
        >
          {/* =============================================
              TEXTE DE GAUCHE
          ============================================= */}

          <div
            className={`
              relative max-w-150
              lg:max-w-165
              cycloriva-hero-copy
            `}
          >
            {/* PETIT TITRE */}
            <div
              className={`
                mb-3 flex items-center
                gap-2
                cycloriva-hero-eyebrow
              `}
            >
              <span
                aria-hidden="true"
                className="
                  h-0.75 w-7
                  shrink-0 bg-[#8ce900]
                "
              />

              <p
                className="
                  text-[10px] font-bold
                  uppercase tracking-wide
                  text-white
                  sm:text-xs
                "
              >
                {text.eyebrow}
              </p>
            </div>

            {/* GRAND TITRE */}
            <h1
              id="home-hero-title"
              className={`
                max-w-145
                text-[30px] font-black
                leading-[1.08]
                tracking-tight
                text-white
                sm:text-4xl
                lg:text-[43px]
                xl:text-[48px]
                cycloriva-hero-title
              `}
            >
              <span className="block">{text.titleLine1}</span>

              <span className="block">
                {text.titleLine2}{" "}
                <span className={`text-[#8ce900] cycloriva-hero-highlight`}>
                  {text.titleHighlight}
                </span>
              </span>
            </h1>

            {/* DESCRIPTIONS */}
            <div
              className={`
                mt-4 max-w-125
                text-[12px]
                leading-relaxed
                text-white/95
                sm:text-sm
                cycloriva-hero-description
              `}
            >
              <p>{text.description}</p>

              <p className="mt-1">{text.secondaryDescription}</p>
            </div>

            {/* =========================================
                BOUTONS DE NAVIGATION
            ========================================= */}

            <div
              className={`
                mt-5 flex w-full
                max-w-95 flex-col gap-2.5
                sm:max-w-none
                sm:flex-row sm:flex-wrap
                sm:gap-3
                cycloriva-hero-buttons
              `}
            >
              {/* BOUTON PRINCIPAL */}
              <Link
                href={electricBikesUrl}
                className="
                  inline-flex min-h-11
                  items-center justify-center
                  gap-3 rounded-lg
                  bg-[#8ce900]
                  px-5 py-3
                  text-center text-xs
                  font-extrabold
                  text-[#102b39]
                  shadow-sm
                  transition-colors
                  hover:bg-[#a3fa35]
                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-white
                  sm:text-sm
                "
              >
                <span>{text.discover}</span>

                <ArrowRight size={18} strokeWidth={2.3} aria-hidden="true" />
              </Link>

              {/* BOUTON SECONDAIRE */}
              <Link
                href={categoriesUrl}
                className="
                  inline-flex min-h-11
                  items-center justify-center
                  rounded-lg
                  border border-white
                  bg-[#102b39]/35
                  px-5 py-3
                  text-center text-xs
                  font-bold text-white
                  backdrop-blur-sm
                  transition-colors
                  hover:bg-white/15
                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-white
                  sm:text-sm
                "
              >
                {text.viewCategories}
              </Link>
            </div>
          </div>

          {/* =============================================
              AVANTAGES À DROITE
          ============================================= */}

          <div
            className={`
              ml-auto flex w-fit
              min-w-35 flex-col
              gap-3
              rounded-xl
              bg-[#071c2a]/75
              px-3 py-3
              backdrop-blur-sm
              sm:min-w-42
              lg:gap-5
              lg:px-4 lg:py-5
              cycloriva-hero-benefits
            `}
          >
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.key}
                  className="
                    flex items-center
                    gap-3
                  "
                >
                  <Icon
                    size={25}
                    strokeWidth={1.8}
                    className="
                      h-6 w-6 shrink-0
                      text-[#8ce900]
                      lg:h-7 lg:w-7
                    "
                    aria-hidden="true"
                  />

                  <span
                    className="
                      text-[11px]
                      font-semibold
                      text-white
                      sm:text-xs
                    "
                  >
                    {benefit.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* =================================================
            INDICATEURS VISUELS DU BANDEAU
        ================================================= */}

        <div
          className="
            absolute bottom-3
            left-1/2 flex
            -translate-x-1/2
            items-center gap-1.5
          "
          aria-hidden="true"
        >
          <span className="h-2 w-2 rounded-full bg-[#8ce900]" />
          <span className="h-2 w-2 rounded-full bg-white/90" />
          <span className="h-2 w-2 rounded-full bg-white/90" />
        </div>
      </div>
    </section>
  );
}

export default HomeHero;
