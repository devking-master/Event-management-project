import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  icon?: ReactNode;
  helper?: string;
  progress?: number;
  className?: string;
}

export default function StatCard({ title, value, icon, helper, progress = 66, className = "" }: StatCardProps) {
  return (
    <div className={`glass cyber-card group overflow-hidden p-4 transition duration-300 hover:-translate-y-1 hover:shadow-glow xs:p-5 sm:p-6 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-[10px] font-black uppercase tracking-[0.2em] text-white/45 sm:text-xs">
            {title}
          </p>
          <h3 className="mt-3 break-words text-2xl font-black leading-tight text-white xs:text-3xl lg:text-4xl">
            {value}
          </h3>
        </div>
        {icon && (
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5 text-neon-cyan sm:h-12 sm:w-12">
            {icon}
          </span>
        )}
      </div>

      {helper && <p className="mt-3 line-clamp-2 text-xs leading-5 text-white/45 sm:text-sm">{helper}</p>}

      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan transition-all duration-700"
          style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}
