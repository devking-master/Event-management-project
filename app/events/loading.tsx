import { Zap } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-night px-8 pt-40">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 h-20 w-1/3 animate-pulse rounded-3xl bg-white/5" />
        <div className="mb-20 h-24 w-full animate-pulse rounded-[3rem] bg-white/5" />
        
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-[550px] rounded-[3rem] bg-white/5 border border-white/10 animate-pulse flex flex-col justify-end p-10">
              <div className="h-6 w-1/4 rounded-full bg-white/10 mb-4" />
              <div className="h-12 w-3/4 rounded-2xl bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
