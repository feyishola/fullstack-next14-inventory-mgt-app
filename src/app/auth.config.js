import { NextResponse } from "next/server";

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token = { ...token, id: user.id };
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        const { id } = token;
        const { user } = session;

        session = { ...session, user: { ...user, id } };
      }
      return session;
    },
  },
  providers: [],
};
