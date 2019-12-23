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
import { DsaService } from "../../../../dsa.service";


@Component({
  selector: "app-add-case-interview-modal",
  templateUrl: "./add-case-interview-modal.component.html",
  styleUrls: ["./add-case-interview-modal.component.css"]
})
export class AddCaseInterviewModalComponent implements OnInit {
  constructor(
    private dsaService: DsaService
  ) { }
  isCancel: boolean = true;

  _editMode: string = "add";
  editModeString: string = "新增";
  _studentName: string;

  SchoolYear: number;
  Semester: number;
  OccurDate: string = "";
  CaseNo: string = "";
  CounselType: string = "";
  CounselTypeOther: string = "";
  ContactName: string = "";
  Content: string = "";
  StudentID: string = "";
  selectCounselType: string = "";
  UID: string = "";
  AuthorName: string = "";
  CaseID: string = "";
  AuthorRole: string = "";

  isSchoolYearHasValue: boolean = false;
  isSemesterHasValue: boolean = false;
  isOccurDateHasValue: boolean = false;
  isCounselTypeHasValue: boolean = false;
  isCounselTypeOtherDisable: boolean = true;
  isContactNameHasValue: boolean = false;
  isContentHasValue: boolean = false;
  isSaveDisable: boolean = false;

  ngOnInit() {

    this.isCancel = true;
  }

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

  // 載入預設資料
  async loadDefaultData() {

    // 取得登入教師名稱
    let teacher = await this.dsaService.send("GetTeacher", {});
    [].concat(teacher.Teacher || []).forEach(tea => {
      this.AuthorName = tea.Name;

    });
    this.checkValue();

  }

  // click 取消
  cancel() {
    this.isCancel = true;
    $("#addCaseInterview").modal("hide");
  }
  // click 儲存
  async save() {
    this.isCancel = false;
    try {
      this.isSaveDisable = true;
      await this.SetCaseInterview();
      $("#addCaseInterview").modal("hide");
      this.isSaveDisable = false;
    } catch (error) {
      alert(error);
      this.isSaveDisable = false;
    }
  }

  // 新增/更新認輔資料，Service 使用UID是否有值判斷新增或更新
  async SetCaseInterview() {

    if (!this.CounselTypeOther) {
      this.CounselTypeOther = "";
    }
    let req = {
      UID: this.UID,
      SchoolYear: this.SchoolYear,
      Semester: this.Semester,
      OccurDate: this.OccurDate,
      ContactName: this.ContactName,
      AuthorName: this.AuthorName,
      CounselType: this.CounselType,
      CounselTypeOther: this.CounselTypeOther,
      isPrivate: "true",
      StudentID: this.StudentID,
      Attachment: "",
      Content: this.Content,
      CaseID: this.CaseID,
      AuthorRole: this.AuthorRole
    };
    // console.log(req);

    let resp = await this.dsaService.send("SetCaseInterview", {
      Request: req
    });
    console.log(resp);
  }
}
