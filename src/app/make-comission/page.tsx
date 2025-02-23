'use client'

import { Box, Heading, Button, useColorMode, Flex, useMediaQuery } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import SideMenu from '@/components/SideMenu.client';
import { StepsHeader } from "../../components/StepsHeader";

export default function Home () {
  const { toggleColorMode } = useColorMode();
  const [isLargerThanThatSize] = useMediaQuery("(min-width: 768px)");
  const router = useRouter();

  const sideMenuWidth = isLargerThanThatSize ? "200px" : "75px";

  const buttons = [
    { label: "作編曲", route: "/make-comission/compose" },
    { label: "作詞", route: "/lyrics" },
    { label: "イラスト", route: "/illustration" },
    { label: "出演(DJ/LIVE)", route: "/dj-live" }, 
  ];

  const steps = ['種類を選択', '詳細を入力', 'お支払い'];
  const currentStep = 0;

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
            <Heading mb={6}>どのようなタイプの依頼を行いたいですか？</Heading>
            <Flex gap={2} wrap="wrap" justifyContent="center">
              {buttons.map(({ label, route }) => (
                <Button key={label} variant="outline" onClick={() => router.push(route)}>
                  {label}
                </Button>
              ))}
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Flex>
  )
}