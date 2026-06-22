import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
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
        activeRole: { label: "Active Role", type: "text" }, // NEW: role selection
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = (credentials.email as string).toLowerCase().trim();
        const password = credentials.password as string;
        const requestedRole = (credentials.activeRole as string) || null; // NEW

        const user = await prisma.user.findUnique({
          where: { email },
          include: { trainerProfile: true },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        // Determine effective role
        // If user requested a specific role, validate they have it
        let effectiveRole = user.role;

        if (requestedRole) {
          // Check if user can assume this role
          if (requestedRole === "admin" && user.role === "admin") {
            effectiveRole = "admin";
          } else if (requestedRole === "trainer" && (user.role === "trainer" || user.role === "admin")) {
            // Admin can also act as trainer if they have a trainer profile
            if (user.role === "admin" && !user.trainerProfile) {
              // Admin without trainer profile cannot be trainer
              effectiveRole = "admin";
            } else {
              effectiveRole = "trainer";
            }
          } else if (requestedRole === "user") {
            effectiveRole = "user";
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: effectiveRole as "user" | "admin" | "trainer",
          originalRole: user.role as "user" | "admin" | "trainer", // Store original role
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
      // Handle role switch during session
      if (trigger === "update" && session?.activeRole) {
        token.role = session.activeRole;
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
