import { Directive, StaticProvider, forwardRef, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { SentenceComponent } from './sentence.component';

export const SENTENCE_VALIDATOR: StaticProvider = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SentenceValidatorDirective),
  multi: true
};

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'app-sentence[ngModel][completeRequired],app-sentence[formControl][completeRequired],app-sentence[formControlName][completeRequired]',
  providers: [SENTENCE_VALIDATOR]
})
export class SentenceValidatorDirective implements Validator {

  private _onChange: () => void;

  constructor(
    private component: SentenceComponent
  ) { }

  // 是否為必填(只要是必填所有欄位都要必填)。
  @Input() set completeRequired(value: boolean) {

    const req = value != null && value !== false && `${value}` !== 'false';
    this.component.applyRequireConf(req);

    if (this._onChange) {
      this._onChange();
    }
  }

  get completeRequired(): boolean {
    return this.component._required;
  }

  validate(control: AbstractControl): ValidationErrors {
    const {_tokenGroup} = this.component;
    // 在 disabled 狀態一般會是 valid = false。
    // 但不需要回傳錯誤訊息。
    if (_tokenGroup.valid || _tokenGroup.disabled) {
      return null;
    } else {
      return { matrix: '所有空格都需要填值。' };
    }
  }

  registerOnValidatorChange?(fn: () => void): void {
    this._onChange = fn;
  }

}
