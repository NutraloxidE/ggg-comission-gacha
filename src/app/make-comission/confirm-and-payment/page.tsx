'use client'

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Box, Heading, useColorMode, Flex, useMediaQuery } from "@chakra-ui/react";
import SideMenu from '../../../components/SideMenu.client';
import { StepsHeader } from '../../../components/StepsHeader';
import { GroupedOrder } from "@/app/types/order/GroupedOrder";
import OrderReceipt from "../../../components/OrderReceipt";

export default function Home () {
  const router = useRouter();
  const { toggleColorMode } = useColorMode();
  const [isLargerThanThatSize] = useMediaQuery("(min-width: 768px)");
  const [groupedOrder, setGroupedOrder] = useState<GroupedOrder | null>(null);

  const sideMenuWidth = isLargerThanThatSize ? "200px" : "75px";

  const steps = ['種類を選択', '詳細を入力', 'お支払い'];
  const currentStep = 2;

  useEffect(() => {
    if (router.query.groupedOrder) {
      setGroupedOrder(JSON.parse(router.query.groupedOrder as string));
    }
  }, [router.query.groupedOrder]);

  return (
    <Flex>
        <SideMenu toggleColorMode={toggleColorMode} />
        <Box flex="1" ml={sideMenuWidth} overflowY="auto" maxH="100vh" pt="100px">
          <StepsHeader steps={steps} currentStep={currentStep} />
          <Flex
            padding={4}
            alignItems="center"
            justifyContent="center"
            minH="calc(100vh - 100px)"
          >
            <Box textAlign="center">
              {groupedOrder ? (
                <OrderReceipt groupedOrder={groupedOrder} />
              ) : (
                <Heading>Loading...</Heading>
              )}
            </Box>
          </Flex>
        </Box>
    </Flex>
  )
}