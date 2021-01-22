import { CreditSet } from './credit_set';
import { UnifiedSubject } from "./unified-subject";

export type DiffStatus = 'new' | 'change' | 'none';

/** 代表科目比對的差異資訊。 */
export class DiffSubject {

  constructor(
    public readonly subject: UnifiedSubject,
    public readonly status: DiffStatus,
    ) { }

    /** 原科目名稱。 */
    public get subjectName() {
      return this.subject.subjectName!;
    }

    /** 原「必選修」。 */
    public get required() {
      return this.subject.required!;
    }

    /** 原「校部訂」 */
    public get requiredBy() {
      return this.subject.requiredBy!;
    }

    /** 新的學分數設定，如果為「undefined」代表沒有差異。 */
    public newCredits?: CreditSet;

    /** 原學分數設定。 */
    public get credits() {
      return this.subject.credits!;
    }

    /** 新的「領域」名稱，如果為「undefined」代表沒有差異。 */
    public newDomain?: string;

    /** 原領域名稱。 */
    public get domain() {
      return this.subject.domain ?? '';
    }

    /** 新的「分項類別」名稱，如果為「undefined」代表沒有差異。 */
    public newEntry?: string;

    /** 原「分項類別」。 */
    public get entry() {
      return this.subject.entry ?? '';
    }
}
