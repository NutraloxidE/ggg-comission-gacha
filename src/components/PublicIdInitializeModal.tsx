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
  useDisclosure 
} from "@chakra-ui/react";

const PublicIdInitializeModal: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [publicId, setPublicId] = useState('');
  const testvariable = true; // ここでtestvariableを定義

  useEffect(() => {
    if (testvariable) {
      onOpen();
    }
  }, [testvariable, onOpen]);

  const handleInitialize = () => {
    // 初期化処理をここに追加
    console.log('Public ID:', publicId);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Public IDの初期化</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input 
            placeholder="新しいPublic IDを入力してください" 
            value={publicId} 
            onChange={(e) => setPublicId(e.target.value)} 
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onClose}>
            キャンセル
          </Button>
          <Button colorScheme="blue" onClick={handleInitialize}>
            初期化
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PublicIdInitializeModal;