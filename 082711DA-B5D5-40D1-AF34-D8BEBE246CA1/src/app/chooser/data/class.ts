import { StudentRecord } from './student';
export interface ClassRecord {
  Id: string;
  ClassName: string;
  GradeYear: string;
  Dept: string;
  DisplayOrder: string;
  TeacherId: string;
  TeacherName: string;
  TeacherAccount: string;
  StudentIds: string[];
  checked?: boolean;
  students?: StudentRecord[];
  [x: string]: any;
}
