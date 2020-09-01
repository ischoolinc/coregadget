import { CounselTeacher } from './../case/case-student';
import { Component, OnInit, Optional, TemplateRef, ChangeDetectorRef, ViewChild } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router, ActivatedRoute } from '@angular/router';
import { DsaService } from '../dsa.service';
import { timeout } from 'rxjs/operators';
import { RoleService } from "../role.service";
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';
import { GenerateKeyAndSetTimeComponent } from './generate-key-and-set-time/generate-key-and-set-time.component';
import { SemesterInfo } from './../counsel-student.service';

@Component({
  selector: 'app-comprehensive',
  templateUrl: './comprehensive.component.html',
  styleUrls: ['./comprehensive.component.css']
})
export class ComprehensiveComponent implements OnInit {

  @ViewChild("GenerateKeyAndSetTime") GenerateKeyAndSetTime: GenerateKeyAndSetTimeComponent;

  public counselVisible: Boolean = false;
  deny: Boolean = false;
  isLoading: Boolean = false;
  transferSuccess: Boolean = false;
  currentSemester: any;
  sectionList: any[];
  currentMode: string;
  currentSection: any;
  currentClass: any;
  plugin: TemplateRef<any>;
  generater: any = {};
  SchoolYearSemesterList: SemesterInfo[];
  GradeYearWrongsList: any[];

  IsBringbring: Boolean = false;
  IsBringChecked: Boolean = false;
  ShowBringPreviousSection: Boolean = false; // 看看要不要顯示 轉入前學年度學期的資料

