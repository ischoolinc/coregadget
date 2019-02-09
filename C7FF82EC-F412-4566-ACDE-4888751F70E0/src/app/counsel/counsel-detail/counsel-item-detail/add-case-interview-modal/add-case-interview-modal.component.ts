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
import { CaselInterview } from "../case-interview-vo";

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
  ) {}
  caselInterview: CaselInterview;
  caseList: CaseStudent[];
  _editMode: string = "add";
  editModeString: string = "新增";
  _studentName: string;

  ngOnInit() {
    this.caselInterview = new CaselInterview();

    this.caseList = [];
  }

  // 載入預設資料
  async loadDefaultData() {
    if (this.counselDetailComponent.currentStudent) {
      if (this._editMode === "edit" && this.caselInterview) {
        // 修改
        this.editModeString = "修改";
      } else {
        // 新增
        this.caselInterview = new CaselInterview();
        this._studentName = this.counselDetailComponent.currentStudent.StudentName;
        this.caselInterview.StudentID = this.counselDetailComponent.currentStudent.StudentID;
        this.caselInterview.SchoolYear = this.counselStudentService.currentSchoolYear;
        this.caselInterview.Semester = this.counselStudentService.currentSemester;
        // 帶入日期與輸入者
        let dt = new Date();
        this.caselInterview.OccurDate = this.caselInterview.parseDate(dt);
      }

      // 取得登入教師名稱
      let teacher = await this.dsaService.send("GetTeacher", {});
      [].concat(teacher.Teacher || []).forEach(tea => {
        this.caselInterview.AuthorName = tea.Name;
      });

      // console.log(this._CounselInterview);
    }
  }

  setCaseNo(value: CaseStudent) {
    this.caselInterview.CaseID = value.UID;
    this.caselInterview.CaseNo = value.CaseNo;
  }

  // 設定訪談方式
  setCounselType(value: string) {
    this.caselInterview.CounselType = value;
  }

  // click 取消
  cancel() {}
  // click 儲存
  async save() {
    try {
      await this.SetCaseInterview(this.caselInterview);
      $("#addCaseInterview").modal("hide");
    } catch (error) {
      alert(error);
    }
  }

  // 新增/更新認輔資料，Service 使用UID是否有值判斷新增或更新
  async SetCaseInterview(data: CaselInterview) {
    if (!data.isPrivate) data.isPrivate = "true";
    data.CounselTypeOther = "";
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
      CaseID: data.CaseID
    };
    console.log(req);

    let resp = await this.dsaService.send("SetCaseInterview", {
      Request: req
    });
    console.log(resp);
  }
}
