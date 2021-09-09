import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {
  isOpen = false;

  constructor() { }

  /** 內部使用，學期清單 Ng-Template。 */
  @ViewChild('tplItemList', { static: true }) _tplItemList: CdkConnectedOverlay | undefined;

  /** 資料來源清單。 */
  @Input('rowSource') rowSource: any[]|undefined;

  /** 【樣式設定】下拉式選單有不同的樣式。 */
  @Input('styleName') styleName: any|undefined;

  /** 目前選擇的項目。 */
  @Input('selected') selected: any;

  /** 指定一個 function，用於顯示文字。 */
  @Input('displayWith') displayWith: ((record: any) => string) | any |undefined;

  /** 當選項變更時。 */
  @Output('change')  change = new EventEmitter<any>();

  /**是否讓他按下沒有反應 */
  @Input('isLock')  isLock :boolean |undefined;

  /** 引發「selected」事件。 */
  public emitSelect(record: any) {

    this.selected = record;
    if (this.change) {
      this.change.emit(record);
    }

    if(this.isOpen) {
      this.toggleOverlay();
    }
  }

  ngOnInit(): void {



    console.log("styleName",this.styleName);
  }

  /** 顯示或隱藏 Overlay。 */
  toggleOverlay() {

  console.log("islock",this.isLock )
    if(this.isLock)
    {
    return;

    }
    this.isOpen = !this.isOpen;

    if(!this.isOpen) {
      this._tplItemList?.overlayRef.detach();
    }
  }

  _displayWith(record: any) {
    if (this.displayWith) {
      return this.displayWith(record);
    } else {
      return record + '';
    }
  }

  _displaySelected() {
    console.log("displaywith",this.displayWith)
    if(this.displayWith) {
      return this.displayWith(this.selected)
    } else {
      return this.selected ?? ''
    }
  }

  _hasData() {
    return this.rowSource && this.rowSource.length >0;
  }

}