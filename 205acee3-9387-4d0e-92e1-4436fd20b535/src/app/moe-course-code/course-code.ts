import { CodeField, Record } from './record';
import { Field } from "./field";
import { MappingTable } from './mapping-table';

/** 代表「全國高級中等學校 課程計畫平台」的課程代碼，支援 for...of 取得所有欄位值。 */
export class CourseCode {

  private record: Record;

  public constructor(
    private code: string) {

    const Pattern = /^([\d\w]{3})([\d\w]{6})([\d\w]{1})([\d\w]{2})([\d\w]{3})([\d\w]{1})([\d\w]{1})([\d\w]{1})([\d\w]{1})([\d\w]{2})([\d\w]{2})$/igm;
    this.record = [];
    const fields = Pattern.exec(code);

    if (!fields) { throw new Error(`代碼規格不合：${code}`); }

    for (const name of Object.getOwnPropertyNames(fields)) {
      const idx = Number.parseInt(name)

      if (isNaN(idx)) continue;
      if (idx === 0) continue; // 第一個 full match 不要。

      this.record.push({ value: fields[idx], description: '' });
    }
  }

  [Symbol.iterator](): IterableIterator<CodeField> {
    return this.record.values();
  }

  /** 取得代碼值。 */
  public getCode(field: Field): string {
    return this.record[+field].value;
  }

  /** 取得代碼中文說明。 */
  public getDescription(field: Field): string {
    return this.record[+field].description;
  }

  /** 設定代碼中文說明。 */
  public setDescription(field: Field, map: MappingTable): void {
    this.record[+field].description = map.getDescription(this.getCode(field));
  }

  /** 取得完整的課程代碼。 */
  public getFullCode() {
    return this.code;
  }
}

