export class ReferralStudent {
  UID: string;
  StudentID: string;
  ClassName: string;
  SeatNo: string;
  Name: string;
  Gender: string;
  TeacherName: string;
  OccurDate: string;
  ReferralDesc: string;
  ReferralReply: string;
  ReferralStatus: string;
  ReferralReplyDate: string;
  ReferralReplyDesc: string;
  isDisplay: boolean = false;

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

  // 處理狀態
  GetReferralStatus() {
    if (this.ReferralStatus === "已處理" || this.ReferralStatus === "處理中")
      return this.ReferralStatus;
    else return "未處理";
  }
}
