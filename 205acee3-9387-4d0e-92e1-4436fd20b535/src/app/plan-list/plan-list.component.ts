import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Store, Select } from '@ngxs/store';
import { RemovePlan, SetCurPlan, SetCurPlanList } from '../state/plan.action';
import { PlanModel } from '../state/plan.state';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { PlanRec } from '../data';
import { NewPlanComponent } from './new-plan/new-plan.component';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.scss']
})
export class PlanListComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;
  yearFormCtrl = new FormControl();
  @Select((state: { plan: any; }) => state.plan)plan$: Observable<PlanModel> | undefined;
  @Select((state: { plan: { curPlanList: any; }; }) => state.plan.curPlanList)curPlanList$: Observable<PlanExRec[]> | undefined;
  yearList: string[] = [];
  planList: PlanExRec[] = [];
  unSubscribe$ = new Subject();
  curYear: string = '';

  constructor(
    private store: Store,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.plan$?.pipe(
      takeUntil(this.unSubscribe$)
    ).subscribe((v: PlanModel) => {
      this.yearList = v.yearList;
      
      if (this.yearList.length && !this.curYear) {
        this.setCurYear(this.yearList[0]);
      }
    });

    this.curPlanList$?.pipe(
      takeUntil(this.unSubscribe$)
    ).subscribe((v: PlanExRec[]) => {
      this.planList = v;
      this.planList = (this.planList || []).map(data => {
        return { ...data, showCloseBtn: false};
      });
    });
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }

  trackByFn(index: number, item: PlanRec) {
    return index;
  }

  setCurPlan(plan: PlanExRec) {
    const { showCloseBtn, ...planRec } = plan;
    this.store.dispatch(new SetCurPlan(planRec)).pipe(
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

  removePlan(plan: PlanRec) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '提醒',
        confirmContent: `確定刪除「${plan.name}」此課程規劃表？`,
        yesBtnText: '確定',
        noBtnText: '取消'
      }
    });

    dialogRef.afterClosed().pipe(
      take(1)
    ).subscribe(v => {
      if (v.result) {
        this.store.dispatch(new RemovePlan(+plan.id));
      }
    });
  }

}

interface PlanExRec extends PlanRec {
  showCloseBtn: boolean;
}
