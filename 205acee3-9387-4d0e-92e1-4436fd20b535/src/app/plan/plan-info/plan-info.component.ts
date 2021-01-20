import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PlanRec, SubjectExRec } from 'src/app/data';
import { MatDialog } from '@angular/material/dialog';
import { PlanEditorComponent } from '../plan-editor/plan-editor.component';
import { Jsonx } from '@1campus/jsonx';
import { Store, Select } from '@ngxs/store';
import { SetPlanContent } from 'src/app/state/plan.action';
import { Observable, Subject } from 'rxjs';
import { PlanModel } from 'src/app/state/plan.state';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-plan-info',
  templateUrl: './plan-info.component.html',
  styleUrls: ['./plan-info.component.scss']
})
export class PlanInfoComponent implements OnInit, OnDestroy {

  @Input() jx: Jsonx = {} as Jsonx;
  @Input() dataSource: SubjectExRec[] = [];
  @Input() columns: string[] = [];
  @Select((state: { plan: any; }) => state.plan)plan$: Observable<PlanModel> | undefined;
  curPlan: PlanRec = {} as PlanRec;
  unSubscribe$ = new Subject();

  constructor(
    private dialog: MatDialog,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.plan$?.pipe(
      takeUntil(this.unSubscribe$)
    ).subscribe(v => {
      if (v.curPlan) {
        this.curPlan = v.curPlan;
      }
    });
  }

  ngOnDestroy(): void {
    
  }

  openEditor() {
    this.dialog.open(PlanEditorComponent, {});
  }

  save(sbRec: SubjectExRec) {
    sbRec.edit = false;
    // update jsonx
    sbRec.smsSubjectList.forEach((smsSubject: any) => {
      // Domain
      smsSubject.jx.data['_attributes'].Domain = sbRec.Domain;
      // Entry
      smsSubject.jx.data['_attributes'].Entry = sbRec.Entry;
      // SubjectName
      smsSubject.jx.data['_attributes'].SubjectName = sbRec.SubjectName;
      // RequiredBy
      smsSubject.jx.data['_attributes'].RequiredBy = sbRec.RequiredBy;
      // Required
      smsSubject.jx.data['_attributes'].Required = sbRec.Required;
      // startLevel
      smsSubject.jx.data.Grouping['_attributes'].startLevel = sbRec.StartLevel;

      switch (smsSubject.jx.data['_attributes'].GradeYear + smsSubject.jx.data['_attributes'].Semester) {
        case '11': // 1上
          smsSubject.jx.data['_attributes'].學分 = sbRec.LastSemester1;
          break;
        case '12': // 1下
          smsSubject.jx.data['_attributes'].學分 = sbRec.NextSemester1;
          break;
        case '21': // 2上
          smsSubject.jx.data['_attributes'].學分 = sbRec.LastSemester2;
          break;
        case '22': // 2下
          smsSubject.jx.data['_attributes'].學分 = sbRec.NextSemester2;
          break;
        case '31': // 3上
          smsSubject.jx.data['_attributes'].學分 = sbRec.LastSemester3;
          break;
        case '32': // 3下
          smsSubject.jx.data['_attributes'].學分 = sbRec.NextSemester3;
          break;
        case '41': // 4上
          smsSubject.jx.data['_attributes'].學分 = sbRec.LastSemester4;
          break;
        case '42': // 4下
          smsSubject.jx.data['_attributes'].學分 = sbRec.NextSemester4;
          break;
      }
    });

    let subjectList: any[] = [];
    this.dataSource.forEach((sbRec: SubjectExRec) => {
      subjectList = subjectList.concat(sbRec.smsSubjectList.map(smsSubject => {return smsSubject.jx.toXml('Subject');}));
    });
    const subjectContent = subjectList.join('');
    const content = `<GraduationPlan SchoolYear="${this.curPlan.school_year}">${subjectContent}</GraduationPlan>`;
    
    this.store.dispatch(new SetPlanContent(+this.curPlan.id, content));
    console.log(content);
  }

  remove(sb: SubjectExRec) {
    sb.edit = false;
  }

}
