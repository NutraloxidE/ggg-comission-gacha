'use client'

import { Box, Heading, Button, useColorMode, Flex, useMediaQuery } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import SideMenu from "../../../components/SideMenu";
import { StepsHeader } from "../../../components/StepsHeader";

export default function Home () {
  const { toggleColorMode } = useColorMode();
  const [isLargerThanThatSize] = useMediaQuery("(min-width: 768px)");
  const router = useRouter();

  const sideMenuWidth = isLargerThanThatSize ? "200px" : "75px";

  const steps = ['種類を選択', '詳細を入力', 'お支払い'];
  const currentStep = 1;

  return (
    <Flex>
      <SideMenu toggleColorMode={toggleColorMode} />

      {/* SideMenu の隣に配置するコンテンツ領域 */}
      <Box flex="1" ml={sideMenuWidth}>
        <StepsHeader steps={steps} currentStep={currentStep} />

        {/* ヘッダー分の余白（pt）を考慮して中央配置 */}
        <Flex
          flex="1"
          pt="80px"
          padding={4}
          alignItems="center"
          justifyContent="center"
          height="calc(100vh - 80px)"
        >
          <Box textAlign="center">
            <Heading mb={6}>作曲について、詳細をお聞かせ下さい。</Heading>

          </Box>
        </Flex>
      </Box>
    </Flex>
  )
}