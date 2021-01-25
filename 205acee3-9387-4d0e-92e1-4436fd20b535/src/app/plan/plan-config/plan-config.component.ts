import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PlanService } from '../../core/plan.service';
import { Store, Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { PlanModel } from 'src/app/state/plan.state';
import { takeUntil } from 'rxjs/operators';
import { GroupCodeRec, PlanRec, SubjectExRec, SubjectRec } from 'src/app/data';
import { SetPlanContent, SetPlanGroupCode } from '../../state/plan.action';
import { CourseCodeService, GraduationPlan } from '@1campus/moe-course';
import { FormControl, Validators } from '@angular/forms';
import { Jsonx } from '@1campus/jsonx';


@Component({
  selector: 'app-plan-config',
  templateUrl: './plan-config.component.html',
  styleUrls: ['./plan-config.component.scss']
})
export class PlanConfigComponent implements OnInit {

  groupCodeList: GroupCodeRec[] = [];
  curGroupCode = new FormControl(null, [Validators.required]);
  displayedColumns: string[] = ['selected', 'status', 'domain', 'entry', 'subjectName', 'requiredBy', 'required', 'credits'];
  dataSource = new MatTableDataSource<DiffSubjectExRec>();

  @Select((state: { plan: any; }) => state.plan)plan$: Observable<PlanModel> | undefined;
  curPlan: PlanRec = {} as PlanRec;
  unSubscribe$ = new Subject();

  constructor(
    private planSrv: PlanService,
    private store: Store,
    private courseCodeSrv: CourseCodeService
  ) { }

  async ngOnInit() {
    await this.getGroupCode();

    this.curGroupCode.valueChanges.pipe(
      takeUntil(this.unSubscribe$)
    ).subscribe(v => {
      if (v) {
        this.changeCurGroupCode();
      }
    });

    this.plan$?.pipe(
      takeUntil(this.unSubscribe$)
    ).subscribe(v => {
      this.dataSource.data = [];
      if (v.curPlan) {
        this.curPlan = v.curPlan;
        const targetGroupCode = this.groupCodeList.find(data => data.group_code === v.curPlan?.moe_group_code);
        this.curGroupCode.setValue(targetGroupCode);
      }
    });
  }

  async getGroupCode () {
    const rsp = await this.planSrv.getMoeGroupCode();
    this.groupCodeList = [].concat(rsp.code || []);
  }

  async changeCurGroupCode() {
    const courseCode = await this.courseCodeSrv.getCourseCodeTable(this.curGroupCode.value.group_code);
    const gp = GraduationPlan.parse(this.curPlan.content);
    const subjs = gp.diff(courseCode);
    this.dataSource.data = subjs.map((data: any) => {
      const { status, subject, credits: {credits} } = data;
      return { status, ...subject, credits};
    });
  }

  graduationPlanParse(xml: string): SubjectRec[] {
    const subjectList: SubjectRec[] = [];
    const jx = Jsonx.parse(xml);

    for (const sbJX of jx.child('GraduationPlan').children('Subject')) {
      const { _attributes: subject, Grouping: {_attributes: group} } = sbJX.data as any;

      if (!subjectList.find((sbRec: SubjectRec) =>
        sbRec.Required === subject.Required
        && sbRec.RequiredBy === subject.RequiredBy
        && sbRec.SubjectName === subject.SubjectName)) {
        subjectList.push({
          StartLevel: group.startLevel,
          RowIndex: group.RowIndex,
          smsSubjectList: [],
          ...subject,
          edit: false
        });
      }

      const subRec = subjectList.find((sbRec: SubjectRec) => sbRec.Required === subject.Required && sbRec.RequiredBy === subject.RequiredBy && sbRec.SubjectName === subject.SubjectName);
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
    return subjectList;
  }

  newJsonx(sb: SubjectRec): SubjectRec {
    if (sb.LastSemester1) {
      sb.smsSubjectList.push({
        GradeYear: '1',
        Semester: '1',
        CourseName: `${sb.SubjectName} I`,
        Credit: sb.LastSemester1,
        jx: Jsonx.parse(`<Subject Category="" Credit="${sb.LastSemester1}" Domain="${sb.Domain}" Entry="${sb.Entry}"
GradeYear="1" Level="1" FullName="${sb.SubjectName} I" Required="${sb.Required}" RequiredBy="${sb.RequiredBy}"
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
GradeYear="1" Level="2" FullName="${sb.SubjectName} II" Required="${sb.Required}" RequiredBy="${sb.RequiredBy}"
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
GradeYear="2" Level="3" FullName="${sb.SubjectName} III" Required="${sb.Required}" RequiredBy="${sb.RequiredBy}"
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
GradeYear="2" Level="4" FullName="${sb.SubjectName} IV" Required="${sb.Required}" RequiredBy="${sb.RequiredBy}"
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
GradeYear="3" Level="5" FullName="${sb.SubjectName} V" Required="${sb.Required}" RequiredBy="${sb.RequiredBy}"
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
GradeYear="3" Level="6" FullName="${sb.SubjectName} VI" Required="${sb.Required}" RequiredBy="${sb.RequiredBy}"
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
GradeYear="4" Level="7" FullName="${sb.SubjectName} VII" Required="${sb.Required}" RequiredBy="${sb.RequiredBy}"
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
GradeYear="4" Level="8" FullName="${sb.SubjectName} VIII" Required="${sb.Required}" RequiredBy="${sb.RequiredBy}"
Semester="2" SubjectName="${sb.SubjectName}" 課程代碼=""><Grouping RowIndex="${sb.RowIndex}" startLevel="${sb.StartLevel}" />
</Subject>`).child('Subject')
      });
    }

    return sb;
  }

  async save() {
    // content xml 解析
    let subjectList = this.graduationPlanParse(this.curPlan.content);
    // 寫入差異資料
    this.dataSource.data.filter((diffRec: DiffSubjectExRec) => diffRec.selected).forEach(data => {
      if (data.status === 'new') {
        subjectList.push({
          Domain: data.domain,
          Entry: data.entry,
          SubjectName: data.subjectName,
          Required: data.required,
          RequiredBy: data.requiredBy,
          SubjectCode: '',
          StartLevel: '',
          RowIndex: subjectList.length,
          LastSemester1: '',
          NextSemester1: '',
          LastSemester2: '',
          NextSemester2: '',
          LastSemester3: '',
          NextSemester3: '',
          LastSemester4: '',
          NextSemester4: '',
          smsSubjectList: []
        });
      } 
      const sbRec = subjectList.find(sb => sb.SubjectName === data.subjectName && sb.RequiredBy === data.requiredBy && sb.Required === data.required);
        if (sbRec) {
          data.credits.forEach((credit, index: number) => {
            switch (index) {
              case 0:
                sbRec.LastSemester1 = credit;
                break;
              case 1:
                sbRec.NextSemester1 = credit;
                break;
              case 2:
                sbRec.LastSemester2 = credit;
                break;
              case 3:
                sbRec.NextSemester2 = credit;
                break;
              case 4:
                sbRec.LastSemester3 = credit;
                break;
              case 5:
                sbRec.NextSemester3 = credit;
                break;
              case 6:
                sbRec.LastSemester4 = credit;
                break;
              case 7:
                sbRec.NextSemester4 = credit;
                break;
            }
          });
        }
    });
    // 產出 jsonx 資料
    subjectList = subjectList.map(sb => {
      return this.newJsonx(sb);
    });
    // 整理 content xml 資料
    let smsSubjectList: string[] = [];
    subjectList.forEach((sbRec: SubjectRec) => {
      smsSubjectList = smsSubjectList.concat(sbRec.smsSubjectList.map(smsSubject => {return smsSubject.jx.toXml('Subject');}));
    });
    const subjectContent = smsSubjectList.join('');
    const content = `<GraduationPlan SchoolYear="${this.curPlan.school_year}">${subjectContent}</GraduationPlan>`;
    // update content
    // this.store.dispatch(new SetPlanContent(+this.curPlan.id, content));
    // update moe_group_code
    this.store.dispatch(new SetPlanGroupCode(+this.curPlan.id, this.curGroupCode.value.group_code, content));
  }


}

interface DiffSubjectRec {
  // new
  status: string;
  credits: string[];
  domain: string;
  entry: string;
  required: string;
  requiredBy: string;
  subjectName: string;
  // change
  newCredits?: string[];
  newDomain?: string;
  newEntry?: string;
}

interface DiffSubjectExRec extends DiffSubjectRec {
  selected: boolean;
}