import { Contract } from './gadget.service';
import { Injectable } from '@angular/core';
import { GadgetService } from './gadget.service';

import * as Moment from 'moment';

@Injectable()
export class DSAService {

  private ready: Promise<void>;
  private contract: Contract;
  private basicContract: Contract;

  constructor(private gadget: GadgetService) {
    this.ready = this.initContract();
  }

  private async initContract() {
    try {
      this.contract = await this.gadget.getContract('campus.rollcall.student');
      this.basicContract = await this.gadget.getContract('basic.public');
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   * 取得缺曠類別節次
   */
  public async getGetConfig() {
    await this.ready;

    const rsp = await this.contract.send('_.GetConfig');

    return rsp && rsp.Config;
  }

  /**
   * 取得班級課程學生清單。
   * @param type 類型：Course、Class
   * @param id 編號。
   * @param date 日期。
   */
  public async getStudents(type, courseID, period, date) {
    await this.ready;

    const req: any = {
      Request: {
        Type: type,
        CourseID: courseID,
        Period: period,
        OccurDate: date
      }
    }

    //if (type === "Course") req.Request.CourseID = courseID;
    //if (type === "Class") req.Request.ClassID = courseID;

    const rsp = await this.contract.send('_.GetStudents', req);
    console.log(rsp);
    return [].concat((rsp && rsp.Students && rsp.Students.Student) || []).map(function (item) { return item as Student; });
  }

  /**
   * 取得班級課程學生清單。
   * @param type 類型：Course、Class
   * @param id 編號。
   * @param date 日期。
   */
  public async getStudent(type, id, date, period) {
    await this.ready;

    const req: any = {
      Request: {
        Type: type,
        OccurDate: date,
        Period: period
      }
    }

    if (type === "Course") req.Request.CourseID = id;
    if (type === "Class") req.Request.ClassID = id;

    const rsp = await this.contract.send('GetStudent', req);

    return {
      TeacherName: rsp.TeacherName
      , Student: [].concat((rsp && rsp.Student) || []).map(function (item) { return item as Student; })
    };
  }

  //取得出席率
  public async getAbsenceRate(courseId: string) {
    await this.ready;
    const rsp = await this.contract.send('GetAttendanceRate', {
      Request: {
        CourseId: courseId
      }
    });
    //取得學生出席率
    const studentsAbsenceRate = rsp.Student;
    const absenceRateObj = {}
    //轉成 JSON 格式 
    if (studentsAbsenceRate) {
      for (var i = 0; i < studentsAbsenceRate.length; i++) {
        absenceRateObj[studentsAbsenceRate[i].StudentID] = studentsAbsenceRate[i].AbsenceRate;
      }
      return absenceRateObj;
    }
  }

  /**
   * 儲存點名資料。
   */
  public async setRollCall(type: GroupType, id: string, period: string, data: RollCallCheck[]) {
    await this.ready;

    const req: any = {
      Period: period,
      Student: data.map((item) => {
        return {
          ID: item.ID
          , Absence: item.Absence
        };
      })//JSON.stringify(data),
    };

    if (type === 'Course') {
      req.CourseID = id;
    } else {
      req.ClassID = id;
    }

    const rsp = await this.contract.send('SetRollCall', req);

    return rsp;
  }
  /**
   * 儲存點名資料。
   */
  public async setRollCallWithTeacherKey(type: GroupType, id: string, period: string, teacherName: string, teacherKey: string, data: RollCallCheck[]) {
    await this.ready;

    const req: any = {
      Period: period,
      TeacherName: teacherName,
      TeacherKey: teacherKey,
      Student: data.map((item) => {
        return {
          ID: item.ID
          , Absence: item.Absence
        };
      })//JSON.stringify(data),
    };

    if (type === 'Course') {
      req.CourseID = id;
    } else {
      req.ClassID = id;
    }

    const rsp = await this.contract.send('SetRollCallWithTeacherKey', req);

    return rsp;
  }

  public async isTeacherRollCall(courseID: string, date: string) {
    await this.ready;

    const req: any = {
      CourseID: courseID,
      Date: date
    };

    const rsp = await this.contract.send('_.IsTeacherRollCall', req);
    return [].concat((rsp && rsp.Result) || []);
  }

  public getAccessPoint() {
    return this.contract.getAccessPoint;
  }

  public getSessionID() {
    return this.contract.getSessionID;
  }

  /**
   * 取得今日日期。
   */
  public async getToday() {
    // return Moment().format('YYYY/MM/DD');
    await this.ready;
    let rsp = await this.basicContract.send('beta.GetNow', {
      Pattern: 'yyyy/MM/dd'
    });
    return rsp.DateTime;
  }

  public async getSchedule(date: string) {
    await this.ready;

    const rsp = await this.contract.send('_.GetSchedule', {
      Request: {
        OccurDate: date
      }
    });

    const courses = [].concat(rsp && rsp.Course || []) as CourseConf[];
    const schedules = [].concat(rsp && rsp.Schedule || []) as Schedule[];
    const periods = [].concat(rsp && rsp.Period || []) as PeriodConf[];

    periods.forEach(v => {
      v.Absence = [].concat(v.Absence || []) as AbsenceConf[];
    });

    return { CourseConf: courses, PeriodConf: periods, Schedule: schedules } as ConfigData
  }
}

export type GroupType = '' | 'Course' | 'Class'

export type ConfigData = { CourseConf: CourseConf[], PeriodConf: PeriodConf[], Schedule: Schedule[] };

/**
 * 班級課程項目。
 */
export interface RollCallRecord {
  UID: string;
  Name: string;
  Type: GroupType;
  Students: string;
}

export interface Config {
  Timestamp: string;
  Periods: any;
  Absences: any;
}

export interface SuggestRecord {
  Checked: string;
  CourseID: string;
  CourseName: string;
  Period: string;
}

export interface Student {
  StudentID: string;
  Name: string;
  SeatNo: string;
  StudentNumber: string;
  ClassName: string;
  // Attendance: AttendanceItem;
  PhotoUrl: string; //2018/10/24 new
  AbsenceRate: number;  //Jean 20190522 增加 出席率
  Absence: Absence;
  PrevAbsence: PrevAbsence;
}

export interface Absence {
  AbsenceName: string;
  HelperRollCall: string;
  RollCall: string;
  RollCallChecked: string;
}

export interface PrevAbsence {
  Period: string;
  AbsenceName: string;
}

export interface AttendanceItem {
  Period: PeriodStatus;
}

/**
 * 代表某一節次的缺曠狀態。
 */
export interface PeriodStatus {
  /** '@text' 取得節次名稱。 */
  [x: string]: string;

  /**
   * 缺曠類型。(另外可使用 periodItem['@text'] 取得節次名稱。)。
   */
  AbsenceType: string;
}

export interface RollCallCheck {
  //** 學生編號。 */
  ID: string;

  /** 缺曠類別。 */
  Absence: string;
}

/** 取得今日點名/建議點名
 * 並且組織出可點名缺曠別
 */
export interface Schedule {
  TeacherChecked: string;
  Checked: string;
  ClassID: string;
  ClassName: string;
  CourseID: string;
  CourseName: string;
  Period: string;
  StudentCount: string;
}

export interface PeriodConf {
  Actor: string;
  EndTime: string;
  Name: string;
  StartTime: string;
  Type: string;
  Absence: AbsenceConf[];
}

export interface AbsenceConf {
  Abbr: string;
  Color: string;
  Name: string;
}

export interface CourseConf {
  CourseID: string;
  CourseName: string;
  // 小幫手資料
  StudentID: string;
  StudentName: string;
  StudentNumber: string;
}

export interface GradeYearObj {
  GradeYear: string;
  Class: ClassObj[];
}

export interface ClassObj {
  ClassID: string;
  ClassName: string;
  Course: CourseObj[];
}
export interface CourseObj {
  CourseID: string;
  CourseName: string;
  Credit: string;
  Subject: string;
  TeacherID: string;
  TeacherName: string;
}