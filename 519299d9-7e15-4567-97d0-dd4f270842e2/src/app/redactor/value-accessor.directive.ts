import { Directive, forwardRef, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { RedactorComponent } from './redactor.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Directive({
// tslint:disable-next-line: directive-selector
  selector: 'app-redactor[ngModel],app-redactor[formControl],app-redactor[formControlName]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RedactorValueAccessorDirective),
    multi: true
  }]
})
export class RedactorValueAccessorDirective implements OnInit, OnDestroy, ControlValueAccessor {

  private $dispose = new Subject<void>();

  private _onChange: any;
  private _onTouched: any;

  constructor(
    private component: RedactorComponent
  ) { }

  ngOnInit(): void {
    this.component.htmlChange.pipe(
      takeUntil(this.$dispose)
    ).subscribe((v: string) => {
      this._onChange(v);
    });

    this.component.focus.pipe(
      takeUntil(this.$dispose)
    ).subscribe(() => {
      this._onTouched();
    });
  }

  ngOnDestroy(): void {
    this.$dispose.next();
    this.$dispose.complete();
  }

  writeValue(obj: any): void {
    this.component.html = obj;
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
  }
}
