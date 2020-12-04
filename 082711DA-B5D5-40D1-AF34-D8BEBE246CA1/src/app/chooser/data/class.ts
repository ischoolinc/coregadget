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
  [x: string]: any;
}
