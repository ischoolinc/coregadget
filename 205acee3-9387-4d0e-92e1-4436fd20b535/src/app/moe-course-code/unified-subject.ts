import { CreditSet } from './credit_set';
import { Required, RequiredBy } from './graduation-plan/common';

export interface ComparableSubject {

  getUnifiedSubject(): UnifiedSubject;

}

/** 代表一致化的科目資料，可用來比較與檢查。 */
export class UnifiedSubject {

  constructor() {
  }

  /** 科目名稱。 */
  public subjectName?: string;

  /** 校部訂。 */
  public required?: Required;

  /** 必選修。 */
  public requiredBy?: RequiredBy;

  /** 每學期學分數。 */
  public credits?: CreditSet;

}
