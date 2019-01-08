import { Component, OnInit, Optional, ViewChild } from '@angular/core';
import { RoleService } from "../role.service";
import { AppComponent } from "../app.component";

@Component({
  selector: 'app-case',
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.css']
})
export class CaseComponent implements OnInit {

  constructor(
    private roleService: RoleService,
    @Optional()
    private appComponent: AppComponent) {
    if (this.appComponent) this.appComponent.currentComponent = "case";
  }

  ngOnInit() {
  }

}
