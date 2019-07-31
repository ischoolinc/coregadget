import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { GadgetService } from '../gadget.service';
import { Student, OpeningInfo, Configuration, Course } from '../data';

@Injectable({
  providedIn: 'root'
})
export class BasicService {

  private _courseContract: any;
  private _studentContract: any;
  private _basicContract: any;

  /**校友基本資料 */
  student: Student = new Student();
  currSchoolYear: string;
  currSemester: string;

  /**選課注意事項 */
  faqA: any[] = [];
  /**選課問答 */
  faqB: any[] = [];

  /**退選訊息、Mail樣版 */
  configuration: Configuration = {
    emba_alumnicoursemodule_course_description_temp: '',
    emba_alumnicoursemodule_newly_elected_courses: '',
    '寄發新選課程與退選課程通知Email_subject': '',
    emba_alumnicoursemodule_view_alumni_notes: '',
  };

  /**課程總表 */
  allCourse: Map<string, Course> = new Map();
  /**已開放選課(不管是否已結束開放選課)的課程列表 */
  openingCourseList: Course[] = [];

  constructor(
    private gadget: GadgetService,
  ) {
    this._courseContract = this.gadget.getContract('emba.alumni');
    this._studentContract = this.gadget.getContract('emba.student');
    this._basicContract = this.gadget.getContract('basic.public');
  }

  async getCourseContract() {
    return this._courseContract;
  }

  async getStudentContract() {
    return this._studentContract;
  }

  async getBasicContract() {
    return this._basicContract;
  }

  /**初始化 */
  async init() {
    await this.getCourseContract();

    try {
      /**依校友是否有權限狀態決定顯示內容 */
      this.student = await this.getMyInfo();
      if (this.student.IsBlackList === 't') {
        return 'black';
      } else if (this.student.Status === '16') {
        await this.getCourseDates();

        const reqlist = [
          this.getAlumniCSFaq(),
          this.getConfiguration(),
          this.getAlumniCourse(this.currSchoolYear, this.currSemester),
        ];
        await Promise.all(reqlist);

        return 'ready';
      } else {
        return 'limited';
      }
    } catch (error) {
      console.log(error);
      return 'error';
    }
  }


  /**
   *可選課程(已選 且 目前為選課期間)
   */
  async getAlumniSelectCourse(schoolYear, semester) {
    const conn = await this.getCourseContract();

    const rsp = await conn.send('_.GetAlumniCurrSelectCourse', {
      Request: {
        Condition: {
          SchoolYear: schoolYear || '',
          Semester: semester || ''
        }
      }
    });
    return [].concat(rsp.Response && rsp.Response.SelectCourse || []);
  }


  /**
   *可選課程(可加選)
   */
  async getCanChooseCourse(schoolYear, semester) {
    const conn = await this.getCourseContract();

    const rsp = await conn.send('_.GetCanChooseCourse', {
      Request: {
        Condition: {
          SchoolYear: schoolYear || '',
          Semester: semester || ''
        }
      }
    });
    return [].concat(rsp.Response && rsp.Response.Courses || []);
  }

  /**
   *我的修課清單
   */
  async getAlumniPractiseCourse(schoolYear, semester) {
    const conn = await this.getCourseContract();

    const rsp = await conn.send('_.GetAlumniPractiseCourse', {
      Request: {
        Condition: {
          SchoolYear: schoolYear || '',
          Semester: semester || ''
        }
      }
    });
    return [].concat(rsp.Response && rsp.Response.PractiseCourse || []);
  }

  /**
   *取得衝堂課程
   */
  async getConflictAlumniCourse(schoolYear, semester) {
    const conn = await this.getCourseContract();

    const rsp = await conn.send('_.GetConflictAlumniCourse', {
      Request: {
        Condition: {
          SchoolYear: schoolYear || '',
          Semester: semester || ''
        }
      }
    });
    return [].concat(rsp.Response && rsp.Response.ConflictCourse || []);
  }

