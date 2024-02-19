/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { testData } from "..";
const connection = gadget.getContract("cloud.public");

const getDemoHelp = () => {
    connection.send({
    service: "beta.GetNow",
    body: {},
    result: function (response: any, _error: any, _http: any) {
      console.log(response);
    }
  });
}

const fetchPersonalMessage = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 在這裡進行其他可能的異步操作
    return testData;
  } catch (error) {
    console.error("Error fetching personal message:", error);
    // 處理錯誤
    throw error;
  }
}

const noticeConnection = gadget.getContract("1campus.notice.student.v17");

const getMyNotice = async () => {
    const serviceName = "_.GetNotice"
    await noticeConnection.send({
        service: serviceName,
        body: {
            Request: {
                // Search: "第二階段",
                // RecycleState: "Temp_Delete", // "Permanent_Delete"
                // FilterCategory: "行政管理",
                // FilterLimit:4 // {Notice: Array(4), HasMore: 'true'}
                // FilterAfter: 2082504,
                // FilterBefore: 2082504
            }
        },
        result: function (response: any, _error: any, _http: any) {
        console.log(response);
        }
    });
}
export { getDemoHelp, fetchPersonalMessage,getMyNotice };