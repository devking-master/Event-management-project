import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-night text-white">
      <Sidebar />
      <main className="min-h-screen lg:pl-80 p-6 md:p-8 pt-24 lg:pt-12 transition-all duration-300">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
