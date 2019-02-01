import { Component, OnInit, Optional, ViewChild } from "@angular/core";
import { CaseStudent } from "../../../case/case-student";
import { DsaService } from "../../../dsa.service";
import { CounselDetailComponent } from "../counsel-detail.component";
import {
  CaselInterview,
  SemesterInfo
} from "../counsel-item-detail/case-interview-vo";
import { AddCaseInterviewModalComponent } from "./add-case-interview-modal/add-case-interview-modal.component";
@Component({
  selector: "app-counsel-item-detail",
  templateUrl: "./counsel-item-detail.component.html",
  styleUrls: ["./counsel-item-detail.component.css"]
})
export class CounselItemDetailComponent implements OnInit {
  _semesterInfo: SemesterInfo[] = [];
  caselInterview: CaselInterview[] = [];
  _StudentID: string = "";
  isLoading = false;
  // 個案資料
  caseList: CaseStudent[];

  @ViewChild("addCaseInterview") _addInterview: AddCaseInterviewModalComponent;

  constructor(
    private dsaService: DsaService,
    @Optional()
    private counselDetailComponent: CounselDetailComponent
  ) {}

  ngOnInit() {
    this.caseList = [];
    this._StudentID = "";
    this._StudentID = this.counselDetailComponent.currentStudent.StudentID;
    this.loadData();
  }

  loadData() {
    this.GetStudentCase();
    this.GetCaseInterviewByStudentID(this._StudentID);
  }

  // 新增
  addInterviewModal() {
    this._addInterview._editMode = "add";
    this._addInterview.caseList = this.caseList;
    this._addInterview.loadDefaultData();
    $("#addCaseInterview").modal("show");

    // 關閉畫面
    $("#addCaseInterview").on("hide.bs.modal", () => {
      // 重整資料
      this.loadData();
    });
  }

  // 修改
  editInterviewModal(counselView: CaselInterview) {
    this._addInterview._editMode = "edit";
    this._addInterview.caseList = [];
    this._addInterview.caselInterview = counselView;
    this._addInterview.loadDefaultData();
    $("#addCaseInterview").modal("show");
  }

  // 取得學生個案
  async GetStudentCase() {
    this.isLoading = true;
    let data: CaseStudent[] = [];

    let resp = await this.dsaService.send("GetStudentCase", {
      Request: {
        StudentID: this.counselDetailComponent.currentStudent.StudentID
      }
    });

    [].concat(resp.Case || []).forEach(caseRec => {
      // 建立認輔資料
      let rec: CaseStudent = new CaseStudent();
      rec.UID = caseRec.UID;
      rec.SchoolYear = caseRec.SchoolYear;
      rec.Semester = caseRec.Semester;
      let x = Number(caseRec.OccurDate);
      let dt = new Date(x);
      rec.OccurDate = rec.parseDate(dt);
      rec.CaseNo = caseRec.CaseNo;
      rec.StudentIdentity = caseRec.StudentIdentity;
      rec.PossibleSpecialCategory = caseRec.PossibleSpecialCategory;
      rec.SpecialLevel = caseRec.SpecialLevel;
      rec.SpecialCategory = caseRec.SpecialCategory;
      rec.HasDisabledBook = caseRec.HasDisabledBook;
      rec.DeviantBehavior = caseRec.DeviantBehavior;
      rec.ProblemCategory = caseRec.ProblemCategory;
      rec.ProbleDescription = caseRec.ProbleDescription;
      rec.SpecialSituation = caseRec.SpecialSituation;
      rec.EvaluationResult = caseRec.EvaluationResult;
      rec.IsClosed = caseRec.IsClosed;
      rec.CloseDate = caseRec.CloseDate;
      rec.ClosedByTeacherID = caseRec.ClosedByTeacherID;
      rec.CloseDescription = caseRec.CloseDescription;
      rec.StudentID = caseRec.StudentID;
      rec.CaseSource = caseRec.CaseSource;

      rec.TeacherName = caseRec.TeacherName;
      if (caseRec.TeacherNickName != "") {
        rec.TeacherName = `${rec.TeacherName}(${caseRec.TeacherNickName})`;
      }
      data.push(rec);
    });
    this.caseList = data;
  }

  async GetCaseInterviewByStudentID(StudentID: string) {
    let data: CaselInterview[] = [];

    let resp = await this.dsaService.send("GetStudentCaseInterview", {
      Request: {
        StudentID: StudentID
      }
    });

    [].concat(resp.CaseInterview || []).forEach(counselRec => {
      // 建立認輔資料
      let rec: CaselInterview = new CaselInterview();
      rec.UID = counselRec.UID;
      rec.StudentName = counselRec.StudentName;
      rec.SchoolYear = parseInt(counselRec.SchoolYear);
      rec.Semester = parseInt(counselRec.Semester);
      let dN = Number(counselRec.OccurDate);
      let x = new Date(dN);
      rec.OccurDate = rec.parseDate(x);
      rec.ContactName = counselRec.ContactName;
      rec.AuthorName = counselRec.AuthorName;
      rec.CounselType = counselRec.CounselType;
      rec.CounselTypeOther = counselRec.CounselTypeOther;
      rec.isPrivate = counselRec.isPrivate;
      rec.StudentID = counselRec.StudentID;
      rec.Attachment = counselRec.Attachment;
      rec.CaseID = counselRec.CaseID;
      rec.Content = counselRec.Content;
      rec.CaseNo = counselRec.CaseNo;     

      data.push(rec);
    });
    this.caselInterview = data;
    let tmp = [];
    this._semesterInfo = [];
    this.caselInterview.forEach(data => {
      let key = `${data.SchoolYear}_${data.Semester}`;
      if (!tmp.includes(key)) {
        let sms: SemesterInfo = new SemesterInfo();
        sms.SchoolYear = data.SchoolYear;
        sms.Semester = data.Semester;
        this._semesterInfo.push(sms);
        tmp.push(key);
      }
    });
    this.isLoading = false;
  }
}
