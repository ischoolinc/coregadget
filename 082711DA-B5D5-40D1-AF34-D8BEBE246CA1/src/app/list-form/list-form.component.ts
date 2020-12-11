import { DataService } from './../Service/data.service';
import { Record, Period, PeriodInfo,  DatesInfo, IStudent } from './../vo';
import { Component, OnInit } from '@angular/core';
import { Contract, GadgetService } from '../gadget.service';
import { LeaveItem } from '../vo';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar'
@Component({
  selector: 'app-list-form',
  templateUrl: './list-form.component.html',
  styleUrls: ['./list-form.component.scss']
})
export class ListFormComponent implements OnInit {
  // LeavveDateInfos: [] = [];
  con: Contract | undefined;
  HisRecords: Record[] = [];

  constructor(private dsa: GadgetService
    , private router: Router
    , private dataService: DataService
    , private _snackBar: MatSnackBar) {

  }
  async ngOnInit(): Promise<any> {
    this.con = await this.dsa.getContract('ischool.leave.teacher');
    // await this.getConfig();
    await this.loadDate();

  }




  /**
   * 載入資料
   */
  async loadDate(): Promise<any> {
    this.HisRecords =[];
    const periods: string[] = [];
    const rsp = await this.con?.send('_.GetAnnualLeaveRecord'); // 取得資料
    if (rsp && rsp.LeaveItems) {
      // 解析轉成物件
      [].concat(rsp.LeaveItems.Item || []).forEach(item => {
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
          date.LeavePeriod = [];
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
  getPeriodInfo(period: string, periodMap: Map<string, PeriodInfo>): PeriodInfo {
    let result: any;
    if (periodMap.has(period)) {
      result = periodMap.get(period);
    }
    return result;
  }

  /**
   *
   *
   * @memberof ListFormComponent
   */
  printSheet(data: Record) {
    // 進入
    // 裝資料
    data.contentObj.Dates.forEach(date => {
    date.Periods.forEach(period => {
      if(period.Abbreviation ==="公"){
          date.LeavePeriod.push(period.Period);
      }
      });
    });
    this.dataService.setPrintData(data);
    this.router.navigate([{ outlets: { print: ['print'] } }]);
  }

  /**
   * 刪除 此筆紀錄
   *
   * @memberof ListFormComponent
   */
  async deleteRecord(record: Record): Promise<any> {

    try {
      this.openSnackBar('','');
      const rsp = await this.con?.send('_.DeleteAnnualLeaveRecord', { UID: record.uid });
    } catch (ex) {
      alert(`刪除發生錯誤 : \n${ex.Message}`);
    }
    this.loadDate();
  }
  /**
   * 按下編輯
   * 編輯資料
   * @memberof ListFormComponent
   */
  async editRecord(date: Record): Promise<any> {
    await this.dataService.setCurrentRecord(date);
    this.router.navigate(['edit_record', 'edit']);

  }
  /**
   * 回傳顯示資訊的
   *
   * @returns {string}
   * @memberof ListFormComponent
   */
  getStudentDisplayText(student :IStudent):string{
    return `${student.class_name} ${student.name}(${student.seat_no})`;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
