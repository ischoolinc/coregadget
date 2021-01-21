import { CourseCodeTable } from './../course-code-table';
import { CourseCodeRecord } from './../course-code-record';
import { CreditSet, SemesterList } from './../credit_set';
import { ComparableSubject, UnifiedSubject } from './../unified-subject';
import { Subject } from './subject';
import { SubjectKey } from '../subject-key';

export class SubjectGroup implements ComparableSubject {

  private subjects: Subject[] = [];

  constructor(
    public key: SubjectKey,
  ) {}

  public addSubject(subj: Subject) {
    this.subjects.push(subj);
  }

  public getUnifiedSubject() {
    const us = new UnifiedSubject(this);

    const subj = this.getFirstSubject()!;

    us.subjectName = subj.name;
    us.required = subj.required;
    us.requiredBy = subj.requiredBy;
    us.credits = new CreditSet();
    us.domain = subj.domain;
    us.entry = subj.entry;

    for(const s of this) {
      us.credits!.setByGradeYear(s.gradeYear, s.semester, s.credit);
    }

    return us;
  }

  public [Symbol.iterator]() {
    return this.subjects.values();
  }

  public get [Symbol.toStringTag]() {
    return this.key.identify;
  }

  public getFirstSubject() {
    if(this.subjects.length > 0) {
      return this.subjects[0];
    } else {
      return undefined;
    }
  }

  public fillCorrespondingCourseCode(codeTable: CourseCodeTable) {
    this.courseCode = codeTable.getCodeBySubjectKey(this.key);
    return this.courseCode;
  }

  /** 相應的課程代碼資訊 */
  public courseCode?: CourseCodeRecord;
}
