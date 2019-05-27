import { Injectable } from '@angular/core';
import { DSAService, Contract } from './dsa.service';
import { Observable } from 'rxjs';
import { concatMap, map, shareReplay } from 'rxjs/operators';
import { SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  private contract: Observable<Contract>;

  constructor(
    dsa: DSAService
  ) {
    this.contract = dsa.getContract('1campus.mobile.v2.teacher').pipe(
      shareReplay() // 讓之後呼叫 service 不會一直重新 connect。
    );
  }

  public getMyClass() {
    return this.contract.pipe(
      concatMap((conn) => conn.send<MyClassResponse>('GetMyClasses')),
      map((rsp => {
        return [].concat(!!rsp && !!rsp.ClassList && rsp.ClassList.Class || []) as ClassRecord[];
      }))
    );
  }

  // GetClassStudentsV2
  public getClassStudentsV2(classIds: string[]) {

    return this.contract.pipe(
      concatMap((conn) => conn.send<StudentResponse>('GetClassStudentsV2', {
        Request: {
          ClassID: classIds
        }
      })),
      map(rsp => {
        return [].concat(!!rsp && !!rsp.Response && rsp.Response.Student || []) as ClassStudentRecord[];
      })
    );
  }

  //   <Request>
  //   <Title><![CDATA[測試訊息]]></Title>
  //   <Message><![CDATA[測試訊息內容]]></Message>
  //   <ParentVisible>false</ParentVisible>
  //   <StudentVisible>true</StudentVisible>
  //   <TargetStudent>54149</TargetStudent>
  // <TargetStudent>54150</TargetStudent>
  // </Request>
  public pushNotice({ students, title, message, parentVisible, studentVisible }: PushArguments) {

    return this.contract.pipe(
      concatMap((conn) => conn.send<PushResponse>('notice.PushNotice', {
        Request: {
          TargetStudent: students,
          Title: `${title}`,
          Message: `${message}`,
          ParentVisible: parentVisible,
          StudentVisible: studentVisible
        }
      })),
      map(rsp => {
        return rsp;
      })
    );
  }

  public pushNoticeSelf(title: string = '', message: string = '') {
    return this.contract.pipe(
      concatMap((conn) => conn.send<any>('notice.PushNoticeSelf', {
        Request: {
          Title: `${title}`,
          Message: `${message}`,
        }
      })),
      map(rsp => {
        return rsp;
      })
    );
  }

  public getUserInfo() {
    return this.contract.pipe(
      map((conn) => {
        return conn.userInfo;
      })
    );
  }

  // notice.GetNotice
  public getNotices() {
    return this.contract.pipe(
      concatMap((conn) => conn.send<any>('notice.GetNotice', {Request: {}})),
      map(rsp => {
        return [].concat(!!rsp && rsp.Notice || []) as NoticeSummaryRecord[];
      })
    );
  }

  public getReadStatus(noticeId: string) {
    return this.contract.pipe(
      concatMap((conn) => conn.send<any>('notice.GetReadStatus', {
        Request: {
          NoticeID: noticeId
        }
      })),
      map(rsp => {
        return [].concat(!!rsp && rsp.Student || []) as NoticeReadStatusRecord[];
      })
    );
  }

  public getReadHistories(noticeId: string, studentId: string) {
    return this.contract.pipe(
      concatMap((conn) => conn.send<any>('notice.GetReadHistory', {
        Request: {
          NoticeID: noticeId,
          StudentID: studentId
        }
      })),
      map(rsp => {
        return [].concat(!!rsp && rsp.Log || []) as ReadLogRecord[];
      })
    );
  }

  public getInstalledStatus(students: string[]) {
    return this.contract.pipe(
      concatMap((conn) => conn.send<any>('notice.GetInstalledStatus', {
        Request: {
          StudentID: students
        }
      })),
      map(rsp => {
        return (!!rsp && rsp) as InstallStatusInfo;
      }),
      map(infos => {
        if (!infos.Students) {
          infos.Students = { Student: [] };
        }

        if (!infos.Parents) {
          infos.Parents = { Parent: [] };
        }

        infos.Students.Student = [].concat(infos.Students.Student || []);
        infos.Parents.Parent = [].concat(infos.Parents.Parent || []);
        return infos;
      })
    );
  }
}

interface PushArguments {
  /** 學生編號清單。 */
  students: string[];
  title: string;
  message: string;
  parentVisible: boolean;
  studentVisible: boolean;
}

interface MyInfoResponse {
  Teacher: TeacherRecord;
}

