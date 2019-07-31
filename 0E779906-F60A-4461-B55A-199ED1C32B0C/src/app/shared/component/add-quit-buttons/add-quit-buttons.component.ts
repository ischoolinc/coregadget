import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { TooltipDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-add-quit-buttons',
  templateUrl: './add-quit-buttons.component.html',
  styleUrls: []
})
export class AddQuitButtonsComponent implements OnInit {

  conflictState: boolean;

  @ViewChild('sendBotton', { static: true })
  private sendBotton: TooltipDirective;

  /**目前勾選課程衝突狀態 */
  @Input() set conflicted(value: boolean) {
    this.conflictState = value;
    if (value) {
      this.sendBotton.tooltip = '紅底為衝堂或不得重複加選';
      this.sendBotton.show();
    } else {
      this.sendBotton.tooltip = '';
      this.sendBotton.hide();
    }
  };

  /**點選送出鈕的事件 */
  @Output() onConfirmSave = new EventEmitter();

  /**點選重設鈕的事件 */
  @Output() onResetAddQuit = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  /**點選送出鈕 */
  clickConfirmSave() {
    this.onConfirmSave.emit();
  }

  /**點選重設鈕 */
  clickResetAddQuit() {
    this.onResetAddQuit.emit();
  }

}
