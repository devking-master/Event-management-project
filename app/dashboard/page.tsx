"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  Users, 
  Ticket, 
  DollarSign,
  Calendar,
  Plus,
  ArrowRight,
  ChevronRight,
  Activity,
  MapPin,
  Truck,
  Building2,
  Zap,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import FeatureCard from "@/components/FeatureCard";

type Analytics = {
  stats?: {
    totalEvents?: number;
    totalSoldTickets?: number;
    totalRevenue?: number;
    totalAttendees?: number;
  };
};
export default function DashboardOverview() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const analyticsRes = await fetch("/api/dashboard/analytics");
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 pb-16 md:space-y-8 sm:space-y-10 lg:space-y-12 md:pb-20">
        <div className="h-8 md:h-10 lg:h-12 w-48 md:w-56 lg:w-72 animate-pulse rounded-xl md:rounded-2xl bg-white/5" />
        <div className="grid gap-3 md:gap-4 lg:gap-5 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 md:h-32 animate-pulse rounded-2xl md:rounded-3xl lg:rounded-[2.5rem] bg-white/5" />
          ))}
        </div>
        <div className="grid gap-4 sm:p-5 lg:p-6 md:gap-5 sm:gap-4 sm:p-5 lg:p-6 lg:gap-5 sm:p-4 sm:p-5 lg:p-6 lg:p-8 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2 h-64 md:h-80 animate-pulse rounded-2xl md:rounded-3xl lg:rounded-[2.5rem] bg-white/5" />
          <div className="h-64 md:h-80 animate-pulse rounded-2xl md:rounded-3xl lg:rounded-[2.5rem] bg-white/5" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 md:space-y-8 sm:space-y-10 lg:space-y-12 md:pb-20">
      {/* Premium Header Section */}
      <div className="relative px-0">
        <div className="space-y-2 md:space-y-3">
          <h1 className="text-2xl sm:text-3xl md:text-2xl sm:text-2xl sm:text-3xl lg:text-4xl lg:text-2xl sm:text-3xl sm:text-2xl sm:text-2xl sm:text-3xl lg:text-4xl lg:text-5xl font-black tracking-tight break-words leading-tight">
            Operations <span className="text-neon-cyan">Control Center</span>
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-white/50">Real-time event management dashboard and analytics</p>
        </div>
        
        {/* System Status Indicator */}
        <div className="mt-4 md:mt-6 flex items-center gap-2 md:gap-3 rounded-full border border-white/10 bg-white/[0.03] w-fit px-3 md:px-5 py-2 md:py-2.5 backdrop-blur-sm">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
          <span className="text-xs font-bold uppercase tracking-widest text-white/60">System Online</span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-3 md:gap-4 lg:gap-5 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4">
        {/* Total Events Metric */}
        <Card animate={true} delay={0} hoverGlow={true}>
          <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-3">
            <div className="space-y-2 xs:space-y-3 flex-1 min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest text-white/50">Total Events</p>
              <p className="text-2xl xs:text-2xl sm:text-3xl font-black break-words">{analytics?.stats?.totalEvents || "0"}</p>
              <p className="text-xs text-emerald-400/80 flex items-center gap-1">
                <TrendingUp size={12} /> Live & Scheduled
              </p>
            </div>
            <div className="h-10 w-10 xs:h-12 xs:w-12 rounded-lg xs:rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-purple/10 flex items-center justify-center flex-shrink-0">
              <Calendar size={20} className="xs:w-6 xs:h-6 text-neon-purple" />
            </div>
          </div>
        </Card>

        {/* Tickets Sold Metric */}
        <Card animate={true} delay={0.05} hoverGlow={true}>
          <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-3">
            <div className="space-y-2 xs:space-y-3 flex-1 min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest text-white/50">Tickets Sold</p>
              <p className="text-2xl xs:text-2xl sm:text-3xl font-black break-words">{analytics?.stats?.totalSoldTickets || "0"}</p>
              <p className="text-xs text-neon-cyan/80 flex items-center gap-1">
                <Zap size={12} /> Active Sales
              </p>
            </div>
            <div className="h-10 w-10 xs:h-12 xs:w-12 rounded-lg xs:rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-cyan/10 flex items-center justify-center flex-shrink-0">
              <Ticket size={20} className="xs:w-6 xs:h-6 text-neon-cyan" />
            </div>
          </div>
        </Card>

        {/* Total Revenue Metric */}
        <Card animate={true} delay={0.1} hoverGlow={true}>
          <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-3">
            <div className="space-y-2 xs:space-y-3 flex-1 min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest text-white/50">Total Revenue</p>
              <p className="text-2xl xs:text-2xl sm:text-3xl font-black break-words">₦{(analytics?.stats?.totalRevenue || 0).toLocaleString()}</p>
              <p className="text-xs text-neon-pink/80 flex items-center gap-1">
                <TrendingUp size={12} /> Successful Orders
              </p>
            </div>
            <div className="h-10 w-10 xs:h-12 xs:w-12 rounded-lg xs:rounded-xl bg-gradient-to-br from-neon-pink/20 to-neon-pink/10 flex items-center justify-center flex-shrink-0">
              <DollarSign size={20} className="xs:w-6 xs:h-6 text-neon-pink" />
            </div>
          </div>
        </Card>

        {/* Attendance Metric */}
        <Card animate={true} delay={0.15} hoverGlow={true}>
          <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-3">
            <div className="space-y-2 xs:space-y-3 flex-1 min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest text-white/50">Avg Attendance</p>
              <p className="text-2xl xs:text-2xl sm:text-3xl font-black break-words">{analytics?.stats?.avgAttendance || "0%"}</p>
              <p className="text-xs text-amber-400/80 flex items-center gap-1">
                <Activity size={12} /> Checked In
              </p>
            </div>
            <div className="h-10 w-10 xs:h-12 xs:w-12 rounded-lg xs:rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-400/10 flex items-center justify-center flex-shrink-0">
              <Users size={20} className="xs:w-6 xs:h-6 text-amber-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Sections */}
      <div className="grid gap-4 sm:p-5 lg:p-6 md:gap-5 sm:gap-4 sm:p-5 lg:p-6 lg:gap-5 sm:p-4 sm:p-5 lg:p-6 lg:p-8 grid-cols-1 lg:grid-cols-3">
        {/* Recent Transactions - Large Card */}
        <Card className="lg:col-span-2" animate={true} delay={0.2}>
          <div className="space-y-6 md:space-y-8">
            {/* Header */}
            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3">
              <div className="space-y-1">
                <h2 className="text-xl md:text-2xl font-black">Recent Transactions</h2>
                <p className="text-xs md:text-sm text-white/40">Latest payment confirmations</p>
              </div>
              <Link href="/dashboard/events" className="flex-shrink-0">
                <Button variant="secondary" size="sm" icon={ArrowRight} />
              </Link>
            </div>

            {/* Transaction List */}
            <div className="space-y-2 md:space-y-3">
              {analytics?.recentSales && analytics.recentSales.length > 0 ? (
                analytics.recentSales.map((sale: any, idx: number) => (
                  <div
                    key={sale._id}
                    className="group flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 xs:gap-4 rounded-lg xs:rounded-xl border border-white/5 bg-white/[0.02] p-3 xs:p-4 transition duration-300 hover:bg-white/[0.05] hover:border-neon-cyan/20"
                  >
                    {/* Left Section - Customer Info */}
                    <div className="flex items-center gap-2 xs:gap-4 flex-1 min-w-0">
                      <div className="h-8 w-8 xs:h-10 xs:w-10 rounded-lg bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center flex-shrink-0">
                        <TrendingUp size={16} className="xs:w-[18px] xs:h-[18px] text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs xs:text-sm font-semibold text-white truncate">{sale.userId?.name || "Customer"}</p>
                        <p className="text-xs text-white/40 truncate hidden xs:block">{sale.userId?.email || "No email"}</p>
                      </div>
                    </div>

                    {/* Right Section - Amount & Status */}
                    <div className="text-right xs:text-right ml-8 xs:ml-4">
                      <p className="text-xs xs:text-sm font-black text-neon-cyan">₦{sale.totalAmount?.toLocaleString()}</p>
                      <span className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 xs:py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <CheckCircle2 size={10} className="xs:w-3 xs:h-3 text-emerald-400" />
                        <span className="text-xs font-semibold text-emerald-400 hidden xs:inline">Confirmed</span>
                        <span className="text-xs font-semibold text-emerald-400 xs:hidden">OK</span>
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 md:py-12 text-center rounded-lg xs:rounded-xl border border-white/5 bg-white/[0.02]">
                  <Activity className="mx-auto mb-2 md:mb-3 text-white/20" size={28} />
                  <p className="text-xs md:text-sm text-white/40">No transactions yet</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Upcoming Events Preview - Vertical Card */}
        <Card animate={true} delay={0.25}>
          <div className="space-y-4 md:space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-xl md:text-2xl font-black">Next Events</h2>
              <p className="mt-1 text-xs md:text-sm text-white/40">Upcoming calendar</p>
            </div>

            {/* Events List */}
            <div className="space-y-2 md:space-y-3">
              {analytics?.upcomingEvents && analytics.upcomingEvents.length > 0 ? (
                analytics.upcomingEvents.map((event: any, idx: number) => (
                  <Link
                    key={event._id}
                    href={`/events/${event._id}`}
                    className="group block"
                  >
                    <div className="rounded-lg xs:rounded-xl border border-white/5 bg-white/[0.02] p-2.5 xs:p-3.5 transition duration-300 hover:bg-white/[0.08] hover:border-neon-purple/30">
                      <div className="flex items-start justify-between gap-2 mb-1.5 xs:mb-2">
                        <p className="text-xs xs:text-sm font-semibold text-white line-clamp-1 flex-1">{event.name}</p>
                        <ChevronRight size={14} className="xs:w-4 xs:h-4 text-white/30 group-hover:text-neon-purple flex-shrink-0 mt-0.5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-white/40">
                          <Calendar size={12} className="text-neon-cyan flex-shrink-0" />
                          <span className="truncate">{new Date(event.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/40">
                          <Users size={12} className="text-neon-pink flex-shrink-0" />
                          <span>{event.capacity} attendees</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-6 md:py-8 text-center rounded-lg xs:rounded-xl border border-white/5 bg-white/[0.02]">
                  <Calendar className="mx-auto mb-2 text-white/20" size={24} />
                  <p className="text-xs text-white/40">No upcoming events</p>
                </div>
              )}
            </div>

            {/* View All Button */}
            <Link href="/dashboard/events" className="w-full block mt-2">
              <Button variant="secondary" size="sm" className="w-full justify-center text-xs xs:text-sm">
                View All Events
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Quick Actions Section */}
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-4">
          <h2 className="text-xl md:text-2xl font-black">Quick Actions</h2>
          <p className="text-xs md:text-sm text-white/40">Fast access to core features</p>
        </div>

        <div className="grid gap-3 md:gap-4 lg:gap-5 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboard/events/create">
            <FeatureCard
              title="New Event"
              description="Create and launch an event"
              icon={<Plus size={24} />}
            />
          </Link>

          <Link href="/dashboard/tickets">
            <FeatureCard
              title="Manage Tickets"
              description="View and control tickets"
              icon={<Ticket size={24} />}
            />
          </Link>

          <Link href="/dashboard/logistics">
            <FeatureCard
              title="Transportation"
              description="Organize logistics & rides"
              icon={<Truck size={24} />}
            />
          </Link>

          <Link href="/dashboard/accommodation">
            <FeatureCard
              title="Lodging"
              description="Manage accommodations"
              icon={<Building2 size={24} />}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

