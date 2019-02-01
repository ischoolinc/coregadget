/**保證金 */
export class Payment {
  /**是否正取 */
  IsAdmitted: string;

  /**自動淘汰 */
  AutoManualEliminate: string;

  /**自動遞補 */
  AutoManually: string;

  /**保證是否金繳納 */
  MarginPayment: string;

  /**校友課程系統編號 */
  AlumniID: string;

  /**校友系統編號 */
  StudentId: string;

  /**序號 */
  SerialNumber: string;

  /**校友姓名 */
  StudentName: string;

  /**銀行代碼 */
  BankCode: string;

  /**取消(已被篩汰) */
  Cancel: string;

  /**取消日期 */
  CancelDate: string;

  /**說明。使用者自填。 */
  Description: string;

  /**帳號後5碼 */
  DigitsAfter5Number: string;

  /**填單日期 */
  FillInDate: string;

  /**應繳繳款金額。使用者自填。 */
  PaymentAmount: string;

  /**校友轉帳日期 */
  PaymentDate: string;

  /**選課學生資料表系統編號 */
  RefStudentSelectId: string;

  /**學年度 */
  SchoolYear: string;

  /**學期 */
  Semester: string;

  /**是否對帳成功 */
  VerifyAccounting: string;



  /**課號 (6碼系所代碼+4碼課號) */
  NewSubjectCode?: string;

  /**開課名稱 */
  CourseName?: string;

  /**學雜費 */
  TuitionFees?: string;

  /**保證金 */
  Margin?: string;

  /**勾選狀態(未取消: true, 取消: false) */
  Checked?: boolean;
}
