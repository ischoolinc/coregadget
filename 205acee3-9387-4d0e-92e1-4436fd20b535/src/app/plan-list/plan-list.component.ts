import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlanRec } from '../data';
import { Store, Select } from '@ngxs/store';
import { PlanModel } from '../state/plan.state';

@Component({
  selector: 'app-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.scss']
})
export class PlanListComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;
  yearFormCtrl = new FormControl();
  @Select((state: { plan: any; }) => state.plan)plan$: Observable<any> | undefined;
  plan: PlanModel = {} as PlanModel;
  planList: PlanRec[] = [];
  unSubscribe$ = new Subject();

  constructor(
    private store: Store
  ) { }

  ngOnInit() {
    this.plan$?.pipe(
      takeUntil(this.unSubscribe$)
    ).subscribe((v: PlanModel) => {
      this.plan = v;
    });

    this.yearFormCtrl.valueChanges.pipe(
      takeUntil(this.unSubscribe$)
    ).subscribe(v => {
      this.planList = this.plan.planList.filter(plan => plan.school_year === v);
    });
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }

}
