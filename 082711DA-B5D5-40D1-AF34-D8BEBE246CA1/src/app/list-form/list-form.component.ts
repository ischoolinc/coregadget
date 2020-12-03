import { DateInfo, HistoryRecord, Period, PeriodInfo } from './../vo';
import { Component, OnInit } from '@angular/core';
import { Contract, GadgetService } from '../gadget.service';
import { LeaveItem } from '../vo';
@Component({
  selector: 'app-list-form',
  templateUrl: './list-form.component.html',
  styleUrls: ['./list-form.component.scss']
})
export class ListFormComponent implements OnInit {
  LeavveDateInfos: [] = [];
  con: Contract | undefined;
  HisRecords: HistoryRecord[] = [];
  constructor(private dsa: GadgetService) {

  }
  async ngOnInit(): Promise<any> {
    this.con = await this.dsa.getContract('ischool.leave.teacher');
    await this.loadDate();
  }


  /**
   * 載入資料
   */
  async loadDate(): Promise<any> {
    const periods: string[] = [];
    const rsp = await this.con?.send('_.GetAnnualLeaveRecord');
    if (rsp && rsp.LeaveItems) {
      // 解析轉成物件
      [].concat(rsp.LeaveItems.Item || []).forEach(item => {
        // console.log('item', item);
        this.HisRecords.push(JSON.parse(JSON.stringify(item)));

      });

      this.HisRecords.forEach(record => {
        record.contentObj = JSON.parse(record.content);
        record.contentObj.Dates.forEach(date => {
          date.Periods.forEach(period => {
            if (!periods.includes(period.Period)) {
              periods.push(period.Period);
            }
          });
        });
        if (record.contentObj) {
          record.contentObj.PeriodShow = periods;
        }

      });

      // 處理Mapping
      this.HisRecords.forEach(record => {
        record.contentObj.Dates.forEach(date => {
          date.MapPeriods = new Map<string, PeriodInfo>();
          record.contentObj.PeriodShow.forEach(perShow => {
            let result: PeriodInfo = new PeriodInfo();
            if (date.Periods.find(period => period.Period === perShow)) {
              result = date.Periods.find(period => period.Period === perShow) || new PeriodInfo();
            }
            date.MapPeriods.set(perShow, result);
          });

        });
      });



    }
  }

 /**
  * 取得PPeriod 物件
  * @param period 節次
  * @param periodMap 存放以節次為key PeriodInfo 為物件的value 的Map
  */
  GetPeriodInfo(period: string, periodMap: Map<string, PeriodInfo>): PeriodInfo {
    let result: any;
    if (periodMap.has(period)) {
      result = periodMap.get(period);
    }
    return result;
  }
}
