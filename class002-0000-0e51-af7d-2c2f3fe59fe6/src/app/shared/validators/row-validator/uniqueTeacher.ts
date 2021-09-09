import { RowSource, RowValidator, ValidResult } from "../document-validator/validator";

export class UniqueTeacher implements RowValidator {

  constructor(private readonly opt: UniqueTeacherOption) {
    this.opt = Object.assign({
      fieldNames: [],
      message: '不可重複',
      skipEmpty: true,
    } as UniqueTeacherOption, opt);
  }

  getFieldNames() {
    return this.opt.fieldNames;
  }

  validate(row: RowSource): ValidResult {
    try {
      const teacherValues: any[] = [];
      this.opt.fieldNames.forEach(v => {
        const value = row.getFieldValue(v);
        if (this.opt.skipEmpty) {
          if (value) { teacherValues.push(value); }
        } else {
          teacherValues.push(value);
        }
      });
      const uniqueValues = teacherValues.filter((value, index, self) => self.indexOf(value) == index);
      if (uniqueValues.length === teacherValues.length) {
        return { isValid: 'success', message: '' };
      } else {
        return { isValid: 'error', message: this.opt.message };
      }
    } catch (error) {
      return { isValid: 'error', message: 'Unique Teacher 驗證失敗' };
    }
  }
}

export interface UniqueTeacherOption {
  /**比對的欄位名稱 */
  fieldNames: string[];
  /**自訂錯誤訊息 */
  message?: string;
  /**跳過空值比對 */
  skipEmpty?: boolean;
  /**要跳過空值比對的欄位名稱 */
  skipFieldNames?: string[];
}
