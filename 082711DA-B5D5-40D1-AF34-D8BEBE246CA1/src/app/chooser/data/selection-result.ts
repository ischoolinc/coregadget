import { Injector } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ClassRecord } from './class';
import { StudentRecord } from './student';
import { TeacherRecord } from './teacher';
import { TagRecord, TagPrefix } from './tag';
import { BaseService } from '../base.service';
import { SelectedDetailComponent } from '../seleted-detail/selected-detail.component';

export abstract class SelectionResult {

  constructor() {}

  /** 要顯示的文字。 */
  abstract get displayText(): string;

  get displayText2 ():string {return ""}

  /** 可否顯示細節 */
  get previewable(): boolean { return false; }

  abstract get IdList(): string[];

  async previewData(injector: Injector): Promise<void> {}

  // get Obj(): StudentRecord ;
}

export class AllStudentSelection extends SelectionResult {
  constructor(
    private students: StudentRecord[],
  ) {
    super();
  }

  get displayText(): string {
    return `全校學生 (共 ${this.students.length} 人)`;
  }

  get previewable(): boolean { return true; }

  get IdList(): string[] {
    return this.students.map(s => s.Id);
  }

  async previewData(injector: Injector): Promise<void> {
    const baseSrv = injector.get(BaseService);

    const dialog = injector.get(MatDialog);

    const rsp = await baseSrv.getStudents('All', '') .toPromise();

    dialog.open(SelectedDetailComponent, {
      data: {
        target: 'STUDENT',
        title: this.displayText,
        records: rsp
      }
    });
  }
}

export class AllTeacherSelection extends SelectionResult {
  constructor(
    private teachers: TeacherRecord[]
  ) {
    super();
  }

  get displayText(): string {
    return `全校老師 (共 ${this.teachers.length} 人)`;
  }

  get previewable(): boolean { return true; }

  get IdList(): string[] {
    return this.teachers.map(v => v.Id);
  }

  async previewData(injector: Injector): Promise<void> {
    const baseSrv = injector.get(BaseService);

    const dialog = injector.get(MatDialog);

    const rsp = await baseSrv.getTeachers('All', '') .toPromise();

    dialog.open(SelectedDetailComponent, {
      data: {
        target: 'TEACHER',
        title: this.displayText,
        records: rsp
      }
    });
  }
}

export class AllGreadYearSelection extends SelectionResult {
  constructor(
    public target: string,
    public greadYear: string,
    public count: number,
    public record: ClassRecord[]
  ) {
    super();
  }

  get displayText(): string {
    return `${this.greadYear}年級 (共 ${this.count} 人)`;
  }

  get previewable(): boolean { return true; }

  get IdList(): string[] {
    if (this.target === 'TEACHER') {
      return this.record
        .reduce((acc, cur) => acc.concat(cur.TeacherId), []);
    } else {
      return this.record
        .reduce((acc, cur) => acc.concat(cur.StudentIds), []);
    }
  }

  async previewData(injector: Injector): Promise<void> {
    const baseSrv = injector.get(BaseService);

    const dialog = injector.get(MatDialog);

    let rsp: any;
    if (this.target === 'TEACHER') {
      rsp = await baseSrv.getTeachers('GradeYear', this.greadYear).toPromise();
    } else {
      rsp = await baseSrv.getStudents('GradeYear', this.greadYear).toPromise();
    }

    dialog.open(SelectedDetailComponent, {
      data: {
        target: this.target,
        title: this.displayText,
        records: rsp
      }
    });
  }
}

export class TagPrefixSelection extends SelectionResult {
  constructor(
    public target: string,
    public tagPrefix: TagPrefix,
  ) {
    super();
  }

  get displayText(): string {
    return `${this.tagPrefix.Prefix}類別 (共 ${this.tagPrefix.MemberCount} 人)`;
  }

  get previewable(): boolean { return true; }

  get IdList(): string[] {
    return this.tagPrefix.MemberIds;
  }

