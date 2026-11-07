
"use client";

import Link from "next/link";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react";

import {
  getCheckoutTranslations,
  normalizeCheckoutLocale,
  translateCheckoutError,
  type CheckoutLocale,
} from "@/lib/checkout-i18n";

/**
 * ============================================================
 * CYCLORIVA — VALIDATION VISUELLE DE COMMANDE
 * ============================================================
 *
 * Fichier :
 * components/checkout/CheckoutSubmit.tsx
 *
 * TECHNOLOGIES :
 * - Next.js 16
 * - React 19
 * - TypeScript
 * - Tailwind CSS 4
 *
 * DESIGN :
 * - Bleu marine #102b39
 * - Vert CYCLORIVA #08951b
 * - Blanc
 * - Responsive PC / mobile
 *
 * RESPONSABILITÉS :
 * - Bouton Valider la commande
 * - Bouton Retour au panier
 * - État de chargement
 * - Désactivation pendant les opérations
 * - Messages d'erreur
 * - Messages de disponibilité du devis
 * - Informations sur la confirmation
 * - Affichage accessible
 *
 * SÉCURITÉ :
 * - Ne valide jamais seul une commande
 * - Ne déclenche pas de paiement
 * - Ne communique aucun montant fictif
 * - Ne considère pas la commande comme
 *   enregistrée avant la réponse de l'API
 *
 * ============================================================
 */

// ============================================================
// 1. TYPES
// ============================================================

export type CheckoutSubmitStatus =
  | "idle"
  | "validating"
  | "submitting"
  | "success"
  | "error";

export type CheckoutSubmitVariant =
  | "desktop"
  | "mobile"
  | "default";

export type CheckoutSubmitProps = {
  /**
   * Langue de la page.
   */
  locale: CheckoutLocale | string;

  /**
   * État actuel de la validation.
   */
  status?: CheckoutSubmitStatus;

  /**
   * La soumission est possible uniquement
   * si le panier, le formulaire et le
   * devis serveur sont exploitables.
   */
  canSubmit?: boolean;

  /**
   * Le panier contient au moins un article.
   */
  hasItems?: boolean;

  /**
   * Le devis serveur a été obtenu et correspond
   * au panier et au pays actuellement choisis.
   */
  quoteReady?: boolean;

  /**
   * Message d'erreur sous forme de code
   * traduit par checkout-i18n.
   */
  errorCode?: string | null;

  /**
   * URL réelle de retour au panier.
   *
   * Par défaut, le composant utilise
   * /[locale]/panier.
   *
   * À adapter si la route réelle du panier
   * utilise un autre chemin.
   */
  cartHref?: string;

  /**
   * Affichage PC, mobile ou générique.
   */
  variant?: CheckoutSubmitVariant;

  /**
   * Attribut form si le bouton se trouve
   * à l'extérieur du formulaire HTML.
   */
  formId?: string;

  /**
   * Afficher la note sur le paiement.
   */
  showPaymentNotice?: boolean;

  /**
   * Afficher le message d'erreur.
   */
  showError?: boolean;

  /**
   * Afficher la notice de protection.
   */
  showSecurityNote?: boolean;

  /**
   * Classe CSS complémentaire.
   */
  className?: string;
};

// ============================================================
// 2. CLASSES VISUELLES
// ============================================================

const PRIMARY_BUTTON_CLASS = [
  "group",
  "inline-flex",
  "min-h-12",
  "w-full",
  "items-center",
  "justify-center",
  "gap-2.5",
  "rounded-lg",
  "bg-[#08951b]",
  "px-5",
  "py-3",
  "text-center",
  "text-[13px]",
  "font-extrabold",
  "leading-5",
  "text-white",
  "shadow-[0_3px_9px_rgba(8,149,27,0.12)]",
  "transition-colors",
  "duration-150",
  "hover:bg-[#087d19]",
  "focus-visible:outline-2",
  "focus-visible:outline-offset-2",
  "focus-visible:outline-[#08951b]",
  "disabled:cursor-not-allowed",
  "disabled:bg-[#b8c5cb]",
  "disabled:text-white",
  "disabled:shadow-none",
  "sm:text-sm",
].join(" ");

const SECONDARY_BUTTON_CLASS = [
  "inline-flex",
  "min-h-12",
  "w-full",
  "items-center",
  "justify-center",
  "gap-2",
  "rounded-lg",
  "border",
  "border-[#a8b9c6]",
  "bg-white",
  "px-5",
  "py-3",
  "text-center",
  "text-[13px]",
  "font-bold",
  "leading-5",
  "text-[#102b39]",
  "transition-colors",
  "duration-150",
  "hover:border-[#6e8d9b]",
  "hover:bg-slate-50",
  "focus-visible:outline-2",
  "focus-visible:outline-offset-2",
  "focus-visible:outline-[#08951b]",
  "sm:text-sm",
].join(" ");

// ============================================================
// 3. LIBELLÉ DU BOUTON
// ============================================================

function getSubmitLabel(
  status: CheckoutSubmitStatus,
  locale: CheckoutLocale
): string {
  const t = getCheckoutTranslations(locale);

  switch (status) {
    case "validating":
      return t.submit.validating;

    case "submitting":
      return t.submit.processing;

    case "success":
      return t.confirmation.received;

    case "error":
    case "idle":
    default:
      return t.submit.button;
  }
}

// ============================================================
// 4. MESSAGE D'INDISPONIBILITÉ
// ============================================================

