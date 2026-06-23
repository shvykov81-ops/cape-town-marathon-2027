import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/account",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        activeRole: { label: "Active Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = (credentials.email as string).toLowerCase().trim();
        const password = credentials.password as string;
        const requestedRole = (credentials.activeRole as string) || null;

        const user = await prisma.user.findUnique({
          where: { email },
          include: { trainerProfile: true },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        // Determine effective role
        let effectiveRole = user.role;

        if (requestedRole) {
          if (requestedRole === "admin" && user.role === "admin") {
            effectiveRole = "admin";
          } else if (requestedRole === "trainer" && (user.role === "trainer" || user.role === "admin")) {
            effectiveRole = "trainer";
          } else if (requestedRole === "user") {
            effectiveRole = "user";
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: effectiveRole as "user" | "admin" | "trainer",
          originalRole: user.role as "user" | "admin" | "trainer",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.originalRole = (user as any).originalRole;
      }
      // Handle role switch during session — PRESERVE originalRole
      if (trigger === "update" && session?.activeRole) {
        token.role = session.activeRole;
        // originalRole stays unchanged — user can always switch back
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "user" | "admin" | "trainer";
        (session.user as any).originalRole = token.originalRole as string;
      }
      return session;
    },
  },
});
