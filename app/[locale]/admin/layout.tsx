import { auth } from "@/auth";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Server Component check: show Access Denied instead of redirect
  // Actual redirect happens in middleware (which reads fresh cookie)
  if (!session || session.user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-neutral-400">
            You need admin privileges to access this page.
          </p>
          <p className="text-sm text-neutral-500">
            Current role: {session?.user?.role || "none"}
          </p>
          <a
            href="/"
            className="inline-block mt-4 px-4 py-2 bg-teal-600 rounded-lg hover:bg-teal-500 transition"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-6 lg:p-10 ml-72">{children}</main>
    </div>
  );
}
