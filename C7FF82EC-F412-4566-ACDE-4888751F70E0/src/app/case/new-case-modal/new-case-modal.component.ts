import { Component, OnInit } from "@angular/core";
import { CaseStudent, CaseTeacher, CounselTeacher, SelectCaseTeacher } from "../case-student";
import { DsaService } from "../../dsa.service";
import { ReferralStudent } from "../../referral/referral-student";
import { FormControl } from "@angular/forms";
import {
  CounselStudentService,
  CounselClass,
  CounselStudent,
  SemesterInfo
} from "../../counsel-student.service";
import { QOption } from "../case-question-data-modal";
import { getMatIconFailedToSanitizeLiteralError } from '@angular/material';
import { debug } from 'util';

@Component({
  selector: "app-new-case-modal",
  templateUrl: "./new-case-modal.component.html",
  styleUrls: ["./new-case-modal.component.css"]
})
export class NewCaseModalComponent implements OnInit {
  constructor(
    private dsaService: DsaService,
    private counselStudentService: CounselStudentService
  ) { }

  isAddMode: boolean = true;
  isCanSetClass: boolean = false;
  editModeString: string = "新增";
  public caseStudent: CaseStudent;

  // 認輔老師
  selectCaseTeachersValue: string = "請選擇認輔老師";
  // 班級
  selectClassNameValue: string;
  // 座號
  selectSeatNoValue: string;
  teacherName: string;
  selectCaseSourceValue: string;
  canSelectClassList: CounselClass[];
  canSelectNoList: CounselStudent[];
  canSelectCaseSourceList: string[];

  // 輔導老師清單
  CounselTeacherList: CounselTeacher[];

  ngOnInit() {
    this.loadData();
  }

  loadData() {

    this.CounselTeacherList = [];
    this.selectClassNameValue = "請選擇班級";
    this.selectSeatNoValue = "請選擇座號";
    this.selectCaseTeachersValue = "請選擇認輔老師";
    this.selectCaseSourceValue = "請選擇個案來源";
    this.canSelectCaseSourceList = [];
    this.canSelectCaseSourceList.push("導師轉介");
    this.canSelectCaseSourceList.push("主動求助");
    this.canSelectCaseSourceList.push("親友代為求助");
    this.canSelectCaseSourceList.push("輔導教師主動發現");
    this.canSelectCaseSourceList.push("其他處室轉介");
    this.canSelectCaseSourceList.push("其他");

    this.GetDefault();

    if (!this.caseStudent) this.caseStudent = new CaseStudent();

    // 檢查狀態
    if (this.isAddMode) {
      if (!this.caseStudent.RefCounselInterviewID) {
        this.isCanSetClass = true;
        // this.caseStudent.useQuestionOptionTemplate();
      } else {
        this.isCanSetClass = false;
      }
    } else {
    }
  }

  setCaseSource(item: string) {
    this.selectCaseSourceValue = item;
    this.caseStudent.CaseSource = item;
    this.caseStudent.checkValue();
  }

  // 設定班級名稱
  setClassName(item: CounselClass) {
    $("#newCase").modal("handleUpdate");
    this.selectClassNameValue = item.ClassName;
    // 請除可選學生號碼
    this.canSelectNoList = [];

    this.selectSeatNoValue = "請選擇座號";

    if (this.counselStudentService.classMap.has(item.ClassID)) {
      this.canSelectNoList = this.counselStudentService.classMap.get(
        item.ClassID
      ).Student;
    }
  }

  //設定座號
  setSeatNo(item: CounselStudent) {
    this.selectSeatNoValue = item.SeatNo;
    // this.caseStudent = new CaseStudent();
    this.caseStudent.Name = item.StudentName;
    this.caseStudent.PhotoUrl = item.PhotoUrl;
    this.caseStudent.SeatNo = item.SeatNo;
    this.caseStudent.Gender = item.Gender;
    this.caseStudent.StudentID = item.StudentID;
    this.caseStudent.StudentIdentity = item.Status;
    this.counselStudentService.counselClass.forEach(clas => {
      if (clas.ClassName === item.ClassName) {
        this.caseStudent.TeacherName = clas.HRTeacherName;
      }
    });
  }

  // 設定是否結案
  setIsClose(value: string) {
    this.caseStudent.IsClosed = value;

    if (value === "t") {
      // 設定結案日期
      this.caseStudent.setCloseDateNow();
    } else {
      // 清除結案日期
      this.caseStudent.CloseDate = "";
    }
    this.caseStudent.checkValue();
  }

