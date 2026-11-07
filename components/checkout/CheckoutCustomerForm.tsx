
"use client";

import {
  useId,
  type ChangeEvent,
  type ReactNode,
} from "react";

import {
  AlertCircle,
  Mail,
  UserRound,
} from "lucide-react";

import CheckoutPhoneInput from "@/components/checkout/CheckoutPhoneInput";

import type {
  CheckoutCountryCode,
} from "@/lib/checkout-countries";

import {
  getCheckoutTranslations,
  normalizeCheckoutLocale,
  translateCheckoutError,
  type CheckoutLocale,
} from "@/lib/checkout-i18n";

/**
 * ============================================================
 * CYCLORIVA — FORMULAIRE INFORMATIONS PERSONNELLES
 * ============================================================
 *
 * FICHIER :
 * components/checkout/CheckoutCustomerForm.tsx
 *
 * TECHNOLOGIES :
 * - Next.js 16
 * - React 19
 * - TypeScript
 * - Tailwind CSS 4
 *
 * IDENTITÉ VISUELLE :
 * - Bleu marine : #102b39
 * - Vert CYCLORIVA : #109b24
 * - Blanc
 * - Bordures fines et discrètes
 * - Mise en page responsive
 *
 * RESPONSABILITÉS :
 * - Saisie du prénom
 * - Saisie du nom
 * - Saisie de l'adresse e-mail
 * - Téléphone international
 * - Sélecteur de drapeau et indicatif
 * - Erreurs traduites
 * - États désactivés
 * - Accessibilité clavier
 *
 * SÉCURITÉ :
 * - Aucun appel réseau
 * - Aucune sauvegarde des coordonnées
 * - Aucun stockage local des données personnelles
 * - Aucun paiement déclenché
 * - Aucune commande créée ici
 *
 * Les données sont gérées par CheckoutClient.
 *
 * ============================================================
 */

// ============================================================
// 1. TYPES
// ============================================================

export type CheckoutCustomerFormValue = {
  firstName: string;

  lastName: string;

  email: string;

  phoneCountry: CheckoutCountryCode | "";

  phoneNational: string;
};

export type CheckoutCustomerFormField =
  keyof CheckoutCustomerFormValue;

export type CheckoutCustomerFormErrors =
  Record<string, string | undefined>;

export type CheckoutCustomerFormProps = {
  /**
   * Langue actuellement sélectionnée.
   */
  locale: CheckoutLocale | string;

  /**
   * Données contrôlées par le parent.
   */
  value: CheckoutCustomerFormValue;

  /**
   * Appelé après toute modification
   * d'un champ personnel.
   */
  onChange: (
    nextValue: CheckoutCustomerFormValue
  ) => void;

  /**
   * Callback facultatif pour prévenir
   * CheckoutClient lorsqu'un champ change.
   */
  onFieldChange?: (
    field: CheckoutCustomerFormField,
    value: string
  ) => void;

  /**
   * Callback facultatif, spécifique au
   * choix du pays téléphonique.
   */
  onPhoneCountryChange?: (
    country: CheckoutCountryCode | ""
  ) => void;

  /**
   * Erreurs issues de checkout-validation.ts.
   *
   * Clés attendues :
   *
   * customer.firstName
   * customer.lastName
   * customer.email
   * customer.phoneCountry
   * customer.phoneNational
   */
  errors?: CheckoutCustomerFormErrors;

  /**
   * Bloquer les champs pendant
   * l'enregistrement de la commande.
   */
  disabled?: boolean;

  /**
   * Afficher une aide sous le téléphone.
   */
  showPhoneHelp?: boolean;

  /**
   * Validation du téléphone à la sortie
   * du champ.
   */
  validatePhoneOnBlur?: boolean;

  /**
   * Préfixe des identifiants HTML.
   */
  idPrefix?: string;

  /**
   * Classe CSS additionnelle.
   */
  className?: string;
};

// ============================================================
// 2. CONSTANTES VISUELLES
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
  "font-medium",
  "text-[#102b39]",
  "outline-none",
  "transition-colors",
  "placeholder:font-normal",
  "placeholder:text-slate-400",
  "focus:border-[#159c27]",
  "focus:ring-2",
  "focus:ring-[#159c27]/15",
  "disabled:cursor-not-allowed",
  "disabled:bg-slate-100",
  "disabled:text-slate-500",
].join(" ");

const ERROR_INPUT_CLASS = [
  "border-red-400",
  "focus:border-red-500",
  "focus:ring-red-500/10",
].join(" ");

