"use client";
import Image from "next/image";

import Link from "next/link";
import { ProductCartLink } from "@/components/product/ProductCartLink";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Heart,
  Menu,
  Search,
  UserRound,
  X,
  Tag,
  Home,
  Bike,
  Package,
  Mail,
} from "lucide-react";

import {
  siteLocales,
  siteText,
  type SiteLocale,
  type SiteTextKey,
} from "@/lib/site-i18n";

type NavigationItem = {
  key: SiteTextKey;
  href: (locale: SiteLocale) => string;
  icon: typeof Bike;
  submenu?: boolean;
};

type SiteHeaderProps = {
  locale: SiteLocale;
  languageUrl?: (locale: string) => string;
};

const productPath = (locale: SiteLocale, search?: string) => {
  const base = `/${locale}/produits`;

  if (!search) return base;

  return `${base}?q=${encodeURIComponent(search)}`;
};

const navigationItems: NavigationItem[] = [
  {
    key: "home",
    href: (locale) => `/${locale}`,
    icon: Home,
  },
  {
    key: "electric",
    href: (locale) => productPath(locale, "électrique"),
    icon: Bike,
    submenu: true,
  },
  {
    key: "mtb",
    href: (locale) => productPath(locale, "VTT"),
    icon: Bike,
    submenu: true,
  },
  {
    key: "cargo",
    href: (locale) => productPath(locale, "cargo"),
    icon: Bike,
    submenu: true,
  },
  {
    key: "city",
    href: (locale) => productPath(locale, "ville"),
    icon: Bike,
    submenu: true,
  },
  {
    key: "accessories",
    href: (locale) => productPath(locale, "accessoire"),
    icon: Package,
    submenu: true,
  },
  {
    key: "brands",
    href: (locale) => productPath(locale),
    icon: Bike,
    submenu: true,
  },
  {
    key: "promotions",
    href: (locale) => productPath(locale),
    icon: Tag,
  },
  {
    key: "contact",
    href: (locale) => `/${locale}/contact`,
    icon: Mail,
  },
];

