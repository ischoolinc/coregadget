/**
 * @description Fetches the personal notice summary
 * @returns {Promise<void>}
 */

const noticeConnection = gadget.getContract("1campus.notice.student.v17");

// 取得垃圾桶公告
const getMyTrashNotice = () => {
  return new Promise<{ Notice: any[] }>((resolve, reject) => {
    try {
      const serviceName = "_.GetNotice";
      noticeConnection.send({
        service: serviceName,
        body: {
          Request: {
            // Search: "第二階段",
            RecycleState: "Temp_Delete",
            // "Permanent_Delete"
            // FilterCategory: "行政管理",
            // FilterLimit:4 // {Notice: Array(4), HasMore: 'true'}
            // FilterAfter: 2082504,
            // FilterBefore: 2082504
          },
        },
        result: function (response: any, _error: any, _http: any) {
          // console.log(response);
          // 處理回傳空物件或非陣列情形
          if (!response || !response.Notice) {
            response = { Notice: [] };
          } else if (!Array.isArray(response.Notice)) {
            response.Notice = [response.Notice];
          }
          resolve(response); // 將 response 回傳到 Promise
        },
      });
    } catch (error) {
      console.log(error);
      reject(error); // 如果有錯誤，將錯誤回傳到 Promise
    }
  });
};

// 復原一則已刪除公告
const pushNoticeRestore = async (NoticeID: string) => {
  const serviceName = "_.PushNoticeRecycle";
  await noticeConnection.send({
    service: serviceName,
    body: {
      Request: {
        NoticeID: [NoticeID],
        RecycleState: "",
      },
    },
    result: function (response: any, _error: any, _http: any) {},
  });
};

// 永久刪除一則公告
const deleteNotice = async (NoticeID: string) => {
  const serviceName = "_.PushNoticeRecycle";
  await noticeConnection.send({
    service: serviceName,
    body: {
      Request: {
        NoticeID: [NoticeID],
        RecycleState: "Permanent_Delete",
      },
    },
    result: function (response: any, _error: any, _http: any) {},
  });
};

// 復原多則已刪除公告
const pushMultipleNoticeRestore = async (noticeIDs: string[]) => {
  const serviceName = "_.PushNoticeRecycle";
  await noticeConnection.send({
    service: serviceName,
    body: {
      Request: {
        NoticeID: noticeIDs,
        RecycleState: "",
      },
    },
    result: function (response: any, _error: any, _http: any) {},
  });
};

// 永久刪除多則公告
const deleteMultipleNotices = async (noticeIDs: string[]) => {
  const serviceName = "_.PushNoticeRecycle";
  await noticeConnection.send({
    service: serviceName,
    body: {
      Request: {
        NoticeID: noticeIDs,
        RecycleState: "Permanent_Delete",
      },
    },
    result: function (response: any, _error: any, _http: any) {},
  });
};
export {
  getMyTrashNotice,
  pushNoticeRestore,
  deleteNotice,
  pushMultipleNoticeRestore,
  deleteMultipleNotices,
};
