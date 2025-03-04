import { NextRequest, NextResponse } from 'next/server';
import { GroupedOrder } from '@/app/types/order/GroupedOrder';
import { v7 as uuidv7 } from 'uuid';


/*
* api/process-order
*/

export async function POST(req: NextRequest) {
  const groupedOrder: GroupedOrder = await req.json();

  // groupedOrderの処理を行う
  const processedGroupOrder = processGroupedOrder(groupedOrder);
  return NextResponse.json(processedGroupOrder);
}

const processGroupedOrder = (groupedOrder: GroupedOrder): GroupedOrder => {
  // groupedOrderの処理ロジックを実装
  // 例: 合計金額の計算、注文IDの検証など
  groupedOrder.orderID = uuidv7();
  groupedOrder.didClientPay = false; // 改変を無視

  // TODO:決済が処理されるまで、processedGroupedOrderを一時コレクションに保存する (MongoDB) (PaymentPendingGroupedOrders)
  // 決済が完了したら、コレクションから移動し、依頼リストのコレクションに保存する
  
  return groupedOrder as GroupedOrder;
};