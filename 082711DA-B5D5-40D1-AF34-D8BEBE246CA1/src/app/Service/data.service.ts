import { PeriodInfo, Record } from './../vo';
import { Injectable, NgZone } from "@angular/core";
import { Contract, GadgetService } from '../gadget.service';
@Injectable({
  providedIn: "root"
})
export class DataService {

  private AnnualSignTitle: string[];
  private PrintDatas: Record;
  con?: Contract | undefined;
  baseInfoCon: Contract;
  // private PrintDate: string;
  private SchoolName: string;

  HisRecords: Record[] = [];

  constructor(private dsa: GadgetService) {
    this.loadTeachersSign();
    this.loadingSchoolInfo();
  }

  /**
   * 載入資料
   */
  async loadHistoryData(): Promise<Record[]> {
    this.con = await this.dsa.getContract('ischool.leave.teacher');
    this.HisRecords = [];
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

    return this.HisRecords;
  }

  // private connection: any;
  private CurrentEditRecord: Record;

  /**
   *
   * 將要編輯的資料放放進來
   * @memberof DataService
   */
  async setCurrentRecord(record: Record): Promise<any> {
    this.CurrentEditRecord = record;
  }

  /**
   *
   * 將要編輯的資料取出
   * @memberof DataService
   */
  getCurrentRecord(): Record {
    return this.CurrentEditRecord;
  }

  /**
   * 取得簽名老師
   *
   * @memberof DataService
   */
  async loadTeachersSign(): Promise<any> {
    this.con = await this.dsa.getContract('ischool.leave.teacher');
    const rsp = await this.con?.send('_.GetConfig');
    this.AnnualSignTitle = rsp.AnnualSignTitle;
  }

  /**
   *
   * 取得學校資訊(名稱)
   * @memberof DataService
   */
  async loadingSchoolInfo(): Promise<any> {
    this.baseInfoCon = await this.dsa.getContract('basic.public');
    const rsp = await this.baseInfoCon?.send('_.GetSchoolInfo');
    this.SchoolName = rsp.ChineseName;
  }

  /**
   *
   * 取得簽名老師的資訊
   * @memberof DataService
   */
  getTeacherSign(): string[] {
    return this.AnnualSignTitle;
  }

  /**
   *
   *
   * @memberof DataService
   */
  getPrintData(): Record {
    return this.PrintDatas;
  }

  /**
   *
   *把要印的資料放進來
   * @memberof DataService
   */
  setPrintData(data: Record): void {
    this.PrintDatas = data;
  }

  /**
   *
   * 格式化日期
   * @memberof DataService
   */
  async getPrintDate() {
    let dnow = new Date();
    let month = '' + (dnow.getMonth() + 1);
    let date = '' + dnow.getDate();
    let year = dnow.getFullYear();
    let hr = dnow.getHours();
    let Min = dnow.getMinutes();
    let day = dnow.getDay();
    let weekDay = '';
    switch (day) {
      case 0:
        weekDay = '日'
        break;
      case 1:
        weekDay = '一'
        break;
      case 2:
        weekDay = '二'
        break;
      case 3:
        weekDay = '三'
        break;
      case 4:
        weekDay = '四'
        break;
      case 5:
        weekDay = '五'
        break;
      case 6:
        weekDay = '六'
        break;

      // default:
      //   break;
    }

    if (month.length < 2)
      month = '0' + month;
    if (date.length < 2)
      date = '0' + date;

    return year + '/' + month + '/' + date + '  ' + '(' + weekDay + ') ' + hr + ':' + Min;
  }

  /**
  * 取得日期 Format YYYY/MM/DD
  */
  getDateFormat(dateString: string): string {
    let fdate = new Date(dateString);
    let year = fdate.getFullYear();
    let month = fdate.getMonth() + 1;
    let date = fdate.getDate();
    return  `${year}/${month}/${date}`;
  }

  /**
   * 取得學校資訊
   *
   * @memberof DataService
   */
  getSchoolName(): string {
    return this.SchoolName;

  }
}
