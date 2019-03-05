import { Component, OnInit, Input, OnDestroy, EventEmitter, Output, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { SentenceService } from '../dissector.service';
import { TokenData, SentenceDissector } from '../sentence-dissector';
import { FormBuilder, FormArray, Validators, } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isEqual } from 'lodash';

/*
example:
<app-sentence
  [disabled]="isDisabled" // 設定 input 的 disabled 狀態。
  [required]="isRequired" // 設定 input 的 required 設定，如果為 true 則所有 input 都需要有值。
  [(ngModel)]="matrix"  // 相容 angular 內鍵的 ngModel 用法。
  [text]="sentence"   // 設定 text pattern，例：「請輸入你的名字%TEXT2%」。
  #sentence></app-sentence>

  {{sentence.value}} // 使用 data binding 取得最終純文字，例：「請輸入你的名字聯邦銀行」。
*/

/**
 * 支援 Angular Form 的 ngModel、FormControl 功能。
 */
@Component({
  selector: 'app-sentence',
  templateUrl: './sentence.component.html',
  styleUrls: ['./sentence.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SentenceComponent implements OnInit, OnDestroy, OnChanges {

  // 用於 component destroy 時 release 資源。
  private _bag = new Subject<void>();

  _tokenGroup = this.fb.group({inputs: new FormArray([])});
  _required = false; // 是否所有欄位都是必填狀態。
  _is_plain_text = false;

  public _disabled = false; // 是否停用所有 input。
  private _dissector: SentenceDissector;
  private _ui_dirty = false; // 代表畫面需要更新。

  _call_count = 0;

  constructor(
    private srv: SentenceService, // 用於解析 text 用的服務。
    private fb: FormBuilder // angular 動態表單機制。
  ) { }

  @Input() text: string;

  // 這個屬性也有可能透過 value accessor directive 寫入。
  @Input() matrix: string[];

  /**
   * matrix 變更時。
   */
  @Output() matrixChange = new EventEmitter<string[]>();

  /**
   * 取得最後產出的文字。
   */
  public get value() {
    const val = this._tokenGroup.value.inputs as TokenData[];
    return this.srv.join(val);
  }

  /** 判斷是否填寫完整，若%RTEXT%項目留空=false */
  public get completed() {
    const tokens = this._tokenGroup.value.inputs as TokenData[];

    for (const token of tokens) {
      if (token.type === 'keyword' && !!!token.value) {
        return false;
      }
    }

    return true;
  }

  // 用於任何 input 被 touch 引發，通知外部程式已被 touch。
  _matrixTouched = new EventEmitter<void>();

  public applyRequireConf(required: boolean) {
    // 內部所有產生出來的 input 都會 binding 這個屬性。
    this._required = required;

    const inputs = this._tokenGroup.get("inputs") as FormArray;
    for (const input of inputs.controls) {

      const token = input.value as TokenData;
      if (token.type === "keyword") { // keyword 才需要驗證。

        const valCtl = input.get("value");
        if (this._required) {
          valCtl.setValidators(control => {
            if (control.value || control.value === 0) {
              return null;
            } else {
              return {token_value: '此欄位必填。'}; // 有填值時為 true。
            }
          });
        } else {
          valCtl.clearValidators();
        }

      }
    }
  }

  // 用於 value accessor directive 呼叫，啟用或停用所有 input。
  _setDisabledState(isDisabled: boolean) {
    this._disabled = isDisabled;
    this.setDisabled(this._disabled);
  }

  public setUIDirty() {
    this._ui_dirty = true;
  }

  // input blur 事件呼叫，引發事件通知 value accessor directive 此 control 已被 touch。
  _touched() {
    this._matrixTouched.emit();
  }

  /**
   * 取得 matrix 裡面每一元素所代表的相關資訊。
   */
  _getTokenControls() {
    this._call_count++;
    const arr = this._tokenGroup.get("inputs") as FormArray;
    return (arr || { controls: [] }).controls;
  }

  _getGroupStyle(data: TokenData) {
    if (data.size < 0) {
      return {
        flex: 1,
      };
    } else {
      return {};
    }
  }

  // 產生畫面時取得相應的樣式(寬度)。
  _getControlStyle(data: TokenData) {

    const base = 100;
    let size = 1;

    if (data.size > 0) {
      size = data.size;
    }

    return {
      width: `${size * base}px`,
      flex: 1,
      // 在語法中暫不單獨支援 required 的設定。
      // 'border-bottom-color': data.required ? 'red' : 'unset'
    };
  }

  ngOnInit() {

    this._tokenGroup.valueChanges
      .pipe(takeUntil(this._bag)) // 元件 destroy 時 release 資源。
      .subscribe(v => {
        // 變更 disable 狀態時，會引發此事件，我不確定是 bug 還是本來就這樣，但會造成怪怪現像。
        if (!this._tokenGroup.disabled) {
          const { inputs }: { inputs: TokenData[] } = v;
          const newMatrix = inputs.map(t => t.value);

          if (!isEqual(this.matrix, newMatrix)) {
            this.matrix = newMatrix;
            this.matrixChange.emit(this.matrix);
          }

        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.text) {
      const { previousValue, currentValue } = changes.text;

      if (previousValue !== currentValue) {
        if (!currentValue) {
          this._dissector = null;
        } else {
          if (this._testPlainText(currentValue)) { return; }
          this._dissector = this.srv.create(currentValue);
        }
        this.setUIDirty();
      }
    }

    if (changes.matrix) {
      const { previousValue, currentValue } = changes.matrix;

      if (!isEqual(previousValue, currentValue)) {
        if (!currentValue) {
          this.resetValues();
        } else {
          this.setUIDirty();
        }
      }
    }

    this.applyChanges();
  }

  public _testPlainText(currentValue: string) {
    if (!this.srv.test(currentValue)) {
      this._is_plain_text = true;
      return true;
    } else {
      this._is_plain_text = false;
      return false;
    }
  }

  applyChanges() {

    if (this._is_plain_text) { return; }

    if (this._ui_dirty && this._dissector && this.matrix) {
      const tokens = this._dissector.applyMatrix(this.matrix);
      const controls = tokens.map(v => {
        if (v.type === "keyword" && this._required) {
          const g = { ...v, value: [v.value, Validators.required] };
          return this.fb.group(g);
        } else {
          return this.fb.group(v);
        }
      });

      this._tokenGroup.setControl("inputs", this.fb.array(controls));

      this.setDisabled(this._disabled);
      this._ui_dirty = false;
    }

  }

  private setDisabled(disabled: boolean) {

    if (disabled) {
        this._tokenGroup.disable();
      } else {
        this._tokenGroup.enable();
      }
  }

  public resetValues() {
    const { inputs } = this._tokenGroup.controls;

    for (const ctl of ((inputs || { controls: [] }) as FormArray).controls) {
      ctl.patchValue({ value: '' });
    }
  }

  ngOnDestroy() {
    // 產生一個值使相關 Subscritpion 解除。
    this._bag.next();
    this._bag.complete();
  }
}
