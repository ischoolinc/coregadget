import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GoogleClassroomCourse } from './google-classroom.service';
import { LoginService } from './login.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class MyCourseService {

  constructor(
    private http: HttpClient,
    private login: LoginService,
    private config: ConfigService,
  ) {
  }

  /**目前學年期 */
  public async getCurrentSemester(appName: string) {
    const { login } = this;
    const accessToken = await login.getAccessToken().toPromise();
    const path = [
      `${this.config.DSNS_HOST}/${appName}/web3.v1.public/_.getCurrentSemester`,
      `?stt=PassportAccessToken`,
      `&AccessToken=${accessToken}`,
      `&rsptype=json`
    ].join('');
    return this.http.get<any>(path).toPromise();
  }

  /**教師取得課程清單 */
  public async teacherGetCourses(appName: string, schoolYear?: number, semester?: number) {
    const { login } = this;
    const accessToken = await login.getAccessToken().toPromise();

    let req = `<CurrentSemester>true</CurrentSemester>`;
    if(schoolYear && semester) {
      req = `<Request><SchoolYear>${schoolYear}</SchoolYear><Semester>${semester}</Semester></Request>`
    }

    const path = [
      `${this.config.DSNS_HOST}/${appName}/web3.v1.teacher/_.getCourses`,
      `?stt=PassportAccessToken`,
      `&AccessToken=${accessToken}`,
      `&rsptype=json`,
      `&content=${encodeURIComponent(req)}`
    ].join('');

    const rsp: any = await this.http.get(path).toPromise();
    return [].concat((rsp && rsp.Course) || []) as MyCourseRec[];
  }

  public async teacherGetSemesters(appName: string) {
    const { login } = this;
    const accessToken = await login.getAccessToken().toPromise();
    const path = [
      `${this.config.DSNS_HOST}/${appName}/web3.v1.teacher/_.getAttendSemesters`,
      `?stt=PassportAccessToken`,
      `&AccessToken=${accessToken}`,
      `&rsptype=json`,
    ].join('');

    const rsp: any = await this.http.get(path).toPromise();
    rsp.semesters = [].concat(rsp.semesters || []);
    return rsp as AttendSemesters;
  }

  /**學生取得課程清單 */
  public async studentGetCourses(appName: string, schoolYear?: number, semester?: number) {
    const { login } = this;
    const accessToken = await login.getAccessToken().toPromise();

    let req = `<CurrentSemester>true</CurrentSemester>`;
    if(schoolYear && semester) {
      req = `<Request><SchoolYear>${schoolYear}</SchoolYear><Semester>${semester}</Semester></Request>`
    }

    const path = [
      `${this.config.DSNS_HOST}/${appName}/web3.v1.student/_.getCourses`,
      `?stt=PassportAccessToken`,
      `&AccessToken=${accessToken}`,
      `&rsptype=json`,
      `&content=${encodeURIComponent(req)}`
    ].join('');
    const rsp: any = await this.http.get(path).toPromise();
    return [].concat((rsp && rsp.Course) || []) as MyCourseRec[];
  }

  public async studentGetSemesters(appName: string) {
    const { login } = this;
    const accessToken = await login.getAccessToken().toPromise();
    const path = [
      `${this.config.DSNS_HOST}/${appName}/web3.v1.student/_.getAttendSemesters`,
      `?stt=PassportAccessToken`,
      `&AccessToken=${accessToken}`,
      `&rsptype=json`,
    ].join('');

    const rsp: any = await this.http.get(path).toPromise() as AttendSemesters;

    rsp.semesters = [].concat(rsp.semesters || []);
    return rsp as AttendSemesters;
  }

  /**課程學生清單 */
  public async getCourseStudents(appName: string, courseId: number) {
    const { login } = this;
    const accessToken = await login.getAccessToken().toPromise();
    const path = [
      `${this.config.DSNS_HOST}/${appName}/web3.v1.teacher/_.getCourseStudent`,
      `?stt=PassportAccessToken`,
      `&AccessToken=${accessToken}`,
      `&rsptype=json`,
      `&content=${encodeURIComponent(`<Request><CourseId>${courseId}</CourseId><StudentStatus>1,4</StudentStatus></Request>`)}`
    ].join('');
    const rsp: any = await this.http.get(path).toPromise();
    return [].concat((rsp && rsp.Course && rsp.Course.Student) || []);
  }

  /**課程教師清單 */
  public async getCoursetTeachers(appName: string, courseId: number) {
    const { login } = this;
    const accessToken = await login.getAccessToken().toPromise();
    const path = [
      `${this.config.DSNS_HOST}/${appName}/web3.v1.teacher/_.getCourseTeacher`,
      `?stt=PassportAccessToken`,
      `&AccessToken=${accessToken}`,
      `&rsptype=json`,
      `&content=${encodeURIComponent(`<CourseId>${courseId}</CourseId>`)}`
    ].join('');
    const rsp: any = await this.http.get(path).toPromise();
    return [].concat((rsp && rsp.Teacher) || []) as MyCourseTeacherRec[];
  }
}

export interface MyCourseRec {
  ClassName: string;
  ClassStudentCount: number;
  CourseId: number;
  CourseName: string;
  RefClassId: number;
  SchoolYear: number;
  Semester: number;
  GoogleIsReady: boolean;
  GoogleExt?: GoogleClassroomCourse;
  TeacherId?: number;
  TeacherName?: string;
  TeacherSequence?: string;
  Teachers?: MyCourseTeacherRec[];
  Alias?: string;
  live: boolean
}

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
