'use client'

import { Box, Heading, useColorMode, Flex, useMediaQuery } from "@chakra-ui/react";
import SideMenu from "../../components/SideMenu";


export default function Home () {
  const { toggleColorMode } = useColorMode();
  const [isLargerThanThatSize] = useMediaQuery("(min-width: 768px)");

  return (
    <Flex>
        <SideMenu toggleColorMode={toggleColorMode} />
        <Box marginLeft={(isLargerThanThatSize ? "47vw" : "calc(50vw - 75px)")} padding={4} display="flex" alignItems="center" justifyContent="center" height="100vh">
          <Box textAlign="center">
            <Heading mb={6}>Comission</Heading>
          </Box>
        </Box>  
    </Flex>
  )
}
