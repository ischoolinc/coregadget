/**學生 */
export class StudentRecord {
  // 資料序號
  Index: number;
  // 系統編號 
  ID: string;
  // 姓名
  Name: string;
  // 座號
  SeatNumber: string;
  // 成績資料
  DailyLifeScore: Map<string,string>;
}
