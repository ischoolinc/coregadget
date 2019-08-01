import { Component, OnInit, Optional, ViewChild } from "@angular/core";
import { CaseStudent } from "../../../case/case-student";
import { DsaService } from "../../../dsa.service";
import { CounselDetailComponent } from "../counsel-detail.component";
import { GlobalService } from "../../../global.service";
import {
  CaseInterview,
  SemesterInfo
} from "../counsel-item-detail/case-interview-vo";
import { AddCaseInterviewModalComponent } from "./add-case-interview-modal/add-case-interview-modal.component";
import { DelCaseInterviewModalComponent } from "./del-case-interview-modal/del-case-interview-modal.component";

@Component({
  selector: "app-counsel-item-detail",
  templateUrl: "./counsel-item-detail.component.html",
  styleUrls: ["./counsel-item-detail.component.css"]
})
export class CounselItemDetailComponent implements OnInit {
  _semesterInfo: SemesterInfo[] = [];
  caseInterview: CaseInterview[] = [];
  _StudentID: string = "";
  isLoading = false;
  // 個案資料
  caseList: CaseStudent[];
  isDeleteButtonDisable: boolean = true;

  @ViewChild("addCaseInterview") _addInterview: AddCaseInterviewModalComponent;
  @ViewChild("delCaseInterview") _delCaseInterview: DelCaseInterviewModalComponent;

  constructor(
    private dsaService: DsaService,
    public globalService: GlobalService,
    @Optional()
    private counselDetailComponent: CounselDetailComponent
  ) { }

  async ngOnInit() {
    this.counselDetailComponent.setCurrentItem('counsel');
    this.caseList = [];
    this._StudentID = "";
    this.isDeleteButtonDisable = true;
    this._StudentID = this.counselDetailComponent.currentStudent.StudentID;
    await this.loadData();
  }

  async loadData() {
    await this.GetStudentCase();
    await this.GetCaseInterviewByStudentID(this._StudentID);
  }

  // 新增
  addInterviewModal(item: CaseStudent) {
    this._addInterview._editMode = "add";
    let CaseInterviewAdd: CaseInterview = new CaseInterview();
    CaseInterviewAdd.CaseID = item.UID;
    CaseInterviewAdd.CaseNo = item.CaseNo;
    CaseInterviewAdd.StudentID = item.StudentID;
    CaseInterviewAdd.AuthorRole = this.globalService.MyCounselTeacherRole;

    this._addInterview.caseInterview = CaseInterviewAdd;
    this._addInterview.caseInterview.checkValue();

    this._addInterview.loadDefaultData();
    $("#addCaseInterview").modal("show");

    // 關閉畫面
    $("#addCaseInterview").on("hide.bs.modal", () => {
      if (!this._addInterview.isCancel) {
        // 重整資料
        this.loadData();
      }
      $("#addCaseInterview").off("hide.bs.modal");
    });
  }

  // 修改
  editInterviewModal(counselView: CaseInterview) {
    this._addInterview._editMode = "edit";
    counselView.AuthorRole = this.globalService.MyCounselTeacherRole;
    this._addInterview.caseInterview = counselView;
    let obj = Object.assign({},counselView);
    this._addInterview.loadDefaultData();
    $("#addCaseInterview").modal("show");
    // 關閉畫面
    $("#addCaseInterview").on("hide.bs.modal", () => {
      if (!this._addInterview.isCancel) {
        // 重整資料
        this.loadData();
      }else{
        Object.assign(this._addInterview.caseInterview,obj);
      }
      $("#addCaseInterview").off("hide.bs.modal");
    });
  }

  // 刪除
  deleteInterviewModal(counselView: CaseInterview) {
    this._delCaseInterview.caseInterview = counselView;
    $("#delCaseInterview").modal("show");
    // 關閉畫面
    $("#delCaseInterview").on("hide.bs.modal", () => {
      if (!this._delCaseInterview.isCancel) {
        // 重整資料
        this.loadData();
      }
      $("#delCaseInterview").off("hide.bs.modal");
    });
  }

  // 取得學生個案
  async GetStudentCase() {
    this.isLoading = true;
    let data: CaseStudent[] = [];

    let ServiceName: string = "GetStudentCase";

    if (
      this.counselDetailComponent.currentStudent.Role.indexOf("認輔老師") >= 0
    ) {
      // ServiceName = "GetStudentCase1";
    }

    let resp = await this.dsaService.send(ServiceName, {
      Request: {
        StudentID: this.counselDetailComponent.currentStudent.StudentID
      }
    });

    [].concat(resp.Case || []).forEach(caseRec => {
      // 建立認輔資料
      let rec: CaseStudent = new CaseStudent();
      rec.UID = caseRec.UID;

      let x = Number(caseRec.OccurDate);
      let dt = new Date(x);
      rec.OccurDate = rec.parseDate(dt, '-');
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
      rec.MainTeacher = caseRec.MainTeacher;
      rec.Role = caseRec.Role;

      rec.PhotoUrl = `${
        this.dsaService.AccessPoint
        }/GetStudentPhoto?stt=Session&sessionid=${
        this.dsaService.SessionID
        }&parser=spliter&content=StudentID:${rec.StudentID}`;
      rec.TeacherName = caseRec.TeacherName;

      data.push(rec);
    });
    this.caseList = data;
  }

  async GetCaseInterviewByStudentID(StudentID: string) {
    let data: CaseInterview[] = [];

    let resp = await this.dsaService.send("GetStudentCaseInterview", {
      Request: {
        StudentID: StudentID
      }
    });

    [].concat(resp.CaseInterview || []).forEach(counselRec => {
      // 建立認輔資料
      let rec: CaseInterview = new CaseInterview();
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
    this.caseInterview = data;
    let tmp = [];
    this._semesterInfo = [];
    this.caseInterview.forEach(data => {
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

    if (this.globalService.MyCounselTeacherRole === '輔導主任' || this.globalService.MyCounselTeacherRole === '輔導組長') {
      this.isDeleteButtonDisable = false;
    } else {
      this.isDeleteButtonDisable = true;
    }
  }
}
