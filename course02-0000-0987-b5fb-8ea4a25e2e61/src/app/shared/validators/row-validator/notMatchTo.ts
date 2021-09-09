import { RowSource, RowValidator, ValidResult } from "../document-validator/validator";

export class NotMatchTo implements RowValidator {

  compareList: any[];
  delimiter = '@@@@@@';

  constructor(private readonly opt: NotMatchToOption) {
    this.opt = Object.assign({
      fieldNames: [],
      data: [],
      identifyField: [],
      message: '找到重複的資料',
      skipEmpty: true,
      skipFieldNames: opt.fieldNames,  // 預設為「全部欄位相加」後不重複
    } as NotMatchToOption, opt);

    this.compareList = this.opt.data.map(item => {
      const id = this.opt.identifyField?.reduce((acc: string, cur) => {
        return acc + this.delimiter + item[cur];
      }, '');

      const value = this.opt.fieldNames.reduce((acc: string, cur) => {
        return acc + this.delimiter + item[cur];
      }, '');

      return { id, value };
    });
  }

  getFieldNames() {
    return this.opt.fieldNames;
  }

  validate(row: RowSource): ValidResult {
    try {
      const combineId = this.opt.identifyField?.reduce((acc: string, cur) => {
        return acc + this.delimiter + row.getFieldValue(cur);
      }, '');

      const combineSkip = this.opt.skipFieldNames?.reduce((acc: string, cur) => {
        return acc + this.delimiter + row.getFieldValue(cur);
      }, '');

      const combineValue = this.opt.fieldNames.reduce((acc: string, cur) => {
        return acc + this.delimiter + row.getFieldValue(cur);
      }, '');

      const result = (this.opt.skipEmpty && combineSkip === this.delimiter.repeat(this.opt.skipFieldNames!.length)) ?
        false
        :
        this.compareList.find(item => {
          if (item.id && (item.id === combineId)) {
            return false;
          } else {
            return (item.value === combineValue);
          }
        });

      // result 為 true 代表錯誤，有找到重複的資料
      if (result) {
        return { isValid: 'error', message: this.opt.message };
      } else {
        return { isValid: 'success', message: '' };
      }
    } catch (error) {
      return { isValid: 'error', message: 'NotMatchTo 驗證失敗' };
    }
  }
}

export interface NotMatchToOption {
  /**比對的欄位名稱 */
  fieldNames: string[];
  /**對照組的資料 */
  data: any[];
  /**識別欄位名稱(用來避開同主鍵時與自己比對) */
  identifyField?: string[];
  /**自訂錯誤訊息 */
  message?: string;
  /**跳過空值比對 */
  skipEmpty?: boolean;
  /**要跳過空值比對的欄位名稱 */
  skipFieldNames?: string[];
}
