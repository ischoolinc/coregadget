import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PlanRec, SubjectExRec } from 'src/app/data';
import { MatDialog } from '@angular/material/dialog';
import { Store, Select } from '@ngxs/store';
import { SetPlanContent } from 'src/app/state/plan.action';
import { Observable, Subject } from 'rxjs';
import { PlanModel } from 'src/app/state/plan.state';
import { take, takeUntil } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { Jsonx } from '@1campus/jsonx';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CourseCodeService, RequiredBy, Required, SubjectKey } from '@1campus/moe-course';

@Component({
  selector: 'app-plan-info',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './plan-info.component.html',
  styleUrls: ['./plan-info.component.scss']
})
export class PlanInfoComponent implements OnInit, OnDestroy {

  @Input() columns: string[] = [];
  dataSource = new MatTableDataSource<SubjectExRec>();
  subjectList: SubjectExRec[] = [];
  @Select((state: { plan: any; }) => state.plan)plan$: Observable<PlanModel> | undefined;
  curPlan: PlanRec = {} as PlanRec;
  unSubscribe$ = new Subject();

  constructor(
    private dialog: MatDialog,
    private store: Store,
    private router: Router,
    private courseCodeSrv: CourseCodeService,
    private detectRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.plan$?.pipe(
      takeUntil(this.unSubscribe$)
    ).subscribe(v => {
      if (v.curPlan) {
        this.curPlan = v.curPlan;
        this.graduationPlanParse(this.curPlan.content);
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }

  async graduationPlanParse(xml: string) {
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

    if (this.curPlan.moe_group_code) {
      const table = await this.courseCodeSrv.getCourseCodeTable(this.curPlan.moe_group_code);
      this.subjectList = this.subjectList.map(sub => {
        const rsp = table.getCodeBySubjectKey(new SubjectKey(sub.SubjectName, sub.Required as Required, sub.RequiredBy as RequiredBy));

        if (rsp) {
          sub.SubjectCode = rsp.code.getFullCode();
          sub.mapping = true;
        } else {
          sub.SubjectCode = '';
          sub.mapping = false;
        }
  
        return sub;
      });
    } else {
      this.subjectList = this.subjectList.map(sub => {
        sub.SubjectCode = '';
        return sub;
      });
    }

    this.subjectList = this.subjectList.sort((a, b) => {
      return a.RowIndex - b.RowIndex;
    });

    this.duplicateValid();
    this.dataSource.data = this.subjectList;
    this.detectRef.detectChanges();
  }

  /** 檢查科目級別是否重複 */
  duplicateValid() {
    const keys: string[] = [];
    this.subjectList.forEach(sub => {
      sub.errorMsgs = [];
      sub.smsSubjectList.forEach(sms => {
        const sgs = `${sub.SubjectName}${sms.GradeYear}${sms.Semester}`;
        if (!keys.find(key => key === sgs)) {
          keys.push(sgs);
        } else {
          sub.error = true;
          sub.errorMsgs.push('已有相同科目級別的資料存在');
        }
      });
    });
  }

  addSubject() {
    console.log('add btn click');
    this.subjectList.splice(0, 0, {
      Domain: '',
      Entry: '',
      SubjectName: '',
      Required: '',
      RequiredBy: '',
      SubjectCode: '',
      StartLevel: '',
      RowIndex: this.subjectList.length,
      LastSemester1: '',
      NextSemester1: '',
      LastSemester2: '',
      NextSemester2: '',
      LastSemester3: '',
      NextSemester3: '',
      LastSemester4: '',
      NextSemester4: '',
      smsSubjectList: [],
      edit: true,
      mapping: false,
      error: false,
      errorMsgs: []
    });
    this.dataSource.data = this.subjectList;
  }

  /** 單筆編輯 */
  editSubject(sb: SubjectExRec) {
    this.subjectList = this.subjectList.map(sbRec => {
      if (sbRec.SubjectName === sb.SubjectName && sbRec.RequiredBy === sb.RequiredBy && sbRec.Required === sb.Required) {
        sbRec.edit = true;
      } else {
        sbRec.edit = false;
      }
      return sbRec;
    });
  }

  cancelEdit(sb: SubjectExRec) {
    sb.edit = false;
    // restore dataSource
    this.graduationPlanParse(this.curPlan.content);
  }

  /** SubjectName + Required + RequiredBy => 唯一值*/
  checkSRROnly(sb: SubjectExRec) {
    const duplicate = this.subjectList.filter(sbRec => sbRec.SubjectName === sb.SubjectName
      && sbRec.RequiredBy === sb.RequiredBy
      && sbRec.Required === sbRec.Required).length > 1;
    if (duplicate) {
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: '警告',
          confirmContent: `「${sb.SubjectName},${sb.RequiredBy},${sb.Required}」，資料重複無法儲存！`,
          yesBtnText: '確定',
          noBtnText: '取消'
        }
      });
    } else {
      this.saveState(sb)
    }
  }

