import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection('users');

  const user = await collection.findOne({ id: session.user.id });

  if (user?.publicID) {
    return NextResponse.json({ publicID: user.publicID });
  } else {
    return NextResponse.json({ error: "publicIDが見つかりません" }, { status: 404 });
  }
}

export async function POST(req: NextRequest) {
  const { publicID } = await req.json();

  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection('users');

  const existingUser = await collection.findOne({ publicID });

  if (existingUser) {
    return NextResponse.json({ error: "publicIDが既に使用されています" }, { status: 400 });
  } else {
    return NextResponse.json({ message: "publicIDは使用可能です" });
  }
}