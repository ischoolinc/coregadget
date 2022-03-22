
export interface SourceCourse {
  CourseId: string;
  CourseName: string;
  SchoolYear: string;
  Semester: string;
  RefClassId: string;
  ClassName: string;
  TeacherId: string;
  TeacherName: string;
  TeacherNickname: string;
  TeacherSequence: string;
  CourseStudentCount: string;
  SCETakeCount: string;
}

export interface CourseRec {
  CourseId: string;
  CourseName: string;
  SchoolYear: string;
  Semester: string;
  RefClassId?: string;
  ClassName?: string;
  Teachers?: CourseTeacherRec[];
  Checked?: boolean;
  CourseStudentCount?: string;
  SCETakeCount?: string;
  IsShowOnCurrentPage? :boolean;
}

export interface CourseTeacherRec {
  TeacherId: string;
  TeacherName: string;
  TeacherNickname: string;
  TeacherSequence: string;
}
