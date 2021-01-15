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
  displayedColumns: string[] = ['Domain', 'Entry', 'SubjectName', 'RequiredBy', 'Required', 'Level', 'SubjectCode', 'action'];
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
    this.subjectList = [];
    const jx = Jsonx.parse(xml);
    jx.child('GraduationPlan').children('Subject').data.forEach((data: any) => {
      if (!this.subjectList.find((sbRec: SubjectRec) => 
        sbRec.Required === data['_attributes'].Required 
        && sbRec.RequiredBy === data['_attributes'].RequiredBy 
        && sbRec.SubjectName === data['_attributes'].SubjectName)) {
        this.subjectList.push(data['_attributes']);
      }
    });
   
  }

}
