import { DataService } from './../Service/data.service';
import { Record, Period, PeriodInfo,  DatesInfo, IStudent } from './../vo';
import { Component, OnInit } from '@angular/core';
import { Contract, GadgetService } from '../gadget.service';
import { LeaveItem } from '../vo';
import { Router, ActivatedRoute } from '@angular/router';
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
    , private route: ActivatedRoute
    , private dataService: DataService
    , private _snackBar: MatSnackBar) {

      route.data.subscribe(r => {
        this.HisRecords = r.records;
      });
  }
  async ngOnInit(): Promise<any> {
    this.con = await this.dsa.getContract('ischool.leave.teacher');
    // await this.getConfig();

    // this.HisRecords = this.dataService.HisRecords;
  }

  /**
   * 載入資料
   */
  async loadDate(): Promise<any> {
    this.HisRecords = await this.dataService.loadHistoryData();
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
  async editRecord(data: Record): Promise<any> {
    await this.dataService.setCurrentRecord(data);
    this.router.navigate(['edit_record', 'edit', data.uid]);
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
