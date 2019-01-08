import { Component, OnInit, Optional, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RoutesRecognized } from '@angular/router';
import { RoleService } from "../role.service";
import { CounselStudentService, CounselClass } from "../counsel-student.service";
import { AppComponent } from "../app.component";
import { timeout } from 'q';

@Component({
  selector: 'app-counsel',
  templateUrl: './counsel.component.html',
  styleUrls: ['./counsel.component.css']
})
export class CounselComponent implements OnInit {
  private selectItem: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private roleService: RoleService,
    private counselStudentService: CounselStudentService,
    @Optional()
    private appComponent: AppComponent
  ) {
    if (this.appComponent) this.appComponent.currentComponent = "counsel";
  }

  ngOnInit() {
  }

  public setSelectItem(item: string) {
    setTimeout(() => {
      this.selectItem = item;
    });
  }
}
