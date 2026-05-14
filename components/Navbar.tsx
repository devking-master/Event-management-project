"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Menu, UserCircle, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-night/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-purple-600 shadow-glow transition hover:scale-110">
            <CalendarDays size={22} className="text-white" />
          </span>
          <span className="text-2xl font-black tracking-wide text-white">
            Event<span className="text-neon">Flow</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-semibold text-white/75 md:flex">
          <Link href="/events" className="transition hover:text-white">Explore</Link>
          {user ? (
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="transition hover:text-white">Dashboard</Link>
              <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                <div className="flex items-center gap-2">
                  <UserCircle size={20} className="text-purple-400" />
                  <span className="text-white">{user.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-white/40 transition hover:text-rose-400 hover:bg-rose-400/10 rounded-lg"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link href="/login" className="transition hover:text-white">Login</Link>
              <Link href="/signup" className="rounded-2xl bg-purple-600 px-6 py-3 text-white shadow-glow transition hover:scale-105 active:scale-95">
                Get Started
              </Link>
            </>
          )}
        </div>

        <button className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 text-white md:hidden transition hover:bg-white/5">
          <Menu />
        </button>
      </div>
    </nav>
  );
}
