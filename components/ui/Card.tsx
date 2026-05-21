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
  hoverGlow = false,
}: CardProps) {
  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 14 } : false}
      whileInView={animate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay }}
      whileHover={hoverGlow ? { y: -2 } : undefined}
      className={[
        "glass group relative min-w-0 rounded-2xl p-4",
        "sm:rounded-3xl sm:p-5 lg:p-6",
        "transition-shadow duration-300",
        hoverGlow ? "hover:shadow-glow" : "",
        className,
      ].join(" ")}
    >
      {hoverGlow && (
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-neon-purple/5 via-transparent to-neon-cyan/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      )}

      <div className="relative z-10 min-w-0">{children}</div>
    </motion.div>
  );
}
