import { Component, Optional, OnInit, ViewChild } from "@angular/core";
import { AppComponent } from "../app.component";
import { RoleService } from "../role.service";
import { ActivatedRoute, ParamMap, Router, RoutesRecognized } from "@angular/router";

@Component({
  selector: 'app-psychological-test',
  templateUrl: './psychological-test.component.html',
  styleUrls: ['./psychological-test.component.css']
})
export class PsychologicalTestComponent implements OnInit {


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public roleService: RoleService,
    @Optional()
    private appComponent: AppComponent
  ) {
    if (this.appComponent) this.appComponent.currentComponent = "psychological-test";
  }

  ngOnInit() {
    this.appComponent.currentComponent = "psychological-test";
 
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
