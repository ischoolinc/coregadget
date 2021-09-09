export type ImportMode = 'ADD' | 'EDIT';

export interface ImportFieldRec {
  name: string;
  value: string;
  selected: boolean;
  disabled: boolean;
  hidden: boolean;
}

export type CourseFieldName = 'CourseId' | 'CourseName' | 'SchoolYear' | 'Semester'
  | 'ClassName' | 'RefClassId'
  | 'TeacherName1' | 'TeacherName2' | 'TeacherName3' | 'TeacherId1' | 'TeacherId2' | 'TeacherId3'
  | 'CourseName^SchoolYear^Semester';

export type StudentFieldName = 'CourseId' | 'CourseName' | 'SchoolYear' | 'Semester'
  |'StudentId' | 'StudentNumber' | 'StudentStatus'
  |'LinkAccount'
  | 'StudentNumber^StudentStatus';
