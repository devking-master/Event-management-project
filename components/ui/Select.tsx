"use client";

import { motion } from "framer-motion";
import { LucideIcon, ChevronDown } from "lucide-react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  icon?: LucideIcon;
  error?: string;
  options: { label: string; value: string | number }[];
}

export default function Select({
  label,
  icon: Icon,
  error,
  options,
  className = "",
  ...props
}: SelectProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="ml-1 text-xs font-bold uppercase tracking-[0.2em] text-white/40">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 transition-colors group-focus-within:text-neon-purple" size={18} />
        )}
        <select
          className={`w-full rounded-2xl border border-white/10 bg-night p-4 outline-none transition-all appearance-none cursor-pointer focus:border-neon-purple/50 focus:bg-white/[0.08] focus:shadow-glow ${
            Icon ? "pl-14" : "pl-5"
          } pr-12 text-white ${error ? "border-rose-500/50" : ""} ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-night text-white py-2">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 group-focus-within:text-neon-purple transition-colors">
          <ChevronDown size={18} />
        </div>
      </div>
      {error && <p className="ml-1 text-xs font-bold text-rose-400">{error}</p>}
    </div>
  );
}
