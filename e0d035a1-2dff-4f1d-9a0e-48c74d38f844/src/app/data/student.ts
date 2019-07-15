import { MoralityMapping } from './morality-mapping';

/**學生 */
export class StudentRecord {
  ClassID: string;
  ClassName: string;
  SeatNumber: string;
  Name: string;
  StudentID: string;
  SchoolYear: string;
  Semester: string;
  Difference: string; // 加減分(已廢止)
  Comment: string; // 成績評量的評語

  Index: number;
  Origin_Comment: string;
  /**文字評語的主題和評語 */
  MoralityMapping: Map<string, MoralityMapping>;


  [x: string]: any;
}
