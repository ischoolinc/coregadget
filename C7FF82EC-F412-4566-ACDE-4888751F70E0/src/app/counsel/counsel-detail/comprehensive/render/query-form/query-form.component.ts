import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Question, Option } from './model';
import { FormBuilder, FormArray, FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OptionCheckCoordinatorService } from '../option-check-coordinator.service';
import { flatten } from 'lodash';
import { SentenceService } from '../dissector.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[app-query-form]',
  templateUrl: './query-form.component.html',
  styleUrls: ['./query-form.component.css'],
  exportAs: 'appQueryForm'
})
export class QueryFormComponent implements OnInit, OnDestroy, OnChanges {

  private _bag = new Subject<void>();
  private _valueChangesRegistered = false;
  private _originValue: string; // 原始值，用於 resetValue。

  _questionGroup = this.fb.group({ "questions": new FormArray([]) });

  _required = true;

  constructor(
    private fb: FormBuilder,
    private coorniator: OptionCheckCoordinatorService,
    private dissector: SentenceService
  ) { }

  @Input() dataSource: Question[];

  @Output() dataSourceChange = new EventEmitter<Question[]>(true);

  @Input() debug: boolean;

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.dataSource) {
      this._applyOptionsState();
      this._initQuestionGroup();
    }
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this._bag.next();
    this._bag.complete();
  }

  /** 將所有值還原到剛開始「未修改(不一定是空值)」的狀態。 */
  public resetValues() {
    if (this._questionGroup.disabled) {
      // 主要是因為 auth-check directive 會衝突。
      // 在 disabled 狀態 reset 會造成，enabled 時將全部 option 進行 check。
      throw new Error(`disabled 狀態無法 resetValues。`);
    }

    this._initQuestionGroup(true);
  }

  /** 是否為單題目單選項的 TextArea Query。 */
  _isSingleTextAreaOption() {
    if (!this.dataSource) { return false; }

    if (this.dataSource.length > 1) { return false; }
    if (this.dataSource[0].Options.length > 1) { return false; }
    if (this.dataSource[0].Text) { return false; }

    const sentence = this.dissector.create(this.dataSource[0].Options[0].OptionText);

    return sentence.containsTextArea;
  }

  _getQuestionsControl() {
    const ctl = this._questionGroup.get("questions") as FormArray;
    return (ctl || { controls: [] }).controls as FormGroup[];
  }

  _getOptionsControl(q: FormGroup) {
    const ctl = q.get("Options") as FormArray;
    return (ctl || { controls: [] }).controls;
  }

  get _disabled() {
    return this._questionGroup.disabled;
  }

  // 這裡只是為了在 html 中有 intellscense.
  _opt(o: FormGroup): Option {
    return o.value;
  }

  _quest(q: FormGroup): Question {
    return q.value;
  }

  _setDisabledState(isDisabled: boolean) {
    if (isDisabled) {
      this._questionGroup.disable();
    } else {
      this._questionGroup.enable();
    }
  }

  /** 依 dataSource 最新狀態產生畫面。 */
  _initQuestionGroup(toOriginal = false) {
    let data = this.dataSource;

    if (toOriginal) { // 還原到原始值。
      data = JSON.parse(this._originValue);
    } else {
      this._originValue = JSON.stringify(data);
    }

    if (!data) { data = []; }

    const questionArray = data.map(quest => {
      const optionArray = quest.Options.map(opt => {
        return this.fb.group({
          ...opt,
          "AnswerMatrix": new FormControl(opt.AnswerMatrix),
        });
      });
      return this.fb.group({
        ...quest,
        "Options": new FormArray(optionArray)
      });
    });
    this._questionGroup.setControl("questions", new FormArray(questionArray));

    this._registerValueChanges();
  }

  /** 註冊 question group 的資料變更事件，並更新回 dataSource 屬性。 */
  _registerValueChanges() {
    if (this._valueChangesRegistered) { return; }

    this._questionGroup.valueChanges.pipe(
      takeUntil(this._bag)
    ).subscribe(v => {
      if (!this._questionGroup.disabled) {
        // 傳入的是陣列，但是 reactive form 機制關系，新增了 questions。
        this.dataSource = v.questions;
        this._applyOptionsState();
        this.dataSourceChange.emit(this.dataSource);
      }
    });
    this._valueChangesRegistered = true;
  }

  _applyOptionsState() {
    const optionHierarchy = this.dataSource
      .filter(v => v.Type === "單選" || v.Type === "複選")
      .map(v => v.Options);

      // TODO: 之後需要考慮如果此 component 消滅時是否需要清除相關資料。
    this.coorniator.setStates(flatten(optionHierarchy));
  }

  _resetOptionsState() {
    // 設計清除相關 state 機制。
  }
}
