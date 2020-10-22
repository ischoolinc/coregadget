import { GadgetService } from './gadget.service';
import { Component, OnInit, NgZone, Inject, TemplateRef} from '@angular/core';
import { StudentRec, ClassRec ,ExamScoreRec, MatrixRec, ExamRec, ExamRankRec } from './data';
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
  
  //dialog相關設定
  modalRef: BsModalRef;
  config = {
    keyboard: true
  };

  contract: any;
  isLoading: boolean;

  curClass: ClassRec = {} as ClassRec;
  classList: ClassRec[] = [];
  ssList: SSRec[];
  curSS: SSRec = {} as SSRec;
  examList: ExamRec[];
  curExam: ExamRec = {} as ExamRec;
  matrixList = ['班排名', '年排名']; 
  curMatrix = this.matrixList[0];

  studentExamRankList: ExamRankRec[];
  subjectList: string[];
  studentList: StudentRec[];
  examMatrix = {};
  itemTypeList = ['定期評量/科目成績','定期評量_定期/科目成績'];
  curItemType = this.itemTypeList[0];
  curExamTotalType = '定期評量/總計成績'; //初始化各科目總計成績類型
  avgTypeList = ['算術平均','加權平均'];
  curAvgType = this.avgTypeList[0];
  curAvgTypeForServer = '平均'; //因為資料庫中算術平均儲存的字串為'平均'

  global_score_decimal: number;
  global_score_carry: string;
  curScoreText: string;

  weighted_total_score = 0;

  fiveRange = [
    {key: 'avg_top_25', value: '頂標'}
    , {key: 'avg_top_50', value: '高標'}
    , {key: 'avg', value: '均標'}
    , {key: 'avg_bottom_50', value: '低標'}
    , {key: 'avg_bottom_25', value: '底標'}
  ];
  
  rangeList = [
    {key: 'level_gte100', value: '≥ 100'}
    , {key: 'level_90', value: '≥ 90, < 100'}
    , {key: 'level_80', value: '≥ 80, < 90'}
    , {key: 'level_70', value: '≥ 70, < 80'}
    , {key: 'level_60', value: '≥ 60, < 70'}
    , {key: 'level_50', value: '≥ 50, < 60'}
    , {key: 'level_40', value: '≥ 40, < 50'}
    , {key: 'level_30', value: '≥ 30, < 40'}
    , {key: 'level_20', value: '≥ 20, < 30'}
    , {key: 'level_10', value: '≥ 10, < 20'}
    , {key: 'level_lt10', value: '< 10'}
  ]

  rangeListOri =  
  {level_gte100: 0, level_90: 0, 
    level_80: 0, level_70: 0, level_60: 0, 
    level_50: 0, level_40: 0, level_30: 0, 
    level_20: 0, level_10: 0, level_lt10: 0};
  
  constructor(
    private gadget: GadgetService,
    private avgPipe: avgPipe,
    private modalService: BsModalService,
    ) {
      setTheme('bs4'); //ngx-bootstrap設定
  }

  async ngOnInit() {

    NP.enableBoundaryChecking(false); //number-precision此套件的設定

    try {
      this.isLoading = true;

      this.contract = await this.gadget.getContract('ischool.exam.teacher');
      try {
        await this.getMyClass();
      } catch (error) {
        console.log(error);
        console.log('取得班級錯誤');
      }
      try {
        await this.GetExamScoreSchoolYear();
      } catch (error) {
        console.log(error);
        console.log('取得學年度學期錯誤');
      }
      try {
        await this.GetClassExam();
      } catch (error) {
        console.log(error);
        console.log('取得班級評量識別錯誤');
      }
      try {
        await this.GetClassStudent();
      } catch (error) {
        console.log('取得班級學生錯誤');
      }
      try {
        await this.GetStuExamScore();
      } catch (error) {
        console.log(error);
        console.log('取得成績錯誤');
      }
      try {
        await this.getRange();
      } catch (error) {
        console.log(error);
      }

      // await this.getMyClass();
      // await this.GetExamScoreSchoolYear();
      // await this.GetClassExam();
      // await this.GetClassStudent();
      // await this.GetStuExamScore();
      // await this.getRange();
    } catch (err) {
      console.log(err);
    } finally {
      this.isLoading = false;
    }
  }

  async getMyClass() {
    this.classList = [];

    const rsp = await this.contract.send('GetMyClass', {});
    this.classList = [].concat(rsp.Class || []);
    this.curClass = this.classList[0];
  }

  async GetExamScoreSchoolYear() {
    this.ssList = [];

    if (this.curClass.id) {
      const rsp = await this.contract.send('GetExamScoreSchoolYear', {
        ClassID: this.curClass.id
      });
      this.ssList = [].concat(rsp.SchoolYearSemester || []).map((data: SSRec) => {
        data.content = `${data.school_year} 學年度 ${data.semester} 學期` ;
        return data;
      });
      this.curSS = this.ssList[0];
    }
  }

  async GetClassExam() {
    this.examList = [];
    const rsp = await this.contract.send('GetClassExam', {
      ClassID: this.curClass.id,
      SchoolYear: this.curSS.school_year,
      Semester: this.curSS.semester
    });
    this.examList = [].concat(rsp.Exam || []);
    this.curExam = this.examList[0];
  }

  async GetClassStudent() {
    this.studentList = [];
    const rsp = await this.contract.send('GetClassStudent',{
      ClassID: this.curClass.id
    });

    this.studentList = [].concat(rsp.Students || []).map((stu: StudentRec) => {
      stu.examScore = {};
      stu.examRank = {};
      stu.examScore_us= {};
      stu.examScore_text = {};
      stu.examScore_decimal = "";
      stu.examScore_carry = "0";
      stu.examScore_avg = {};
      stu.examWeighted ={};
      return stu;
    });
  }

  async GetStuExamScore() {
    this.subjectList = [];
    const rsp = await this.contract.send('GetKSExamScore', {
      ClassID: this.curClass.id
      , SchoolYear: this.curSS.school_year
      , Semester: this.curSS.semester
    });

    [].concat(rsp.ExamScore || []).forEach((data: ExamScoreRec) => {
      this.studentList.map(stu => {
        stu.examScore_avg[data.exam_id] = stu.examScore_avg[data.exam_id]?stu.examScore_avg[data.exam_id]: {};
        stu.examScore_avg[data.exam_id]['credit'] = stu.examScore_avg[data.exam_id]['credit'] ? stu.examScore_avg[data.exam_id]['credit']: 0;
        stu.examScore_avg[data.exam_id]['examWeighted_total'] = stu.examScore_avg[data.exam_id]['examWeighted_total'] ? stu.examScore_avg[data.exam_id]['examWeighted_total']: 0;
        stu.examScore_avg[data.exam_id]['exam_total'] = stu.examScore_avg[data.exam_id]['exam_total'] ? stu.examScore_avg[data.exam_id]['exam_total']: 0;
        stu.examScore_avg[data.exam_id]['examScore_total'] = stu.examScore_avg[data.exam_id]['examScore_total'] ? stu.examScore_avg[data.exam_id]['examScore_total']: 0;
        stu.examScore_avg[data.exam_id]['加權平均'] = stu.examScore_avg[data.exam_id]['加權平均'] ? stu.examScore_avg[data.exam_id]['加權平均']: 0;
        stu.examScore_avg[data.exam_id]['算術平均'] = stu.examScore_avg[data.exam_id]['算術平均'] ? stu.examScore_avg[data.exam_id]['算術平均']: 0;
      });
      if (this.subjectList.find(sub => sub === data.subject) === undefined) {
        this.subjectList.push(data.subject);
        this.studentList.map(stu => {
          stu.examScore[data.subject] = {};
          stu.examScore_us[data.subject] = {};
          stu.examScore_text[data.subject] = '';
          stu.examScore_avg[data.subject] = {};
          stu.examWeighted[data.subject] = {};
          return stu;
        });
      }

      const index = this.studentList.findIndex((stu: StudentRec) => stu.id == +data.student_id);

      if (index > -1) {
        let score_decimal = 0;
        let score_avg_calculating = 0;
        let score_weight = 0;
        this.studentList[index].examScore[data.subject][data.exam_id] = data.score;
        this.studentList[index].examScore_us[data.subject][data.exam_id] = data.score_us;
        this.studentList[index].examScore_text[data.subject] = data.score_text;
        this.studentList[index].examScore_decimal = data.score_decimal;
        this.studentList[index].examScore_carry = data.score_carry;

        this.studentList[index].examWeighted[data.subject][data.exam_id] = data.credit;
        score_decimal = parseInt(data.score_decimal); // 取得小數點位數
        this.global_score_decimal = score_decimal;
        if(data.score == ''){
          this.studentList[index].examScore_avg[data.subject][data.exam_id] = '';
        }else{
          this.global_score_carry = data.score_carry;
            score_avg_calculating = parseFloat(data.score);
            score_weight = NP.times(this.avgPipe.transform(score_avg_calculating, score_decimal, data.score_carry),data.credit);
            this.studentList[index].examScore_avg[data.subject][data.exam_id] = this.avgPipe.transform(score_avg_calculating, score_decimal, data.score_carry);
            this.studentList[index].examScore_avg[data.exam_id]['credit'] =  NP.plus(this.studentList[index].examScore_avg[data.exam_id]['credit'], data.credit);
            this.studentList[index].examScore_avg[data.exam_id]['examWeighted_total'] =  NP.plus(this.studentList[index].examScore_avg[data.exam_id]['examWeighted_total'], score_weight) ;
            this.studentList[index].examScore_avg[data.exam_id]['exam_total'] =  NP.plus(this.studentList[index].examScore_avg[data.exam_id]['exam_total'], 1);
            this.studentList[index].examScore_avg[data.exam_id]['examScore_total'] =  NP.plus(this.studentList[index].examScore_avg[data.exam_id]['examScore_total'], this.avgPipe.transform(score_avg_calculating, score_decimal, data.score_carry));
        }
      }
    });
    this.studentList.forEach(stu => {
      this.examList.forEach((exam: ExamRec) => { 

        stu.examScore_avg[exam.id] =stu.examScore_avg[exam.id]?stu.examScore_avg[exam.id]: {};
        stu.examScore_avg[exam.id]['credit'] = stu.examScore_avg[exam.id]['credit'] ? stu.examScore_avg[exam.id]['credit']: 0;
        stu.examScore_avg[exam.id]['examWeighted_total'] =  stu.examScore_avg[exam.id]['examWeighted_total'] ? stu.examScore_avg[exam.id]['examWeighted_total']: 0;
        stu.examScore_avg[exam.id]['exam_total'] =  stu.examScore_avg[exam.id]['exam_total'] ? stu.examScore_avg[exam.id]['exam_total']: 0;
        stu.examScore_avg[exam.id]['examScore_total'] =  stu.examScore_avg[exam.id]['examScore_total'] ? stu.examScore_avg[exam.id]['examScore_total']: 0;
        stu.examScore_avg[exam.id]['加權平均'] =  stu.examScore_avg[exam.id]['加權平均'] ? stu.examScore_avg[exam.id]['加權平均']: 0;
        stu.examScore_avg[exam.id]['算術平均'] =  stu.examScore_avg[exam.id]['算術平均'] ? stu.examScore_avg[exam.id]['算術平均']: 0;
        if(stu.examScore_avg[exam.id]['credit'] !== 0 || stu.examScore_avg[exam.id]['exam_total'] !== 0){
          stu.examScore_avg[exam.id]['加權平均'] = this.avgPipe.transform(NP.divide(stu.examScore_avg[exam.id]['examWeighted_total'],stu.examScore_avg[exam.id]['credit']),parseInt(stu.examScore_decimal),stu.examScore_carry);
          //this.calRange('加權平均', exam.id, stu.examScore_avg[exam.id]['加權平均']);
          stu.examScore_avg[exam.id]['算術平均'] = this.avgPipe.transform(NP.divide(stu.examScore_avg[exam.id]['examScore_total'],stu.examScore_avg[exam.id]['exam_total']),parseInt(stu.examScore_decimal),stu.examScore_carry);
          //this.calRange('算術平均', exam.id, stu.examScore_avg[exam.id]['算術平均']);
        }else {
          stu.examScore_avg[exam.id]['加權平均'] = "";
          stu.examScore_avg[exam.id]['算術平均'] = "";
        }
      })
    })
    console.log(this.studentList);
  }

  public initiRange() {
        // 因為要即時運算級距人數，所以重新調整；分層：單一班級->單一學年學期->科目->試別->各級距->人數
        // 此段處理到「各級距」層
        this.examMatrix = {};
        this.examMatrix['加權平均'] = {};
        this.examMatrix['算術平均'] = {};
        this.subjectList.forEach( subject => {
          this.examMatrix[subject]= {};
          this.examList.forEach( item => {
            this.examMatrix[subject][item.id] = {};
            this.examMatrix[subject][item.id]['level_gte100']= 0;
            this.examMatrix[subject][item.id]['level_90']= 0;
            this.examMatrix[subject][item.id]['level_80']= 0;
            this.examMatrix[subject][item.id]['level_70']= 0;
            this.examMatrix[subject][item.id]['level_60']= 0;
            this.examMatrix[subject][item.id]['level_50']= 0;
            this.examMatrix[subject][item.id]['level_40']= 0;
            this.examMatrix[subject][item.id]['level_30']= 0;
            this.examMatrix[subject][item.id]['level_20']= 0;
            this.examMatrix[subject][item.id]['level_10']= 0;
            this.examMatrix[subject][item.id]['level_lt10']= 0;
              this.avgTypeList.forEach ( avgItem => {
                this.examMatrix[avgItem][item.id] = {};
                this.examMatrix[avgItem][item.id]['level_gte100']= 0;
                this.examMatrix[avgItem][item.id]['level_90']= 0;
                this.examMatrix[avgItem][item.id]['level_80']= 0;
                this.examMatrix[avgItem][item.id]['level_70']= 0;
                this.examMatrix[avgItem][item.id]['level_60']= 0;
                this.examMatrix[avgItem][item.id]['level_50']= 0;
                this.examMatrix[avgItem][item.id]['level_40']= 0;
                this.examMatrix[avgItem][item.id]['level_30']= 0;
                this.examMatrix[avgItem][item.id]['level_20']= 0;
                this.examMatrix[avgItem][item.id]['level_10']= 0;
                this.examMatrix[avgItem][item.id]['level_lt10']= 0;
              })
          })
        });
  }

  async getRange() {
      this.initiRange();

      const rsp = await this.contract.send('GetKSExamScore', {
        ClassID: this.curClass.id
        , SchoolYear: this.curSS.school_year
        , Semester: this.curSS.semester
      });
  
      [].concat(rsp.ExamScore || []).forEach((data: ExamScoreRec) => {
        this.calRange(data.subject, data.exam_id, data.score);
     });

     this.studentList.forEach(stu => {
       this.examList.forEach(exam => {
        this.calRange('加權平均', exam.id, stu.examScore_avg[exam.id]['加權平均']);
        this.calRange('算術平均', exam.id, stu.examScore_avg[exam.id]['算術平均']);
       })
       
     })
    console.log(this.examMatrix);
  }

  async setClass(data: ClassRec) { //影響學年度學期,
    {
      this.curClass = data;
      await this.GetExamScoreSchoolYear();
      await this.GetClassStudent();
      await this.GetStuExamScore();
      await this.getRange();
    }
    this.isLoading = false;
  }

  async setSS(data: SSRec) {
    this.isLoading = true;
    {
      this.curSS = data;
      await this.GetClassExam();
      await this.GetClassStudent();
      await this.GetStuExamScore();
      await this.getRange();
    }
    this.isLoading = false;
  }

  async setExam(data: ExamRec) {
    this.isLoading = true;
    {
      this.curExam = data; 
      await this.GetClassStudent();
      await this.GetStuExamScore();
    }
    this.isLoading = false;
  }

  async setMatrix(data: string) {
    this.isLoading = true;
    {
      this.curMatrix = data;
      await this.GetClassStudent();
      await this.GetStuExamScore();
    }
    this.isLoading = false;
  }

  public setAvgType(data: string){
    if(data === '算術平均' || ''){
      this.curAvgType = data;
      this.curAvgTypeForServer = '平均';
    }else if(data === '加權平均' ){
      this.curAvgType = data;
      this.curAvgTypeForServer = '加權平均';
    }
  };

  public openModal(template: TemplateRef<any>, scoreText: string) {
    this.modalRef = this.modalService.show(template, this.config);
    this.curScoreText = scoreText;
  };

  public calRange(subject: string, examid: number, score: string) {
    let rfScore = parseFloat(score);
    switch (rfScore) {
      case (( rfScore >= 100) ? rfScore : -1 ):
        this.examMatrix[subject][examid]['level_gte100'] = this.examMatrix[subject][examid]['level_gte100'] + 1;
        break;
      case ( ( rfScore < 100 && rfScore >= 90 ) ? rfScore : -1 ):
        this.examMatrix[subject][examid]['level_90'] = this.examMatrix[subject][examid]['level_90'] + 1;
        break;
      case ( ( rfScore < 90 && rfScore >= 80 ) ? rfScore : -1 ):
        this.examMatrix[subject][examid]['level_80'] = this.examMatrix[subject][examid]['level_80'] + 1;
        break;
      case ( ( rfScore < 80 && rfScore >= 70 ) ? rfScore : -1 ):
        this.examMatrix[subject][examid]['level_70'] = this.examMatrix[subject][examid]['level_70'] + 1;
        break;
      case ( ( rfScore < 70 && rfScore >= 60 ) ? rfScore : -1 ):
        this.examMatrix[subject][examid]['level_60'] = this.examMatrix[subject][examid]['level_60'] + 1;
        break;
      case ( (rfScore < 60 && rfScore >= 50 ) ? rfScore : -1 ):
        this.examMatrix[subject][examid]['level_50'] = this.examMatrix[subject][examid]['level_50'] + 1;
        break;
      case ( ( rfScore < 50 && rfScore >= 40 ) ? rfScore : -1 ):
        this.examMatrix[subject][examid]['level_40'] = this.examMatrix[subject][examid]['level_40'] + 1;
        break;
      case ( ( rfScore < 40 && rfScore >= 30 ) ? rfScore : -1 ):
        this.examMatrix[subject][examid]['level_30'] = this.examMatrix[subject][examid]['level_30'] + 1;
        break;
      case ( ( rfScore < 30 && rfScore >= 20 ) ? rfScore : -1 ):
        this.examMatrix[subject][examid]['level_20'] = this.examMatrix[subject][examid]['level_20'] + 1;
        break;
      case ( (rfScore < 20 && rfScore >= 10 ) ? rfScore : -1 ):
        this.examMatrix[subject][examid]['level_10'] = this.examMatrix[subject][examid]['level_10'] + 1;
        break;
      case ( ( rfScore <10 ) ? rfScore : -1 ):
        this.examMatrix[subject][examid]['level_lt10'] = this.examMatrix[subject][examid]['level_lt10'] + 1;
        break;
      default:
        break;
    }
  };

}
interface SSRec {
  school_year: number;
  semester: number;
  content: string;
}
