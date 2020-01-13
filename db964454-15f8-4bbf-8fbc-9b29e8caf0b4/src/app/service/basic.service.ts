import { Injectable } from '@angular/core';
import { GadgetService } from '../gadget.service';
import { StudentRecord, DailyLifeInputConfig, ExamRecord, LevelCode} from '../data';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { RawSource } from 'webpack-sources';

@Injectable({
  providedIn: 'root'
})
export class BasicService {

  private _conn: any;

  constructor(
    private gadget: GadgetService,
  ) {
    this._conn = this.gadget.getContract('ta');
  }

  async connection() {
    return this._conn;
  }

  /** 取得目前學年期 */
  async getCurrentSemester() {
    const conn = await this.connection();
    const rsp = await conn.send('TeacherAccess.GetCurrentSemester', {});
    const curSchoolYear = rsp.Current.SchoolYear;
    const curSemester = rsp.Current.Semester;
    
    return {
      curSchoolYear: curSchoolYear,
      curSemester: curSemester,
    }
  }

  /** 取得主機時間 */
  async getCurrentDateTime() {
    const conn = await this.connection();
    const rsp = await conn.send('TeacherAccess.GetCurrentDateTime');
    const date = (rsp.Response && rsp.Response.DateTime) ? moment(rsp.Response.DateTime,'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm') : '';

    return date;
  }

  /** 取得班級清單 */
  async getClass() {
    const conn = await this.connection();
    const rsp = await conn.send('TeacherAccess.GetMyClasses', {
        Content: {
          Field: {
            ClassID: '',
            ClassName: '',
            GradeYear: ''
          },
          Order: {
            ClassName: ''
          }
        }
    });

    return [].concat(rsp.ClassList && rsp.ClassList.Class || []);
  }

  /** 取得日常生活表現具體建議代碼表 */
  async getMoralCommentMappingTable() {
    const conn = await this.connection();
    const rsp = await conn.send('TeacherAccess.GetMoralCommentMappingTable');

    return [].concat(
      rsp.GetMoralCommentMappingTable
      && rsp.GetMoralCommentMappingTable.Morality || []);
  }

  /**
   * 1. 取得日常生活表現評量項目
   * 2. 取得程度代碼表
   */
  async getDailyLifeMappingTable() {
    const conn = await this.connection();
    const rsp = await conn.send('TeacherAccess.GetDailyLifeMappingTable');
    const examList: ExamRecord[] = [];
    const degreeCode: LevelCode[] = [];
    // 資料整理
    if (rsp.Response) {
      // DailyBehavior
      if (rsp.Response.DailyBehavior) {
        const exam: ExamRecord = {
          ExamID: 'DailyBehavior',
          Name: rsp.Response.DailyBehavior.Name,
          Item: [].concat(rsp.Response.DailyBehavior.Item || []),
          IsGroup: false
        };
        examList.push(exam);
      }
      // GroupActivity
      if (rsp.Response.GroupActivity) {
        const exam: ExamRecord = {
          ExamID: 'GroupActivity',
          Name: rsp.Response.GroupActivity.Name,
          Item: [].concat(rsp.Response.GroupActivity.Item || []),
          IsGroup: true
        };
        examList.push(exam);
      }
      // PublicService
      if (rsp.Response.PublicService) {
        const exam: ExamRecord = {
          ExamID: 'PublicService',
          Name: rsp.Response.PublicService.Name,
          Item: [].concat(rsp.Response.PublicService.Item || []),
          IsGroup: false
        };
        examList.push(exam);
      }
      // SchoolSpecial
      if (rsp.Response.SchoolSpecial) {
        const exam: ExamRecord = {
          ExamID: 'SchoolSpecial',
          Name: rsp.Response.SchoolSpecial.Name,
          Item: [].concat(rsp.Response.SchoolSpecial.Item || []),
          IsGroup: false
        };
        examList.push(exam);
      }
      // DailyLifeRecommend
      if (rsp.Response.DailyLifeRecommend) {
        const exam: ExamRecord = {
          ExamID: 'DailyLifeRecommend',
          Name: rsp.Response.DailyLifeRecommend.Name,
          Item: [{Name: '文字描述', Index: ''}],
          IsGroup: false
        };
        examList.push(exam);
      }

      // 程度代碼表 PerformanceDegree
      if (rsp.Response.DailyBehavior.PerformanceDegree.Mapping) {
        [].concat(rsp.Response.DailyBehavior.PerformanceDegree.Mapping || []).forEach(code => {
          degreeCode.push(code || {} as LevelCode);
        });
      }
    }

    return {examList, degreeCode};
  }

  /** 取得努力程度對照表 */
  async getEffortDegreeMappingTable() {
    const conn = await this.connection();
    const rsp = await conn.send('TeacherAccess.GetEffortDegreeMappingTable');

    return [].concat(rsp.Response.EffortList && rsp.Response.EffortList.Effort || [] );
  }

