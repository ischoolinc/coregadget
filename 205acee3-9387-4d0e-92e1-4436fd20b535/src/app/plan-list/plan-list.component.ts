import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { PlanRec } from '../data';
import { Store, Select } from '@ngxs/store';
import { PlanModel } from '../state/plan.state';
import { SetCurPlan, SetCurSchoolYear } from '../state/plan.action';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.scss']
})
export class PlanListComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;
  yearFormCtrl = new FormControl();
  @Select((state: { plan: any; }) => state.plan)plan$: Observable<PlanModel> | undefined;
  @Select((state: { plan: any; }) => state.plan.curSchoolYear)curSchoolYear$: Observable<string> | undefined;
  plan: PlanModel = {} as PlanModel;
  planList: PlanRec[] = [];
  unSubscribe$ = new Subject();

  constructor(
    private store: Store,
    private router: Router
  ) { }

  ngOnInit() {
    this.plan$?.pipe(
      takeUntil(this.unSubscribe$)
    ).subscribe((v: PlanModel) => {
      this.plan = v;
      if (this.plan.yearList.length && !this.plan.curSchoolYear) {
        this.yearFormCtrl.setValue(this.plan.yearList[0]);
      }
    });

    this.yearFormCtrl.valueChanges.pipe(
      takeUntil(this.unSubscribe$)
    ).subscribe(v => {
      this.store.dispatch(new SetCurSchoolYear(v));
    });

    this.curSchoolYear$?.pipe(
      takeUntil(this.unSubscribe$)
    ).subscribe(v => {
      if (v) {
        this.planList = this.plan.planList.filter(plan => plan.school_year === v);
      }
    });
    
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }

  setCurPlan(plan: PlanRec) {
    this.store.dispatch(new SetCurPlan(plan)).pipe(
      take(1)
    ).subscribe(() => {
      this.router.navigate(['/plan', plan.id])
    });
  }

}
