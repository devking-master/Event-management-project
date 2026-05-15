import type { ReactNode } from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  className?: string;
}

export default function FeatureCard({ title, description, icon, className = "" }: FeatureCardProps) {
  return (
    <article
      className={`glass group relative overflow-hidden rounded-2xl p-4 transition duration-300 hover:-translate-y-1 hover:border-neon-cyan/30 hover:shadow-glow-cyan xs:rounded-3xl xs:p-5 sm:p-6 ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 via-transparent to-neon-cyan/5 opacity-0 transition duration-500 group-hover:opacity-100" />
      <div className="relative z-10">
        <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/10 text-neon-cyan shadow-glow-cyan sm:h-14 sm:w-14">
          {icon}
        </div>
        <h3 className="text-lg font-black leading-tight text-white sm:text-xl">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-white/60 sm:text-base sm:leading-7">{description}</p>
      </div>
    </article>
  );
}
