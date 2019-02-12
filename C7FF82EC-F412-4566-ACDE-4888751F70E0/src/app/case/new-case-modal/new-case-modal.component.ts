import { Component, OnInit } from "@angular/core";
import { CaseStudent, VoluntaryGuidanceTeacher } from "../case-student";
import { DsaService } from "../../dsa.service";
import { ReferralStudent } from "../../referral/referral-student";
import {
  CounselStudentService,
  CounselClass,
  CounselStudent,
  SemesterInfo
} from "../../counsel-student.service";

@Component({
  selector: "app-new-case-modal",
  templateUrl: "./new-case-modal.component.html",
  styleUrls: ["./new-case-modal.component.css"]
})
export class NewCaseModalComponent implements OnInit {
  constructor(
    private dsaService: DsaService,
    private counselStudentService: CounselStudentService
  ) {}
  public caseStudent: CaseStudent;
  selectVoluntaryGuidanceTeacher: VoluntaryGuidanceTeacher;
  // 認輔老師
  selectVoluntaryGuidanceValue: string = "請選擇認輔老師";
  // 班級
  selectClassNameValue: string;
  // 座號
  selectSeatNoValue: string;
  teacherName: string;
  selectCaseSourceValue: string;
  canSelectClassList: CounselClass[];
  canSelectNoList: CounselStudent[];
  canSelectCaseSourceList: string[];
  voluntaryGuidanceTeacherList: VoluntaryGuidanceTeacher[];
  currentSchoolYear: number;
  currentSemester: number;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.voluntaryGuidanceTeacherList = [];
    this.selectClassNameValue = "請選擇班級";
    this.selectSeatNoValue = "請選擇座號";
    this.selectVoluntaryGuidanceValue = "請選擇認輔老師";
    this.selectCaseSourceValue = "請選擇個案來源";
    this.canSelectCaseSourceList = [];
    this.canSelectCaseSourceList.push("導師轉介");
    this.canSelectCaseSourceList.push("路邊捕獲");

    this.GetDefault();

    this.caseStudent = new CaseStudent();

