import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlanService } from '../core/plan.service';
import { PlanRec } from '../data';

@Component({
  selector: 'app-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.scss']
})
export class PlanListComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;
  yearDropdown = new FormControl(null);
  years: string[] = [];
  planList: PlanRec[] = [];
  unSubscribe$ = new Subject();

  constructor(
    private planSrv: PlanService
  ) { }

  ngOnInit() {
    this.getYears();
    this.yearDropdown.valueChanges.pipe(
      takeUntil(this.unSubscribe$)
    ).subscribe(v => {
      this.getPlans();
    });
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }

  async getYears() {
    this.isLoading = true;
    const rsp = await this.planSrv.getSchoolYear();
    this.years = [].concat(rsp.plan || []).map((data: any) => data.school_year);
    this.yearDropdown.setValue(this.years[0]);
    this.isLoading = false;
  }

  async getPlans() {
    this.isLoading = true;
    const rsp = await this.planSrv.getPlans(this.yearDropdown.value);
    this.planList = [].concat(rsp.plan || []);
    this.isLoading = false;
  }

}