  async previewData(injector: Injector): Promise<void> {
    const baseSrv = injector.get(BaseService);

    const dialog = injector.get(MatDialog);

    let rsp: any;
    if (this.target === 'TEACHER') {
      rsp = await baseSrv.getTeachers('TagPrefix', this.tagPrefix.Prefix).toPromise();
    } else {
      rsp = await baseSrv.getStudents('TagPrefix', this.tagPrefix.Prefix).toPromise();
    }

    dialog.open(SelectedDetailComponent, {
      data: {
        target: this.target,
        title: this.displayText,
        records: rsp
      }
    });
  }
}

export class TagSelection extends SelectionResult {
  constructor(
    private target: string,
    private tag: TagRecord,
  ) {
    super();
  }

  get displayText(): string {
    return `${this.tag.Name} (共 ${this.tag.MemberIds.length} 人)`;
  }

  get previewable(): boolean { return true; }

  get IdList(): string[] {
    return this.tag.MemberIds;
  }

  async previewData(injector: Injector): Promise<void> {
    const baseSrv = injector.get(BaseService);

    const dialog = injector.get(MatDialog);

    let rsp: any;
    if (this.target === 'TEACHER') {
      rsp = await baseSrv.getTeachers('TagId', this.tag.TagId).toPromise();
    } else {
      rsp = await baseSrv.getStudents('TagId', this.tag.TagId).toPromise();
    }

    dialog.open(SelectedDetailComponent, {
      data: {
        target: this.target,
        title: this.displayText,
        records: rsp
      }
    });
  }
}

export class ClassSelection extends SelectionResult {

  constructor(
    public target: string,
    public record: ClassRecord
  ) {
    super();
  }

  get displayText(): string {
    const { ClassName } = this.record;

    if (this.target === 'TEACHER') {
      return `${ClassName} (共 ${this.record.TeacherId ? 1 : 0} 人)`;
    } else {
      return `${ClassName} (共 ${this.record.StudentIds.length} 人)`;
    }
  }

  get previewable(): boolean { return true; }

  get IdList(): string[] {
    if (this.target === 'TEACHER') {
      return [this.record.TeacherId];
    } else {
      return this.record.StudentIds;
    }
  }

  async previewData(injector: Injector): Promise<void> {
    const baseSrv = injector.get(BaseService);

    const dialog = injector.get(MatDialog);

    let rsp: any;
    if (this.target === 'TEACHER') {
      rsp = await baseSrv.getTeachers('ClassId', this.record.Id).toPromise();
    } else {
      rsp = await baseSrv.getStudents('ClassId', this.record.Id).toPromise();
    }

    dialog.open(SelectedDetailComponent, {
      data: {
        target: this.target,
        title: this.displayText,
        records: rsp
      }
    });
  }
}

export class StudentSelection extends SelectionResult {

  constructor(
    private student: StudentRecord
  ) {
    super();
  }

  get displayText(): string {
    // 101班 王同學（510002)
    const { StudentName, StudentNumber, ClassName } = this.student;

    return `${ClassName} ${StudentName} (${StudentNumber})`;
  }

  get displayText2(): string {
    // 101班 王同學（510002)
    const { StudentName, StudentNumber, ClassName ,SeatNo} = this.student;

    return `${ClassName} ${StudentName} (${SeatNo})`;
  }

  get IdList(): string[] {
    return [this.student.Id];
  }
  /**
  * 回傳學生資訊
   *
   * @readonly
   * @type {StudentRecord[]}
   * @memberof StudentSelection
   */
  get  ObjList(): StudentRecord[]
  {
    return [this.student];
  }
}

export class TeacherSelection extends SelectionResult {

  constructor(
    private teacher: TeacherRecord
  ) {
    super();
  }

  get displayText(): string {
    // 王老師（暱稱)
    const { TeacherName, Nickname } = this.teacher;

    return `${TeacherName} ${Nickname ? '(' + Nickname + ')' : ''}`;
  }

  get IdList(): string[] {
    return [this.teacher.Id];
  }
}
