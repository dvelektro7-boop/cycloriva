"use client";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { Headphones, RefreshCw, ShieldCheck, Truck } from "lucide-react";
import {
  clearCart,
  getCartSnapshot,
  getServerCartSnapshot,
  subscribeToCart,
} from "@/lib/cart";
import {
  getCheckoutTranslations,
  normalizeCheckoutLocale,
  translateCheckoutError,
  type CheckoutLocale,
} from "@/lib/checkout-i18n";
import type { CheckoutCountryCode } from "@/lib/checkout-countries";
import { detectBrowserCheckoutCountry } from "@/lib/checkout-client-geo";
import {
  safeValidateCheckout,
  type CheckoutValidationFieldError,
} from "@/lib/checkout-validation";
import CheckoutCustomerForm, {
  type CheckoutCustomerFormValue,
} from "./CheckoutCustomerForm";
import CheckoutAddressForm, {
  type CheckoutAddressValue,
} from "./CheckoutAddressForm";
import CheckoutOrderSummary, {
  type CheckoutSummaryPricing,
} from "./CheckoutOrderSummary";
import CheckoutSubmit from "./CheckoutSubmit";

export type CheckoutClientProps = {
  locale: CheckoutLocale | string;
  suggestedCountry?: CheckoutCountryCode | null;
  detectedCountry?: CheckoutCountryCode | null;
  className?: string;
};
type Quote = {
  key: string;
  status: "loading" | "ready" | "error";
  pricing?: CheckoutSummaryPricing;
  code?: string;
};
export default function CheckoutClient({
  locale: rawLocale,
  suggestedCountry = null,
  detectedCountry = null,
  className = "",
}: CheckoutClientProps) {
  const locale = normalizeCheckoutLocale(rawLocale);
  const t = getCheckoutTranslations(locale);
  const router = useRouter();
  const cart = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getServerCartSnapshot,
  );
  const [customer, setCustomer] = useState<CheckoutCustomerFormValue>({
    firstName: "",
    lastName: "",
    email: "",
    phoneCountry: suggestedCountry || "",
    phoneNational: "",
  });
  const [delivery, setDelivery] = useState<CheckoutAddressValue>({
    country: suggestedCountry || "",
    city: "",
    postalCode: "",
    addressLine1: "",
    addressLine2: "",
  });
  const [resolvedDetectedCountry, setResolvedDetectedCountry] = useState(detectedCountry);
  const manualCountry = useRef(false);
  const manualPhone = useRef(false);
  const [countryModified, setCountryModified] = useState(false);
  useEffect(() => {
    if (suggestedCountry || detectedCountry) return;
    const controller = new AbortController();
    void detectBrowserCheckoutCountry(controller.signal).then(country => {
      if (!country || controller.signal.aborted) return;
      setResolvedDetectedCountry(country);
      if (!manualCountry.current) setDelivery(value => value.country ? value : {...value, country});
      if (!manualPhone.current) setCustomer(value => value.phoneCountry || value.phoneNational ? value : {...value, phoneCountry: country});
    });
    return () => controller.abort();
  }, [suggestedCountry, detectedCountry]);
  const [quoteRevision, setQuoteRevision] = useState(0);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [errors, setErrors] = useState<CheckoutValidationFieldError[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const submitting = useRef(false);
  const attempt = useRef({ fingerprint: "", key: "" });
  const items = cart.items.map((item) => ({
    productId: item.productId,
    variantId: item.variantId,
    quantity: item.quantity,
  }));
  const requestKey =
    delivery.country && items.length
      ? JSON.stringify({ country: delivery.country, items, locale })
      : "";
  const pricing =
    quote?.key === requestKey && quote.status === "ready"
      ? quote.pricing || null
      : null;
  useEffect(() => {
    if (!requestKey) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setQuote({ key: requestKey, status: "loading" });
      try {
        const response = await fetch("/api/checkout/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: requestKey,
          signal: controller.signal,
          cache: "no-store",
        });
        const data = await response.json();
        if (controller.signal.aborted) return;
        if (
          !response.ok ||
          !data.success ||
          !data.pricing ||
          !Number.isSafeInteger(data.pricing.totalCents)
        )
          setQuote({
            key: requestKey,
            status: "error",
            code: data.code || "SERVER_ERROR",
          });
        else
          setQuote({ key: requestKey, status: "ready", pricing: data.pricing });
      } catch {
        if (!controller.signal.aborted)
          setQuote({ key: requestKey, status: "error", code: "NETWORK_ERROR" });
      }
    }, 200);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [requestKey, quoteRevision]);
  const fieldErrors = Object.fromEntries(
    errors.map((error) => [error.field, error.code]),
  );
  const hasItems = items.length > 0;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    setFormError(null);
    setErrors([]);
    if (!hasItems || !pricing) {
      setFormError(!hasItems ? "CART_EMPTY" : "SHIPPING_NOT_CONFIGURED");
      return;
    }
    const body = {
      locale,
      customer,
      delivery: { ...delivery, addressLine2: delivery.addressLine2 || null },
      items,
      sameBillingAddress: true,
      expectedTotalCents: pricing.totalCents,
    };
    const fingerprint = JSON.stringify(body);
    if (attempt.current.fingerprint !== fingerprint)
      attempt.current = { fingerprint, key: crypto.randomUUID() };
    const payload = { ...body, idempotencyKey: attempt.current.key };
    const validation = safeValidateCheckout(payload);
    if (!validation.success) {
      setErrors(validation.errors);
      setFormError("CHECKOUT_VALIDATION_FAILED");
      requestAnimationFrame(() =>
        document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
      );
      return;
    }
    submitting.current = true;
    setBusy(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30000),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        if (data.code === "PRICE_CHANGED")
          setQuoteRevision((value) => value + 1);
        setFormError(data.code || "SERVER_ERROR");
        if (Array.isArray(data.errors)) setErrors(data.errors);
        return;
      }
      if (
        typeof data.order?.id !== "string" ||
        data.redirectUrl !==
          "/" +
            locale +
            "/commande/confirmation/" +
            encodeURIComponent(data.order.id)
      )
        throw new Error("INVALID_RESPONSE");
      clearCart();
      router.push(data.redirectUrl);
    } catch {
      setFormError("NETWORK_ERROR");
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }
  const submitProps = {
    locale,
    status: busy ? ("submitting" as const) : ("idle" as const),
    canSubmit: !!pricing && !busy,
    hasItems,
    quoteReady: !!pricing,
    errorCode: formError,
    showPaymentNotice: false,
  };
  return (
    <form
      id="cycloriva-checkout-form"
      className={className}
      onSubmit={submit}
      noValidate
      aria-busy={busy}
    >
      {formError && (
        <div role="alert" className="checkout-error mb-4">
          {translateCheckoutError(formError, locale)}
        </div>
      )}
      <div className="checkout-layout">
        <div className="checkout-form-column">
          <CheckoutCustomerForm
            locale={locale}
            value={customer}
            onChange={value => {
              if (value.phoneCountry !== customer.phoneCountry || value.phoneNational !== customer.phoneNational) manualPhone.current = true;
              setCustomer(value);
            }}
            errors={fieldErrors}
            disabled={busy || !hasItems}
          />
          <CheckoutAddressForm
            locale={locale}
            value={delivery}
            onChange={setDelivery}
            onCountryChange={() => { manualCountry.current = true; setCountryModified(true); }}
            detectedCountry={resolvedDetectedCountry}
            countryModified={countryModified}
            errors={fieldErrors}
            disabled={busy || !hasItems}
            showAddressLine2
          />
          <div className="checkout-desktop-submit">
            <CheckoutSubmit
              {...submitProps}
              variant="desktop"
              showError={false}
            />
          </div>
        </div>
        <aside className="checkout-summary-column">
          <CheckoutOrderSummary
            locale={locale}
            pricing={pricing}
            quoteLoading={
              !!requestKey &&
              (!quote || quote.key !== requestKey || quote.status === "loading")
            }
            quoteError={quote?.key === requestKey ? quote.code : null}
            disabled={busy}
          />
          {quote?.key === requestKey && quote.status === "error" && (
            <button
              type="button"
              className="checkout-retry"
              onClick={() => setQuoteRevision((value) => value + 1)}
            >
              {t.common.retry}
            </button>
          )}
          <div className="checkout-trust">
            <ShieldCheck size={34} />
            <div>
              <strong>{t.security.title}</strong>
              {t.security.description}
            </div>
          </div>
          <div className="checkout-services">
            {[
              [Truck, t.security.delivery, t.security.deliveryDescription],
              [ShieldCheck, t.security.payment, t.security.paymentDescription],
              [RefreshCw, t.security.returns, t.security.returnsDescription],
              [Headphones, t.security.support, t.security.supportDescription],
            ].map(([Icon, title, description], index) => {
              const IconComponent = Icon as typeof Truck;
              return (
                <div key={index}>
                  <IconComponent size={25} />
                  <strong>{title as string}</strong>
                  <span>{description as string}</span>
                </div>
              );
            })}
          </div>
        </aside>
      </div>
      <div className="checkout-mobile-submit">
        <CheckoutSubmit {...submitProps} variant="mobile" showError={false} />
      </div>
      <p className="checkout-notice">{t.submit.noPaymentNotice}</p>
    </form>
  );
}
