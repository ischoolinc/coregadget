import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const OCS_SEARCH_BAR_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SearchBarComponent),
  multi: true
};


@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  providers: [OCS_SEARCH_BAR_CONTROL_VALUE_ACCESSOR],
})
export class SearchBarComponent implements OnInit, ControlValueAccessor {

  @Input() placeHolder: string;
  @Input() value = '';
  @Output() valueChanges = new EventEmitter<string>();
  @Output() onClear = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  onInput(value: string) {
    this.onChange(value);
    this.valueChanges.emit(value);
  }

  doClear() {
    this.value = '';
    this.onChange('');
    this.onClear.emit();
  }

  // 用來接收 registerOnChange 和 onTouched 傳入的方法
  onChange: (value) => {};
  onTouched: () => {};

  // 當資料從元件外部被變更時所呼叫的方法
  writeValue(value: any) {
    this.value = value;
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
