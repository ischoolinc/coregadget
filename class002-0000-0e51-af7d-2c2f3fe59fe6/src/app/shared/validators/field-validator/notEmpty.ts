import { FieldValidator, ValidResult } from "../document-validator/validator";

export class NotEmpty implements FieldValidator {

  validate(value: string): ValidResult {
    return value ?
      { isValid: 'success', message: '' }
      :
      { isValid: 'error', message: '不可為空白' };
  }
}
