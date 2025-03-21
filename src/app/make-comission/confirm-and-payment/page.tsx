'use client'

/**
 * めっちゃ
 * つくりかけです
 * 注意、ほぼ機能してない
 * 
 * 2024/02/24 R1cefarm
 */

import { useEffect, useState } from "react";
import { Box, useColorMode, Flex, useMediaQuery } from "@chakra-ui/react";
import SideMenu from '../../../components/SideMenu.client';
import { StepsHeader } from '../../../components/StepsHeader';
import OrderReceiptSimple from '../../../components/OrderReceiptSimple';
import { GroupedOrder } from '@/app/types/order/GroupedOrder';
import { useSession } from "next-auth/react"; // 追加

export default function Home () {
  const { toggleColorMode } = useColorMode();
  const [isLargerThanThatSize] = useMediaQuery("(min-width: 768px)");
  const sideMenuWidth = isLargerThanThatSize ? "200px" : "75px";
  const steps = ['種類を選択', '詳細を入力', 'お支払い'];
  const currentStep = 2;

  const [groupedOrder, setGroupedOrder] = useState<GroupedOrder | null>(null);
  const { data: session } = useSession(); // 追加
  const [hasSentOrder, setHasSentOrder] = useState(false); // 追加

  useEffect(() => {
    if (typeof window !== 'undefined' && !hasSentOrder) { // 追加
      // URLからgroupedOrderを取得
      const query = new URLSearchParams(window.location.search);
      const groupedOrderString = query.get('groupedOrder');
      if (groupedOrderString) {
        try {
          const parsedGroupedOrder = JSON.parse(groupedOrderString);
          // overallDeadlineをDateオブジェクトに変換
          parsedGroupedOrder.overallDeadline = new Date(parsedGroupedOrder.overallDeadline);
          // 入力の検証とサニタイズ
          if (validateGroupedOrder(parsedGroupedOrder)) {
            sendGroupedOrder(parsedGroupedOrder);
            setHasSentOrder(true); // 追加
          } else {
            console.error('Invalid groupedOrder data');
          }
        } catch (error) {
          console.error('Failed to parse groupedOrder', error);
        }
      }
    }
  }, [hasSentOrder]); // 追加

  const validateGroupedOrder = (data) => {
    // ここでgroupedOrderの検証ロジックを実装
    // 例: 必須フィールドのチェック、データ型のチェックなど
    return true;
  };

  const sendGroupedOrder = async (groupedOrder: GroupedOrder) => {
    try {
      const response = await fetch('/api/process-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(groupedOrder),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const processedGroupOrder = await response.json();
      // overallDeadlineをDateオブジェクトに変換
      processedGroupOrder.overallDeadline = new Date(processedGroupOrder.overallDeadline);
      setGroupedOrder(processedGroupOrder);
    } catch (error) {
      console.error('Failed to send groupedOrder', error);
    }
  };

  return (
    <Flex>
      <SideMenu toggleColorMode={toggleColorMode} />
      <Box flex="1" ml={sideMenuWidth} overflowY="auto" maxH="100vh" pt="50px">
        <StepsHeader steps={steps} currentStep={currentStep} />

        {/* コンテンツ全体をラップするコンテナ */}
        <Flex
          padding={4}
          alignItems="center"
          justifyContent="center"
          minH="calc(100vh - 100px)"
          direction="column"
        > 
          {/* ユーザー情報の表示 */}
            {session?.user ? (
            <div>
              ユーザーネーム: {session.user.name}<br />
              ユーザーID: {session.user.id}<br />
              メールアドレス: {session.user.email}<br />
              サブジェクトID: {session.user.sub}
            </div>
            ) : (
            <div>ログインしていません</div>
          )}

          {groupedOrder && <OrderReceiptSimple groupedOrder={groupedOrder} />}
        </Flex>
      </Box>
    </Flex>
  )
}