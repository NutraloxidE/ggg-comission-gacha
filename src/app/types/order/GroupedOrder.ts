import { SingleOrder } from './SingleOrder';
import { WORKER_TAKE_PERCENTAGE } from "@/app/config/constants";

export class GroupedOrder {
  orderID: string; 
  orders: SingleOrder[];
  clientPublicUserID?: string;
  orderType: string;
  orderDetails: string;
  totalFeeThatClientPays: number;
  totalRewardForWorker: number;
  comissionCuedDate: Date | null;
  comissionExpireDate: Date;
  overallDeadline: Date;
  didClientPay: boolean = false;
  randomNum?: string;// 同じオーダーを複数回受け取らないための乱数、それ以外では使用しない

  constructor(orders: SingleOrder[], orderType: string, orderDetails: string, overallDeadline: Date, comissionExpireDate?: Date) {
    this.orderID = "NotAssignedYet";// APIでサーバー側で設定
    this.orders = orders;
    this.orderType = orderType;
    this.orderDetails = orderDetails;
    this.totalFeeThatClientPays = this.calculateTotalFee();
    this.totalRewardForWorker = this.totalFeeThatClientPays * WORKER_TAKE_PERCENTAGE;
    this.comissionCuedDate = new Date();
    this.comissionExpireDate = comissionExpireDate || this.calculateExpireDate(14); // 14日後をデフォルトに設定
    this.overallDeadline = overallDeadline;
  }

  public InitSingleOrderID(): void {
    for (let i = 0; i < this.orders.length; i++) {
      this.orders[i].id = this.orderID + "-" + i;
    }
  }

  //check didSomeoneTakeThisOrder
  // すべてのオーダーがNotAssignedYetでない場合、trueを返す
  get didSomeoneTakeThisOrder(): boolean {
    return this.orders.some(order => order.workerPublicUserID !== "NotAssignedYet");
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