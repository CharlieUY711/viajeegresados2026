"use client";

import { useLang, type LangCode } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const FLAGS: Record<LangCode, string> = {
  es: "🇦🇷",
  pt: "🇧🇷",
};

const LABELS: Record<LangCode, string> = {
  es: "ES",
  pt: "PT",
};

export function LangSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useLang();

  return (
    <div
      className={cn(
        "flex items-center gap-0.5 bg-navy-50 border border-cream-200 rounded-lg p-0.5",
        className
      )}
    >
      {(["es", "pt"] as LangCode[]).map((code) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          title={code === "es" ? "Español" : "Português"}
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold transition-all",
            lang === code
              ? "bg-navy-900 text-white shadow-sm"
              : "text-navy-400 hover:text-navy-700"
          )}
        >
          <span>{FLAGS[code]}</span>
          <span>{LABELS[code]}</span>
        </button>
      ))}
    </div>
  );
}
