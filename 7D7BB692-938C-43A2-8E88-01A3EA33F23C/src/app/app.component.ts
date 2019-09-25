import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RoutesRecognized } from "@angular/router";
import { FillSection } from "./section-vo";
import { DsaService } from "./dsa.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  fillSectionList: FillSection[] = [];
  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private dsaService: DsaService
  ) { }

  async ngOnInit() {

    await this.GetFillSections();
  }

  async GetFillSections() {
    try {

      let StudentRsp = await this.dsaService.send("GetFillSectionKeyID", {});
      [].concat(StudentRsp.Section || []).forEach(Section => {
        let sec: FillSection = new FillSection();
        sec.SectionID = Section.SectionID;
        sec.SchoolYear = Section.SchoolYear;
        sec.Semester = Section.Semester;
        sec.SectionName = Section.SectionName;
        sec.KeyID = Section.KeyID;
        sec.StartTime = Section.StartTime;
        sec.EndTime = Section.EndTime;
        sec.IsPassTime = Section.IsPassTime;
        sec.keyButtonDisable = true;

        if (sec.IsPassTime === 't' && sec.KeyID.length > 0)
          sec.keyButtonDisable = false;

        this.fillSectionList.push(sec);
      });
    } catch (err) {
      alert("取得FillSections失敗(GetFillSections):" + err.dsaError.message);
    }
  }


  async RunCounselReportAUrl(KeyID: string) {

    let dsns = gadget.getApplication().accessPoint;

    if (dsns && KeyID) {
      let url = `https://web2.ischool.com.tw/deployment/C7FF82EC-F412-4566-ACDE-4888751F70E0/content.htm#/(simple-page:simple-page/${dsns}/comprehensive_fill/${KeyID})`;
      window.open(url, '_balnk');
    } else {
      alert("開啟失敗，無法解析代碼。");
    }
    // 自己 _self
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
