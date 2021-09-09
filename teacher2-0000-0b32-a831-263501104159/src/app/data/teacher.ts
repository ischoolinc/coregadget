export interface SourceTeacherRec {
  TeacherId: string;
  TeacherName: string;
  Nickname: string;
  Gender: string;
  TeacherStatus: string;
  LinkAccount: string;
  TeacherCode: string;
  ClassId: string;
  ClassName: string;
}

export interface TeacherRec {
  TeacherId: string;
  TeacherName: string;
  Nickname: string;
  Gender: string;
  TeacherStatus: string;
  LinkAccount: string;
  TeacherCode: string;
  Classes: ClassRec[];
}

export interface ClassRec {
  ClassId: string;
  ClassName: string;
}
