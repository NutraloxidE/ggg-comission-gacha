export type OrderDetails = {
  orderId: string;
  customerName: string;
  items: Array<{
    itemId: string;
    itemName: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'completed' | 'canceled';
};