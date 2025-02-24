'use client'

import { Box, Heading, useColorMode, Flex, useMediaQuery } from "@chakra-ui/react";
import SideMenu from '../../../components/SideMenu.client';
import { StepsHeader } from '../../../components/StepsHeader';


export default function Home () {
  const { toggleColorMode } = useColorMode();
  const [isLargerThanThatSize] = useMediaQuery("(min-width: 768px)");

  const sideMenuWidth = isLargerThanThatSize ? "200px" : "75px";

  const steps = ['種類を選択', '詳細を入力', 'お支払い'];
  const currentStep = 2;

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
              <Heading mb={6} borderBottom="2px" borderColor="blue.200" >
                注文の確認
              </Heading>
            </Box>
          </Flex>
        </Box>
    </Flex>
  )
}
