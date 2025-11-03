import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import bcrypt from "bcryptjs";

interface UserSession {
  id: string | undefined;
  name: string | null | undefined;
  email: string;
  role: string;
}

const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Invalid credentials");
        }

        await dbConnect();

        const user = await User.findOne({
          $or: [{ email: credentials.email }, { username: credentials.email }],
        });

        if (!user) {
          throw new Error("Invalid credentials");
        }

        const isMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isMatch) throw new Error("Invalid credentials");

        return {
          ...user,

          id: user._id.toString() as string,
          email: user.email as string,
          name: user.username,
          role: (user as any).role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log("jwt callback, user:", user);

        (token as any).user = {
          id: user.id,
          name: user.name,
          email: user.email as string,
          role: (user as any).role,
        };
      }
      return token;
    },

    async session({ session, token }) {
      if (token.user) {
        console.log("session callback, token:", token);
        session.user = (token as any).user;
        session.user.role = token.user.role;
      }
      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
