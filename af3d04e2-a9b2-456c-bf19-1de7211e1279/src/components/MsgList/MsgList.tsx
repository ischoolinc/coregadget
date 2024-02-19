import { Checkbox } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
type Message = {
  ID: string;
  Category: string;
  Title: string;
  PostTime: string;
  Read: string;
  Message: string;
};

type MsgListProps = {
  msgArr: Message[];
  handleMsgClick: (msg: Message) => void;
  inTrash: boolean;
  handleChildChange?: (ID: string, isChecked: boolean) => void;
  checkedItems: string[];
  isLoading: boolean;
  stateInfo: string;
};
const MsgList: React.FC<MsgListProps> = ({
  msgArr,
  handleMsgClick,
  inTrash,
  handleChildChange,
  checkedItems,
  isLoading,
  stateInfo,
}) => {
  if (!isLoading && msgArr && msgArr.length > 0) {
    const { noticeID } = useParams();
    return (
      <div className="grid">
        {msgArr.map((msg) => (
          <div
            className={`flex overflow-hidden border-b border-gray-200 ${
              msg.ID === noticeID && "bg-gray-100"
            }`}
            key={msg.ID}
          >
            {inTrash && handleChildChange && (
              <Checkbox
                colorScheme="cyan"
                className="self-center py-4 ps-4"
                isChecked={checkedItems.includes(msg.ID)}
                onChange={(e) => {
                  handleChildChange(msg.ID, e.target.checked);
                }}
              />
            )}
            <button
              className={`p-4 ${
                !inTrash && msg.Read == "true" && "opacity-70"
              }`}
              onClick={() => {
                handleMsgClick(msg);
              }}
            >
              <div className="flex items-center justify-between">
                <div className="">
                  <p className="text-lg">
                    {dayjs(parseInt(msg.PostTime)).format("YYYY")}
                  </p>
                  <p>{dayjs(parseInt(msg.PostTime)).format("MM/DD")}</p>
                </div>
                <div
                  className={`divider divider-horizontal ${
                    (inTrash || msg.Read == "false") &&
                    "before:bg-[#9D2235] after:bg-[#9D2235]"
                  } `}
                ></div>
                <div className="">
                  <p className="line-clamp-1 text-start text-lg font-bold">
                    {msg.Title}
                  </p>
                  <p className="line-clamp-2">{msg.Message}</p>
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>
    );
  } else {
    return (
      <div className="text-center h-full flex flex-col justify-center items-center gap-4">
        {isLoading && <span className="loading loading-ring loading-lg"></span>}
        <div className="text-xl">{stateInfo}</div>
      </div>
    );
  }
};

export { MsgList };
