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

  Time: string;
}
