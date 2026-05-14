import { Activity } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6">
      <div className="relative h-20 w-20">
        <div className="absolute inset-0 animate-ping rounded-full bg-neon-purple/20" />
        <div className="relative flex h-full w-full items-center justify-center rounded-full border-2 border-neon-purple/20 border-t-neon-purple shadow-glow">
          <Activity className="text-neon-purple animate-pulse" size={32} />
        </div>
      </div>
      <div className="space-y-2 text-center">
        <h2 className="text-sm font-black uppercase tracking-[0.4em] text-white/40">Loading...</h2>
        <div className="flex justify-center gap-1">
          <div className="h-1 w-1 animate-bounce rounded-full bg-neon-purple" style={{ animationDelay: '0ms' }} />
          <div className="h-1 w-1 animate-bounce rounded-full bg-neon-purple" style={{ animationDelay: '150ms' }} />
          <div className="h-1 w-1 animate-bounce rounded-full bg-neon-purple" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
      
      {/* Grid Skeletons */}
      <div className="mt-12 grid w-full max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-4 px-4 opacity-20">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 rounded-3xl bg-white/5 border border-white/10 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
