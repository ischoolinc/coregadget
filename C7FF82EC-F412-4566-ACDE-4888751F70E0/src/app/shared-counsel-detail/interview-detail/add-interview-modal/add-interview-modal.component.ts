import { Component, OnInit, Optional } from "@angular/core";
import { CounselStudentService } from '../../../counsel-student.service';
import { DsaService } from '../../../dsa.service';
import { CounselInterview, QOption } from '../../counsel-vo';
import { CounselDetailComponent } from "../../counsel-detail.component";
import { SentenceService } from '../../../render/dissector.service';

@Component({
  selector: "app-add-interview-modal",
  templateUrl: "./add-interview-modal.component.html",
  styleUrls: ["./add-interview-modal.component.css"]
})
export class AddInterviewModalComponent implements OnInit {
  constructor(
    private counselStudentService: CounselStudentService,
    private dsaService: DsaService,
    private dissector: SentenceService,
    @Optional()
    private counselDetailComponent: CounselDetailComponent
  ) { }

  isCancel: boolean = false;
  _editMode: string = "add";
  editModeString: string = "新增";
  _studentName: string;
  public referralVisible: boolean = false;
  // 輔導紀錄
  _CounselInterview: CounselInterview;

  ngOnInit() {
    this.referralVisible = false;
    if (gadget.params.system_counsel_position === 'referral') {
      this.referralVisible = true;
    }
    this._CounselInterview = new CounselInterview();
    this.loadDefaultData();
  }

  // 載入預設資料
  loadDefaultData() {
    if (this.counselDetailComponent.currentStudent) {
      if (this._editMode === "edit" && this._CounselInterview) {
        // 修改
        this.editModeString = "修改";
        if (this._CounselInterview.isReferral === "t") {
          this._CounselInterview.isReferralValue = true;
        }
      } else {
        // 新增
        this._CounselInterview = new CounselInterview();
        this._studentName = this.counselDetailComponent.currentStudent.StudentName;
        this._CounselInterview.StudentID = this.counselDetailComponent.currentStudent.StudentID;
        this._CounselInterview.SchoolYear = this.counselStudentService.currentSchoolYear;
        this._CounselInterview.Semester = this.counselStudentService.currentSemester;
        // 帶入日期與輸入者
        let dt = new Date();
        this._CounselInterview.OccurDate = this._CounselInterview.parseDate(dt);
        // // 班導師
        // if (
        //   this.counselDetailComponent.currentStudent.Role.indexOf("班導師") >=
        //   0 ||
        //   this.counselDetailComponent.currentStudent.Role.indexOf("輔導老師") >=
        //   0
        // ) {
        //   this._CounselInterview.AuthorName = this.counselStudentService.teacherInfo.Name;
        // }

        this._CounselInterview.AuthorName = this.counselStudentService.teacherInfo.Name;
        this._CounselInterview.useQuestionOptionTemplate();
      }
      // console.log(this._CounselInterview);
      // 檢查是否有值
      this._CounselInterview.checkValue();
    }
  }

  // click 取消
  cancel() {
    this.isCancel = true;
    $("#addInterview").modal("hide");
  }
  // click 儲存
  async save() {
    try {
      this.isCancel = false;
      this._CounselInterview.isSaveDisable = true;
      if (this._CounselInterview.isReferralValue)
        this._CounselInterview.isReferral = "t";
      else this._CounselInterview.isReferral = "f";
      this._CounselInterview.Category = JSON.stringify(this._CounselInterview._category);

      await this.SetCounselInterview(this._CounselInterview);
      $("#addInterview").modal("hide");
      this._CounselInterview.isSaveDisable = false;
    } catch (error) {
      alert(error);
      this._CounselInterview.isSaveDisable = false;
    }

  }

  // 新增/更新輔導資料，Service 使用UID是否有值判斷新增或更新
  async SetCounselInterview(data: CounselInterview) {
    if (data.isPublic) {
      data.isPrivate = "false";
    } else {
      data.isPrivate = "true";
    }

    if (!data.isReferral) data.isReferral = "false";
    if (data.isReferral == "t") {
      data.ReferralStatus = "未處理";
    }
    let req = {
      UID: data.UID,
      SchoolYear: data.SchoolYear,
      Semester: data.Semester,
      OccurDate: data.OccurDate,
      ContactName: data.ContactName,
      AuthorName: data.AuthorName,
      CounselType: data.CounselType,
      CounselTypeOther: data.CounselTypeOther,
      isPrivate: data.isPrivate,
      StudentID: data.StudentID,
      isReferral: data.isReferral,
      ReferralDesc: data.ReferralDesc,
      ReferralReply: data.ReferralReply,
      ReferralStatus: data.ReferralStatus,
      ReferralReplyDate: data.ReferralReplyDate,
      Content: data.Content,
      ContactItem: data.ContactItem,
      ContactNameOther: data.ContactNameOther,
      Category: data.Category
    };
    // console.log(req);

    try {
      let resp = await this.dsaService.send("SetCounselInterview", {
        Request: req
      });
    } catch (err) {
      alert('無法新增：' + err.dsaError.message);
    }
    // console.log(resp);
  }

  checkChange(qq, item: CounselInterview) {
    // console.log(qq);

    if (qq.value == "") {
      item.isCategoryHasValue = false;
    } else {
      item.isCategoryHasValue = true;
    }
    item.checkValue();
  }
}
