import { SingleOrder } from './SingleOrder';
import {SERVICE_FEE_PERCENTAGE, WORKER_TAKE_PERCENTAGE} from "@/app/config/constants";

export interface GroupedOrder {
  id: number;
  orders: SingleOrder[];
  totalFee: number;
  overallDeadline: Date;
  isTaxed: boolean;
}

export function getTaxedGroupedOrder(groupedOrder: GroupedOrder): GroupedOrder {
  if (groupedOrder.isTaxed) { return groupedOrder; }

  const taxedTotalFee = groupedOrder.totalFee * WORKER_TAKE_PERCENTAGE;
  return {
    ...groupedOrder,
    totalFee: taxedTotalFee,
    isTaxed: true,
  };
}

export function calculateTotalFee(groupedOrder: GroupedOrder): number {
  return groupedOrder.orders.reduce((total, order) => total + order.fee, 0);
}