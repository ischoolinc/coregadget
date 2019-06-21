import { Component, OnInit } from '@angular/core';
import { BasicService } from './service';
import * as FileSaver from 'file-saver';
import { ClassReocrd, CommentRecord, DailyLifeInputConfig, StudentRecord, TargetRecord, ExamRecord, PerformanceDegree } from './data';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { BatchImportComponent } from './batch-import/batch-import.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  isLoading = true;
  loadError = '';
  // 目前學年度、學期、班級 是否可編輯評量項目
  canEdit = false;
  // 目前班級
  curClass: ClassReocrd = {} as ClassReocrd;
  // 班級清單
  classList: ClassReocrd[] = [];
  // 系統時間
  sysDateTime: string;
  // 目前學年度
  curSchoolYear: string;
  // 目前學期
  curSemester: string;
  // 學年度清單
  schoolYearList: string[];
  // 學期清單
  semesterList: string[];
  // 文字代碼表
  textCodeList: CommentRecord[] = [];
  // 程度代碼表
  degreeCodeList: PerformanceDegree[] =[]
  // 目前評量
  curExam: ExamRecord;
  // 日常生活表現評量項目
  examList: any[];
  // 學生清單
  studentList: StudentRecord[] = [];
  // 成績輸入時間設定
  dailyLifeInputConfig: DailyLifeInputConfig;
  // 目前班級成績輸入時間
  curTimeConfig: any;
  // 目前學生
  curStudent: StudentRecord;
  // 目前學生編號
  curStudentID: string;
  // 目前物件
  targetData: TargetRecord = {} as TargetRecord;
  /**
   * 判斷成績資料是否變更
   * 切換儲存按鈕樣式
   */
  isChange: boolean = false;

  bsModalRef: BsModalRef;
  
  constructor(
    private basicSrv: BasicService,
    private modalService: BsModalService
  ) {}

  async ngOnInit() {
    try {
      this.isLoading = true;
      this.loadError = '';
      this.schoolYearList = [];
      this.semesterList = [];

      const rsp = await Promise.all([
        this.basicSrv.getCurrentSemester(), // 0. 取得目前學年度學期
        this.basicSrv.getCurrentDateTime(), // 1. 取得主機時間
        this.basicSrv.getDailyLifeInputConfig(), // 2. 取得日常生活表現成績輸入時間
        this.basicSrv.getClass(), // 3. 取得班級清單
        this.basicSrv.getMoralCommentMappingTable(), // 4. 取得日常生活表現具體建議代碼表
        this.basicSrv.getDailyLifeMappingTable(), // 5. 取得日常生活表現評量項目、評分項目、努力程度
      ]);
      // rsp 資料整理
      {
        this.curSchoolYear = rsp[0].curSchoolYear;
        this.curSemester = rsp[0].curSemester;
        for(let i = 4; i >= 0; i--) {
          this.schoolYearList.push('' + (Number(this.curSchoolYear) - i));
        }
        this.sysDateTime = rsp[1];
        this.dailyLifeInputConfig = rsp[2];
        this.classList = rsp[3];
        this.textCodeList = rsp[4];
        this.examList = rsp[5].examList;
        this.degreeCodeList = rsp[5].degreeCode;
        this.curExam = rsp[5].examList[0] || {} as ExamRecord;
        if (rsp[3].length) {
          await this.setCurrentClass(rsp[3][0]);
        }
      }
    } catch (error) {
      console.log(error);
      this.loadError = '發生錯誤！';
    } finally {
      this.isLoading = false;
    }
  }

  /** 設定目前學年 */
  setSchoolYear(schoolYear: string) {
    let execute: boolean = false;
    if (this.isChange) {
      if (window.confirm("警告:尚未儲存資料，現在離開視窗將不會儲存本次更動")) {
        execute = true;  
      } 
    } else {
      execute = true;
    }

    if (execute) {
      this.curSchoolYear = schoolYear;
      this.isEditable();
      this.scoreDataReload();
    }
  }

  /** 設定目前學期 */
  setSemester(semester: string) {
    let execute: boolean = false;
    if (this.isChange) {
      if (window.confirm("警告:尚未儲存資料，現在離開視窗將不會儲存本次更動")) {
        execute = true;
      }
    } else {
      execute = true;
    }

    if (execute) {
      this.curSemester = semester;
      this.isEditable();
      this.scoreDataReload();
    }
  }

  /**
   * 設定目前班級
   * 0. 取得目前班級成績輸入時間
   * 1. 取得班級學生清單
   * 2. 取得學生成績資料
  */
  async setCurrentClass(item: ClassReocrd) {
    let execute: boolean = false;
    if (this.isChange) {
      if (window.confirm("警告:尚未儲存資料，現在離開視窗將不會儲存本次更動")) {
        execute = true;
      }
    } else {
      execute = true;
    }

    if (execute) {
      this.curClass = item;
      // 取得目前班級成績輸入時間
      {
        const time = this.dailyLifeInputConfig.Time.find(time => {
          return time.Grade === this.curClass.GradeYear;
        });
        this.curTimeConfig = time || '';
      }
      
      this.isEditable();
      await this.getClassStudent(item.ClassID);
      await this.scoreDataReload();
    }
  }

  /** 重新取得學生成績資料 */
  async scoreDataReload() {
    // 成績資料清空
    this.studentList.map((student: StudentRecord) => {
      student.DailyLifeScore = new Map();
    });
    await this.getStudentScore();

    // 資料變更重新設定目前物件
    {
      const target: TargetRecord = {
        Student: this.studentList[0],
        ItemName: this.curExam.Item[0].Name,
        NeedSetSeatNo: true,
        SetFocus: true
      }
      this.setTarget(target);
      // 資料reload isChange = flase
      this.isChange = false;
    }
  }

  /** 取得班級學生 */
  async getClassStudent(classID: string) {
    this.studentList = await this.basicSrv.getMyClassStudents(classID);
  }

  /** 取得學生成績 */
  async getStudentScore() {
    const scoreMapByStudentID = await this.basicSrv.getStudentDailyLifeScore(this.curClass.ClassID, this.curSchoolYear, this.curSemester);
    [].concat(this.studentList || []).forEach((student: StudentRecord) => {
      student.DailyLifeScore = scoreMapByStudentID.get(student.ID);
    });
  }

  /** 設定目前評量項目 */
  setCurrentExam(exam: ExamRecord) {
    this.curExam = exam;
    const data: TargetRecord = {
      Student: this.curStudent,
      // ExamID: exam.ExamID,
      ItemName: exam.Item[0].Name,
      NeedSetSeatNo: false,
      SetFocus: true
    };
    this.targetData = data;
  }

  /** 判斷目前學年度、學期、班級 是否可編輯 */
  isEditable() {
    if (this.curSchoolYear === this.dailyLifeInputConfig.SchoolYear && this.curSemester === this.dailyLifeInputConfig.Semester) {
      // 系統時間
      if ( Date.parse(this.sysDateTime).valueOf() >= Date.parse(this.curTimeConfig.Start).valueOf()
        && Date.parse(this.sysDateTime).valueOf() <= Date.parse(this.curTimeConfig.End).valueOf()) {
        this.canEdit = true;
      } else {
        this.canEdit = false;
      }
    } else{
      this.canEdit = false;
    }
  }

  /**studentBlock 設定目前物件 */
  setTarget(data: TargetRecord) {
    this.targetData = data;
    this.curStudent = data.Student;
  }

  /** 切換學生 */
  setCurStudent(student: StudentRecord) {
    this.curStudent = student;
  }

  /** inputBlock 寫入學生成績 */
  setStudentScore(student: StudentRecord) {
    const target: StudentRecord = this.studentList.find(stu => stu.ID === student.ID);
    if (target) {
      target.DailyLifeScore = student.DailyLifeScore;
    }
    this.checkAllTable();
  }

  /** 檢查成績資料是否變更 */
  checkAllTable() {
    let change: boolean = false;
    [].concat(this.studentList || []).forEach((student: StudentRecord) => {
      if (!change) {
        this.curExam.Item.forEach(item => {
          const curScore = student.DailyLifeScore.get(`${this.curExam.ExamID}_${item.Name}`);
          const originScore = student.DailyLifeScore.get(`Origin_${this.curExam.ExamID}_${item.Name}`);
          if (curScore !== originScore) {
            change = true;
          }
        });
      }
    });
    console.log('checkalltanle');
    this.isChange = change;
  }

  /**
   * 成績資料儲存
   * 儲存成功的話 dataReload
   */
  async saveAll() {
    const body = {
      Content: {
        Student: []
      }
    };
    // 成績資料整理
    [].concat(this.studentList || []).forEach((student: StudentRecord) => {
      const stuData = {
        '@StudentID': student.ID,
        DailyLifeScore: {
          TextScore: {
            DailyBehavior: {
              Item: []
            },
            DailyLifeRecommend: {},
            OtherRecommend: {}
          }
        }
      };

      const dailyBehavior = this.examList.find((exam: ExamRecord) => exam.ExamID === 'DailyBehavior');
      const dailyLifeRecommend = this.examList.find((exam: ExamRecord) => exam.ExamID === 'DailyLifeRecommend');
      const otherRecommend = this.examList.find((exam: ExamRecord) => exam.ExamID === 'OtherRecommend');

      dailyBehavior.Item.forEach((item: {Index: string, Name: string}) => {
        const itemData = {
          '@Name': item.Name,
          '@Degree': student.DailyLifeScore.get(`DailyBehavior_${item.Name}`)
        };
        stuData.DailyLifeScore.TextScore.DailyBehavior.Item.push(itemData);
      });

      stuData.DailyLifeScore.TextScore.DailyLifeRecommend = {
        '@Name': dailyLifeRecommend.Name,
        '@Description': student.DailyLifeScore.get('DailyLifeRecommend_文字描述')
      };

      stuData.DailyLifeScore.TextScore.OtherRecommend = {
        '@Name': otherRecommend.Name,
        '@Description': student.DailyLifeScore.get('OtherRecommend_文字描述')
      };

      body.Content.Student.push(stuData);
    });
    const result = await this.basicSrv.saveDailyLifeScore(body);
    if (result.Response.EffectRows) {
      // 重新取的學生成績資料
      this.scoreDataReload();
    } else {
      console.log(result);
    }
  }

  /** 匯出報表 */
  exportExcel() {
    if (this.isChange) {
      alert('資料尚未儲存，無法匯出。');
      return;
    }
    if (this.studentList.length > 0) {

      // 標題列
      const titleList: string[] = [];
      // 學生資料
      const dataList: string[] = [];

      // 資料整理
      {
        titleList.push(`<td width='40px'>座號</td>`);
        titleList.push(`<td width='70px'>姓名</td>`);
        [].concat(this.curExam.Item || []).forEach((item: {Index: string, Name: string}) => {
          titleList.push(`<td>${item.Name}</td>`);
        });

        this.studentList.forEach((student: StudentRecord) => {

          const tdList: string[] = [];
          tdList.push(`<td>${student.SeatNumber}</td>`);
          tdList.push(`<td>${student.Name}</td>`);

          [].concat(this.curExam.Item || []).forEach((item: { Index: string, Name: string}) => {
            const score = student.DailyLifeScore.get(`${this.curExam.ExamID}_${item.Name}`);
            tdList.push(`<td>${score}</td>`);
          }); 
          const data: string = `
            <tr>
              ${tdList.join('')}
            </tr>
          `;

          dataList.push(data);
      });
      }

    const html: string = `
<html>
    <head>
      <meta http-equiv=\'Content-Type\' content=\'text/html; charset=utf-8\'/>
    </head>
    <body onLoad='self.print()'>
      <table border='1' cellspacing='0' cellpadding='2'>${this.curClass.ClassName} 日常生活表現 - ${this.curExam.Name}
        <tr>
          ${titleList.join('')}
        </tr>
        ${dataList.join('')}
      </table>
      <br/>教師簽名：
    </body>
</html>
        `;

      const blob: Blob = new Blob([html], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob,`${this.curClass.ClassName} 日常生活表現 - ${this.curExam.Name}.xls`);
    }
  }

  openCommentCode(itemName: string) {
    if (this.canEdit) {
      const config = {
        class: 'modal-lg',
        initialState: {
          data: {
            title: itemName,
            studentList: this.studentList,
          },
          callback: (data: string[]) => {
            console.log(data);
            
            // 寫入匯入解析後的成績資料
            [].concat(this.studentList || []).forEach((stu: StudentRecord) => {
              stu.DailyLifeScore.set(`${this.curExam.ExamID}_${itemName}`,data[stu.Index]);
            });
            /**
             * 更新目前學生資料
             * inputBlock 資料同步
             */
            {
              const td: TargetRecord = {
                Student: this.studentList.find((stu: StudentRecord) => stu.ID === this.targetData.Student.ID),
                ItemName: itemName,
                NeedSetSeatNo: false,
                SetFocus: true
              };
              this.targetData = td;
            }
            // 檢查成績資料是否變更
            this.checkAllTable();
            this.bsModalRef.hide();
          }
        }
      }; 
      this.bsModalRef = this.modalService.show(BatchImportComponent, config);
    }
  }
}