    this.GetVoluntaryGuidanceTeacher();
  }

  setCaseSource(item: string) {
    this.selectCaseSourceValue = item;
  }

  // 設定班級名稱
  setClassName(item: CounselClass) {
    this.selectClassNameValue = item.ClassName;
    // 請除可選學生號碼
    this.canSelectNoList = [];
    this.caseStudent = new CaseStudent();
    this.selectSeatNoValue = '請選擇座號';
    if (this.counselStudentService.classMap.has(item.ClassID)) {
      this.canSelectNoList = this.counselStudentService.classMap.get(
        item.ClassID
      ).Student;
    }
  }

  //設定座號
  setSeatNo(item: CounselStudent) {
    this.selectSeatNoValue = item.SeatNo;
    this.caseStudent = new CaseStudent();
    this.caseStudent.Name = item.StudentName;
    this.caseStudent.SeatNo = item.SeatNo;
    this.caseStudent.Gender = item.Gender;
    this.caseStudent.StudentID = item.StudentID;
    this.caseStudent.StudentIdentity = item.Status;
    this.counselStudentService.counselClass.forEach(clas =>{
      if (clas.ClassName === item.ClassName)
      {
        this.caseStudent.TeacherName = clas.HRTeacherName;  
      }
    });
      
  }

  setCaseFromReferral(refData: ReferralStudent) {
    this.caseStudent = new CaseStudent();
    this.caseStudent.ClassName = refData.ClassName;
    this.caseStudent.Name = refData.Name;
    this.caseStudent.SeatNo = refData.SeatNo;
    this.caseStudent.Gender = refData.Gender;
    this.caseStudent.StudentID = refData.StudentID;
    this.caseStudent.TeacherName = refData.TeacherName;
    this.selectClassNameValue = this.caseStudent.ClassName;
    this.selectSeatNoValue = this.caseStudent.SeatNo;
  }

  save() {
    // console.log($("#result1:checked").val());
    // let x = $("#result2:checked").val();
    // console.log("test");
    try {
      this.caseStudent.CaseSource = this.selectCaseSourceValue;
      console.log(this.caseStudent);
      // 新增個案
      this.SetCase(this.caseStudent);
      $("#newCase").modal("hide");
    } catch (error) {
      alert(error);
    }
  }

  // GetVoluntaryGuidanceTeacher

  // 設定認輔老師
  setVoluntaryGuidanceTeacher(item: VoluntaryGuidanceTeacher) {
    this.selectVoluntaryGuidanceTeacher = item;
    this.selectVoluntaryGuidanceValue = item.Name;
  }

  // 取得當學年度學期認輔老師
  async GetVoluntaryGuidanceTeacher() {
    this.voluntaryGuidanceTeacherList = [];

    let resp = await this.dsaService.send("GetVoluntaryGuidanceTeacher", {});

    [].concat(resp.Teacher || []).forEach(teacherRec => {
      let rec: VoluntaryGuidanceTeacher = new VoluntaryGuidanceTeacher();
      rec.UID = teacherRec.UID;
      rec.TeacherID = teacherRec.TeacherID;
      rec.Name = teacherRec.Name;
      rec.NickName = teacherRec.NickName;
      rec.StLoginName = teacherRec.StLoginName;
      this.voluntaryGuidanceTeacherList.push(rec);
    });
  }

  // 取得預設資料
  async GetDefault() {
    // 取得目前學年度學期
    this.currentSchoolYear = this.counselStudentService.currentSchoolYear;
    this.currentSemester = this.counselStudentService.currentSemester;
    this.counselStudentService.teacherName;
    // // 取得目前學年度學期
    // let currentSemeRsp = await this.dsaService.send("GetCurrentSemester", {});
    // [].concat(currentSemeRsp.CurrentSemester || []).forEach(sems => {
    //   this.currentSchoolYear = sems.SchoolYear;
    //   this.currentSemester = sems.Semester;
    // });

    // 取得登入教師名稱
    // let teacher = await this.dsaService.send("GetTeacher", {});
    // [].concat(teacher.Teacher || []).forEach(tea => {
    //   this.teacherName = tea.Name;
    //   if (tea.NickName != "") {
    //     this.teacherName = `${tea.Name}(${tea.NickName})`;
    //   }
    // });
    this.teacherName = this.counselStudentService.teacherName;

    // 取得輔導班級
    this.canSelectClassList = [];
    this.counselStudentService.counselClass.forEach(data => {
      if (data.Role.indexOf("輔導老師") > -1) {
        this.canSelectClassList.push(data);
      }
    });
  }

  // 新增個案
  async SetCase(data: CaseStudent) {
    data.SchoolYear = this.currentSchoolYear;
    data.Semester = this.currentSemester;

    // 開發中先填入預設
    if (!data.StudentIdentity)
    {
      data.StudentIdentity = '一般生';
    }
    data.PossibleSpecialCategory = "";
    data.SpecialLevel = "";
    data.SpecialCategory = "";
    data.HasDisabledBook = "false";
    data.DeviantBehavior = "";
    data.ProblemCategory = "";
    data.ProbleDescription = "";
    data.SpecialSituation = "";
    data.EvaluationResult = "";
    data.CloseDescription = "";

    let req = {
      SchoolYear: data.SchoolYear,
      Semester: data.Semester,
      OccurDate: data.OccurDate,
      CaseNo: data.CaseNo,
      StudentIdentity: data.StudentIdentity,
      PossibleSpecialCategory: data.PossibleSpecialCategory,
      SpecialLevel: data.SpecialLevel,
      SpecialCategory: data.SpecialCategory,
      HasDisabledBook: data.HasDisabledBook,
      DeviantBehavior: data.DeviantBehavior,
      ProblemCategory: data.ProblemCategory,
      ProbleDescription: data.ProbleDescription,
      SpecialSituation: data.SpecialSituation,
      EvaluationResult: data.EvaluationResult,
      CloseDescription: data.CloseDescription,
      StudentID: data.StudentID,
      CaseSource: data.CaseSource,
      VGTeacherID: this.selectVoluntaryGuidanceTeacher.UID
    };

    console.log(req);

    let resp = await this.dsaService.send("SetCase", {
      Request: req
    });
    console.log(resp);
  }
}
