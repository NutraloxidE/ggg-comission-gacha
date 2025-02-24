import { v4 as uuidv4 } from 'uuid';
import { WORKER_TAKE_PERCENTAGE } from "@/app/config/constants";

export class SingleOrder {
  id: string = uuidv4();
  workType: string;        
  orderDetails: string;    
  totalFeeThatClientPays: number;
  totalRewardForWorker: number;
  Deadline: Date;

  constructor(workType: string, orderDetails: string, totalFeeThatClientPays: number, Deadline: Date) {
    this.workType = workType;
    this.orderDetails = orderDetails;
    this.totalFeeThatClientPays = totalFeeThatClientPays;
    this.totalRewardForWorker = totalFeeThatClientPays * WORKER_TAKE_PERCENTAGE;
    this.Deadline = Deadline;
  }
}