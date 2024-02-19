import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MsgList } from "../MsgList";
import { MsgDetail } from "../MsgDetail";
import { useCheckedItemStore } from "../../context/checkedItems.model";
import { useTrashNoticeStore } from "../../context/trash.model";
import {
  Text,
  Button,
  Card,
  Checkbox,
  Divider,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
  useToast,
  Tooltip,
} from "@chakra-ui/react";
import { DeleteIcon, RestoreIcon, BackIcon } from "../Icons";
import {
  getMyTrashNotice,
  pushMultipleNoticeRestore,
  deleteMultipleNotices,
} from "../../utilities/Api/TrashHelp";
type Notice = {
  ID: string;
  Category: string;
  Title: string;
  PostTime: string;
  Read: string;
  Message: string;
};
export function Trash() {
  const navigate = useNavigate();
  const { noticeID } = useParams();
  // 載入中
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // 狀態敘述
  const [stateInfo, setStateInfo] = useState<string>("載入中…");
  // 垃圾桶context
  const { notices, setNotices, removeTrash } = useTrashNoticeStore();

  useEffect(() => {
    console.log("fetchingTrash");
    getMyTrashNotice().then((res) => {
      console.log(res);
      setNotices(res.Notice);
      setIsLoading(false);
    });
    return () => {
      setCheckedItems([]);
    };
  }, []);

  const {
    isOpen: isWithdrawOpen2,
    onOpen: onWithdrawOpen2,
    onClose: onWithdrawClose2,
  } = useDisclosure();

  const { getButtonProps } = useDisclosure({
    defaultIsOpen: true,
  });

  const buttonProps = getButtonProps();

  const [showDetailPanel, setShowDetailPanel] = React.useState<boolean>(false);

  /**公告 */
  const [trashMsgs, setTrashMsgs] = useState<Notice[]>([]);

  useEffect(() => {
    setTrashMsgs(notices);
    if (!isLoading && !notices.length) {
      setStateInfo("垃圾桶無公告");
    }
  }, [notices, isLoading]);

  // 從URL的search屬性中取得notice參數的值
  useEffect(() => {
    if (!isLoading) {
      if (noticeID) {
        const msg = notices.find((msg) => msg.ID == noticeID);
        if (msg) {
          setShowDetailPanel(true);
        }
      } else {
        setShowDetailPanel(false);
      }
    }
  }, [noticeID, isLoading]);

  /**點擊清單上的公告 */
  const handleMsgClick = (msg: Notice) => {
    navigate(`/trash/${msg.ID}`);
  };

  // 全選功能context
  const { checkedItems, setCheckedItems, toggleCheckedItem } =
    useCheckedItemStore();
  const allChecked =
    checkedItems.length > 0 && checkedItems.length == trashMsgs.length;
  const isIndeterminate =
    checkedItems.length > 0 && checkedItems.length !== trashMsgs.length;

  // 全選checkbox變動
  const handleParentChange = (e: { target: { checked: any } }) => {
    if (e.target.checked) {
      setCheckedItems(trashMsgs.map((item) => item.ID));
    } else {
      setCheckedItems([]);
    }
  };

  // 單則勾選
  const handleChildChange = (ID: string) => {
    toggleCheckedItem(ID);
  };

  // 多個刪除
  const handleMultipleDelete = () => {
    deleteMultipleNotices(checkedItems);
    checkedItems.map((ID) => {
      removeTrash(ID);
    });
    if (noticeID && checkedItems.includes(noticeID)) {
      navigate(`/trash`);
    }
    setCheckedItems([]);
    onWithdrawClose2();
  };

  // 多個復原
  const handleMultipleTrash = () => {
    pushMultipleNoticeRestore(checkedItems);
    checkedItems.map((ID) => {
      removeTrash(ID);
    });
    if (noticeID && checkedItems.includes(noticeID)) {
      navigate(`/trash`);
    }
    setCheckedItems([]);
    toast({
      title: "勾選公告已復原",
      // description: "公告已復原",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const toast = useToast();
  return (
    <>
      <div
        className={`rounded-l-none lg:rounded-l-3xl  h-full myanim ${
          showDetailPanel ? "w0" : ""
        } `}
      >
        <div className="App min-w-[360px] w-screen sm:max-w-[360px] p-4 pb-6  h-full flex flex-col">
          <Stack direction="row" h="32px" className="!hidden sm:!flex my-4">
            <Divider
              orientation="vertical"
              className="!border-l-4 !border-[#9D2235] !opacity-100"
            />
            <Text className="text-2xl ms-2">公告</Text>
          </Stack>
          <div className="grid grid-cols-3 items-center">
            <Link to={"/inbox"}>
              <Button
                colorScheme="red"
                variant="ghost"
                size="md"
                className="w-6"
                leftIcon={<BackIcon />}
              ></Button>
            </Link>
            <div className="font-semibold text-center">垃圾桶</div>
          </div>
          <div className="flex justify-between items-end mb-4">
            <Checkbox
              isChecked={allChecked}
              isIndeterminate={isIndeterminate}
              onChange={handleParentChange}
              colorScheme="cyan"
              className="ps-3"
              isDisabled={trashMsgs.length < 1}
            >
              全選
            </Checkbox>
            <div className="flex gap-4">
              <Tooltip label="永久刪除公告" placement="auto-start" bg="red.600">
                <IconButton
                  isRound={true}
                  variant="solid"
                  colorScheme="red"
                  aria-label="Done"
                  fontSize="16px"
                  size="sm"
                  icon={<DeleteIcon />}
                  isDisabled={checkedItems.length < 1}
                  onClick={onWithdrawOpen2}
                />
              </Tooltip>
              <Tooltip label="復原公告" placement="auto-start" bg="blue.600">
                <IconButton
                  isRound={true}
                  variant="solid"
                  colorScheme="red"
                  aria-label="Done"
                  fontSize="16px"
                  size="sm"
                  icon={<RestoreIcon />}
                  isDisabled={checkedItems.length < 1}
                  onClick={() => {
                    handleMultipleTrash();
                  }}
                />
              </Tooltip>
            </div>
          </div>
          <Card className="h-teach-l overflow-auto !rounded-2xl grow">
            <MsgList
              msgArr={trashMsgs}
              handleMsgClick={handleMsgClick}
              inTrash={true}
              isLoading={isLoading}
              stateInfo={stateInfo}
              handleChildChange={handleChildChange}
              checkedItems={checkedItems}
            />
          </Card>
        </div>
      </div>
      <div className="rounded-r-none lg:rounded-r-3xl w-[720px] min-w-[360px] relative h-full flex flex-col pb-6">
        <div className="p-0 sm:pt-16"></div>
        <Card
          id="main"
          className="h-teach-r !rounded-2xl mt-4 mx-4 p-4 sm:p-8 overflow-auto grow logoOnBack"
        >
          <Button
            {...buttonProps}
            colorScheme="red"
            variant="ghost"
            size="md"
            className="!flex sm:!hidden w-fit !ps-1 mb-2 shrink-0"
            onClick={() => navigate(`/trash`)}
            leftIcon={<BackIcon />}
          >
            <span>返回</span>
          </Button>
          <MsgDetail />
        </Card>
      </div>
      {/* 多個刪除視窗 */}
      <Modal
        closeOnOverlayClick={false}
        isOpen={isWithdrawOpen2}
        onClose={onWithdrawClose2}
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
            <div className="mt-4">是否要將已勾選公告永久刪除？</div>
          </ModalBody>

          <ModalFooter className="gap-4">
            <Button
              colorScheme="red"
              variant="outline"
              className="w-full"
              onClick={() => {
                handleMultipleDelete();
              }}
            >
              是
            </Button>
            <Button
              colorScheme="red"
              className="mr-auto w-full"
              onClick={onWithdrawClose2}
            >
              否
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
