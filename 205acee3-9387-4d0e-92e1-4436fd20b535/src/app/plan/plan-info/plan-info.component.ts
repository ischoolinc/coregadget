import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PlanRec, SubjectExRec } from 'src/app/data';
import { MatDialog } from '@angular/material/dialog';
import { Store, Select } from '@ngxs/store';
import { SetPlanContent } from 'src/app/state/plan.action';
import { Observable, Subject } from 'rxjs';
import { PlanModel } from 'src/app/state/plan.state';
import { take, takeUntil } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { Jsonx } from '@1campus/jsonx';

@Component({
  selector: 'app-plan-info',
  templateUrl: './plan-info.component.html',
  styleUrls: ['./plan-info.component.scss']
})
export class PlanInfoComponent implements OnInit, OnDestroy {

  @Input() columns: string[] = [];
  subjectList: SubjectExRec[] = [];
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
        this.graduationPlanParse(this.curPlan.content);
      }
    });
  }

  ngOnDestroy(): void {}

  graduationPlanParse(xml: string) {
    this.subjectList = [];
    const jx = Jsonx.parse(xml);
    
    for (const sbJX of jx.child('GraduationPlan').children('Subject')) {
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

  /** 單筆編輯 */
  editSubject(sb: SubjectExRec) {
    this.graduationPlanParse(this.curPlan.content); // restore subjectRec
    this.subjectList = this.subjectList.map(sbRec => {
      if (sbRec.SubjectName === sb.SubjectName && sbRec.RequiredBy === sb.RequiredBy && sbRec.Required === sb.Required) {
        sbRec.edit = true;
      } else {
        sbRec.edit = false;
      }
      return sbRec;
    });
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
    this.subjectList.forEach((sbRec: SubjectExRec) => {
      subjectList = subjectList.concat(sbRec.smsSubjectList.map(smsSubject => {return smsSubject.jx.toXml('Subject');}));
    });
    const subjectContent = subjectList.join('');
    const content = `<GraduationPlan SchoolYear="${this.curPlan.school_year}">${subjectContent}</GraduationPlan>`;
    
    this.store.dispatch(new SetPlanContent(+this.curPlan.id, content));
  }

  remove(sb: SubjectExRec) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '提醒',
        confirmContent: `確定刪除「${sb.SubjectName}」此科目？`,
        yesBtnText: '確定',
        noBtnText: '取消'
      }
    });
    dialogRef.afterClosed().pipe(
      take(1)
    ).subscribe(v => {
      if (v) {

      }
      sb.edit = false;
    });
  }

}
