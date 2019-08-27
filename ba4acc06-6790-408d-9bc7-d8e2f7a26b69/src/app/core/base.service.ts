import { Injectable } from '@angular/core';
import { DSAService, Contract } from '../dsa.service';
import { Observable } from 'rxjs';
import { concatMap, map, shareReplay } from 'rxjs/operators';
import { ClassRecord, StudentReadStatusRecord, TeacherReadStatusRecord,
  NoticeRecord, StudentRecord, TeacherRecord,
  TagPrefix, ReadLogRecord, InstallStatusInfo, InstallVisitCountRecord } from '../data';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  private contract: Observable<Contract>;

  constructor(
    dsa: DSAService
  ) {
    this.contract = dsa.getContract('1campus.notice.admin.web').pipe(
      shareReplay() // 讓之後呼叫 service 不會一直重新 connect。
    );
  }

  /**
   * 取得各身分安裝統計數值
   */
  public getInstalledCount() {
    return this.contract.pipe(
      concatMap((conn) => conn.send<InstallVisitCountRecord>('GetInstalledCount')),
      map(rsp => {
        return rsp;
      })
    );
  }

  /**
   * 取得全校班級
   */
  public getAllClasses() {
    return this.contract.pipe(
      concatMap((conn) => conn.send<ClassesResponse>('GetAllClasses')),
      map(rsp => {
        const classes = [].concat(!!rsp && rsp.Class || []) as ClassRecord[];
        // @ts-ignore 為加速，所以 uds 回傳字串，此處將字串轉陣列
        classes.forEach(cls => cls.StudentIds = (cls.StudentIds ? cls.StudentIds.split(',') : []));
        return classes;
      })
    );
  }

  /**
   * 取得發佈單位
   */
  public getDisplaySenders() {
    return this.contract.pipe(
      concatMap((conn) => conn.send<DisplaySenderResponse>('GetDisplaySenders')),
      map(rsp => {
        return [].concat(!!rsp && rsp.DisplaySender || []) as string[];
      })
    );
  }


  /**
   * 取得老師、學生、家長 APP 安裝狀態
   * @param teacherIds 老師系統編號陣列
   * @param studentIds 學生系統編號陣列
   */
  public getInstalledStatus(teacherIds: string[], studentIds: string[]) {

    return this.contract.pipe(
      concatMap((conn) => conn.send<InstallStatusInfo>('GetInstalledStatus', {
        Request: {
          TeacherId: teacherIds,
          StudentId: studentIds,
        }
      })),
      map(rsp => {
        return (!!rsp && rsp) as InstallStatusInfo;
      }),
      map(infos => {
        if (!infos) {
          infos.Students = { Student: [] };
          infos.Parents = { Parent: [] };
          infos.Teachers = { Teacher: [] };
        }

        if (!infos.Teachers) {
          infos.Teachers = { Teacher: [] };
        }

        if (!infos.Students) {
          infos.Students = { Student: [] };
        }

        if (!infos.Parents) {
          infos.Parents = { Parent: [] };
        }

        infos.Teachers.Teacher = [].concat(infos.Teachers.Teacher || []);
        infos.Students.Student = [].concat(infos.Students.Student || []);
        infos.Parents.Parent = [].concat(infos.Parents.Parent || []);
        return infos;
      })
    );
  }

  /**
   * 取得訊息列表及總筆數
   */
  public getNotices(limit: number = 30, offset: number = 0) {
    return this.contract.pipe(
      concatMap((conn) => conn.send<NoticeResponse>('GetNotices', {
        Request: {
          Limit: limit,
          Offset: offset,
        }
      })),
      map(rsp => {
        return {
          Count: (!!rsp && rsp.Count) ? +rsp.Count : 0,
          Notices: [].concat(!!rsp && rsp.Notices || []) as NoticeRecord[]
        };
      })
    );
  }

  /**
   * 取得訊息全部讀取狀態
   * @param noticeId 訊息系統編號
   */
  public getReadStatus(noticeId: string) {
    return this.contract.pipe(
      concatMap((conn) => conn.send<ReadStatusResponse>('GetReadStatus', {
        Request: {
          NoticeId: noticeId
        }
      })),
      map(rsp => {
        return {
          Student: [].concat(!!rsp && rsp.Student || []) as StudentReadStatusRecord[],
          Teacher: [].concat(!!rsp && rsp.Teacher || []) as TeacherReadStatusRecord[],
        };
      })
    );
  }

  /**
   * 以年級、班級、類別分類、類別、「姓名、學號關鍵字」找學生。
   * @param type 篩選類型 'All' | 'GradeYear' | 'ClassId' | 'TagPrefix' | 'TagId' | 'Keyword'
   * @param value 條件值
   */
  public getStudents(type: 'All' | 'GradeYear' | 'ClassId' | 'TagPrefix' | 'TagId' | 'Keyword', value: any) {
    return this.contract.pipe(
      concatMap((conn) => conn.send<StudentResponse>('GetStudents', {
        Request: {
          ConditionType: type,
          ConditionValue: value,
        }
      })),
      map(rsp => {
        return [].concat(!!rsp && rsp.Students || []) as StudentRecord[];
      })
    );
  }

  /**
   * 以年級、班級、類別分類、類別、分類、「姓名、暱稱關鍵字」找老師。
   * @param type 篩選類型 'All' | 'GradeYear' | 'ClassId' | 'TagPrefix' |  'TagId' | 'Dept' | 'Keyword'
   * @param value 條件值
   */
  public getTeachers(type: 'All' | 'GradeYear' | 'ClassId' | 'TagPrefix' | 'TagId' | 'Dept' | 'Keyword', value: any) {
    return this.contract.pipe(
      concatMap((conn) => conn.send<TeacherResponse>('GetTeachers', {
        Request: {
          ConditionType: type,
          ConditionValue: value,
        }
      })),
      map(rsp => {
        return [].concat(!!rsp && rsp.Teachers || []) as TeacherRecord[];
      })
    );
  }

  /**
   * 取得指定角色的全部類別、各類別成員
   * @param category 指定類別的角色 TEACHER | STUDENT
   */
  public getTags(category: 'TEACHER' | 'STUDENT') {
    return this.contract.pipe(
      concatMap((conn) => conn.send<TagPrefixResponse>('GetTags', {
        Request: {
          Category: (category === 'TEACHER') ? 'Teacher' : 'Student',
        }
      })),
      map(rsp => {
        const data = [].concat(!!rsp && rsp.TagPrefixs || []) as TagPrefix[];
        data.map(prefix => {
          // @ts-ignore 為加速，所以 uds 回傳字串，此處將字串轉陣列
          prefix.MemberIds = (prefix.MemberIds ? prefix.MemberIds.split(',') : []);
          prefix.Tags = [].concat(prefix.Tags || []);
          // @ts-ignore 為加速，所以 uds 回傳字串，此處將字串轉陣列
          prefix.Tags.forEach(tag => tag.MemberIds = (tag.MemberIds ? tag.MemberIds.split(',') : []));
        });
        return data as TagPrefix[];
      })
    );
  }

  /**
   * 取得訊息讀取記錄
   * @param noticeId 訊息編號
   * @param targetId 老師或學生編號
   * @param targetType 目標角色 'TEACHER' | 'STUDENT'
   */
  public getReadHistories(noticeId: string, targetId: string, targetType: 'TEACHER' | 'STUDENT') {
    return this.contract.pipe(
      concatMap((conn) => conn.send<ReadLogResponse>('GetReadHistory', {
        Request: {
          NoticeId: noticeId,
          TargetId: targetId,
          TargetType: targetType
        }
      })),
      map(rsp => {
        return [].concat(!!rsp && rsp.Logs || []) as ReadLogRecord[];
      })
    );
  }

  /**
   * 發送訊息
   * @param title 標題
   * @param message 內容
   * @param displaySender 發送單位
   */
  public pushNotice({ title, message, displaySender,
    parentVisible, studentVisible, students, teachers }: PushArguments) {

    return this.contract.pipe(
      concatMap((conn) => conn.send<PushResponse>('PushNotice', {
        Request: {
          Title: `${title}`,
          Message:  `${message}`,
          DisplaySender: `${displaySender}`,
          ParentVisible: parentVisible,
          StudentVisible: studentVisible,
          TargetStudent: students,
          TargetTeacher: teachers,
        }
      })),
      map(rsp => {
        return rsp;
      })
    );
  }

  /** 取得自己的姓名 */
  public getUserInfo() {
    return this.contract.pipe(
      map(conn => {
        return conn.userInfo;
      })
    );
  }

  /**
   * 發送訊息給自己
   * @param title 標題
   * @param message 內容
   * @param displaySender 發送單位
   */
  public pushNoticeSelf(title: string = '', message: string = '', displaySender: string) {
    return this.contract.pipe(
      concatMap((conn) => conn.send<any>('PushNoticeSelf', {
        Request: {
          Title: `${title}`,
          Message: `${message}`,
          DisplaySender: `${displaySender}`,
        }
      })),
      map(rsp => {
        return rsp;
      })
    );
  }
}


interface ClassesResponse {
  Class: ClassRecord[];
}

interface DisplaySenderResponse {
  DisplaySender: string[];
}

interface NoticeResponse {
  Count: number;
  Notices: NoticeRecord[];
}

interface ReadStatusResponse {
  Student: StudentReadStatusRecord[];
  Teacher: TeacherReadStatusRecord[];
}

interface StudentResponse {
  Students: StudentRecord[];
}

interface TeacherResponse {
  Teachers: TeacherRecord[];
}

interface TagPrefixResponse {
  TagPrefixs: TagPrefix[];
}

interface ReadLogResponse {
  Logs: ReadLogRecord[];
}

//////////////////////////////////////////

interface PushArguments {
  title: string;
  message: string;
  displaySender: string;
  parentVisible: boolean;
  studentVisible: boolean;
  students: string[];
  teachers: string[];
}

export interface PushResponse {
  rs: NoticeRecordx[];
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

interface NoticeRecordx {
  ref_notice_id: string;
  display_sender: string;
  role: string;
  target_id: string;
  acc: string;
  uuid: string;
}
