import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-cream-100">
      <Sidebar />
      {/* Desktop: offset for sidebar. Mobile: no offset, padding bottom for bottom nav */}
      <div className="flex-1 flex flex-col lg:ml-60">
        <TopNav />
        <main className="flex-1 p-4 lg:p-6 overflow-auto pb-24 lg:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}
