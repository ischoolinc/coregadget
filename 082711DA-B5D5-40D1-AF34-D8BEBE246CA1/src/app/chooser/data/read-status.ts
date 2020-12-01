export interface ReadStatusRecord {
  Read: string;
}

export class TeacherReadStatusRecord implements ReadStatusRecord {
  TeacherId: string;
  TeacherName: string;
  Nickname: string;
  Read: string;
  Install?: boolean;
}

export class StudentReadStatusRecord implements ReadStatusRecord {
  StudentId: string;
  GradeYear: string;
  ClassName: string;
  SeatNo: string;
  StudentNumber: string;
  StudentName: string;
  Read: string;
  StudentInstall?: boolean;
  ParentInstall?: boolean;
}
