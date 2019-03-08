import { Directive, forwardRef, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { SentenceComponent } from './sentence.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

export const SENTENCE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SentenceValueAccessorDirective),
  multi: true
};

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'app-sentence[ngModel],app-sentence[formControl],app-sentence[formControlName]',
  providers: [SENTENCE_VALUE_ACCESSOR]
})
export class SentenceValueAccessorDirective implements OnInit, OnDestroy, ControlValueAccessor {

  private _bag = new Subject<void>();

  private _onChange: any;
  private _onTouched: any;

  constructor(
    private component: SentenceComponent,
    private change: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.component.matrixChange
    .pipe(takeUntil(this._bag))
    .subscribe(v => {
      // 變更 disable 狀態時，會引發此事件，我不確定是 bug 還是本來就這樣，但會造成怪怪現像。
      if (!this.component._disabled) {
        if (this._onChange) {
          this._onChange(v);
        }
      }
    });

    this.component._matrixTouched
    .pipe(takeUntil(this._bag))
    .subscribe(v => {
      this._onTouched();
    });
  }

  ngOnDestroy(): void {
    this._bag.next();
    this._bag.complete();
  }

  writeValue(obj: any): void {
    this.component.matrix = obj;

    if (!obj) {
      this.component.resetValues();
    } else {
      this.component.setUIDirty();
      this.component.applyChanges();
    }

    this.change.markForCheck();
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.component._setDisabledState(isDisabled);
  }
}