  // 來至轉介建立個案功能
  setCaseFromReferral(refData: ReferralStudent) {
    this.caseStudent = new CaseStudent();
    this.caseStudent.ClassName = refData.ClassName;
    this.caseStudent.Name = refData.Name;
    this.caseStudent.SeatNo = refData.SeatNo;
    this.caseStudent.Gender = refData.Gender;
    this.caseStudent.StudentID = refData.StudentID;
    this.caseStudent.TeacherName = refData.TeacherName;
    this.caseStudent.RefCounselInterviewID = refData.UID;
    this.caseStudent.PhotoUrl = refData.PhotoUrl;
    // 使用預設問題樣板
    this.caseStudent.useQuestionOptionTemplate();
    this.selectClassNameValue = this.caseStudent.ClassName;
    this.selectSeatNoValue = this.caseStudent.SeatNo;
    this.caseStudent.setIsCloseNo();
    this.isAddMode = false;
    this.editModeString = "新增";
    this.isCanSetClass = false;
    // 個案輔導預設初級
    this.caseStudent.isCaseLevel1Checked = true;
    this.caseStudent.CaseLevel = '初級';
    this.setCaseSource('導師轉介');
  }

  checkChange(qq, item: CaseStudent) {
    // console.log(qq);

    if (qq.value == "") {
      item.isProbleDescriptionHasValue = false;
    } else {
      item.isProbleDescriptionHasValue = true;
    }
    item.checkValue();
  }

  // 檢查個案資料是否重複
  async checkCaseNoPass() {
    let value = true;

    let req = {
      CaseNo: this.caseStudent.CaseNo
    };

    let resp = await this.dsaService.send("CheckCaseNo", {
      Request: req
    });

    [].concat(resp.CaseNo || []).forEach(Rec => {
      let caseNo = this.caseStudent.CaseNo.toUpperCase();

      // 檢查是否有 uid，
      if (this.caseStudent.UID) {
        // 更新資料 ，當 case no 相同，uid 不同表示有重複
        if (this.caseStudent.UID !== Rec.UID) {
          value = false;
        }
      } else {
        value = false;
      }
    });

    return value;
  }

  async save() {
    let chk = await this.checkCaseNoPass();

    if (!chk) {
      alert("個案編號重複。");
      return;
    }

    this.caseStudent.CaseSource = this.selectCaseSourceValue;
    // 新增
    if (!this.caseStudent.UID) {
      try {
        // 新增個案
        await this.AddCase(this.caseStudent);
        $("#newCase").modal("hide");
      } catch (error) {
        alert(error);
      }
    } else {
      // 更新
      try {
        // 新增個案
        await this.UpdateCase(this.caseStudent);
        $("#newCase").modal("hide");
      } catch (error) {
        alert(error);
      }
    }
  }


  // 設定輔導老師
  SetSelectCaseTeacher(item: CounselTeacher, itemOrder: number) {
    let selectItem: SelectCaseTeacher = new SelectCaseTeacher();
    selectItem.Order = itemOrder + 1;
    selectItem.CounselTeacher = item;
    if (this.caseStudent.selectCaseTeacers.length > 0) {
      let hasValue: boolean = false;

      this.caseStudent.selectCaseTeacers.forEach(item => {
        if (item.CounselTeacher.TeacherID === selectItem.CounselTeacher.TeacherID) {
          hasValue = true;
        }
      });

      if (hasValue) {
        // 如果只有一筆，不變，如果有1筆以上，將自己移除
        if (this.caseStudent.selectCaseTeacers.length > 1) {
          this.caseStudent.selectCaseTeacers = this.caseStudent.selectCaseTeacers.filter(x => x.CounselTeacher.TeacherID !== selectItem.CounselTeacher.TeacherID);
        }
      } else {
        this.caseStudent.selectCaseTeacers.push(selectItem);
      }

    } else {
      selectItem.Order = 1;
      this.caseStudent.selectCaseTeacers.push(selectItem);
    }

    this.caseStudent.selectCaseTeacers.sort(x => x.Order);

  }



  // 取得預設資料
  async GetDefault() {
  
    // 取得個案可以使用教師
    this.CounselTeacherList = [];
    let dataList: CounselTeacher[] = [];
    let counselTeacher = await this.dsaService.send("GetCounselTeacherRole", {});
    [].concat(counselTeacher.CounselTeacher || []).forEach(tea => {
      let data: CounselTeacher = new CounselTeacher();
      data.TeacherID = tea.TeacherID;
      data.TeacherName = tea.TeacherName;
      data.Role = tea.Role;
      dataList.push(data);
    });
    this.CounselTeacherList = dataList;

    // 加入自己當預設
    dataList.forEach(item => {
      if (this.counselStudentService.teacherInfo.ID === item.TeacherID) {
        this.SetSelectCaseTeacher(item, 1);
      }
    });


    // 取得輔導班級
    this.canSelectClassList = [];
    this.counselStudentService.counselClass.forEach(data => {
      if (data.Role.indexOf("輔導老師") > -1) {
        this.canSelectClassList.push(data);
      }
    });
  }

