import { Component, OnInit } from '@angular/core';
import { GadgetService, Contract } from 'src/app/gadget.service';
import { Utils } from 'src/app/util';
import { DSAService, RollCallRecord, SuggestRecord } from './../service/dsa.service';
import { ConfigService } from './../service/config.service';
import { AlertService } from './../service/alert.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PeriodChooserComponent } from './../modal/period-chooser.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styles: []
})
export class MainComponent implements OnInit {

  today: string; // 今日。

  suggests: SuggestRecord[]; // 今加建議點名。

  courses: RollCallRecord[]; //課程清單。


  loading: boolean = false;
  constructor(private dsa: DSAService,
    private alert: AlertService,
    private dialog: MatDialog,
    private router: Router,
    private config: ConfigService) { }
  contract: Contract;
  async ngOnInit() {

    try {
      await this.config.ready;

      this.today = this.dsa.getToday();

      this.courses = await this.dsa.getCCItems();

      this.suggests = await this.dsa.getSuggestRollCall(this.dsa.getToday());

    } catch (error) {
      this.alert.json(error);
    } finally {

    }
  }


  async openPicker(course: RollCallRecord) {

    this.dialog.open(PeriodChooserComponent, {
      data: { course: course },
    });
  }

  async openSuggest(suggest: SuggestRecord) {

    // await this.alert.json(suggest)
    //   .afterClosed()
    //   .toPromise();

    this.router.navigate(['../pick', 'Course', suggest.CourseID, suggest.Period], {
      queryParams: { DisplayName: suggest.CourseName }
    });
  }

}