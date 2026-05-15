"use client";

import { ChevronDown, type LucideIcon } from "lucide-react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  icon?: LucideIcon;
  error?: string;
  helper?: string;
  options: { label: string; value: string | number }[];
}

export default function Select({
  label,
  icon: Icon,
  error,
  helper,
  options,
  className = "",
  ...props
}: SelectProps) {
  return (
    <div className="min-w-0 space-y-2">
      {label && (
        <label className="ml-1 block text-[11px] font-black uppercase tracking-[0.18em] text-white/45 sm:text-xs sm:tracking-[0.22em]">
          {label}
        </label>
      )}

      <div className="group relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25 transition-colors group-focus-within:text-neon-purple sm:left-5 sm:h-[18px] sm:w-[18px]" />
        )}

        <select
          className={[
            "w-full min-h-11 appearance-none rounded-xl border border-white/10 bg-[#05050b] px-4 py-3 pr-11 text-sm text-white outline-none transition-all",
            "focus:border-neon-purple/50 focus:bg-[#090914] focus:shadow-glow sm:min-h-12 sm:rounded-2xl sm:text-base",
            "touch:min-h-12",
            Icon ? "pl-11 sm:pl-14" : "",
            error ? "border-rose-500/50 focus:border-rose-500/70" : "",
            className,
          ].join(" ")}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#05050b] text-white">
              {opt.label}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25 transition-colors group-focus-within:text-neon-purple sm:right-5" />
      </div>

      {helper && !error && <p className="ml-1 text-xs leading-5 text-white/35">{helper}</p>}
      {error && <p className="ml-1 text-xs font-bold leading-5 text-rose-400">{error}</p>}
    </div>
  );
}
