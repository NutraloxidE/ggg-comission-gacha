import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async session({ session, token }) {
      // セッションにユーザー情報を追加
      if (token && session.user) {
        session.user.sub = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      // JWTにユーザー情報を追加
      if (user) {
        token.id = user.id;
        token.sub = user.sub;
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };