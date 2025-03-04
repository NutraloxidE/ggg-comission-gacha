// SideMenu.tsx
import { useState, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, VStack, Link, Text, useColorModeValue, Icon, Button, Avatar, Flex,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure
} from "@chakra-ui/react";
import { FaSignInAlt, FaHome, FaPen, FaBell, FaEnvelope, FaLightbulb, FaClipboardList, FaTasks, FaSignOutAlt } from "react-icons/fa";
import { useSession, signOut } from "next-auth/react";

interface SideMenuProps {
  toggleColorMode: () => void;
}

export default function SideMenu({ toggleColorMode }: SideMenuProps) {
  const { data: session } = useSession();
  const bg = useColorModeValue("gray.100", "gray.700");
  const color = useColorModeValue("black", "white");
  const IconSize = "8";
  const [isLargerThanThatSize, setIsLargerThanThatSize] = useState(false);
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const handleSignOutConfirm = () => {
    onOpen();
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
    onClose();
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
      
      {/* 左下のユーザーログイン情報、ログインしていない時はログアウトボタンを表示 */}
      <Box position="fixed" bottom={0} p={4} ml={isLargerThanThatSize ? "-8px" : "-20px"} width={isLargerThanThatSize ? "180px" : "60px"}>
        {session ? (
          <Flex direction={isLargerThanThatSize ? "column" : "column"} alignItems="center" gap={2}>
            <Avatar 
              onClick={() => router.push('/profile')}
              ml={isLargerThanThatSize ? "0" : "5"}
              size={isLargerThanThatSize ? "md" : "sm"} 
              src={session.user?.image || undefined} 
              name={session.user?.name || "ユーザー"} 
              cursor="pointer"
              _hover={{
                transform: "scale(1.05)",
                boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.2)",
                transition: "all 0.2s ease"
              }}
            />
            {isLargerThanThatSize && (
              <Text fontSize="sm" fontWeight="bold" textAlign="center" noOfLines={1}>
                {session.user?.name}
              </Text>
            )}
            <Button 
              size="sm"
              onClick={handleSignOutConfirm} 
              leftIcon={<FaSignOutAlt />} 
              width="100%" 
              mt={1}
              ml={isLargerThanThatSize ? "0" : "5"}
              variant="outline"
            >
              {isLargerThanThatSize && "ログアウト"}
            </Button>
          </Flex>
        ) : (
          <Button as={Link} onClick={() => router.push('/signin')} leftIcon={<FaSignInAlt />} width="100%">
            {isLargerThanThatSize && <Text>ログイン</Text>}
          </Button>
        )}
      </Box>

      {/* ログアウト確認モーダル */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ログアウト確認</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            ログアウトしますか？
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              キャンセル
            </Button>
            <Button colorScheme="red" onClick={handleSignOut}>
              ログアウト
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}