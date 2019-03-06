import { Directive, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

/** 負責處理 AnswerMatrix 變更時，將 radio、checkbox 勾選。 */
@Directive({
  selector: 'input[appAutoCheck]'
})
export class AutoCheckDirective implements OnInit, OnDestroy {

  private _bag = new Subject<void>();

  constructor(
    private optionGroup: ControlContainer,
    private elm: ElementRef<HTMLInputElement>
  ) { }

  ngOnInit(): void {
    const { control } = this.optionGroup;

    // 只處理 AnswerMatrix 變更才進行 checked。
    control.get("AnswerMatrix").valueChanges.pipe(
      takeUntil(this._bag),
      map(() => control.get("AnswerChecked").value)
    ).subscribe((chk) => {

      // 在 disabled 狀態執行會產生很怪的狀況。
      if (this.optionGroup.disabled) { return; }

      // 沒有 checked 才執行 click 事件。
      const { checked } = this.elm.nativeElement;
      if (!checked) {
        // 這會使 question 引發第二次事件
        // 一次是「AnswerMatrix」引起，一次是「AnswerChecked」引起。
        this.elm.nativeElement.click();
      }
    });
  }

  ngOnDestroy(): void {
    this._bag.next();
    this._bag.complete();
  }
}
