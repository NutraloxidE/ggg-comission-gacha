import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();
  const userId = session.user.id;

  const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

  if (user?.publicID) {
    return NextResponse.json({ publicID: user.publicID });
  } else {
    return NextResponse.json({ error: "publicIDが見つかりません" }, { status: 404 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const { publicID } = await req.json();

  // publicIDが文字列かどうかチェック
  if (typeof publicID !== "string") {
    return NextResponse.json({ error: "publicIDは文字列である必要があります" }, { status: 400 });
  }

  // publicIDのフォーマットを検証
  const publicIDPattern = /^[A-Za-z0-9.-]*$/;
  if (!publicIDPattern.test(publicID) || !/\d/.test(publicID)) {
    return NextResponse.json({ error: "publicIDのフォーマットが正しくありません" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection('users');

  const existingUser = await collection.findOne({ publicID });

  if (existingUser) {
    return NextResponse.json({ error: "publicIDが既に使用されています" }, { status: 400 });
  } else {
    await collection.updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: { publicID } }
    );
    return NextResponse.json({ message: "publicIDが設定されました" });
  }
}