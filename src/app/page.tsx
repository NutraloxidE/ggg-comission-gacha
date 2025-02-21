'use client'

import { Box, Heading, useColorMode, useColorModeValue, Button, Flex, useMediaQuery } from "@chakra-ui/react";
import SideMenu from "../components/SideMenu";


export default function Home () {
  const { toggleColorMode } = useColorMode();
  const bg = useColorModeValue("gray.100", "gray.700");
  const color = useColorModeValue("black", "white");
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
