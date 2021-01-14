import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlanRec } from '../data';
import { PlanModel } from '../state/plan.state';
import { Jsonx } from '@1campus/jsonx';
import { SubjectRec } from '../data';


@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit, OnDestroy {

  @Select((state: { plan: any; }) => state.plan)plan$: Observable<PlanModel> | undefined;
  curPlan: PlanRec = {} as PlanRec;
  displayedColumns: string[] = ['Domain', 'Entry', 'SubjectName', 'Level', 'Code', 'action'];
  subjectList: SubjectRec[] = [];
  unSubscribe$ = new Subject();
  showEditeBtn: boolean = false;
  showEditTitle: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.plan$?.pipe(
      takeUntil(this.unSubscribe$)
    ).subscribe(v => {
      this.curPlan = v.curPlan;
      this.graduationPlanParse(this.curPlan.content)
    });
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }

  graduationPlanParse(xml: string) {
    const jx = Jsonx.parse(xml);
    this.subjectList = jx.child('GraduationPlan').children('Subject').data.map((sb: any) => {
      return {
        ...sb['_attributes'],
        Code: sb['_attributes'].課程代碼
      };
    });
  }



}
