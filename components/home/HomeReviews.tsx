"use client";
import Image from "next/image";

import { useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  MessageSquareQuote,
  Star,
  BadgeCheck,
} from "lucide-react";

import { resolveLocale, type SiteLocale } from "@/lib/site-i18n";

// =====================================================
// CYCLORIVA — AVIS CLIENTS DE LA PAGE D'ACCUEIL
// =====================================================
//
// Version PC et mobile fidèle à l'architecture.
//
// - Carte d'avis responsive
// - Étoiles vertes
// - Photo ou initiales du client
// - Flèches de navigation
// - Indicateurs de pagination
// - Cinq langues
// - Aucun avis fictif
// - Aucun avis vérifié sans preuve
//
// Les vrais avis peuvent être fournis au composant
// depuis une base de données ou une source fiable.
//
// =====================================================

// =====================================================
// TYPES
// =====================================================

export type HomeReview = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  avatar?: string | null;
  date?: string;
  verified?: boolean;
};

export type HomeReviewsProps = {
  locale: SiteLocale;
  reviews?: HomeReview[];
  className?: string;
};

// =====================================================
// TRADUCTIONS
// =====================================================

type ReviewTexts = {
  heading: string;
  emptyTitle: string;
  emptyDescription: string;
  verified: string;
  previous: string;
  next: string;
  reviewNumber: string;
  rating: string;
};

const translations: Record<SiteLocale, ReviewTexts> = {
  fr: {
    heading: "Ce que nos clients disent de nous",
    emptyTitle: "Vos avis comptent",
    emptyDescription:
      "Les avis de nos clients seront publiés ici après leur collecte et leur vérification.",
    verified: "Client vérifié",
    previous: "Avis précédent",
    next: "Avis suivant",
    reviewNumber: "Afficher l'avis",
    rating: "Note",
  },

  en: {
    heading: "What our customers say about us",
    emptyTitle: "Your feedback matters",
    emptyDescription:
      "Customer reviews will appear here once they have been collected and verified.",
    verified: "Verified customer",
    previous: "Previous review",
    next: "Next review",
    reviewNumber: "Show review",
    rating: "Rating",
  },

  de: {
    heading: "Das sagen unsere Kunden über uns",
    emptyTitle: "Ihre Meinung zählt",
    emptyDescription:
      "Kundenbewertungen erscheinen hier, sobald sie gesammelt und geprüft wurden.",
    verified: "Verifizierter Kunde",
    previous: "Vorherige Bewertung",
    next: "Nächste Bewertung",
    reviewNumber: "Bewertung anzeigen",
    rating: "Bewertung",
  },

  it: {
    heading: "Cosa dicono i nostri clienti",
    emptyTitle: "La tua opinione conta",
    emptyDescription:
      "Le recensioni dei clienti appariranno qui dopo essere state raccolte e verificate.",
    verified: "Cliente verificato",
    previous: "Recensione precedente",
    next: "Recensione successiva",
    reviewNumber: "Mostra recensione",
    rating: "Valutazione",
  },

  es: {
    heading: "Lo que dicen nuestros clientes",
    emptyTitle: "Tu opinión cuenta",
    emptyDescription:
      "Las opiniones de nuestros clientes aparecerán aquí una vez recopiladas y verificadas.",
    verified: "Cliente verificado",
    previous: "Opinión anterior",
    next: "Opinión siguiente",
    reviewNumber: "Mostrar opinión",
    rating: "Valoración",
  },
};

// =====================================================
// OUTILS
// =====================================================

