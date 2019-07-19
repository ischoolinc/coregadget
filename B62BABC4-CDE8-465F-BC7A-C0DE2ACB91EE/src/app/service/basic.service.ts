import { Injectable } from '@angular/core';
import { GadgetService } from '../gadget.service';
import { SubjectRecord, AttendRecord, BasicInfo, SubjectTypeRecord } from '../data/index';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class BasicService {

  private conn: any;

  constructor(
    private gadget: GadgetService,
  ) {
    this.conn = this.gadget.getContract('ischool.course_selection');
  }

  async connection() {
    return this.conn;
  }

  /**取得目前選課設定 */
  async getCurrentStatus(): Promise<BasicInfo> {
    const conn = await this.connection();
    const rsp = await conn.send('GetCurrentStatus');
    /**資料整理 */
    {
      rsp.StartTime = moment(parseInt(rsp.StartTime));
      rsp.EndTime = moment(parseInt(rsp.EndTime));

      if ((rsp.Mode == '先搶先贏' || rsp.Mode == '志願序')) {
        rsp.PS = '' + rsp.StartTime.format('YYYY/MM/DD HH:mm:ss') + ' ~ ' + rsp.EndTime.format('YYYY/MM/DD HH:mm:ss') + ' (' + rsp.Mode + ')';
      } else {
        rsp.PS = '尚未設定選課時間';
      }
      
      rsp.SubjectTypeList = [].concat(rsp.SubjectType || []);
      rsp.SubjectTypeList.forEach((type: any) => {
        type.WishList = [].concat(type.Wish || []);
      });

      // 跨課程時段整理(衝堂判斷)
      {
        rsp.SubjectTypeList.forEach((type: SubjectTypeRecord) => {
          if (type.Attend) {
            if (type.Attend.CrossType1) {
              const target = rsp.SubjectTypeList.find((sbType: SubjectTypeRecord) => sbType.SubjectType === type.Attend.CrossType1);
              if (target) {
                target.Attend = Object.assign({} , type.Attend);
                target.Attend.IsCrossType = true;
              }
            }
            if (type.Attend.CrossType2) {
              const target = rsp.SubjectTypeList.find((sbType: SubjectTypeRecord) => sbType.SubjectType === type.Attend.CrossType2);
              if (target) {
                target.Attend = type.Attend;
                target.Attend.IsCrossType = true;
              }
            }
          }
        });
      }

    }

    return rsp as BasicInfo;
  }

  /**取得該課程時段選課清單  */
  async getSubjectListByType(body: any): Promise<any> {
    const conn = await this.connection();
    const rsp = await conn.send('GetSubjectList', body);

    return {
      SubjectList: [].concat(rsp.Subject || []),
      Attend: rsp.Attend || '',
      WishList: [].concat(rsp.Wish || [])
    };
  }

  /**學生加選（先搶先贏） */
  async setTakeAway(body: any): Promise<any> {
    const conn = await this.connection();
    const rsp = await conn.send('SetTakeAway',body);

    return rsp;
  }

  /**學生退選（先搶先贏） */
  async leaveTakeAway(body: any): Promise<any> {
    const conn = await this.connection();
    const rsp = await conn.send('LeaveTakeAway', body);

    return rsp;
  }

  /**學生志願選填 */
  async setWish(body: any):Promise<any> {
    const conn = await this.connection();
    const rsp = await conn.send('SetWish', body);

    return rsp;
  }

  /**取得科目級別 */
  getLevel(subject: SubjectRecord) {
    switch (subject.Level) {
      case '':
        return '';
      case '1':
        return ' I';
      case '2':
        return ' II';
      case '3':
        return ' III';
      case '4':
        return ' IV';
      case '5':
        return ' V';
      case '6':
        return ' VI';
      case '7':
        return ' VII';
      case '8':
        return ' VIII';
    }
  }

}
