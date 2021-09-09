import { FieldValidator, ValidResult } from "../document-validator/validator";

export class Min implements FieldValidator {

  constructor(private min: number) {
  }

  validate(value: string): ValidResult {
    if (+value < this.min) {
      return { isValid: 'error', message: `應大於 ${this.min}` };
    }
    return { isValid: 'success', message: '' };
  }
}