function clampRating(value: number): number {
  if (!Number.isFinite(value)) return 0;

  return Math.max(0, Math.min(5, Math.round(value)));
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

function formatReviewDate(value: string, locale: SiteLocale): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const localeMap: Record<SiteLocale, string> = {
    fr: "fr-FR",
    en: "en-IE",
    de: "de-DE",
    it: "it-IT",
    es: "es-ES",
  };

  return new Intl.DateTimeFormat(localeMap[locale], {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

// =====================================================
// ÉTOILES DE NOTATION
// =====================================================

function ReviewStars({ rating, label }: { rating: number; label: string }) {
  const normalizedRating = clampRating(rating);

  return (
    <div
      className="flex items-center gap-0.5 text-[#24b715]"
      role="img"
      aria-label={`${label} : ${normalizedRating}/5`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={16}
          strokeWidth={1.5}
          fill={index < normalizedRating ? "currentColor" : "none"}
          className={
            index < normalizedRating ? "text-[#24b715]" : "text-slate-300"
          }
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

// =====================================================
// AVATAR CLIENT
// =====================================================

function ReviewAvatar({ review }: { review: HomeReview }) {
  const [imageError, setImageError] = useState(false);

  const showImage = Boolean(review.avatar && !imageError);

  return (
    <div
      className="
        flex h-12 w-12 shrink-0
        items-center justify-center
        overflow-hidden rounded-full
        border border-slate-200
        bg-[#eaf8e7]
        text-sm font-extrabold text-[#102b39]
        sm:h-14 sm:w-14
      "
    >
      {showImage ? (
        <Image
          width={56}
          height={56}
          sizes="56px"
          unoptimized // Avatars may use arbitrary external URLs; preserve direct loading without broad remotePatterns.
          src={review.avatar!}
          alt=""
          loading="lazy"
          onError={() => setImageError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span aria-hidden="true">{getInitials(review.author)}</span>
      )}
    </div>
  );
}

// =====================================================
// COMPOSANT PRINCIPAL
// =====================================================

export function HomeReviews({
  locale,
  reviews = [],
  className = "",
}: HomeReviewsProps) {
  const currentLocale = resolveLocale(locale);
  const tr = translations[currentLocale];

  const [activeIndex, setActiveIndex] = useState(0);

  const validReviews = reviews.filter(
    (review) =>
      Boolean(review.id.trim()) &&
      Boolean(review.author.trim()) &&
      Boolean(review.comment.trim()) &&
      Number.isFinite(review.rating) &&
      review.rating >= 1 &&
      review.rating <= 5,
  );

  const totalReviews = validReviews.length;

  // Preserve navigation across equivalent arrays and clamp when the list shrinks.
  const safeIndex =
    totalReviews > 0 ? Math.min(activeIndex, totalReviews - 1) : 0;

  const activeReview = totalReviews > 0 ? validReviews[safeIndex] : null;

  const showPrevious = () => {
    setActiveIndex(
      totalReviews > 0 ? (safeIndex - 1 + totalReviews) % totalReviews : 0,
    );
  };

  const showNext = () => {
    setActiveIndex(totalReviews > 0 ? (safeIndex + 1) % totalReviews : 0);
  };

  return (
    <section
      id="home-reviews"
      aria-labelledby="home-reviews-title"
      className={`w-full bg-white py-5 sm:py-7 ${className}`}
    >
      <div className="w-full">
        {/* =========================================
            TITRE DE SECTION
        ========================================= */}

        <div className="mb-4">
          <h2
            id="home-reviews-title"
            className="
              text-xl font-extrabold
              tracking-tight text-[#102b39]
              sm:text-2xl
            "
          >
            {tr.heading}
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
            AUCUN AVIS ENREGISTRÉ
        ========================================= */}

        {totalReviews === 0 ? (
          <div
            className="
              flex min-h-36 flex-col
              items-center justify-center
              rounded-xl border border-slate-200
              bg-white px-5 py-6
              text-center
            "
          >
            <MessageSquareQuote
              size={30}
              strokeWidth={1.5}
              className="mb-2 text-[#24b715]"
              aria-hidden="true"
            />

            <h3 className="text-sm font-bold text-[#102b39]">
              {tr.emptyTitle}
            </h3>

            <p
              className="
                mt-2 max-w-md
                text-xs leading-relaxed
                text-slate-600
              "
            >
              {tr.emptyDescription}
            </p>
          </div>
        ) : (
          <>
            {/* =====================================
                CARTE DE TÉMOIGNAGE
            ===================================== */}

            <div
              className="
                relative flex min-h-36
                items-center
                rounded-xl border
                border-slate-200 bg-white
                px-3 py-4 shadow-sm
                sm:px-5
              "
              aria-live="polite"
              aria-atomic="true"
            >
              {/* FLÈCHE PRÉCÉDENTE */}
              <button
                type="button"
                onClick={showPrevious}
                disabled={totalReviews <= 1}
                aria-label={tr.previous}
                className="
                  flex h-8 w-8 shrink-0
                  items-center justify-center
                  rounded-full border
                  border-slate-200 bg-white
                  text-[#102b39]
                  transition-colors
                  hover:bg-[#f2faef]
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                <ChevronLeft size={19} aria-hidden="true" />
              </button>

              {/* CLIENT ET COMMENTAIRE */}
              {activeReview && (
                <div
                  key={activeReview.id}
                  className="
                    mx-3 flex min-w-0
                    flex-1 items-center
                    gap-3 sm:mx-5 sm:gap-4
                  "
                >
                  {/* PHOTO / INITIALES */}
                  <ReviewAvatar review={activeReview} />

                  {/* INFORMATIONS CLIENT */}
                  <div className="min-w-0 flex-1">
                    {/* ÉTOILES */}
                    <ReviewStars
                      rating={activeReview.rating}
                      label={tr.rating}
                    />

                    {/* COMMENTAIRE */}
                    <blockquote
                      className="
                        mt-1.5 line-clamp-4
                        text-[11px] italic
                        leading-relaxed
                        text-slate-700
                        sm:text-sm
                      "
                    >
                      “{activeReview.comment}”
                    </blockquote>

                    {/* NOM ET VÉRIFICATION */}
                    <div
                      className="
                        mt-2 flex flex-wrap
                        items-center gap-x-3
                        gap-y-1
                      "
                    >
                      <strong
                        className="
                          text-xs font-extrabold
                          text-[#102b39]
                          sm:text-sm
                        "
                      >
                        {activeReview.author}
                      </strong>

                      {activeReview.verified === true && (
                        <span
                          className="
                            inline-flex items-center
                            gap-1 text-[10px]
                            text-[#168e0a]
                          "
                        >
                          <BadgeCheck size={14} aria-hidden="true" />

                          {tr.verified}
                        </span>
                      )}

                      {activeReview.date && (
                        <time
                          dateTime={activeReview.date}
                          className="text-[10px] text-slate-500"
                        >
                          {formatReviewDate(activeReview.date, currentLocale)}
                        </time>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* FLÈCHE SUIVANTE */}
              <button
                type="button"
                onClick={showNext}
                disabled={totalReviews <= 1}
                aria-label={tr.next}
                className="
                  flex h-8 w-8 shrink-0
                  items-center justify-center
                  rounded-full border
                  border-slate-200 bg-white
                  text-[#102b39]
                  transition-colors
                  hover:bg-[#f2faef]
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                <ChevronRight size={19} aria-hidden="true" />
              </button>
            </div>

            {/* =====================================
                INDICATEURS DE NAVIGATION
            ===================================== */}

            {totalReviews > 1 && (
              <div
                className="
                  mt-3 flex items-center
                  justify-center gap-2
                "
                aria-label={tr.heading}
              >
                {validReviews.map((review, index) => (
                  <button
                    key={review.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`${tr.reviewNumber} ${index + 1}`}
                    aria-current={safeIndex === index ? "true" : undefined}
                    className={`
                      h-2 w-2 rounded-full
                      transition-all duration-200
                      ${
                        safeIndex === index
                          ? "bg-[#24b715]"
                          : "bg-slate-300 hover:bg-slate-400"
                      }
                    `}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default HomeReviews;
