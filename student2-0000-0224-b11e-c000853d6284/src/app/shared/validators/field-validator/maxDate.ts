import { FieldValidator, ValidResult } from "../document-validator/validator";

export class MaxDate implements FieldValidator {

  constructor(private maxDate: Date) {
  }

  validate(value: string): ValidResult {
    const date: Date = new Date(value);

    if (isNaN(date.getTime())) {
      return { isValid: 'error', message: `日期不正確` };
    }
    if (date.getTime() > this.maxDate.getTime()) {
      return { isValid: 'error', message: `日期應小於 ${this.maxDate}` };
    }
    return { isValid: 'success', message: '' };
  }
}
