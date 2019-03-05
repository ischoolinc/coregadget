import { Directive, OnInit, HostListener, Optional, Input, OnDestroy, ElementRef } from '@angular/core';
import { ControlContainer, FormArray, FormGroup, AbstractControl, FormControl } from '@angular/forms';
import { RadioGroupDirective } from './radio-group.directive';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OptionCheckCoordinatorService } from '../option-check-coordinator.service';
import { Option } from './model';

/**
 * 負責處理當 radio 被 click 時，會更新相關的 AnswerChecked 值。
 * 主要是因為 html 內鍵的 radio 行為不符合需求。
 */
@Directive({
  selector: 'input[appRadio]'
})
export class RadioDirective implements OnInit, OnDestroy {

  private _bag = new Subject<void>();

  constructor(
    private option: ControlContainer, // 只能用在 FormGroup、FormArray。
    private options: RadioGroupDirective,
    private elm: ElementRef<HTMLInputElement>,
    private coordinator: OptionCheckCoordinatorService
  ) { }

  /** 對應要更新的欄位名稱。 */
  @Input() appRadio: string;

  @Input() optionCode: string;

  @HostListener('click') click() {
    const question = this.options.formGroup;
    const options = question.get("Option") as FormArray;

    // 以下程式需要達到的效果是只更新 AnswerChecked。
    // 並且只引發一次 Question 層級的 valueChanges 事件。
    let checkedOption: AbstractControl;
    for (const optGrp of options.controls) {
      const option = optGrp.value as Option;

      if (option.OptionCode === this.optionCode) {
        checkedOption = optGrp;
      } else {
        if (option.AnswerChecked) {
          optGrp.patchValue({"AnswerChecked": false}, {emitEvent: false });
        }
      }
    }

    if (checkedOption) {
      // 這裡才引發 Question 層級的 valueChanges 事件。
      checkedOption.patchValue({ "AnswerChecked": true });
    }
  }

  ngOnInit(): void {

    // 第一次設值。
    this.setChecked(this.option.control.value);

    this.option.control.valueChanges.pipe(
      takeUntil(this._bag)
    )
      .subscribe(v => {
        this.setChecked(v); // 值有變化時。
      });
  }

  ngOnDestroy(): void {
    this._bag.next();
    this._bag.complete();
  }

  setChecked(option: any) {
    const val = option[this.appRadio];
    this.elm.nativeElement.checked = val;
  }
}
