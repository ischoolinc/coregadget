import { Component, OnInit, Optional, TemplateRef } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router, ActivatedRoute } from '@angular/router';
import { DsaService } from '../dsa.service';
import { timeout } from 'rxjs/operators';
import { RoleService } from "../role.service";
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';

@Component({
  selector: 'app-comprehensive',
  templateUrl: './comprehensive.component.html',
  styleUrls: ['./comprehensive.component.css']
})
export class ComprehensiveComponent implements OnInit {

  deny: boolean = false;
  isLoading: boolean = false;
  currentSemester: any;
  semeserList: any[];
  plugin: TemplateRef<any>;
  generater: any = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dsaService: DsaService,
    public roleService: RoleService,
    @Optional()
    private appComponent: AppComponent
  ) {

  }

  ngOnInit() {
    this.appComponent.currentComponent = "comprehensive";
    this.semeserList = [{ SchoolYear: "107", Semester: "2" }, { SchoolYear: "107", Semester: "1" }];
  }

  async shoModal() {
    this.generater = {
      schoolYear: null,
      semester: null,
      isLoading: true,
      isSaving: false,
      dsaService: this.dsaService,
      progress: 0,
      currentClass: "",
      gen: async function () {
        if (this.isSaving || this.isLoading) return;
        this.isSaving = true;
        this.progress = 0;
        this.currentClass = "";
        var classList = await this.dsaService.send("GetClass", {});
        classList = [].concat(classList.Class || []);
        var index = 0;
        for (const classRec of classList) {
          this.currentClass = classRec.ClassName;
          console.log("GenerateFillInData" + JSON.stringify({
            SchoolYear: this.schoolYear
            , Semester: this.semester
            , ClassID: classRec.ClassID
          }));
          try {
            await this.dsaService.send("GenerateFillInData", {
              SchoolYear: this.schoolYear
              , Semester: this.semester
              , ClassID: classRec.ClassID
            });
          }
          catch (err) {
            console.log(err);
          }
          this.progress = Math.round((++index) * 100 / classList.length);
        }
        this.isSaving = false;
      }
    };

    $("#GenerateFillInData").modal({
      show: true,
      focus: true,
      keyboard: false,
      backdrop: 'static'
    });

    let currentSemeRsp = await this.dsaService.send("GetCurrentSemester", {});
    [].concat(currentSemeRsp.CurrentSemester || []).forEach(sems => {
      this.generater.schoolYear = sems.SchoolYear;
      this.generater.semester = sems.Semester;
      this.generater.isLoading = false;
    });
  }
}
