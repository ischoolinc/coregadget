import { Component, OnInit, Optional, TemplateRef, ChangeDetectorRef, ViewChild } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router, ActivatedRoute } from '@angular/router';
import { DsaService } from '../dsa.service';
import { timeout } from 'rxjs/operators';
import { RoleService } from "../role.service";
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';
import { GenerateKeyAndSetTimeComponent } from './generate-key-and-set-time/generate-key-and-set-time.component';

@Component({
  selector: 'app-comprehensive',
  templateUrl: './comprehensive.component.html',
  styleUrls: ['./comprehensive.component.css']
})
export class ComprehensiveComponent implements OnInit {

  @ViewChild("GenerateKeyAndSetTime") GenerateKeyAndSetTime: GenerateKeyAndSetTimeComponent;

  public counselVisible: boolean = false;
  deny: boolean = false;
  isLoading: boolean = false;
  transferSuccess: Boolean = false;
  currentSemester: any;
  sectionList: any[];
  currentMode: string;
  currentSection: any;
  currentClass: any;
  plugin: TemplateRef<any>;
  generater: any = {};

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
    this.appComponent.currentComponent = "comprehensive";
    this.currentMode = "view";
    this.dsns = gadget.getApplication().accessPoint;
    this.counselVisible = false;
    if (gadget.params.system_counsel_position === 'referral' || gadget.params.system_counsel_position === 'counselor') {
      this.counselVisible = true;
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
      // if (this.sectionList.length)
      //   this.currentSection = this.sectionList[0];
      this.isLoading = false;
    }
    catch (err) {
      alert(err);
    }
  }

  async genSSNKey(fillInSectionID) {
    try {
      await this.dsaService.send("GenerateFillInKeySSN", { FillInSectionID: fillInSectionID });
      window.location.reload();
    }
    catch (err) {
      alert(err);
    }
  }

  async genGUIDKey(fillInSectionID) {
    try {
      await this.dsaService.send("GenerateFillInKeyGUID", { FillInSectionID: fillInSectionID });
      window.location.reload();
    }
    catch (err) {
      alert(err);
    }
  }

  async shoModal() {
    this.generater = {
      schoolYear: this.currentSemester.SchoolYear,
      semester: this.currentSemester.Semester,
      isLoading: false,
      isSaving: false,
      dsaService: this.dsaService,
      progress: 0,
      currentClass: "",
      gen: async function () {
        if (this.isSaving || this.isLoading) return;
        this.isSaving = true;
        this.progress = 0;
        this.currentClass = "";
        var classList = await this.dsaService.send("GetClass", {});
        classList = [].concat(classList.Class || []);
        var index = 0;
        for (const classRec of classList) {
          this.currentClass = classRec.ClassName;
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
          }
          catch (err) {
            console.log(err);
          }
          this.progress = Math.round((++index) * 100 / classList.length);
        }
        this.isSaving = false;
        $("#GenerateFillInData").modal('hide');
        // this.loadData();
        window.location.reload();
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
  async  transferSystemCoreColToAFrom() {
    this.isLoading = true;
  try {
  const resp = await this.dsaService.send("TranferAdminSystem.TranferAdminSysToAform", {
    SchoolYear: this.currentSemester.SchoolYear
    , Semester: this.currentSemester.Semester
  });
  console.log("resp",resp);
  this.isLoading = false ;
  this.transferSuccess = true;


  // $("#genSystemCoreColtoAFrom").modal('hide');
} catch (ex) {
  alert(`發生錯誤:${ex}`);
}
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
