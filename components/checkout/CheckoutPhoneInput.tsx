
"use client";

import {
  useId,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";

import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Phone,
} from "lucide-react";

import {
  getCheckoutDialCode,
  getCheckoutPhoneCountryOptions,
  isCheckoutCountry,
  type CheckoutCountryCode,
} from "@/lib/checkout-countries";

import {
  getCheckoutTranslations,
  normalizeCheckoutLocale,
  translateCheckoutError,
  type CheckoutLocale,
} from "@/lib/checkout-i18n";

import {
  validateCheckoutPhone,
} from "@/lib/checkout-validation";

/**
 * ============================================================
 * CYCLORIVA — CHAMP DE TÉLÉPHONE INTERNATIONAL
 * ============================================================
 *
 * FICHIER :
 * components/checkout/CheckoutPhoneInput.tsx
 *
 * TECHNOLOGIES :
 * - Next.js 16
 * - React 19
 * - TypeScript
 * - Tailwind CSS 4
 * - libphonenumber-js
 *
 * IDENTITÉ VISUELLE :
 * - Bleu marine : #102b39
 * - Vert CYCLORIVA : #109b24
 * - Fond blanc
 * - Bordures fines
 *
 * FONCTIONNALITÉS :
 * - Sélecteur de pays avec drapeau
 * - Indicatif international automatique
 * - Huit pays disponibles
 * - Champ de numéro indépendant
 * - Validation téléphonique internationale
 * - Messages d'erreur traduits
 * - Accessibilité clavier
 * - Responsive mobile et ordinateur
 *
 * SÉCURITÉ :
 * - Aucune transmission de données réseau
 * - Aucune sauvegarde du numéro dans le navigateur
 * - Aucune géolocalisation exécutée ici
 * - Aucune suppression manuelle des zéros
 * - Validation définitive côté serveur
 *
 * ============================================================
 */

// ============================================================
// 1. TYPES
// ============================================================

export type CheckoutPhoneCountry =
  CheckoutCountryCode | "";

export type CheckoutPhoneInputProps = {
  /**
   * Langue actuelle de la boutique.
   */
  locale: CheckoutLocale | string;

  /**
   * Pays du numéro sélectionné.
   *
   * Exemple : FR, DE, IT, CH.
   *
   * Peut être initialisé dans CheckoutClient
   * avec le pays proposé par checkout-geo.ts.
   */
  phoneCountry: CheckoutPhoneCountry;

  /**
   * Numéro saisi par le client.
   *
   * Sans indicatif imposé dans le champ.
   */
  phoneNational: string;

  /**
   * Appelé quand le pays téléphonique change.
   */
  onPhoneCountryChange: (
    country: CheckoutPhoneCountry
  ) => void;

  /**
   * Appelé quand le numéro change.
   */
  onPhoneNationalChange: (
    value: string
  ) => void;

  /**
   * Interdit les modifications pendant
   * l'enregistrement de la commande.
   */
  disabled?: boolean;

  /**
   * Champ obligatoire.
   */
  required?: boolean;

  /**
   * Erreur de pays retournée par la validation.
   */
  countryError?: string | null;

  /**
   * Erreur du numéro retournée par la validation.
   */
  phoneError?: string | null;

  /**
   * Validation légère au départ du champ.
   */
  validateOnBlur?: boolean;

  /**
   * Affichage d'un message d'aide.
   */
  showHelp?: boolean;

  /**
   * Identifiants HTML personnalisables.
   */
  countryId?: string;
  phoneId?: string;

  /**
   * Classes du conteneur.
   */
  className?: string;
};

// ============================================================
// 2. CONSTANTES VISUELLES
// ============================================================

const BASE_INPUT_CLASS = [
  "h-11",
  "min-w-0",
  "rounded-lg",
  "border",
  "bg-white",
  "text-[13px]",
  "font-medium",
  "text-[#102b39]",
  "outline-none",
  "transition-colors",
  "duration-150",
  "focus:border-[#159c27]",
  "focus:ring-2",
  "focus:ring-[#159c27]/15",
  "disabled:cursor-not-allowed",
  "disabled:bg-slate-100",
  "disabled:text-slate-500",
].join(" ");

const NORMAL_BORDER =
  "border-[#cbd5df]";

const ERROR_BORDER =
  "border-red-400 focus:border-red-500 focus:ring-red-500/10";

// ============================================================
// 3. GESTION DES ERREURS
// ============================================================

