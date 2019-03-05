import { Directive, OnInit, OnDestroy } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/** 負責處理當 matrix 變更時，自動將值寫入到 AnswerValue、AnswerComplete 中。 */
@Directive({
  selector: 'app-sentence[appAnswerResultSync]'
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

      // 判斷是否陣列中有空白，有空白代表 AnswerComplete 應該為 false。
      const empty = (v as string[]).filter(val => !val);

      // 將資料寫入 AnswerValue、AnswerComplete 欄位。
      control.patchValue({
        AnswerValue: v.join(''),
        AnswerComplete: (empty.length <= 0)
      }, { emitEvent: false });

    });

  }

  ngOnDestroy(): void {
    this._sign.next();
    this._sign.complete();
  }

}
