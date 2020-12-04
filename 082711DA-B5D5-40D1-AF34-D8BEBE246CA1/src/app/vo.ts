

/**
 * 裝學生資訊
 */
export class Students {
  Id = '';
  StuName = '';
  StudentNumber = '';
  SeatNo = '';
  ClassName = '';
}

/**
 * 顯示在畫面上用
 */
export class DatesLeaveInfo {
  /**
   * 建構子
   * @param periods 先丟入節次對應 初始化
   */
  constructor(date: any, periods: Period[]) {
    periods.forEach(period => {
      this.LeaveInfos.push(new LeavePeriodInfo(period.Name));
    });
    this.Date = this.formatDate(date);
  }
  Date = '';
  LeaveInfos: LeavePeriodInfo[] = [];

  getCheckCount(): number {
    let checkCount = 0;
    this.LeaveInfos.forEach(period => {
      if (period.Abbreviation === '公') {
        checkCount++;
      }
    });

    return checkCount;

  }

  getLeaveInfosLen(): number {
    return this.LeaveInfos.length;

  }

  formatDate(date: any) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }
}

/**
 * 顯示在畫面上用
 */
export class LeavePeriodInfo {
  constructor(period: string) {
    this.Period = period;
  }
  Period = '';
  Absence = '';
  Abbreviation = '-';
  IsCheck = false;
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
  content: string ;
}


/**
 *  為了接 Service回來的Json檔
 */
export interface Content {
  PeriodShow: string[];
  Dates: DateInfo[];
  Reason: string;
  Student: Student[];

}

/**
 *  為了接Service 回來的Json檔 格式有點不正確 只是為了接資料
 */
export interface Student {
  id: string;
  student_number: string;
  seat_no: string;
  name: string;
  class_name: string;
}


export interface DateInfo {
  Date: string;
  Periods: PeriodInfo[];
  MapPeriods : Map<string,PeriodInfo> ;


}


/**
 * 接回傳的Json檔用  interface 有點不符因為會重複
 */
export interface PeriodInfo {
  Abbreviation: string;
  Absence: string;
  Period: string;

}




export class PeriodInfo {
  Abbreviation = '';
  Absence = '';
  Period = '';
}

export interface  HistoryRecord {
    uid: string ;
    quid: string ;
    content: string;
    contentObj: Content;
}
