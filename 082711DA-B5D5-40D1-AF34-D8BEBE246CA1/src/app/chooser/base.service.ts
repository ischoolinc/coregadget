import { Injectable } from '@angular/core';
import { DSAService, Contract } from './dsa.service';
import { Observable } from 'rxjs';
import { concatMap, map, shareReplay } from 'rxjs/operators';
import { ClassRecord, StudentReadStatusRecord, TeacherReadStatusRecord,
  NoticeRecord, StudentRecord, TeacherRecord,
  TagPrefix, ReadLogRecord, InstallStatusInfo, InstallVisitCountRecord } from './data';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  private contract: Observable<Contract>;

  constructor(
    dsa: DSAService
  ) {

    // this.contract = dsa.getContract('1campus.notice.admin.web')
    this.contract = dsa.getContract('ischool.leave.teacher')

    .pipe(
      shareReplay() // 讓之後呼叫 service 不會一直重新 connect。
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
   * 以年級、班級、類別分類、類別、「姓名、學號關鍵字」找學生。
   * @param type 篩選類型 'All' | 'GradeYear' | 'ClassId' | 'TagPrefix' | 'TagId' | 'Keyword'
   * @param value 條件值
   */
  public getStudents(type: 'All' | 'GradeYear' | 'ClassId' | 'TagPrefix' | 'TagId' | 'Keyword', value: any) {
    return this.contract.pipe(
      // concatMap((conn) => conn.send<StudentResponse>('GetStudents', {
        concatMap((conn) => conn.send<StudentResponse>('Chooser.GetStudents', {
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

  /** 取得自己的姓名 */
  public getUserInfo() {
    return this.contract.pipe(
      map(conn => {
        return conn.userInfo;
      })
    );
  }
}


interface ClassesResponse {
  Class: ClassRecord[];
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


//////////////////////////////////////////

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