  public comprehensiveStr: String = "產生綜合紀錄表";
  public comprehensiveStr1: String = "綜合紀錄表資料";
  dsns: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dsaService: DsaService,
    public roleService: RoleService,
    public changeDetectorRef: ChangeDetectorRef,
    @Optional()
    private appComponent: AppComponent
  ) {

  }

  ngOnInit() {
    // 預設
    this.comprehensiveStr = "產生綜合紀錄表";
    this.comprehensiveStr1 = "綜合紀錄表資料";
    this.appComponent.currentComponent = "comprehensive";
    this.currentMode = "view";
    this.dsns = gadget.getApplication().accessPoint;
    this.counselVisible = false;
    if (gadget.params.system_counsel_position === 'referral' || gadget.params.system_counsel_position === 'counselor') {
      this.counselVisible = true;
    }

    if (gadget.params.system_counsel_position === 'freshman') {
      // 新生特有
      this.comprehensiveStr = "產生填報資料";
      this.comprehensiveStr1 = "填報資料";
    }
    this.loadData();
  }

  async loadData() {
    try {

      this.isLoading = true;
      this.currentSemester = (await this.dsaService.send("GetCurrentSemester", {})).CurrentSemester;
      this.sectionList = [].concat((await this.dsaService.send("GetFillInSectionClass", this.currentSemester)).Section || []);
      this.sectionList.forEach(sectionRec => {
        sectionRec.Subject = [].concat(sectionRec.Subject || []);
        sectionRec.Class = [].concat(sectionRec.Class || []);
        sectionRec.Class.forEach(classRec => {
        classRec.Subject = [].concat(classRec.Subject || []);
        });
      });
      this.isLoading = false;
    } catch (err) {
      alert(err);
    }
  }

  async genSSNKey(fillInSectionID) {
    try {
      await this.dsaService.send("GenerateFillInKeySSN", { FillInSectionID: fillInSectionID });
      window.location.reload();
    }  catch (err) {
      alert(err);
    }
  }

  async genGUIDKey(fillInSectionID) {
    try {
      await this.dsaService.send("GenerateFillInKeyGUID", { FillInSectionID: fillInSectionID });
      window.location.reload();
    } catch (err) {
      alert(err);
    }
  }

  /**
  * 顯使跳出視窗
  */
  async shoModal() {

    try {
      this.SchoolYearSemesterList = [];
      const SchoolYearSemesters = await this.dsaService.send("ComprehensiveRecordForm.GetComprehensiveRecordSchoolSemester");
      this.SchoolYearSemesterList = [].concat(SchoolYearSemesters.SemesterInfo || []);

      if (this.SchoolYearSemesterList.length > 0) {
        this.SchoolYearSemesterList = this.SchoolYearSemesterList.filter(item => { // 去除掉當學期
          return !(item.SchoolYear === this.currentSemester.SchoolYear && item.Semester === this.currentSemester.Semester);
        });

      }
      if (this.SchoolYearSemesterList.length !== 0) { // 如果本學期以前個學年度學期科目  如果不等於 0
        this.ShowBringPreviousSection = true; // 此區塊才顯示

      }
    } catch (err) {
      alert("發生錯誤" + err);
    }
    this.generater = {
      isBringPreviousAnsCheck: this.IsBringChecked,
      selectSemesterInfo: null,
      schoolYear: this.currentSemester.SchoolYear,
      semester: this.currentSemester.Semester,
      isLoading: false,
      isSaving: false,
      isBringPrevious: false,
      dsaService: this.dsaService,
      progress: 0,
      currentClass: "",
      /**
       * 按下「產生」
       */
      gen: async function () {
        // 檢查有沒有選擇學年度學期
        if (this.isBringPreviousAnsCheck) {
          if (!this.selectSemesterInfo) {
            alert("請選擇學年度學期!");
            return;
          }
        }
        if (this.isSaving || this.isLoading) { return; }
        this.isSaving = true;
        this.progress = 0;
        this.currentClass = "";
        let classList = await this.dsaService.send("GetClass", {});
        classList = [].concat(classList.Class || []);
        let index = 0;
        for (const classRec of classList) {

          if (!parseInt(classRec.GradeYear, 10) || parseInt(classRec.GradeYear, 10 ) > 6 ) { // 因為恩正設計 是 1-6年級 所以年級有誤時 會提醒使用者並不展開
            alert(classRec.ClassName + " 年級有誤! 無法產生題目。");
            continue;
          }
          this.currentClass = classRec.ClassName + " 題目展開中 ...";
          console.log("GenerateFillInData" + JSON.stringify({
            SchoolYear: this.schoolYear
            , Semester: this.semester
            , ClassID: classRec.ClassID
          }));
          try {
            await this.dsaService.send("GenerateFillInData", {
              SchoolYear: this.schoolYear
              , Semester: this.semester
              , ClassID: classRec.ClassID
            });
          } catch (err) {
            console.log(err);
          }
          this.progress = Math.round((++index) * 100 / classList.length);
        }
        this.isSaving = false;
        this.progress = 0;
        this.isBringPrevious = true;

        // 帶入之前學期
        if (this.isBringPreviousAnsCheck){// 如果有勾選帶入前學年度學習
          let index2 = 0;
          for (const classRec of classList) {
            this.currentClass = classRec.ClassName + "    " + this.selectSemesterInfo.SchoolYear + "學年度" + this.selectSemesterInfo.Semester + "學期" + " 答案轉入中 ...";
            try {
              const resp = await this.dsaService.send("ComprehensiveRecordForm.UpdateAnswerByPreviousSemester", {
                CurrentSchoolYear: this.schoolYear
                , CurrentSemester: this.semester
                , SourceSchoolYear: this.selectSemesterInfo.SchoolYear
                , SourceSemester: this.selectSemesterInfo.Semester
                , ClassID: classRec.ClassID
              });
            } catch (err) {
              alert("發生錯誤:" + err.dsaError.message);
              console.log("error", err);
            }
            this.progress = Math.round((++index2) * 100 / classList.length);
          }
          this.isBringPrevious = false;
        }
        $("#GenerateFillInData").modal('hide');
        window.location.reload();
      },

      /**
       * 當勾選帶入先前學年度學期資料時 select 的disable 跟著變動
       */
      clearSemester : function() {
        if (!this.isBringPreviousAnsCheck) {
          this.selectSemesterInfo = null ;
        }
      }
    };

    $("#GenerateFillInData").modal({
      show: true,
      focus: true,
      keyboard: false,
      backdrop: 'static'
    });
  }

  /**
   * Modal彈出(轉入系統核心欄位)
   */
  async showSystemAsyncModal() {

    $("#genSystemCoreColtoAFrom").modal({
      show: true,
      focus: true,
      keyboard: false,
      backdrop: 'static'
    });
  }

  /**
   * 轉入系統核心欄位
   */
  async transferSystemCoreColToAFrom() {
    this.isLoading = true;
    try {
      const resp = await this.dsaService.send("TranferAdminSystem.TranferAdminSysToAform", {
        SchoolYear: this.currentSemester.SchoolYear
        , Semester: this.currentSemester.Semester
      });
      this.isLoading = false;
      this.transferSuccess = true;


      // $("#genSystemCoreColtoAFrom").modal('hide');
    } catch (ex) {
      alert(`發生錯誤:${ex}`);
    }
  }

  updateCurrentonObject(even, index) {
  }


  // 顯示設定代碼與設定開放時間
  async showGenerateKeyAndSetTime() {
    // this.GenerateKeyAndSetTime.selectFillInSection = null;
    // this.GenerateKeyAndSetTime.selectSchoolYear = "";
    // this.GenerateKeyAndSetTime.selectSemester = "";
    await this.GenerateKeyAndSetTime.loadData();
    $("#GenerateKeyAndSetTime").modal("show");
    // 關閉畫面
    $("#GenerateKeyAndSetTime").on("hide.bs.modal", () => {
      // 重整資料
      //     this.loadData();
      $("#GenerateKeyAndSetTime").off("hide.bs.modal");

    });
  }
}
