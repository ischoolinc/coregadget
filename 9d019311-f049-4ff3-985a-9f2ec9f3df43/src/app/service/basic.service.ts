import { Injectable } from '@angular/core';
import { GadgetService } from '../gadget.service';
import { StudentRecord, DailyLifeInputConfig, ExamRecord, PerformanceDegree} from '../data';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

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

  /**
   * 取得目前學年期
   */
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

  /**
   * 取得主機時間
   */
  async getCurrentDateTime() {
    const conn = await this.connection();

    const rsp = await conn.send('TeacherAccess.GetCurrentDateTime');
    const date = (rsp.Response && rsp.Response.DateTime) ? moment(rsp.Response.DateTime,'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm') : '';
    return date;
  }

  /**
   *取得班級清單
   */
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

  /**
   * 取得日常生活表現具體建議代碼表
   */
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
    const degreeCode: PerformanceDegree[] = [];
    // 資料整理
    if (rsp.Response) {
      // DailyBehavior
      if (rsp.Response.DailyBehavior) {
        const exam: ExamRecord = {
          ExamID: 'DailyBehavior',
          Name: rsp.Response.DailyBehavior.Name,
          Item: rsp.Response.DailyBehavior.Item,
          
        };
        examList.push(exam);
      }
      // DailyLifeRecommend
      if (rsp.Response.DailyLifeRecommend) {
        const exam: ExamRecord = {
          ExamID: 'DailyLifeRecommend',
          Name: rsp.Response.DailyLifeRecommend.Name,
          Item: [{Name: '文字描述', Index: ''}]
        };
        examList.push(exam);
      }
      // OtherRecommend
      if (rsp.Response.OtherRecommend) {
        const exam: ExamRecord = {
          ExamID: 'OtherRecommend',
          Name: rsp.Response.OtherRecommend.Name,
          Item: [{Name: '文字描述', Index: ''}]
        };
        examList.push(exam);
      }
      // 程度代碼表 PerformanceDegree
      if (rsp.Response.DailyBehavior.PerformanceDegree.Mapping) {
        [].concat(rsp.Response.DailyBehavior.PerformanceDegree.Mapping || []).forEach(code => {
          degreeCode.push(code || {} as PerformanceDegree);
        });
      }
    }

    return {examList, degreeCode};
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

  /**
   * 取得學生清單 
   */
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

  /**
   * 取得日常生活表現成績 
   */
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
          const score: Map<string,Map<string,string>> = new Map();
          const _score: Map<string,string> = new Map();

          const dbMap: Map<string,string> = new Map();

          if (data.DailyBehavior && data.DailyBehavior.Item) {

            [].concat(data.DailyBehavior.Item || []).forEach(item => {
              dbMap.set(item.Name,item.Degree);

              _score.set(`DailyBehavior_${item.Name}`,item.Degree);
              _score.set(`Origin_DailyBehavior_${item.Name}`,item.Degree);
            });
            score.set('DailyBehavior',dbMap);
          }

          score.set('OtherRecommend',new Map().set('文字描述',data.OtherRecommend ? data.OtherRecommend.Description : ''));
          score.set('DailyLifeRecommend', new Map().set('文字描述',data.DailyLifeRecommend ? data.DailyLifeRecommend.Description : ''));

          _score.set(`OtherRecommend_文字描述`,data.OtherRecommend ? data.OtherRecommend.Description : '');
          _score.set(`Origin_OtherRecommend_文字描述`,data.OtherRecommend ? data.OtherRecommend.Description : '');
          _score.set(`DailyLifeRecommend_文字描述`,data.DailyLifeRecommend ? data.DailyLifeRecommend.Description : '');
          _score.set(`Origin_DailyLifeRecommend_文字描述`,data.DailyLifeRecommend ? data.DailyLifeRecommend.Description : '');

          // score.DailyBehavior = {
          //   Item: scoreMap || new Map()
          // };
          // score.OtherRecommend = data.OtherRecommend ? data.OtherRecommend.Description : '';
          // score.DailyLifeRecommend = data.DailyLifeRecommend ? data.DailyLifeRecommend.Description : '';

          scoreMapByStudentID.set(student.StudentID, _score);
          // scoreMapByStudentID.set(student.StudentID, score);
        }
      });
    }

    return scoreMapByStudentID;
  }

  /**
   * 儲存
   */
  async saveDailyLifeScore(data: any) {
    const conn = await this.connection();

    const rsp = await conn.send('TeacherAccess.SetStudentDailyLifeScore', data);

    return rsp;
  }
  
}
