import { ScoreRec, } from './data/score';
import { GadgetService } from './gadget.service';
import { Component, OnInit, NgZone, Inject, TemplateRef} from '@angular/core';
import { StudentRec, ClassRec ,ExamScoreRec, MatrixRec, ExamRec, ExamRankRec, SSRec, ScoreRankInfo } from './data';
import NP from 'number-precision';
import { avgPipe } from './pipes/avgPipe.pipe';
import { setTheme } from 'ngx-bootstrap/utils';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [],
  providers: [
    avgPipe,
  ]
})
export class AppComponent implements OnInit {
  // 運作基本參數
  isFirstLoading: boolean;
  isLoading: boolean; // 讓html可以依此變數來調整畫面呈現
  contract: any; // 用來接收GadgetService getContract的結果，並運用在各service呼叫

  // 班級相關變數 
  curClass:ClassRec = {} as ClassRec;  
  classList: ClassRec[] = []; // 字串集合的陣列，存放使用者班級清單

  // 學年度學期相關變數
  curSS: SSRec = {} as SSRec;
  ssList: SSRec[];


  initScorType: ScoreRec = {
    score: '',
    type: '', 
    symbol: '',
    noneScore: null
  }

  // 排名類型相關變數
  matrixList = [];  // 排名母群存放的陣列
  curMatrix: String;
  rankType = [];
  stuExamRank :ScoreRankInfo[];
  oriSemesSubRank = []; // 原先評估要把排行資料依排行類型做分類，分別組成四個陣列，但現行先決定直接用原資料來做吃料處理

  // 平均類型相關變數
  avgTypeList = ['算術平均','加權平均'];
  curAvgType = this.avgTypeList[0];
  //curAvgTypeForServer = '平均'; //因為資料庫中算術平均儲存的字串為'平均'
  
  // 科目相關變數
  subjectList: string[]

  /// 學生清單相關變數
  studentList: StudentRec[];

  // 成績相關變數
  examMatrix = {}; // 即時加總的的級距
  examMatrix2 = {}; // 直接撈DB資料組成的級距及五標
  fiveRange = [
    {key: 'avg_top_25', value: '頂標'}
    , {key: 'avg_top_50', value: '高標'}
    , {key: 'avg', value: '均標'}
    , {key: 'avg_bottom_50', value: '低標'}
    , {key: 'avg_bottom_25', value: '底標'}
  ];

  rangeList = [
    {key: 'level_gte100', value: '>= 100'}
    , {key: 'level_90', value: '>= 90, < 100'}
    , {key: 'level_80', value: '>= 80, < 90'}
    , {key: 'level_70', value: '>= 70, < 80'}
    , {key: 'level_60', value: '>= 60, < 70'}
    , {key: 'level_50', value: '>= 50, < 60'}
    , {key: 'level_40', value: '>= 40, < 50'}
    , {key: 'level_30', value: '>= 30, < 40'}
    , {key: 'level_20', value: '>= 20, < 30'}
    , {key: 'level_10', value: '>= 10, < 20'}
    , {key: 'level_lt10', value: '< 10'}
  ]


  constructor(
    private gadget: GadgetService,
    private avgPipe: avgPipe,
    private modalService: BsModalService,
    ) {
      setTheme('bs4'); // ngx-bootstrap設定
  }

  async ngOnInit() {
    NP.enableBoundaryChecking(false); //number-precision此套件的設定
    this.isFirstLoading = true;
    
    try{
      this.contract = await this.gadget.getContract('ischool.exam.teacher');
      await this.getMyClass();
      await this.GetSemsSubjSS();
      await this.GetClassStudent();
      await this.GetSubject();
      await this.GetStuRankType();
      await this.GetStuExamRank();
      await this.GetStuSemsScore();
      await this.GetRangeMaterix();
      // await this.getRange();
      //await this.GetExamRankMatrix();


    }catch(err){
      console.log(err);
    }finally{
      this.isFirstLoading = false;
    }
    this.isFirstLoading = false;
  }

  // 呼叫service獲取資料類型function 區塊 

