"use client";

import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface ButtonProps extends HTMLMotionProps<"button"> {
  children?: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "neon" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  icon?: LucideIcon;
  loading?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  loading = false,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-purple-600 text-white shadow-glow hover:bg-purple-500",
    secondary: "border border-white/10 bg-white/10 text-white hover:bg-white/20",
    outline: "border border-white/20 bg-transparent text-white hover:bg-white/5",
    ghost: "bg-transparent text-white/60 hover:bg-white/5 hover:text-white",
    neon: "bg-neon-purple text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]",
    danger: "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20",
  };

  const sizes = {
    sm: "px-3 py-2 text-xs sm:px-4 sm:py-2.5 sm:text-sm",
    md: "px-4 py-2.5 text-sm sm:px-6 sm:py-3 sm:text-base",
    lg: "px-5 py-3 text-sm sm:px-8 sm:py-4 sm:text-lg",
    xl: "px-6 py-3.5 text-base sm:px-10 sm:py-5 sm:text-xl",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={[
        "relative inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl font-bold transition-all",
        "disabled:pointer-events-none disabled:opacity-50 sm:rounded-2xl",
        "touch:min-h-12 touch:min-w-12",
        fullWidth ? "w-full" : "",
        variants[variant],
        sizes[size],
        className,
      ].join(" ")}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
        />
      ) : (
        <>
          {Icon ? <Icon size={18} className="shrink-0" /> : null}
          {children ? <span className="truncate">{children}</span> : null}
        </>
      )}
    </motion.button>
  );
}