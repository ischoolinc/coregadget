import { Injectable } from '@angular/core';
import { GadgetService } from '../gadget.service';
import { SportEvent, Player, Team, LoginAccount } from '../data';

import * as moment from 'moment';
const FormatDate = 'YYYY-MM-DD';

@Injectable({
  providedIn: 'root'
})
export class SportService {

  private _contract: any;
  private _eventMap: Map<string, SportEvent> = new Map();
  private _myInfo: LoginAccount;

  constructor(
    private gadget: GadgetService,
  ) {}

  async getSportsContract() {
    if (!this._contract) this._contract = await this.gadget.getContract('ischool.sports.student');
  }

  /**
   * 取得現有比賽項目(公告起始日~活動結束日)及我是否有報名
   */
  async getActionEvents() {
    await this.getSportsContract();

    try {
      const data = await this._contract.send('getCurrentEvents');
      const rsp = [].concat(data.Events || []) as SportEvent[];
      return rsp.map(item => {
        item.reg_start_date = (item.reg_start_date ? moment(item.reg_start_date).format(FormatDate) : null);
        item.reg_end_date = (item.reg_end_date ? moment(item.reg_end_date).format(FormatDate) : null);
        item.event_start_date = (item.event_start_date ? moment(item.event_start_date).format(FormatDate) : null);
        item.event_end_date = (item.event_end_date ? moment(item.event_end_date).format(FormatDate) : null);
        item.draw_lots_start_date = (item.draw_lots_start_date ? moment(item.draw_lots_start_date).format(FormatDate) : null);
        item.draw_lots_end_date = (item.draw_lots_end_date ? moment(item.draw_lots_end_date).format(FormatDate) : null);

        this._eventMap.set(item.uid, item);
        return item;
      });
    } catch (err) {
      throw (err.dsaError && err.dsaError.message) ? err.dsaError.message : '發生錯誤';
    }
  }

  /**
   * 取得個人賽-已報名選手清單
   * @param event_id 比賽項目編號
   */
  async getEventPlayers(event_id: string) {
    await this.getSportsContract();

    try {
      const data = await this._contract.send('getEventPlayers', {
        Request: { event_id: event_id }
      });
      return [].concat(data.Players || []) as Player[];
    } catch (err) {
      throw (err.dsaError && err.dsaError.message) ? err.dsaError.message : '發生錯誤';
    }
  }

  /**
   * 取得團體賽-已報名隊伍及選手清單
   * @param event_id 比賽項目編號
   */
  async getEventTeams(event_id: string) {
    await this.getSportsContract();

    try {
      const data = await this._contract.send('getEventTeams', {
        Request: { event_id: event_id }
      });
      const ret = [].concat(data.Teams || []) as Team[];
      ret.map(item => item.players = [].concat(item.players || []));
      return ret;
    } catch (err) {
      throw (err.dsaError && err.dsaError.message) ? err.dsaError.message : '發生錯誤';
    }
  }

  /**
   * 取得我的同班同學
   */
  async getMyClassmate(gender: string = '') {
    await this.getSportsContract();

    try {
      const req:any = {};
      if (['M', 'F'].indexOf(gender) !== -1) req.gender = gender;
      const data = await this._contract.send('getMyClassmate', {
        Request: req
      });
      return [].concat(data.Students || []);
    } catch (err) {
      throw (err.dsaError && err.dsaError.message) ? err.dsaError.message : '發生錯誤';
    }
  }

  /**
   * 以姓名關鍵字查詢學生班級、姓名、座號；條件：姓名關鍵字、年級、性別
   * @param keyword 姓名關鍵字 like 'keyword%'
   * @param grade_year 年級
   * @param gender 性別
   */
  async searchStudents(keyword:string, grade_year?:string, gender?:string) {
    await this.getSportsContract();

    try {
      const req:any = { keyword: keyword };
      if (grade_year) req.grade_year = grade_year;
      if (gender) req.gender = gender;

      const data = await this._contract.send('searchStudents', {
        Request: req
      });
      return [].concat(data.Students || []);
    } catch (err) {
      throw (err.dsaError && err.dsaError.message) ? err.dsaError.message : '發生錯誤';
    }
  }

  /**
   * 設定個人/團體報名
   * @param event_id 比賽項目編號
   * @param players 選手名單
   * @param team_name 團體賽隊名
   * @param edit_id 有值代表編輯狀態，提供團體賽隊伍或個人賽選手編號
   */
  async setJoin(event_id: string, players: any[], team_name = '', edit_id?: string) {
    await this.getSportsContract();
    // <event_id>2462604</event_id>
    // <players>
    // 	<ref_student_id>55792</ref_student_id>
    // 	<is_team_leader>true</is_team_leader>
    // </players>
    // <team_name>桌球王子</team_name>
    // <edit_id></edit_id>
    try {
      const data = await this._contract.send('setJoin', {
        Request: {
          event_id: event_id,
          players: players,
          team_name: team_name,
          edit_id: edit_id,
        }
      });
      return data;
    } catch (err) {
      throw (err.dsaError && err.dsaError.message) ? err.dsaError.message : '發生錯誤';
    }
  }

  /**
   * 取消團體及個人報名
   * @param event_id 比賽項目編號
   * @param remove_id 要取消的團體賽隊伍或個人賽選手編號
   */
  async removeJoin(event_id: string, remove_id: string) {
    await this.getSportsContract();

    try {
      const data = await this._contract.send('removeJoin', {
        Request: {
          event_id: event_id,
          remove_id: remove_id
        }
      });
      return data.Info;
    } catch (err) {
      throw (err.dsaError && err.dsaError.message) ? err.dsaError.message : '發生錯誤';
    }
  }

  /**
   * 取得某比賽項目
   * @param event_id 比賽項目編號
   */
  getActionEventById(event_id: string) {
    if (this._eventMap.has(event_id)) {
      return this._eventMap.get(event_id);
    } else {
      return {} as SportEvent;
    }
  }


  /**
   * 取得我的基本資料及是否為體育股長(非同步)
   */
  async getLoginInfo() {
    await this.getSportsContract();

    try {
      const rsp = await this._contract.send('getMyInfo');
      this._myInfo = rsp.MyInfo;
      return rsp as LoginAccount;
    } catch (err) {
      throw (err.dsaError && err.dsaError.message) ? err.dsaError.message : '發生錯誤';
    }
  }

  /**
   * 取得我的基本資料及是否為體育股長(同步)
   */
  get myInfo() {
    return this._myInfo;
  }

  /**
   * 抽籤
   * @param event_id 比賽項目編號
   * @param target_id 團體賽-隊伍編號/個人賽-選手編號
   */
  async setLotNo(event_id: string, target_id: string) {
    await this.getSportsContract();

    if (event_id && target_id) {
      try {
        const rsp = await this._contract.send('setLotNo', {
          Request: {
            event_id: event_id,
            target_id: target_id
          }
        });
        return rsp.LotNo;
      } catch (err) {
        throw (err.dsaError && err.dsaError.message) ? err.dsaError.message : '發生錯誤';
      }
    } else {
      throw '缺少比賽項目編號';
    }
  }

}
