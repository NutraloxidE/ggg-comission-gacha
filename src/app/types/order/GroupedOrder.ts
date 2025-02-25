import { SingleOrder } from './SingleOrder';
import { WORKER_TAKE_PERCENTAGE } from "@/app/config/constants";
import { v4 as uuidv4 } from 'uuid';

export class GroupedOrder {
  id: string;
  orders: SingleOrder[];
  orderType: string;
  orderDetails: string;
  totalFeeThatClientPays: number;
  totalRewardForWorker: number;
  comissionCuedDate: Date;
  comissionExpireDate: Date;
  overallDeadline: Date;
  didClientPay: boolean = false;
  didSomeoneTakeThisOrder: boolean = false;

  constructor(orders: SingleOrder[], orderType: string, orderDetails: string, overallDeadline: Date, comissionExpireDate?: Date) {
    this.id = uuidv4();
    this.orders = orders;
    this.orderType = orderType;
    this.orderDetails = orderDetails;
    this.totalFeeThatClientPays = this.calculateTotalFee();
    this.totalRewardForWorker = this.totalFeeThatClientPays * WORKER_TAKE_PERCENTAGE;
    this.comissionCuedDate = new Date();
    this.comissionExpireDate = comissionExpireDate || this.calculateExpireDate(14); // 14日後をデフォルトに設定
    this.overallDeadline = overallDeadline;

    for (let i = 0; i < orders.length; i++) {
      orders[i].id = this.id + "-" + i;
    }
  }

  calculateTotalFee(): number {
    return this.orders.reduce((total, order) => total + order.totalFeeThatClientPays, 0);
  }

  private calculateExpireDate(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  }

}