  parseCaseOptions(data: QOption[]) {
    for (let da of data) {
      if (da.answer_martix.length > 0) {
        da.answer_value = da.answer_martix.join("");
      } else {
        da.answer_value = da.answer_text;
      }
    }
    return data;
  }

  // 新增個案
  async AddCase(data: CaseStudent) {

    // 開發中先填入預設
    if (!data.StudentIdentity) {
      data.StudentIdentity = "一般生";
    }
    data.PossibleSpecialCategory = "";
    data.SpecialLevel = "";
    data.SpecialCategory = "";
    data.HasDisabledBook = "false";

    data.deviant_behavior = this.parseCaseOptions(data.deviant_behavior);
    data.problem_category = this.parseCaseOptions(data.problem_category);
    data.proble_description = this.parseCaseOptions(data.proble_description);
    data.special_situation = this.parseCaseOptions(data.special_situation);
    data.evaluation_result = this.parseCaseOptions(data.evaluation_result);
    data.DeviantBehavior = JSON.stringify(data.deviant_behavior);
    data.ProblemCategory = JSON.stringify(data.problem_category);
    data.ProbleDescription = JSON.stringify(data.proble_description);
    data.SpecialSituation = JSON.stringify(data.special_situation);
    data.EvaluationResult = JSON.stringify(data.evaluation_result);
    data.CloseDescription = "";

    // 當沒有輔導 uid 寫入 null
    if (!data.RefCounselInterviewID) {
      data.RefCounselInterviewID = "null";
    }

    if (!data.CloseDate) {
      data.CloseDate = "";
    } else {
      data.CloseDate = data.CloseDate.replace("/", "-").replace("/", "-");
    }

    let reqCaseTeacher = [];
    this.caseStudent.selectCaseTeacers.forEach(it => {
      let itItm = {
        TeacherID: it.CounselTeacher.TeacherID,
        Role: it.CounselTeacher.Role
      }
      reqCaseTeacher.push(itItm);
    });


    let req = {

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
      RefCounselInterviewID: data.RefCounselInterviewID,
      IsClosed: data.IsClosed,
      CloseDate: data.CloseDate,
      CaseLevel: data.CaseLevel,
      CaseTeacher: reqCaseTeacher
    };
    //    console.log(req);

    let resp = await this.dsaService.send("AddCase", {
      Request: req
    });
    console.log(resp);

  }

  // 更新個案
  async UpdateCase(data: CaseStudent) {
    if (!data.IsClosed) {
      data.IsClosed = "f";
    }
    data.DeviantBehavior = JSON.stringify(data.deviant_behavior);
    data.ProblemCategory = JSON.stringify(data.problem_category);
    data.ProbleDescription = JSON.stringify(data.proble_description);
    data.SpecialSituation = JSON.stringify(data.special_situation);
    data.EvaluationResult = JSON.stringify(data.evaluation_result);
    data.CloseDate = data.CloseDate.replace("/", "-").replace("/", "-");

    let reqCaseTeacher = [];
    this.caseStudent.selectCaseTeacers.forEach(it => {
      let itItm = {
        TeacherID: it.CounselTeacher.TeacherID,
        Role: it.CounselTeacher.Role
      }
      reqCaseTeacher.push(itItm);
    });


    if (data.UID) {


      let req = {
        CaseID: data.UID,

        OccurDate: data.OccurDate,
        CaseNo: data.CaseNo,
        StudentID: data.StudentID,
        CaseSource: data.CaseSource,

        IsClosed: data.IsClosed,
        CloseDate: data.CloseDate,
        CloseDescription: data.CloseDescription,
        DeviantBehavior: data.DeviantBehavior,
        ProblemCategory: data.ProblemCategory,
        ProbleDescription: data.ProbleDescription,
        SpecialSituation: data.SpecialSituation,
        EvaluationResult: data.EvaluationResult,
        CaseLevel: data.CaseLevel,
        CaseTeacher: reqCaseTeacher
      };

      console.log(req);

      let resp = await this.dsaService.send("UpdateCase", {
        Request: req
      });
      console.log(resp);
    }
  }
}