function getUnavailableMessage(
  locale: CheckoutLocale,
  hasItems: boolean,
  quoteReady: boolean
): string | null {
  const t = getCheckoutTranslations(locale);

  if (!hasItems) {
    return t.submit.emptyCartDisabled;
  }

  if (!quoteReady) {
    return t.cart.totalPending;
  }

  return null;
}

// ============================================================
// 5. COMPOSANT PRINCIPAL
// ============================================================

export default function CheckoutSubmit({
  locale: rawLocale,
  status = "idle",
  canSubmit = false,
  hasItems = false,
  quoteReady = false,
  errorCode = null,
  cartHref,
  variant = "default",
  formId,
  showPaymentNotice = false,
  showError = true,
  showSecurityNote = false,
  className = "",
}: CheckoutSubmitProps) {
  const locale =
    normalizeCheckoutLocale(rawLocale);

  const t = getCheckoutTranslations(locale);

  const isProcessing =
    status === "validating" ||
    status === "submitting";

  const isSuccess =
    status === "success";

  const disabled =
    !canSubmit ||
    !hasItems ||
    !quoteReady ||
    isProcessing ||
    isSuccess;

  const returnUrl =
    cartHref ?? `/${locale}/panier`;

  const submitLabel =
    getSubmitLabel(status, locale);

  const unavailableMessage =
    !isProcessing && !isSuccess
      ? getUnavailableMessage(
          locale,
          hasItems,
          quoteReady
        )
      : null;

  const layoutClass =
    variant === "desktop"
      ? "hidden lg:flex lg:flex-row lg:items-center lg:justify-between"
      : variant === "mobile"
        ? "flex flex-col lg:hidden"
        : "flex flex-col sm:flex-row sm:items-center sm:justify-between";

  return (
    <div
      className={`min-w-0 ${className}`}
      data-component="checkout-submit"
    >
      <div className={`${layoutClass} gap-3`}>
        {/* ================================================
            RETOUR AU PANIER
        ================================================ */}

        <Link
          href={returnUrl}
          aria-disabled={isProcessing}
          tabIndex={isProcessing ? -1 : undefined}
          onClick={(event) => {
            if (isProcessing) {
              event.preventDefault();
            }
          }}
          className={[
            SECONDARY_BUTTON_CLASS,
            variant === "desktop"
              ? "lg:w-auto lg:min-w-44"
              : "",
            isProcessing
              ? "pointer-events-none opacity-60"
              : "",
            variant === "mobile"
              ? "order-2"
              : "",
          ].join(" ")}
        >
          <ArrowLeft
            size={17}
            strokeWidth={2}
            aria-hidden="true"
          />

          <span>{t.cart.returnToCart}</span>
        </Link>

        {/* ================================================
            VALIDATION
        ================================================ */}

        <button
          type="submit"
          form={formId}
          disabled={disabled}
          aria-busy={isProcessing}
          data-status={status}
          className={[
            PRIMARY_BUTTON_CLASS,
            variant === "desktop"
              ? "lg:w-auto lg:min-w-60"
              : "",
            variant === "mobile"
              ? "order-1"
              : "",
          ].join(" ")}
        >
          {isProcessing ? (
            <LoaderCircle
              size={18}
              className="shrink-0 animate-spin"
              aria-hidden="true"
            />
          ) : isSuccess ? (
            <CheckCircle2
              size={19}
              className="shrink-0"
              aria-hidden="true"
            />
          ) : (
            <LockKeyhole
              size={17}
              className="shrink-0"
              aria-hidden="true"
            />
          )}

          <span>{submitLabel}</span>

          {!isProcessing && !isSuccess && (
            <ArrowRight
              size={18}
              className="shrink-0 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          )}
        </button>
      </div>

      {/* ==================================================
          MESSAGE DE DISPONIBILITÉ
      ================================================== */}

      {unavailableMessage && !errorCode && (
        <p
          role="status"
          className="mt-2 text-xs leading-5 text-slate-500"
        >
          {unavailableMessage}
        </p>
      )}

      {/* ==================================================
          ERREUR DE VALIDATION
      ================================================== */}

      {showError && errorCode && (
        <div
          role="alert"
          className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-700"
        >
          <AlertCircle
            size={17}
            className="mt-0.5 shrink-0"
            aria-hidden="true"
          />

          <span>
            {translateCheckoutError(
              errorCode,
              locale
            )}
          </span>
        </div>
      )}

      {/* ==================================================
          PROTECTION DES DONNÉES
      ================================================== */}

      {showSecurityNote && (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-[#eef7f0] p-3">
          <ShieldCheck
            size={19}
            className="mt-0.5 shrink-0 text-[#139b28]"
            aria-hidden="true"
          />

          <p className="text-xs leading-5 text-[#254238]">
            <strong className="block text-[#102b39]">
              {t.security.title}
            </strong>

            {t.security.description}
          </p>
        </div>
      )}

      {/* ==================================================
          INFORMATION SUR LE PAIEMENT
      ================================================== */}

      {showPaymentNotice && (
        <div className="mt-3 flex items-start gap-2">
          <ShoppingCart
            size={16}
            className="mt-0.5 shrink-0 text-slate-500"
            aria-hidden="true"
          />

          <p className="text-[11px] leading-5 text-slate-500">
            {t.submit.noPaymentNotice}
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// 6. EXPORT NOMMÉ OPTIONNEL
// ============================================================

export { CheckoutSubmit };

// ============================================================
// FIN — CYCLORIVA CHECKOUT SUBMIT
// ============================================================
