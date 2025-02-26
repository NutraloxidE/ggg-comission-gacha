import { Box, Heading, Text, Divider } from "@chakra-ui/react";
import { GroupedOrder } from "@/app/types/order/GroupedOrder";

/**
 * 
 * シンプルに注文内容を表示するコンポーネント
 * クライアントに必要な情報だけを表示する
 * 
 */

interface OrderReceiptSimpleProps {
  groupedOrder: GroupedOrder;
}

const OrderReceiptSimple: React.FC<OrderReceiptSimpleProps> = ({ groupedOrder }) => {
  // 合計金額を計算
  const totalAmount = groupedOrder.orders.reduce((sum, order) => sum + order.totalFeeThatClientPays, 0);

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="md">
      <Box textAlign="center">
        <Heading mb={6} borderBottom="2px" borderColor="blue.200">
          注文の確認
        </Heading>
      </Box>
      <Box mb={8}>
        {groupedOrder.orders.map((order, index) => (
          <Box key={index} mb={0} p={0}>
            <Text>
              <Text as="span" fontWeight="bold">作業内容:</Text> {order.workType} / 
              <Text as="span" fontWeight="bold"> 料金 :</Text> {order.totalFeeThatClientPays.toLocaleString()}円
            </Text>
          </Box>
        ))}
      </Box>
      <Divider mt={2} />

      <Box mt={4}>
        <Heading size="md" mb={2}>備考・詳細</Heading>
        <Text>{groupedOrder.orderDetails}</Text>
      </Box>
      <Divider mt={2} />

      <Box mt={4}>
        <Heading size="md" mb={2}>納期</Heading>
        <Text>{groupedOrder.overallDeadline.toLocaleDateString()}</Text>
      </Box>
      <Divider mt={2} />

      <Box mt={4}>
        <Heading size="lg" mb={2}>合計金額</Heading>
        <Heading size="md" mb={2}>
          <Text as="span" textDecoration="underline" textDecorationThickness="1px" textUnderlineOffset="5px">{totalAmount.toLocaleString()}円</Text>
        </Heading>
        <Text color="gray.500" fontSize="sm">注文ID:{groupedOrder.id}</Text>
        <Text color="gray.500" fontSize="sm">※小数点が表示されますが、問題ありません。</Text>
      </Box>
    </Box>
  );
};

export default OrderReceiptSimple;