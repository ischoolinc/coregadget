export class CaseStudent {
  constructor() {
    this.CaseSource = "";
    this.setOccurDateNow();
    this.GuidanceTeacher = new VoluntaryGuidanceTeacher();
    this.isGuidanceTeacherHasValue = false;
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
  PhotoUrl: string;
  GuidanceTeacher: VoluntaryGuidanceTeacher;

  isOccurDateHasValue: boolean = false;
  isCaseNoHasValue: boolean = false;
  isGuidanceTeacherHasValue: boolean = false;
  isCaseSourceHasValue: boolean = false;
  isSaveButtonDisable: boolean = true;
  isAddButtonDisable: boolean = true;

  isCloseYes: boolean = false;
  isCloseNo: boolean = false;
  isCloseDateHasValue = false;

  // 當透過轉介建立才會在值，儲存輔導紀錄 uid
  RefCounselInterviewID: string = "";

  // 設定個案日期為現在
  public setOccurDateNow() {
    let dt = new Date();
    this.OccurDate = this.parseDate(dt, "-");
    this.isOccurDateHasValue = true;
  }

  public setCloseDateNow() {
    let dt = new Date();
    this.CloseDate = this.parseDate(dt, "/");
  }

  public setIsCloseNo() {
    this.IsClosed = "f";
    this.isCloseYes = false;
    this.isCloseNo = true;
  }

  // 取得是否結案文字
  public GetClosedString() {
    if (this.IsClosed && this.IsClosed === "t") {
      return "是";
    } else {
      return "否";
    }
  }

  checkValue() {
    if (this.OccurDate) {
      this.isOccurDateHasValue = true;
    } else {
      this.isOccurDateHasValue = false;
    }

    if (this.CaseNo) {
      this.isCaseNoHasValue = true;
    } else {
      this.isCaseNoHasValue = false;
    }

    if (this.CaseSource) {
      this.isCaseSourceHasValue = true;
    } else {
      this.isCaseSourceHasValue = false;
    }

    if (this.GuidanceTeacher && this.GuidanceTeacher.TeacherID) {
      this.isGuidanceTeacherHasValue = true;
    } else {
      this.isGuidanceTeacherHasValue = false;
    }

    if (this.IsClosed && this.IsClosed === "t") {
      this.isCloseYes = true;
      this.isCloseNo = false;
    } else {
      this.isCloseYes = false;
      this.isCloseNo = true;
    }

    if (
      this.isOccurDateHasValue &&
      this.isCaseNoHasValue &&
      this.isGuidanceTeacherHasValue &&
      this.isCaseSourceHasValue &&
      this.StudentID
    ) {
      this.isSaveButtonDisable = false;
    } else {
      this.isSaveButtonDisable = true;
    }

    if (this.RefCounselInterviewID) {
      this.isAddButtonDisable = true;
    } else {
      this.isAddButtonDisable = false;
    }
  }

  public parseDate(dt: Date, str: string) {
    let y = dt.getFullYear();
    let m = dt.getMonth() + 1;
    let d = dt.getDate();
    let mStr = "" + m;
    let dStr = "" + d;
    if (m < 10) {
      mStr = "0" + m;
    }

    if (d < 10) dStr = "0" + d;

    return `${y}${str}${mStr}${str}${dStr}`;
  }
}

// 認輔老師
export class VoluntaryGuidanceTeacher {
  constructor() {}
  CaseID: string;
  UID: string;
  TeacherID: string;
  Name: string;
  NickName: string;
  StLoginName: string;
  GetTeacherName(): string {
    let name = "";

    if (this.Name) name = this.Name;

    if (this.NickName && this.NickName != "") {
      name = `${this.Name}(${this.NickName})`;
    }
    return name;
  }
}
