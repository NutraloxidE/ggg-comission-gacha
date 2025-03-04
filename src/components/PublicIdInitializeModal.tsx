import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
} from '@chakra-ui/react';

interface PublicIdInitializeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (publicID: string, name: string) => void;
}

const PublicIdInitializeModal: React.FC<PublicIdInitializeModalProps> = ({ isOpen, onClose, onSave }) => {
  const [publicID, setPublicID] = useState('');
  const [name, setName] = useState('');

  const handleSave = () => {
    onSave(publicID, name);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Public IDと名前を入力してください</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="publicID" isRequired>
            <FormLabel>Public ID</FormLabel>
            <Input value={publicID} onChange={(e) => setPublicID(e.target.value)} />
          </FormControl>
          <FormControl id="name" isRequired mt={4}>
            <FormLabel>名前</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            保存
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PublicIdInitializeModal;