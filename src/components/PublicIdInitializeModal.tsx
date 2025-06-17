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
  Checkbox,
  useDisclosure, 
  useToast,
  Box,
  Center,
} from "@chakra-ui/react";
import { keyframes } from '@emotion/react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

// アニメーションの定義
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const PublicIdInitializeModal: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [publicId, setPublicId] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const toast = useToast();
  const { status } = useSession();

  useEffect(() => {
    // ログインしていない場合はモーダルを表示しない
    if (status !== 'authenticated') {
      return;
    }

    // Public IDの設定状況を確認
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
  }, [status, onOpen]);

  const handleInitialize = async () => {
    try {
      // Public IDのポストリクエストをAPIに送信
      await axios.post('/api/public-id', { publicID: publicId });

      toast({
        title: "Public IDが設定されました。",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error : unknown) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Public IDの設定に失敗しました。",
          description: error.response?.data?.error || "不明なエラーが発生しました。",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Public IDの設定に失敗しました。",
          description: "不明なエラーが発生しました。",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
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
            <Text mb={1}>(設定しないとバグります)</Text>
            <Text mb={8} fontSize="sm" color="gray.500">※一度設定したら変更できません。</Text>
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
              mb={4}
            />
            <Checkbox 
              isChecked={isAgreed} 
              onChange={(e) => setIsAgreed(e.target.checked)}
            >
              <span>
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#3182ce", textDecoration: "underline" }}
                >
                  利用規約
                </a>
                と
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#3182ce", textDecoration: "underline" }}
                >
                  プライバシーポリシー
                </a>
                に同意します
              </span>
            </Checkbox>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button 
            colorScheme="blue" 
            onClick={handleInitialize} 
            size="lg" 
            w="full" 
            mb={5}
            isDisabled={!isAgreed}
          >
            はじめる
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PublicIdInitializeModal;