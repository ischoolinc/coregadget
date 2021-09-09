import { FieldValidator, ValidResult } from "../document-validator/validator";

export class MinLength implements FieldValidator {

  constructor(private minLength: number) {
  }

  validate(value: string): ValidResult {
    if (value.length < this.minLength) {
      return { isValid: 'error', message: `最小長度應大於 ${this.minLength}` };
    }
    return { isValid: 'success', message: '' };
  }
}
