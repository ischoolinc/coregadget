import { FieldValidator, ValidResult } from "../document-validator/validator";

export class MinDate implements FieldValidator {

  constructor(private minDate: Date) {
  }

  validate(value: string): ValidResult {
    const date: Date = new Date(value);

    if (isNaN(date.getTime())) {
      return { isValid: 'error', message: `日期不正確` };
    }
    if (date.getTime() > this.minDate.getTime()) {
      return { isValid: 'error', message: `日期應大於 ${this.minDate}` };
    }
    return { isValid: 'success', message: '' };
  }
}
