import { FieldValidator, ValidResult } from "../document-validator/validator";

export class Enumerate implements FieldValidator {

  constructor(private list: string[]) {
  }

  validate(value: string): ValidResult {
    if (this.list.includes(value)) {
      return { isValid: 'success', message: '' };
    }
    return { isValid: 'error', message: `與清單不符` };
  }
}
