import { Sidebar } from "@/components/layout/Sidebar";
import { TopNavigation } from "@/components/layout/TopNavigation";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen overflow-hidden bg-transparent print:overflow-visible print:min-h-0 print:block">
      <div className="print:hidden h-full flex">
        <Sidebar />
      </div>
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto print:ml-0 print:h-auto print:overflow-visible print:block">
        <div className="print:hidden">
          <TopNavigation />
        </div>
        {children}
      </main>
    </div>
  );
}
