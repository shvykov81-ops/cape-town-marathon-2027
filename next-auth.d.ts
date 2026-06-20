import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "user" | "admin" | "trainer";
    } & DefaultSession["user"];
  }

  interface User {
    role: "user" | "admin" | "trainer";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "user" | "admin" | "trainer";
  }
}
