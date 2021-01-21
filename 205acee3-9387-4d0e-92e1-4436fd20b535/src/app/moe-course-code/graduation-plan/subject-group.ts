import { CreditSet, SemesterList } from './../credit_set';
import { ComparableSubject, UnifiedSubject } from './../unified-subject';
import { Subject } from './subject';
import { SubjectGroupKey } from './subject-group-key';

export class SubjectGroup implements ComparableSubject {

  private subjects: Subject[] = [];

  constructor(
    public key: SubjectGroupKey,
  ) {}

  public addSubject(subj: Subject) {
    this.subjects.push(subj);
  }

  public getUnifiedSubject() {
    const us = new UnifiedSubject();

    const subj = this.getFirstSubject()!;

    us.subjectName = subj.name;
    us.required = subj.required;
    us.requiredBy = subj.requiredBy;
    us.credits = new CreditSet();

    for(const s of this) {
      us.credits!.set(s.gradeYear + s.semester as SemesterList, s.credit);
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
}
