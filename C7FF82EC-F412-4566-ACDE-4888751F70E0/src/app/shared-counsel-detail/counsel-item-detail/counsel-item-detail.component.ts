import { Component, OnInit, Optional, ViewChild } from "@angular/core";
import { CaseStudent } from "../../case/case-student";
import { DsaService } from "../../dsa.service";
import { CounselDetailComponent } from "../counsel-detail.component";
import { GlobalService } from "../../global.service";
import { RoleService } from "../../role.service";
import { CounselStudentService, CounselClass } from "../../counsel-student.service";
import { CaseInterview, SemesterInfo } from "./case-interview-vo";
import { AddCaseInterviewModalComponent } from "./add-case-interview-modal/add-case-interview-modal.component";
import { DelCaseInterviewModalComponent } from "./del-case-interview-modal/del-case-interview-modal.component";
import { ViewCaseInterviewModalComponent } from "./view-case-interview-modal/view-case-interview-modal.component";

@Component({
  selector: "app-counsel-item-detail",
  templateUrl: "./counsel-item-detail.component.html",
  styleUrls: ["./counsel-item-detail.component.css"]
})
export class CounselItemDetailComponent implements OnInit {
  _semesterInfo: SemesterInfo[] = [];
  caseInterview: CaseInterview[] = [];
  caseViewInfoList: CaseViewInfo[] = [];
  _StudentID: string = "";
  isLoading = false;
  // 個案資料
  caseList: CaseStudent[];
  isDeleteButtonDisable: boolean = true;

  @ViewChild("addCaseInterview") _addInterview: AddCaseInterviewModalComponent;
  @ViewChild("delCaseInterview") _delCaseInterview: DelCaseInterviewModalComponent;
  @ViewChild("viewCaseInterview") _viewCaseInterview: ViewCaseInterviewModalComponent;

  constructor(
    private dsaService: DsaService,
    public globalService: GlobalService,
    public roleService: RoleService,
    @Optional()
    private counselDetailComponent: CounselDetailComponent,
    private counselStudentService: CounselStudentService
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
    this._addInterview.CaseID = item.UID;
    this._addInterview.CaseNo = item.CaseNo;
    this._addInterview.StudentID = item.StudentID;
    this._addInterview.AuthorRole = this.globalService.MyCounselTeacherRole;
    this._addInterview.editModeString = "新增";
    this._addInterview._studentName = this.counselDetailComponent.currentStudent.StudentName;
    this._addInterview.StudentID = this.counselDetailComponent.currentStudent.StudentID;
    this._addInterview.SchoolYear = this.counselStudentService.currentSchoolYear;
    this._addInterview.Semester = this.counselStudentService.currentSemester;
    this._addInterview.UID = "";
    this._addInterview.CounselType = "";
    this._addInterview.CounselTypeOther = "";
    this._addInterview.ContactName = "";
    this._addInterview.Content = "";
    this._addInterview.selectCounselType = "請選擇方式";
    this._addInterview.AuthorName = "";


    // 帶入日期與輸入者
    let dt = new Date();
    this._addInterview.OccurDate = this.parseDate(dt);

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
    //return `${y}/${mStr}/${dStr}`;
  }

  // 檢視
  viewInterviewModal(caseInterview: CaseInterview) {
    this._viewCaseInterview._studentName = caseInterview.StudentName;
    this._viewCaseInterview.StudentID = caseInterview.StudentID;
    this._viewCaseInterview.SchoolYear = caseInterview.SchoolYear;
    this._viewCaseInterview.Semester = caseInterview.Semester;
    this._viewCaseInterview.UID = caseInterview.UID;
    this._viewCaseInterview.OccurDate = caseInterview.OccurDate;
    this._viewCaseInterview.CaseNo = caseInterview.CaseNo;
    this._viewCaseInterview.CounselType = caseInterview.CounselType;
    this._viewCaseInterview.CounselTypeOther = caseInterview.CounselTypeOther;
    this._viewCaseInterview.ContactName = caseInterview.ContactName;
    this._viewCaseInterview.Content = caseInterview.Content;

    this._viewCaseInterview.AuthorName = caseInterview.AuthorName;
    this._viewCaseInterview.CaseID = caseInterview.CaseID;

    $("#viewCaseInterview").modal("show");
    // 關閉畫面
    $("#viewCaseInterview").on("hide.bs.modal", () => {

      $("#viewCaseInterview").off("hide.bs.modal");
    });

  }

