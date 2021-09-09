import { RowSource } from "./validator";

export class JsonRowSource implements RowSource {

  idx = -1;
  errors: Map<number, any> = new Map();

  constructor(private data: any[]) {
  }

  getRowValue(): any {
    return this.data[this.idx] || {};
  }

  getFieldValue(name: string): string {
    try {
      if (this.data[this.idx][name] === null || this.data[this.idx][name] === undefined) {
        return '';
      } else {
        return '' + this.data[this.idx][name];
      }
    } catch (error) {
      return '';
    }
  }

  next(): boolean {
    this.idx++;
    return this.idx < this.data.length;
  }

  setErrors(field: string, error: string) {
    // console.log(field, error);
    if (!this.errors.has(this.idx)) {
      this.errors.set(this.idx, {});
    }
    const item = this.errors.get(this.idx);
    if (!item[field]) item[field] = [];
    item[field].push(error);
  }

  getErrors(): Map<number, any> {
    return this.errors;
  }
}
