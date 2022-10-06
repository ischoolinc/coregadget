import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-check-transfer-out-modal",
  templateUrl: "./check-transfer-out-modal.component.html",
  styleUrls: ["./check-transfer-out-modal.component.css"]
})
export class CheckTransferOutModalComponent implements OnInit {
  constructor(
    // private dsaService: DsaService,
    // private counselStudentService: CounselStudentService,
    // private roleService: RoleService

  ) { }

  isCancel: boolean = true;
  isAddMode: boolean = true;
  isCanSetClass: boolean = false;
  editModeString: string = "新增";

  /**所選班級 */
  selectClassNameValue: string;
  /**所選座號 */
  selectSeatNoValue: string;
  /**所選學生姓名 */
  selectStudentName: string;

  ngOnInit() {
  }

  // async loadData() {

  //   this.CounselTeacherList = [];
  //   this.selectClassNameValue = "請選擇班級";
  //   this.selectSeatNoValue = "請選擇座號";
  //   this.selectCaseTeachersValue = "請選擇認輔老師";
  //   this.selectCaseSourceValue = "請選擇個案來源";
  //   this.canSelectCaseSourceList = [];

  //   if (!this.caseStudent) this.caseStudent = new CaseStudent();

  //   // 檢查狀態
  //   if (this.isAddMode) {
  //     if (!this.caseStudent.RefCounselInterviewID) {
  //       this.isCanSetClass = true;
  //       // this.caseStudent.useQuestionOptionTemplate();
  //     } else {
  //       this.isCanSetClass = false;
  //     }
  //   } else {
  //   }
  // }


  // /** 選擇年級 */
  // selectGrade(grade: string) {
  //   this.selectGradeValue = grade;
  //   this.selectClassNameValue = "請選擇班級";
  //   this.selectSeatNoValue = "請選擇座號";
  //   this.canSelectClassList = this.canSelectClassByMap.get(grade);
  // }

  // /** 選擇班級名稱 */
  // setClassName(item: CounselClass) {
  //   $("#newCase").modal("handleUpdate");
  //   this.selectClassNameValue = item.ClassName;
  //   // 請除可選學生號碼
  //   this.canSelectNoList = [];

  //   this.selectSeatNoValue = "請選擇座號";

  //   if (this.counselStudentService.classMap.has(item.ClassID)) {
  //     this.canSelectNoList = this.counselStudentService.classMap.get(
  //       item.ClassID
  //     ).Student;
  //   }
  // }

  // cancel() {
  //   this.isCancel = true;
  //   $("#newCase").modal("hide");
  // }

  selectGrade(a) {}
  setClassName(a) {}
  setSeatNo(a) {}

  cancel() {
    $("#newCase").modal("hide");
  }
}

