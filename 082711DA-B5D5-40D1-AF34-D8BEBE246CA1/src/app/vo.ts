
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
 * 顯示在畫面上
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
