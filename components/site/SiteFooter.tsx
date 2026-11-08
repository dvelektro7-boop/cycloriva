
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";

import { informationPagePath } from "@/lib/site-routes";

import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa6";

import {
  SiVisa,
  SiMastercard,
  SiPaypal,
} from "react-icons/si";

import {
  siteText,
  type SiteLocale,
  type SiteTextKey,
} from "@/lib/site-i18n";

// =====================================================
// CYCLORIVA — FOOTER GLOBAL
// =====================================================
//
// Design :
// - Fond bleu marine officiel
// - Logo directement sur le fond du footer
// - Version transparente du logo recommandée
// - Fallback vers le logo existant
// - Responsive ordinateur et mobile
// - 5 langues
// - Navigation conservée
// - Newsletter conservée
// - Réseaux sociaux conservés
// - Moyens de paiement conservés
// - Mentions légales conservées
//
// =====================================================

type SiteFooterProps = {
  locale: SiteLocale;
};

type FooterItem = {
  key: SiteTextKey;
  href: string;
};

// =====================================================
// LOGOS
// =====================================================

// Logo recommandé :
// Image transparente avec inscription blanche.
// Emplacement : public/images/logo-footer.png

const FOOTER_LOGO = "/images/logo-footer.png";

// Logo actuellement utilisé dans CYCLORIVA.
// Conservé comme solution de secours.

const ORIGINAL_LOGO = "/images/logo.png";

// =====================================================
// COMPOSANT PRINCIPAL
// =====================================================

