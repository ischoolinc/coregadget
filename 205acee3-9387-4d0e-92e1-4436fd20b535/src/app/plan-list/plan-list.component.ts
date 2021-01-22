import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { PlanRec } from '../data';
import { Store, Select } from '@ngxs/store';
import { PlanModel } from '../state/plan.state';
import { SetCurPlan, SetCurPlanList } from '../state/plan.action';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NewPlanComponent } from './new-plan/new-plan.component';

@Component({
  selector: 'app-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.scss']
})
export class PlanListComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;
  yearFormCtrl = new FormControl();
  @Select((state: { plan: any; }) => state.plan)plan$: Observable<PlanModel> | undefined;
  plan: PlanModel = {} as PlanModel;
  unSubscribe$ = new Subject();
  curYear: string = '';

  constructor(
    private store: Store,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.plan$?.pipe(
      takeUntil(this.unSubscribe$)
    ).subscribe((v: PlanModel) => {
      this.plan = v;
      
      if (this.plan.yearList.length && !this.curYear) {
        this.setCurYear(this.plan.yearList[0]);
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

  yearChange(e: any) {
    this.setCurYear(e.value);
    this.router.navigate(['/']);
  }

  setCurYear(year: string) {
    this.curYear = year;
    this.store.dispatch(new SetCurPlanList(this.curYear));
  }

  newPlan() {
    this.dialog.open(NewPlanComponent, {
      width: '700px',
      disableClose: true
    });
  }

}
