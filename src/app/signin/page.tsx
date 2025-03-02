'use client'

import { Button, Flex, Heading, useColorMode, useColorModeValue, Text, Icon, Divider } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { FcGoogle } from 'react-icons/fc';

export default function Home() {
  const { toggleColorMode } = useColorMode();
  const forBackGround = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.200");

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Flex direction="column" background={forBackGround} padding={12} rounded={6} minW="350px">
        <Heading mb={6} textAlign="center">ログイン</Heading>
        
        <Button 
          mb={6} 
          onClick={handleGoogleSignIn}
          leftIcon={<Icon as={FcGoogle} boxSize="1.5em" />}
          colorScheme="gray"
          variant="outline"
          size="lg"
        >
          Googleでログイン
        </Button>
        
        <Divider mb={6} />
        
        <Button 
          size="sm" 
          onClick={toggleColorMode} 
          variant="ghost"
        >
          カラーモード切替
        </Button>
        
        <Text mt={4} fontSize="sm" color={textColor} textAlign="center">
          ログインすることで、利用規約とプライバシーポリシーに同意したことになります。
        </Text>
      </Flex>
    </Flex>
  )
}