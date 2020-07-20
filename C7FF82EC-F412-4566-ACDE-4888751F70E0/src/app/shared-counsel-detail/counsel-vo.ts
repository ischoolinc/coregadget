// 輔導資料
export class CounselInterview {
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
  isReferral: string; //是否轉介
  ReferralDesc: string; //轉介說明
  ReferralReply: string; //輔導室針對轉介之回覆
  ReferralStatus: string; //輔導室回覆轉介接收狀態
  ReferralReplyDate: string; //輔導室回覆轉介之日期
  RefTeacherID: string;
  Content: string; //內容
  ContactItem: string; //聯絡事項
  isReferralValue: boolean = false;
  isSchoolYearHasValue: boolean = false;
  isSemesterHasValue: boolean = false;
  isOccurDateHasValue: boolean = false;
  isCounselTypeHasValue: boolean = false;
  isContactNameHasValue: boolean = false;
  isContactItemHasValue: boolean = false;
  isContentHasValue: boolean = false;
  isCounselTypeOtherDisable: boolean = true;
  selectCounselType: string = "請選擇方式";
  isSaveDisable: boolean = true;
  isEditDisable: boolean = true;
  isDelDisable: boolean = true;
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

    if (this.ContactItem || this.Content) {
      this.isContactItemHasValue = true;
      this.isContentHasValue = true;
    } else {
      this.isContactItemHasValue = false;
      this.isContentHasValue = false;
    }

    if (
      this.isSchoolYearHasValue &&
      this.isSemesterHasValue &&
      this.isOccurDateHasValue &&
      this.isCounselTypeHasValue &&
      this.isContactNameHasValue &&
      (
        this.isContactItemHasValue ||
        this.isContentHasValue
      )
    ) {
      this.isSaveDisable = false;
    } else {
      this.isSaveDisable = true;
    }
  }

  // 設定訪談方式
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

  // 取得是否轉介，如果有轉介回傳狀態
  getIsReferralString() {
    if (this.isReferral === "t") {
      return this.ReferralStatus;
    } else {
      return "";
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
