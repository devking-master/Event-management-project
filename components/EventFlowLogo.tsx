"use client";

import React from "react";

interface EventFlowLogoProps {
  size?: number;
  variant?: "full" | "icon-only" | "dark" | "transparent";
  animated?: boolean;
  className?: string;
  showText?: boolean;
}

export const EventFlowLogo: React.FC<EventFlowLogoProps> = ({
  size = 56,
  variant = "full",
  animated = true,
  className = "",
  showText = true,
}) => {
  const isIconOnly = variant === "icon-only" || !showText;

  return (
    <div className={`inline-flex items-center gap-2 sm:gap-3 ${className}`}>
      <div
        style={{ width: size, height: size }}
        className={[
          "relative grid shrink-0 place-items-center overflow-hidden",
          "rounded-2xl border border-white/10 bg-white/[0.04] shadow-glow backdrop-blur-xl",
          "max-[380px]:rounded-xl",
          animated ? "group" : "",
          variant === "dark" ? "bg-black/70" : "",
          variant === "transparent" ? "bg-transparent shadow-none" : "",
        ].join(" ")}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/25 via-neon-pink/10 to-neon-cyan/20" />
        <div className="absolute -inset-8 rounded-full bg-neon-purple/20 blur-2xl transition duration-500 group-hover:bg-neon-cyan/20" />
        <div className="absolute inset-[18%] rounded-full border border-neon-purple/60 shadow-glow transition duration-700 group-hover:rotate-180" />
        <div className="absolute inset-[30%] rounded-full border border-neon-cyan/60 transition duration-700 group-hover:-rotate-180" />
        <span className="relative bg-gradient-to-br from-white via-neon-cyan to-neon-purple bg-clip-text text-[1.45rem] font-black leading-none text-transparent drop-shadow-[0_0_18px_rgba(168,85,247,.5)] sm:text-[1.65rem]">
          E
        </span>
      </div>

      {!isIconOnly && (
        <div className="hidden min-w-0 flex-col leading-none xs:flex">
          <span className="truncate text-lg font-black tracking-tight text-white sm:text-xl md:text-2xl">
            Event<span className="text-neon-cyan">Flow</span>
          </span>
          <span className="mt-1 hidden truncate text-[9px] font-bold uppercase tracking-[0.25em] text-white/35 sm:block">
            Event Management
          </span>
        </div>
      )}
    </div>
  );
};

export default EventFlowLogo;
