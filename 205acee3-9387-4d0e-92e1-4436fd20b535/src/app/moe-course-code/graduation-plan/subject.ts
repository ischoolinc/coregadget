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
  }

  public name: string;

  public level: string;

  public required: Required;

  public requiredBy: RequiredBy;

}
