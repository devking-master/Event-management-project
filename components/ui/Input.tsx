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
    <div className="min-w-0 space-y-1.5">
      {label && (
        <label className="ml-0.5 block text-[11px] font-extrabold uppercase tracking-[0.14em] text-white/45">
          {label}
        </label>
      )}

      <div className="group relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25 transition-colors group-focus-within:text-neon-purple sm:left-4" />
        )}

        <input
          className={[
            "w-full min-h-11 rounded-xl border border-white/10 bg-white/[0.035] px-3.5 py-2.5 text-sm text-white outline-none transition-all",
            "placeholder:text-white/20 focus:border-neon-purple/50 focus:bg-white/[0.06]",
            "sm:min-h-11 sm:rounded-2xl sm:px-4",
            Icon ? "pl-10 sm:pl-11" : "",
            error ? "border-rose-500/50 focus:border-rose-500/70" : "",
            className,
          ].join(" ")}
          {...props}
        />
      </div>

      {helper && !error && <p className="ml-0.5 text-xs leading-5 text-white/35">{helper}</p>}
      {error && <p className="ml-0.5 text-xs font-bold leading-5 text-rose-400">{error}</p>}
    </div>
  );
}
