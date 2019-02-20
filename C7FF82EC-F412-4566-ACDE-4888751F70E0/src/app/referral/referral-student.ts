export class ReferralStudent {
  constructor() {}
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

  isReferralReplyHasValue: boolean = false;
  isReferralReplyDateHasValue: boolean = false;
  isReferralReplyDescHasValue: boolean = false;
  isUnPrecessed: boolean = false;
  isProcessing: boolean = false;
  isProcessed: boolean = false;
  isSaveButtonDisable: boolean = true;
  isReferralStatusHasValue: boolean = false;
  isAddCaseButtonDisable: boolean = true;
  // 入學照片
  PhotoUrl: string;
  RefCaseID: string;
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

  // 檢查是否有值
  checkValue() {
    if (this.ReferralReply) {
      this.isReferralReplyHasValue = true;
    } else {
      this.isReferralReplyHasValue = false;
    }
    if (this.ReferralReplyDate) {
      this.isReferralReplyDateHasValue = true;
    } else {
      this.isReferralReplyDateHasValue = false;
    }
    if (this.ReferralReplyDesc) {
      this.isReferralReplyDescHasValue = true;
    } else {
      this.isReferralReplyDescHasValue = false;
    }

    this.isReferralStatusHasValue = false;

    if (this.isUnPrecessed) {
      this.ReferralStatus = "未處理";
      this.isReferralStatusHasValue = true;
    }
    if (this.isProcessing) {
      this.ReferralStatus = "處理中";
      this.isReferralStatusHasValue = true;
    }
    if (this.isProcessed) {
      this.ReferralStatus = "已處理";
      this.isReferralStatusHasValue = true;
    }

    if (this.RefCaseID) {
      this.isAddCaseButtonDisable = true;
    } else {
      this.isAddCaseButtonDisable = false;
    }

    if (
      this.isReferralReplyHasValue &&
      this.isReferralReplyDateHasValue &&
      this.isReferralReplyDescHasValue &&
      this.isReferralStatusHasValue
    ) {
      this.isSaveButtonDisable = false;
    } else {
      this.isSaveButtonDisable = true;
    }
  }

  setProcessSatus(value: string) {
    this.ReferralStatus = value;
    this.loadProcessStatus();
    this.checkValue();
  }

  loadProcessStatus() {
    // 處理授理狀況
    this.isUnPrecessed = false;
    this.isProcessing = false;
    this.isProcessed = false;
    this.isReferralStatusHasValue = false;
    if (this.ReferralStatus === "未處理") {
      this.isUnPrecessed = true;
      this.isReferralStatusHasValue = true;
    }
    if (this.ReferralStatus === "處理中") {
      this.isProcessing = true;
      this.isReferralStatusHasValue = true;
    }

    if (this.ReferralStatus === "已處理") {
      this.isProcessed = true;
      this.isReferralStatusHasValue = true;
    }
  }

  loadDefault() {
    this.loadProcessStatus();

    // 處理預設值
    if (!this.ReferralReplyDate) {
      let dt = new Date();
      this.ReferralReplyDate = this.parseDate(dt);
    }
  }
}
