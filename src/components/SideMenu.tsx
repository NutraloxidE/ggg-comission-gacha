// SideMenu.tsx
import { useState, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, VStack, Link, Text, useColorModeValue, Icon, Button } from "@chakra-ui/react";
import { FaSignInAlt, FaHome, FaPen, FaBell, FaEnvelope, FaLightbulb, FaClipboardList, FaTasks  } from "react-icons/fa";

interface SideMenuProps {
  toggleColorMode: () => void;
}

export default function SideMenu({ toggleColorMode }: SideMenuProps) {

  const bg = useColorModeValue("gray.100", "gray.700");
  const color = useColorModeValue("black", "white");
  const IconSize = "8";
  const [isLargerThanThatSize, setIsLargerThanThatSize] = useState(false);
  const router = useRouter();

  useLayoutEffect(() => {
    const handleResize = () => {
      setIsLargerThanThatSize(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const linkProps = {
    display: "flex",
    alignItems: "center",
    marginLeft: "5px",
  };

  return (
    <Box
      width={isLargerThanThatSize ? "200px" : "75px"}
      height="100vh"
      bg={bg}
      color={color}
      padding={4}
      boxShadow="md"
      position="fixed"
    >
      <VStack align="start" spacing={6} >
        <Link onClick={() => router.push('/')} {...linkProps}>
          <Icon as={FaHome} mr={2} boxSize={IconSize} />
          {isLargerThanThatSize && <Text>ホーム</Text>}
        </Link>
        <Link onClick={() => router.push('/make-comission')} {...linkProps}>
          <Icon as={FaPen} mr={2} boxSize={IconSize} />
          {isLargerThanThatSize && <Text>依頼をする</Text>}
        </Link>
        <Link href="#task-list" {...linkProps}>
          <Icon as={FaClipboardList} mr={2} boxSize={IconSize} />
          {isLargerThanThatSize && <Text>依頼を探す</Text>}
        </Link>
        <Link href="#quest-board" {...linkProps}>
          <Icon as={FaTasks} mr={2} boxSize={IconSize} />
          {isLargerThanThatSize && <Text>進行中の依頼</Text>}
        </Link>
        <Link href="#notifications" {...linkProps}>
          <Icon as={FaBell} mr={2} boxSize={IconSize} />
          {isLargerThanThatSize && <Text>通知</Text>}
        </Link>
        <Link href="#messages" {...linkProps}>
          <Icon as={FaEnvelope} mr={2} boxSize={IconSize} />
          {isLargerThanThatSize && <Text>メッセージ</Text>}
        </Link>

        {/* It will be removed after pull up menu */}
        <Link onClick={toggleColorMode} {...linkProps}>
          <Icon as={FaLightbulb} mr={2} boxSize={IconSize} /> 
          {isLargerThanThatSize && <Text>Toggle Lightmode</Text>}
        </Link>
      </VStack>

      <Box position="fixed" bottom={0} p={4} ml={isLargerThanThatSize ? "0" : "-20px"}>
        <Button as={Link} href="#login" leftIcon={<FaSignInAlt />} width="100%">
          {isLargerThanThatSize && <Text>ログイン</Text>}
        </Button>
      </Box>

    </Box>
  );
}

