import { Box, Heading, Text } from "@chakra-ui/react";
import { GroupedOrder } from "@/app/types/order/GroupedOrder";

interface OrderReceiptProps {
  groupedOrder: GroupedOrder;
}

const OrderReceipt: React.FC<OrderReceiptProps> = ({ groupedOrder }) => {
  return (
    <Box>
      <Heading mb={6} borderBottom="2px" borderColor="blue.200">
        注文の確認
      </Heading>
      <Text>依頼ID: {groupedOrder.orderID}</Text>
      <Text>依頼タイプ: {groupedOrder.orderType}</Text>
      <Text>依頼詳細: {groupedOrder.orderDetails}</Text>
      <Text>合計金額: {groupedOrder.totalFeeThatClientPays}</Text>
      <Text>報酬金額: {groupedOrder.totalRewardForWorker}</Text>
      <Text>依頼日: {groupedOrder.comissionCuedDate ? groupedOrder.comissionCuedDate.toString() : "N/A"}</Text>
      <Text>期限日: {groupedOrder.comissionExpireDate.toString()}</Text>
      <Text>全体の締め切り: {groupedOrder.overallDeadline.toString()}</Text>
      <Text>依頼を受けたか: {groupedOrder.didSomeoneTakeThisOrder ? "はい" : "いいえ"}</Text>
      <Heading size="md" mt={6} mb={4} borderBottom="2px" borderColor="blue.200">
        注文一覧
      </Heading>
      <Box>
        {groupedOrder.orders.map((order, index) => (
          <Box key={index} mb={4} p={4} border="1px" borderColor="gray.200" borderRadius="md">
            <Text>注文ID: {order.id}</Text>
            <Text>作業タイプ: {order.workType}</Text>
            <Text>注文詳細: {order.orderDetails}</Text>
            <Text>クライアント支払金額: {order.totalFeeThatClientPays}</Text>
            <Text>報酬金額: {order.totalRewardForWorker}</Text>
            <Text>締め切り: {order.Deadline.toString()}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default OrderReceipt;