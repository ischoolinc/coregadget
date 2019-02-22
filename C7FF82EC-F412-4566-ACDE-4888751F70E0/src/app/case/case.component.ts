import { Component, OnInit, Optional, ViewChild } from "@angular/core";
import { RoleService } from "../role.service";
import { AppComponent } from "../app.component";
import { CaseStudent, VoluntaryGuidanceTeacher } from "./case-student";
import { DsaService } from "../dsa.service";
import { NewCaseModalComponent } from "../case/new-case-modal/new-case-modal.component";
@Component({
  selector: "app-case",
  templateUrl: "./case.component.html",
  styleUrls: ["./case.component.css"]
})
export class CaseComponent implements OnInit {
  // 個案資料
  caseList: CaseStudent[];

  // 個案認輔老師
  caseTeacherList: VoluntaryGuidanceTeacher[];
  isLoading = false;
  constructor(
    public roleService: RoleService,
    private dsaService: DsaService,
    @Optional()
    private appComponent: AppComponent
  ) {
    if (this.appComponent) this.appComponent.currentComponent = "case";
  }

  @ViewChild("case_modal") case_modal: NewCaseModalComponent;

  // 新增
  setNewCaseModal() {
    this.case_modal.isAddMode = true;
    this.case_modal.caseStudent = new CaseStudent();
    this.case_modal.selectClassNameValue = "請選擇班級";
    this.case_modal.selectSeatNoValue = "請選擇座號";
    this.case_modal.selectCaseSourceValue = "請選擇個案來源";
    this.case_modal.selectVoluntaryGuidanceValue = "請選擇認輔老師";
    $("#newCase").modal("show");
    // 關閉畫面
    $("#newCase").on("hide.bs.modal", () => {
      // 重整資料
      this.loadData();
      $("#newCase").off("hide.bs.modal");
    });
  }

  // 編輯
  setEditCaseModal(item: CaseStudent) {
    this.case_modal.isAddMode = false;
    this.case_modal.isCanSetClass = false;
    this.case_modal.caseStudent = item;
    this.case_modal.selectClassNameValue = item.ClassName;
    this.case_modal.selectSeatNoValue = item.SeatNo;
    this.case_modal.selectCaseSourceValue = item.CaseSource;
    //this.case_modal.teacherName = item.TeacherName;
    this.case_modal.selectVoluntaryGuidanceValue = item.GuidanceTeacher.GetTeacherName();
    this.case_modal.caseStudent.checkValue();
    item.checkValue();
    $("#newCase").modal("show");
    // 關閉畫面
    $("#newCase").on("hide.bs.modal", () => {
      // 重整資料
      this.loadData();
      $("#newCase").off("hide.bs.modal");
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.caseList = [];
    this.caseTeacherList = [];
    this.GetCaseVGTeacher();
    this.GetCase();
  }

  // 取得個案
  async GetCase() {
    let data: CaseStudent[] = [];

    let resp = await this.dsaService.send("GetCase", {
      Request: {}
    });

    [].concat(resp.Case || []).forEach(caseRec => {
      // 建立認輔資料
      let rec: CaseStudent = new CaseStudent();
      rec.UID = caseRec.UID;
      rec.SchoolYear = caseRec.SchoolYear;
      rec.Semester = caseRec.Semester;
      rec.ClassName = caseRec.ClassName;
      rec.SeatNo = caseRec.SeatNo;
      rec.Name = caseRec.Name;
      if (caseRec.Gender === "1") {
        rec.Gender = "男";
      } else {
        rec.Gender = "女";
      }
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
      rec.CaseCount = caseRec.CaseCount;
      rec.PhotoUrl = `${
        this.dsaService.AccessPoint
      }/GetStudentPhoto?stt=Session&sessionid=${
        this.dsaService.SessionID
      }&parser=spliter&content=StudentID:${rec.StudentID}`;
      this.caseTeacherList.forEach(case_data => {
        if (rec.UID === case_data.CaseID) {
          rec.GuidanceTeacher = case_data;
        }
      });

      rec.TeacherName = caseRec.TeacherName;
      if (caseRec.TeacherNickName != "") {
        rec.TeacherName = `${rec.TeacherName}(${caseRec.TeacherNickName})`;
      }
      data.push(rec);
    });
    this.caseList = data;
    this.isLoading = false;
  }

  // 取得個案認輔老師
  async GetCaseVGTeacher() {
    let data: VoluntaryGuidanceTeacher[] = [];

    let resp = await this.dsaService.send("GetCaseVGTeacher", {
      Request: {}
    });

    [].concat(resp.Case || []).forEach(caseRec => {
      // 建立認輔資料
      let rec: VoluntaryGuidanceTeacher = new VoluntaryGuidanceTeacher();
      rec.CaseID = caseRec.CaseID;
      rec.TeacherID = caseRec.TeacherID;
      rec.NickName = caseRec.NickName;
      rec.Name = caseRec.TeacherName;
      data.push(rec);
    });
    this.caseTeacherList = data;
  }
}
