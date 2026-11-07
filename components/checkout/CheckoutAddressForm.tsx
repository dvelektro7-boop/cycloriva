
"use client";

import {
  useId,
  useMemo,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";

import CheckoutAddressAutocomplete from "./CheckoutAddressAutocomplete";
import type { AddressSuggestion } from "@/lib/checkout-address-suggestions";

import {
  AlertCircle,
  Check,
  ChevronDown,
  House,
  MapPin,
  Mailbox,
} from "lucide-react";

import {
  getCheckoutCountryOptions,
  getCheckoutCountryName,
  getCheckoutPostalCodeExample,
  isCheckoutCountry,
  normalizeCheckoutPostalCode,
  validateCheckoutPostalCode,
  type CheckoutCountryCode,
} from "@/lib/checkout-countries";

import {
  getCheckoutTranslations,
  normalizeCheckoutLocale,
  translateCheckoutError,
  type CheckoutLocale,
} from "@/lib/checkout-i18n";

/**
 * ============================================================
 * CYCLORIVA — FORMULAIRE D'ADRESSE DE LIVRAISON
 * ============================================================
 *
 * Fichier :
 * components/checkout/CheckoutAddressForm.tsx
 *
 * Next.js 16 — React 19 — TypeScript — Tailwind CSS 4
 *
 * DESIGN :
 * - Bleu marine #102b39
 * - Vert CYCLORIVA #109b24
 * - Fond blanc
 * - Bordures discrètes
 * - Responsive PC / mobile
 *
 * FONCTIONNALITÉS :
 * - Sélection des 8 pays de livraison
 * - Drapeaux et noms traduits
 * - Préremplissage possible via géolocalisation IP
 * - Pays modifiable manuellement
 * - Ville
 * - Adresse principale
 * - Complément d'adresse facultatif
 * - Code postal adapté au pays
 * - Validation du format postal
 * - Erreurs traduites
 * - Option de facturation identique
 *
 * SÉCURITÉ :
 * - Aucun accès direct à l'IP
 * - Aucune adresse inventée
 * - Aucun appel de géolocalisation externe
 * - Aucun montant de livraison inventé
 * - Validation définitive côté serveur
 *
 * ============================================================
 */

// ============================================================
// 1. TYPES
// ============================================================

export type CheckoutAddressValue = {
  country: CheckoutCountryCode | "";
  city: string;
  postalCode: string;
  addressLine1: string;
  addressLine2: string;
};

export type CheckoutAddressFormProps = {
  locale: CheckoutLocale | string;

  /**
   * Valeurs contrôlées par CheckoutClient.
   */
  value: CheckoutAddressValue;

  /**
   * Mise à jour d'un champ.
   */
  onChange: (
    nextValue: CheckoutAddressValue
  ) => void;

  /**
   * Appelé lorsqu'un pays change.
   * CheckoutClient invalidera alors
   * le devis serveur précédent.
   */
  onCountryChange?: (
    country: CheckoutCountryCode | ""
  ) => void;

  /**
   * Pays obtenu par checkout-geo.ts.
   * Purement informatif.
   */
  detectedCountry?: CheckoutCountryCode | null;

  /**
   * Indique si le client a choisi
   * manuellement un autre pays.
   */
  countryModified?: boolean;

  /**
   * Erreurs de validation.
   *
   * Clés attendues :
   * - delivery.country
   * - delivery.city
   * - delivery.addressLine1
   * - delivery.addressLine2
   * - delivery.postalCode
   */
  errors?: Record<string, string | undefined>;

  disabled?: boolean;

  /**
   * Le schéma Prisma actuel ne possède pas
   * d'adresse de facturation séparée.
   *
   * L'option est donc cochée et bloquée.
   */
  sameBillingAddress?: boolean;

  showBillingCheckbox?: boolean;

  /**
   * Afficher le bandeau d'information IP.
   */
  showGeoNotice?: boolean;

  /**
   * Afficher le complément d'adresse.
   */
  showAddressLine2?: boolean;

  /**
   * Préfixe d'ID pour éviter les collisions.
   */
  idPrefix?: string;

  className?: string;
};

// ============================================================
// 2. CLASSES CSS
// ============================================================

const CARD_CLASS = [
  "min-w-0",
  "rounded-xl",
  "border",
  "border-[#dce4eb]",
  "bg-white",
  "p-4",
  "shadow-[0_2px_12px_rgba(16,43,57,0.035)]",
  "sm:p-5",
].join(" ");

const LABEL_CLASS = [
  "mb-1.5",
  "block",
  "text-xs",
  "font-bold",
  "text-[#102b39]",
].join(" ");

const INPUT_CLASS = [
  "h-11",
  "w-full",
  "min-w-0",
  "rounded-lg",
  "border",
  "border-[#cbd5df]",
  "bg-white",
  "px-3",
  "text-[13px]",
  "text-[#102b39]",
  "outline-none",
  "transition-colors",
  "placeholder:text-slate-400",
  "focus:border-[#159c27]",
  "focus:ring-2",
  "focus:ring-[#159c27]/15",
  "disabled:cursor-not-allowed",
  "disabled:bg-slate-100",
  "disabled:text-slate-500",
].join(" ");

const INPUT_ERROR_CLASS = [
  "border-red-400",
  "focus:border-red-500",
  "focus:ring-red-500/10",
].join(" ");

// ============================================================
// 3. COMPOSANTS INTERNES
// ============================================================

function RequiredMark() {
  return (
    <span
      aria-hidden="true"
      className="ml-1 text-red-600"
    >
      *
    </span>
  );
}

function FieldError({
  code,
  locale,
  id,
}: {
  code?: string | null;
  locale: CheckoutLocale;
  id: string;
}) {
  if (!code) {
    return null;
  }

  return (
    <p
      id={id}
      role="alert"
      className="mt-1.5 flex items-start gap-1.5 text-[11px] leading-5 text-red-600"
    >
      <AlertCircle
        size={14}
        className="mt-0.5 shrink-0"
        aria-hidden="true"
      />

      <span>
        {translateCheckoutError(code, locale)}
      </span>
    </p>
  );
}

function FormField({
  id,
  label,
  required = false,
  children,
  error,
  locale,
}: {
  id: string;
  label: string;
  required?: boolean;
  children: ReactNode;
  error?: string | null;
  locale: CheckoutLocale;
}) {
  const errorId = `${id}-error`;

  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className={LABEL_CLASS}
      >
        {label}
        {required && <RequiredMark />}
      </label>

      {children}

      <FieldError
        id={errorId}
        code={error}
        locale={locale}
      />
    </div>
  );
}

