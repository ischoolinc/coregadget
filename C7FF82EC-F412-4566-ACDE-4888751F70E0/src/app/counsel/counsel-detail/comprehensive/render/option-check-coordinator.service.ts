import { Injectable, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { filter, tap, takeUntil } from 'rxjs/operators';

export interface OptionState { OptionCode: string; AnswerChecked: boolean; }

@Injectable({
  providedIn: 'root'
})
export class OptionCheckCoordinatorService {

  private _emitEventMap = new Map<string, number>();
  private _checkStateMap = new Map<string, boolean>();
  private _coordinator = new Subject<OptionState>();

  constructor() { }

  /** 註冊一個 Option 的 AnswerChecked 狀態變化。 */
  public register(optionCode: string, disposeSign: Observable<void>) {

    const count = this._emitEventMap.get(optionCode);
    if (!count) {
      this._emitEventMap.set(optionCode, 1);
    } else {
      this._emitEventMap.set(optionCode, count + 1);
    }

    return this._coordinator.pipe(
      takeUntil(disposeSign),
      filter(v => v.OptionCode === optionCode),
      tap(null, null, () => {
        this.decreaseRefCount(optionCode);
      })
    );
  }

  /** 發送一個 Option 的 AnswerChecked 變化。 */
  public emit(optionCode: string, checkState: boolean) {
    this._checkStateMap.set(optionCode, checkState);

    if (this._emitEventMap.has(optionCode)) {
      this._coordinator.next({ OptionCode: optionCode, AnswerChecked: checkState });
    }
  }

  /** 取得指定 Option 的狀態。 */
  public getState(optionCode: string) {
    return this._checkStateMap.get(optionCode);
  }

  /** 設定一整批的 Option 狀態，但不會引發事件。 */
  public setStates(options: OptionState[]) {
    for (const option of options) {
      this.setState(option);
    }
  }

  private setState(option: OptionState) {
    const { OptionCode, AnswerChecked } = option;

    // 「新狀態」與「目前狀態」相同就不執行資料設定與事件引發。
    if (this._checkStateMap.get(OptionCode) === AnswerChecked) { return; }

    this._checkStateMap.set(OptionCode, AnswerChecked);

    // 果有包含，表示有人訂閱就 emit event。
    if (this._emitEventMap.has(OptionCode)) {
      this.emit(OptionCode, AnswerChecked);
    }
  }

  private decreaseRefCount(optionCode: string) {
    const deleteCount = this._emitEventMap.get(optionCode);
    if (deleteCount) {
      if ((deleteCount - 1) > 0) {
        this._emitEventMap.set(optionCode, deleteCount - 1);
      } else {
        this._emitEventMap.delete(optionCode);
      }
    }
  }
}
