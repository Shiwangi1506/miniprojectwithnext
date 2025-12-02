import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user"; // Mongoose model
import bcrypt from "bcryptjs";

// ✅ Extend default types to include role
declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      id?: string;
      name?: string;
      email?: string;
      role?: string;
      image?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}

// ✅ Main config
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials.password)
          throw new Error("Please provide both email/username and password");

        await dbConnect();

        // ✅ Find user by email OR username
        const user = await User.findOne({
          $or: [
            { email: credentials.identifier },
            { username: credentials.identifier },
          ],
        });

        if (!user) throw new Error("Invalid credentials");

        // ✅ Compare password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) throw new Error("Invalid credentials");

        // ✅ Return user details
        return {
          id: user._id.toString(),
          name: user.username,
          email: user.email,
          role: user.role,
          image: (user as any).avatar, // Assuming the user model might have an avatar
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        // You can add other properties from the token to the session here
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  debug: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
