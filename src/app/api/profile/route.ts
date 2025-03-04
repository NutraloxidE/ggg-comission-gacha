import { getServerSession } from "next-auth/next";
import { NextResponse, NextRequest } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }
    
    const client = await clientPromise;
    const db = client.db();
    const userId = session.user.id;

    // ユーザーIDをObjectIdとして扱う
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
    }

    // 必要なプロフィール情報を返す
    return NextResponse.json({
      name: user.name || "",
      email: user.email || "",
      bio: user.bio || "",
      website: user.website || "",
      twitter: user.twitter || "",
      instagram: user.instagram || "",
      image: user.image || "",
    });
  } catch (error) {
    console.error("プロフィール取得エラー:", error);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }
    
    const client = await clientPromise;
    const db = client.db();
    const userId = session.user.id;
    const data = await request.json();

    // 更新可能なフィールドのみを抽出
    const updatableFields = ["name", "bio", "website", "twitter", "instagram", "image"];
    const updateData = Object.keys(data)
      .filter(key => updatableFields.includes(key))
      .reduce((obj: Record<string, unknown>, key) => {
        obj[key] = data[key];
        return obj;
      }, {} as Record<string, unknown>);

    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("プロフィール更新エラー:", error);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}