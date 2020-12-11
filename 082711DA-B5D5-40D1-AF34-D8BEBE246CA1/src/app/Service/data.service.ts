import { Record } from './../vo';
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
  private SchoolName: string ;


  constructor(private dsa: GadgetService) {
    this.loadTeachersSign();
    this.loadingSchoolInfo();
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
async loadingSchoolInfo(): Promise<any>{
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
   *
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
  getPrintDate() {
    let dnow = new Date();
    let month = '' + (dnow.getMonth() + 1);
    let date = '' + dnow.getDate();
    let year = dnow.getFullYear();
    let hr = dnow.getHours();
    let Min = dnow.getMinutes();
    let day = dnow.getDay();
    let weekDay = '';
    switch (day) {
      case day: 0
        weekDay = '日'
        break;
      case day: 1
        weekDay = '一'
        break;
      case day: 2
        weekDay = '二'
        break;
      case day: 3
        weekDay = '三'
        break;
      case day: 4
        weekDay = '四'
        break;
      case day: 5
        weekDay = '五'
        break;
      case day: 6
        weekDay = '六'
        break;

      // default:
      //   break;
    }

    if (month.length < 2)
      month = '0' + month;
    if (date.length < 2)
    date = '0' + date;

    return year + '/' + month + '/' + date + '  ' + hr + ':' + Min + '(' + weekDay + ')';
  }


  /**
   *
   *
   * @memberof DataService
   */
  getStudent()
  {


  }


  /**
   * 取得學校資訊
   *
   * @memberof DataService
   */
  getSchoolName(): string{
    return this.SchoolName;

  }
}
