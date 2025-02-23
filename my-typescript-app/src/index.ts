import { OrderDetails } from './types/orderDetails';

const order: OrderDetails = {
  orderId: '12345',
  customerName: 'John Doe',
  items: [
    { itemId: 'item1', quantity: 2, price: 10.0 },
    { itemId: 'item2', quantity: 1, price: 20.0 },
  ],
  totalAmount: 40.0,
  status: 'Pending',
};

console.log('Order Details:', order);