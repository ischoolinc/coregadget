import { Required, RequiredBy } from './common';

export class SubjectGroupKey {

  constructor(
    public name: string,
    public required: Required,
    public requiredBy: RequiredBy,
  ) {}

  /** 科目群組識別字串。 */
  public get identify() {
    return `${this.name}:${this.required}:${this.requiredBy}`;
  }
}
