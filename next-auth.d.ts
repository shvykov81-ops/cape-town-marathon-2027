import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "user" | "admin" | "trainer";
      originalRole?: "user" | "admin" | "trainer";
    } & DefaultSession["user"];
    // Allow passing activeRole to unstable_update for role switching
    activeRole?: "user" | "admin" | "trainer";
  }

  interface User {
    role: "user" | "admin" | "trainer";
    originalRole?: "user" | "admin" | "trainer";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "user" | "admin" | "trainer";
    originalRole?: "user" | "admin" | "trainer";
  }
}
