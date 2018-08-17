import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { WeeklyReportEntry } from './weeklyReportEntry';
import { WeeklyDataService } from '../weekly-data.service';
import { GadgetService, Contract } from 'src/app/gadget.service';
import { Utils } from 'src/app/util';

@Component({
  selector: 'app-add-s2',
  templateUrl: './add-s2.component.html',
  styles: []
})
export class AddS2Component implements OnInit {
  head: string;
  accessPoint: string;
  loading: boolean;
  error: any;
  modeString: string = "Add";

  studentWeeklyDataS2List: any;
  weeklyReportS2: WeeklyReportEntry;
  constructor(private route: ActivatedRoute, private gadget: GadgetService, private weeklyData: WeeklyDataService, private router: Router) { }
  contract: Contract;

  async ngOnInit() {
    this.weeklyReportS2 = new WeeklyReportEntry();
    this.contract = await this.gadget.getContract('kcis');
    if (this.weeklyData.selectWeeklyReportUID === '') {
      this.modeString = "Add";
    } else {
      this.modeString = "Edit";
    }
    this.getData();
  }

  async getData() {
    this.weeklyReportS2 = this.weeklyData.addWeeklyReportEntry;
    // console.log(this.weeklyReportS2);
    this.studentWeeklyDataS2List = this.weeklyData.studentWeeklyDataList;


  }

  async save() {
    //  console.log(this.studentWeeklyDataS2List);

    // 整理勾選資料
    for (const stud of this.studentWeeklyDataS2List) {
      // 整理 BehaviorList
      stud.BehaviorList = stud.BehaviorList.filter(v => v.checked === true);
    }

    // 回寫到暫存區
    this.weeklyData.studentWeeklyDataList = this.studentWeeklyDataS2List;

    // this.router.navigate(['../../../add-s3']);
    this.router.navigate(['../add-s3'], {
      relativeTo: this.route
    });
  }
}
