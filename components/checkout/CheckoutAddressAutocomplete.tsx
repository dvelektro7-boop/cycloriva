"use client";
import { useEffect, useRef, useState, type InputHTMLAttributes } from "react";
import {
  ADDRESS_SUGGESTION_TEXT,
  type AddressSuggestion,
} from "@/lib/checkout-address-suggestions";
import type { CheckoutCountryCode } from "@/lib/checkout-countries";
import type { CheckoutLocale } from "@/lib/checkout-i18n";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  country: CheckoutCountryCode | "";
  locale: CheckoutLocale;
  mode: "street" | "postal";
  city?: string;
  postalCode?: string;
  onSelectAddress: (suggestion: AddressSuggestion) => void;
};
export default function CheckoutAddressAutocomplete({
  country,
  locale,
  mode,
  city = "",
  postalCode = "",
  onSelectAddress,
  onChange,
  onBlur,
  value,
  ...input
}: Props) {
  const text = ADDRESS_SUGGESTION_TEXT[locale];
  const [open, setOpen] = useState(false);
  const [manual, setManual] = useState(false);
  const [active, setActive] = useState(-1);
  const [result, setResult] = useState<{
    key: string;
    status: "loading" | "ready" | "error";
    items: AddressSuggestion[];
  } | null>(null);
  const cache = useRef(new Map<string, AddressSuggestion[]>());
  const typed = String(value || "").trim();
  const query =
    mode === "street"
      ? [typed, postalCode, city].filter(Boolean).join(" ").slice(0, 255)
      : typed;
  const key =
    country && typed.length >= 3 && !input.disabled && open && !manual
      ? JSON.stringify({ query, country, locale, mode })
      : "";
  const current = result?.key === key ? result : null;
  const items = current?.items || [];
  const listId = `${input.id}-suggestions`;
  useEffect(() => {
    if (!key) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      const saved = cache.current.get(key);
      if (saved) {
        setResult({ key, status: "ready", items: saved });
        return;
      }
      setResult({ key, status: "loading", items: [] });
      try {
        const response = await fetch("/api/checkout/address-suggestions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: key,
          signal: AbortSignal.any([
            controller.signal,
            AbortSignal.timeout(6000),
          ]),
          cache: "no-store",
        });
        if (!response.ok) throw new Error("UNAVAILABLE");
        const data = await response.json();
        if (controller.signal.aborted) return;
        const suggestions: AddressSuggestion[] = Array.isArray(data.suggestions)
          ? data.suggestions
          : [];
        if (cache.current.size >= 20) cache.current.clear();
        cache.current.set(key, suggestions);
        setResult({ key, status: "ready", items: suggestions });
      } catch {
        if (!controller.signal.aborted)
          setResult({ key, status: "error", items: [] });
      }
    }, 600);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [key]);
  function select(suggestion: AddressSuggestion) {
    onSelectAddress(suggestion);
    setOpen(false);
    setManual(true);
    setActive(-1);
  }
  const expanded = Boolean(key && current);
  return (
    <div
      className="checkout-address-autocomplete"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
          setActive(-1);
        }
      }}
    >
      <input
        {...input}
        value={value}
        onChange={(event) => {
          setManual(false);
          setOpen(true);
          setActive(-1);
          onChange?.(event);
        }}
        onFocus={(event) => {
          setOpen(true);
          input.onFocus?.(event);
        }}
        onBlur={onBlur}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={expanded}
        aria-controls={expanded ? listId : undefined}
        aria-activedescendant={
          expanded && active >= 0 && items[active]
            ? `${listId}-${active}`
            : undefined
        }
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setOpen(false);
            setManual(true);
            setActive(-1);
            return;
          }
          if (
            expanded &&
            items.length &&
            (event.key === "ArrowDown" || event.key === "ArrowUp")
          ) {
            event.preventDefault();
            setActive((index) =>
              event.key === "ArrowDown"
                ? (index + 1) % items.length
                : index <= 0
                  ? items.length - 1
                  : index - 1,
            );
          }
          if (
            event.key === "Enter" &&
            expanded &&
            active >= 0 &&
            items[active]
          ) {
            event.preventDefault();
            select(items[active]);
          }
          input.onKeyDown?.(event);
        }}
      />
      {expanded && (
        <div
          className="checkout-address-suggestions"
          data-component="address-suggestions"
        >
          <div id={listId} role="listbox" aria-label={text.label}>
            {items.map((suggestion, index) => (
              <button
                type="button"
                tabIndex={-1}
                role="option"
                aria-selected={active === index}
                id={`${listId}-${index}`}
                key={suggestion.label}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => select(suggestion)}
              >
                {suggestion.label}
              </button>
            ))}
          </div>
          {current && current.status !== "ready" && (
            <p role="status">
              {current.status === "loading" ? text.loading : text.unavailable}
            </p>
          )}
          {current?.status === "ready" && !items.length && (
            <p role="status">{text.empty}</p>
          )}
          <button
            type="button"
            className="checkout-address-manual"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              setOpen(false);
              setManual(true);
              setActive(-1);
            }}
          >
            {text.manual}
          </button>
          <small>
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noreferrer"
              onMouseDown={(event) => event.preventDefault()}
            >
              © OpenStreetMap
            </a>{" "}
            · Photon
          </small>
        </div>
      )}
    </div>
  );
}
