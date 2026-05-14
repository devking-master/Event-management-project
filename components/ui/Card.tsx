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
      initial={animate ? { opacity: 0, y: 20 } : false}
      whileInView={animate ? { opacity: 1, y: 0 } : false}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={hoverGlow ? { y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.4)" } : {}}
      className={`glass group relative overflow-hidden rounded-[2.5rem] p-8 ${className}`}
    >
      {/* Subtle interior glow on hover */}
      {hoverGlow && (
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 via-transparent to-neon-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}
      
      {/* Decorative corner element */}
      <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
