import { NextRequest, NextResponse } from 'next/server';
import { GroupedOrder } from '@/app/types/order/GroupedOrder';
import { SingleOrder } from '@/app/types/order/SingleOrder';
import { v7 as uuidv7 } from 'uuid';
import clientPromise from '@/app/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/*
* api/process-order
*/

export async function POST(req: NextRequest) {
  const groupedOrderData = await req.json();

  // セッションを取得
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  // SingleOrderのインスタンスを作成
  const singleOrders = groupedOrderData.orders.map((order : SingleOrder) => new SingleOrder(order));

  // GroupedOrderのインスタンスを作成
  const groupedOrder = new GroupedOrder(
    singleOrders,
    groupedOrderData.orderType,
    groupedOrderData.orderDetails,
    new Date(groupedOrderData.overallDeadline),
    new Date(groupedOrderData.comissionExpireDate)
  );

  // MongoDBクライアントを取得
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection('unpayed-comms');

  // randomNumの重複をチェック
  const existingOrder = await collection.findOne({ randomNum: groupedOrderData.randomNum });

  if (existingOrder) {
    // 重複があった場合、そのデータをクライアントに返す
    return NextResponse.json(existingOrder);
  } else {
    // セッションからクライアントのpublicUserIDを取得
    if (session.user.publicID) {
      groupedOrder.clientPublicUserID = session.user.publicID; // ここでpublicUserIDを設定
    } else {
      return NextResponse.json({ error: "publicUserIDが見つかりません" }, { status: 400 });
    }

    // 重複がない場合、groupedOrderの処理を行う
    const processedGroupOrder = processGroupedOrder(groupedOrder, collection);
    return NextResponse.json(processedGroupOrder);
  }
}

const processGroupedOrder = (groupedOrder: GroupedOrder, collection: any): GroupedOrder => {
  // groupedOrderの処理ロジックを実装
  // 例: 合計金額の計算、注文IDの検証など
  groupedOrder.orderID = uuidv7();
  groupedOrder.didClientPay = false; // 改変を無視
  groupedOrder.InitSingleOrderID(); // orderIDが設定された状態で再度設定

  // TODO:決済が処理されるまで、processedGroupedOrderを一時コレクションに保存する (MongoDB) (PaymentPendingGroupedOrders) (<-おそらくunpayed-commsコレクションの事)
  // 決済が完了したら、コレクションから移動し、依頼リストのコレクションに保存する (ここでは行わない)
  // 独立した決済サービス作って、このサービスと連携すると良いかもしれない
  collection.insertOne(groupedOrder).catch(err => {
    console.error('Failed to insert document', err);
  });
  
  return groupedOrder as GroupedOrder;
};