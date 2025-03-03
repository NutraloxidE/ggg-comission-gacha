import { WORKER_TAKE_PERCENTAGE } from "@/app/config/constants";

export class SingleOrder {
  id: string;
  workerPublicUserID: string;
  workType: string;        
  orderDetails: string;    
  totalFeeThatClientPays: number;
  totalRewardForWorker: number;
  Deadline: Date;

  constructor(workType: string, orderDetails: string, totalFeeThatClientPays: number, Deadline: Date) {
    this.id = "this will be assigned by parent object";
    this.workerPublicUserID = "NotAssignedYet";
    this.workType = workType;
    this.orderDetails = orderDetails;
    this.totalFeeThatClientPays = totalFeeThatClientPays;
    this.totalRewardForWorker = totalFeeThatClientPays * WORKER_TAKE_PERCENTAGE;
    this.Deadline = Deadline;
  }

  public IWannaTakeThisOrder(workerPublicUserID: string): void {
    this.workerPublicUserID = workerPublicUserID;
  }
}