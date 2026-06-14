import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session || session.user?.role !== "admin") {
        redirect("/dashboard");
    }

    return (
        <div className="flex min-h-screen bg-neutral-950">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-neutral-900/50">
                {/* Admin sidebar content */}
            </aside>
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}