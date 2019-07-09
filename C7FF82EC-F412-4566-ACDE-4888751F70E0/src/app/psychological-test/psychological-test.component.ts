import { Component, Optional, OnInit, ViewChild } from "@angular/core";
import { AppComponent } from "../app.component";
import { RoleService } from "../role.service";
import {ActivatedRoute,ParamMap,Router,RoutesRecognized} from "@angular/router";


@Component({
  selector: 'app-psychological-test',
  templateUrl: './psychological-test.component.html',
  styleUrls: ['./psychological-test.component.css']
})
export class PsychologicalTestComponent implements OnInit {

  deny: boolean = false;
  isLoading: boolean = false;

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
  }

  modalImport(){
    $("#psychological-import").modal('show');
  }
}
