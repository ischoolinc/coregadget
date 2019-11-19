// 認輔資料
export class CaseInterview {
  constructor() { }
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
  ClassID: string; // 班級 ID
  AuthorRole: string; // 個案老師角色
  isSchoolYearHasValue: boolean = false;
  isSemesterHasValue: boolean = false;
  isOccurDateHasValue: boolean = false;
  isCounselTypeHasValue: boolean = false;
  isContactNameHasValue: boolean = false;
  isContentHasValue: boolean = false;
  isCounselTypeOtherDisable: boolean = true;
  selectCounselType: string = "請選擇方式";
  isSaveDisable: boolean = true;
  isEditDisable: boolean = true;
  CaseIsClosed: string = '';
  // 檢查是否有值
  checkValue() {
    if (this.SchoolYear) {
      this.isSchoolYearHasValue = true;
    } else {
      this.isSchoolYearHasValue = false;
    }

    if (this.Semester) {
      this.isSemesterHasValue = true;
    } else {
      this.isSemesterHasValue = false;
    }

    if (this.OccurDate) {
      this.isOccurDateHasValue = true;
    } else {
      this.isOccurDateHasValue = false;
    }

    if (this.CounselType) {
      this.isCounselTypeHasValue = true;
    } else {
      this.isCounselTypeHasValue = false;
    }

    if (this.ContactName) {
      this.isContactNameHasValue = true;
    } else {
      this.isContactNameHasValue = false;
    }

    if (this.Content) {
      this.isContentHasValue = true;
    } else {
      this.isContentHasValue = false;
    }

    if (
      this.isSchoolYearHasValue &&
      this.isSemesterHasValue &&
      this.isOccurDateHasValue &&
      this.isCounselTypeHasValue &&
      this.isContactNameHasValue &&
      this.isContentHasValue
    ) {
      this.isSaveDisable = false;
    } else {
      this.isSaveDisable = true;
    }
  }

  // 設定方式
  setCounselType(value: string) {
    this.CounselType = value;
    this.selectCounselType = value;
    if (value === "其他") {
      this.isCounselTypeOtherDisable = false;
    } else {
      this.isCounselTypeOtherDisable = true;
      this.CounselTypeOther = '';
    }
    if (this.CounselType) {
      this.isCounselTypeHasValue = true;
    } else {
      this.isCounselTypeHasValue = false;
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

    return `${y}/${mStr}/${dStr}`;
  }
}

export class SemesterInfo {
  SchoolYear: number;
  Semester: number;
  CaseID: string;
}