export function SiteHeader({ locale, languageUrl }: SiteHeaderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const drawerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const tr = (key: SiteTextKey) => siteText(locale, key);

  const currentPath = pathname ?? `/${locale}`;
  const isHomePage = currentPath.replace(/\/+$/, "") === `/${locale}`;

  const getLanguageUrl = (language: SiteLocale) => {
    if (languageUrl) {
      return languageUrl(language);
    }

    const segments = currentPath.split("/");

    if (segments.length > 1) {
      segments[1] = language;
    }

    const nextPath = segments.join("/");
    const query = searchParams.toString();

    return query ? `${nextPath}?${query}` : nextPath;
  };

  // Fermer les menus lors du changement de page.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setDrawerOpen(false);
      setSearchOpen(false);
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  // Gérer la fermeture du menu et le défilement mobile.
  useEffect(() => {
    if (!drawerOpen) return;

    const menuButton = menuButtonRef.current;
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;

    document.body.style.overflow = "hidden";

    const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );

    focusable?.[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDrawerOpen(false);
      }

      if (event.key === "Tab") {
        const elements = drawerRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );

        if (!elements || elements.length === 0) return;

        const first = elements[0];
        const last = elements[elements.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);

      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      } else {
        menuButton?.focus();
      }
    };
  }, [drawerOpen]);

  const languageLinks = (
    <nav
      aria-label={tr("languages")}
      className="flex items-center justify-center gap-1 text-[12px] font-semibold text-[#102b39]"
    >
      {siteLocales.map((language, index) => (
        <span key={language} className="inline-flex items-center gap-1">
          <Link
            href={getLanguageUrl(language)}
            lang={language}
            aria-current={locale === language ? "page" : undefined}
            onClick={() => setDrawerOpen(false)}
            className={`rounded-full px-2 py-1 transition-colors ${
              locale === language
                ? "bg-[#ddf6d6] text-[#168b11]"
                : "hover:bg-slate-100"
            }`}
          >
            {language.toUpperCase()}
          </Link>

          {index < siteLocales.length - 1 && (
            <span className="text-slate-300" aria-hidden="true">
              |
            </span>
          )}
        </span>
      ))}
    </nav>
  );

  return (
    <>
      <header className="relative z-40 w-full border-b border-slate-200 bg-white text-[#102b39] shadow-sm">
        {/* =========================================
            VERSION PC : EN-TÊTE PRINCIPAL
        ========================================= */}

        <div className="hidden h-19 w-full min-w-0 items-center gap-7 px-7 lg:flex xl:px-12">
          {/* LOGO OFFICIEL */}
          <Link href={`/${locale}`} className="shrink-0" aria-label="CYCLORIVA">
            <Image
              width={2172}
              height={724}
              sizes="(max-width: 639px) 144px, 160px"
              src="/images/logo.png"
              alt="CYCLORIVA"
              className="h-12 w-auto max-w-71.25 object-contain"
            />
          </Link>

          {/* RECHERCHE PC */}
          <form
            action={`/${locale}/produits`}
            method="GET"
            role="search"
            className="mx-auto flex h-11 min-w-0 max-w-122.5 flex-1 items-center overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm focus-within:border-[#2ebc18]"
          >
            <Search size={18} className="ml-4 shrink-0 text-slate-500" />

            <input
              type="search"
              name="q"
              aria-label={tr("searchButton")}
              placeholder={tr("search")}
              className="min-w-0 flex-1 bg-transparent px-3 text-sm text-[#102b39] outline-none"
            />

            <button
              type="submit"
              aria-label={tr("searchButton")}
              className="flex h-full w-14 items-center justify-center bg-[#24b715] text-white transition-colors hover:bg-[#159707]"
            >
              <Search size={20} />
            </button>
          </form>

          {/* LANGUES PC */}
          {languageLinks}

          {/* ACTIONS PC */}
          <div className="flex shrink-0 items-center gap-4">
            <button
              type="button"
              disabled
              title={tr("soon")}
              aria-label={`${tr("account")} — ${tr("soon")}`}
              className="opacity-60"
            >
              <UserRound size={23} />
            </button>

            <Link href={"/" + locale + "/favoris"} aria-label={tr("favorites")}>
              <Heart size={24} />
            </Link>

            <ProductCartLink locale={locale} />
          </div>
        </div>

        {/* =========================================
            VERSION PC : MENU HORIZONTAL
        ========================================= */}

        <nav
          aria-label={tr("menu")}
          className="hidden h-13.25 w-full min-w-0 items-center justify-between gap-1 overflow-x-auto border-t border-slate-100 px-7 lg:flex xl:gap-3 xl:px-12"
        >
          {navigationItems.map((item) => (
            <Link
              key={item.key}
              href={item.href(locale)}
              aria-current={
                item.key === "home" && isHomePage ? "page" : undefined
              }
              className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md px-3 text-[13px] font-bold transition-colors ${
                item.key === "home" && isHomePage
                  ? "bg-[#24b715] text-white"
                  : item.key === "promotions"
                    ? "text-[#16a007] hover:bg-green-50"
                    : "hover:bg-slate-100"
              }`}
            >
              {item.key === "promotions" && <Tag size={15} />}

              <span>{tr(item.key)}</span>

              {item.submenu && <ChevronDown size={13} aria-hidden="true" />}
            </Link>
          ))}
        </nav>

        {/* =========================================
            VERSION MOBILE : EN-TÊTE
        ========================================= */}

        <div className="flex h-17.25 items-center gap-2 px-3 sm:px-5 lg:hidden">
          {/* BOUTON MENU */}
          <button
            ref={menuButtonRef}
            type="button"
            aria-label={tr("menu")}
            aria-expanded={drawerOpen}
            aria-controls="cycloriva-mobile-menu"
            onClick={() => setDrawerOpen(true)}
            className="rounded-md p-1.5 hover:bg-slate-100"
          >
            <Menu size={27} />
          </button>

          {/* LOGO */}
          <Link
            href={`/${locale}`}
            className="min-w-0 flex-1"
            aria-label="CYCLORIVA"
          >
            <Image
              width={2172}
              height={724}
              sizes="(max-width: 639px) 144px, 160px"
              src="/images/logo.png"
              alt="CYCLORIVA"
              className="h-9.25 w-auto max-w-47.5 object-contain object-left sm:max-w-57.5"
            />
          </Link>

          {/* RECHERCHE */}
          <button
            type="button"
            aria-label={tr("searchButton")}
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((open) => !open)}
            className="rounded-md p-1.5 hover:bg-slate-100"
          >
            <Search size={22} />
          </button>

          {/* COMPTE */}
          <button
            type="button"
            disabled
            title={tr("soon")}
            aria-label={`${tr("account")} — ${tr("soon")}`}
            className="rounded-md p-1 opacity-60"
          >
            <UserRound size={21} />
          </button>

          {/* PANIER */}
          <ProductCartLink locale={locale} />
        </div>

        {/* LANGUES MOBILE */}
        <div className="flex h-11 items-center justify-center border-t border-slate-100 lg:hidden">
          {languageLinks}
        </div>

        {/* RECHERCHE MOBILE DÉPLIABLE */}
        {searchOpen && (
          <form
            action={`/${locale}/produits`}
            method="GET"
            role="search"
            className="flex gap-2 border-t border-slate-100 p-3 lg:hidden"
          >
            <input
              type="search"
              name="q"
              aria-label={tr("searchButton")}
              placeholder={tr("search")}
              autoFocus
              className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#24b715]"
            />

            <button
              type="submit"
              aria-label={tr("searchButton")}
              className="rounded-md bg-[#24b715] px-4 text-white"
            >
              <Search size={19} />
            </button>
          </form>
        )}
      </header>

      {/* =========================================
          MENU LATÉRAL MOBILE
      ========================================= */}

      {drawerOpen && (
        <div
          id="cycloriva-mobile-menu"
          className="fixed inset-0 z-100 lg:hidden"
        >
          {/* FOND SOMBRE */}
          <button
            type="button"
            className="absolute inset-0 bg-[#071827]/60"
            aria-label={tr("close")}
            onClick={() => setDrawerOpen(false)}
          />

          {/* PANNEAU DU MENU */}
          <aside
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label={tr("menu")}
            className="absolute left-0 top-0 flex h-full w-[min(88vw,370px)] flex-col overflow-y-auto bg-white shadow-2xl"
          >
            {/* HAUT DU PANNEAU */}
            <div className="flex min-h-24 items-center justify-between gap-3 bg-[#102b39] px-4">
              <div className="rounded-md bg-white px-2 py-1">
                <Image
                  width={2172}
                  height={724}
                  sizes="(max-width: 639px) 144px, 160px"
                  src="/images/logo.png"
                  alt="CYCLORIVA"
                  className="h-auto w-auto max-h-12 max-w-52.5 object-contain"
                />
              </div>

              <button
                type="button"
                aria-label={tr("close")}
                onClick={() => setDrawerOpen(false)}
                className="rounded p-2 text-white hover:bg-white/10"
              >
                <X size={24} />
              </button>
            </div>

            {/* LIENS DU MENU */}
            <nav aria-label={tr("menu")} className="flex-1 p-4">
              {navigationItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.key}
                    href={item.href(locale)}
                    aria-current={
                      item.key === "home" && isHomePage ? "page" : undefined
                    }
                    onClick={() => setDrawerOpen(false)}
                    className={`flex min-h-14 items-center gap-4 border-b border-slate-100 px-3 py-2 text-[15px] font-semibold transition-colors ${
                      item.key === "home" && isHomePage
                        ? "rounded-lg bg-[#ebf9e6] text-[#148f0a]"
                        : item.key === "promotions"
                          ? "text-[#179e0a] hover:bg-green-50"
                          : "text-[#102b39] hover:bg-slate-50"
                    }`}
                  >
                    <Icon size={22} strokeWidth={1.7} />

                    <span className="flex-1">{tr(item.key)}</span>

                    {item.key !== "home" && (
                      <ChevronRight size={18} className="text-slate-400" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* BAS DU MENU */}
            <div className="border-t border-slate-200 bg-slate-50 px-4 py-5">
              {languageLinks}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
