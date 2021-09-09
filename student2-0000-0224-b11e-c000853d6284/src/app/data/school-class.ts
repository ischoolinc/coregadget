import { StudentRec } from "./student";

export interface SchoolClassRec {
  ClassId: string;
  ClassName: string;
  GradeYear: string;
  ClassStatus?: string;
  DisplayOrder?: string;
  NamingRule?: string;
  TeacherId?: string;
  TeacherName?: string;
  Students?: StudentRec[];
}

export interface GradeYearRec {
  title: string;
  open: boolean;
}
