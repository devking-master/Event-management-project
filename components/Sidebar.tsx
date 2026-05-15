"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  ScanLine,
  Settings,
  Ticket,
  X,
} from "lucide-react";

import EventFlowLogo from "@/components/EventFlowLogo";

export default function Sidebar() {
  const pathname = usePathname();

  const [user, setUser] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(console.error);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    window.location.href = "/login";
  };

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Overview",
      href: "/dashboard",
    },
    {
      icon: Calendar,
      label: "Events",
      href: "/dashboard/events",
    },
    {
      icon: PlusCircle,
      label: "New Event",
      href: "/dashboard/events/create",
    },
    {
      icon: Ticket,
      label: "Tickets",
      href: "/dashboard/tickets",
    },
    {
      icon: ScanLine,
      label: "Gate Scanner",
      href: "/dashboard/scanner",
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/dashboard/settings",
    },
  ];

  const expanded = isExpanded || isMobileOpen;

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-night/85 px-4 backdrop-blur-2xl lg:hidden">
        <Link href="/">
          <EventFlowLogo size={40} />
        </Link>

        <button
          onClick={() => setIsMobileOpen((prev) => !prev)}
          className="grid min-h-11 min-w-11 place-items-center rounded-xl border border-white/10 text-white/70 transition hover:bg-white/5 hover:text-white"
        >
          {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <motion.aside
        initial={false}
        animate={{
          width: expanded ? 280 : 84,
        }}
        onMouseEnter={() => {
          if (window.innerWidth >= 1024) {
            setIsExpanded(true);
          }
        }}
        onMouseLeave={() => {
          if (window.innerWidth >= 1024) {
            setIsExpanded(false);
          }
        }}
        className={`
          fixed left-0 top-0 z-50 h-screen
          border-r border-white/10
          bg-night/95
          backdrop-blur-3xl
          transition-all duration-300
          overflow-hidden

          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }

          ${expanded ? "shadow-2xl shadow-neon-purple/10" : ""}
        `}
      >
        <div className="flex h-full flex-col px-4 py-6 lg:py-8">
          {/* LOGO */}
          <Link
            href="/"
            className="mb-8 flex items-center gap-3 rounded-2xl px-1 py-2 lg:mb-12"
          >
            <EventFlowLogo
              size={48}
              showText={expanded}
            />
          </Link>

          {/* NAVIGATION */}
          <nav className="flex-1 space-y-2 overflow-y-auto pr-1 no-scrollbar">
            {menuItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" &&
                  pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block"
                >
                  <div
                    className={`
                      relative flex min-h-12 items-center gap-4
                      rounded-2xl px-3 py-3
                      text-sm font-bold
                      transition-all

                      ${
                        isActive
                          ? "border border-white/10 bg-white/[0.08] text-white shadow-glass"
                          : "text-white/45 hover:bg-white/[0.05] hover:text-white"
                      }
                    `}
                  >
                    <item.icon
                      size={22}
                      className={`shrink-0 ${
                        isActive ? "text-neon-purple" : ""
                      }`}
                    />

                    <AnimatePresence initial={false}>
                      {expanded && (
                        <motion.span
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          transition={{ duration: 0.15 }}
                          className="truncate whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {isActive && (
                      <span className="absolute left-0 h-6 w-1 rounded-full bg-neon-purple shadow-glow" />
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* USER + LOGOUT */}
          <div className="border-t border-white/10 pt-4">
            {expanded && user && (
              <div className="mb-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <p className="truncate text-sm font-black text-white">
                  {user.name}
                </p>

                <p className="mt-1 truncate text-xs text-white/35">
                  {user.email}
                </p>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="
                flex min-h-12 w-full items-center gap-4
                rounded-2xl px-3 py-3
                text-sm font-bold
                text-rose-400/70
                transition
                hover:bg-rose-500/10
                hover:text-rose-400
              "
            >
              <LogOut
                size={22}
                className="shrink-0"
              />

              {expanded && (
                <span className="truncate">
                  Sign Out
                </span>
              )}
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}