import { NextRequest, NextResponse } from 'next/server';
import { GroupedOrder } from '@/app/types/order/GroupedOrder';
import { SingleOrder } from '@/app/types/order/SingleOrder';
import { v7 as uuidv7 } from 'uuid';
import clientPromise from '@/app/lib/mongodb';

/*
* api/process-order
*/

export async function POST(req: NextRequest) {
  const groupedOrderData = await req.json();

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

  // groupedOrderの処理を行う
  const processedGroupOrder = processGroupedOrder(groupedOrder);
  return NextResponse.json(processedGroupOrder);
}

const processGroupedOrder = (groupedOrder: GroupedOrder): GroupedOrder => {
  // groupedOrderの処理ロジックを実装
  // 例: 合計金額の計算、注文IDの検証など
  groupedOrder.orderID = uuidv7();
  groupedOrder.didClientPay = false; // 改変を無視
  groupedOrder.InitSingleOrderID(); // orderIDが設定された状態で再度設定

  // TODO:決済が処理されるまで、processedGroupedOrderを一時コレクションに保存する (MongoDB) (PaymentPendingGroupedOrders)
  // 決済が完了したら、コレクションから移動し、依頼リストのコレクションに保存する (ここでは行わない)
  clientPromise.then(async (client) => {
    const db = client.db();
    const collection = db.collection('unpayed-comms');
    await collection.insertOne(groupedOrder);
  }).catch(err => {
    console.error('Failed to insert document', err);
  });
  
  return groupedOrder as GroupedOrder;
};