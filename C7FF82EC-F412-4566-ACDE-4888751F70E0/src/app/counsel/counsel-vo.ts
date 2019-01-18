// 輔導資料
export class CounselInterview {
  constructor() {}
  UID: string;
  StudentName: string; // 姓名
  SchoolYear: number; //學年度
  Semester: number; //學期
  OccurDate: string; //訪談日期
  ContactName: string; //訪談對象姓名
  AuthorName: string; //訪談者姓名
  CounselType: string; //訪談方式
  CounselTypeOther: string; //其他訪談方式
  isPrivate: string; //是否僅有自己(以及輔導老師)能看見
  StudentID: string; //學生系統編號
  isReferral: string; //是否轉介
  ReferralDesc: string; //轉介說明
  ReferralReply: string; //輔導室針對轉介之回覆
  ReferralStatus: string; //輔導室回覆轉介接收狀態
  ReferralReplyDate: string; //輔導室回覆轉介之日期
  Content: string; //內容
  ContactItem: string; //聯絡事項

  // 取得是否轉介文字
  getIsReferralString() {
    if (this.isReferral === "t") {
      return "是";
    } else {
      return "否";
    }
  }
  public parseDate(dt: Date) {
    let y = dt.getFullYear();
    let m = dt.getMonth() + 1;
    let d = dt.getDate();
    let mStr = "" + m;
    let dStr = "" + d;
    if (m < 10) {
      mStr = "0" + m;
    }

    if (d < 10) dStr = "0" + d;

    return `${y}-${mStr}-${dStr}`;
  }
}

export class SemesterInfo {
  SchoolYear: number;
  Semester: number;
}