  // 修改
  editInterviewModal(caseInterview: CaseInterview) {
    this._addInterview._editMode = "edit";
    this._addInterview.editModeString = "修改";
    this._addInterview.AuthorRole = caseInterview.AuthorRole;
    this._addInterview._studentName = caseInterview.StudentName;
    this._addInterview.StudentID = caseInterview.StudentID;
    this._addInterview.SchoolYear = caseInterview.SchoolYear;
    this._addInterview.Semester = caseInterview.Semester;
    this._addInterview.UID = caseInterview.UID;
    this._addInterview.OccurDate = caseInterview.OccurDate;
    this._addInterview.CaseNo = caseInterview.CaseNo;
    this._addInterview.CounselType = caseInterview.CounselType;
    this._addInterview.CounselTypeOther = caseInterview.CounselTypeOther;
    this._addInterview.ContactName = caseInterview.ContactName;
    this._addInterview.Content = caseInterview.Content;
    this._addInterview.setCounselType(caseInterview.CounselType);
    this._addInterview.AuthorName = caseInterview.AuthorName;
    this._addInterview.CaseID = caseInterview.CaseID;

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
    this.caseViewInfoList = [];
    let ServiceName: string = "GetStudentCase";


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
      if (caseRec.IsClosed === 't') {
        rec.IsClosed = '是';
      } else {
        rec.IsClosed = '否';
      }
      rec.CloseDate = caseRec.CloseDate;
      rec.ClosedByTeacherID = caseRec.ClosedByTeacherID;
      rec.CloseDescription = caseRec.CloseDescription;
      rec.StudentID = caseRec.StudentID;
      rec.CaseSource = caseRec.CaseSource;
      // rec.MainTeacher = caseRec.MainTeacher;
      // rec.Role = caseRec.Role;
      rec.ClassID = caseRec.ClassID;
      rec.isEditDisable = true;
      if (caseRec.CanEditCase === 't') {
        rec.isEditDisable = false;
      }

      rec.PhotoUrl = `${
        this.dsaService.AccessPoint
        }/GetStudentPhoto?stt=Session&sessionid=${
        this.dsaService.SessionID
        }&parser=spliter&content=StudentID:${rec.StudentID}`;

      rec.TeacherName = "";
      if (this.counselStudentService.classMap.has(rec.ClassID)) {
        let classRec: CounselClass;
        classRec = this.counselStudentService.classMap.get(
          rec.ClassID
        );
        rec.TeacherName = classRec.HRTeacherName;
        if (classRec.HRTeacherNickName && classRec.HRTeacherNickName.length > 0) {
          rec.TeacherName = classRec.HRTeacherName + "(" + classRec.HRTeacherNickName + ")";
        }
      }

      //   rec.TeacherName = caseRec.TeacherName;
      let caseInfo: CaseViewInfo = new CaseViewInfo();
      caseInfo.CaseID = caseRec.UID;
      caseInfo.CaseStudentInfo = rec;
      caseInfo.CaseInterviewList = [];
      caseInfo.SemesterInfoList = [];
      this.caseViewInfoList.push(caseInfo);

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
      rec.ClassID = counselRec.ClassID;
      rec.CaseIsClosed = counselRec.CaseIsClosed;
      this.caseList.forEach(item => {
        if (item.UID === rec.CaseID) {
          rec.isEditDisable = item.isEditDisable;
        }
      });


      // 如果只有認輔老師權限，認輔紀錄只能看到自己的。
      if (this.globalService.MyCounselTeacherRole === "認輔老師") {
        if (counselRec.AuthorTeacherID === this.counselDetailComponent.counselStudentService.teacherInfo.ID) {
          data.push(rec);
        }
      } else {
        data.push(rec);
      }
    });
    this.caseInterview = data;


    let tmp = [];
    this._semesterInfo = [];
    this.caseInterview.forEach(data => {
      let key = `${data.CaseID}_${data.SchoolYear}_${data.Semester}`;
      if (!tmp.includes(key)) {
        let sms: SemesterInfo = new SemesterInfo();
        sms.SchoolYear = data.SchoolYear;
        sms.Semester = data.Semester;
        sms.CaseID = data.CaseID;
        this._semesterInfo.push(sms);
        tmp.push(key);
      }
    });
    this._semesterInfo.forEach(sms => {
      this.caseViewInfoList.forEach(caseV => {
        if (sms.CaseID === caseV.CaseID) {
          caseV.SemesterInfoList.push(sms);
        }
      });
    });

    // 整理資料
    this.caseInterview.forEach(data => {
      this.caseViewInfoList.forEach(caseV => {
        if (data.CaseID === caseV.CaseID) {
          caseV.CaseInterviewList.push(data);
        }
      });
    });


    this.isLoading = false;

    this.isDeleteButtonDisable = !this.roleService.enableAdmin;

  }
}

// 個案檢視
export class CaseViewInfo {
  CaseID: string = "";
  CaseStudentInfo: CaseStudent = new CaseStudent();
  SemesterInfoList: SemesterInfo[] = [];
  CaseInterviewList: CaseInterview[] = [];
}
