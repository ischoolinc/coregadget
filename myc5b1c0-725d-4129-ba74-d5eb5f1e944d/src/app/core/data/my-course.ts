import { GoogleClassroomCourse } from "../google-classroom.service";
import { ServiceConf } from "./service-conf";

export interface MyCourseTeacherRec {
  TeacherId: number;
  TeacherName: string;
  LinkAccount: string;
  TeacherSequence: number;
}

export interface AttendSemesters {
  [x: string]: any;
  teacher_id?: number;
  student_id?: number;
  semesters:  Semester[];
}

export interface Semester {
  semester:    number;
  school_year: number;
}

export type TargetType = 'COURSE' | 'CLASS';

export class MyTargetBaseRec {
  Alias?: string;
  TargetId?: number;
  TargetName?: string;
  TargetType?: TargetType;
  ServiceConfig: ServiceConf[] = [];
  Timetable: Map<number, PeriodRec> = new Map(); // key: weekday
  GoogleIsReady: boolean = false;
  GoogleExt?: GoogleClassroomCourse;
  TeacherId?: number;
  StudentId?: number;
  Live: boolean = false;
}

export class MyCourseRec extends MyTargetBaseRec {
  ClassName: string = '';
  ClassStudentCount: number = 0;
  CourseId: number = 0;
  CourseName: string = '';
  RefClassId?: number;
  SchoolYear?: number;
  Semester?: number;
  TeacherName: string = '';
  TeacherSequence: number = 0;
  Teachers?: MyCourseTeacherRec[];
}

export interface PeriodRec {
  Weekday: number;
  Periods: number[];
}
