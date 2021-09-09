export interface FieldValidator {
  validate(value?: string): ValidResult;
}

export interface RowValidator {
  validate(row: RowSource): any;
  getFieldNames(): string[];
}

export interface RowSource {
  getRowValue(): any;
  getFieldValue(name: string): string;
  next(): boolean;
  setErrors(name: string, error: string): void;
}

export interface ValidResult {
  isValid: 'success' | 'error';
  message?: string;
}

export interface FieldRules {
  [field: string]: FieldValidator[]
}
