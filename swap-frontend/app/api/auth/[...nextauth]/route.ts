export const runtime = "nodejs";

import NextAuth, { type NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import AzureAD from "next-auth/providers/azure-ad";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const allowed = (process.env.ALLOWED_EMAIL_DOMAINS || "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

function domainOK(email?: string | null) {
  if (!email || allowed.length === 0) return true;
  const dom = email.split("@").pop()?.toLowerCase();
  return !!dom && allowed.includes(dom);
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/signin" },

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      authorization: { params: { prompt: "consent", access_type: "offline" } },
    }),
    AzureAD({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        const email = creds?.email?.toLowerCase().trim();
        const pwd = creds?.password || "";
        if (!email || !pwd) return null;

        if (!domainOK(email)) throw new Error("This email domain is not allowed.");

        // Select only what we need so TS knows passwordHash exists here
        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            passwordHash: true,
          },
        });

        if (!user?.passwordHash) return null;

        const ok = await bcrypt.compare(pwd, user.passwordHash);
        if (!ok) return null;

        // Return a plain object acceptable to NextAuth (no passwordHash)
        return {
          id: user.id,
          email: user.email!,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      if (!domainOK(user?.email)) return false;
      return true;
    },
    async jwt({ token, user }) {
      // Ensure token.sub is set for credentials sign-in
      if (user?.id) token.sub = user.id;
      return token;
    },
    async session({ token, session }) {
      if (token?.sub) (session.user as any).id = token.sub;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
