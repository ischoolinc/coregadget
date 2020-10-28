import { Component, OnInit } from '@angular/core';
import { BasicService } from './service';
import * as FileSaver from 'file-saver';
import { ClassReocrd, CommentCode, DailyLifeInputConfig, StudentRecord, ExamRecord, LevelCode, EffortCode } from './data';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { BatchImportComponent } from './batch-import/batch-import.component';
import { GadgetService } from './gadget.service';
import { TargetDataService } from './service/target-data.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  dispose$ = new Subject();
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
  schoolYearList1: string[];
  schoolYearList2: string[];
  schoolYearList3: string[];

  dropdowndisplay: boolean = true;

  // 學期清單
  semesterList: string[];
  // 導師評語代碼表
  commentCodeList: CommentCode[] = [];
  // 表現程度代碼表
  levelCodeList: LevelCode[] =[]
  // 努力程度代碼表
  effortCodeList: EffortCode[] = [];
  // 目前評量
  curExam: ExamRecord;
  // 目前評分項目
  curQuizName: string;
  // 日常生活表現評量項目
  examList: any[];
  // 學生清單
  studentList: StudentRecord[] = [];
  // 成績輸入時間設定
  dailyLifeInputConfig: DailyLifeInputConfig;
  // 目前班級成績輸入時間
  curClassTimeConfig: any;
  // 目前學生
  curStudent: StudentRecord;

  // 全班都是在在校生的 班級 
  ClassWithStuStatus1 :ClassReocrd[] =[];

  btnState: string;
  saveBtnTitle: string; 

  // 目前學生編號
  curStudentID: string;

  /**
   * 判斷成績資料是否變更
   * 切換儲存按鈕樣式
   */
  isChange: boolean = false;

  bsModalRef: BsModalRef;
  
  constructor(
    private basicSrv: BasicService,
    private gadget: GadgetService,
    private modalService: BsModalService,
    private targetDataSrv: TargetDataService
  ) {
    this.gadget.onLeave(() => {
      if (this.isChange) {
        return '尚未儲存資料，現在離開視窗將不會儲存本次更動';
      }
      else {
        return '';
      }
    });
  }

  async ngOnInit() {
    this.targetDataSrv.studentList$.pipe(
      takeUntil(this.dispose$)
    ).subscribe((stu: StudentRecord[]) => {
      this.checkAllTable();
    });

    try {
      this.isLoading = true;
      this.loadError = '';
      this.schoolYearList = [];
      this.schoolYearList1 = [];
      this.schoolYearList2 = [];
      this.schoolYearList3 = [];
      this.semesterList = [];

      const rsp = await Promise.all([
        this.basicSrv.getCurrentSemester(), // 0. 取得目前學年度學期
        this.basicSrv.getCurrentDateTime(), // 1. 取得主機時間
        this.basicSrv.getDailyLifeInputConfig(), // 2. 取得日常生活表現成績輸入時間
        this.basicSrv.getClass(), // 3. 取得班級清單
        this.basicSrv.getMoralCommentMappingTable(), // 4. 取得日常生活表現具體建議代碼表
        this.basicSrv.getEffortDegreeMappingTable(), // 5. 取得努力程度對照表
        this.basicSrv.getDailyLifeMappingTable(), // 6. 取得日常生活表現評量項目、評分項目、努力程度
        this.basicSrv.getClassStudentStatus1()
      ]);
      // rsp 資料整理
      {
        this.curSchoolYear = rsp[0].curSchoolYear;
        this.curSemester = rsp[0].curSemester;
        for(let i = 4; i >= 0; i--) {
          this.schoolYearList.push('' + (Number(this.curSchoolYear) - i));
        }
        this.schoolYearList1.push('' + (Number(this.curSchoolYear))); 
        for(let i = 1; i >= 0; i--) {
          this.schoolYearList2.push('' + (Number(this.curSchoolYear) - i));
        }
        for(let i = 2; i >= 0; i--) {
          this.schoolYearList3.push('' + (Number(this.curSchoolYear) - i));
        }
        this.sysDateTime = rsp[1];
        this.dailyLifeInputConfig = rsp[2];
        this.classList = rsp[3];
        this.commentCodeList = rsp[4];
        this.effortCodeList = rsp[5];
        this.examList = rsp[6].examList;
        this.levelCodeList = rsp[6].degreeCode;
        this.ClassWithStuStatus1 = rsp[7];
        
       
        // console.log("levelCodeList",this.levelCodeList);
        // 處理一下班級 沒有status的學生
    
       this.classList = this.ClassWithStuStatus1 ;
        // 設定目前評量
        this.setCurrentExam(this.examList[0] || {} as ExamRecord);
        // 設定目前班級
        if (this.classList.length) {
          await this.setCurrentClass(this.classList[0]);
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
  async setCurrentClass(classRec: ClassReocrd) {
   
    let execute: boolean = false;
    if (this.isChange) {
      if (window.confirm("警告:尚未儲存資料，現在離開視窗將不會儲存本次更動")) {
        execute = true;
      }
    } else {
      execute = true;
    }

    if (execute) {
      this.curClass = classRec;
      // 取得目前班級成績輸入時間
      {
        const time = this.dailyLifeInputConfig.Time.find(time => {
          return time.Grade === this.curClass.GradeYear;
        });
        this.curClassTimeConfig = time || '';
      }

      switch(this.curClass.GradeYear)
      {
        
          case '1': this.schoolYearList = this.schoolYearList1;
          break;
          case '2': this.schoolYearList = this.schoolYearList2;
          break;
          case '3': this.schoolYearList = this.schoolYearList3;
          break;
          case '7': this.schoolYearList = this.schoolYearList1;
          break;
          case '8': this.schoolYearList = this.schoolYearList2;
          break;
          case '9': this.schoolYearList = this.schoolYearList3;
          break;
      }
      
      this.isEditable();
      await this.getClassStudent();
      await this.scoreDataReload();
    }
  }

  /** 取得班級學生 */
  async getClassStudent() {
    this.studentList = await this.basicSrv.getMyClassStudents(this.curClass.ClassID);
    this.curStudent = this.studentList[0];
  }

  /** 重新取得學生成績資料 */
  async scoreDataReload() {
    // 成績資料清空
    this.studentList.map((student: StudentRecord) => {
      student.DailyLifeScore = new Map();
    });

    // 取得學生成績
    {
      const defaultStuData: Map<string,string> = new Map();
      // 預設資料
      {
        // 取得評量
        const dailyBehavior = this.examList.find((exam: ExamRecord) => exam.ExamID === 'DailyBehavior');
        const groupActivity = this.examList.find((exam: ExamRecord) => exam.ExamID === 'GroupActivity');
        const publicService = this.examList.find((exam: ExamRecord) => exam.ExamID === 'PublicService');
        const schoolSpecial = this.examList.find((exam: ExamRecord) => exam.ExamID === 'SchoolSpecial');

        dailyBehavior.Item.forEach((item: any) => {
          defaultStuData.set(`DailyBehavior_${item.Name}`,'');
          defaultStuData.set(`Origin_DailyBehavior_${item.Name}`,'');
        });
        groupActivity.Item.forEach((item: any) => {
          defaultStuData.set(`GroupActivity_${item.Name}_努力程度`,'');
          defaultStuData.set(`GroupActivity_${item.Name}_文字評量`,'');
          defaultStuData.set(`Origin_GroupActivity_${item.Name}_努力程度`,'');
          defaultStuData.set(`Origin_GroupActivity_${item.Name}_文字評量`,'');
        });
        publicService.Item.forEach((item: any) => {
          defaultStuData.set(`PublicService_${item.Name}`,'');
          defaultStuData.set(`Origin_PublicService_${item.Name}`,'');
        });
        schoolSpecial.Item.forEach((item: any) => {
          defaultStuData.set(`SchoolSpecial_${item.Name}`,'');
          defaultStuData.set(`Origin_SchoolSpecial_${item.Name}`,'');
        });
        defaultStuData.set(`DailyLifeRecommend_文字描述`,'');
        defaultStuData.set(`Origin_DailyLifeRecommend_文字描述`,'');
      }
      const scoreMapByStudentID = await this.basicSrv.getStudentDailyLifeScore(this.curClass.ClassID, this.curSchoolYear, this.curSemester);
      [].concat(this.studentList || []).forEach((student: StudentRecord) => {
        student.DailyLifeScore = scoreMapByStudentID.get(student.ID) || new Map(defaultStuData);
      });
    }

    // service 資料更新
    this.targetDataSrv.setStudentList(this.studentList);
    if (this.studentList.length) {
      this.targetDataSrv.setStudent(this.studentList[0]);
    }
    if (this.curExam.Item.length > 0) {
      this.targetDataSrv.setQuizName(this.curExam.Item[0].Name);
    }
    // 資料reload isChange = flase
    this.isChange = false;
  }

  /** 設定目前評量項目 */
  setCurrentExam(exam: ExamRecord) {
    this.curExam = exam;
    this.targetDataSrv.setExam(this.curExam);

    if (exam.Item && exam.Item.length > 0) {
      if (exam.ExamID === 'GroupActivity') {
        this.curQuizName = `${exam.Item[0].Name}_努力程度`;
        this.targetDataSrv.setQuizName(this.curQuizName);
      } else {
        this.curQuizName = exam.Item[0].Name;
        this.targetDataSrv.setQuizName(this.curQuizName);
      }
    }
  }

  /** 判斷目前學年度、學期、班級 是否可編輯 */
  isEditable() {
  
    if (this.curSchoolYear === this.dailyLifeInputConfig.SchoolYear && this.curSemester === this.dailyLifeInputConfig.Semester) {
      // 系統時間
      if ( Date.parse(this.sysDateTime).valueOf() >= Date.parse(this.curClassTimeConfig.Start).valueOf()
        && Date.parse(this.sysDateTime).valueOf() <= Date.parse(this.curClassTimeConfig.End).valueOf()) {
        this.canEdit = true;
        this.dropdowndisplay = true;
        this.btnState = "";
        this.saveBtnTitle = "";
      } else {
        this.canEdit = false;
        this.dropdowndisplay = false;
        this.btnState = "disabled";
        this.saveBtnTitle = "不在輸入時間內";
      }
    } else{
      this.canEdit = false;
      this.dropdowndisplay = false;
      this.btnState = "disabled";
      this.saveBtnTitle = "非現學年度學期，僅供查看";
    }
    this.targetDataSrv.setCanEdit(this.canEdit);
  }

  /** 切換學生 */
  setCurStudent(student: StudentRecord) {
    this.curStudent = student;
  }

  /** 檢查成績資料是否變更 */
  checkAllTable() {
    let change: boolean = false;
    [].concat(this.studentList || []).forEach((student: StudentRecord) => {
      if (!change) {
        this.curExam.Item.forEach(item => {
          if (this.curExam.ExamID === 'GroupActivity') {
            const curScoreDegree = student.DailyLifeScore.get(`${this.curExam.ExamID}_${item.Name}_努力程度`);
            const originScoreDegree = student.DailyLifeScore.get(`Origin_${this.curExam.ExamID}_${item.Name}_努力程度`);
            const curScoreText = student.DailyLifeScore.get(`${this.curExam.ExamID}_${item.Name}_文字評量`);
            const originScoreText = student.DailyLifeScore.get(`Origin_${this.curExam.ExamID}_${item.Name}_文字評量`);
            if (curScoreDegree !== originScoreDegree) {
              change = true;
            }
            if (curScoreText !== originScoreText) {
              change = true;
            }
          } else {
            const curScore = student.DailyLifeScore.get(`${this.curExam.ExamID}_${item.Name}`);
            const originScore = student.DailyLifeScore.get(`Origin_${this.curExam.ExamID}_${item.Name}`);
            if (curScore !== originScore) {
              change = true;
            }
          }
          
        });
      }
    });
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
            GroupActivity: {
              Item: []
            },
            PublicService: {
              Item: []
            },
            SchoolSpecial: {
              Item: []
            },
            DailyLifeRecommend: {}
          }
        }
      };
      // 取得評量
      const dailyBehavior = this.examList.find((exam: ExamRecord) => exam.ExamID === 'DailyBehavior');
      const groupActivity = this.examList.find((exam: ExamRecord) => exam.ExamID === 'GroupActivity');
      const publicService = this.examList.find((exam: ExamRecord) => exam.ExamID === 'PublicService');
      const schoolSpecial = this.examList.find((exam: ExamRecord) => exam.ExamID === 'SchoolSpecial');
      const dailyLifeRecommend = this.examList.find((exam: ExamRecord) => exam.ExamID === 'DailyLifeRecommend');
      
      // DailyBehavior
      dailyBehavior.Item.forEach((item: {Index: string, Name: string}) => {
        const data = {
          '@Name': item.Name,
          '@Degree': student.DailyLifeScore.get(`DailyBehavior_${item.Name}`) || '',
          '@Index': item.Index
        };
        stuData.DailyLifeScore.TextScore.DailyBehavior.Item.push(data);
      });
      // GroupActivity
      groupActivity.Item.forEach((item: any) => {
        const degree = student.DailyLifeScore.get(`GroupActivity_${item.Name}_努力程度`) || '';
        const description = student.DailyLifeScore.get(`GroupActivity_${item.Name}_文字評量`) || '';
        const data = {
          '@Name': item.Name,
          '@Degree': degree,
          '@Description': description
        };
        stuData.DailyLifeScore.TextScore.GroupActivity.Item.push(data);
      });
      // PublicService
      publicService.Item.forEach((item: any) => {
        const data = {
          '@Name': item.Name,
          '@Description': student.DailyLifeScore.get(`PublicService_${item.Name}`) || ''
        };
        stuData.DailyLifeScore.TextScore.PublicService.Item.push(data);
      });
      // SchoolSpecial
      schoolSpecial.Item.forEach((item: any) => {
        const data = {
          '@Name': item.Name,
          '@Description': student.DailyLifeScore.get(`SchoolSpecial_${item.Name}`) || ''
        };
        stuData.DailyLifeScore.TextScore.SchoolSpecial.Item.push(data);
      });
      // DailyLifeRecommend
      stuData.DailyLifeScore.TextScore.DailyLifeRecommend = {
        '@Name': dailyLifeRecommend.Name,
        '@Description': student.DailyLifeScore.get('DailyLifeRecommend_文字描述') || ''
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
      // 副標題
      const scTitleList: string[] = [];
      // 學生資料
      const dataList: string[] = [];

      // 資料整理
      {
        if (this.curExam.ExamID === 'GroupActivity') {
          titleList.push(`<td rowspan="2" width='40px'>座號</td>`);
          titleList.push(`<td rowspan="2" width='70px'>姓名</td>`);
          [].concat(this.curExam.Item || []).forEach(item => {
            titleList.push(`<td colspan="2">${item.Name}</td>`);
            scTitleList.push('<td>努力程度</td>');
            scTitleList.push('<td>文字評量</td>');
          });
        } else {
          titleList.push(`<td width='40px'>座號</td>`);
          titleList.push(`<td width='70px'>姓名</td>`);
          [].concat(this.curExam.Item || []).forEach(item => {
            titleList.push(`<td>${item.Name}</td>`);
          });
        }

        this.studentList.forEach((student: StudentRecord) => {

          const tdList: string[] = [];
          tdList.push(`<td>${student.SeatNumber}</td>`);
          tdList.push(`<td>${student.Name}</td>`);

          [].concat(this.curExam.Item || []).forEach((item: { Index: string, Name: string}) => {
            if (this.curExam.ExamID === 'GroupActivity') {
              const effortScore = student.DailyLifeScore.get(`${this.curExam.ExamID}_${item.Name}_努力程度`);
              tdList.push(`<td>${effortScore}</td>`);
              const commentScore = student.DailyLifeScore.get(`${this.curExam.ExamID}_${item.Name}_文字評量`);
              tdList.push(`<td>${commentScore}</td>`);
            } else {
              const score = student.DailyLifeScore.get(`${this.curExam.ExamID}_${item.Name}`);
              tdList.push(`<td>${score}</td>`);
            }
          }); 
          const data: string = `<tr>${tdList.join('')}</tr>`;
          dataList.push(data);
      });
      }

    const html: string = (this.curExam.ExamID === 'GroupActivity') ? `
<html>
  <head>
    <meta http-equiv=\'Content-Type\' content=\'text/html; charset=utf-8\'/>
  </head>
  <body onLoad='self.print()'>
    <table border='1' cellspacing='0' cellpadding='2'> ${this.curSchoolYear} 學年度  第${this.curSemester} 學期  ${this.curClass.ClassName} 日常生活表現 - ${this.curExam.Name}
      <tr>
        ${titleList.join('')}
      </tr>
      <tr>
        ${scTitleList.join('')}
      </tr>
      ${dataList.join('')}
    </table>
    <br/>教師簽名：
  </body>
</html>
        ` : `
<html>
  <head>
    <meta http-equiv=\'Content-Type\' content=\'text/html; charset=utf-8\'/>
  </head>
  <body onLoad='self.print()'>
    <table border='1' cellspacing='0' cellpadding='2'> ${this.curSchoolYear} 學年度  第${this.curSemester} 學期 ${this.curClass.ClassName} 日常生活表現 - ${this.curExam.Name}
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

  /** 開啟匯入畫面 */
  openBatchModal(quizName: string) {
    if (this.canEdit) {
      const config = {
        class: 'modal-lg',
        initialState: {
          title: quizName,
          textCodeList: this.commentCodeList,
          degreeCodeList: this.levelCodeList,
          effortCodeList :this.effortCodeList,
          curExam:this.curExam

        }
      }; 
      this.bsModalRef = this.modalService.show(BatchImportComponent, config);
    }
  }
  
}