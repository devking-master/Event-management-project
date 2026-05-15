"use client";

import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  delay?: number;
  hoverGlow?: boolean;
}

export default function Card({
  children,
  className = "",
  animate = true,
  delay = 0,
  hoverGlow = true,
}: CardProps) {
  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 16 } : false}
      whileInView={animate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay }}
      whileHover={hoverGlow ? { y: -3 } : undefined}
      className={[
        "glass group relative min-w-0 overflow-hidden rounded-2xl p-4",
        "xs:p-5 sm:rounded-3xl sm:p-6 md:p-8",
        "transition-shadow duration-300 hover:shadow-glow",
        className,
      ].join(" ")}
    >
      {hoverGlow && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-neon-purple/5 via-transparent to-neon-cyan/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      )}

      <div className="pointer-events-none absolute right-0 top-0 h-20 w-20 bg-gradient-to-bl from-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:h-28 sm:w-28" />

      <div className="relative z-10 min-w-0">{children}</div>
    </motion.div>
  );
}
