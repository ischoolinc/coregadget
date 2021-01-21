import { Required, RequiredBy } from './graduation-plan/common';
import { ComparableSubject, UnifiedSubject } from './unified-subject';
import { CreditSet } from './credit_set';
import { CourseCode } from './course-code';
import { Field } from './field';
import { CourseTypeMap } from './course-type-map';

/** 代表「全國高級中等學校 課程計畫平台」的課程代碼記錄。 */
export class CourseCodeRecord implements ComparableSubject {

  constructor(
    public code: CourseCode,
    public readonly subjectName: string,
    public credits: CreditSet
  ) {
  }

  /** 取得一致化的科目資料，用來進行通用比對。 */
  public getUnifiedSubject() {
    const us = new UnifiedSubject();

    const { required, requiredBy } = CourseTypeMap.get(this.code.getCode(Field.N07))!;
    us.subjectName = this.subjectName;
    us.credits = this.credits.clone();
    us.required = required;
    us.requiredBy = requiredBy;
    us.domain = this.code.getDescription(Field.N10);

    if (['2', '3'].indexOf(this.code.getCode(Field.N09)) >= 0) { // 專業科目、實習科目
      us.entry = this.code.getDescription(Field.N09);
    } else {
      us.entry = '學業';
    }

    return us;
  }
}

