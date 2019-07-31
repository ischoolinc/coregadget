/**校友課程 */
export class Course {

  /**校友課程系統編號 */
  AlumniID: string;

  /**開課名稱 */
  CourseName: string;

  /**學分數 */
  Credit: string;

  /**在校上選課人數上限 */
  Capacity: string;

  /**上課時間 */
  CourseTimeInfo: string;

  /**教室 */
  Classroom: string;

  /**課程大綱 */
  Syllabus: string;

  /**備註 */
  Memo: string;

  /**課程類別 */
  CourseType: string;

  /**課號 (6碼系所代碼+4碼課號) */
  NewSubjectCode: string;

  /**開課班次，值為 空白、01, 02, 03 */
  ClassName: string;

  /**流水號 */
  SerialNo: string;

  /**校友選課人數上限 */
  MumberOfElectives: string;

  /**保證金 */
  Margin: string;

  /**學雜費 */
  TuitionFees: string;

  /**教師姓名 */
  TeacherName: string;

  /**教師個人網址 */
  TeacherURLName: string;

  /**要退選 */
  WillQuit: boolean;

  /**要加選 */
  WillAdd: boolean;

  /**目前衝突課程清單 */
  HaveConflict: string[];

  /**選課開始日 */
  StartDate: string;

  /**選課結束日 */
  EndDate: string;

  /**開始正取繳費*/
  AnnouncementSDate: string;

  /**結束正取繳費*/
  AnnouncementEDate: string;

  /**開始備取繳費*/
  IncrementSDate: string;

  /**結束備取繳費*/
  IncrementEDate: string;

  /**來源：已選課程 SelectCourse 修課清單 PractiseCourse */
  Source?: 'SelectCourse' | 'PractiseCourse';

  /**狀態 Choose: 選課期；Announcement: 正取繳費期；Increment: 備取繳費期；AfterIncrement: 繳費後 */
  Status: 'Choose' | 'Announcement' | 'Increment' | 'AfterIncrement';
}
