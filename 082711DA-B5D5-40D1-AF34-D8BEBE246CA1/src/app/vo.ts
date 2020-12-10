

/**
 * 裝學生資訊
//  */
// export class Student {
//   id = '';
//   StuName = '';
//   StudentNumber = '';
//   SeatNo = '';
//   ClassName = '';
//   GradeYear = '';
// }

import { SelectionResult } from './chooser/data';

/**
 * 顯示在畫面上用
 */
export class DatesInfo {
  Date = ''; // 請公假的日期
  Periods: LeavePeriodInfo[] = [];
  MapPeriods: Map<string, PeriodInfo> = new Map();
  LeavePeriod: string[];

  /**
   * 建構子
   * @param periods 先丟入假別對照表節次對應 初始化
   */
  constructor(date?: any, periods?: string[]) {
    periods.forEach(period => {
      // 把假別對照表放進來
      this.Periods.push(new LeavePeriodInfo(period));
      this.MapPeriods.set(period, new LeavePeriodInfo(period));
    });
    this.Date = this.formatDate(date);
  }


  /**
   *
   * 將值塞入
   * @param {DatesInfo} dateInfo
   * @memberof DatesInfo
   */
  asignProperty(dateInfo: DatesInfo)
  {
    this.Date = dateInfo.Date ;
    this.Periods = dateInfo.Periods;
    this.MapPeriods = dateInfo.MapPeriods;
    this.LeavePeriod = dateInfo.LeavePeriod;
  }

  /**
   * 取得選去假別長度 為了(全選)toggle用
   */
  getCheckCount(): number {
    let checkCount = 0;
    this.Periods.forEach(period => {
      if (period.Abbreviation === '公') {
        checkCount++;
      }
    });
    return checkCount;
  }

  /**
   *
   */
  getLeaveInfosLen(): number {
    return this.Periods.length;

  }

  /**
   * format 取得
   * @param date
   */
  formatDate(date: any): string {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  }
}

/**
 * 顯示在畫面上用
 */
export class LeavePeriodInfo implements PeriodInfo {
  // 初始化 先把期間加進來
  constructor(period: string) {
    this.Period = period;
  }
  Period = '';
  Absence = '';
  Abbreviation = '-';
}


/**
 * 接資料庫撈回來的資料
 */
export interface Period {
  Name: string;
  Sort: string;
  Type: string;
}


/**
 * 未讀取回來資料
 */
export interface LeaveItem {
  content: string;
}


/**
 *  為了接 Service回來的Json檔
 */
export interface IContent {
  PeriodShow: string[];
  Dates: DatesInfo[];
  Reason: string;
  Students: IStudent[];

}

/**
 * 裝content
 *
 * @export
 * @class Content
 * @implements {IContent}
 */
export class Content implements IContent {
  constructor() {
    this.PeriodShow = [];
    this.Dates = [];
    this.Students = [];
  }
  PeriodShow: string[];
  Dates: DatesInfo[];
  Reason: string;
  Students: IStudent[];

}




/**
 *  為了接Service 回來的Json檔 格式有點不正確 只是為了接資料
 */
export interface IStudent {
  id: string;
  student_number: string;
  seat_no: string;
  name: string;
  class_name: string;
}

export class Student implements IStudent{
  /**
   *  主要是接外面傳進來的物件
   * @memberof Student
   */
  constructor(stu :SelectionResult)
  {
    // this.id =stu['student']['Id'];
    // this.student_number =stu['student']['StudentNumber'];
    // this.seat_no: stu['student']['SeatNo'];
    // this.name: stu['student']['StudentName'];
    // this.class_name: stu['student']['ClassName'];

  }
  id: string;
  student_number: string;
  seat_no: string;
  name: string;
  class_name: string;
}

// 日期
// export interface DateInfo {
//   Date: string;
//   Periods: PeriodInfo[];
//   MapPeriods: Map<string, PeriodInfo>;
//   LeavePeriod: string[];
// }

/**
 * 接回傳的Json檔用  interface 有點不符因為會重複
 */
export interface IPeriodInfo {
  Abbreviation: string;
  Absence: string;
  Period: string;

}

export class PeriodInfo implements IPeriodInfo {

  Abbreviation = '';
  Absence = '';
  Period = '';
}

export interface IRecord {
  uid: string;
  uqid: string;
  content: string;
  /**
   * 將content 轉化為Obj 方便資料使用
   */
  contentObj: Content;
}


export class Record {
  constructor() {
    this.contentObj = new Content();
  }
  uid: string;
  uqid: string;
  content: string;
  /**
   * 將content 轉化為Obj 方便資料使用
   */
  contentObj: Content;
}
