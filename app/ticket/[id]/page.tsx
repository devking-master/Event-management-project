"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Ticket as TicketIcon, 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  Download, 
  Printer, 
  ChevronLeft,
  Zap,
  Activity
} from "lucide-react";
import Button from "@/components/ui/Button";

export default function TicketPrintView() {
  const params = useParams();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetch(`/api/tickets/${params.id}`)
        .then(res => res.json())
        .then(data => {
          setTicket(data.ticket);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [params.id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return (
    <div className="min-h-screen bg-night flex items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-neon-purple border-t-transparent shadow-glow" />
    </div>
  );

  if (!ticket) return (
    <div className="min-h-screen bg-night flex flex-col items-center justify-center p-8 text-center">
      <div className="h-20 w-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mb-6">
        <Activity size={40} />
      </div>
      <h1 className="text-3xl font-black mb-4">Ticket Not Found</h1>
      <p className="text-white/40 mb-8 max-w-md">The requested ticket could not be found.</p>
      <Button onClick={() => window.location.href = "/dashboard/tickets"}>Back to Tickets</Button>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#050505] text-white p-4 md:p-10 print:p-0 print:bg-white print:text-black">
      {/* Top Bar - Hidden on print */}
      <div className="mx-auto max-w-4xl flex items-center justify-between mb-10 print:hidden">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/30 hover:text-white transition group"
        >
          <ChevronLeft size={16} className="transition group-hover:-translate-x-1" /> Return to Dashboard
        </button>
        <Button variant="neon" icon={Printer} onClick={handlePrint}>Print Ticket</Button>
      </div>

      <div className="mx-auto max-w-2xl bg-[#0a0a0c] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl print:border-none print:shadow-none print:rounded-none print:w-full">
        {/* Ticket Header */}
        <div className="bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 p-10 border-b border-white/5 relative overflow-hidden print:from-gray-100 print:to-gray-100 print:border-black">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Zap size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-8 bg-neon-purple rounded-lg flex items-center justify-center shadow-glow print:shadow-none print:bg-black">
                <Zap size={18} className="text-white" />
              </div>
              <span className="text-sm font-black uppercase tracking-[0.3em]">EventFlow <span className="text-neon-purple print:text-black">System</span></span>
            </div>
            <h1 className="text-4xl font-black tracking-tight">{ticket.eventId?.title}</h1>
            <p className="text-neon-cyan font-bold mt-2 uppercase tracking-widest text-xs print:text-black">{ticket.type} Ticket Tier</p>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-10 grid gap-10 md:grid-cols-2 print:grid-cols-2">
          <div className="space-y-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2 print:text-gray-500">Ticket Holder</p>
              <p className="text-lg font-black">{ticket.guestName}</p>
              <p className="text-sm text-white/40 print:text-gray-600">{ticket.guestEmail}</p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2 print:text-gray-500">Event Details</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-neon-purple print:text-black" />
                  <span className="font-bold">{new Date(ticket.eventId?.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={16} className="text-neon-pink print:text-black" />
                  <span className="font-bold">{new Date(ticket.eventId?.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={16} className="text-neon-cyan print:text-black" />
                  <span className="font-bold">{ticket.eventId?.location}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center border-l border-white/5 pl-10 md:border-l print:border-black">
            <div className="bg-white p-4 rounded-[2rem] shadow-glow-cyan print:shadow-none print:border print:border-black">
              {/* This would be a real QR code in a production app */}
              <div className="h-40 w-40 bg-black flex items-center justify-center p-2">
                 <div className="grid grid-cols-5 gap-1 w-full h-full opacity-80">
                    {Array.from({length: 25}).map((_, i) => (
                      <div key={i} className={`h-full w-full ${Math.random() > 0.5 ? 'bg-white' : 'bg-transparent'}`} />
                    ))}
                 </div>
              </div>
            </div>
            <p className="mt-6 text-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 block mb-1 print:text-gray-500">Access Key</span>
              <span className="text-xl font-mono font-black tracking-tighter text-neon-cyan print:text-black">{ticket.code}</span>
            </p>
          </div>
        </div>

        {/* Ticket Footer */}
        <div className="bg-white/[0.02] p-8 border-t border-white/5 flex items-center justify-between print:border-black print:text-black">
           <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1 print:text-gray-500">Verification</p>
              <p className="text-xs font-bold italic">Secure pass generated via EventFlow System</p>
           </div>
           <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1 print:text-gray-500">Timestamp</p>
              <p className="text-xs font-mono text-white/40 print:text-gray-600">{new Date().toISOString()}</p>
           </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </main>
  );
}
