"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  error?: string;
}

export default function Input({
  label,
  icon: Icon,
  error,
  className = "",
  ...props
}: InputProps) {
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
        <input
          className={`w-full rounded-2xl border border-white/10 bg-white/5 p-4 outline-none transition-all placeholder:text-white/20 focus:border-neon-purple/50 focus:bg-white/[0.08] focus:shadow-glow ${
            Icon ? "pl-14" : ""
          } ${error ? "border-rose-500/50" : ""} ${className}`}
          {...props}
        />
        {/* Animated focus border */}
        <motion.div 
          className="absolute inset-0 rounded-2xl border border-neon-purple opacity-0 pointer-events-none"
          initial={false}
          animate={{ opacity: 0 }}
          whileFocus={{ opacity: 0.3 }}
        />
      </div>
      {error && <p className="ml-1 text-xs font-bold text-rose-400">{error}</p>}
    </div>
  );
}
