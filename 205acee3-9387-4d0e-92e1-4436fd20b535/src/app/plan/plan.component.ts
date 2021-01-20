import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlanRec, SubjectExRec } from '../data';
import { PlanModel } from '../state/plan.state';
import { SetPlanName } from '../state/plan.action';
import { Jsonx } from '@1campus/jsonx';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-plan',
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
  subjectList: SubjectExRec[] = [];
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
        this.graduationPlanParse(this.curPlan.content);
      }
    });
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }

  graduationPlanParse(xml: string) {
    this.subjectList = [];
    this.jx = Jsonx.parse(xml);
    
    for (const sbJX of this.jx.child('GraduationPlan').children('Subject')) {
      const { _attributes: subject, Grouping: {_attributes: group} } = sbJX.data as any;

      if (!this.subjectList.find((sbRec: SubjectExRec) => 
        sbRec.Required === subject.Required 
        && sbRec.RequiredBy === subject.RequiredBy 
        && sbRec.SubjectName === subject.SubjectName)) {
        this.subjectList.push({
          StartLevel: group.startLevel,
          RowIndex: group.RowIndex,
          smsSubjectList: [],
          ...subject,
          edit: false
        });
      }

      const subRec = this.subjectList.find((sbRec: SubjectExRec) => sbRec.Required === subject.Required && sbRec.RequiredBy === subject.RequiredBy && sbRec.SubjectName === subject.SubjectName);
      if (subRec) {
        switch (`${subject.GradeYear}${subject.Semester}`) {
          case '11':
            subRec.LastSemester1 = subject.Credit;
            break;
          case '12':
            subRec.NextSemester1 = subject.Credit;
            break;
          case '21':
            subRec.LastSemester2 = subject.Credit;
            break;
          case '22':
            subRec.NextSemester2 = subject.Credit;
            break;
          case '31':
            subRec.LastSemester3 = subject.Credit;
            break;
          case '32':
            subRec.NextSemester3 = subject.Credit;
            break;
          case '41':
            subRec.LastSemester4 = subject.Credit;
            break;
          case '42':
            subRec.NextSemester4 = subject.Credit;
            break;
        }
  
        subRec?.smsSubjectList.push({
          CourseName: subject.FullName,
          GradeYear: subject.GradeYear,
          Semester: subject.Semester,
          Credit: subject.Credit,
          jx: sbJX
        });
      }
    }

    this.subjectList = this.subjectList.sort((a, b) => {
      return a.RowIndex - b.RowIndex;
    });

  }

  planNameChange() {
    this.showEditTitle = false;
    this.store.dispatch(new SetPlanName(+this.curPlan.id, this.planNameControl.value));
  }
}
