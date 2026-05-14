"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Calendar, 
  PlusCircle, 
  Settings, 
  LogOut, 
  ScanLine,
  Zap,
  Activity,
  Ticket,
  Search,
  Truck,
  Building2,
  ChevronRight
} from "lucide-react";
import { AnimatePresence } from "framer-motion";

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => setUser(data.user));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  const getMenuItems = () => {
    const baseItems = [
      { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    ];

    if (user?.role === "organizer" || user?.role === "admin") {
      return [
        ...baseItems,
        { icon: Calendar, label: "Events", href: "/dashboard/events" },
        { icon: PlusCircle, label: "New Event", href: "/dashboard/events/create" },
        { icon: Ticket, label: "Tickets", href: "/dashboard/tickets" },
        { icon: ScanLine, label: "Gate Scanner", href: "/dashboard/scanner" },
        { icon: Settings, label: "Settings", href: "/dashboard/settings" },
      ];
    }

    // Regular users don't see Overview tab
    return [
      { icon: Ticket, label: "My Tickets", href: "/dashboard/tickets" },
      { icon: Search, label: "Explore Events", href: "/events" },
      { icon: Settings, label: "Settings", href: "/dashboard/settings" },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex h-20 items-center justify-between border-b border-white/5 bg-night/80 px-6 backdrop-blur-xl lg:hidden">
        <Link href="/" className="flex items-center gap-3">
          <Zap size={20} className="text-neon-purple" />
          <span className="text-xl font-black tracking-tight">EventFlow</span>
        </Link>
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/60 hover:bg-white/10 transition"
        >
          <Activity size={16} className={isMobileOpen ? "text-neon-purple" : ""} />
          Menu
        </button>
      </div>

      {/* Overlay/Backdrop */}
      <AnimatePresence>
        {(isExpanded || isMobileOpen) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsMobileOpen(false);
              setIsExpanded(false);
            }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside 
        initial={false}
        animate={{ 
          width: (isExpanded || isMobileOpen) ? 280 : 80,
          x: isMobileOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -280 : 0)
        }}
        onMouseEnter={() => { if (typeof window !== 'undefined' && window.innerWidth >= 1024) setIsExpanded(true) }}
        onMouseLeave={() => { if (typeof window !== 'undefined' && window.innerWidth >= 1024) setIsExpanded(false) }}
        className={`fixed left-0 top-0 z-50 h-screen border-r border-white/5 bg-night/95 backdrop-blur-3xl transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'shadow-2xl shadow-neon-purple/10' : ''}`}
      >
        <div className="flex h-full flex-col px-4 py-10">
          <Link href="/" className="mb-16 flex items-center gap-4 px-2 group">
            <motion.div 
              whileHover={{ rotate: 90 }}
              className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-2xl bg-purple-600 shadow-glow"
            >
              <Zap size={24} className="text-white" />
            </motion.div>
            <AnimatePresence>
              {(isExpanded || isMobileOpen) && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col whitespace-nowrap overflow-hidden"
                >
                  <span className="text-2xl font-black tracking-tight text-white">
                    Event<span className="text-neon-purple">Flow</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Event Management</span>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="relative block"
                >
                  <motion.div
                    className={`flex items-center gap-4 rounded-2xl px-3 py-3 text-sm font-bold transition-all ${
                      isActive
                        ? "text-white"
                        : "text-white/40 hover:text-white/80 hover:bg-white/5"
                    }`}
                  >
                    <item.icon size={24} className={`flex-shrink-0 ${isActive ? "text-neon-purple" : ""}`} />
                    <AnimatePresence>
                      {(isExpanded || isMobileOpen) && (
                        <motion.span 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className="whitespace-nowrap overflow-hidden"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 z-[-1] rounded-2xl bg-gradient-to-r from-white/[0.08] to-transparent border border-white/10 shadow-glass"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    
                    {isActive && (
                      <motion.div 
                        layoutId="active-indicator"
                        className="absolute left-0 h-6 w-1 rounded-full bg-neon-purple shadow-glow" 
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-white/5 pt-8">
            <motion.button
              onClick={handleLogout}
              className="flex w-full items-center gap-4 rounded-2xl px-3 py-3 text-sm font-bold text-rose-500/60 transition hover:bg-rose-500/10 hover:text-rose-500"
            >
              <LogOut size={24} className="flex-shrink-0" />
              <AnimatePresence>
                {(isExpanded || isMobileOpen) && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    Sign Out
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
