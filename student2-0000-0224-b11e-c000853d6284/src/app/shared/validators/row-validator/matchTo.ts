import { RowSource, RowValidator, ValidResult } from "../document-validator/validator";

export class MatchTo implements RowValidator {

  compareList: any[];
  delimiter = '@@@@@@';

  constructor(private readonly opt: MatchToOption) {
    this.opt = Object.assign({
      fieldNames: [],
      data: [],
      message: '找不到相符的資料',
      skipEmpty: true,
      skipFieldNames: opt.fieldNames,  // 預設為「全部欄位相加」後不重複
    } as MatchToOption, opt);

    this.compareList = this.opt.data.map(item => {
      return this.opt.fieldNames.reduce((acc: string, cur) => {
        return acc + this.delimiter + item[cur];
      }, '');
    });
  }

  getFieldNames() {
    return this.opt.fieldNames;
  }

  validate(row: RowSource): ValidResult {
    try {
      const combineSkip = this.opt.skipFieldNames.reduce((acc: string, cur) => {
        return acc + this.delimiter + row.getFieldValue(cur);
      }, '');

      const combineValue = this.opt.fieldNames.reduce((acc: string, cur) => {
        return acc + this.delimiter + row.getFieldValue(cur);
      }, '');

      const result = (this.opt.skipEmpty && combineSkip === this.delimiter.repeat(this.opt.skipFieldNames.length)) ?
        true
        :
        this.compareList.find(v => v === combineValue);

      if (result) {
        return { isValid: 'success', message: '' };
      } else {
        return { isValid: 'error', message: this.opt.message };
      }
    } catch (error) {
      return { isValid: 'error', message: 'MatchTo 驗證失敗' };
    }
  }
}

export interface MatchToOption {
  /**比對的欄位名稱 */
  fieldNames: string[];
  /**對照組的資料 */
  data: any[];
  /**自訂錯誤訊息 */
  message?: string;
  /**跳過空值比對 */
  skipEmpty?: boolean;
  /**要跳過空值比對的欄位名稱 */
  skipFieldNames?: string[];
}
