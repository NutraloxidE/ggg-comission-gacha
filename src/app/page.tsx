'use client'

import { Box, Heading, useColorMode, Button, Flex, useMediaQuery } from "@chakra-ui/react";
import SideMenu from '@/components/SideMenu.client';


export default function Home () {
  const { toggleColorMode } = useColorMode();
  const [isLargerThanThatSize] = useMediaQuery("(min-width: 768px)");

  return (
    <Flex>
        <SideMenu toggleColorMode={toggleColorMode} />
        <Box marginLeft={(isLargerThanThatSize ? "47vw" : "calc(50vw - 75px)")} padding={4} display="flex" alignItems="center" justifyContent="center" height="100vh">
          <Box textAlign="center">
            <Heading mb={6}>Hello, World!</Heading>
            <Button onClick={toggleColorMode}>Toggle Color</Button>
          </Box>
        </Box>  
    </Flex>
  )
}
