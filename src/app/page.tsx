'use client'

import { Button, Flex, Heading, Input, useColorMode, useColorModeValue } from "@chakra-ui/react";


export default function Home() {

  const { toggleColorMode } = useColorMode();
  const forBackGround = useColorModeValue("gray.100", "gray.700");

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      
      <Flex direction="column" background={forBackGround} padding={12} rounded={6}>

      <Heading mb={6}>Log in</Heading>
      <Input placeholder="sample@sample.com" variant="filled" mb={3} type="email" />
      <Input placeholder="********" variant="filled" mb={6} type="password" />
      <Button mb={6} colorScheme="teal">Log in</Button>
      <Button onClick = {toggleColorMode}>Toggle Color Mode</Button>
      </Flex>
      
    </Flex>
  )
}
