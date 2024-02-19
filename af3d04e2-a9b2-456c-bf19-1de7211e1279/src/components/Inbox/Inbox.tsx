import { useParams } from "react-router-dom";
import { MsgList } from "../MsgList";
import { MsgDetail } from "../MsgDetail";
import { useNoticeStore } from "../../context/inbox.model";
import { useSearchNoticeStore } from "../../context/search.model";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Text,
  Button,
  Card,
  Collapse,
  Divider,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  useDisclosure,
  useColorMode,
} from "@chakra-ui/react";
import {
  CheckCircleIcon,
  DeleteIcon,
  Search2Icon,
  SmallCloseIcon,
} from "@chakra-ui/icons";
import { BackIcon } from "../Icons";
import {
  getMyNotice,
  // rollbackAllRead,
  pushNoticeLog,
  pushAllLog,
  // rollbackAllDel,
  searchMyNotice,
} from "../../utilities/Api/InboxHelp";
type Notice = {
  ID: string;
  Category: string;
  Title: string;
  PostTime: string;
  Read: string;
  Message: string;
};
export function Inbox() {
  // 動態路由:公告ID
  const { noticeID } = useParams();
  const navigate = useNavigate();

  // 載入數據中
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 訊息列表狀態敘述
  const [stateInfo, setStateInfo] = useState<string>("載入中…");

  // 收件匣context
  const { notices, setNotices, markAsRead, markAllAsRead } = useNoticeStore();

  // 搜尋context
  const {
    searchNotices,
    setSearchNotices,
    markSearchAsRead,
    markSearchAllAsRead,
  } = useSearchNoticeStore();

  // 初次載入fetch收件匣公告
  useEffect(() => {
    console.log("fetchingInbox");
    getMyNotice().then((res) => {
      console.log(res);
      setNotices(res.Notice);
      setIsLoading(false);
    });
    setSearchNotices([]);
  }, []);

  /** 搜尋狀態 */
  const { isOpen, onToggle } = useDisclosure();

  /**側邊欄開啟狀態 */
  const { getButtonProps } = useDisclosure({
    defaultIsOpen: true,
  });


  const buttonProps = getButtonProps();

  /**顯示側邊欄 */
  const [showDetailPanel, setShowDetailPanel] = useState<boolean>(false);

  const { setColorMode } = useColorMode();

  useEffect(() => {
    setColorMode("light");
  }, [setColorMode]);

  // 顯示公告
  const [inboxMsgs, setInboxMsgs] = useState<Notice[]>([]);
  // 顯示分類
  const [group, setGroup] = useState("行政管理");
  // 搜尋關鍵字
  const [keyWord, setKeyWord] = useState<string>("");
  const [tempKeyWord, setTempKeyWord] = useState<string>("");

  // 依據分類、搜索狀態顯示不同公告
  useEffect(() => {
    if (!isOpen) {
      const filteredAnnouncements = notices.filter(
        (notice) => notice.Category === group
      );
      setInboxMsgs(filteredAnnouncements);
      if (!isLoading) {
        setStateInfo("該分類無公告");
      }
    } else {
      setInboxMsgs(searchNotices);
      if (!keyWord) {
        setStateInfo("輸入關鍵字搜索");
      } else {
        if (isLoading) {
          setStateInfo("載入中…");
        } else {
          setStateInfo("查無公告");
        }
      }
    }
  }, [notices, group, keyWord, isOpen, isLoading]);

  // 動態路由找到相符noticeID則打開側邊欄
  useEffect(() => {
    if (!isLoading) {
      if (noticeID) {
        const msg = notices.find((msg) => msg.ID == noticeID);
        if (msg) {
          setShowDetailPanel(true);
        } else {
          const msg = searchNotices.find((msg) => msg.ID == noticeID);
          if (msg) {
            setShowDetailPanel(true);
          }
        }
      } else {
        setShowDetailPanel(false);
      }
    }
  }, [isLoading, noticeID]);

  /**點擊清單上訊息 */
  const handleMsgClick = (msg: Notice) => {
    navigate(`/inbox/${msg.ID}`);
    if (msg.Read == "false") {
      markAsRead(msg.ID);
      markSearchAsRead(msg.ID);
      pushNoticeLog(msg.ID);
    }
  };

  /** 全部已讀 */
  const handleReadAll = () => {
    pushAllLog();
    markAllAsRead();
    markSearchAllAsRead();
  };

  /** 輸入框變更*/
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTempKeyWord(event.target.value);
  };

  /** 送出搜尋 */
  const handleSearch = () => {
    if (tempKeyWord) {
      setIsLoading(true);
      setKeyWord(tempKeyWord);
      searchMyNotice(tempKeyWord).then((res) => {
        console.log("fetchingSearch" + "keyword:" + tempKeyWord);
        console.log(res);
        setSearchNotices(res.Notice);
        setIsLoading(false);
      });
    }
  };

  return (
    <>
      <div
        className={`rounded-l-none lg:rounded-l-3xl  h-full myanim ${
          showDetailPanel ? "w0" : ""
        } `}
      >
        <div className="App min-w-[360px] w-screen sm:max-w-[360px] pt-4  h-full flex flex-col ">
          <Stack
            direction="row"
            h="32px"
            className="!hidden sm:!flex my-4 px-4"
          >
            <Divider
              orientation="vertical"
              className="!border-l-4 !border-[#9D2235] !opacity-100"
            />
            <Text className="text-2xl ms-2">公告</Text>
            {/* <div className=" opacity-0 hover:opacity-100">
              開發用：
              <div className="btn btn-xs" onClick={() => rollbackAllRead()}>
                全部未讀
              </div>
              <div className="btn btn-xs" onClick={() => rollbackAllDel()}>
                全回收件匣
              </div>
            </div> */}
          </Stack>
          <div className="">
            <Collapse in={!isOpen}>
              <Stack
                direction="row"
                align="center"
                className="justify-between px-4 py-2"
              >
                {["行政管理", "教務", "活動"].map((category, index) => {
                  const unreadCount = notices.filter(
                    (n) => n.Category === category && n.Read === "false"
                  ).length;

                  return (
                    <Button
                      key={category}
                      className={`sel-btn icon${String.fromCharCode(
                        97 + index
                      )} ${group === category && "active"}`}
                      onClick={() => setGroup(category)}
                    >
                      <div className="absolute mb-3 bottom-0 font-medium">
                        {category}
                      </div>
                      <span
                        className={`absolute badgeC rounded-full ${
                          unreadCount < 1 && "hidden"
                        }`}
                      >
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    </Button>
                  );
                })}
              </Stack>
            </Collapse>
          </div>
          <div
            id="teach-tabs"
            className="grow flex overflow-y-auto pb-6 flex-col px-4"
          >
            <div className="flex justify-between items-center my-4">
              {isOpen ? (
                <div className="text-center w-full font-semibold ">
                  搜尋公告
                </div>
              ) : (
                <div className="flex gap-4">
                  <Button
                    leftIcon={<DeleteIcon />}
                    variant="outline"
                    size="xs"
                    colorScheme="red"
                    onClick={() => navigate("/trash")}
                  >
                    垃圾桶
                  </Button>
                  <Button
                    leftIcon={<CheckCircleIcon />}
                    variant="outline"
                    size="xs"
                    colorScheme="red"
                    onClick={() => {
                      handleReadAll();
                    }}
                  >
                    全部已讀
                  </Button>
                </div>
              )}

              <div>
                {isOpen ? (
                  <SmallCloseIcon
                    w={6}
                    h={6}
                    className="cursor-pointer"
                    color="cyan.500"
                    onClick={onToggle}
                  />
                ) : (
                  <Search2Icon
                    w={6}
                    h={6}
                    className="cursor-pointer"
                    color="cyan.500"
                    onClick={onToggle}
                  />
                )}
              </div>
            </div>
            <div className="">
              <Collapse in={isOpen}>
                <InputGroup className="pb-4">
                  <InputRightElement
                    className="cursor-pointer"
                    onClick={() => {
                      handleSearch();
                    }}
                  >
                    <Search2Icon color="red.800" className="cursor-pointe" />
                  </InputRightElement>
                  <Input
                    type="text"
                    placeholder=""
                    borderColor="gray.400"
                    focusBorderColor="red.800"
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                  />
                </InputGroup>
              </Collapse>
            </div>
            <Card className="h-teach-l overflow-auto !rounded-2xl grow">
              <MsgList
                msgArr={inboxMsgs}
                handleMsgClick={handleMsgClick}
                inTrash={false}
                isLoading={isLoading}
                stateInfo={stateInfo}
                checkedItems={[]}
              />
            </Card>
          </div>
        </div>
      </div>
      <div className="rounded-r-none lg:rounded-r-3xl w-[720px] min-w-[360px] relative h-full flex flex-col pb-6">
        <div className="p-0 sm:pt-16"></div>
        <Card
          id="main"
          className=" !rounded-2xl mt-4 mx-4 p-4 sm:p-8 overflow-auto grow logoOnBack"
        >
          <Button
            {...buttonProps}
            colorScheme="red"
            variant="ghost"
            size="md"
            className="!flex sm:!hidden w-fit !ps-1 mb-2 shrink-0"
            onClick={() => navigate(`/inbox`)}
            leftIcon={<BackIcon />}
          >
            <span>返回</span>
          </Button>
          <MsgDetail />
        </Card>
      </div>
    </>
  );
}
