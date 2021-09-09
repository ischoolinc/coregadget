import { Directive, ElementRef, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

export const OCS_OBJECT_CHECKBOX_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ObjectCheckboxDirective),
  multi: true
};

/**
 * checkbox 為一個物件，依 selected 來判斷狀態
 *
 * 用法：
 * checkbox 的來源需為物件，包含 { selected, disabled }
 * 在 <input type="checkbox"> 中加上屬性「objCheckbox」
 *
 * ts 檔範例:
 * myForm: FormGroup;
 * items: any[] = [
 *  { name: "教師姓名", value: "TeacherName", selected: true, disabled: false },
 *  { name: "登入帳號", value: "LinkAccount", selected: false, disabled: false }
 * ]
 *
 * ngOnInit() {
 *   this.myForm = new FormGroup({
 *     impts: this.createImportFields(this.imptItems)
 *   });
 * }
 *
 * createImportFields(items: any[]) {
 *   const arr = items.map(v => {
 *     return new FormControl(v);
 *   });
 *   return new FormArray(arr);
 * }
 *
 * html 檔範例:
 * <ng-container *ngFor="let item of myForm.get('items')['controls'];>
 *   <input type="checkbox" name="input1" [formControl]="item" objCheckbox>{{items[idx].name}}
 * </ng-container>
 *
 * @export
 * @class ObjectCheckboxDirective
 * @implements {ControlValueAccessor}
 */
@Directive({
  selector: "input[type=checkbox][objCheckbox]",
  providers: [OCS_OBJECT_CHECKBOX_CONTROL_VALUE_ACCESSOR]
})
export class ObjectCheckboxDirective implements ControlValueAccessor {
  myValue: any;

  // 用來接收 registerOnChange 和 onTouched 傳入的方法
  onChange: (value) => {};
  onTouched: () => {};

  constructor(private elem: ElementRef) {
    elem.nativeElement.addEventListener("change", event => {
      if (event.currentTarget.checked) {
        this.myValue.selected = true;
      } else {
        this.myValue.selected = false;
      }
      this.onChange(this.myValue);
    });
  }

  // 當資料從元件外部被變更時所呼叫的方法
  writeValue(obj: any) {
    if (obj) {
      this.myValue = obj;
      this.elem.nativeElement.checked = this.myValue.selected;
      this.elem.nativeElement.disabled = this.myValue.disabled;
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
    this.myValue.disabled = isDisabled;
  }
}
