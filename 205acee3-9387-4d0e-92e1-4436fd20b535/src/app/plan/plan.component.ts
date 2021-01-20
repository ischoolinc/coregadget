import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlanRec, SubjectRec } from '../data';
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
  subjectList: SubjectRec[] = [];
  unSubscribe$ = new Subject();
  showEditeBtn: boolean = false;
  showEditTitle: boolean = false;
  planNameControl = new FormControl(null);

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
    const jx = Jsonx.parse(xml);

    jx.child('GraduationPlan').children('Subject').data.forEach((data: any) => {
      const { _attributes: subject, Grouping: {_attributes: group} } = data;

      if (!this.subjectList.find((sbRec: SubjectRec) => 
        sbRec.Required === subject.Required 
        && sbRec.RequiredBy === subject.RequiredBy 
        && sbRec.SubjectName === subject.SubjectName)) {
        this.subjectList.push({
          StartLevel: group.startLevel,
          RowIndex: group.RowIndex,
          courseList: [],
          ...subject
        });
      }

      const subRec = this.subjectList.find((sbRec: SubjectRec) => sbRec.Required === subject.Required && sbRec.RequiredBy === subject.RequiredBy && sbRec.SubjectName === subject.SubjectName);
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
  
        subRec?.courseList.push({
          CourseName: subject.FullName,
          GradeYear: subject.GradeYear,
          Semester: subject.Semester,
          Credit: subject.Credit
        });
      }
    });

    this.subjectList = this.subjectList.sort((a, b) => {
      return a.RowIndex - b.RowIndex;
    });

  }

  planNameChange() {
    this.showEditTitle = false;
    this.store.dispatch(new SetPlanName(+this.curPlan.id, this.planNameControl.value));
    // this.curPlanList = this.curPlanList.map((planRec: PlanRec) => {
    //   if (planRec.id === this.curPlan.id) {
    //     planRec.name = this.planNameControl.value;
    //     console.log(planRec);
    //     return planRec;
    //   }
    //   return planRec;
    // });
    // this.store.dispatch(new SetCurPlanList(this.curPlanList));
  }
}