  /** 取得班級 */
  async getMyClass() {
    this.classList = [];
    try {
      const rsp = await this.contract.send('GetMyClass', {});
      this.classList = [].concat(rsp.Class ||[]);
      this.curClass = this.classList[0];
    } catch (error) {
      console.log('取得班級失敗' + error.message);
      return
    }
  }

  /** 取得學年度學期 */
  async GetSemsSubjSS() {
    this.ssList = [];
    try {
      const rsp = await this.contract.send('GetSemsScoreSS',{
        ClassID: this.curClass.id
      });
      this.ssList = [].concat(rsp.SchoolYearSemester || []).map((data:SSRec) => {
          data.content = `${data.school_year}學年度${data.semester}學期`
          return data;
      });
      this.curSS = this.ssList[0];
    } catch (error) {
      console.log('取得學年度學期錯誤' + error.message);
    }
  }

  /** 取得班級學生 */
  async GetClassStudent(){
    this.studentList = [];
    try{
      const rsp = await this.contract.send('GetClassStudent',{
        ClassID:this.curClass.id
      });
      this.studentList = [].concat(rsp.Students || []).map((stu: StudentRec) => {
        stu.subject = {};
        return stu;
      });
    } catch (err) {
      console.log('取得班級學生失敗' + err.message);
      return
    }
    //console.log(this.studentList);
  }

/** 取得科目清單 */
async GetSubject(){

  this.subjectList = [];
  try {
    const rsp = await this.contract.send('GetSHSubject', {
      ClassID: this.curClass.id
      , SchoolYear: this.curSS.school_year
      , Semester: this.curSS.semester
    });
    this.subjectList = [].concat(rsp.SemesSubj || []).map((subj) => {
      return subj.subject;
    });
  } catch (err) {
    console.log('建立學期科目清單失敗' + err.message);
    return
  }
  //console.log(this.studentList);
}

/** 取得學期成績排名類型,排名母群類型
 * 排名類型：{學期科目/學期分項/學期科目(原始)/學期分項(原始)}
 * 排名母群類型：{班排名/年排名/科排名/類別排名}
 * 
 * @param ClassID
 * @param SchoolYear
 * @param Semester
*/
async GetStuRankType() {
  try {
    const rsp = await this.contract.send('GetSHRankType', {
      ClassID: this.curClass.id
      , SchoolYear: this.curSS.school_year
      , Semester: this.curSS.semester
    });
      console.log(rsp);
      this.matrixList = [];
      this.rankType = [];
      //建立排名母群類型清單
      rsp.RankGType.forEach(i => {
        this.matrixList.push(i.rank_group_type);
      });
      this.curMatrix = this.matrixList[0];

      //建立排名類型清單
      rsp.RankType.forEach(i => {
        this.rankType.push(i.rank_type);
      })
      console.log(this.rankType);
    } catch (error) {
      console.log('取得學期成績排名類型,排名母群類型' + error.message);
    }
  }

/** 取得學期科目成績
 * 
 * @param ClassID
 * @param SchoolYear
 * @param Semester
*/
async GetStuSemsScore() {
  // this.subjectList = [];
  try {
    const rsp = await this.contract.send('GetSHExamScore', {
      ClassID: this.curClass.id
      , SchoolYear: this.curSS.school_year
      , Semester: this.curSS.semester
    });
      console.log(rsp);

      // [].concat(rsp.SemesScore || []).forEach((data: ExamScoreRec) => {
      //   // 建立學期科目清單（之後應該要新增一支service來單純取得科目清單）
      //   try{ 
      //     this.buildSub(data.subject); 
      //     console.log(this.subjectList);
      //   } catch(err) { 
      //     console.log('建立學期科目清單失敗' + err.message);
      //   }
      // });
      // console.log(this.subjectList);
      // 初始化級距清單
      this.initiRange();

      [].concat(rsp.SemesScore || []).forEach((data: ExamScoreRec) => {
          // 建立學期科目清單
          try{ 
            this.buildstuSub();
          } catch(err) { 
            console.log('建立學期科目清單失敗' + err.message);
          }
          
          // 寫入各項成績
          try {
            this.insertStuScore(data);
          } catch (error) {
            console.log('寫入各項成績失敗' + error.message);
          }
        });
        this.insertStuRank();
        console.log(this.studentList);
        console.log(this.examMatrix);
  } catch (error) {
    console.log('取得成績失敗' + error.message);
  }
}

/** 取得學期成績排名{科目/分項/科目(原始)/分項(原始)}
 * 
 * @param ClassID
 * @param SchoolYear
 * @param Semester
*/ 
async GetStuExamRank() {
  this.oriSemesSubRank = [];
  try {
    const rsp = await this.contract.send('GetSHScoreRank', {
      ClassID: this.curClass.id
      , SchoolYear: this.curSS.school_year
      , Semester: this.curSS.semester
    });
      console.log(rsp);
      this.stuExamRank = [].concat(rsp.SemesScore || []);
      this.oriSemesSubRank = [].concat(this.stuExamRank.filter(r => r.item_type === '學期/科目成績(原始)'));
    } catch (error) {
      console.log('取得成績失敗' + error.message);
    }
  }


async GetExamRankMatrix(){

}
  // 設定類型function 區塊

  
  async setClass(data:ClassRec){ // 用於設定班級，會影響學年度學期的資料內容
    this.isLoading = true;
    this.curClass = data;
    await this.getMyClass();
    await this.GetSemsSubjSS();
    await this.GetClassStudent();
    await this.GetSubject();
    await this.GetStuRankType();
    await this.GetStuExamRank();
    await this.GetStuSemsScore();
    await this.GetRangeMaterix();
    this.isLoading = false;
  };

