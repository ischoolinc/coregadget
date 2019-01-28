import {
  Component,
  OnInit,
  Input,
  NgModule,
  ViewChild,
  ElementRef,
  Inject
} from "@angular/core";
import {
  CounselStudentService,
  CounselClass
} from "../../../../counsel-student.service";
import { FormGroup, FormControl, Validators, NgForm } from "@angular/forms";
import { formatPercent } from "@angular/common";
import { DsaService } from "../../../../dsa.service";
import { CounselInterview } from "../../../counsel-vo";
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: "app-add-interview-modal",
  templateUrl: "./add-interview-modal.component.html",
  styleUrls: ["./add-interview-modal.component.css"]
})
export class AddInterviewModalComponent implements OnInit {
  constructor(
    private counselStudentService: CounselStudentService,
    private dsaService: DsaService
  ) {}

  _editMode: string = "add";
  editModeString: string = "新增";
  _studentName: string;
  isReferral: boolean = false;

  // 輔導紀錄
  _CounselInterview: CounselInterview;

  ngOnInit() {
    this._CounselInterview = new CounselInterview();
    this.loadDefaultData();
  }

  // 設定訪談方式
  setCounselType(value: string) {
    this._CounselInterview.CounselType = value;
  }

  // 載入預設資料
  loadDefaultData() {
    this.isReferral = false;
    if (this.counselStudentService.currentStudent) {
      if (this._editMode === "edit" && this._CounselInterview) {
        // 修改
        this.editModeString = "修改";
        if (this._CounselInterview.isReferral === "t") {
          this.isReferral = true;
        }
      } else {
        // 新增
        this._CounselInterview = new CounselInterview();
        this._studentName = this.counselStudentService.currentStudent.StudentName;
        this._CounselInterview.StudentID = this.counselStudentService.currentStudent.StudentID;
        this._CounselInterview.SchoolYear = this.counselStudentService.currentSchoolYear;
        this._CounselInterview.Semester = this.counselStudentService.currentSemester;
        // 帶入日期與輸入者
        let dt = new Date();
        this._CounselInterview.OccurDate = this._CounselInterview.parseDate(dt);
        // 班導師
        if (
          this.counselStudentService.currentStudent.Role.indexOf("班導師") >=
            0 ||
          this.counselStudentService.currentStudent.Role.indexOf("輔導老師") >=
            0
        ) {
          this._CounselInterview.AuthorName = this.counselStudentService.teacherName;
        }
      }
      // console.log(this._CounselInterview);
    }
  }

  // click 取消
  cancel() {}
  // click 儲存
  async save() {
    try {
      if (this.isReferral) this._CounselInterview.isReferral = "t";
      else this._CounselInterview.isReferral = "f";
      this.SetCounselInterview(this._CounselInterview);
      $("#addInterview").modal("hide");
    } catch (error) {
      alert(error);
    }
  }

  // 新增/更新輔導資料，Service 使用UID是否有值判斷新增或更新
  async SetCounselInterview(data: CounselInterview) {
    if (!data.isPrivate) data.isPrivate = "true";
    if (!data.isReferral) data.isReferral = "false";
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
      ContactItem: data.ContactItem
    };
    console.log(req);

    let resp = await this.dsaService.send("SetCounselInterview", {
      Request: req
    });
    // console.log(resp);
  }
}
