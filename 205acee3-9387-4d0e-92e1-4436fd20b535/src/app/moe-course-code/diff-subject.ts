import { CreditSet } from './credit_set';
import { UnifiedSubject } from "./unified-subject";

export type DiffStatus = 'new' | 'change' | 'none';

export class DiffSubject {

  constructor(
    public readonly subject: UnifiedSubject,
    public readonly status: DiffStatus,
    ) { }

    public get subjectName() {
      return this.subject.subjectName!;
    }

    public get required() {
      return this.subject.required!;
    }

    public get requiredBy() {
      return this.subject.requiredBy!;
    }

    /** 新的學分數設定。 */
    public newCredits?: CreditSet;

    public get credits() {
      return this.subject.credits!;
    }

    /** 新的「領域」名稱。 */
    public newDomain?: string;

    public get domain() {
      return this.subject.domain ?? '';
    }

    /** 新的「分項類別」名稱。 */
    public newEntry?: string;

    public get entry() {
      return this.subject.entry ?? '';
    }
}
