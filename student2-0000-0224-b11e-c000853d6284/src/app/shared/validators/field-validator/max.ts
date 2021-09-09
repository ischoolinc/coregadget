import { FieldValidator, ValidResult } from "../document-validator/validator";

export class Max implements FieldValidator {

  constructor(private max: number) {
  }

  validate(value: string): ValidResult {
    if (+value > this.max) {
      return { isValid: 'error', message: `應小於 ${this.max}` };
    }
    return { isValid: 'success', message: '' };
  }
}
