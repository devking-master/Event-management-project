"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, UserCircle, LogOut, X } from "lucide-react";
import { usePathname } from "next/navigation";
import EventFlowLogo from "@/components/EventFlowLogo";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
    setOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  const navLinks = (
    <>
      <Link href="/events" className="rounded-xl px-3 py-2 transition hover:bg-white/5 hover:text-neon-cyan">
        Explore
      </Link>

      {user ? (
        <>
          <Link href="/dashboard" className="rounded-xl px-3 py-2 transition hover:bg-white/5 hover:text-neon-cyan">
            Dashboard
          </Link>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">
            <UserCircle size={18} className="text-neon-purple" />
            <span className="max-w-[140px] truncate text-sm text-white">{user.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="grid min-h-11 min-w-11 place-items-center rounded-xl text-white/50 transition hover:bg-rose-500/10 hover:text-rose-400"
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        </>
      ) : (
        <>
          <Link href="/login" className="rounded-xl px-3 py-2 transition hover:bg-white/5 hover:text-neon-cyan">
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-2xl bg-neon-purple px-5 py-3 text-sm font-black text-white shadow-glow transition hover:scale-105 active:scale-95"
          >
            Get Started
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-night/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="min-w-0">
          <EventFlowLogo size={44} />
        </Link>

        <div className="hidden items-center gap-2 text-sm font-semibold text-white/75 md:flex lg:gap-4">
          {navLinks}
        </div>

        <button
          onClick={() => setOpen((value) => !value)}
          className="grid min-h-11 min-w-11 place-items-center rounded-xl border border-white/10 text-white transition hover:bg-white/5 md:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-night/95 px-4 py-4 backdrop-blur-2xl md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 text-sm font-bold text-white/75">
            {navLinks}
          </div>
        </div>
      )}
    </nav>
  );
}
