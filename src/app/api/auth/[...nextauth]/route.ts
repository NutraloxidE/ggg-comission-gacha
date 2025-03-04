import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/app/lib/mongodb";
import { Session } from "next-auth";
import { AdapterUser } from "@auth/core/adapters";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async session({ 
      session, 
      user 
    }: { 
      session: Session; 
      user: AdapterUser;
    }) {
      // MongoDBアダプタを使うとtokenではなくuserが渡される
      if (session.user) {
        session.user.id = user.id;
        // MongoDB ObjectIdをString型に変換
        session.user.sub = user.id;
        // publicIDをセッションに追加
        session.user.publicID = user.publicID;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };