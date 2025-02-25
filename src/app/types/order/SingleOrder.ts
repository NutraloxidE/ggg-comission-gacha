import { WORKER_TAKE_PERCENTAGE } from "@/app/config/constants";

export class SingleOrder {
  id: string;
  workType: string;        
  orderDetails: string;    
  totalFeeThatClientPays: number;
  totalRewardForWorker: number;
  Deadline: Date;

  constructor(workType: string, orderDetails: string, totalFeeThatClientPays: number, Deadline: Date) {
    this.id = "this will be assigned by parent object";
    this.workType = workType;
    this.orderDetails = orderDetails;
    this.totalFeeThatClientPays = totalFeeThatClientPays;
    this.totalRewardForWorker = totalFeeThatClientPays * WORKER_TAKE_PERCENTAGE;
    this.Deadline = Deadline;
  }
}