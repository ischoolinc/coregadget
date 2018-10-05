import { Injectable } from '@angular/core';
import { GadgetService } from '../gadget.service';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class BasicService {

  private _systemPosition: string;
  private _publicContract: any;
  private _studentContract: any;
  private _teacherContract: any;

  constructor(
    private gadget: GadgetService,
  ) {

  }

  async getPublicContract() {
    if (!this._publicContract) this._publicContract = await this.gadget.getContract('basic.public');
  }

  async getTeacherContract() {
    if (!this._teacherContract) this._teacherContract = await this.gadget.getContract('basic.teacher');
  }

  async getStudentContract() {
    if (!this._studentContract) this._studentContract = await this.gadget.getContract('basic.student');
  }


  // 取得今天日期，並設定為最大日期
  async getToday() {
    await this.getPublicContract();

    try {
      // 呼叫 service。
      const rspToday = await this._publicContract.send('beta.GetNow');
      return moment(rspToday.DateTime, 'YYYY-MM-DD');
    } catch (err) {
      throw (err.dsaError && err.dsaError.message) ? err.dsaError.message : '發生錯誤';
    }
  }

  // 取得我的所有班級
  async getMyClass() {
    try {
      if (this.systemPosition === 'teacher') {
        await this.getTeacherContract();

        const data = await this._teacherContract.send('GetMyClass');
        return [].concat(data.Class || []);
      } else {
        await this.getStudentContract();

        const data = await this._studentContract.send('GetMyClass');
        return [data];
      }
    } catch (err) {
      throw (err.dsaError && err.dsaError.message) ? err.dsaError.message : '發生錯誤';
    }
  }

  set systemPosition(val) {
    this._systemPosition = val;
  }

  get systemPosition() {
    return this._systemPosition;
  }
}
