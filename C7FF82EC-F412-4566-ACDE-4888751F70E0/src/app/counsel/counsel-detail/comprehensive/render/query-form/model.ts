/** QueryFormComponent 內部使用。 */
export interface Question {
  QuestionCode: string;
  Type: '單選' | '複選' | '填答';
  /**
   * 代表 question 為必填，不論 RequireLink 是什麼。
   */
  Require: boolean;
  /**
   * 連結到某題的 OptionCode，如果該 Option 有 Check 則此題為必填。
   */
  RequireLink: string;
  Text: string;
  Options: Option[];
}

/** QueryFormComponent 內部使用。 */
export interface Option {
  AnswerID: number;
  OptionCode: string;
  OptionText: string;
  AnswerValue: string;
  AnswerMatrix: string[];
  AnswerChecked: boolean;
  /**
   * 判斷是否填寫完整，若%RTEXT%項目留空=false
   */
  AnswerComplete: boolean;
}
