import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const OCS_CHECKBOX_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CheckboxComponent),
  multi: true
};

export interface CheckboxRect {
  value: any;
  selected: boolean;
  disabled: boolean;
}

let nextUniqueId = 0;

@Component({
  selector: 'app-checkbox[formControlName], app-checkbox[formControl], app-checkbox[ngModel]',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [OCS_CHECKBOX_CONTROL_VALUE_ACCESSOR],
})
export class CheckboxComponent implements ControlValueAccessor {

  inputId = `input_checkbox_${nextUniqueId++}`;
  myValue: any;
  value: any;
  checked: boolean;

  disabled: boolean;
  @Input() name: string;
  @Input() tabIndex: number;
  @Input() required: boolean;

  constructor() {
  }

  onInputChange(event: Event) {
    event.stopPropagation();
    this.myValue.selected = this.checked;
  }

  onInputClick(event: Event) {
    event.stopPropagation();
  }

  // 用來接收 registerOnChange 和 onTouched 傳入的方法
  onChange: (value: any) => {};
  onTouched: () => {};

  // 當資料從元件外部被變更時所呼叫的方法
  writeValue(obj: CheckboxRect) {
    if (obj) {
      this.myValue = obj;
      this.checked = obj.selected;
      this.value = obj.selected;
      this.disabled = obj.disabled;;
    } else {
      this.myValue = {};
    }
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
