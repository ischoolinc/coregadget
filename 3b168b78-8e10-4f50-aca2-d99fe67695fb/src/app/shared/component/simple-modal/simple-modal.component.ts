import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-simple-modal',
  templateUrl: './simple-modal.component.html',
  styleUrls: ['./simple-modal.component.css']
})
export class SimpleModalComponent implements OnInit {

  /**標題 */
  title = '';

  /**內容 html */
  content = '';

  /**內容的 css */
  bodyClass = '';

  /**確定鈕 */
  okBtn: any = {
    text: '確定',
    loadingText: '處理中...',
    show: true,
    clickBtn: null,
  };

  /**取消鈕 */
  cancelBtn: any = {
    text: '取消',
    show: true,
    clickBtn: null,
  };

  /**錯誤訊息 */
  errorMsg = '';

  /**內部使用 */
  okBtnTitle = '';
  okBtnEnabled = true;
  okBtnDisabled = null;
  cancelBtnTitle = '';
  cancelBtnEnabled = true;

  constructor(public modalRef: BsModalRef) { }

  ngOnInit() {
    this.okBtnTitle = this.okBtn.text;
    this.okBtnEnabled = this.okBtn.show;
    this.cancelBtnTitle = this.cancelBtn.text;
    this.cancelBtnEnabled = this.cancelBtn.show;
  }

  /**按下確定鈕 */
  clickOk() {
    this.errorMsg = '';

    if (this.okBtn.loadingText) {
      this.okBtnDisabled = 'disabled';
      this.okBtnTitle = this.okBtn.loadingText;
    }
    if (this.okBtn.clickBtn) {
      this.okBtn.clickBtn();
    }
  }

  /**按下取消鈕 */
  clickCancel() {
    if (this.cancelBtn.clickBtn) {
      this.cancelBtn.clickBtn();
    } else {
      this.modalRef.hide();
    }
  }

  resetOkBtn() {
    this.okBtnDisabled = null;
    this.okBtnTitle = this.okBtn.text;
  }

}
