import { Required, RequiredBy } from './common';
import { Jsonx } from '@1campus/jsonx';

export class Subject {

  constructor(
    data: Jsonx
  ) {
    this.name = data.getAttr('SubjectName');
    this.level = data.getAttr('Level');
    this.required = data.getAttr('Required') as Required;
    this.requiredBy = data.getAttr('RequiredBy') as RequiredBy;
    this.gradeYear = +data.getAttr('GradeYear');
    this.semester = +data.getAttr('Semester');
    this.credit = +data.getAttr('Credit');
  }

  public name: string;

  public level: string;

  public required: Required;

  public requiredBy: RequiredBy;

  public gradeYear: number;

  public semester: number;

  public credit: number;
}
