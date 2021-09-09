import { RowSource, RowValidator, ValidResult } from "../document-validator/validator";

export class MatchAndReset implements RowValidator {

  compareList: any[];
  delimiter = '@@@@@@';

  constructor(private readonly opt: MatchAndResetOption) {
    this.opt = Object.assign({
      fieldNames: [],
      data: [],
      message: '找不到相符的資料',
      skipEmpty: true,
      skipFieldNames: opt.fieldNames,  // 預設為「全部欄位相加」後不重複
    } as MatchAndResetOption, opt);

    this.compareList = this.opt.data.map(item => {
      const compareValue = this.opt.fieldNames.reduce((acc: string, cur) => {
        return acc + this.delimiter + item[cur];
      }, '');
      return {
        compareValue,
        source: item,
      }
    });
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

      let result = false;
      if (this.opt.skipEmpty && combineSkip === this.delimiter.repeat(this.opt.skipFieldNames!.length)) {
        result = true;
      } else {
        const matchData = this.compareList.find(v => v.compareValue === combineValue);
        result = !!matchData;
        if (result && this.opt.callback) {
          this.opt.callback(row.getRowValue(), matchData.source);
        }
      }

      if (result) {
        return { isValid: 'success', message: '' };
      } else {
        return { isValid: 'error', message: this.opt.message };
      }
    } catch (error) {
      return { isValid: 'error', message: 'MatchAndReset 驗證失敗' };
    }
  }
}

export interface MatchAndResetOption {
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
  /**CallBack */
  callback?: (rowValue: any, matchValue: any) => any;
}
