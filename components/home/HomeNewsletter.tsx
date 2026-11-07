
"use client";

import {
  useState,
  type FormEvent,
} from "react";

import {
  ArrowRight,
  Mail,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import {
  resolveLocale,
  siteText,
  type SiteLocale,
} from "@/lib/site-i18n";

// =====================================================
// CYCLORIVA — NEWSLETTER PAGE D'ACCUEIL
// =====================================================
//
// Version PC et mobile.
//
// - Fond vert clair
// - Icône enveloppe verte
// - Titre bleu marine
// - Description multilingue
// - Champ e-mail
// - Bouton vert avec flèche
// - Validation du formulaire
// - Gestion des cinq langues
//
// Ce composant n'enregistre pas encore les adresses.
// Le service newsletter sera connecté ultérieurement.
//
// =====================================================

// =====================================================
// TYPES
// =====================================================

type HomeNewsletterProps = {
  locale: SiteLocale;
  className?: string;
};

type NewsletterState =
  | "idle"
  | "invalid"
  | "pending";

type NewsletterTranslation = {
  emailInvalid: string;
  emailRequired: string;
  accessibleTitle: string;
};

// =====================================================
// TRADUCTIONS COMPLÉMENTAIRES
// =====================================================

const translations: Record<
  SiteLocale,
  NewsletterTranslation
> = {
  fr: {
    emailInvalid: "Veuillez saisir une adresse e-mail valide.",
    emailRequired: "Veuillez saisir votre adresse e-mail.",
    accessibleTitle: "Inscription à la newsletter CYCLORIVA",
  },

  en: {
    emailInvalid: "Please enter a valid email address.",
    emailRequired: "Please enter your email address.",
    accessibleTitle: "CYCLORIVA newsletter subscription",
  },

  de: {
    emailInvalid: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
    emailRequired: "Bitte geben Sie Ihre E-Mail-Adresse ein.",
    accessibleTitle: "CYCLORIVA Newsletter-Anmeldung",
  },

  it: {
    emailInvalid: "Inserisci un indirizzo e-mail valido.",
    emailRequired: "Inserisci il tuo indirizzo e-mail.",
    accessibleTitle: "Iscrizione alla newsletter CYCLORIVA",
  },

  es: {
    emailInvalid: "Introduce una dirección de correo válida.",
    emailRequired: "Introduce tu dirección de correo.",
    accessibleTitle: "Suscripción al boletín de CYCLORIVA",
  },
};

// =====================================================
// VALIDATION E-MAIL
// =====================================================

function isValidEmail(value: string): boolean {
  const email = value.trim();

  if (email.length === 0 || email.length > 254) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// =====================================================
// COMPOSANT PRINCIPAL
// =====================================================

export function HomeNewsletter({
  locale,
  className = "",
}: HomeNewsletterProps) {
  const currentLocale = resolveLocale(locale);

  const extra = translations[currentLocale];

  const [email, setEmail] = useState("");
  const [status, setStatus] =
    useState<NewsletterState>("idle");

  const [message, setMessage] = useState("");

  // ===================================================
  // ENVOI DU FORMULAIRE
  // ===================================================

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setStatus("invalid");
      setMessage(extra.emailRequired);
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setStatus("invalid");
      setMessage(extra.emailInvalid);
      return;
    }

    // Aucun envoi réseau n'est effectué.
    // Le branchement au service newsletter est prévu
    // dans une étape ultérieure.
    setStatus("pending");

    setMessage(
      siteText(currentLocale, "newsletterPending")
    );
  }

  // ===================================================
  // AFFICHAGE
  // ===================================================

  return (
    <section
      id="home-newsletter"
      aria-label={extra.accessibleTitle}
      className={`w-full ${className}`}
    >
      <div
        className="
          w-full overflow-hidden
          rounded-xl
          border border-[#e3f4dc]
          bg-[#edf9e8]
          px-4 py-4
          sm:px-5 sm:py-5
          lg:px-6
        "
      >
        <div
          className="
            flex flex-col gap-4
            lg:flex-row
            lg:items-center
            lg:justify-between
            lg:gap-5
          "
        >
          {/* =====================================
              ICÔNE ET DESCRIPTION
          ===================================== */}

          <div
            className="
              flex min-w-0
              items-start gap-3
              lg:flex-1
            "
          >
            {/* ICÔNE ENVELOPPE */}
            <div
              className="
                flex h-10 w-10 shrink-0
                items-center justify-center
                text-[#24b715]
                sm:h-12 sm:w-12
              "
            >
              <Mail
                className="h-9 w-9 sm:h-10 sm:w-10"
                strokeWidth={1.6}
                aria-hidden="true"
              />
            </div>

            {/* TITRE ET DESCRIPTION */}
            <div className="min-w-0 flex-1">
              <h2
                className="
                  text-base font-extrabold
                  leading-tight text-[#102b39]
                  sm:text-lg
                "
              >
                {siteText(
                  currentLocale,
                  "newsletterTitle"
                )}
              </h2>

              <p
                className="
                  mt-1 max-w-md
                  text-[11px] leading-relaxed
                  text-[#334b57]
                  sm:text-xs
                "
              >
                {siteText(
                  currentLocale,
                  "newsletterDescription"
                )}
              </p>
            </div>
          </div>

          {/* =====================================
              FORMULAIRE
          ===================================== */}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="
              flex w-full min-w-0
              flex-col gap-2
              lg:w-[48%]
              lg:max-w-105
            "
          >
            {/* CHAMP E-MAIL ET BOUTON */}
            <div
              className={`
                flex h-11 w-full
                overflow-hidden rounded-lg
                border bg-white
                shadow-sm
                ${
                  status === "invalid"
                    ? "border-red-400"
                    : "border-[#cbd5e1]"
                }
                focus-within:border-[#24b715]
                focus-within:ring-2
                focus-within:ring-[#24b715]/15
              `}
            >
              <input
                type="email"
                name="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setStatus("idle");
                  setMessage("");
                }}
                autoComplete="email"
                inputMode="email"
                maxLength={254}
                aria-label={siteText(
                  currentLocale,
                  "email"
                )}
                aria-invalid={
                  status === "invalid"
                }
                aria-describedby={
                  message
                    ? "home-newsletter-message"
                    : undefined
                }
                placeholder={siteText(
                  currentLocale,
                  "email"
                )}
                className="
                  min-w-0 flex-1
                  bg-transparent px-3
                  text-xs text-[#102b39]
                  outline-none
                  placeholder:text-slate-400
                  sm:px-4 sm:text-sm
                "
              />

              <button
                type="submit"
                aria-label={siteText(
                  currentLocale,
                  "subscribe"
                )}
                title={siteText(
                  currentLocale,
                  "subscribe"
                )}
                className="
                  flex h-full w-12
                  shrink-0 items-center
                  justify-center
                  bg-[#24b715]
                  text-white
                  transition-colors
                  hover:bg-[#168e0a]
                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-[#24b715]
                "
              >
                <ArrowRight
                  size={20}
                  strokeWidth={2.2}
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* =================================
                MESSAGE DU FORMULAIRE
            ================================= */}

            {message && (
              <div
                id="home-newsletter-message"
                role={
                  status === "invalid"
                    ? "alert"
                    : "status"
                }
                aria-live="polite"
                className={`
                  flex items-start gap-2
                  rounded-md px-2 py-2
                  text-[11px] leading-relaxed
                  ${
                    status === "invalid"
                      ? "bg-red-50 text-red-700"
                      : "bg-white/75 text-[#27651f]"
                  }
                `}
              >
                {status === "invalid" ? (
                  <AlertCircle
                    size={15}
                    className="mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                ) : (
                  <CheckCircle2
                    size={15}
                    className="mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                )}

                <span>{message}</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

export default HomeNewsletter;
