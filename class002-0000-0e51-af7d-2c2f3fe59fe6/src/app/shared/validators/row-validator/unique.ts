import { RowSource, RowValidator, ValidResult } from "../document-validator/validator";

export class Unique implements RowValidator {

  compareList: string[] = [];
  delimiter = '@@@@@@';

  constructor(private readonly opt: UniqueOption) {
    this.opt = Object.assign({
      fieldNames: [],
      message: '不可重複',
      skipEmpty: true,
      skipFieldNames: opt.fieldNames, // 預設為「全部欄位相加」後不重複
    } as UniqueOption, opt);
  }

  getFieldNames() {
    return this.opt.fieldNames;
  }

  validate(row: RowSource): ValidResult {
    try {
      const combineSkip = this.opt.skipFieldNames!.reduce((acc: string, cur) => {
        return acc + this.delimiter + row.getFieldValue(cur);
      }, '');

      const combineValue = this.opt.fieldNames.reduce((acc: string, cur) => {
        return acc + this.delimiter + row.getFieldValue(cur);
      }, '');

      const result = (this.compareList.find(v => v === combineValue));

      // 跳過空白不驗證
      if (this.opt.skipEmpty && combineSkip === this.delimiter.repeat(this.opt.skipFieldNames!.length)) {
        return { isValid: 'success', message: '' };
      } else {
        this.compareList.push(combineValue);

        if (combineValue && result) {
          return { isValid: 'error', message: this.opt.message };
        } else {
          return { isValid: 'success', message: '' };
        }
      }
    } catch (error) {
      return { isValid: 'error', message: 'Unique 驗證失敗' };
    }
  }
}

export interface UniqueOption {
  /**比對的欄位名稱 */
  fieldNames: string[];
  /**自訂錯誤訊息 */
  message?: string;
  /**跳過空值比對 */
  skipEmpty?: boolean;
  /**要跳過空值比對的欄位名稱 */
  skipFieldNames?: string[];
}
