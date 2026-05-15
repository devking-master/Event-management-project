"use client";

import type { LucideIcon } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  error?: string;
  helper?: string;
}

export default function Input({
  label,
  icon: Icon,
  error,
  helper,
  className = "",
  ...props
}: InputProps) {
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

        <input
          className={[
            "w-full min-h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-all",
            "placeholder:text-white/20 focus:border-neon-purple/50 focus:bg-white/[0.07] focus:shadow-glow sm:min-h-12 sm:rounded-2xl sm:text-base",
            "touch:min-h-12",
            Icon ? "pl-11 sm:pl-14" : "",
            error ? "border-rose-500/50 focus:border-rose-500/70" : "",
            className,
          ].join(" ")}
          {...props}
        />
      </div>

      {helper && !error && <p className="ml-1 text-xs leading-5 text-white/35">{helper}</p>}
      {error && <p className="ml-1 text-xs font-bold leading-5 text-rose-400">{error}</p>}
    </div>
  );
}
