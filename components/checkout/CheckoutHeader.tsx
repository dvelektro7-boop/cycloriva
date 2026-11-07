import Link from "next/link";
import { Check, ChevronRight, House } from "lucide-react";
import {
  getCheckoutTranslations,
  normalizeCheckoutLocale,
  type CheckoutLocale,
} from "@/lib/checkout-i18n";

export type CheckoutHeaderProps = {
  locale: CheckoutLocale | string;
  currentStep?: 1 | 2 | 3;
  showBanner?: boolean;
  bannerImage?: string;
  cartHref?: string;
};
export default function CheckoutHeader({
  locale: rawLocale,
  currentStep = 2,
  showBanner = true,
  bannerImage = "/images/couverture.png",
  cartHref,
}: CheckoutHeaderProps) {
  const locale = normalizeCheckoutLocale(rawLocale);
  const t = getCheckoutTranslations(locale);
  const steps = [t.steps.cart, t.steps.information, t.steps.confirmation];
  return (
    <header className="checkout-page-header">
      {showBanner && (
        <section
          className="checkout-banner"
          style={{
            backgroundImage:
              'linear-gradient(90deg,rgba(7,28,44,.94),rgba(7,28,44,.1)),url("' +
              bannerImage +
              '")',
          }}
        >
          <div className="checkout-container">
            <p>{t.page.eyebrow}</p>
            <h1>{t.page.title}</h1>
          </div>
        </section>
      )}
      <div className="checkout-container">
        <nav aria-label={t.page.pageAriaLabel} className="checkout-breadcrumb">
          <Link href={"/" + locale}>
            <House size={15} />
            {t.page.breadcrumbHome}
          </Link>
          <ChevronRight size={13} />
          <Link href={cartHref || "/" + locale + "/panier"}>
            {t.page.breadcrumbCart}
          </Link>
          <ChevronRight size={13} />
          <span aria-current="page">{t.page.breadcrumbCheckout}</span>
        </nav>
        <h1 className="sr-only lg:hidden">{t.page.title}</h1>
        <ol className="checkout-steps">
          {steps.map((label, index) => (
            <li
              key={label}
              aria-current={currentStep === index + 1 ? "step" : undefined}
              className={
                index + 1 <= currentStep
                  ? "is-current" +
                    (index + 1 < currentStep ? " is-complete" : "")
                  : ""
              }
            >
              <span className="checkout-step-dot">
                {index + 1 < currentStep ? <Check size={19} /> : index + 1}
              </span>
              <span>{label}</span>
            </li>
          ))}
        </ol>
      </div>
    </header>
  );
}
