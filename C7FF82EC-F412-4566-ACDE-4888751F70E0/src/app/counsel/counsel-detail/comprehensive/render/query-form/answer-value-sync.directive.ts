import { Directive, OnInit, OnDestroy } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/** 負責處理當 matrix 變更時，自動將值寫入到 AnswerValue 中。 */
@Directive({
  selector: 'app-sentence[appAnswerValueSync]'
})
export class AnswerValueSyncDirective implements OnInit, OnDestroy {

  private _sign = new Subject<void>();

  constructor(
    private container: ControlContainer
  ) {
  }

  ngOnInit(): void {
    const { control } = this.container;

    control.get("AnswerMatrix").valueChanges.pipe(
      takeUntil(this._sign)
    ).subscribe( v => {
      // 將資料寫入 AnswerValue 欄位。
      control.patchValue({ AnswerValue: v.join('') }, { emitEvent: false });
    });

  }

  ngOnDestroy(): void {
    this._sign.next();
    this._sign.complete();
  }

}
