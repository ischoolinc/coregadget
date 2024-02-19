import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Icon,
} from '@chakra-ui/react';

interface RecycleModalProps {
  isWithdrawOpen: boolean;
  onWithdrawClose: () => void;
  handleTrashClick: () => void;
}

const RecycleModal: React.FC<RecycleModalProps> = ({
  isWithdrawOpen,
  onWithdrawClose,
  handleTrashClick,
}) => {
  return (
    <Modal
    closeOnOverlayClick={false}
    isOpen={isWithdrawOpen}
    onClose={onWithdrawClose}
    isCentered
  >
    <ModalOverlay />
    <ModalContent containerProps={{ padding: "2rem" }}>
      <ModalHeader className="!text-2xl">刪除公告</ModalHeader>
      <ModalCloseButton />

      <ModalBody pb={6} className="text-center">
        <Icon w={16} h={16} viewBox="0 0 32 32">
          <g>
            <g data-name="48 Warning">
              <path
                fill="#ffd54f"
                d="M29.764 23.453 18.576 5.52a3.027 3.027 0 0 0-5.146-.009L2.224 23.474A3.027 3.027 0 0 0 4.807 28h22.386a3.028 3.028 0 0 0 2.571-4.547z"
                opacity="1"
                data-original="#ffd54f"
              ></path>
              <path
                fill="#596c76"
                d="m15.087 18.624-.266-3.976c-.052-.8-.325-2.093.286-2.743.465-.5 1.566-.586 1.9.107a4.873 4.873 0 0 1 .182 2.536l-.356 4.093a3.221 3.221 0 0 1-.249 1.12.708.708 0 0 1-1.254.013 3.763 3.763 0 0 1-.243-1.15zm.921 5.463a1.24 1.24 0 0 1-.142-2.471 1.24 1.24 0 1 1 .142 2.471z"
                opacity="1"
                data-original="#596c76"
              ></path>
            </g>
          </g>
        </Icon>
        <div className="mt-4">是否要將此公告移至垃圾桶？</div>
      </ModalBody>

      <ModalFooter className="gap-4">
        <Button
          colorScheme="orange"
          variant="outline"
          className="w-full"
          onClick={onWithdrawClose}
        >
          否
        </Button>
        <Button
          colorScheme="orange"
          className="mr-auto w-full"
          onClick={() => {
            onWithdrawClose();
            handleTrashClick();
          }}
        >
          是
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
  );
};

export default RecycleModal;
