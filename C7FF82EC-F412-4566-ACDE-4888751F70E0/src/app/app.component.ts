import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RoutesRecognized } from "@angular/router";
import { RoleService } from "./role.service";
import { GlobalService } from "./global.service";
import { DsaService } from "./dsa.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {


  public counselStudentStr: string = "輔導學生";
  public comprehensiveStr: string = "綜合紀錄表"
  public counselVisable: boolean = false;
  public counsel_statisticsVisable: boolean = false;
  public referralVisable: boolean = false;
  public caseVisable: boolean = false;
  public comprehensiveVisable: boolean = false;
  public psychologicalTestVisable: boolean = false;
  public adminVisable: boolean = false;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    public roleService: RoleService,
    public globalService: GlobalService,
    private dsaService: DsaService
  ) { }

  async ngOnInit() {

    // 預設功能畫面文字
    this.counselStudentStr = "輔導學生";
    this.comprehensiveStr = "綜合紀錄表";

    // 有限制才特別處理
    // 輔導學生(都可用)
    this.counselVisable = false;
    // 輔導統計（只有輔導、輔導轉介 可使用)
    this.counsel_statisticsVisable = false;
    // 轉介學生(只有輔導轉介 可使用)
    this.referralVisable = false;
    // 個案資料(只有輔導、輔導轉介 可使用)
    this.caseVisable = false;
    // 綜合紀錄表(都可用)
    this.comprehensiveVisable = false;
    // 心理測驗（只有輔導、輔導轉介 可使用)
    this.psychologicalTestVisable = false;
    // 系統管理(都可用)
    this.adminVisable = false;
    await this.GetMyCounselTeacherRole();

    if (gadget.params.system_counsel_position === 'referral' || gadget.params.system_counsel_position === 'counselor' || gadget.params.system_counsel_position === 'freshman') {
      this.counselVisable = true;
      this.comprehensiveVisable = true;
      this.adminVisable = true;
    }

    // 只有轉介、輔導
    if (gadget.params.system_counsel_position === 'referral' || gadget.params.system_counsel_position === 'counselor') {
      this.counsel_statisticsVisable = true;
      this.caseVisable = true;
      this.psychologicalTestVisable = true;
    }
    // 只有轉介
    if (gadget.params.system_counsel_position === 'referral') {
      this.referralVisable = true;
    }

    if (gadget.params.system_counsel_position === 'freshman') {
      // 新生特有文字
      this.counselStudentStr = "學生資料";
      this.comprehensiveStr = "填報資料"
    }

    //console.log(gadget.params.system_counsel_position);
  }

  async GetMyCounselTeacherRole() {
    this.globalService.MyCounselTeacherRole = '';
    //  this.globalService.enableCase = false;
    let resp = await this.dsaService.send("GetMyCounselTeacherRole", {
      Request: {}
    });

    [].concat(resp.CounselTeacherRole || []).forEach(TeacherRole => {
      this.globalService.MyCounselTeacherRole = TeacherRole.Role;
    });

    if (this.globalService.MyCounselTeacherRole != '' && this.globalService.MyCounselTeacherRole != '認輔老師') {
      this.globalService.enableCase = true;
    } else
      this.globalService.enableCase = false;
  }

  routeTo(to) {
    //讓特效跑
    setTimeout(() => {
      this.router.navigate([].concat(to || []), {
        relativeTo: this.activeRoute
      });
    }, 200);
  }

  private _CurrentComponent: string;
  public get currentComponent(): string {
    return this._CurrentComponent;
  }
  public set currentComponent(currentComponent: string) {
    setTimeout(() => {
      this._CurrentComponent = currentComponent;
    });
  }
}
