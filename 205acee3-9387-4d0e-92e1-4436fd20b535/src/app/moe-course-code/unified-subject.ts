import { DiffSubject } from './diff-subject';
import { SubjectKey } from './subject-key';
import { CreditSet } from './credit_set';
import { Required, RequiredBy } from './graduation-plan/common';

export interface ComparableSubject {

  getUnifiedSubject(): UnifiedSubject;

}

/** 代表一致化的科目資料，可用來比較與檢查。 */
export class UnifiedSubject {

  constructor(
    /** 科目的原始資料。 */
    public readonly originData: any,
  ) {
  }

  /** 科目名稱。 */
  public subjectName?: string;

  /** 校部訂。 */
  public required?: Required;

  /** 必選修。 */
  public requiredBy?: RequiredBy;

  /** 每學期學分數。 */
  public credits?: CreditSet;

  /** 領域 */
  public domain?: string;

  /** 分項類別 */
  public entry?: string;

  public getUnifiedKey() {
    return new SubjectKey(this.subjectName!,
      this.required!,
      this.requiredBy!).identify;
  }

  /** 在科目名稱、校部訂、必選修相同狀況下比對。 */
  public getDiff(other: UnifiedSubject) {
    let isDiff = false;
    const diff = new DiffSubject(this, 'change');

    if(other.credits!.unifiedKey !== this.credits!.unifiedKey) {
      // 檢查學分數不同。
      diff.newCredits = other.credits!.clone();
      isDiff = true;
    }

    if(other.domain !== this.domain) {
      // 檢查領域不同。
      diff.newDomain = other.domain;
      isDiff = true;
    }

    if (other.entry !== this.entry) {
      // 檢查分項類別不同。
      diff.newEntry = other.entry;
      isDiff = true;
    }

    return isDiff ? diff : undefined;
  }

  public clone() {
    return Object.assign(new UnifiedSubject(this.originData), this)
  }
}
