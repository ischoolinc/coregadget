import { Injectable } from '@angular/core';
import { MatSnackBar} from '@angular/material';
import { GadgetService } from '../gadget.service';

@Injectable({
  providedIn: 'root'
})
export class BasicService {

  private _publicContract: any;

  constructor(
    private gadget: GadgetService,
    public snackBar: MatSnackBar,
  ) {

  }

  async getPublicContract() {
    if (!this._publicContract) this._publicContract = await this.gadget.getContract('basic.public');
  }

  /**
   * 取得系統日期
   */
  async getDate() {
    await this.getPublicContract();

    try {
      // 呼叫 service。
      const rspToday = await this._publicContract.send('beta.GetNow');
      return rspToday.DateTime.replace(/\//gi, '-');
    } catch (err) {
      throw (err.dsaError && err.dsaError.message) ? err.dsaError.message : '發生錯誤';
    }
  }

  /**
   * 頁面下方的 SnackBar
   * @param style 樣式
   * @param message 訊息文字
   * @param action 按鈕文字
   */
  openSnackBar(message: string, style = 'bg-danger', action = '') {
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: style,
    });
  }

}
