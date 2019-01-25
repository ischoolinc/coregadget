import { Injectable } from '@angular/core';
import { GadgetService } from '../gadget.service';

@Injectable({
  providedIn: 'root'
})
export class BasicService {

  private _courseContract: any;
  private _studentContract: any;

  constructor(
    private gadget: GadgetService,
  ) {}

  async getCourseContract() {
    if (!this._courseContract) this._courseContract = await this.gadget.getContract('emba.choose_course.student');
  }

  async getStudentContract() {
    if (!this._studentContract) this._studentContract = await this.gadget.getContract('emba.student');
  }

  /**
   *取得課程計劃的網址
   */
  async getWeburl() {
    await this.getCourseContract();

    const rsp = await this._courseContract.send('_.GetWebUrl', {
      Request: {
        Name: '課程計劃'
      }
    });
    return (rsp.Response && rsp.Response.Urls) ? rsp.Response.Urls.Url || '' : '';
  }

  /**
   *取得所有階段開放期間
   */
  async getCSOpeningInfo() {
    await this.getCourseContract();

    const rsp = await this._courseContract.send('_.GetCSOpeningInfo');
    return [].concat(rsp.Response && rsp.Response.OpeningInfo || []);
  }

  /**
   *取得課程總表
   */
  async getAllCourse(schoolYear, semester) {
    await this.getCourseContract();

    const rsp = await this._courseContract.send('_.GetAllCourse', {
      Request: {
        Condition: {
          SchoolYear: schoolYear || '',
          Semester: semester || ''
        }
      }
    });
    return [].concat(rsp.Response && rsp.Response.Course || []);
  }

  /**
   *退選訊息、Mail樣版
   */
  async getSConfiguration() {
    await this.getCourseContract();

    const rsp = await this._courseContract.send('_.GetSConfiguration', {
      Request: {
        Condition: {
          ConfName: [
            'cs_cancel1_content_template',
            'cs_final_message',
            'email_content2_template',
            'email_content1_template',
            'cs_cancel2_content_template',
            'cs_content1_template',
            'cs_content2_template',
            'email_content1_template_subject',
            'email_content2_template_subject',
            'retreat_notices_word'
          ]
        }
      }
    });
    return [].concat(rsp.Response && rsp.Response.Configuration || []);
  }

  /**
   *可選課程(已選)
   */
  async getCSAttend(schoolYear, semester) {
    await this.getCourseContract();

    const rsp = await this._courseContract.send('_.GetCSAttend', {
      Request: {
        Condition: {
          SchoolYear: schoolYear || '',
          Semester: semester || ''
        }
      }
    });
    return [].concat(rsp.Response && rsp.Response.Attend || []);
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
    return [].concat(rsp.Response && rsp.Response.Course || []);
  }

  /**
   *選課最終確認
   */
  async getSCAttendExt(schoolYear, semester) {
    await this.getCourseContract();

    const rsp = await this._courseContract.send('_.GetSCAttendExt', {
      Request: {
        Condition: {
          SchoolYear: schoolYear || '',
          Semester: semester || ''
        }
      }
    });
    return [].concat(rsp.Response && rsp.Response.SCattendExt || []);
  }

  /**
   *取得預選課程已退選Log清單
   */
  async getSCAttendExtWithdrawnLog(schoolYear, semester) {
    await this.getCourseContract();

    const rsp = await this._courseContract.send('_.GetSCAttendExtWithdrawnLog', {
      Request: {
        Condition: {
          SchoolYear: schoolYear || '',
          Semester: semester || ''
        }
      }
    });
    return [].concat(rsp.Response && rsp.Response.SCAttendWithdrawnLog || []);
  }

  /**
   *取得最終選課結果
   */
  async getRegistrationConfirm(schoolYear, semester) {
    await this.getCourseContract();

    const rsp = await this._courseContract.send('_.GetRegistrationConfirm', {
      Request: {
        Condition: {
          SchoolYear: schoolYear || '',
          Semester: semester || ''
        }
      }
    });
    return (rsp.Response && rsp.Response.Confirm) ? rsp.Response.Confirm : {};
  }

  /**
   *設定為已確認最終選課結果
   */
  async setRegistrationConfirm() {
    await this.getCourseContract();

    const rsp = await this._courseContract.send('_.SetRegistrationConfirm', {
      Request: {
        Request: {
          Confirm: true,
        }
      }
    });
    return rsp.Result || {};
  }

  /**
   *取得衝堂課程
   */
  async getConflictCourse(schoolYear, semester) {
    await this.getCourseContract();

    const rsp = await this._courseContract.send('_.GetConflictCourse', {
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
   *選課注意事項, 選課問答集
   */
  async getCSFaq() {
    await this.getCourseContract();

    const rsp = await this._courseContract.send('_.GetCSFaq');
    return [].concat(rsp.Response && rsp.Response.Faq || []);
  }

  /**
   *取得我的基本資料
   */
  async getMyInfo() {
    await this.getCourseContract();

    const rsp = await this._courseContract.send('_.GetMyInfo');
    return rsp.Response && rsp.Response.StudentInfo || {};
  }

  /**
   *設定為已列印加退選單
   */
  async setRegistrationPrint() {
    await this.getCourseContract();

    const rsp = await this._courseContract.send('_.SetRegistrationPrint', {
      Request: {
        SetStatus: ''
      }
    });
    return rsp.Result || {};
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
  async addCSAttend(courseIDs) {
    await this.getCourseContract();

    const rsp = await this._courseContract.send('_.AddCSAttend', {
      Request: {
        Course: courseIDs || [],
      }
    });
  }

  /**
   *新增加退選課程Log
   */
  async addCSAttendLog(courseIDs) {
    await this.getCourseContract();

    const rsp = await this._courseContract.send('_.AddCSAttendLog', {
      Request: {
        Course: courseIDs || [],
      }
    });
  }


  /**
   *退選課程
   */
  async delCSAttend(courseIDs) {
    await this.getCourseContract();

    const rsp = await this._courseContract.send('_.DelCSAttend', {
      Request: {
        Course: courseIDs || [],
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
          ActionBy: 'ischool web 選課小工具',
          Description: description,
        }
      }
    });
  }
}