export function SiteFooter({
  locale,
}: SiteFooterProps) {
  const [consent, setConsent] = useState(false);

  const [message, setMessage] = useState("");

  const [email, setEmail] = useState("");

  // En attendant le nouveau logo, l'ancien
  // est utilisé automatiquement en cas d'erreur.
  const [footerLogo, setFooterLogo] =
    useState(FOOTER_LOGO);

  const isOriginalLogo =
    footerLogo === ORIGINAL_LOGO;

  const tr = (key: SiteTextKey) =>
    siteText(locale, key);

  // ===================================================
  // LIENS BOUTIQUE
  // ===================================================

  const catalog = `/${locale}/produits`;

  const productSearch = (term: string) =>
    `${catalog}?q=${encodeURIComponent(term)}`;

  const storeLinks: FooterItem[] = [
    {
      key: "electric",
      href: productSearch("électrique"),
    },
    {
      key: "mtb",
      href: productSearch("VTT"),
    },
    {
      key: "cargo",
      href: productSearch("cargo"),
    },
    {
      key: "city",
      href: productSearch("ville"),
    },
    {
      key: "accessories",
      href: productSearch("accessoire"),
    },
  ];

  // ===================================================
  // LIENS INFORMATIONS
  // ===================================================

  const informationLinks: FooterItem[] = [
    {
      key: "about",
      href: informationPagePath(
        locale,
        "about"
      ),
    },
    {
      key: "guides",
      href: informationPagePath(
        locale,
        "guides"
      ),
    },
    {
      key: "customers",
      href: informationPagePath(
        locale,
        "customers"
      ),
    },
    {
      key: "delivery",
      href: informationPagePath(
        locale,
        "delivery"
      ),
    },
    {
      key: "returns",
      href: informationPagePath(
        locale,
        "returns"
      ),
    },
  ];

  // ===================================================
  // LIENS AIDE
  // ===================================================

  const helpLinks: FooterItem[] = [
    {
      key: "faq",
      href: informationPagePath(
        locale,
        "faq"
      ),
    },
    {
      key: "warranty",
      href: informationPagePath(
        locale,
        "warranty"
      ),
    },
    {
      key: "payments",
      href: informationPagePath(
        locale,
        "payments"
      ),
    },
    {
      key: "track",
      href: informationPagePath(
        locale,
        "track"
      ),
    },
    {
      key: "contact",
      href: informationPagePath(
        locale,
        "contact"
      ),
    },
  ];

  // ===================================================
  // LIENS LÉGAUX
  // ===================================================

  const legalLinks: FooterItem[] = [
    {
      key: "legal",
      href: informationPagePath(
        locale,
        "legal"
      ),
    },
    {
      key: "privacy",
      href: informationPagePath(
        locale,
        "privacy"
      ),
    },
    {
      key: "terms",
      href: informationPagePath(
        locale,
        "terms"
      ),
    },
    {
      key: "cookies",
      href: informationPagePath(
        locale,
        "cookies"
      ),
    },
  ];

  // ===================================================
  // NEWSLETTER
  // ===================================================

  function newsletterSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!consent) {
      setMessage(
        tr("newsletterNeedConsent")
      );
      return;
    }

    if (!email.trim()) {
      return;
    }

    // Aucun service d'inscription n'est encore
    // connecté : ne pas simuler un enregistrement.

    setMessage(
      tr("newsletterPending")
    );
  }

  // ===================================================
  // AFFICHAGE DES LIENS
  // ===================================================

  function renderFooterLinks(
    links: FooterItem[]
  ) {
    return (
      <ul className="space-y-2 text-xs leading-5 text-slate-200">
        {links.map((item) => (
          <li key={item.key}>
            <Link
              href={item.href}
              className="transition-colors hover:text-[#75df40] focus-visible:text-[#75df40]"
            >
              {tr(item.key)}
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  // ===================================================
  // AFFICHAGE
  // ===================================================

  return (
    <footer
      data-component="cycloriva-footer"
      className="w-full bg-[#102b39] text-white"
    >
      <div className="w-full min-w-0 px-5 pt-9 pb-5 sm:px-8 lg:px-12">
        {/* ========================================= */}
        {/* COLONNES PRINCIPALES                     */}
        {/* ========================================= */}

        <div className="grid grid-cols-2 gap-x-6 gap-y-9 lg:grid-cols-[1.5fr_0.8fr_1fr_0.8fr_1.4fr_1.2fr] lg:gap-7">

          {/* ======================================= */}
          {/* LOGO ET PRÉSENTATION                   */}
          {/* ======================================= */}

          <div className="col-span-2 min-w-0 lg:col-span-1">
            <Link
              href={`/${locale}`}
            aria-label={`CYCLORIVA — ${siteText(locale, "home")}`}
              className="inline-flex max-w-full items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#75df40]"
            >
              <span
                className={
                  isOriginalLogo
                    ? "inline-flex max-w-full items-center rounded-md bg-white px-2 py-1"
                    : "inline-flex max-w-full items-center"
                }
              >
                <Image
                  src={footerLogo}
                  alt="CYCLORIVA"
                  width={2172}
                  height={724}
                  sizes="(max-width: 639px) 165px, 185px"
                  onError={() => {
                    if (
                      footerLogo !== ORIGINAL_LOGO
                    ) {
                      setFooterLogo(
                        ORIGINAL_LOGO
                      );
                    }
                  }}
                  className="h-auto w-41.25 max-w-full object-contain object-left sm:w-46.25"
                />
              </span>
            </Link>

            <p className="mt-3 max-w-70 text-xs leading-5 text-slate-200">
              {tr("tagline")}
            </p>

            {/* RÉSEAUX SOCIAUX */}

            <div
              className="mt-5 flex items-center gap-5 text-white"
              aria-label={tr("networks")}
            >
              <span
                role="img"
                aria-label="Facebook"
                title="Facebook"
                className="inline-flex items-center"
              >
                <FaFacebookF size={19} />
              </span>

              <span
                role="img"
                aria-label="Instagram"
                title="Instagram"
                className="inline-flex items-center"
              >
                <FaInstagram size={19} />
              </span>

              <span
                role="img"
                aria-label="YouTube"
                title="YouTube"
                className="inline-flex items-center"
              >
                <FaYoutube size={19} />
              </span>

              <span
                role="img"
                aria-label="LinkedIn"
                title="LinkedIn"
                className="inline-flex items-center"
              >
                <FaLinkedinIn size={19} />
              </span>
            </div>
          </div>

          {/* ======================================= */}
          {/* BOUTIQUE                               */}
          {/* ======================================= */}

          <div>
            <h2 className="mb-4 text-sm font-bold">
              {tr("store")}
            </h2>

            {renderFooterLinks(
              storeLinks
            )}
          </div>

          {/* ======================================= */}
          {/* INFORMATIONS                          */}
          {/* ======================================= */}

          <div>
            <h2 className="mb-4 text-sm font-bold">
              {tr("information")}
            </h2>

            {renderFooterLinks(
              informationLinks
            )}
          </div>

          {/* ======================================= */}
          {/* AIDE                                  */}
          {/* ======================================= */}

          <div>
            <h2 className="mb-4 text-sm font-bold">
              {tr("help")}
            </h2>

            {renderFooterLinks(
              helpLinks
            )}
          </div>

          {/* ======================================= */}
          {/* NEWSLETTER                            */}
          {/* ======================================= */}

          <div className="col-span-2 border-slate-500/50 lg:col-span-1 lg:border-l lg:pl-6">
            <h2 className="mb-4 text-sm font-bold">
              {tr("newsletter")}
            </h2>

            <form
              onSubmit={newsletterSubmit}
              className="flex min-w-0 overflow-hidden rounded-lg bg-white shadow-sm"
            >
              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(
                    event.target.value
                  );
                  setMessage("");
                }}
                required
                autoComplete="email"
                aria-label={tr("email")}
                placeholder={tr("email")}
                className="min-w-0 flex-1 bg-white px-3 py-3 text-xs text-[#102b39] outline-none placeholder:text-slate-500"
              />

              <button
                type="submit"
                aria-label={tr("subscribe")}
                className="flex w-12 shrink-0 items-center justify-center bg-[#25b919] text-white transition-colors hover:bg-[#168e0a]"
              >
                <ArrowRight size={19} />
              </button>
            </form>

            <label className="mt-3 flex cursor-pointer items-start gap-2 text-[10px] leading-normal text-slate-200">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => {
                  setConsent(
                    event.target.checked
                  );

                  setMessage("");
                }}
                className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[#30bd21]"
              />

              <span>
                {tr("newsletterConsent")}
              </span>
            </label>

            {message && (
              <p
                role="status"
                aria-live="polite"
                className="mt-3 rounded-md bg-white/10 px-3 py-2 text-[11px] leading-relaxed text-lime-200"
              >
                {message}
              </p>
            )}
          </div>

          {/* ======================================= */}
          {/* MOYENS DE PAIEMENT                     */}
          {/* ======================================= */}

          <div className="col-span-2 border-slate-500/50 lg:col-span-1 lg:border-l lg:pl-6">
            <h2 className="mb-4 text-sm font-bold">
              {tr("payment")}
            </h2>

            <div
              className="flex flex-wrap items-center gap-2"
              aria-label={tr("payment")}
            >
              <span
                title="Visa"
                aria-label="Visa"
                className="flex h-9 w-18 items-center justify-center rounded-md bg-white shadow-sm"
              >
                <SiVisa
                  size={49}
                  className="text-[#17328a]"
                />
              </span>

              <span
                title="Mastercard"
                aria-label="Mastercard"
                className="flex h-9 w-18 items-center justify-center rounded-md bg-white shadow-sm"
              >
                <SiMastercard
                  size={42}
                  className="text-[#e84c20]"
                />
              </span>

              <span
                title="PayPal"
                aria-label="PayPal"
                className="flex h-9 w-19.5 items-center justify-center gap-1 rounded-md bg-white shadow-sm"
              >
                <SiPaypal
                  size={19}
                  className="text-[#003087]"
                />

                <span className="text-[13px] font-extrabold italic tracking-tight text-[#003087]">
                  PayPal
                </span>
              </span>

              <span
                title="SEPA"
                aria-label="SEPA"
                className="flex h-9 w-18 items-center justify-center rounded-md bg-white text-[16px] font-black italic tracking-tight text-[#124286] shadow-sm"
              >
                SEPA
              </span>
            </div>

            <p className="mt-3 text-[10px] leading-4 text-slate-300">
              {tr("paymentPreview")}
            </p>
          </div>
        </div>

        {/* ========================================= */}
        {/* COPYRIGHT ET LIENS LÉGAUX               */}
        {/* ========================================= */}

        <div className="mt-9 flex flex-col gap-3 border-t border-slate-500/60 pt-5 text-[11px] leading-relaxed text-slate-300 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()}{" "}
            CYCLORIVA. {tr("rights")}
          </p>

          <nav
            aria-label={tr("information")}
            className="flex flex-wrap items-center gap-x-3 gap-y-2"
          >
            {legalLinks.map(
              (item, index) => (
                <span
                  key={item.key}
                  className="inline-flex items-center gap-3"
                >
                  {index > 0 && (
                    <span
                      className="text-slate-500"
                      aria-hidden="true"
                    >
                      |
                    </span>
                  )}

                  <Link
                    href={item.href}
                    className="text-slate-300 transition-colors hover:text-[#75df40] focus-visible:text-[#75df40]"
                  >
                    {tr(item.key)}
                  </Link>
                </span>
              )
            )}
          </nav>
        </div>
      </div>
    </footer>
  );
}