  async setSS(data: SSRec){ //用於設定學年度學期
    this.isLoading = true;
    this.curSS = data;
    await this.GetSubject();
    await this.GetStuRankType();
    await this.GetStuExamRank();
    await this.GetStuSemsScore();
    await this.GetRangeMaterix();
    this.isLoading = false;
  }

  async setMatrix(data: string) {
    this.isLoading = true;
    this.curMatrix = data;
    this.isLoading = false;
  }
  
  async setAvgType(data: string){
    if(data === '算術平均' || ''){
      this.curAvgType = data;
      //this.curAvgTypeForServer = '平均';     
    }else if(data === '加權平均' ){
      this.curAvgType = data;
      //this.curAvgTypeForServer = '加權平均';
    }
  };

  public buildSub (subject: string) {
    if (this.subjectList.find(sub => sub === subject) === undefined) {
      this.subjectList.push(subject);      
    }
    // console.log(this.studentList);
    
  };
  
  /** 建立學生擁有的科目 */
  public buildstuSub() {
    
    this.studentList.forEach( stu => {
      stu['算術平均'] = stu['算術平均'] ? stu['算術平均'] : {};
      stu['加權平均'] = stu['加權平均'] ? stu['加權平均'] : {};
      stu['算術平均']['擇優'] = stu['算術平均']['擇優'] ? stu['算術平均']['擇優'] : '';
      stu['算術平均']['原始'] = stu['算術平均']['原始'] ? stu['算術平均']['原始'] : '';
      stu['加權平均']['擇優'] = stu['加權平均']['擇優'] ? stu['加權平均']['擇優'] : '';
      stu['加權平均']['原始'] = stu['加權平均']['原始'] ? stu['加權平均']['原始'] : '';
      stu['學期/分項成績'] = stu['學期/分項成績'] ? stu['學期/分項成績'] : {}; // 預定塞入排名
      stu['學期/分項成績(原始)'] = stu['學期/分項成績(原始)'] ? stu['學期/分項成績(原始)'] : {}; // 預定塞入排名
      
      // 在排名類型內放入排名母群
      this.matrixList.forEach(m => {
        stu['學期/分項成績'][m] = stu['學期/分項成績'][m] ? stu['學期/分項成績'][m] : '';
        stu['學期/分項成績(原始)'][m] = stu['學期/分項成績(原始)'][m] ? stu['學期/分項成績(原始)'][m] : '';
      });

      // 新增擺放總分、加權總分、總學分數及科目總數(紀錄科目總數目的為過濾掉學分數為零的科目，不會列計平均時的分母)
      stu['credit'] = stu['credit'] ? stu['credit']: 0; // 總學分數
      stu['exam_total'] = stu['exam_total'] ? stu['exam_total']: 0; // 科目總數(不含0學分的科目)
      stu['examWeighted_total'] = stu['examWeighted_total'] ? stu['examWeighted_total']: 0; // 加權總分(擇優)
      stu['examScore_total'] = stu['examScore_total'] ? stu['examScore_total']: 0; // 總分(擇優)
      stu['ori_examWeighted_total'] = stu['ori_examWeighted_total'] ? stu['ori_examWeighted_total']: 0; // 加權總分(原始)
      stu['ori_examScore_total'] = stu['ori_examScore_total'] ? stu['ori_examScore_total']: 0; // 總分(原始)

      // 新增處理平均所用的變數
      stu['score_decimal'] = stu['score_decimal'] ? stu['score_decimal'] : 0;
      stu['score_carry'] = stu['score_carry'] ? stu['score_carry'] : '';

      this.subjectList.forEach (sub => {
        stu.subject[sub] = stu.subject[sub] ? stu.subject[sub] : {};
        stu.subject[sub]['ori_score'] = stu.subject[sub]['ori_score'] ? stu.subject[sub]['ori_score'] : {};
        stu.subject[sub]['adjustedScore'] = stu.subject[sub]['adjustedScore'] ? stu.subject[sub]['adjustedScore'] : {};
        stu.subject[sub]['year_rj_score'] = stu.subject[sub]['year_rj_score'] ? stu.subject[sub]['year_rj_score'] : {};
        stu.subject[sub]['make_up_score'] = stu.subject[sub]['make_up_score'] ? stu.subject[sub]['make_up_score'] : {};
        stu.subject[sub]['re_score'] = stu.subject[sub]['re_score'] ? stu.subject[sub]['re_score'] : {};
        stu.subject[sub]['finalScore'] = stu.subject[sub]['finalScore'] ? stu.subject[sub]['finalScore'] : [];
        stu.subject[sub]['finalMark'] = stu.subject[sub]['finalMark'] ? stu.subject[sub]['finalMark'] : '';
        stu.subject[sub]['avg'] = stu.subject[sub]['avg'] ? stu.subject[sub]['avg'] : '';
        stu.subject[sub]['credit_avg'] = stu.subject[sub]['credit_avg'] ? stu.subject[sub]['credit_avg'] : '';
        stu.subject[sub]['學期/科目成績(原始)'] = stu.subject[sub]['學期/科目成績(原始)'] ? stu.subject[sub]['學期/科目成績(原始)'] : {}; // 預定塞入排名
        stu.subject[sub]['學期/科目成績'] = stu.subject[sub]['學期/科目成績'] ? stu.subject[sub]['學期/科目成績'] : {}; // 預定塞入排名
        

        this.matrixList.forEach(m => {
          stu.subject[sub]['學期/科目成績'][m] = stu.subject[sub]['學期/科目成績'][m] ? stu.subject[sub]['學期/科目成績'][m] : '';
          stu.subject[sub]['學期/科目成績(原始)'][m] = stu.subject[sub]['學期/科目成績(原始)'][m] ? stu.subject[sub]['學期/科目成績(原始)'][m] : '';
        });
      });
    });
  };
  
