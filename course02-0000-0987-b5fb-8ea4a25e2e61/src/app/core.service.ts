import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CourseRec, SourceCourse } from './data/course';
import { StudentRec } from './data/student';
import { TeacherRec } from './data/teacher';
import { GadgetService } from './gadget.service';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  private _cnStaff: any;
  private _cnPublic: any;

  public classList: ClassRec[] = [];
  public teacherList: TeacherRec[] = [];
  public studentList: StudentRec[] = [];

  curCourse$ = new BehaviorSubject({} as CourseRec);
  curSchoolYear$ = new BehaviorSubject('');
  curSemester$ = new BehaviorSubject('');

  constructor(private gadget: GadgetService) { }

  async getCNStaff() {
    if (!this._cnStaff) this._cnStaff = await this.gadget.getContract('cloud.staff');
  }
  async getCNPublic() {
    if (!this._cnPublic) this._cnPublic = await this.gadget.getContract('cloud.public');
  }

  async init() {
    const promiseList = [
      this.getClasses(),
      this.getTeachers(),
      this.getStudents({}),
    ];

    this.classList = await promiseList[0] as ClassRec[];
    this.teacherList = await promiseList[1] as TeacherRec[];
    this.studentList = await promiseList[2] as StudentRec[];
  }

  async getCurrentSemester(): Promise<SemesterRec> {
    await this.getCNPublic();

    return await this._cnPublic.send('beta.GetCurrentSemester');
  }

  async getCourseAllSemester(): Promise<SemesterRec[]> {
    await this.getCNStaff();

    const rsp = await this._cnStaff.send('beta.GetCourseAllSemester');
    return [].concat(rsp.AllSchoolYearSemester || []);
  }

  async getCourses(opt: {
    CourseId?: string,
    SchoolYear?: string,
    Semester?: string,
    CurrentSemester?: boolean,
    StudentStatus?: string,
  }): Promise<SourceCourse[]> {
    await this.getCNStaff();

    const rsp = await this._cnStaff.send('beta.GetCourseV2', opt);
    return [].concat(rsp.Course || []);
  }

  // 老師可能有多位
  async getCourse(courseId: string): Promise<SourceCourse[]> {
    await this.getCNStaff();

    const rsp = await this._cnStaff.send('beta.GetCourseV2', {
      CourseId: courseId,
      StudentStatus: '1, 2',
    });
    return [].concat(rsp.Course || []);
  }

  async getClasses(): Promise<ClassRec[]> {
    await this.getCNStaff();

    const rsp = await this._cnStaff.send('beta.GetClass');
    return [].concat(rsp.Class || []);
  }

  async getTeachers(): Promise<TeacherRec[]> {
    await this.getCNStaff();

    const rsp = await this._cnStaff.send('beta.GetTeacherV2');
    return [].concat(rsp.Teacher || []);
  }

  async getStudents(opt: {
    StudentId?: string[],
    StudentName?: string,
    StudentNumber?: string,
    StudentStatus?: string[],
    ClassId?: string[],
  }): Promise<StudentRec[]> {
    await this.getCNStaff();

    const rsp = await this._cnStaff.send('beta.GetStudent', opt);
    return [].concat(rsp.Student || []);
  }

  // 取得特定課程條件的學生
  async getCourseStudent(data: {
    CourseId?: string[],
    SchoolYear?: string,
    Semester?: string,
    CurrentSemester?: string,
    StudentStatus?: string,
  }): Promise<StudentRec[]> {
    await this.getCNStaff();

    const rsp = await this._cnStaff.send('beta.GetCourseStudent', data);
    return [].concat(rsp.Student || []);
  }

  // 新增課程及老師
  async addCourseAndTeacher(data: {
    CourseName: string,
    SchoolYear: string,
    Semester: string,
    RefClassId?: string,
    CourseCode?: string,
    TeacherId1?: string,
    TeacherId2?: string,
    TeacherId3?: string,
  }[], joinClassStudent: boolean): Promise<any> {
    await this.getCNStaff();

    const rsp = await this._cnStaff.send('beta.AddCourseAndTeacher', {
      JoinClassStudent: joinClassStudent,
      Course: data
    });

    return [].concat(rsp.NewCourses || []);
  }

  // 新增課程學生
  async addCourseStudent(data: {
    CourseId: string,
    StudentId: string,
  }[]): Promise<any> {
    await this.getCNStaff();

    const rsp = await this._cnStaff.send('beta.AddCourseStudent', {
      CourseStudent: data
    });
    return [].concat(rsp.NewId || []);
  }

  // 更新課程及老師
  async updateCourseAndTeacher(identifyField: string[], data: {
    CourseId?: string,
    CourseName?: string,
    SchoolYear?: string,
    Semester?: string,
    RefClassId?: string,
    CourseCode?: string,
    TeacherId1?: string,
    TeacherId2?: string,
    TeacherId3?: string,
  }[], joinClassStudent: boolean): Promise<any> {

    await this.getCNStaff();

    const rsp = await this._cnStaff.send('beta.UpdateCourseAndTeacher', {
      IdentifyField: identifyField,
      JoinClassStudent: joinClassStudent,
      Course: data
    });
    return rsp.Info || '';
  }

  // 刪除課程
  async delCourse(courseIds: string[]): Promise<any> {
    await this.getCNStaff();

    const rsp = await this._cnStaff.send('beta.DelCourse', {
      CourseId: courseIds
    });
    return rsp.Ids || '';
  }

  // 刪除課程學生
  async delCourseStudent(courseId: string, studentIds: string[]): Promise<any> {
    await this.getCNStaff();

    const rsp = await this._cnStaff.send('beta.DelCourseStudent', {
      CourseId: courseId,
      CourseStudent: {
        StudentId: studentIds,
      }
    });
    return rsp.Ids || '';
  }

  // 轉換欄位名稱
  replaceMappingFieldName(txt: string = '') {
    txt = txt.replace(/CourseId/gi, '課程系統編號');
    txt = txt.replace(/CourseName/gi, '課程名稱');
    txt = txt.replace(/SchoolYear/gi, '學年度');
    txt = txt.replace(/Semester/gi, '學期');
    txt = txt.replace(/ClassName/gi, '所屬班級');
    txt = txt.replace(/RefClassId/gi, '所屬班級');
    txt = txt.replace(/TeacherId1/gi, '授課教師1');
    txt = txt.replace(/TeacherId2/gi, '授課教師2');
    txt = txt.replace(/TeacherId3/gi, '授課教師3');
    txt = txt.replace(/TeacherName1/gi, '授課教師1');
    txt = txt.replace(/TeacherName2/gi, '授課教師2');
    txt = txt.replace(/TeacherName3/gi, '授課教師3');
    txt = txt.replace(/StudentId/gi, '學生系統編號');
    txt = txt.replace(/StudentNumber/gi, '學號');
    txt = txt.replace(/StudentStatus/gi, '狀態');
    txt = txt.replace(/LinkAccount/gi, '登入帳號');
    return txt;
  }

  // 整理教師至同課程
  colCourseMap(sourceCourses: SourceCourse[]) {
    const sourceCourseMap: Map<string, CourseRec> = new Map();
    sourceCourses.forEach(v => {
      if (!sourceCourseMap.has(v.CourseId)) {
        sourceCourseMap.set(v.CourseId, {
          CourseId: v.CourseId,
          CourseName: v.CourseName,
          SchoolYear: v.SchoolYear,
          Semester: v.Semester,
          RefClassId: v.RefClassId,
          ClassName: v.ClassName,
          Teachers: [],
          CourseStudentCount: v.CourseStudentCount,
          SCETakeCount: v.SCETakeCount,
        });
      }
      const course = sourceCourseMap.get(v.CourseId);
      course?.Teachers?.push({
        TeacherId: v.TeacherId,
        TeacherName: v.TeacherName,
        TeacherNickname: v.TeacherNickname,
        TeacherSequence: v.TeacherSequence,
      });
    });
    return sourceCourseMap;
  }

  // 新增 Log
  async addLog(actionType = '', action = '', description = '', targetId = '') {
    await this.getCNStaff();

    const actor = this._cnStaff.getUserInfo.UserName;

    const rsp = await this._cnStaff.send('beta.AddLog', {
      Request: {
        Log: {
          Actor: actor,
          ActionType: actionType,
          Action: action,
          TargetCategory: '',
          TargetID: targetId,
          ClientInfo: {
            ClientInfo: {}
          },
          ActionBy: 'ischool web 課程管理',
          Description: description,
        }
      }
    });
  }
}

export interface SemesterRec {
  SchoolYear: string;
  Semester: string;
}

export interface ClassRec {
  ClassId: string;
  ClassName: string;
  GradeYear?: string;
  ClassStatus?: string;
  DisplayOrder?: string;
  ClassCode?: string;
  NamingRule?: string;
  TeacherId?: string;
  TeacherName?: string;
}
