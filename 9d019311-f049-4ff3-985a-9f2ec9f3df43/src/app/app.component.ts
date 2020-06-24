import { Component, OnInit, OnDestroy } from '@angular/core';
import { BasicService } from './service';
import { TargetDataService } from './service/target-data.service';
import { BatchImportComponent } from './batch-import/batch-import.component';
import { GadgetService } from './gadget.service';
import { ClassReocrd, CommentRecord, DailyLifeInputConfig, StudentRecord, ExamRecord, PerformanceDegree } from './data';
import * as FileSaver from 'file-saver';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {

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
  // 學期清單
  semesterList: string[];
  // 文字代碼表
  textCodeList: CommentRecord[] = [];
  // 程度代碼表
  degreeCodeList: PerformanceDegree[] =[];
  // 目前評量
  curExam: ExamRecord;
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
  //按鈕狀態及title
  btnState: string;
  saveBtnTitle: string; 
  dropdowndisplay: boolean = true;
  
  //匯出學期格式轉換成國字（比照成績單格式）
  expocurSemester: string;

  /**
   * 判斷成績資料是否變更
   * 切換儲存按鈕樣式
   */
  isChange: boolean = false;
  bsModalRef: BsModalRef;
  isNoExam: boolean = false;
  
  
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
    this.targetDataSrv.studenList$.pipe(
      takeUntil(this.dispose$)
    ).subscribe((stuList: StudentRecord[]) => {
      this.studentList = stuList;
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
        this.basicSrv.getDailyLifeMappingTable(), // 5. 取得日常生活表現評量項目、評分項目、努力程度
      ]);
      // rsp 資料整理
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
      this.textCodeList = rsp[4];
      this.examList = rsp[5].examList;
      this.degreeCodeList = rsp[5].degreeCode;
      // 設定目前評量
      if (this.examList.length > 0) {
        this.setCurrentExam(this.examList[0] || {} as ExamRecord);
      } else {
        this.isNoExam = true;
      }
      // 設定目前班級
      if (this.classList.length > 0) {
        await this.setCurrentClass(this.classList[0]);
      }

    } catch (error) {
      console.log(error);
      this.loadError = '發生錯誤！';
    } finally {
      this.isLoading = false;
    }
  }

  ngOnDestroy() {
    this.dispose$.next();
  }

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
        const time = this.dailyLifeInputConfig.Time.find(time => time.Grade === this.curClass.GradeYear);
        this.curClassTimeConfig = time || '';
      }
      //取得目前班級可輸入或查看的學年度範圍
      switch(this.curClass.GradeYear)
      {
          case '1'||'7': 
          this.schoolYearList = this.schoolYearList1;
          this.setSchoolYear(this.schoolYearList1[this.schoolYearList1.length-1]); 
          break;
          case '2'||'8': 
          this.schoolYearList = this.schoolYearList2;
          this.setSchoolYear(this.schoolYearList1[this.schoolYearList1.length-1]); 
          break;
          case '3'||'9': 
          this.schoolYearList = this.schoolYearList3;
          this.setSchoolYear(this.schoolYearList1[this.schoolYearList1.length-1]); 
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
    this.studentList.map((student: StudentRecord) => {student.DailyLifeScore = new Map();});
    // 預設資料
    let defaultStuData: Map<string,string> = new Map();
    {
      const dailyBehavior = this.examList.find((exam: ExamRecord) => exam.ExamID === 'DailyBehavior');
      if (dailyBehavior.Item.length > 0) {
        dailyBehavior.Item.forEach((item: any) => {
          defaultStuData.set(`DailyBehavior_${item.Name}`,'');
          defaultStuData.set(`Origin_DailyBehavior_${item.Name}`,'');
        });
      }
      defaultStuData.set(`DailyLifeRecommend_文字描述`,'');
      defaultStuData.set(`Origin_DailyLifeRecommend_文字描述`,'');
      defaultStuData.set(`OtherRecommend_文字描述`,'');
      defaultStuData.set(`Origin_OtherRecommend_文字描述`,'');
    }
      
    const scoreMapByStudentID = await this.basicSrv.getStudentDailyLifeScore(this.curClass.ClassID, this.curSchoolYear, this.curSemester);
    [].concat(this.studentList || []).forEach((student: StudentRecord) => {
      student.DailyLifeScore = scoreMapByStudentID.get(student.ID) || new Map(defaultStuData);
    });

    this.targetDataSrv.setStudentList(this.studentList);
    if (this.studentList.length > 0) {
      this.targetDataSrv.setStudent(this.studentList[0]);
    }
    // 檢查是否有評分項目，有的話才設定評分項目
    if (this.curExam.Item.length > 0) {
      this.targetDataSrv.setQuizName(this.curExam.Item[0].Name);
    }
    this.isChange = false;
  }

  /** 設定目前評量項目 */
  setCurrentExam(exam: ExamRecord) {
    this.curExam = exam;
    this.targetDataSrv.setExam(this.curExam);

    // 檢查日常生活表現評量是否有評分項目，有的話設定目前評分項目
    if (this.curExam.Item.length > 0) {
      this.targetDataSrv.setQuizName(this.curExam.Item[0].Name);
    }
  }

  /** 判斷目前學年度、學期、班級 是否可編輯及儲存 */
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
          const curScore = student.DailyLifeScore.get(`${this.curExam.ExamID}_${item.Name}`);
          const originScore = student.DailyLifeScore.get(`Origin_${this.curExam.ExamID}_${item.Name}`);
          if (curScore !== originScore) {
            change = true;
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
    this.isLoading = true;
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
          '@Index': item.Index,
          '@Degree': student.DailyLifeScore.get(`DailyBehavior_${item.Name}`) || ''
        };
        stuData.DailyLifeScore.TextScore.DailyBehavior.Item.push(itemData);
      });

      stuData.DailyLifeScore.TextScore.DailyLifeRecommend = {
        '@Name': dailyLifeRecommend.Name,
        '@Description': student.DailyLifeScore.get('DailyLifeRecommend_文字描述') || ''
      };

      stuData.DailyLifeScore.TextScore.OtherRecommend = {
        '@Name': otherRecommend.Name,
        '@Description': student.DailyLifeScore.get('OtherRecommend_文字描述') || ''
      };

      body.Content.Student.push(stuData);
    });
    const result = await this.basicSrv.saveDailyLifeScore(body);
    if (result.Response.EffectRows) {
      // 重新取的學生成績資料
      await this.scoreDataReload();
      this.isLoading = false;  
      $('#saveSuccess').modal('show')
    } else {
      console.log(result);
      this.isLoading = false;
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
            const score = student.DailyLifeScore.get(`${this.curExam.ExamID}_${item.Name}`) || '';
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
    if(this.curSemester === '1'){
      this.expocurSemester = '一';
    }else{
      this.expocurSemester = '二';
    }
    const html: string = `
<html>
    <head>
      <meta http-equiv=\'Content-Type\' content=\'text/html; charset=utf-8\'/>
    </head>
    <body onLoad='self.print()'>
      <table border='1' cellspacing='0' cellpadding='2'>${this.curSchoolYear}學年度 第${this.expocurSemester}學期 ${this.curClass.ClassName} 日常生活表現 - ${this.curExam.Name}
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
          textCodeList: this.textCodeList,
          degreeCodeList: this.degreeCodeList,
          curExam:this.curExam
        }
      }; 
      this.bsModalRef = this.modalService.show(BatchImportComponent, config);
    }
  }
  
}