  /**
   *加選課程
   */
  async setElective(alumniIDs) {
    const conn = await this.getCourseContract();

    const rsp = await conn.send('_.SetElective', {
      Request: {
        Course: alumniIDs || [],
      }
    });
  }

  /**
   *新增加退選課程Log
   */
  async setElectiveLog(alumniIDs) {
    const conn = await this.getCourseContract();

    const rsp = await conn.send('_.SetElectiveLog', {
      Request: {
        Course: alumniIDs || [],
      }
    });
  }


  /**
   *退選課程
   */
  async withdrawnElective(alumniIDs) {
    const conn = await this.getCourseContract();

    const rsp = await conn.send('_.WithdrawnElective', {
      Request: {
        Course: alumniIDs || [],
      }
    });
  }


  /**
   *寄送電子郵件
   */
  async sendMail(receiver, subject, htmlContent) {
    const conn = await this.getCourseContract();

    const rsp = await conn.send('_.SendMail', {
      Request: {
        Receiver: receiver,
        Subject: subject,
        HtmlContent: htmlContent,
      }
    });
  }


  /**
   *取得正取備取名單
   */
  async getAdmissionList(alumniID) {
    const conn = await this.getCourseContract();

    const rsp = await conn.send('_.GetAdmissionList', {
      Request: {
        Condition: {
          AlumniID: alumniID
        }
      }
    });
    return [].concat(rsp.Response && rsp.Response.AdmissionList || []);
  }


  /**
   *取得我的選課繳款單清單
   */
  async getMyPaymentList(schoolYear, semester) {
    const conn = await this.getCourseContract();

    const rsp = await conn.send('_.GetMyPaymentList', {
      Request: {
        Condition: {
          SchoolYear: schoolYear || '',
          Semester: semester || ''
        }
      }
    });
    return [].concat(rsp.Response && rsp.Response.PaymentList || []);
  }


  /**
   *更新繳款單資訊
   */
  async setPaymentRecord(data) {
    const conn = await this.getCourseContract();

    const rsp = await conn.send('_.SetPaymentRecord', {
      Request: {
        PaymentRecord: data
      }
    });
    if (parseInt(rsp.Result && rsp.Result.EffectRows, 10) > 0) {
      return { info: 'success' }
    } else {
      return { info: 'error' }
    }
  }

  /**
   *新增 Log
   */
  async addLog(actionType = '', action = '', description = '') {
    const conn = await this.getStudentContract();

    const actor = await conn.getUserInfo.UserName;

    const rsp = await conn.send('public.AddLog', {
      Request: {
        Log: {
          Actor: actor,
          ActionType: actionType,
          Action: action,
          TargetCategory: 'student',
          ClientInfo: {
            ClientInfo: {}
          },
          ActionBy: 'ischool web 校友選課小工具',
          Description: description,
        }
      }
    });
  }

  /**
   * 取得系統時間
   */
  async getSystemNow() {
    const conn = await this.getBasicContract();

    const rsp = await conn.send('beta.GetNow');
    return rsp.DateTime;
  }

  /**
   *已選課程(且尚未過保證金繳費期限)
   */
  async getAlumniSemeSelectCourse(schoolYear, semester) {
    const conn = await this.getCourseContract();

    const rsp = await conn.send('_.GetAlumniSemeSelectCourse', {
      Request: {
        Condition: {
          SchoolYear: schoolYear || '',
          Semester: semester || ''
        }
      }
    });
    return [].concat(rsp.Response && rsp.Response.SelectCourse || []);
  }

