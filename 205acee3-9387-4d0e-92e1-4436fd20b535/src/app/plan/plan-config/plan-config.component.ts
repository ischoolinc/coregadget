import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PlanService } from '../../core/plan.service';
import { Store, Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { PlanModel } from '../../state/plan.state';
import { takeUntil } from 'rxjs/operators';
import { DiffSubjectExRec, GroupCodeRec, PlanRec, SubjectRec } from '../../data';
import { SetPlanGroupCode } from '../../state/plan.action';
import { CourseCodeService, GraduationPlan } from '@1campus/moe-course';
import { FormControl, Validators } from '@angular/forms';
import { Jsonx } from '@1campus/jsonx';

@Component({
  selector: 'app-plan-config',
  templateUrl: './plan-config.component.html',
  styleUrls: ['./plan-config.component.scss']
})
export class PlanConfigComponent implements OnInit {

  // 課程代碼清單
  groupCodeList: GroupCodeRec[] = [];
  // moe_group_code
  groupCode = new FormControl(null, [Validators.required]);
  // moe_group_code_1 一年級不分班群
  groupCodeOne = new FormControl(null, [Validators.required]);
  selectAll = new FormControl(false);
  slidToggle = new FormControl(false);
  displayedColumns: string[] = ['selected', 'status', 'domain', 'entry', 'subjectName', 'requiredBy', 'required', 'credits'];
  dataSource = new MatTableDataSource<DiffSubjectExRec>();
  afterInit: boolean = false;

  @Select((state: { plan: any; }) => state.plan) plan$: Observable<PlanModel> | undefined;
  curPlan: PlanRec = {} as PlanRec;
  unSubscribe$ = new Subject();

  constructor(
    private planSrv: PlanService,
    private store: Store,
    private courseCodeSrv: CourseCodeService
  ) { }

  async ngOnInit() {
    await this.getGroupCode();

    this.groupCode.valueChanges.pipe(takeUntil(this.unSubscribe$)).subscribe(v => {
      if (this.afterInit) {
        this.checkDifferent();
      }
    });

    this.groupCodeOne.valueChanges.pipe(takeUntil(this.unSubscribe$)).subscribe(v => {
      if (this.afterInit) {
        this.checkDifferent();
      }
    });

    this.selectAll.valueChanges.pipe(takeUntil(this.unSubscribe$)).subscribe(v => {
      this.dataSource.data = this.dataSource.data.map(data => {
        data.selected = v;
        return data;
      });
    });

    this.slidToggle.valueChanges.pipe(takeUntil(this.unSubscribe$)).subscribe(v => {
      if (this.afterInit) {
        this.checkDifferent();
      }
      if (!v) {
        this.groupCodeOne.setValue(null);
        this.checkDifferent();
      }
    });

    this.plan$?.pipe(takeUntil(this.unSubscribe$)).subscribe(v => {
      this.dataSource.data = [];
      if (v.curPlan) {
        this.curPlan = v.curPlan;
        const groupCode = this.groupCodeList.find(data => data.group_code === v.curPlan?.moe_group_code);
        const groupCodeOne = this.groupCodeList.find(data => data.group_code === v.curPlan?.moe_group_code_1);
        this.groupCode.setValue(groupCode ? groupCode : null);
        this.groupCodeOne.setValue(groupCodeOne ? groupCodeOne : null);
        this.slidToggle.setValue(groupCodeOne ? true : false);
        this.checkDifferent();
        this.afterInit = true;
      }
    });
  }

  async getGroupCode() {
    const rsp = await this.planSrv.getMoeGroupCode();
    this.groupCodeList = [].concat(rsp.code || []);
  }

  async getDiffSubjects(plan: GraduationPlan, code: string): Promise<DiffSubjectExRec[]> {
    const courseCode = await this.courseCodeSrv.getCourseCodeTable(code);
    return plan.diff(courseCode).map((data: any) => {
      const { status, subject, credits: { credits } } = data;
      return { status, ...subject, credits };
    });
  }

  mergeDiffSubjects(diffSubjects: DiffSubjectExRec[], diffSubjects1: DiffSubjectExRec[]): DiffSubjectExRec[] {
    // 處理交集的部分
    diffSubjects = diffSubjects.map(diff => {
      const diffSubject1 = diffSubjects1.find(_diff => _diff.subjectName === diff.subjectName
        && _diff.required === diff.required && _diff.requiredBy === diff.requiredBy);
      if (diffSubject1) {
        const [, , c, d, e, f] = diff.credits;
        const [a, b, , , ,] = diffSubject1.credits;
        diff.credits = [a, b, c, d, e, f];
      }
      return diff;
    });
    // concat沒有交集的部分
    diffSubjects1 = diffSubjects1.filter(diff => !diffSubjects.find(_diff => _diff.subjectName === diff.subjectName 
      && _diff.required === diff.required && _diff.requiredBy === diff.requiredBy));
    return diffSubjects.concat(diffSubjects1);
  }

  parseCredits(diffSubjects: DiffSubjectExRec[]): DiffSubjectExRec[] {
    return diffSubjects.map(sub => {
      sub.creditsToString = sub.credits.map(credit => {
        return Number.isNaN(credit) ? '--' : credit;
      }).join(', ');
      return sub;
    });
  }

  /** 設定課程代碼 */
  async checkDifferent() {
    this.dataSource.data = [];
    const gp = GraduationPlan.parse(this.curPlan.content);
    const code = this.groupCode.value?.group_code;
    const code1 = this.groupCodeOne.value?.group_code;

    if (this.slidToggle.value && code1) {

      let diffSubjects = await this.getDiffSubjects(gp, code);
      let diffSubjects1 = await this.getDiffSubjects(gp, code1);

      // courseCode 只需要 2,3,4年級的差異資料
      diffSubjects = diffSubjects.filter(data => data.credits[2] || data.credits[3] || data.credits[4] || data.credits[5]);

      // courseCode1 只需要1年級的差異資料
      diffSubjects1 = diffSubjects1.filter(data => data.credits[0] || data.credits[1]
      ).map(data => {
        const [a, b] = data.credits;
        data.credits = [a, b, NaN, NaN, NaN, NaN];
        return data;
      });
     
      this.dataSource.data = this.parseCredits(this.mergeDiffSubjects(diffSubjects, diffSubjects1));
      console.log(this.dataSource.data);
    } 
    if (code) {
      this.dataSource.data = this.parseCredits(await this.getDiffSubjects(gp, code));
    }
  }

  /** 解析 graduation_plan.content 整理成 Subject[] */
  graduationPlanParse(xml: string): SubjectRec[] {
    const subjectList: SubjectRec[] = [];
    const jx = Jsonx.parse(xml);

    for (const sbJX of jx.child('GraduationPlan').children('Subject')) {
      const { _attributes: subject, Grouping: { _attributes: group } } = sbJX.data as any;

      if (!subjectList.find((sbRec: SubjectRec) => sbRec.Required === subject.Required
        && sbRec.RequiredBy === subject.RequiredBy && sbRec.SubjectName === subject.SubjectName)) {
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

  /** 解析 SubjectRec 設定 SemesterSubjectRec XML 資料 */
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
              sbRec.LastSemester1 = Number.isNaN(credit) ? '' : `${credit}`;
              break;
            case 1:
              sbRec.NextSemester1 = Number.isNaN(credit) ? '' : `${credit}`;
              break;
            case 2:
              sbRec.LastSemester2 = Number.isNaN(credit) ? '' : `${credit}`;
              break;
            case 3:
              sbRec.NextSemester2 = Number.isNaN(credit) ? '' : `${credit}`;
              break;
            case 4:
              sbRec.LastSemester3 = Number.isNaN(credit) ? '' : `${credit}`;
              break;
            case 5:
              sbRec.NextSemester3 = Number.isNaN(credit) ? '' : `${credit}`;
              break;
            case 6:
              sbRec.LastSemester4 = Number.isNaN(credit) ? '' : `${credit}`;
              break;
            case 7:
              sbRec.NextSemester4 = Number.isNaN(credit) ? '' : `${credit}`;
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
      smsSubjectList = smsSubjectList.concat(sbRec.smsSubjectList.map(smsSubject => { return smsSubject.jx.toXml('Subject'); }));
    });
    const subjectContent = smsSubjectList.join('');
    const content = `<GraduationPlan SchoolYear="${this.curPlan.school_year}">${subjectContent}</GraduationPlan>`;

    this.store.dispatch(new SetPlanGroupCode(+this.curPlan.id, this.groupCode.value.group_code
      , this.groupCodeOne.value?.group_code, content));
  }

}
