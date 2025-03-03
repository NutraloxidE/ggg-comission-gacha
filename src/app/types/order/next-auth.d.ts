import "next-auth";

//JWTに追加するプロパティを定義、これはクッキーに保存され、
declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      id?: string | null;
      sub?: string | null; // subプロパティを追加
    };
  }
  
  // MongoDBから取得されるユーザーの型
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}