  /**未過繳費期已選(不分正備取) + 已過繳費期且有繳費 + 修課課程列表 */
  async getSCPCList() {
    const reqlist = [
      this.getAlumniSemeSelectCourse(this.currSchoolYear, this.currSemester),
      this.getAlumniPractiseCourse(this.currSchoolYear, this.currSemester),
    ];
    const rsp = await Promise.all(reqlist);

    const courseList: Map<string, Course> = new Map();

    for (const item of rsp[0]) {
      if (this.allCourse.has(item.AlumniID) && !courseList.has(item.AlumniID)) {
        const course = this.allCourse.get(item.AlumniID);
        course.Source = 'SelectCourse';
        course.HaveConflict = [];
        courseList.set(item.AlumniID, course);
      }
    }
    for (const item of rsp[1]) {
      if (this.allCourse.has(item.AlumniID)) {
        const course = this.allCourse.get(item.AlumniID);
        course.Source = 'PractiseCourse';
        course.HaveConflict = [];
        courseList.set(item.AlumniID, course);
      }
    }

    return Array.from(courseList.values());
  }

  ///////////////////////////////////////


  /**
   *取得我的基本資料
   */
  private async getMyInfo() {
    const conn = await this.getCourseContract();
    const data = await conn.send('_.GetMyInfo');
    return data.Response && data.Response.StudentInfo || {};
  }

  /**
   *取得開放的學年期
   */
  private async getCourseDates() {
    const conn = await this.getCourseContract();
    const data = await conn.send('_.GetCourseDates');
    const rsp: OpeningInfo = (data && data.CourseSelectionDate) ? data.CourseSelectionDate : {};

    this.currSchoolYear = rsp.SchoolYear || '';
    this.currSemester = rsp.Semester || '';
  }

  /**
   *選課注意事項, 選課問答集
   */
  private async getAlumniCSFaq() {
    const conn = await this.getCourseContract();
    const data = await conn.send('_.GetAlumniCSFaq');
    const rsp = [].concat(data.Response && data.Response.Faq || []);

    for (const item of rsp) {
      if (item.Category === '選課注意事項') {
        item.Content = item.Content.replace(/\n/g, '<br />');
        this.faqA.push(item);
      } else if (item.Category === '選課問答') {
        item.Content = item.Content.replace(/\n/g, '<br />');
        this.faqB.push(item);
      }
    }
  }

  /**
   *退選訊息、Mail樣版
   */
  private async getConfiguration() {
    const conn = await this.getCourseContract();
    const data = await conn.send('_.GetConfiguration', {
      Request: {
        Condition: {
          ConfName: [
            'emba_alumnicoursemodule_course_description_temp',
            'emba_alumnicoursemodule_newly_elected_courses',
            '寄發新選課程與退選課程通知Email_subject',
            'emba_alumnicoursemodule_view_alumni_notes'
          ]
        }
      }
    });
    const rsp = [].concat(data.Response && data.Response.Configuration || []);
    for (const item of rsp) {
      this.configuration[item.ConfName] = item.ConfContent;
    }
  }

  /**
   *取得課程總表
   */
  private async getAlumniCourse(schoolYear, semester) {
    if (!(this.currSchoolYear && this.currSemester)) return;

    const sysDate = await this.getSystemNow();

    const conn = await this.getCourseContract();
    const data = await conn.send('_.GetAlumniCourse', {
      Request: {
        Condition: {
          SchoolYear: schoolYear || '',
          Semester: semester || ''
        }
      }
    });
    const rsp = [].concat(data.Response && data.Response.AlumniCourseRecord || []);

    for (const item of rsp) {
      const teachers = [];
      if (item.TeacherURLName) {
        const tmp = item.TeacherURLName.split(', ');

        tmp.forEach((teacher) => {
          if (($(teacher).attr('href'))) {
            teachers.push('<a href="' + $(teacher).attr('href') + '" target="_blank">' + $(teacher).html() + '</a>');
          } else {
            teachers.push($(teacher).html());
          }
        });
        item.TeacherURLName = teachers.join(', ');
      }

      const isOpening = (moment(new Date(item.StartDate)) <= moment(new Date(sysDate)));
      if (isOpening) { this.openingCourseList.push(item) };

      this.allCourse.set(item.AlumniID, item);
    }
  }
}
