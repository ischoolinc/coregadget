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
 
  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    public roleService: RoleService,
    public globalService: GlobalService,
    private dsaService: DsaService
  ) { }

  async ngOnInit() {   

    await this.GetMyCounselTeacherRole();
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

    if (this.globalService.MyCounselTeacherRole != '' && this.globalService.MyCounselTeacherRole != '認輔老師')
    {   
      this.globalService.enableCase = true;
    }else
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
