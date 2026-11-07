"use client";

import { useId, useState } from "react";
import type { SiteLocale } from "@/lib/site-i18n";
import { normalizePriceRange, type PriceRangeBounds } from "@/lib/catalog-price-range";
import "./CatalogPriceFilter.css";

type Props = {
  bounds: PriceRangeBounds;
  min: number | null;
  max: number | null;
  locale: SiteLocale;
  minLabel: string;
  maxLabel: string;
  onChange: (min: number | null, max: number | null) => void;
};

export function CatalogPriceFilter({ bounds, min, max, locale, minLabel, maxLabel, onChange }: Props) {
  const id = useId();
  const source = `${bounds.min}:${bounds.max}:${min}:${max}`;
  const initial = { source, min: min === null ? "" : String(min), max: max === null ? "" : String(max) };
  const [draft, setDraft] = useState(initial);
  // Synchronize URL/back/reset changes without remounting the focused control.
  let current = draft;
  if (draft.source !== source) {
    current = initial;
    setDraft(initial);
  }
  const number = (value: string) => value.trim() === "" ? null : Number(value.replace(",", "."));
  const range = normalizePriceRange(bounds, number(current.min), number(current.max));
  const disabled = bounds.max <= bounds.min;
  const percent = (value: number) => disabled ? 0 : (value - bounds.min) / (bounds.max - bounds.min) * 100;
  const money = (value: number) => new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(value);

  function move(side: "min" | "max", value: number) {
    const next = normalizePriceRange(bounds, side === "min" ? value : range.min, side === "max" ? value : range.max, side);
    setDraft({ source, min: String(next.min), max: String(next.max) });
  }

  function commit(side: "min" | "max", value?: number) {
    const rawMin = side === "min" && value !== undefined ? value : number(current.min);
    const rawMax = side === "max" && value !== undefined ? value : number(current.max);
    const next = normalizePriceRange(bounds, rawMin, rawMax, side);
    const nextMin = rawMin === null ? null : next.min;
    const nextMax = rawMax === null ? null : next.max;
    setDraft({ source, min: nextMin === null ? "" : String(nextMin), max: nextMax === null ? "" : String(nextMax) });
    if (nextMin !== min || nextMax !== max) onChange(nextMin, nextMax);
  }

  return (
    <div className="catalog-price-filter space-y-3">
      <div className="catalog-price-filter__slider" onPointerDown={event => {
        if (disabled || event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left - 9) / Math.max(1, rect.width - 18)));
        const value = bounds.min + ratio * (bounds.max - bounds.min);
        const side = Math.abs(value - range.min) <= Math.abs(value - range.max) ? "min" : "max";
        move(side, value);
        commit(side, value);
      }}>
        <div className="catalog-price-filter__track" aria-hidden="true">
          <div className="catalog-price-filter__selection" style={{ left: `${percent(range.min)}%`, right: `${100 - percent(range.max)}%` }} />
        </div>
        {(["min", "max"] as const).map(side => (
          <input key={side} type="range" min={bounds.min} max={bounds.max} step="0.01"
            value={range[side]} disabled={disabled}
            aria-label={side === "min" ? minLabel : maxLabel}
            aria-valuetext={money(range[side])}
            aria-valuemin={side === "max" ? range.min : bounds.min}
            aria-valuemax={side === "min" ? range.max : bounds.max}
            className="catalog-price-filter__range"
            style={{ zIndex: side === "min" ? (percent(range.min) >= 50 ? 3 : 2) : (percent(range.max) <= 50 ? 3 : 2) }}
            onChange={event => move(side, event.currentTarget.valueAsNumber)}
            onPointerUp={event => commit(side, event.currentTarget.valueAsNumber)}
            onBlur={() => commit(side)}
            onKeyUp={event => {
              if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"].includes(event.key)) commit(side, event.currentTarget.valueAsNumber);
            }} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {(["min", "max"] as const).map(side => (
          <label key={side} htmlFor={`${id}-${side}`} className="block min-w-0">
            <span className="mb-1 block text-[11px] font-semibold text-[#102b39]">{side === "min" ? minLabel : maxLabel}</span>
            <input id={`${id}-${side}`} type="number" inputMode="decimal" step="0.01"
              min={side === "max" ? range.min : bounds.min} max={side === "min" ? range.max : bounds.max}
              value={current[side]} placeholder={String(bounds[side])}
              onChange={event => setDraft({ ...current, [side]: event.currentTarget.value })}
              onBlur={() => commit(side)}
              onKeyDown={event => { if (event.key === "Enter") event.currentTarget.blur(); }}
              className="h-9 w-full min-w-0 rounded-md border border-slate-300 bg-white px-2.5 text-xs font-semibold text-[#102b39] outline-none focus:border-[#24b715] focus:ring-1 focus:ring-[#24b715]" />
          </label>
        ))}
      </div>
      <div className="flex justify-between gap-2 text-[10px] text-slate-500"><span>{money(bounds.min)}</span><span>{money(bounds.max)}</span></div>
    </div>
  );
}
