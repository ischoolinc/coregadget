export class CaseStudent {
  constructor() {
    this.CaseSource = '';
    this.setOccurDateNow();
  }
  UID: string;
  ClassName: string; // 班級
  SeatNo: string; // 座號
  Name: string; // 姓名
  Gender: string; // 性別
  TeacherName: string; // 班導師
  SchoolYear: number; // 學年度
  Semester: number; // 學期
  OccurDate: string; // 建立個案日期
  CaseNo: string; // 個案編號
  StudentIdentity: string; // 學生身份
  PossibleSpecialCategory: string; // 疑似特殊生類別
  SpecialLevel: string; // 特殊生等級
  SpecialCategory: string; // 特殊生類別
  HasDisabledBook: string; // 是否領有身心障礙手冊
  DeviantBehavior: string; // 偏差行為
  ProblemCategory: string; // 問題類別
  ProbleDescription: string; // 問題描述
  SpecialSituation: string; // 特殊狀況
  EvaluationResult: string; // 評估結果
  IsClosed: string; // 是否結案
  CloseDate: string; // 結案日期
  ClosedByTeacherID: string; // 結案人員教師編號
  CloseDescription: string; // 結案說明
  StudentID: string; // 學生系統編號
  CaseSource: string; // 個案來源
  CaseCount: string; // 個案輔導次數

  // 設定個案日期為現在
  public setOccurDateNow() {
    let dt = new Date();
    this.OccurDate = this.parseDate(dt);
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

// 認輔老師
export class VoluntaryGuidanceTeacher {
  constructor() {}
  UID: string;
  TeacherID: string;
  Name: string;
  NickName: string;
  StLoginName: string;
}

