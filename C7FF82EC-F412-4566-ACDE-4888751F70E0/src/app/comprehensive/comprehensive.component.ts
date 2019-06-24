import { Component, OnInit, Optional, TemplateRef } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router, ActivatedRoute } from '@angular/router';
import { DsaService } from '../dsa.service';
import { timeout } from 'rxjs/operators';
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
      SchoolYear: null,
      Semester: null,
      isLoading: true,
      isSaving: false,
      dsaService: this.dsaService,
      gen: async function () {
        this.isSaving = true;
        await this.dsaService.send("GenerateFillInData", {
          SchoolYear: this.SchoolYear
          , Semester: this.Semester
        });
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
      this.generater.SchoolYear = sems.SchoolYear;
      this.generater.Semester = sems.Semester;
      this.generater.isLoading = false;
    });
  }
}
