// 認輔資料
export class CaselInterview {
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
  Attachment: string; // 附加檔案
  Content: string; // 內容
  CaseID: string; // 個案uid
  CaseNo: string; //個案編號

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
