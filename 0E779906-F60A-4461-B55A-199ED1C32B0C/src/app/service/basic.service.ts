import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { GadgetService } from '../gadget.service';
import { Student, OpeningInfo, OpenState, Configuration, Course } from '../data';

@Injectable({
  providedIn: 'root'
})
export class BasicService {

  private _courseContract: any;
  private _studentContract: any;

  /**校友基本資料 */
  student: Student = new Student();
  currSchoolYear: string;
  currSemester: string;
  openingDate: OpeningInfo;

  /**目前階段 */
  currLevel: OpenState;

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

  constructor(
    private gadget: GadgetService,
  ) {}

  async getCourseContract() {
    if (!this._courseContract) this._courseContract = await this.gadget.getContract('emba.alumni');
  }

  async getStudentContract() {
    if (!this._studentContract) this._studentContract = await this.gadget.getContract('emba.student');
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

        if (!this.currLevel) {
          return 'closed';
        } else {
          const reqlist = [
            this.getAlumniCSFaq(),
            this.getConfiguration(),
            this.getAlumniCourse(this.currSchoolYear, this.currSemester),
          ];
          await Promise.all(reqlist);
          return 'ready';
        }
      } else {
        return 'limited';
      }
    } catch (error) {
      return 'error';
    }
  }


  /**
   *可選課程(已選)
   */
  async getAlumniSelectCourse(schoolYear, semester) {
    await this.getCourseContract();

    const rsp = await this._courseContract.send('_.GetAlumniSelectCourse', {
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
    await this.getCourseContract();

    const rsp = await this._courseContract.send('_.GetCanChooseCourse', {
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
    await this.getCourseContract();

    const rsp = await this._courseContract.send('_.GetAlumniPractiseCourse', {
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
    await this.getCourseContract();

    const rsp = await this._courseContract.send('_.GetConflictAlumniCourse', {
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
   *退選
   */
  async delSCAttendExt(courseIDs) {
    await this.getCourseContract();

    const rsp = await this._courseContract.send('_.DelSCAttendExt', {
      Request: {
        SCAttendExt: courseIDs || [],
      }
    });
  }

  /**
   *加選課程
   */
  async setElective(alumniIDs) {
    await this.getCourseContract();

    const rsp = await this._courseContract.send('_.SetElective', {
      Request: {
        Course: alumniIDs || [],
      }
    });
  }

  /**
   *新增加退選課程Log
   */
  async setElectiveLog(alumniIDs) {
    await this.getCourseContract();

    const rsp = await this._courseContract.send('_.SetElectiveLog', {
      Request: {
        Course: alumniIDs || [],
      }
    });
  }


  /**
   *退選課程
   */
  async withdrawnElective(alumniIDs) {
    await this.getCourseContract();

    const rsp = await this._courseContract.send('_.WithdrawnElective', {
      Request: {
        Course: alumniIDs || [],
      }
    });
  }


  /**
   *寄送電子郵件
   */
  async sendMail(receiver, subject, htmlContent) {
    await this.getCourseContract();

    const rsp = await this._courseContract.send('_.SendMail', {
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
    await this.getCourseContract();

    const rsp = await this._courseContract.send('_.GetAdmissionList', {
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
    await this.getCourseContract();

    const rsp = await this._courseContract.send('_.GetMyPaymentList', {
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
    await this.getCourseContract();

    const rsp = await this._courseContract.send('_.SetPaymentRecord', {
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
    await this.getStudentContract();

    const actor = this._studentContract.getUserInfo.UserName;

    const rsp = await this._studentContract.send('public.AddLog', {
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

  ///////////////////////////////////////


  /**
   *取得我的基本資料
   */
  private async getMyInfo() {
    const data = await this._courseContract.send('_.GetMyInfo');
    return data.Response && data.Response.StudentInfo || {};
  }

  /**
   *取得所有階段開放期間
   */
  private async getCourseDates() {
    const today = new Date();
    const data = await this._courseContract.send('_.GetCourseDates');
    const rsp: OpeningInfo = (data && data.CourseSelectionDate) ? data.CourseSelectionDate : {};

    this.openingDate = rsp;
    this.currSchoolYear = rsp.SchoolYear || '';
    this.currSemester = rsp.Semester || '';

    // 'beforeChoose': 再度轉換為
    //    's1': 選課前。可選課程=目前尚未開放選課,課程總表 + 衝堂課程=無資料
    //    's5': 開放選課前五天。可選課程=目前尚未開放選課,課程總表+衝堂課程=正常顯示
    // 'choose': 選課中(對應在校生選課 => 1)
    // 'afterChoose': 選課後尚未第一階段公告。尚未公告選課最終結果(對應在校生選課 => s3, s4)
    // 'announcement': 第一階段公告中
    // 'afterAnnouncement': 第一階段公告結束~第二階段公告尚未開始
    // 'increment': 第二階段遞補中
    // 'afterIncrement': 第二階段遞補結束

    switch (rsp.Status) {
      case 'beforeChoose':
        const sDate = new Date(this.openingDate.StartDate);
        const addDays = moment(sDate).add(-6, 'days').toDate();
        if (sDate > today) {
          if (today >= addDays) {
            this.currLevel = 's5';
          }
        }
        break;
      default:
        if (rsp.Status) this.currLevel = rsp.Status;
        break;
    }
  }

  /**
   *選課注意事項, 選課問答集
   */
  private async getAlumniCSFaq() {
    const data = await this._courseContract.send('_.GetAlumniCSFaq');
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
    const data = await this._courseContract.send('_.GetConfiguration', {
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

    const data = await this._courseContract.send('_.GetAlumniCourse', {
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

      this.allCourse.set(item.AlumniID, item);
    }
  }
}
