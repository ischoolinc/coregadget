import { FieldValidator, ValidResult } from "../document-validator/validator";

export class MaxLength implements FieldValidator {

  constructor(private maxLength: number) {
  }

  validate(value: string): ValidResult {
    if (value.length > this.maxLength) {
      return { isValid: 'error', message: `最大長度應小於 ${this.maxLength}` };
    }
    return { isValid: 'success', message: '' };
  }
}