export interface TeacherRecord {
  '@': string[];
  ID: string;
  Name: string;
  Gender: string;
  ContactPhone: string;
  Email: string;
  Department: string;
  SmartSchoolLoginName: string;
  Photo: string;
  RemoteAccount: string;
}

interface MyClassResponse {
  ClassList: ClassList;
}

interface ClassList {
  Class: ClassRecord[];
}

export interface ClassRecord {
  ClassID: string;
  GradeYear: string;
  ClassName: string;
  StudentCount: string;
}

interface GetCurrentSemesterResponse {
  Response: SemsesterInfo;
}

export interface SemsesterInfo {
  SchoolYear: string;
  Semester: string;
  Now: string;
}

interface MyCourseResponse {
  ClassList: CourseList;
}

interface CourseList {
  Class: CourseRecord[];
}

export interface CourseRecord {
  CourseID: string;
  CourseName: string;
  CourseSubject: string;
  ClassID: string;
  ClassName: string;
  GroupId: string;
  GradeYear: string;
}

interface StudentResponse {
  Response: StudentData;
}

interface StudentData {
  Student: CourseStudentRecord[] | ClassStudentRecord[];
}

export interface CourseStudentRecord {
  StudentID: string;
  StudentName: string;
  StudentNumber: string;
  ClassName: string;
  SeatNo: string;
  Gender: string;
  EmergencyContactName: string;
  EmergencyContactPhone: string;
}

export interface ClassStudentRecord {
  StudentID: string;
  StudentName: string;
  StudentNumber: string;
  ClassID: string;
  ClassName: string;
  SeatNo: string;
  EmergencyContactName: string;
  EmergencyContactPhone: string;
}

export interface PushResponse {
  rs: NoticeRecord[];
  smslist: SMSlist[];
  postRequest: string;
  postResult: string;
}

interface SMSlist {
  dsns: string;
  receiver: string;
  content: Content;
}

interface Content {
  dsns: string;
  title: string;
  body: string;
  sender: string;
  msg_type: string;
  meta: Metadata;
}

interface Metadata {
  role: string;
  notice_id: string;
  student_id?: string;
}

interface NoticeRecord {
  ref_notice_id: string;
  display_sender: string;
  role: string;
  target_id: string;
  acc: string;
  uuid: string;
}

export interface NoticeSummaryRecord {
  ID: string;
  Title: string;
  Message: string;
  PostTime: any;
  Readed: string;
  Unread: string;
  rawMessage: SafeHtml;
}

export interface NoticeReadStatusRecord {
  StudentID: string;
  GradeYear: string;
  ClassName: string;
  SeatNo: string;
  StudentNumber: string;
  StudentName: string;
  Read: string;
  StudentInstall?: boolean;
  ParentInstall?: boolean;
}

export interface InstallStatusInfo {
  Students: Students;
  Parents: Parents;
}

export interface Parents {
  Parent: VisitStatus[];
}

export interface Students {
  Student: VisitStatus[];
}

export interface VisitStatus {
  Id: string;
  FirstVisit: string;
  LastVisit: string;
}

export interface ReadLogRecord {
  Time: string;
  Account: string;
  Relationship: string;
  [x: string]: any;
}

  // public getMyInfo() {
  //   return this.contract.pipe(
  //     concatMap((conn) => conn.send<MyInfoResponse>('GetMyInfo')),
  //     map((rsp) => {
  //       return (!!rsp && rsp.Teacher) as TeacherRecord;
  //     })
  //   );
  // }

  // public getCurrentSemester() {
  //   return this.contract.pipe(
  //     concatMap((conn) => conn.send<GetCurrentSemesterResponse>('GetCurrentSemester')),
  //     map(rsp => {
  //       return rsp.Response;
  //     })
  //   );
  // }

  // public getMyCourses(schoolYear: number, semester: 1 | 2) {
  //   return this.contract.pipe(
  //     concatMap((conn) => conn.send<MyCourseResponse>('GetMyCourses', {
  //       Request: {
  //         All: '',
  //         SchoolYear: schoolYear,
  //         Semester: semester
  //       }
  //     })),
  //     map(rsp => {
  //       return [].concat(!!rsp && !!rsp.ClassList && rsp.ClassList.Class || []) as CourseRecord[];
  //     })
  //   );
  // }


  // public getCourseStudentV2(courseId: string) {

  //   return this.contract.pipe(
  //     concatMap((conn) => conn.send<StudentResponse>('GetCourseStudentV2', {
  //       Request: {
  //         CourseID: courseId
  //       }
  //     })),
  //     map(rsp => {
  //       return [].concat(!!rsp && !!rsp.Response && rsp.Response.Student || []) as CourseStudentRecord[];
  //     })
  //   );
  // }
