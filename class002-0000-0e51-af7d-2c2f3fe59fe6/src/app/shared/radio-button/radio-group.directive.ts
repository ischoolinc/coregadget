import { Directive, EventEmitter, forwardRef, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RadioButtonComponent } from './radio-button.component';

export const OCS_RADIO_GROUP_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RadioGroupDirective),
  multi: true
};


@Directive({
  selector: '[appRadioGroup]',
  providers: [OCS_RADIO_GROUP_CONTROL_VALUE_ACCESSOR],
})
export class RadioGroupDirective implements ControlValueAccessor {

  radios: RadioButtonComponent[] = [];

  @Output() change: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  pushRadio(item: RadioButtonComponent) {
    this.radios.push(item);
  }

  checkRadio(item: RadioButtonComponent) {
    const hasDisabled = this.radios.find(v => v.disabled);
    if (!hasDisabled) {
      this.radios.forEach(v => {
        if (v.value === item.value) {
          v.checked = true;
          this.onChange(item.value);
          this.change.emit(item.value);
        } else {
          v.checked = false;
        }
      });
    }
  }

  // 用來接收 registerOnChange 和 onTouched 傳入的方法
  onChange!: (value: any) => {};
  onTouched!: () => {};

  // 當資料從元件外部被變更時所呼叫的方法
  writeValue(value: any) {
    this.radios.forEach(v => {
      v.checked = (v.value === value);
    });
  }

  // 將一個方法傳入，在元件內呼叫此方法時即代表表單控制項的值有變更
  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  // 類似 registerOnChange()，但是是 touched 狀態發生時呼叫
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  // 當 disabled 狀態變更時會呼叫這個方法
  setDisabledState(isDisabled: boolean) {
  }
}
