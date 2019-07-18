import { Component, OnInit, Optional } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalService } from "../global.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  deny: boolean = false;
  isLoading: boolean = false;
  currentItem: string = "";
  isRoleEnable: boolean = false;
  isClassEnable: boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public globalService: GlobalService,
    @Optional()
    private appComponent: AppComponent
  ) {

  }

  async ngOnInit() {
    this.appComponent.currentComponent = "admin";
    this.isRoleEnable = false;
    this.isClassEnable = false;

    await this.appComponent.GetMyCounselTeacherRole();
    if (this.globalService.MyCounselTeacherRole === '輔導主任') {
      this.isRoleEnable = true;
      this.isClassEnable = true;
    }
    if (this.globalService.MyCounselTeacherRole === '輔導組長') {
      this.isClassEnable = true;
    }
  }

  routeTo(to) {
    //讓特效跑
    setTimeout(
      function () {
        this.router.navigate([].concat(to || []), {
          relativeTo: this.activatedRoute
        });
      }.bind(this),
      200
    );
  }
}
