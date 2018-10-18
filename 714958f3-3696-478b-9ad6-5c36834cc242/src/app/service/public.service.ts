import { Injectable } from '@angular/core';
import { GadgetService } from '../gadget.service';
import { SimpleEvent, HistoryEvent } from '../data';

import * as moment from 'moment';
const FormatDate = 'YYYY-MM-DD';

@Injectable({
  providedIn: 'root'
})
export class PublicService {

  private _contract: any;

  constructor(
    private gadget: GadgetService,
  ) {}

  async getPublicContract() {
    if (!this._contract) this._contract = await this.gadget.getContract('ischool.public.sports');
  }

  /**
   * 取得歷史賽事年度
   */
  async getSchoolYearList() {
    await this.getPublicContract();

    try {
      const data = await this._contract.send('getSchoolYearList');
      return [].concat(data.SchoolYearList || []);
    } catch (err) {
      throw (err.dsaError && err.dsaError.message) ? err.dsaError.message : '發生錯誤';
    }
  }

  /**
   * 取得歷史賽事結果
   */
  async getYearEventHistoricals(school_year: string) {
    await this.getPublicContract();

    try {
      const data = await this._contract.send('getYearEventHistoricals', {
        Request: {
          school_year: school_year
        }
      });
      let rsp = [].concat(data.Events || []);
      rsp = rsp.map(item => {
        item.event_start_date = moment(item.event_start_date).format(FormatDate);
        item.event_end_date = moment(item.event_end_date).format(FormatDate);
        item.ranks = [].concat(item.ranks || []);
        return item;
      });
      for(const item of rsp) {
        item.ranks = item.ranks.map(rank => {
          // rank.players = (rank.players) ? JSON.parse(rank.players) : [];
          if (rank.players) {
            rank.players = JSON.parse(rank.players);
          } else {
            rank.players = [];
          }
          return rank;
        });
      }
      return rsp as HistoryEvent[];
    } catch (err) {
      throw (err.dsaError && err.dsaError.message) ? err.dsaError.message : '發生錯誤';
    }
  }

}