  newJsonx(sb: SubjectExRec): SubjectExRec {
    sb.smsSubjectList = [];
    if (sb.LastSemester1) {
      sb.smsSubjectList.push({
        GradeYear: '1',
        Semester: '1',
        CourseName: `${sb.SubjectName} I`,
        Credit: sb.LastSemester1,
        jx: Jsonx.parse(`<Subject Category="" Credit="${sb.LastSemester1}" Domain="${sb.Domain}" Entry="${sb.Entry}"
GradeYear="1" Level="1" NotIncludedInCalc="False" NotIncludedInCredit="False" FullName="${sb.SubjectName} I" Required="${sb.Required}" RequiredBy="${sb.RequiredBy}"
Semester="1" SubjectName="${sb.SubjectName}" 課程代碼=""><Grouping RowIndex="${sb.RowIndex}" startLevel="${sb.StartLevel}" />
</Subject>`).child('Subject')
      });
    }
    if (sb.NextSemester1) {
      sb.smsSubjectList.push({
        GradeYear: '1',
        Semester: '2',
        CourseName: `${sb.SubjectName} II`,
        Credit: sb.NextSemester1,
        jx: Jsonx.parse(`<Subject Category="" Credit="${sb.NextSemester1}" Domain="${sb.Domain}" Entry="${sb.Entry}"
GradeYear="1" Level="2" NotIncludedInCalc="False" NotIncludedInCredit="False" FullName="${sb.SubjectName} II" Required="${sb.Required}" RequiredBy="${sb.RequiredBy}"
Semester="2" SubjectName="${sb.SubjectName}" 課程代碼=""><Grouping RowIndex="${sb.RowIndex}" startLevel="${sb.StartLevel}" />
</Subject>`).child('Subject')
      });
    }
    if (sb.LastSemester2) {
      sb.smsSubjectList.push({
        GradeYear: '2',
        Semester: '1',
        CourseName: `${sb.SubjectName} III`,
        Credit: sb.LastSemester2,
        jx: Jsonx.parse(`<Subject Category="" Credit="${sb.LastSemester2}" Domain="${sb.Domain}" Entry="${sb.Entry}"
GradeYear="2" Level="3" NotIncludedInCalc="False" NotIncludedInCredit="False" FullName="${sb.SubjectName} III" Required="${sb.Required}" RequiredBy="${sb.RequiredBy}"
Semester="1" SubjectName="${sb.SubjectName}" 課程代碼=""><Grouping RowIndex="${sb.RowIndex}" startLevel="${sb.StartLevel}" />
</Subject>`).child('Subject')
      });
    }
    if (sb.NextSemester2) {
      sb.smsSubjectList.push({
        GradeYear: '2',
        Semester: '2',
        CourseName: `${sb.SubjectName} IV`,
        Credit: sb.NextSemester2,
        jx: Jsonx.parse(`<Subject Category="" Credit="${sb.NextSemester2}" Domain="${sb.Domain}" Entry="${sb.Entry}"
GradeYear="2" Level="4" NotIncludedInCalc="False" NotIncludedInCredit="False" FullName="${sb.SubjectName} IV" Required="${sb.Required}" RequiredBy="${sb.RequiredBy}"
Semester="2" SubjectName="${sb.SubjectName}" 課程代碼=""><Grouping RowIndex="${sb.RowIndex}" startLevel="${sb.StartLevel}" />
</Subject>`).child('Subject')
      });
    }
    if (sb.LastSemester3) {
      sb.smsSubjectList.push({
        GradeYear: '3',
        Semester: '1',
        CourseName: `${sb.SubjectName} V`,
        Credit: sb.LastSemester3,
        jx: Jsonx.parse(`<Subject Category="" Credit="${sb.LastSemester3}" Domain="${sb.Domain}" Entry="${sb.Entry}"
GradeYear="3" Level="5" NotIncludedInCalc="False" NotIncludedInCredit="False" FullName="${sb.SubjectName} V" Required="${sb.Required}" RequiredBy="${sb.RequiredBy}"
Semester="1" SubjectName="${sb.SubjectName}" 課程代碼=""><Grouping RowIndex="${sb.RowIndex}" startLevel="${sb.StartLevel}" />
</Subject>`).child('Subject')
      });
    }
    if (sb.NextSemester3) {
      sb.smsSubjectList.push({
        GradeYear: '3',
        Semester: '2',
        CourseName: `${sb.SubjectName} VI`,
        Credit: sb.NextSemester3,
        jx: Jsonx.parse(`<Subject Category="" Credit="${sb.NextSemester3}" Domain="${sb.Domain}" Entry="${sb.Entry}"
GradeYear="3" Level="6" NotIncludedInCalc="False" NotIncludedInCredit="False" FullName="${sb.SubjectName} VI" Required="${sb.Required}" RequiredBy="${sb.RequiredBy}"
Semester="2" SubjectName="${sb.SubjectName}" 課程代碼=""><Grouping RowIndex="${sb.RowIndex}" startLevel="${sb.StartLevel}" />
</Subject>`).child('Subject')
      });
    }
    if (sb.LastSemester4) {
      sb.smsSubjectList.push({
        GradeYear: '4',
        Semester: '1',
        CourseName: `${sb.SubjectName} VII`,
        Credit: sb.LastSemester4,
        jx: Jsonx.parse(`<Subject Category="" Credit="${sb.LastSemester4}" Domain="${sb.Domain}" Entry="${sb.Entry}"
GradeYear="4" Level="7" NotIncludedInCalc="False" NotIncludedInCredit="False" FullName="${sb.SubjectName} VII" Required="${sb.Required}" RequiredBy="${sb.RequiredBy}"
Semester="1" SubjectName="${sb.SubjectName}" 課程代碼=""><Grouping RowIndex="${sb.RowIndex}" startLevel="${sb.StartLevel}" />
</Subject>`).child('Subject')
      });
    }
    if (sb.NextSemester4) {
      sb.smsSubjectList.push({
        GradeYear: '4',
        Semester: '2',
        CourseName: `${sb.SubjectName} VIII`,
        Credit: sb.NextSemester4,
        jx: Jsonx.parse(`<Subject Category="" Credit="${sb.NextSemester4}" Domain="${sb.Domain}" Entry="${sb.Entry}"
GradeYear="4" Level="8" NotIncludedInCalc="False" NotIncludedInCredit="False" FullName="${sb.SubjectName} VIII" Required="${sb.Required}" RequiredBy="${sb.RequiredBy}"
Semester="2" SubjectName="${sb.SubjectName}" 課程代碼=""><Grouping RowIndex="${sb.RowIndex}" startLevel="${sb.StartLevel}" />
</Subject>`).child('Subject')
      });
    }

    return sb;
  }

  saveState(sbRec: SubjectExRec) {
    sbRec = this.newJsonx(sbRec);
    sbRec.edit = false;
    this.save();
  }

  save() {
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
      if (v.result) {
        this.subjectList = this.subjectList.filter(subRec => {
          if (subRec.SubjectName === sb.SubjectName && subRec.RequiredBy === sb.RequiredBy && subRec.Required === sb.Required) {
            return false;
          } else {
            return true;
          }
        });
        this.save();
      }
      sb.edit = false;
    });
  }

}
