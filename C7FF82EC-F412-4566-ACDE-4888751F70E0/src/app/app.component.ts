import { ChangeDetectorRef, Component, HostListener, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RoutesRecognized } from "@angular/router";
import { RoleService } from "./role.service";
import { GlobalService } from "./global.service";
import { DsaService } from "./dsa.service";
import { CommunicationService } from "./referral/service/communication.service";
import { Connection } from "./dsutil-ng/connection";
import { AccessPoint } from "./dsutil-ng/access_point";
import { PublicSecurityToken } from "./dsutil-ng/envelope";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})




export class AppComponent implements OnInit {


  @HostListener('window:scroll', ['$event']) onScrollEvent($event){
    console.log($event);
    console.log("scrolling");
    // alert(1234)
  } 

  public refferalNotDealCount: number | undefined;
  public counselStudentStr: string = "輔導學生";
  public comprehensiveStr: string = "綜合紀錄表"
  public counselVisable: boolean = false;
  public counsel_statisticsVisable: boolean = false;
  public referralVisable: boolean = false;
  public caseVisable: boolean = false;
  public comprehensiveVisable: boolean = false;
  public psychologicalTestVisable: boolean = false;
  public adminVisable: boolean = false;
  public transferStudentVisable: boolean = false;
  public hasNewTransfer = false;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    public roleService: RoleService,
    public globalService: GlobalService,
    private dsaService: DsaService,
    private deetect: ChangeDetectorRef,
    private communicationService: CommunicationService,
  ) {
    communicationService.changeEmitted$.subscribe(data => {
      console.log("  this.refferalNotDealCount ",data)
      this.refferalNotDealCount = data ;
      deetect.detectChanges();
    })
   }

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
    // 線上轉學(只有線上轉學 可使用)
    this.transferStudentVisable = false;
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
    if (gadget.params.system_counsel_position === 'referral') {
      this.getRefList();

    }
    //console.log(gadget.params.system_counsel_position);

    // 只有線上轉學
    if (gadget.params.trans_tag_name) {
      this.transferStudentVisable = true;
      this.checkHasNewTransfer();
    }
  }
  /** 取得轉借學生 */
  async getRefList() {
    try {
      let resp = await this.dsaService.send("GetReferralStudent", {
        Request: {}
      });
      const refferals = [].concat(resp.ReferralStudent || [])
      if (refferals.length > 0) {
        refferals.forEach(x => {
        })
        let refNotDeal = refferals.filter(x => {
          return x.ReferralStatus == "未處理"
        })
        this.refferalNotDealCount = refNotDeal.length
      }
    } catch (ex) {
      alert("取得轉借資料發生錯誤");
    }
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

    // alert(""+this.globalService.MyCounselTeacherRole)
    if (this.globalService.MyCounselTeacherRole != '' && this.globalService.MyCounselTeacherRole != '認輔老師' && this.globalService.MyCounselTeacherRole != '校外心理師'  ) {
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


  async getRadPointState() {
    const rsp = await this.dsaService.send('TransferStudent.GetRedPoint', {
      Code: ['轉入申請', '轉出核可']
    });
    return [].concat(rsp.RedPoint || []);
  }

  async checkHasNewTransfer() {
    const pointState = await this.getRadPointState();
    this.hasNewTransfer = !!(pointState.find(v => v.Enabled === 't'));
  }


  onScroll (){
   alert(" hey")

  }
}

