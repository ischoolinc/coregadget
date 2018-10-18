import { Injectable } from '@angular/core';
import { GadgetService } from '../gadget.service';
import { BasicService } from './basic.service';

@Injectable({
  providedIn: 'root'
})
export class TidyService {

  private _contract: any;

  constructor(
    private gadget: GadgetService,
    private basicsrv: BasicService,
  ) { }

  async getTidyContract() {
    if (!this._contract) {
      if (this.basicsrv.systemPosition === 'teacher') {
        this._contract = await this.gadget.getContract('ischool.tidy_competition.teacher');
      } else {
        this._contract = await this.gadget.getContract('ischool.tidy_competition.student');
      }
    }
  }

  // 取得單日評分
  async getMyScoreSheetByDate(date: string, class_id: string) {
    await this.getTidyContract();

    try {
      // 呼叫 service。
      const rspSheet = await this._contract.send('getMyScoreSheetByDate', {
        Request: {
          date: date,
          class_id: class_id,
        }
      });
      return [].concat(rspSheet.ScoreSheet || []);
    } catch (err) {
      throw (err.dsaError && err.dsaError.message) ? err.dsaError.message : '發生錯誤';
    }
  }

  // 取得我的班級有週排名資料的週次
  async getMyHasDataWeekly() {
    await this.getTidyContract();

    try {
      // 呼叫 service。
      const rspWeekly = await this._contract.send('getMyHasDataWeekly');
      return [].concat(rspWeekly.WeekNumber || []);
    } catch (err) {
      throw (err.dsaError && err.dsaError.message) ? err.dsaError.message : '發生錯誤';
    }
  }

  // 取得班級週排名
  async getMyWeeklyRank(week_number: string) {
    await this.getTidyContract();

    try {
      // 呼叫 service。
      const rspRank = await this._contract.send('getMyWeeklyRank', {
        Request: {
          week_number: week_number,
        }
      });

      const rspWeeklyRank = [].concat(rspRank.WeeklyRank || []);

      for (let item of rspWeeklyRank) {
        item.weekly_rank = [].concat(item.weekly_rank || []);
      }

      return rspWeeklyRank;
    } catch (err) {
      throw (err.dsaError && err.dsaError.message) ? err.dsaError.message : '發生錯誤';
    }
  }

}