  /** 將成績依照學生擁有的科目放入，並整理 */ 
  public insertStuScore(data: ExamScoreRec) {
    // console.log(this.studentList);
    const index = this.studentList.findIndex((stu: StudentRec) => stu.id == data.student_id);
    if(index > -1){
      // 將各分數及分數狀態寫入清單，為了後續比較大小，還需額外紀錄成績是否存在（noneScore）
      //let doc = JSON.stringify(data.class_rating);
      //console.log(doc);
      this.studentList[index].subject[data.subject]['ori_score'].score = data.ori_score ? data.ori_score : 0; // 原始成績
      this.studentList[index].subject[data.subject]['ori_score'].type = '原始成績';
      this.studentList[index].subject[data.subject]['ori_score'].symbol = 'O';
      this.studentList[index].subject[data.subject]['ori_score'].noneScore = data.ori_score ? true : false;
      this.studentList[index].subject[data.subject]['adjustedScore'].score = data.adjustedscore ? data.adjustedscore : '0'; // 手動調整成績
      this.studentList[index].subject[data.subject]['adjustedScore'].type = '手動調整成績';
      this.studentList[index].subject[data.subject]['adjustedScore'].symbol = 'A';
      this.studentList[index].subject[data.subject]['adjustedScore'].noneScore = data.adjustedscore ? true : false;
      this.studentList[index].subject[data.subject]['year_rj_score'].score = data.year_rj_score ? data.year_rj_score : '0'; // 學年調整成績
      this.studentList[index].subject[data.subject]['year_rj_score'].type = '學年調整成績';
      this.studentList[index].subject[data.subject]['year_rj_score'].symbol = 'Y' ;
      this.studentList[index].subject[data.subject]['year_rj_score'].noneScore = data.year_rj_score ? true : false;
      this.studentList[index].subject[data.subject]['make_up_score'].score = data.make_up_score ? data.make_up_score  : '0'; // 補考成績
      this.studentList[index].subject[data.subject]['make_up_score'].type = '補考成績';
      this.studentList[index].subject[data.subject]['make_up_score'].symbol = 'M';
      this.studentList[index].subject[data.subject]['make_up_score'].noneScore = data.make_up_score ? true : false;
      this.studentList[index].subject[data.subject]['re_score'].score = data.re_score ? data.re_score : '0'; // 重修成績
      this.studentList[index].subject[data.subject]['re_score'].type = '重修成績';
      this.studentList[index].subject[data.subject]['re_score'].symbol = 'R';
      this.studentList[index].subject[data.subject]['re_score'].noneScore = data.re_score ? true : false;
      this.studentList[index].subject[data.subject]['finalScore'] = this.calfinalScore(data, index);
      
      //統計級距
      this.calRange(data.subject, '原始', data.ori_score);
      this.calRange(data.subject, '擇優', this.studentList[index].subject[data.subject]['finalScore'][0].score);

      // 計算總分(含原始)、加權總分(含原始)、總學分數及科目總數
      let score_decimal = 0;
      let score_avg_calculating = 0;
      let score_weight = 0;
      let score_carry = ''
  
      score_decimal = parseInt(data.score_decimal);
      this.studentList[index]['score_decimal'] = score_decimal;
      score_weight = parseInt(data.credit);
      if(data.score_carry_45){
        score_carry = '四捨五入'
      } else if(data.score_carry_round_down) {
        score_carry = '無條件捨去'
      } else {
        score_carry = '無條件進位'
      }
      this.studentList[index]['score_carry'] = score_carry;

      if(score_weight > 0){
        this.studentList[index]['credit'] = this.studentList[index]['credit'] + score_weight;
        this.studentList[index]['exam_total'] = this.studentList[index]['exam_total'] + 1;
        this.studentList[index]['examScore_total'] = this.studentList[index]['examScore_total'] + parseInt(this.studentList[index].subject[data.subject]['finalScore'][0].score); // 總分(擇優)
        this.studentList[index]['examWeighted_total'] = this.studentList[index]['examWeighted_total'] + NP.times(parseInt(this.studentList[index].subject[data.subject]['finalScore'][0].score), score_weight); // 加權總分(擇優)
        this.studentList[index]['ori_examScore_total'] = this.studentList[index]['ori_examScore_total'] + parseInt(this.studentList[index].subject[data.subject]['ori_score'].score); // 加權總分(原始)
        this.studentList[index]['ori_examWeighted_total'] = this.studentList[index]['ori_examWeighted_total'] + NP.times(parseInt(this.studentList[index].subject[data.subject]['ori_score'].score), score_weight); // 總分(原始)
      }
    }else {
      console.log('成績資料內有學生，沒有存在目前班級學生清單中');
      console.log(data);
    }
  };

