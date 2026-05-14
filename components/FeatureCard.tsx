import type { ReactNode } from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
}

export default function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="glass rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:shadow-cyan">
      <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-cyan-300">
        {icon}
      </div>
      <h3 className="text-xl font-black">{title}</h3>
      <p className="mt-3 leading-7 text-white/60">{description}</p>
    </div>
  );
}