const LABEL_CLASS = [
  "mb-1.5",
  "block",
  "text-xs",
  "font-bold",
  "text-[#102b39]",
].join(" ");

// ============================================================
// 3. MARQUEUR DE CHAMP OBLIGATOIRE
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

// ============================================================
// 4. MESSAGE D'ERREUR
// ============================================================

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
        aria-hidden="true"
        className="mt-0.5 shrink-0"
      />

      <span>
        {translateCheckoutError(
          code,
          locale
        )}
      </span>
    </p>
  );
}

// ============================================================
// 5. STRUCTURE D'UN CHAMP
// ============================================================

function CustomerField({
  id,
  label,
  locale,
  error,
  required = true,
  children,
}: {
  id: string;

  label: string;

  locale: CheckoutLocale;

  error?: string | null;

  required?: boolean;

  children: ReactNode;
}) {
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
        id={`${id}-error`}
        code={error}
        locale={locale}
      />
    </div>
  );
}

// ============================================================
// 6. COMPOSANT PRINCIPAL
// ============================================================

export default function CheckoutCustomerForm({
  locale: rawLocale,
  value,
  onChange,
  onFieldChange,
  onPhoneCountryChange,
  errors = {},
  disabled = false,
  showPhoneHelp = false,
  validatePhoneOnBlur = true,
  idPrefix,
  className = "",
}: CheckoutCustomerFormProps) {
  // ----------------------------------------------------------
  // LANGUE
  // ----------------------------------------------------------

  const locale = normalizeCheckoutLocale(
    rawLocale
  );

  const t = getCheckoutTranslations(
    locale
  );

  // ----------------------------------------------------------
  // IDENTIFIANTS HTML
  // ----------------------------------------------------------

  const generatedId = useId();

  const prefix =
    idPrefix ??
    `cycloriva-customer-${generatedId}`;

  const ids = {
    firstName:
      `${prefix}-first-name`,

    lastName:
      `${prefix}-last-name`,

    email:
      `${prefix}-email`,

    phoneCountry:
      `${prefix}-phone-country`,

    phoneNational:
      `${prefix}-phone-national`,
  };

  // ----------------------------------------------------------
  // ERREURS
  // ----------------------------------------------------------

  const firstNameError =
    errors["customer.firstName"];

  const lastNameError =
    errors["customer.lastName"];

  const emailError =
    errors["customer.email"];

  const phoneCountryError =
    errors["customer.phoneCountry"];

  const phoneNationalError =
    errors["customer.phoneNational"];

  // ----------------------------------------------------------
  // MISE À JOUR DES VALEURS
  // ----------------------------------------------------------

  function updateField<
    K extends CheckoutCustomerFormField
  >(
    field: K,
    nextValue: CheckoutCustomerFormValue[K]
  ) {
    if (disabled) {
      return;
    }

    onChange({
      ...value,
      [field]: nextValue,
    });

    onFieldChange?.(
      field,
      nextValue
    );
  }

  // ----------------------------------------------------------
  // CHANGEMENT DU PAYS DU TÉLÉPHONE
  // ----------------------------------------------------------

  function handlePhoneCountryChange(
    country: CheckoutCountryCode | ""
  ) {
    updateField(
      "phoneCountry",
      country
    );

    if (!disabled) {
      onPhoneCountryChange?.(
        country
      );
    }
  }

  // ----------------------------------------------------------
  // CHANGEMENT DU NUMÉRO
  // ----------------------------------------------------------

  function handlePhoneNationalChange(
    phone: string
  ) {
    updateField(
      "phoneNational",
      phone
    );
  }

  // ----------------------------------------------------------
  // CHANGEMENT DU PRÉNOM
  // ----------------------------------------------------------

  function handleFirstNameChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    updateField(
      "firstName",
      event.target.value
    );
  }

  // ----------------------------------------------------------
  // CHANGEMENT DU NOM
  // ----------------------------------------------------------

  function handleLastNameChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    updateField(
      "lastName",
      event.target.value
    );
  }

  // ----------------------------------------------------------
  // CHANGEMENT DE L'E-MAIL
  // ----------------------------------------------------------

  function handleEmailChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    updateField(
      "email",
      event.target.value
    );
  }

  // ----------------------------------------------------------
  // RENDU
  // ----------------------------------------------------------

  return (
    <section
      className={`${CARD_CLASS} ${className}`}
      aria-labelledby={`${prefix}-title`}
      data-component="checkout-customer-form"
    >
      {/* ====================================================
          TITRE
      ==================================================== */}

      <div className="mb-4 flex items-center gap-2.5">
        <UserRound
          size={24}
          strokeWidth={1.9}
          className="shrink-0 text-[#109b24]"
          aria-hidden="true"
        />

        <h2
          id={`${prefix}-title`}
          className="text-base font-extrabold tracking-tight text-[#102b39] sm:text-lg"
        >
          {t.customer.title}
        </h2>
      </div>

      {/* ====================================================
          GRILLE RESPONSIVE
      ==================================================== */}

      <div className="grid min-w-0 grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-4">

        {/* ==================================================
            PRÉNOM
        ================================================== */}

        <CustomerField
          id={ids.firstName}
          label={t.customer.firstName}
          locale={locale}
          error={firstNameError}
        >
          <input
            id={ids.firstName}
            name="firstName"
            type="text"
            value={value.firstName}
            onChange={handleFirstNameChange}
            autoComplete="given-name"
            maxLength={100}
            required
            disabled={disabled}
            placeholder={
              t.customer.firstNamePlaceholder
            }
            aria-invalid={Boolean(
              firstNameError
            )}
            aria-describedby={
              firstNameError
                ? `${ids.firstName}-error`
                : undefined
            }
            className={[
              INPUT_CLASS,
              firstNameError
                ? ERROR_INPUT_CLASS
                : "",
            ].join(" ")}
          />
        </CustomerField>

        {/* ==================================================
            NOM
        ================================================== */}

        <CustomerField
          id={ids.lastName}
          label={t.customer.lastName}
          locale={locale}
          error={lastNameError}
        >
          <input
            id={ids.lastName}
            name="lastName"
            type="text"
            value={value.lastName}
            onChange={handleLastNameChange}
            autoComplete="family-name"
            maxLength={100}
            required
            disabled={disabled}
            placeholder={
              t.customer.lastNamePlaceholder
            }
            aria-invalid={Boolean(
              lastNameError
            )}
            aria-describedby={
              lastNameError
                ? `${ids.lastName}-error`
                : undefined
            }
            className={[
              INPUT_CLASS,
              lastNameError
                ? ERROR_INPUT_CLASS
                : "",
            ].join(" ")}
          />
        </CustomerField>

        {/* ==================================================
            ADRESSE E-MAIL
        ================================================== */}

        <div className="col-span-2 min-w-0 lg:col-span-1">
          <CustomerField
            id={ids.email}
            label={t.customer.email}
            locale={locale}
            error={emailError}
          >
            <div className="relative min-w-0">
              <Mail
                size={16}
                className="pointer-events-none absolute top-3.5 left-3 text-[#7c8d9a]"
                aria-hidden="true"
              />

              <input
                id={ids.email}
                name="email"
                type="email"
                inputMode="email"
                value={value.email}
                onChange={handleEmailChange}
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                maxLength={254}
                required
                disabled={disabled}
                placeholder={
                  t.customer.emailPlaceholder
                }
                aria-invalid={Boolean(
                  emailError
                )}
                aria-describedby={
                  emailError
                    ? `${ids.email}-error`
                    : undefined
                }
                className={[
                  INPUT_CLASS,
                  "pl-9",
                  emailError
                    ? ERROR_INPUT_CLASS
                    : "",
                ].join(" ")}
              />
            </div>
          </CustomerField>
        </div>

        {/* ==================================================
            TÉLÉPHONE INTERNATIONAL
        ================================================== */}

        <div className="col-span-2 min-w-0 lg:col-span-1">
          <CheckoutPhoneInput
            locale={locale}
            phoneCountry={
              value.phoneCountry
            }
            phoneNational={
              value.phoneNational
            }
            onPhoneCountryChange={
              handlePhoneCountryChange
            }
            onPhoneNationalChange={
              handlePhoneNationalChange
            }
            disabled={disabled}
            required
            countryError={
              phoneCountryError
            }
            phoneError={
              phoneNationalError
            }
            validateOnBlur={
              validatePhoneOnBlur
            }
            showHelp={showPhoneHelp}
            countryId={
              ids.phoneCountry
            }
            phoneId={
              ids.phoneNational
            }
          />
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 7. EXPORT NOMMÉ
// ============================================================

export { CheckoutCustomerForm };

// ============================================================
// FIN — CYCLORIVA CHECKOUT CUSTOMER FORM
// ============================================================
