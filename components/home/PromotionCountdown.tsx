"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";
import type { SiteLocale } from "@/lib/site-i18n";
import { PROMOTION_CYCLE_START, promotionTimeRemaining } from "@/lib/promotion-countdown";

const copy = {
  fr: { title: "Cycle promotionnel de 78 h", note: "", units: ["Jours", "Heures", "Minutes", "Secondes"] },
  en: { title: "78-hour promotional cycle", note: "Cycle renews automatically", units: ["Days", "Hours", "Minutes", "Seconds"] },
  de: { title: "78-Stunden-Aktionszyklus", note: "Der Zyklus erneuert sich automatisch", units: ["Tage", "Stunden", "Minuten", "Sekunden"] },
  es: { title: "Ciclo promocional de 78 h", note: "El ciclo se renueva automáticamente", units: ["Días", "Horas", "Minutos", "Segundos"] },
  it: { title: "Ciclo promozionale di 78 ore", note: "Il ciclo si rinnova automaticamente", units: ["Giorni", "Ore", "Minuti", "Secondi"] },
};

export function PromotionCountdown({ locale }: { locale: SiteLocale }) {
  const [remaining, setRemaining] = useState(() => promotionTimeRemaining(PROMOTION_CYCLE_START));
  useEffect(() => {
    const update = () => setRemaining(promotionTimeRemaining(Date.now()));
    update();
    const timer = window.setInterval(update, 1000);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  const text = copy[locale];
  return (
    <div className="rounded-xl border border-lime-300/25 bg-black/15 p-3 sm:p-4">
      <p className="mb-3 flex items-center gap-2 text-xs font-bold text-lime-200"><Clock3 size={15} aria-hidden="true" />{text.title}</p>
      <div role="timer" aria-label={text.title} aria-live="off" className="grid grid-cols-4 gap-2">
        {Object.values(remaining).map((value, index) => (
          <div key={index} className="min-w-0 text-center">
            <span className="block rounded-lg border border-lime-200/25 bg-[#0a202b] py-3 font-mono text-2xl font-black tabular-nums text-lime-300 shadow-[inset_0_1px_0_#ffffff14] sm:text-3xl">{String(value).padStart(2, "0")}</span>
            <span className="mt-1.5 block text-[9px] font-semibold text-white/80 sm:text-[10px]">{text.units[index]}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[10px] text-white/65">{text.note}</p>
    </div>
  );
}