  /** 處理最終顯示成績 */
  public calfinalScore(data: ExamScoreRec, index: number) {
    const count: ScoreRec[] = [];
    let finaltxt = '';
    count.push(
      this.studentList[index].subject[data.subject]['ori_score'],
      this.studentList[index].subject[data.subject]['adjustedScore'], 
      this.studentList[index].subject[data.subject]['year_rj_score'],
      this.studentList[index].subject[data.subject]['make_up_score'],
      this.studentList[index].subject[data.subject]['re_score']
    );
    count.sort((a: ScoreRec, b: ScoreRec) => {
      // return parseFloat(a.score) - parseFloat(b.score);
      return parseFloat(b.score) - parseFloat(a.score);
    });
    
    // 組成「其他成績」字串
    count.forEach((i, index) => {
      if(i.type !== '原始成績' && i.noneScore){
        finaltxt = finaltxt + i.symbol + ':' + i.score + ';'
      }
    });
    this.studentList[index].subject[data.subject]['finalMark'] = finaltxt;
    return count;
  }


  /** 處理成績平均 */
  public calAvg(student: StudentRec) {
    
    if(student.credit !== 0 || student.exam_total !== 0){
      student['加權平均']['擇優'] = this.avgPipe.transform(NP.divide(student.examWeighted_total,student.credit),student.score_decimal,student.score_carry);
      student['加權平均']['原始'] = this.avgPipe.transform(NP.divide(student.ori_examWeighted_total,student.credit),student.score_decimal,student.score_carry);
      student['算術平均']['擇優'] = this.avgPipe.transform(NP.divide(student.examScore_total,student.exam_total),student.score_decimal,student.score_carry);
      student['算術平均']['原始'] = this.avgPipe.transform(NP.divide(student.ori_examScore_total,student.exam_total),student.score_decimal,student.score_carry);
    }else {
      student['加權平均']['擇優'] = '';
      student['加權平均']['原始'] = '';
      student['算術平均']['擇優'] = '';
      student['算術平均']['原始'] = '';
    }
    //統計級距
    this.calRange('加權平均', '原始', student['加權平均']['原始']);
    this.calRange('加權平均', '擇優', student['加權平均']['擇優']);
    this.calRange('算術平均', '原始', student['加權平均']['原始']);
    this.calRange('算術平均', '擇優', student['加權平均']['擇優']);

  }

