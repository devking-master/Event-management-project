import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  icon?: ReactNode;
}

export default function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="glass cyber-card group p-6 transition duration-300 hover:-translate-y-1 hover:shadow-glow">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/45">{title}</p>
        <span className="text-cyan-300">{icon}</span>
      </div>
      <h3 className="mt-5 text-4xl font-black">{value}</h3>
      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-purple-500 to-cyan-300" />
      </div>
    </div>
  );
}
