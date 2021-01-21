import { CreditSet } from './credit_set';
import { CourseCode } from './course-code';
import { CourseCodeRecord } from './course-code-record';
import { CodeData } from './moe.service';

/** 代表課程代碼前十六碼相同的所有科目清單。 */
export class CourseCodeTable {

  private records: CourseCodeRecord[] = [];

  constructor(codes: CodeData[]) {
    for(const code of codes) {
      const {course_code, subject_name, credits} = code;
      this.records.push(new CourseCodeRecord(new CourseCode(course_code),
        subject_name,
        CreditSet.parse(credits)));
    }
  }

  /** 取得所有課程代碼清單的參考。 */
  public getCodesRef() {
    return this.records.map(v => v.code);
  }

  public [Symbol.iterator]() {
    return this.records.values();
  }

  /** 合併兩個課程代碼表。 */
  public static merge(...tables: CourseCodeTable[]) {
    const combine: CourseCodeRecord[] = [];

    tables.forEach(v => combine.push(...v.records));

    const newTable = new CourseCodeTable([]);
    newTable.records = combine;

    return newTable;
  }
}
