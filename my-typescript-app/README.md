# My TypeScript App

This project is a TypeScript application that demonstrates the use of types and interfaces in TypeScript. It includes an `OrderDetails` type that defines the structure of order details, which can be utilized throughout the application.

## Project Structure

```
my-typescript-app
├── src
│   ├── index.ts          # Entry point of the application
│   └── types
│       └── orderDetails.ts # Defines the OrderDetails type
├── package.json          # npm configuration file
├── tsconfig.json         # TypeScript configuration file
└── README.md             # Project documentation
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd my-typescript-app
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Compile the TypeScript files:
   ```
   npx tsc
   ```

4. Run the application:
   ```
   node dist/index.js
   ```

## Usage Example

In `src/index.ts`, you can import and use the `OrderDetails` type as follows:

```typescript
import { OrderDetails } from './types/orderDetails';

const order: OrderDetails = {
    orderId: '12345',
    customerName: 'John Doe',
    items: [
        { productId: 'abc', quantity: 2 },
        { productId: 'def', quantity: 1 }
    ],
    totalAmount: 100.00,
    status: 'Pending'
};

console.log(order);
```

## License

This project is licensed under the MIT License.