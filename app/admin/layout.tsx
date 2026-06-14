import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-6 lg:p-10 ml-72">{children}</main>
    </div>
  );
}
