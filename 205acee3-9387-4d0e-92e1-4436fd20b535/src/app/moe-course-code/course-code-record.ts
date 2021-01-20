import { CreditSet } from './credit_set';
import { CourseCode } from './course-code';

/** 代表「全國高級中等學校 課程計畫平台」的課程代碼記錄。 */
export class CourseCodeRecord {

  constructor(
    public code: CourseCode,
    public readonly subjectName: string,
    public credits: CreditSet
  ) {
  }
}


