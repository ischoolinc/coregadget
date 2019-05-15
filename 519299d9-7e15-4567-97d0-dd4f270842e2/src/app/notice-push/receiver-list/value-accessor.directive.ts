import { Directive, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Subject } from 'rxjs';
import { ReceiverListComponent } from './receiver-list.component';
import { takeUntil } from 'rxjs/operators';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'app-receiver-list[ngModel],app-receiver-list[formControl],app-receiver-list[formControlName]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ValueAccessorDirective),
    multi: true
  }]
})
export class ValueAccessorDirective implements OnInit, OnDestroy, ControlValueAccessor{

  private $dispose = new Subject<void>();

  private _onChange: any;

  constructor(
    private component: ReceiverListComponent
  ) { }

  ngOnInit(): void {
    this.component.receiversChange.pipe(
      takeUntil(this.$dispose)
    ).subscribe(v => {
      this._onChange(v);
    });
  }

  ngOnDestroy(): void {
    this.$dispose.next();
    this.$dispose.complete();
  }

  writeValue(obj: any): void {
    this.component.receivers = obj;
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
  }

}
