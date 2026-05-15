import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      screens: {
        "xs": "380px",
        "sm": "640px",
        "md": "768px",
        "lg": "1024px",
        "xl": "1280px",
        "2xl": "1536px",
        "3xl": "1920px",
        "touch": { "raw": "(hover: none) and (pointer: coarse)" },
      },
      colors: {
        night: "#020205",
        ink: "#080812",
        "ink-light": "#0c0c1d",
        panel: "rgba(255,255,255,0.03)",
        neon: {
          purple: "#a855f7",
          cyan: "#22d3ee",
          pink: "#f472b6",
        },
        accent: {
          100: "rgba(168, 85, 247, 0.1)",
          200: "rgba(168, 85, 247, 0.2)",
        }
      },
      boxShadow: {
        glow: "0 0 25px rgba(168, 85, 247, 0.25)",
        "glow-cyan": "0 0 25px rgba(34, 211, 238, 0.2)",
        "glow-pink": "0 0 25px rgba(244, 114, 182, 0.2)",
        "glass": "inset 0 0 0 1px rgba(255, 255, 255, 0.05)",
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)",
        "radial-gradient": "radial-gradient(circle at center, var(--tw-gradient-from), var(--tw-gradient-to))",
        "conic-gradient": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-from), var(--tw-gradient-to))",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2s linear infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      spacing: {
        "touch-sm": "2.75rem",
        "touch-md": "3rem",
        "touch-lg": "3.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
