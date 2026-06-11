import { auth } from "@/auth";

export async function getAuthUser(req?: Request) {
  const session = await auth();
  if (!session?.user?.id) return null;
  return {
    id: session.user.id,
    email: session.user.email || null,
    name: session.user.name || null,
    role: session.user.role || null,
  };
}
