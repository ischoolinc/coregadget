import {
  Component,
  OnInit,
  Input,
  NgModule,
  ViewChild,
  ElementRef,
  Inject,
  Optional
} from "@angular/core";
import {
  CounselStudentService,
  CounselClass
} from "../../../../counsel-student.service";
import { FormGroup, FormControl, Validators, NgForm } from "@angular/forms";
import { formatPercent } from "@angular/common";
import { DsaService } from "../../../../dsa.service";
import { CaseInterview } from "../case-interview-vo";

// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CounselDetailComponent } from "../../counsel-detail.component";
import { CaseStudent } from "src/app/case/case-student";
import { DataRowOutlet } from "@angular/cdk/table";

@Component({
  selector: "app-add-case-interview-modal",
  templateUrl: "./add-case-interview-modal.component.html",
  styleUrls: ["./add-case-interview-modal.component.css"]
})
export class AddCaseInterviewModalComponent implements OnInit {
  constructor(
    private dsaService: DsaService,
    @Optional()
    private counselDetailComponent: CounselDetailComponent,
    @Optional()
    private counselStudentService: CounselStudentService
  ) { }
  caseInterview: CaseInterview;
  _editMode: string = "add";
  editModeString: string = "新增";
  _studentName: string;

  ngOnInit() {
    this.caseInterview = new CaseInterview();
  }

  // 載入預設資料
  async loadDefaultData() {
    if (this.counselDetailComponent.currentStudent) {
      if (this._editMode === "edit" && this.caseInterview) {
        // 修改
        this.editModeString = "修改";
        this.caseInterview.setCounselType(this.caseInterview.CounselType);
      } else {
        // 新增
        this.editModeString = "新增";
        this._studentName = this.counselDetailComponent.currentStudent.StudentName;
        this.caseInterview.StudentID = this.counselDetailComponent.currentStudent.StudentID;
        this.caseInterview.SchoolYear = this.counselStudentService.currentSchoolYear;
        this.caseInterview.Semester = this.counselStudentService.currentSemester;
        // 帶入日期與輸入者
        let dt = new Date();
        this.caseInterview.OccurDate = this.caseInterview.parseDate(dt);
      }

      // 取得登入教師名稱
      let teacher = await this.dsaService.send("GetTeacher", {});
      [].concat(teacher.Teacher || []).forEach(tea => {
        this.caseInterview.AuthorName = tea.Name;

        // if (tea.NickName != "") {
        //   this.caseInterview.AuthorName = `${tea.Name}(${tea.NickName})`;
        // }
      });
      this.caseInterview.checkValue();
    }
  }

  // click 取消
  cancel() { }
  // click 儲存
  async save() {
    try {
      this.caseInterview.isSaveDisable = true;
      await this.SetCaseInterview(this.caseInterview);
      $("#addCaseInterview").modal("hide");
      this.caseInterview.isSaveDisable = false;
    } catch (error) {
      alert(error);
      this.caseInterview.isSaveDisable = false;
    }
  }

  // 新增/更新認輔資料，Service 使用UID是否有值判斷新增或更新
  async SetCaseInterview(data: CaseInterview) {
    if (!data.isPrivate) data.isPrivate = "true";
    if (!data.CounselTypeOther) {
      data.CounselTypeOther = "";
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
      Attachment: "",
      Content: data.Content,
      CaseID: data.CaseID,
      AuthorRole: data.AuthorRole
    };
    // console.log(req);

    let resp = await this.dsaService.send("SetCaseInterview", {
      Request: req
    });
    console.log(resp);
  }
}
