import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { UserController } from "./lib/controllers";

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        if (credentials) {
          const { email, password } = credentials;
          const user = await UserController.getUserByEmail(email);

          if (!user) return null;
          return user;
          //   const encoder = new TextEncoder()
          //   const saltedPassword = encoder.encode(password + user.salt)
          //   const hashedPasswordBuffer = await crypto.subtle.digest(
          //     'SHA-256',
          //     saltedPassword
          //   )
          //   const hashedPassword = getStringFromBuffer(hashedPasswordBuffer)

          //   if (hashedPassword === user.password) {
          //     return user
          //   } else {
          //     return null
          //   }
        }

        return null;
      },
    }),
  ],
});
