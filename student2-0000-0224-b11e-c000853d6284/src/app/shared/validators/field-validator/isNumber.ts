import { FieldValidator, ValidResult } from "../document-validator/validator";

export class IsNumber implements FieldValidator {

  validate(value: string): ValidResult {
    const intValue = +value;
    try {
      if (isNaN(intValue)) {
        return { isValid: 'error', message: `${value}不是數字` };
      }
      return { isValid: 'success', message: '' };
    } catch (error) {
      return { isValid: 'error', message: `${value}不是數字` };
    }
  }
}
