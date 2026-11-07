"use client";

import { useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { SiteLocale } from "@/lib/site-i18n";

const labels = {
  fr: ["Produits précédents", "Produits suivants"],
  en: ["Previous products", "Next products"],
  de: ["Vorherige Produkte", "Weitere Produkte"],
  it: ["Prodotti precedenti", "Prodotti successivi"],
  es: ["Productos anteriores", "Productos siguientes"],
};

export function ProductRelatedRail({ children, locale, title }: { children: ReactNode; locale: SiteLocale; title: string }) {
  const rail = useRef<HTMLDivElement>(null);
  const drag = useRef({ start: 0, scroll: 0, active: false, moved: false });
  function move(direction: number) {
    const element = rail.current;
    if (element) element.scrollBy({ left: direction * element.clientWidth * 0.85, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  return <div className="product-related-carousel">
    <div className="product-related-controls">
      <button type="button" onClick={() => move(-1)} aria-label={labels[locale][0]}><ChevronLeft size={18}/></button>
      <button type="button" onClick={() => move(1)} aria-label={labels[locale][1]}><ChevronRight size={18}/></button>
    </div>
    <div ref={rail} className="product-related-rail" role="region" aria-label={title} tabIndex={0}
      onDragStart={(event) => event.preventDefault()}
      onPointerDown={(event) => {
        if (event.pointerType !== "mouse" || event.button !== 0) return;
        drag.current = { start: event.clientX, scroll: event.currentTarget.scrollLeft, active: true, moved: false };
      }}
      onPointerMove={(event) => {
        const state = drag.current;
        if (!state.active || event.buttons !== 1) return;
        const delta = event.clientX - state.start;
        if (Math.abs(delta) > 6) {
          state.moved = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          event.currentTarget.scrollLeft = state.scroll - delta;
        }
      }}
      onPointerUp={() => { drag.current.active = false; }}
      onPointerCancel={() => { drag.current.active = false; }}
      onClickCapture={(event) => {
        if (drag.current.moved) { event.preventDefault(); event.stopPropagation(); drag.current.moved = false; }
      }}
    >{children}</div>
  </div>;
}
