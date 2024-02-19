import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { IconButton, useDisclosure, Tooltip, useToast } from "@chakra-ui/react";
import { RecycleIcon, DeleteIcon, RestoreIcon } from "../Icons";
import { useNoticeStore } from "../../context/inbox.model";
import { useCheckedItemStore } from "../../context/checkedItems.model";
import { useTrashNoticeStore } from "../../context/trash.model";
import { pushNoticeRecycle } from "../../utilities/Api/InboxHelp";
import { pushNoticeRestore, deleteNotice } from "../../utilities/Api/TrashHelp";
import RecycleModal from "./RecycleModal";
import DeleteModal from "./DeleteModal";
import { useSearchNoticeStore } from "../../context/search.model";
type Notice = {
  ID: string;
  Category: string;
  Title: string;
  PostTime: string;
  Read: string;
  Message: string;
};

const MsgDetail = () => {
  const { noticeID } = useParams();

  // 控制刪除視窗開啟
  const {
    isOpen: isWithdrawOpen,
    onOpen: onWithdrawOpen,
    onClose: onWithdrawClose,
  } = useDisclosure();

  const location = useLocation();
  const navigate = useNavigate();
  const [msg, setMsg] = useState<Notice>({} as Notice);
  const [inTrash, setInTrash] = useState<boolean>(
    location.pathname.includes("/trash")
  );

  // 收件匣context
  const { notices, moveTrash } = useNoticeStore();

  // 垃圾桶context
  const { notices: trashNotices, removeTrash } = useTrashNoticeStore();

  // 多選context
  const { removeCheckedItem } = useCheckedItemStore();

  // 搜尋context
  const { searchNotices, moveSearchTrash } = useSearchNoticeStore();
  const toast = useToast();

  // 監聽路由變動，更改顯示訊息
  useEffect(() => {
    if (noticeID) {
      if (!inTrash) {
        const msg = notices.find((msg) => msg.ID == noticeID);
        if (msg) {
          setMsg(msg);
        } else {
          const msg = searchNotices.find((msg) => msg.ID == noticeID);
          if (msg) {
            setMsg(msg);
          }
        }
      } else {
        const msg = trashNotices.find((msg) => msg.ID == noticeID);
        if (msg) {
          setMsg(msg);
        }
      }
    } else {
      setMsg({} as Notice);
    }
  }, [noticeID]);

  /** 點擊刪除/復原按鈕 */
  const handleTrashClick = () => {
    if (!inTrash) {
      pushNoticeRecycle(msg.ID);
      moveTrash(msg.ID);
      moveSearchTrash(msg.ID);
      navigate(`/inbox`);
    } else {
      pushNoticeRestore(msg.ID);
      removeTrash(msg.ID);
      toast({
        title: "公告已復原",
        // description: "公告已復原",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      removeCheckedItem(msg.ID);
      navigate(`/trash`);
    }
  };

  /**確認刪除 */
  const handleDeleteClick = () => {
    onWithdrawClose();
    deleteNotice(msg.ID);
    removeTrash(msg.ID);
    removeCheckedItem(msg.ID);
    navigate(`/trash`);
  };

  if (msg.ID) {
    return (
      <>
        <div className="text-left h-full bg-white">
          <div className="flex gap-8 justify-between">
            <div className="text-xl font-semibold text-justify">
              {msg.Title}
            </div>
            {inTrash ? (
              <>
                <div className="flex gap-4 right-4 top-4 sm:right-0 sm:top-0 !absolute sm:!relative">
                  <Tooltip
                    label="永久刪除公告"
                    placement="auto-start"
                    bg="red.600"
                  >
                    <IconButton
                      isRound={true}
                      variant="solid"
                      colorScheme="red"
                      aria-label="Done"
                      fontSize="16px"
                      size="sm"
                      icon={<DeleteIcon />}
                      className=""
                      onClick={onWithdrawOpen}
                    />
                  </Tooltip>
                  <Tooltip
                    label="復原公告"
                    placement="auto-start"
                    bg="blue.600"
                  >
                    <IconButton
                      isRound={true}
                      variant="solid"
                      colorScheme="red"
                      aria-label="Done"
                      fontSize="16px"
                      size="sm"
                      icon={<RestoreIcon />}
                      className=""
                      onClick={() => {
                        handleTrashClick();
                      }}
                    />
                  </Tooltip>
                </div>
              </>
            ) : (
              <IconButton
                isRound={true}
                variant="solid"
                colorScheme="red"
                aria-label="Done"
                fontSize="16px"
                size="sm"
                icon={<RecycleIcon />}
                className="ms-auto me-3  top-4 right-0 sm:top-0 !absolute sm:!relative"
                onClick={onWithdrawOpen}
              >
                回收
              </IconButton>
            )}
          </div>
          <div className="flex justify-between mt-4">
            <div className="text-rose-800 font-bold">{msg.Category}</div>
            <div className="text-rose-800 font-bold">
              {dayjs(parseInt(msg.PostTime)).format("YYYY/MM/DD")}
            </div>
          </div>
          <div className="divider !my-1"></div>
          <div className="leading-loose whitespace-pre-line pb-4">
            {msg.Message}
          </div>
        </div>
        {inTrash ? (
          <DeleteModal
            isWithdrawOpen={isWithdrawOpen}
            onWithdrawClose={onWithdrawClose}
            handleDeleteClick={handleDeleteClick}
          />
        ) : (
          <RecycleModal
            isWithdrawOpen={isWithdrawOpen}
            onWithdrawClose={onWithdrawClose}
            handleTrashClick={handleTrashClick}
          />
        )}
      </>
    );
  } else {
    return <div className="bg-white opacity-50 h-full"></div>;
  }
};

export { MsgDetail };