  /**
   * 取得日常生活表現成績輸入時間
   * 學年度 學期
   * 各年級成績輸入時間
   */
  async getDailyLifeInputConfig() {
    const conn = await this.connection();
    const rsp = await conn.send('TeacherAccess.GetDailyLifeInputConfig');
    const data: DailyLifeInputConfig = {} as DailyLifeInputConfig;

    if (rsp.Response && rsp.Response.DailyLifeInputConfig) {
      data.SchoolYear = rsp.Response.DailyLifeInputConfig.SchoolYear;
      data.Semester = rsp.Response.DailyLifeInputConfig.Semester;
      data.Time = [];
      [].concat(rsp.Response.DailyLifeInputConfig.InputTimeControl.Time || []).forEach(time => {    
          data.Time.push(time);
      });
    }

    return data;
  }

  /** 取得學生清單 */
  async getMyClassStudents(classID: string) {
    const conn = await this.connection();
    const rsp = await conn.send('TeacherAccess.GetMyClassStudents',{
      Content: {
        Field: {
          All: ''
        },
        Condition: {
          ClassID: classID
        },
        Order: {
          SeatNumber: ''
        }
      }
    });
    const studentList: StudentRecord[] = [];
    // 資料整理
    if (rsp.Students && rsp.Students.Student) {
      [].concat(rsp.Students.Student || []).forEach((data, index) => {
        const student: StudentRecord = {
          Index: index,
          ID: data.StudentID,
          Name: data.StudentName,
          SeatNumber: data.SeatNumber,
          DailyLifeScore: new Map()
          // OriginDailyLifeScore: new Map()
        };
        studentList.push(student);
      });
    }

    return studentList;
  }

  /** 取得日常生活表現成績 */
  async getStudentDailyLifeScore(classID: string, schoolYear: string, semester: string) {
    const conn = await this.connection();
    const scoreMapByStudentID: Map<string, any> = new Map();
    const rsp = await conn.send('TeacherAccess.GetStudentDailyLifeScore',{
      Content: {
        Field: {
          All: ''
        },
        Condition: {
          ClassID: classID,
          SchoolYear: schoolYear,
          Semester: semester
        }
      }
    });
    if (rsp.Response.Student) {
      [].concat(rsp.Response.Student || []).forEach(student => {
        if (student.DailyLifeScore.TextScore) {
          const data = student.DailyLifeScore.TextScore;
          // key: examID, value: score
          const score: Map<string,string> = new Map();

          // DailyBehavior
          if (data.DailyBehavior && data.DailyBehavior.Item) {
            [].concat(data.DailyBehavior.Item || []).forEach(item => {
              score.set(`DailyBehavior_${item.Name}`,item.Degree);
              score.set(`Origin_DailyBehavior_${item.Name}`,item.Degree);
            });
          }
          // GroupActivity
          if (data.GroupActivity && data.GroupActivity.Item) {
            [].concat(data.GroupActivity.Item || []).forEach(item => {
              score.set(`GroupActivity_${item.Name}_努力程度`, item.Degree);
              score.set(`GroupActivity_${item.Name}_文字評量`, item.Description);
              score.set(`Origin_GroupActivity_${item.Name}_努力程度`, item.Degree);
              score.set(`Origin_GroupActivity_${item.Name}_文字評量`, item.Description);
            });
          }
          // PublicService
          if (data.PublicService && data.PublicService.Item) {
            [].concat(data.PublicService.Item || []).forEach(item => {
              score.set(`PublicService_${item.Name}`,item.Description);
              score.set(`Origin_PublicService_${item.Name}`,item.Description);
            });
          }
          // SchoolSpecial
          if (data.SchoolSpecial && data.SchoolSpecial.Item) {
            [].concat(data.SchoolSpecial.Item || []).forEach(item => {
              score.set(`SchoolSpecial_${item.Name}`, item.Description);
              score.set(`Origin_SchoolSpecial_${item.Name}`, item.Description);
            });
          }
          // DailyLifeRecommend
          score.set(`DailyLifeRecommend_文字描述`,data.DailyLifeRecommend ? data.DailyLifeRecommend.Description : '');
          score.set(`Origin_DailyLifeRecommend_文字描述`,data.DailyLifeRecommend ? data.DailyLifeRecommend.Description : '');

          scoreMapByStudentID.set(student.StudentID, score);
        }
      });
    }

    return scoreMapByStudentID;
  }

  /** 儲存 */
  async saveDailyLifeScore(data: any) {
    const conn = await this.connection();
    const rsp = await conn.send('TeacherAccess.SetStudentDailyLifeScore', data);

    return rsp;
  }
  
}
