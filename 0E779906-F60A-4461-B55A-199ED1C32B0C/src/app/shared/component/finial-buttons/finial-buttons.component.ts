import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-finial-buttons',
  templateUrl: './finial-buttons.component.html',
  styleUrls: []
})
export class FinialButtonsComponent implements OnInit {

  /**目前階段 */
  @Input() currLevel: string;

  /**是否顯示收到加退選單資訊 */
  @Input() showSCReceivedMsg: boolean;

  /**E辦收到加退選單訊息內容 */
  @Input() scReceivedMsg: string;

  /**點選確認最終選課結果的事件 */
  @Output() onFinalChecked = new EventEmitter();

  /**點選列印加退選單的事件 */
  @Output() onPrintDocument = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  /**確認最終選課結果*/
  clickFinalCheck() {
    this.onFinalChecked.emit();
  }

  /**點選列印加退選單 */
  clickPrint() {
    this.onPrintDocument.emit();
  }
}
