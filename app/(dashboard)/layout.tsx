import DashboardNavbar from "../components/DashboardNavbar";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-[#020617] transition-colors duration-500">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 border-r border-slate-200 dark:border-slate-800 z-20">
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Mobile Header Bar */}
        <header className="lg:hidden sticky top-0 z-30 w-full bg-white/80 dark:bg-[#020617]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <Sidebar isMobileButton={true} />
        </header>

        {/* Desktop Navbar */}
        <header className="hidden lg:block sticky top-0 z-30 w-full bg-white/80 dark:bg-[#020617]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <DashboardNavbar />
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full p-4 md:p-8 lg:p-10 relative z-0">
          <div className="max-w-[1600px] mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
