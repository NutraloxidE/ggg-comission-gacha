import { useEffect, useState } from 'react';
import { 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalFooter, 
  ModalBody, 
  ModalCloseButton, 
  Button, 
  Input, 
  Text,
  useDisclosure, 
  useToast,
  Box,
  Center,
} from "@chakra-ui/react";
import { keyframes } from '@emotion/react';
import axios from 'axios';

// アニメーションの定義
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const PublicIdInitializeModal: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [publicId, setPublicId] = useState('');
  const toast = useToast();

  useEffect(() => {
    const checkPublicId = async () => {
      try {
        const response = await axios.get('/api/public-id');
        if (!response.data.publicID) {
          onOpen();
        }
      } catch (error) {
        console.error('Error fetching public ID:', error);
        onOpen();
      }
    };

    checkPublicId();
  }, [onOpen]);

  const handleInitialize = async () => {
    try {
      const response = await axios.post('/api/public-id', { publicID: publicId });
      toast({
        title: "Public IDが設定されました。",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Public IDの設定に失敗しました。",
        description: error.response?.data?.error || "不明なエラーが発生しました。",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md" closeOnOverlayClick={false} closeOnEsc={false}>
      <ModalOverlay />
      <ModalContent animation={`${fadeIn} 0.3s ease-in-out`}>
        <ModalHeader bgGradient="linear(to-r, teal.500, green.500)" color="white" borderRadius="md">
          Public IDの初期化
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box p={4}>
            <Center>
              <Text fontSize="2xl" fontWeight="bold" mb={5}>ようこそ！</Text>
            </Center>
            <Text mb={1}>はじめに、Public IDを設定してください。</Text>
            <Text mb={8}>(設定しないとバグります)</Text>
            <Text mb={4}>Public IDは以下の条件を満たす必要があります：</Text>
            <Text mb={8}>
              - アーティスト名が含まれている<br />
              - 数字が含まれている<br />
              - スペースが含まれていない<br />
              - 使用可能な記号はハイフンとピリオドのみ (-, .)
            </Text>
            <Input 
              placeholder="新しいPublic IDを入力してください" 
              value={publicId} 
              onChange={(e) => setPublicId(e.target.value)} 
              size="lg"
              borderColor="teal.500"
              focusBorderColor="green.500"
              mb={0}
            />
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleInitialize} size="lg" w="full">
            はじめる
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PublicIdInitializeModal;