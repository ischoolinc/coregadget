export class Course {
  Capacity: string;
  ClassName: string;
  Classroom: string;
  CourseID: string;
  CourseName: string;
  CourseTimeInfo: string;
  CourseType: string;
  Credit: string;
  Memo: string;
  NewSubjectCode: string;
  SerialNo: string;
  Syllabus: string;
  TeacherName: string;
  TeacherURLName: string;

  /**是否需點數選課 */
  NeedPoints: boolean;
  MaxPoints: string;
  MinPoints: string;

  /**學生投入的點數 */
  StudentSetPoints: number;
  /**投點點數有誤 */
  IsError: boolean;
  ErrorMsg: string;

  /**要退選 */
  WillQuit: boolean;

  /**要加選 */
  WillAdd: boolean;

  /**目前衝突課程清單 */
  HaveConflict: string[];

  /**選課來自哪個階段 */
  ChooseItem: any;

  Time: string;

  /**選課人數 */
  StudentCount: string;

  /**投點點數排行 */
  Ranks: string[];
}