function getLocalizedError(
  errorCode: string | null | undefined,
  locale: CheckoutLocale
): string | null {
  if (!errorCode) {
    return null;
  }

  return translateCheckoutError(
    errorCode,
    locale
  );
}

// ============================================================
// 4. COMPOSANT PRINCIPAL
// ============================================================

export default function CheckoutPhoneInput({
  locale: rawLocale,
  phoneCountry,
  phoneNational,
  onPhoneCountryChange,
  onPhoneNationalChange,
  disabled = false,
  required = true,
  countryError = null,
  phoneError = null,
  validateOnBlur = true,
  showHelp = false,
  countryId,
  phoneId,
  className = "",
}: CheckoutPhoneInputProps) {
  // ----------------------------------------------------------
  // LANGUE
  // ----------------------------------------------------------

  const locale =
    normalizeCheckoutLocale(rawLocale);

  const t =
    getCheckoutTranslations(locale);

  // ----------------------------------------------------------
  // IDENTIFIANTS ACCESSIBLES
  // ----------------------------------------------------------

  const generatedId = useId();

  const selectId =
    countryId ??
    `checkout-phone-country-${generatedId}`;

  const inputId =
    phoneId ??
    `checkout-phone-number-${generatedId}`;

  const errorId =
    `checkout-phone-error-${generatedId}`;

  const helpId =
    `checkout-phone-help-${generatedId}`;

  // ----------------------------------------------------------
  // OPTIONS RÉELLES
  // ----------------------------------------------------------

  const countries = useMemo(
    () => getCheckoutPhoneCountryOptions(locale),
    [locale]
  );

  // ----------------------------------------------------------
  // INDICATIF ACTUEL
  // ----------------------------------------------------------

  const dialCode =
    phoneCountry &&
    isCheckoutCountry(phoneCountry)
      ? getCheckoutDialCode(phoneCountry)
      : "";

  const selectedOption =
    countries.find(
      (option) =>
        option.value === phoneCountry
    ) ?? null;

  // ----------------------------------------------------------
  // VALIDATION LOCALE OPTIONNELLE
  // ----------------------------------------------------------

  const [touched, setTouched] =
    useState(false);

  const [locallyValidated, setLocallyValidated] =
    useState(false);

  const [localError, setLocalError] =
    useState<string | null>(null);

  const effectiveError =
    countryError ??
    phoneError ??
    (touched ? localError : null);

  const translatedError =
    getLocalizedError(
      effectiveError,
      locale
    );

  // ----------------------------------------------------------
  // CHANGEMENT DU PAYS
  // ----------------------------------------------------------

  function handleCountryChange(
    event: ChangeEvent<HTMLSelectElement>
  ) {
    if (disabled) {
      return;
    }

    const nextValue =
      event.target.value;

    const nextCountry:
      CheckoutPhoneCountry =
      isCheckoutCountry(nextValue)
        ? nextValue
        : "";

    setTouched(false);
    setLocallyValidated(false);
    setLocalError(null);

    onPhoneCountryChange(nextCountry);

    /**
     * Nous ne modifions pas le numéro saisi.
     *
     * Le client peut utiliser un numéro français
     * pour une livraison en Allemagne.
     */
  }

  // ----------------------------------------------------------
  // CHANGEMENT DU NUMÉRO
  // ----------------------------------------------------------

  function handlePhoneChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    if (disabled) {
      return;
    }

    const nextValue =
      event.target.value;

    setLocallyValidated(false);
    setLocalError(null);

    onPhoneNationalChange(nextValue);
  }

  // ----------------------------------------------------------
  // VALIDATION AU BLUR
  // ----------------------------------------------------------

  function handlePhoneBlur() {
    if (
      disabled ||
      !validateOnBlur
    ) {
      return;
    }

    setTouched(true);

    if (!phoneCountry) {
      setLocallyValidated(false);
      setLocalError(
        "INVALID_PHONE_INPUT"
      );
      return;
    }

    if (!phoneNational.trim()) {
      setLocallyValidated(false);
      setLocalError(
        required
          ? "PHONE_REQUIRED"
          : null
      );
      return;
    }

    const result =
      validateCheckoutPhone(
        phoneNational,
        phoneCountry
      );

    setLocallyValidated(
      result.valid
    );

    setLocalError(
      result.error
    );
  }

  // ----------------------------------------------------------
  // ÉTAT VISUEL
  // ----------------------------------------------------------

  const hasError =
    Boolean(translatedError);

  const showValid =
    !hasError &&
    locallyValidated &&
    Boolean(phoneNational.trim());

  // ----------------------------------------------------------
  // RENDU
  // ----------------------------------------------------------

  return (
    <div
      className={`min-w-0 ${className}`}
      data-component="checkout-phone-input"
    >
      {/* ====================================================
          TITRE
      ==================================================== */}

      <label
        htmlFor={inputId}
        className="mb-1.5 block text-xs font-bold text-[#102b39]"
      >
        {t.customer.phone}

        {required && (
          <span
            aria-hidden="true"
            className="ml-1 text-red-600"
          >
            *
          </span>
        )}
      </label>

      {/* ====================================================
          SÉLECTEUR + NUMÉRO
      ==================================================== */}

      <div className="flex w-full min-w-0 items-stretch gap-2">

        {/* --------------------------------------------------
            PAYS ET INDICATIF
        -------------------------------------------------- */}

        <div className="relative w-28 shrink-0 sm:w-33">
          <label
            htmlFor={selectId}
            className="sr-only"
          >
            {t.customer.phoneCountry}
          </label>

          <select
            id={selectId}
            name="phoneCountry"
            value={phoneCountry}
            onChange={handleCountryChange}
            disabled={disabled}
            required={required}
            aria-invalid={
              Boolean(countryError)
            }
            aria-describedby={
              translatedError
                ? errorId
                : undefined
            }
            className={[
              BASE_INPUT_CLASS,
              hasError && countryError
                ? ERROR_BORDER
                : NORMAL_BORDER,
              "w-full",
              "appearance-none",
              "cursor-pointer",
              "pr-7",
              "pl-2",
              "text-[12px]",
              "sm:pl-3",
              "sm:text-[13px]",
            ].join(" ")}
          >
            <option value="">
              {t.customer.phoneDialCode}
            </option>

            {countries.map((country) => (
              <option
                key={country.value}
                value={country.value}
              >
                {country.flag}{" "}
                {country.dialCode}
              </option>
            ))}
          </select>

          <ChevronDown
            size={15}
            strokeWidth={2}
            aria-hidden="true"
            className="pointer-events-none absolute top-3.5 right-2 text-[#102b39]"
          />
        </div>

        {/* --------------------------------------------------
            CHAMP DU NUMÉRO
        -------------------------------------------------- */}

        <div className="relative min-w-0 flex-1">
          <input
            id={inputId}
            name="phoneNational"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            value={phoneNational}
            onChange={handlePhoneChange}
            onBlur={handlePhoneBlur}
            maxLength={40}
            required={required}
            disabled={disabled}
            placeholder={
              t.customer.phonePlaceholder
            }
            aria-invalid={hasError}
            aria-describedby={
              translatedError
                ? errorId
                : showHelp
                  ? helpId
                  : undefined
            }
            className={[
              BASE_INPUT_CLASS,
              hasError
                ? ERROR_BORDER
                : NORMAL_BORDER,
              "w-full",
              "pr-9",
              "pl-3",
              "placeholder:font-normal",
              "placeholder:text-slate-400",
            ].join(" ")}
          />

          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-3 flex items-center"
          >
            {showValid ? (
              <CheckCircle2
                size={17}
                className="text-[#109b24]"
              />
            ) : (
              <Phone
                size={16}
                className="text-slate-400"
              />
            )}
          </span>
        </div>
      </div>

      {/* ====================================================
          INDICATIF / INFORMATION D'AIDE
      ==================================================== */}

      {showHelp && !translatedError && (
        <div
          id={helpId}
          className="mt-1.5 text-[11px] leading-5 text-[#617380]"
        >
          {selectedOption ? (
            <span>
              {selectedOption.flag}{" "}
              {selectedOption.countryName}{" "}
              <strong className="text-[#102b39]">
                {dialCode}
              </strong>
              {" · "}
              {t.customer.phoneHelp}
            </span>
          ) : (
            <span>
              {t.customer.phoneHelp}
            </span>
          )}
        </div>
      )}

      {/* ====================================================
          ERREUR TRADUITE
      ==================================================== */}

      {translatedError && (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 flex items-start gap-1.5 text-[11px] leading-5 text-red-600"
        >
          <AlertCircle
            size={14}
            aria-hidden="true"
            className="mt-0.5 shrink-0"
          />

          <span>{translatedError}</span>
        </p>
      )}
    </div>
  );
}

// ============================================================
// 5. EXPORT NOMMÉ
// ============================================================

export { CheckoutPhoneInput };

// ============================================================
// FIN — CYCLORIVA CHECKOUT PHONE INPUT
// ============================================================
