import { Subject } from './subject';
import { SubjectGroupKey } from './subject-group-key';

export class SubjectGroup {

  private subjects: Subject[] = [];

  constructor(
    public key: SubjectGroupKey,
  ) {}

  public addSubject(subj: Subject) {
    this.subjects.push(subj);
  }

  public [Symbol.iterator]() {
    return this.subjects;
  }

  public get [Symbol.toStringTag]() {
    return this.key.identify;
  }
}