// ============================================================
// 4. COMPOSANT PRINCIPAL
// ============================================================

export default function CheckoutAddressForm({
  locale: rawLocale,
  value,
  onChange,
  onCountryChange,
  detectedCountry = null,
  countryModified = false,
  errors = {},
  disabled = false,
  sameBillingAddress = true,
  showBillingCheckbox = true,
  showGeoNotice = true,
  showAddressLine2 = true,
  idPrefix,
  className = "",
}: CheckoutAddressFormProps) {
  // ----------------------------------------------------------
  // LANGUE
  // ----------------------------------------------------------

  const locale = normalizeCheckoutLocale(
    rawLocale
  );

  const t = getCheckoutTranslations(locale);

  // ----------------------------------------------------------
  // IDENTIFIANTS
  // ----------------------------------------------------------

  const generatedId = useId();

  const prefix =
    idPrefix ?? `checkout-address-${generatedId}`;

  const ids = {
    country: `${prefix}-country`,
    city: `${prefix}-city`,
    addressLine1: `${prefix}-address-line1`,
    addressLine2: `${prefix}-address-line2`,
    postalCode: `${prefix}-postal-code`,
    billing: `${prefix}-billing`,
  };

  // ----------------------------------------------------------
  // PAYS
  // ----------------------------------------------------------

  const countries = useMemo(
    () => getCheckoutCountryOptions(locale),
    [locale]
  );

  const country =
    value.country &&
    isCheckoutCountry(value.country)
      ? value.country
      : "";

  const postalExample =
    country
      ? getCheckoutPostalCodeExample(
          country
        )
      : t.delivery.postalCodePlaceholder;

  // ----------------------------------------------------------
  // ERREURS
  // ----------------------------------------------------------

  const countryError =
    errors["delivery.country"];

  const cityError =
    errors["delivery.city"];

  const addressLine1Error =
    errors["delivery.addressLine1"];

  const addressLine2Error =
    errors["delivery.addressLine2"];

  const postalCodeError =
    errors["delivery.postalCode"];

  // ----------------------------------------------------------
  // VALIDATION POSTALE AU BLUR
  // ----------------------------------------------------------

  const [postalTouched, setPostalTouched] =
    useState(false);

  const [postalLocalError, setPostalLocalError] =
    useState<string | null>(null);

  const effectivePostalError =
    postalCodeError ??
    (postalTouched
      ? postalLocalError
      : null);

  const postalValid =
    country &&
    value.postalCode.trim()
      ? validateCheckoutPostalCode(
          value.postalCode,
          country
        ).valid
      : false;

  // ----------------------------------------------------------
  // METTRE À JOUR UN CHAMP
  // ----------------------------------------------------------

  function updateField<
    K extends keyof CheckoutAddressValue
  >(
    field: K,
    nextValue: CheckoutAddressValue[K]
  ) {
    if (disabled) {
      return;
    }

    onChange({
      ...value,
      [field]: nextValue,
    });
  }

  // ----------------------------------------------------------
  // CHANGEMENT DE PAYS
  // ----------------------------------------------------------

  function selectAddress(suggestion: AddressSuggestion) {
    if (disabled) return;
    setPostalLocalError(null);
    setPostalTouched(false);
    onChange({ ...value,
      addressLine1: suggestion.addressLine1 || value.addressLine1,
      city: suggestion.city || value.city,
      postalCode: suggestion.postalCode || value.postalCode,
    });
  }

  function handleCountryChange(
    event: ChangeEvent<HTMLSelectElement>
  ) {
    if (disabled) {
      return;
    }

    const raw = event.target.value;

    const nextCountry:
      CheckoutCountryCode | "" =
      isCheckoutCountry(raw) ? raw : "";

    setPostalTouched(false);
    setPostalLocalError(null);

    onChange({
      ...value,
      country: nextCountry,
    });

    onCountryChange?.(nextCountry);
  }

  // ----------------------------------------------------------
  // CHANGEMENT DU CODE POSTAL
  // ----------------------------------------------------------

  function handlePostalChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    setPostalLocalError(null);

    updateField(
      "postalCode",
      event.target.value
    );
  }

  // ----------------------------------------------------------
  // VÉRIFICATION APRÈS SAISIE
  // ----------------------------------------------------------

  function handlePostalBlur() {
    setPostalTouched(true);

    if (!country) {
      setPostalLocalError(
        "CHECKOUT_COUNTRY_NOT_SUPPORTED"
      );
      return;
    }

    const result =
      validateCheckoutPostalCode(
        value.postalCode,
        country
      );

    setPostalLocalError(
      result.valid
        ? null
        : result.error === "REQUIRED"
          ? "POSTAL_CODE_REQUIRED"
          : "INVALID_POSTAL_CODE"
    );

    if (
      result.valid &&
      result.normalized !== value.postalCode
    ) {
      updateField(
        "postalCode",
        normalizeCheckoutPostalCode(
          value.postalCode,
          country
        )
      );
    }
  }

  // ----------------------------------------------------------
  // PAYS DÉTECTÉ
  // ----------------------------------------------------------

  const detected =
    detectedCountry &&
    isCheckoutCountry(detectedCountry)
      ? detectedCountry
      : null;

  const detectedName =
    detected
      ? getCheckoutCountryName(
          detected,
          locale
        )
      : null;

  // ----------------------------------------------------------
  // RENDU
  // ----------------------------------------------------------

  return (
    <div
      className={`min-w-0 ${className}`}
      data-component="checkout-address-form"
    >
      {/* ====================================================
          CARTE DE LIVRAISON
      ==================================================== */}

      <section className={CARD_CLASS}>
        <div className="mb-4 flex items-center gap-2.5">
          <MapPin
            size={24}
            className="shrink-0 text-[#109b24]"
            aria-hidden="true"
          />

          <h2 className="text-base font-extrabold tracking-tight text-[#102b39] sm:text-lg">
            {t.delivery.title}
          </h2>
        </div>

        <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4">
          {/* ================================================
              PAYS DE LIVRAISON
          ================================================ */}

          <FormField
            id={ids.country}
            label={t.delivery.country}
            required
            error={countryError}
            locale={locale}
          >
            <div className="relative">
              <select
                id={ids.country}
                name="country"
                value={country}
                onChange={handleCountryChange}
                disabled={disabled}
                required
                autoComplete="country"
                aria-invalid={Boolean(
                  countryError
                )}
                aria-describedby={
                  countryError
                    ? `${ids.country}-error`
                    : undefined
                }
                className={[
                  INPUT_CLASS,
                  countryError
                    ? INPUT_ERROR_CLASS
                    : "",
                  "appearance-none pr-8",
                ].join(" ")}
              >
                <option value="">
                  {t.delivery.selectCountry}
                </option>

                {countries.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute top-3.5 right-3 text-[#102b39]"
                aria-hidden="true"
              />
            </div>
          </FormField>

          {/* ================================================
              VILLE
          ================================================ */}

          <FormField
            id={ids.city}
            label={t.delivery.city}
            required
            error={cityError}
            locale={locale}
          >
            <div className="relative">
              <MapPin
                size={15}
                className="pointer-events-none absolute top-3.5 left-3 text-[#7c8d9a]"
                aria-hidden="true"
              />

              <input
                id={ids.city}
                name="city"
                type="text"
                value={value.city}
                onChange={(event) =>
                  updateField(
                    "city",
                    event.target.value
                  )
                }
                autoComplete="address-level2"
                maxLength={150}
                required
                disabled={disabled}
                placeholder={
                  t.delivery.cityPlaceholder
                }
                aria-invalid={Boolean(
                  cityError
                )}
                aria-describedby={
                  cityError
                    ? `${ids.city}-error`
                    : undefined
                }
                className={[
                  INPUT_CLASS,
                  "pl-9",
                  cityError
                    ? INPUT_ERROR_CLASS
                    : "",
                ].join(" ")}
              />
            </div>
          </FormField>

          {/* ================================================
              ADRESSE PRINCIPALE
          ================================================ */}

          <div className="col-span-2 checkout-address-street">
            <FormField
              id={ids.addressLine1}
              label={t.delivery.addressLine1}
              required
              error={addressLine1Error}
              locale={locale}
            >
              <div className="relative">
                <House
                  size={16}
                  className="pointer-events-none absolute top-3.5 left-3 text-[#7c8d9a]"
                  aria-hidden="true"
                />

                <CheckoutAddressAutocomplete
                  mode="street" country={country} locale={locale} city={value.city} postalCode={value.postalCode} onSelectAddress={selectAddress}
                  id={ids.addressLine1}
                  name="addressLine1"
                  type="text"
                  value={value.addressLine1}
                  onChange={(event) =>
                    updateField(
                      "addressLine1",
                      event.target.value
                    )
                  }
                  autoComplete="address-line1"
                  maxLength={255}
                  required
                  disabled={disabled}
                  placeholder={
                    t.delivery.addressLine1Placeholder
                  }
                  aria-invalid={Boolean(
                    addressLine1Error
                  )}
                  aria-describedby={
                    addressLine1Error
                      ? `${ids.addressLine1}-error`
                      : undefined
                  }
                  className={[
                    INPUT_CLASS,
                    "pl-9",
                    addressLine1Error
                      ? INPUT_ERROR_CLASS
                      : "",
                  ].join(" ")}
                />
              </div>
            </FormField>
          </div>

          {/* ================================================
              CODE POSTAL
          ================================================ */}

          <div className="col-span-2 sm:col-span-1 checkout-address-postal">
            <FormField
              id={ids.postalCode}
              label={t.delivery.postalCode}
              required
              error={effectivePostalError}
              locale={locale}
            >
              <div className="relative">
                <Mailbox
                  size={16}
                  className="pointer-events-none absolute top-3.5 left-3 text-[#7c8d9a]"
                  aria-hidden="true"
                />

                <CheckoutAddressAutocomplete
                  mode="postal" country={country} locale={locale} onSelectAddress={selectAddress}
                  id={ids.postalCode}
                  name="postalCode"
                  type="text"
                  inputMode="text"
                  value={value.postalCode}
                  onChange={handlePostalChange}
                  onBlur={handlePostalBlur}
                  autoComplete="postal-code"
                  maxLength={32}
                  required
                  disabled={disabled}
                  placeholder={postalExample}
                  aria-invalid={Boolean(
                    effectivePostalError
                  )}
                  aria-describedby={
                    effectivePostalError
                      ? `${ids.postalCode}-error`
                      : undefined
                  }
                  className={[
                    INPUT_CLASS,
                    "pr-9 pl-9",
                    effectivePostalError
                      ? INPUT_ERROR_CLASS
                      : "",
                  ].join(" ")}
                />

                {postalValid &&
                  !effectivePostalError && (
                    <Check
                      size={17}
                      className="pointer-events-none absolute top-3.5 right-3 text-[#109b24]"
                      aria-hidden="true"
                    />
                  )}
              </div>
            </FormField>
          </div>

          {/* ================================================
              COMPLÉMENT D'ADRESSE
          ================================================ */}

          {showAddressLine2 && (
            <details className="col-span-2 checkout-address-complement"><summary className="cursor-pointer text-xs font-semibold text-slate-600">{t.delivery.addressLine2}</summary>
              <FormField
                id={ids.addressLine2}
                label={t.delivery.addressLine2}
                error={addressLine2Error}
                locale={locale}
              >
                <input
                  id={ids.addressLine2}
                  name="addressLine2"
                  type="text"
                  value={value.addressLine2}
                  onChange={(event) =>
                    updateField(
                      "addressLine2",
                      event.target.value
                    )
                  }
                  autoComplete="address-line2"
                  maxLength={255}
                  disabled={disabled}
                  placeholder={
                    t.delivery.addressLine2Placeholder
                  }
                  aria-invalid={Boolean(
                    addressLine2Error
                  )}
                  aria-describedby={
                    addressLine2Error
                      ? `${ids.addressLine2}-error`
                      : undefined
                  }
                  className={INPUT_CLASS}
                />
              </FormField>
            </details>
          )}
        </div>
      </section>

      {/* ====================================================
          ADRESSE DE FACTURATION
      ==================================================== */}

      {showBillingCheckbox && (
        <div className="mt-3 flex items-start gap-2 px-1">
          <label className="flex cursor-not-allowed items-start gap-2">
            <input
              id={ids.billing}
              type="checkbox"
              checked={sameBillingAddress}
              disabled
              readOnly
              aria-label={
                t.delivery.sameBillingAddress
              }
              className="mt-0.5 h-5 w-5 shrink-0 accent-[#109b24]"
            />

            <span className="text-xs leading-5 text-[#102b39] sm:text-[13px]">
              {t.delivery.sameBillingAddress}
            </span>
          </label>
        </div>
      )}

      {/* ====================================================
          PAYS DÉTECTÉ AUTOMATIQUEMENT
      ==================================================== */}

      {showGeoNotice && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#d5eacb] bg-[#edf8e9] p-4">
          <MapPin
            size={23}
            className="mt-0.5 shrink-0 text-[#109b24]"
            aria-hidden="true"
          />

          <div className="min-w-0">
            <p className="text-xs leading-5 font-extrabold text-[#12372c] sm:text-[13px]">
              {detected && detectedName
                ? `${t.geo.detectedTitle} : ${detectedName} (${detected})`
                : t.geo.unavailableTitle}
            </p>

            <p className="mt-1 text-[11px] leading-5 text-[#38634b]">
              {detected
                ? t.geo.detectedDescription
                : t.geo.unavailableDescription}
            </p>

            {countryModified && (
              <p className="mt-1 text-[11px] font-bold text-[#168d29]">
                {t.geo.manuallySelected}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// 5. EXPORT NOMMÉ
// ============================================================

export { CheckoutAddressForm };

// ============================================================
// FIN — CYCLORIVA CHECKOUT ADDRESS FORM
// ============================================================