  // 放入學生排行及計算平均
  public insertStuRank() {
    this.studentList.forEach((student: StudentRec) => {
      this.calAvg(student); // 計算平均
        this.stuExamRank.forEach((ser: ScoreRankInfo) => {
          try {
            if(ser.student_id === student.id && ser.item_type){
              switch (ser.item_type) {
                case '學期/科目成績':
                  student.subject[ser.item_name]['學期/科目成績'][ser.rank_type] = ser.rank ? ser.rank : '--';
                  break;
      
                case '學期/科目成績(原始)':
                  student.subject[ser.item_name]['學期/科目成績(原始)'][ser.rank_type] = ser.rank ? ser.rank : '--';
                  break;
      
                case '學期/分項成績':
                  if(ser.item_name === '學業'){
                    student['學期/分項成績'][ser.rank_type] = ser.rank ? ser.rank : '--';
                  }
                  break;
                case '學期/分項成績(原始)':
                  if(ser.item_name === '學業'){
                    student['學期/分項成績(原始)'][ser.rank_type] = ser.rank ? ser.rank : '--';
                  }
                  break;
                default:
                  break;
              }
            }
          } catch (error) {  
            console.log(error);
          }
        })
    });
  }

  public initiRange() {
    // 因為要即時運算級距人數，所以重新調整；分層：單一班級->單一學年學期->科目->原始or擇優->各級距->人數
    // 此段處理到「各級距」層
    let type = ['原始','擇優']
    this.examMatrix = {};
    this.examMatrix['加權平均'] = {};
    this.examMatrix['算術平均'] = {};
    this.examMatrix['加權平均']['原始'] = {};
    this.examMatrix['加權平均']['擇優'] = {};
    this.examMatrix['算術平均']['原始'] = {};
    this.examMatrix['算術平均']['擇優']= {};
    this.subjectList.forEach( subject => {
      this.examMatrix[subject]= {};
        this.examMatrix[subject] = {};
        type.forEach(item => {
          this.examMatrix[subject][item] = {};
          this.examMatrix[subject][item]['level_gte100']= 0;
          this.examMatrix[subject][item]['level_90']= 0;
          this.examMatrix[subject][item]['level_80']= 0;
          this.examMatrix[subject][item]['level_70']= 0;
          this.examMatrix[subject][item]['level_60']= 0;
          this.examMatrix[subject][item]['level_50']= 0;
          this.examMatrix[subject][item]['level_40']= 0;
          this.examMatrix[subject][item]['level_30']= 0;
          this.examMatrix[subject][item]['level_20']= 0;
          this.examMatrix[subject][item]['level_10']= 0;
          this.examMatrix[subject][item]['level_lt10']= 0;
        })


          this.avgTypeList.forEach ( avgItem => {
            type.forEach(item => {
              this.examMatrix[avgItem][item] = {};
              this.examMatrix[avgItem][item]['level_gte100']= 0;
              this.examMatrix[avgItem][item]['level_90']= 0;
              this.examMatrix[avgItem][item]['level_80']= 0;
              this.examMatrix[avgItem][item]['level_70']= 0;
              this.examMatrix[avgItem][item]['level_60']= 0;
              this.examMatrix[avgItem][item]['level_50']= 0;
              this.examMatrix[avgItem][item]['level_40']= 0;
              this.examMatrix[avgItem][item]['level_30']= 0;
              this.examMatrix[avgItem][item]['level_20']= 0;
              this.examMatrix[avgItem][item]['level_10']= 0;
              this.examMatrix[avgItem][item]['level_lt10']= 0;
            })
          })
      })

      console.log(this.examMatrix);
    };

