/**
 * @description Fetches the personal notice summary
 * @returns {Promise<void>}
 */

const noticeConnection = gadget.getContract("1campus.notice.student.v17");

/** 取得收件匣公告 */
const getMyNotice = () => {
  return new Promise<{ Notice: any[] }>((resolve, reject) => {
    try {
      const serviceName = "_.GetNotice";
      noticeConnection.send({
        service: serviceName,
        body: {
          Request: {
            // Search: "第二階段",
            // RecycleState: "Temp_Delete", // "Permanent_Delete"
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
/** 搜尋收件匣公告 */
const searchMyNotice = (keyWord: string) => {
  return new Promise<{ Notice: any[] }>((resolve, reject) => {
    try {
      const serviceName = "_.GetNotice";
      noticeConnection.send({
        service: serviceName,
        body: {
          Request: {
            Search: keyWord,
            // RecycleState: "Temp_Delete", // "Permanent_Delete"
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



/** 已讀一則公告 */
const pushNoticeLog = async (NoticeID: string) => {
  const serviceName = "_.PushLog";
  await noticeConnection.send({
    service: serviceName,
    body: {
      Request: {
        NoticeID: NoticeID,
      },
    },
    result: function (response: any, _error: any, _http: any) {
      if (response) {
        console.log("訊息已讀");
      }
    },
  });
};

/** 回收一則 */
const pushNoticeRecycle = async (NoticeID: string) => {
  const serviceName = "_.PushNoticeRecycle";
  await noticeConnection.send({
    service: serviceName,
    body: {
      Request: {
        NoticeID: [NoticeID],
        RecycleState: "Temp_Delete", //Permanent_Delete
      },
    },
    result: function (response: any, _error: any, _http: any) {
      if (response) {
        console.log("訊息已回收");
      }
    },
  });
};

/**全部已讀*/
const pushAllLog = async () => {
  const serviceName = "_.PushAllLog";
  await noticeConnection.send({
    service: serviceName,
    body: {},
    result: function (_response: any, _error: any, _http: any) {},
  });
};

/** 全部未讀(開發用) */
const rollbackAllRead = async () => {
  const serviceName = "_.RollbackAllRead";
  await noticeConnection.send({
    service: serviceName,
    body: {},
    result: function (response: any, _error: any, _http: any) {
      console.log(response);
    },
  });
};

/** 全部恢復刪除(開發用)*/
const rollbackAllDel = async () => {
  const serviceName = "_.RollbackAllDel";
  await noticeConnection.send({
    service: serviceName,
    body: {},
    result: function (response: any, _error: any, _http: any) {
      console.log(response);
    },
  });
};

export {
  getMyNotice,
  searchMyNotice,
  rollbackAllRead,
  rollbackAllDel,
  pushNoticeLog,
  pushNoticeRecycle,
  pushAllLog,
};
