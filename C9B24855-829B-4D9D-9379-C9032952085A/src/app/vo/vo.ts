export class CurrentItem {
  selectedCourse: ICourseInfo | undefined ;
  currentShowSection :string  | undefined;
  currentTerm :ITermInfo |undefined ;
  currentSubj :ISubjectInfo |undefined;
  currentAssess :IAssessment  |undefined;
  currentCustomAssessment :ICustomAssessment |undefined;
}

export interface ICourseInfo {
  CourseID: string;
  CourseName: string;
  Subject: string;
  TeacherName: string;
  Email: string;
}

/** 接service 回來的東西 */
export interface IeslRecord{
  Assessment:string ;
  CustomAssessment: string ;
  RefCoursed:string ;
  RefStudentId :string ;
  RefTeacherId:string ;
  Subject:string ;
  Term:string ;
  Value:string ;
  Ratio:string ;
  RefScAttendId:string ;
  TermWeight:string ;
  SubjectWeight:string;
  AssessmentWeight:string;
  Date :string ;
  Description:string ;
  UID:string;
}


/** Course */
export interface ICourseInfo {
  CourseID: string;
  CourseName: string;
  Subject: string;
  TeacherName: string;
  Email: string;
}

/** Term*/
export interface ITermInfo {
  termName: string;
  weight :string ;
  SubjectInfosMap: Map<string, ISubjectInfo>;
  SubjectInfosList: ISubjectInfo[];
  termScore :string ;

}
/** Subject */
export interface ISubjectInfo {
  subjectName: string;
  subjScore :string;
  weight:string ;
  AssessmentsMap: Map<string, IAssessment>;
  AssessmentsList: IAssessment[];
}

/** Assessment */
export interface IAssessment {
  assessmentName: string;
  score :string ;
  customAssessmentsMap: Map<string, ICustomAssessment>;
  customAssessmentsList: ICustomAssessment[];
  isExpand? :boolean ;
  [propName: string]: any;

}


/** CustomAssessment  */
export interface ICustomAssessment {
  customAssessName  :string ;
  customAssessmentScore :string ;
  date :string ;
  description:string ;
  isCheck? :boolean ;
  // [propName: string]: any;

}

export interface Behavior{
  BeahviorUID:string ;
  CreateDate : string ;
  CreateDate2 : string ;
  GoodBehavior: string ;
  Comment : string;
  Detention: string ;
  CourseName : string ;
  TeacherName : string ;
}

export interface ModalData{
name :string ;
BehaviorList :Behavior[] ;
currentIndex:number
}