    public calRange(subject: string, type: string, score: number) {
      try {
          let rfScore = score;
          switch (rfScore) {
            case (( rfScore >= 100) ? rfScore : -1 ):
              this.examMatrix[subject][type]['level_gte100'] = this.examMatrix[subject][type]['level_gte100'] + 1;
              break;
            case ( ( rfScore < 100 && rfScore >= 90 ) ? rfScore : -1 ):
              this.examMatrix[subject][type]['level_90'] = this.examMatrix[subject][type]['level_90'] + 1;
              break;
            case ( ( rfScore < 90 && rfScore >= 80 ) ? rfScore : -1 ):
              this.examMatrix[subject][type]['level_80'] = this.examMatrix[subject][type]['level_80'] + 1;
              break;
            case ( ( rfScore < 80 && rfScore >= 70 ) ? rfScore : -1 ):
              this.examMatrix[subject][type]['level_70'] = this.examMatrix[subject][type]['level_70'] + 1;
              break;
            case ( ( rfScore < 70 && rfScore >= 60 ) ? rfScore : -1 ):
              this.examMatrix[subject][type]['level_60'] = this.examMatrix[subject][type]['level_60'] + 1;
              break;
            case ( (rfScore < 60 && rfScore >= 50 ) ? rfScore : -1 ):
              this.examMatrix[subject][type]['level_50'] = this.examMatrix[subject][type]['level_50'] + 1;
              break;
            case ( ( rfScore < 50 && rfScore >= 40 ) ? rfScore : -1 ):
              this.examMatrix[subject][type]['level_40'] = this.examMatrix[subject][type]['level_40'] + 1;
              break;
            case ( ( rfScore < 40 && rfScore >= 30 ) ? rfScore : -1 ):
              this.examMatrix[subject][type]['level_30'] = this.examMatrix[subject][type]['level_30'] + 1;
              break;
            case ( ( rfScore < 30 && rfScore >= 20 ) ? rfScore : -1 ):
              this.examMatrix[subject][type]['level_20'] = this.examMatrix[subject][type]['level_20'] + 1;
              break;
            case ( (rfScore < 20 && rfScore >= 10 ) ? rfScore : -1 ):
              this.examMatrix[subject][type]['level_10'] = this.examMatrix[subject][type]['level_10'] + 1;
              break;
            case ( ( rfScore <10 ) ? rfScore : -1 ):
              this.examMatrix[subject][type]['level_lt10'] = this.examMatrix[subject][type]['level_lt10'] + 1;
              break;
            default:
              break;
          }
      } catch (error) {
        console.log(error);
      }
      
    };

