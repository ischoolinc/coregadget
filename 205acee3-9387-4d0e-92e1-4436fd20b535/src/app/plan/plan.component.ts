import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlanRec } from '../data';
import { PlanModel } from '../state/plan.state';
import { SetPlanName } from '../state/plan.action';
import { Jsonx } from '@1campus/jsonx';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-plan',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit, OnDestroy {

  @Select((state: { plan: any; }) => state.plan)plan$: Observable<PlanModel> | undefined;
  curPlan: PlanRec = {} as PlanRec;
  curPlanList: PlanRec[] = [];
  displayedColumns: string[] = [
    'Domain', 'Entry', 'SubjectName', 'RequiredBy', 'Required', 'StartLevel',
    'LastSemester1', 'NextSemester1', 'LastSemester2', 'NextSemester2', 'LastSemester3', 'NextSemester3', 'LastSemester4', 'NextSemester4',
    'SubjectCode', 'action'
  ];
  
  unSubscribe$ = new Subject();
  showEditeBtn: boolean = false;
  showEditTitle: boolean = false;
  planNameControl = new FormControl(null);
  jx: Jsonx = {} as Jsonx;

  constructor(
    private store: Store,
  ) { }

  ngOnInit(): void {
    this.plan$?.pipe(
      takeUntil(this.unSubscribe$)
    ).subscribe(v => {
      if (v.curPlan) {
        this.curPlan = v.curPlan;
        this.curPlanList = v.curPlanList || [];
        this.planNameControl.setValue(this.curPlan.name);
      }
    });
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }

  planNameChange() {
    this.showEditTitle = false;
    this.store.dispatch(new SetPlanName(+this.curPlan.id, this.planNameControl.value));
  }
}
