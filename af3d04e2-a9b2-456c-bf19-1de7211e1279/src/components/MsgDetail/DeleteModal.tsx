// CustomDeleteModal.tsx
import React from "react";
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
} from "@chakra-ui/react";

interface DeleteModalProps {
  isWithdrawOpen: boolean;
  onWithdrawClose: () => void;
  handleDeleteClick: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isWithdrawOpen,
  onWithdrawClose,
  handleDeleteClick,
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
        <ModalHeader className="!text-2xl">永久刪除</ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={6} className="text-center">
          <Icon w={16} h={16} viewBox="0 0 24 24">
            <g>
              <g data-name="Layer 2">
                <path
                  fill="#ed4040"
                  d="M14.45 4a2.86 2.86 0 0 0-4.9 0L1.67 16.87a2.87 2.87 0 0 0 2.45 4.36h15.76a2.87 2.87 0 0 0 2.45-4.36z"
                  opacity="1"
                  data-original="#ed4040"
                ></path>
                <g fill="#fff">
                  <path
                    d="M12 14.75a.76.76 0 0 1-.75-.75V9.5a.75.75 0 0 1 1.5 0V14a.76.76 0 0 1-.75.75z"
                    fill="#ffffff"
                    opacity="1"
                    data-original="#ffffff"
                  ></path>
                  <circle
                    cx="12"
                    cy="16.5"
                    r="1"
                    fill="#ffffff"
                    opacity="1"
                    data-original="#ffffff"
                  ></circle>
                </g>
              </g>
            </g>
          </Icon>
          <div className="mt-4">是否要將此公告永久刪除？</div>
        </ModalBody>

        <ModalFooter className="gap-4">
          <Button
            colorScheme="red"
            variant="outline"
            className="w-full"
            onClick={() => {
              handleDeleteClick();
            }}
          >
            是
          </Button>
          <Button
            colorScheme="red"
            className="mr-auto w-full"
            onClick={onWithdrawClose}
          >
            否
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteModal;
