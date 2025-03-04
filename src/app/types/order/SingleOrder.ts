import { WORKER_TAKE_PERCENTAGE } from "@/app/config/constants";

export class SingleOrder {
  id: string;
  workerPublicUserID: string;
  workType: string;        
  orderDetails: string;    
  totalFeeThatClientPays: number;
  totalRewardForWorker: number;
  Deadline: Date;

  constructor(workType: string, orderDetails: string, totalFeeThatClientPays: number, Deadline: Date);
  constructor(order: { workType: string, orderDetails: string, totalFeeThatClientPays: number, Deadline: Date });
  constructor(
    workTypeOrOrder: string | { workType: string, orderDetails: string, totalFeeThatClientPays: number, Deadline: Date },
    orderDetails?: string,
    totalFeeThatClientPays?: number,
    Deadline?: Date
  ) {
    if (typeof workTypeOrOrder === 'string') {
      this.id = "this will be assigned by parent object";
      this.workerPublicUserID = "NotAssignedYet";
      this.workType = workTypeOrOrder;
      this.orderDetails = orderDetails!;
      this.totalFeeThatClientPays = totalFeeThatClientPays!;
      this.totalRewardForWorker = totalFeeThatClientPays! * WORKER_TAKE_PERCENTAGE;
      this.Deadline = Deadline!;
    } else {
      this.id = "this will be assigned by parent object";
      this.workerPublicUserID = "NotAssignedYet";
      this.workType = workTypeOrOrder.workType;
      this.orderDetails = workTypeOrOrder.orderDetails;
      this.totalFeeThatClientPays = workTypeOrOrder.totalFeeThatClientPays;
      this.totalRewardForWorker = workTypeOrOrder.totalFeeThatClientPays * WORKER_TAKE_PERCENTAGE;
      this.Deadline = workTypeOrOrder.Deadline;
    }
  }

  public IWannaTakeThisOrder(workerPublicUserID: string): void {
    this.workerPublicUserID = workerPublicUserID;
  }
}