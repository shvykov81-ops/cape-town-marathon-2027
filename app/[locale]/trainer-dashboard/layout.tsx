import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function TrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session || (session.user.role !== "trainer" && session.user.role !== "admin")) {
    redirect("/");
  }

  return <>{children}</>;
}