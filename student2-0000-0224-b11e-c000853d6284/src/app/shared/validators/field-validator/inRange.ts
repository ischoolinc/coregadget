import { FieldValidator, ValidResult } from "../document-validator/validator";

export class InRange implements FieldValidator {

  constructor(private minValue: number, private maxValue: number) {
  }

  validate(value: string): ValidResult {
    try {
      const intValue = +value;
      if (intValue < this.minValue) {
        return { isValid: 'error', message: `應大於 ${this.minValue}` };
      }

      if (intValue > this.maxValue) {
        return { isValid: 'error', message: `應小於 ${this.maxValue}` };
      } else {
        return { isValid: 'success', message: '' };
      }
    } catch (error) {
      return { isValid: 'error', message: `${value} 不是數字` };
    }
  }
}
