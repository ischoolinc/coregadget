import { Directive, StaticProvider, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors, FormArray, FormGroup, FormControl } from '@angular/forms';
import { QueryFormComponent } from './query-form.component';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { Question, Option } from './model';
import { OptionCheckCoordinatorService } from '../option-check-coordinator.service';

export const QUERYFORM_VALIDATOR: StaticProvider = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => QueryFormValidatorDirective),
  multi: true
};

@Directive({
  selector: '[app-query-form][ngModel],[app-query-form][formControl],[app-query-form][formControlName]',
  providers: [QUERYFORM_VALIDATOR]
})
export class QueryFormValidatorDirective implements OnInit, OnDestroy, Validator {

  private _bag = new Subject<void>();
  private _reset_sign = new Subject<void>();
  private _onChange: () => void;

  constructor(
    private component: QueryFormComponent,
    private coordinator: OptionCheckCoordinatorService
  ) { }

  ngOnInit(): void {
    this.component._questionGroup.valueChanges.pipe(
      takeUntil(this._bag)
    ).subscribe(v => {
      if (this._onChange) { this._onChange(); }
    });

    // TODO: 需要解決 valueChange 之後 question 結構變更問題。
    this.component._questionGroup.valueChanges.pipe(
      take(1)
    ).subscribe( ({questions}) => {

      for (const question of questions) {
        if (question.RequireLink) {
          this.coordinator.register(question.RequireLink, this._bag)
            .subscribe( v => {
              if (this._onChange) { this._onChange(); }
            });
        }
      }
    });

  }

  ngOnDestroy(): void {
    this._bag.next();
    this._bag.complete();
  }

  validate(control: AbstractControl): ValidationErrors {

    if (this.component._disabled) { return null; }

    const questions = this.component._questionGroup.get("questions") as FormArray;

    const errors: any = {};

    // 檢查每一個問題。
    for (const qg of questions.controls as FormGroup[]) {

      // each Question FormGroup
      const q = qg.value as Question;

      if (!this.required(q)) { continue; }

      if (q.Type === "單選") {
        this.validSelect(qg, errors);
      } else if (q.Type === "複選") {
        this.validSelect(qg, errors);
      } else if (q.Type === "填答") {
        this.validTextInput(qg, errors);
      }
    }

    if (Object.getOwnPropertyNames(errors).length > 0) {
      return errors;
    } else {
      return null;
    }
  }

  private required(q: Question) {

    if (q.Require) { return true; }

    if (q.RequireLink) {
      return this.coordinator.getState(q.RequireLink);
    }
  }

  private validSelect(qg: FormGroup, errors: any) {
    const optionsArray = this.getOptionsControl(qg);
    const question = qg.value as Question;
    let qValid = false;
    let oMsg = null;

    for (const og of optionsArray) {
      const option = og.value as Option;
      // 只要有 check 任何一個 option 都是 valid 狀態。
      qValid = qValid || option.AnswerChecked;

      if (option.AnswerChecked) {
        const matrix = og.get("AnswerMatrix") as FormControl;
        if (!matrix.valid) { oMsg = "已選擇的項目空格需要填值。"; }
      }
    }

    if (!qValid) {
      errors[question.QuestionCode] = "必選題需要選擇一個項目。";
    }

    if (oMsg && qValid) {
      errors[question.QuestionCode] = oMsg;
    }
    return errors;
  }

  private validTextInput(qg: FormGroup, errors: any) {
    const optionsArray = this.getOptionsControl(qg);
    const question = qg.value as Question;
    let oMsg = null;

    for (const oGroup of optionsArray) {
      const matrix = oGroup.get("AnswerMatrix") as FormControl;
      if (!matrix.valid) { oMsg = "項目空格需要填值。"; }
      if (matrix.value && matrix.value.length <= 0) { oMsg = "項目空格需要填值。"; }
    }

    if (oMsg) {
      errors[question.QuestionCode] = oMsg;
    }

    return errors;
  }

  private getOptionsControl(qg: FormGroup) {
    // Options 是一個 FormArray，他的 controls 屬性才是 FormGroup[]。
    return (qg.get("Options") as FormArray).controls as FormGroup[];
  }

  registerOnValidatorChange?(fn: () => void): void {
    this._onChange = fn;
  }
}
