import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const isDev = process.env.NODE_ENV === "development";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...(isDev
    ? { session: { strategy: "jwt" } }
    : { adapter: PrismaAdapter(prisma) }),
  providers: [
    ...(isDev
      ? [
          Credentials({
            credentials: { email: { label: "Email", type: "email" } },
            authorize(credentials) {
              if (!credentials?.email) return null;
              return {
                id: "dev-user-1",
                email: credentials.email as string,
                name: "Usuário Dev",
              };
            },
          }),
        ]
      : [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
          }),
          Resend({
            apiKey: process.env.AUTH_RESEND_KEY,
            from: "noreply@maisnota.com.br",
          }),
        ]),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    session({ session, user, token }) {
      if (session.user) {
        session.user.id = isDev ? (token?.sub ?? "dev-user-1") : user.id;
      }
      return session;
    },
  },
});
