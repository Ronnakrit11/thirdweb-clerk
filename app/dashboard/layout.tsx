import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Sidebar, MobileSidebar } from "@/components/dashboard/sidebar";
import { UserButton } from "@clerk/nextjs";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar for desktop */}
      <div className="hidden border-r bg-background md:block w-72">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <UserButton afterSignOutUrl="/" />
          <span className="text-sm font-medium">ThenextCrm-V0</span>
        </div>
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1">
        <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
          <MobileSidebar />
          <div className="flex-1" />
          <div className="md:hidden">
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>
        <main className="flex-1 space-y-4 p-8 pt-6">
          {children}
        </main>
      </div>
    </div>
  );
}