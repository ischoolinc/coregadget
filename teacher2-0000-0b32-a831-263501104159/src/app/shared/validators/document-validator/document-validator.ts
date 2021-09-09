import { FieldRules, RowSource, RowValidator } from "./validator";

export class DocumentValidator {

  constructor(
    private fieldRules: FieldRules
    , private rowRules: RowValidator[]
  ) { }

  validate(record: RowSource) {
    while (record.next()) {
      for (const rowRule of this.rowRules) {
        const result = rowRule.validate(record);
        if (result.isValid === 'error') {
          rowRule.getFieldNames().forEach(field => {
            record.setErrors(field, result.message);
          });
        }
      }

      for (const field of Object.getOwnPropertyNames(this.fieldRules)) {
        const value = record.getFieldValue(field);
        const rules = this.fieldRules[field];

        for (const rule of rules) {
          const result = rule.validate(value);
          if (result.isValid === 'error') {
            record.setErrors(field, result.message);
            break;
          }
        }
      };
    }
  }
}
