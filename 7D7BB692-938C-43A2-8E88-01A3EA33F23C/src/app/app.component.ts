import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RoutesRecognized } from "@angular/router";

import { DsaService } from "./dsa.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
 
  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private dsaService: DsaService
  ) { }

  async ngOnInit() {   

    await this.RunCounselReportAUrl();
  }

  async RunCounselReportAUrl(){
   // 取得學生身分 
   let KeyID = '';
   await this.dsaService.getSessionIDAndAccessPoint();
   let StudentRsp = await this.dsaService.send("GetFillInTargetKeyID", {});
   [].concat(StudentRsp.Student || []).forEach(Student => {
     KeyID = Student.KeyID;
   
   });
   
   let dsns = gadget.getApplication().accessPoint;

   if (dsns && KeyID)   
   {
    let url = `https://web2.ischool.com.tw/deployment/C7FF82EC-F412-4566-ACDE-4888751F70E0/content.htm#/(simple-page:simple-page/${dsns}/comprehensive_fill/${KeyID})`;
    window.open(url,'_self'); 
   }else
   {
     alert("開啟失敗，無法解析代碼。");
   }
// 自己
  //  window.open(url,'_balnk'); // new tab
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