    async GetRangeMaterix() {
      this.initiRange2();
      console.log(this.examMatrix2);
      try {
        const rsp = await this.contract.send('GetSHRankMatrix', {
          ClassID: this.curClass.id
          , SchoolYear: this.curSS.school_year
          , Semester: this.curSS.semester
        });
          console.log(rsp);
          [].concat(rsp.RankMatrix || []).forEach((data: ExamRankRec) => {
            this.examMatrix2[data.item_name][data.rank_type][data.item_type]['avg_top_25'] = data.avg_top_25 ? data.avg_top_25 : 0;
            this.examMatrix2[data.item_name][data.rank_type][data.item_type]['avg_top_50'] = data.avg_top_50 ? data.avg_top_50 : 0;
            this.examMatrix2[data.item_name][data.rank_type][data.item_type]['avg'] = data.avg ? data.avg : 0;
            this.examMatrix2[data.item_name][data.rank_type][data.item_type]['avg_bottom_50'] = data.avg_bottom_50 ? data.avg_bottom_50 : 0;
            this.examMatrix2[data.item_name][data.rank_type][data.item_type]['avg_bottom_25'] = data.avg_bottom_25 ? data.avg_bottom_25 : 0;
            this.examMatrix2[data.item_name][data.rank_type][data.item_type]['level_gte100'] = data.level_gte100 ? data.level_gte100 : '';
            this.examMatrix2[data.item_name][data.rank_type][data.item_type]['level_90'] = data.level_90 ? data.level_90 : '';
            this.examMatrix2[data.item_name][data.rank_type][data.item_type]['level_80'] = data.level_80 ? data.level_80 : '';
            this.examMatrix2[data.item_name][data.rank_type][data.item_type]['level_70'] = data.level_70 ? data.level_70 : '';
            this.examMatrix2[data.item_name][data.rank_type][data.item_type]['level_60'] = data.level_60 ? data.level_60 : '';
            this.examMatrix2[data.item_name][data.rank_type][data.item_type]['level_50'] = data.level_50 ? data.level_50 : '';
            this.examMatrix2[data.item_name][data.rank_type][data.item_type]['level_40'] = data.level_40 ? data.level_40 : '';
            this.examMatrix2[data.item_name][data.rank_type][data.item_type]['level_30'] = data.level_30 ? data.level_30 : '';
            this.examMatrix2[data.item_name][data.rank_type][data.item_type]['level_20'] = data.level_20 ? data.level_20 : '';
            this.examMatrix2[data.item_name][data.rank_type][data.item_type]['level_10'] = data.level_10 ? data.level_10 : '';
            this.examMatrix2[data.item_name][data.rank_type][data.item_type]['level_lt10'] = data.level_lt10 ? data.level_lt10 : '';
          });
          console.log(this.examMatrix2);
        } catch (error) {
          console.log('取得級距及五標失敗');
          console.log(error);
        }
    }


    public initiRange2() {
      // 因為要即時運算級距人數，所以重新調整；分層：單一班級->單一學年學期->科目&總平均->原始&擇優->各級距->人數
      // 此段處理科目&總平均->原始&擇優->各級距 的資料基本架構
      let type = ['學期/科目成績(原始)','學期/科目成績']
      this.matrixList
      this.examMatrix2 = {};

      // 組成科目級距及五標的基本架構
      this.subjectList.forEach(sub => {
        this.examMatrix2[sub] = {};
        this.matrixList.forEach(ml => {
          this.examMatrix2[sub][ml] = {};
            type.forEach(t => {
              this.examMatrix2[sub][ml][t] = {};
                this.rangeList.forEach(rl => {
                  this.examMatrix2[sub][ml][t][rl.key] = 0;
                })
                this.fiveRange.forEach(fr => {
                  this.examMatrix2[sub][ml][t][fr.key] = 0;
                })
            })
        })
      });
        console.log(this.examMatrix2);
      };
}
