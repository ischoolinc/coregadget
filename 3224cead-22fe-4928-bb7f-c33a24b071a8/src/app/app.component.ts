import { GadgetService } from './gadget.service';
import { Component, OnInit, NgZone, Inject, TemplateRef} from '@angular/core';
import { StudentRec, ClassRec ,ExamScoreRec, MatrixRec, ExamRec, ExamRankRec } from './data';
import NP from 'number-precision';
import { avgPipe } from './pipes/avgPipe.pipe';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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

  curClassInitialization: boolean = true;  // 由true跟false控制，true代表第一次會進入初始化設定
  classList: ClassRec[] = [];
  curClassGrade:string ="";
  ssList: SSRec[];
  curSS: SSRec = {} as SSRec;
  curSSInitialization: boolean = true;   // 由true跟false控制，true代表第一次會進入初始化設定
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
      setTheme('bs4'); //ngx-bootstrap設定
  }

  async ngOnInit() {

    NP.enableBoundaryChecking(false); //number-precision此套件的設定

    try {
      this.isLoading = true;

      this.contract = await this.gadget.getContract('ischool.exam.teacher');
      await this.getMyClass();
      await this.GetExamScoreSchoolYear();
      await this.GetClassExam();
      await this.GetClassStudent();
      await this.GetStuExamScore();
      await this.GetStuExamRank();
      await this.GetExamRankMatrix();
    } catch (err) {
      console.log(err);
    } finally {
      this.isLoading = false;
    }
    
  }

  async getMyClass() {
    this.classList = [];

    const rsp = await this.contract.send('GetMyJHClass', {});
    this.classList = [].concat(rsp.Class || []);
    
    if(this.curClassInitialization){
      if (this.classList.length > 0) {
        this.curClass = this.classList[0];
        this.curClassInitialization = false;
      } else {
        this.curClass = {} as ClassRec;
      }
    }
  }

  async GetExamScoreSchoolYear() {
    this.ssList = [];

    if (this.curClass.id) {
      const rsp = await this.contract.send('GetExamScoreSchoolYear', {
        ClassID: this.curClass.id
      });
      this.ssList = [].concat(rsp.SchoolYearSemester || []).map((data: SSRec) => {
        data.content = `${data.school_year} 學年度 ${data.semester} 學期`
        return data;
      });
      if(this.curSSInitialization){
        if (this.ssList.length > 0) {
          this.curSS = this.ssList[0];
          this.curSSInitialization = false;
        } else {
          this.curSS = {} as SSRec;
        }
      }
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
      stu.examScore_text ={};
      stu.examScore_proportion = {};
      stu.examScore_decimal = {};
      stu.examScore_carry ={};
      stu.examScore_avg = {};
      stu.examWeighted ={};
      return stu;
    });
  }

  async GetStuExamScore() {
    this.subjectList = [];
    const rsp = await this.contract.send('GetJHExamScore', {
      ClassID: this.curClass.id
      , SchoolYear: this.curSS.school_year
      , Semester: this.curSS.semester
    });

    [].concat(rsp.ExamScore || []).forEach((data: ExamScoreRec) => {
      this.studentList.map(stu => {
        stu.examScore_avg[data.exam_id] =stu.examScore_avg[data.exam_id]?stu.examScore_avg[data.exam_id]: {};
        stu.examScore_avg[data.exam_id]['credit'] = stu.examScore_avg[data.exam_id]['credit'] ? stu.examScore_avg[data.exam_id]['credit']: 0;
        stu.examScore_avg[data.exam_id]['examWeighted_total'] =  stu.examScore_avg[data.exam_id]['examWeighted_total'] ? stu.examScore_avg[data.exam_id]['examWeighted_total']: 0;
        stu.examScore_avg[data.exam_id]['exam_total'] =  stu.examScore_avg[data.exam_id]['exam_total'] ? stu.examScore_avg[data.exam_id]['exam_total']: 0;
        stu.examScore_avg[data.exam_id]['examScore_total'] =  stu.examScore_avg[data.exam_id]['examScore_total'] ? stu.examScore_avg[data.exam_id]['examScore_total']: 0;
        stu.examScore_avg[data.exam_id]['加權平均'] =  stu.examScore_avg[data.exam_id]['加權平均'] ? stu.examScore_avg[data.exam_id]['加權平均']: 0;
        stu.examScore_avg[data.exam_id]['算術平均'] =  stu.examScore_avg[data.exam_id]['算術平均'] ? stu.examScore_avg[data.exam_id]['算術平均']: 0;
      });
      if (this.subjectList.find(sub => sub === data.subject)===undefined) {
        this.subjectList.push(data.subject);
        this.studentList.map(stu => {
          stu.examScore[data.subject] = {};
          stu.examScore_us[data.subject] = {};
          stu.examScore_text[data.subject] = {};
          stu.examScore_proportion[data.subject] = {};
          stu.examScore_decimal = {};
          stu.examScore_carry ={};
          stu.examScore_avg[data.subject] = {};
          stu.examWeighted[data.subject] = {};
          return stu;
        });
      }

      const index = this.studentList.findIndex((stu: StudentRec) => stu.id == +data.student_id);
      if (index > -1) {
        let score_decimal = 0;
        let score_proportion = 0;
        let score_proportion_us = 0;
        let score = 0;
        let score_us = 0;
        let score_avg_calculating = 0;
        let score_avg ='';
        let score_weight = 0;
        this.studentList[index].examScore[data.subject][data.exam_id] = data.score;
        this.studentList[index].examScore_us[data.subject][data.exam_id] = data.score_us;
        this.studentList[index].examScore_text[data.subject][data.exam_id] = data.score_text;
        this.studentList[index].examScore_proportion[data.subject][data.exam_id] = data.score_proportion;
        this.studentList[index].examScore_decimal = data.score_decimal;
        this.studentList[index].examScore_carry = data.score_carry;

        this.studentList[index].examWeighted[data.subject][data.exam_id] = data.credit;
        score_decimal = parseInt(data.score_decimal); // 取得小數點位數
        this.global_score_decimal = score_decimal;
        this.global_score_carry = data.score_carry;
        score_proportion = parseInt(data.score_proportion)/100;
        score_proportion_us = 1 - score_proportion;
        if(data.score == '' && data.score_us == ''){
          this.studentList[index].examScore_avg[data.subject][data.exam_id] = '';
        }else{
          if(data.score !== ''){
            score = parseInt(data.score);
          }
          if(data.score_us !== ''){
            score_us = parseInt(data.score_us);
          }
          this.global_score_carry = data.score_carry;
            score_avg_calculating = NP.plus(NP.times(score,score_proportion),NP.times(score_us,score_proportion_us));
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
        stu.examScore_avg[exam.id]['加權平均'] = this.avgPipe.transform(NP.divide(stu.examScore_avg[exam.id]['examWeighted_total'],stu.examScore_avg[exam.id]['credit']),parseInt(stu.examScore_decimal),stu.examScore_carry);
        stu.examScore_avg[exam.id]['算術平均'] = this.avgPipe.transform(NP.divide(stu.examScore_avg[exam.id]['examScore_total'],stu.examScore_avg[exam.id]['exam_total']),parseInt(stu.examScore_decimal),stu.examScore_carry);
      })
    })



    console.log(this.studentList);
    console.log(this.examList);
  }

  async GetStuExamRank() {
    this.studentList.forEach(stu => {
      this.examList.forEach(exam => {
        this.matrixList.forEach(matrix => {
          stu.examRank['平均'] = stu.examRank['平均'] ? stu.examRank['平均'] : {};
          stu.examRank['平均'][exam.id] = stu.examRank['平均'][exam.id] ? stu.examRank['平均'][exam.id] : {};
          stu.examRank['平均'][exam.id][matrix] = '';
        });
      });
    });
    
    const rsp = await this.contract.send('GetJHExamRank', {
      ClassID: this.curClass.id
      , SchoolYear: this.curSS.school_year
      , Semester: this.curSS.semester
    });

    this.studentExamRankList = [].concat(rsp.ExamRank || []);
    this.studentExamRankList.forEach((data: ExamRankRec) => {
      const index = this.studentList.findIndex((stu: StudentRec) => stu.id == data.student_id);
      if (index > -1) {
        let examRank = this.studentList[index].examRank;
        let examtype = examRank[data.item_type] = examRank[data.item_type] ? examRank[data.item_type] :{};
        let subject = examtype[data.item_name] = examtype[data.item_name] ? examtype[data.item_name] : {};
        //let subject = examRank[data.item_name] = examRank[data.item_name] ? examRank[data.item_name] : {};
        let exam = subject[data.exam_id] = subject[data.exam_id] ? subject[data.exam_id] : {};
        // data.rank
        data.score = this.avgPipe.transform(parseFloat(data.score), this.global_score_decimal, this.global_score_carry);
        exam[data.rank_type] = data;
        
      }
    });
  }

  async GetExamRankMatrix() {
    this.examMatrix = {};
    const rsp = await this.contract.send('GetJHExamRankMatrix', {
      SchoolYear: this.curSS.school_year
      , Semester: this.curSS.semester
      , ClassID: this.curClass.id
      , ExamID: this.curExam.id
      , RankType: this.curMatrix
    });
    const dataList: MatrixRec[] = [].concat(rsp.ExamRankMatrix || []);

    dataList.forEach((matrix: MatrixRec) => {
          this.examMatrix[matrix.rank_name] = this.examMatrix[matrix.rank_name]? this.examMatrix[matrix.rank_name] : {};
          this.examMatrix[matrix.rank_name]['定期評量/科目成績'] = {};
          this.examMatrix[matrix.rank_name]['定期評量_定期/科目成績'] = {};
      
          this.subjectList.forEach(x => {
            this.examMatrix[matrix.rank_name]['定期評量/科目成績'][x] = {};
            this.examMatrix[matrix.rank_name]['定期評量_定期/科目成績'][x]= {};
          })
        })

    dataList.forEach((matrix: MatrixRec) => {
      this.examMatrix[matrix.rank_name][matrix.item_type][matrix.item_name] = this.examMatrix[matrix.rank_name][matrix.item_type][matrix.item_name] ? this.examMatrix[matrix.rank_name][matrix.item_type][matrix.item_name] : {};
    })

    dataList.forEach((matrix: MatrixRec) => {
      this.examMatrix[matrix.rank_name][matrix.item_type][matrix.item_name]['avg_top_25'] = this.avgPipe.transform(matrix.avg_top_25,this.global_score_decimal,this.global_score_carry);
      this.examMatrix[matrix.rank_name][matrix.item_type][matrix.item_name]['avg_top_50'] = this.avgPipe.transform(matrix.avg_top_50,this.global_score_decimal,this.global_score_carry);
      this.examMatrix[matrix.rank_name][matrix.item_type][matrix.item_name]['avg'] = this.avgPipe.transform(matrix.avg,this.global_score_decimal,this.global_score_carry);
      this.examMatrix[matrix.rank_name][matrix.item_type][matrix.item_name]['avg_bottom_50'] = this.avgPipe.transform(matrix.avg_bottom_50,this.global_score_decimal,this.global_score_carry);
      this.examMatrix[matrix.rank_name][matrix.item_type][matrix.item_name]['avg_bottom_25'] = this.avgPipe.transform(matrix.avg_bottom_25,this.global_score_decimal,this.global_score_carry);
      this.examMatrix[matrix.rank_name][matrix.item_type][matrix.item_name]['level_gte100'] = matrix.level_gte100;
      this.examMatrix[matrix.rank_name][matrix.item_type][matrix.item_name]['level_90'] = matrix.level_90;
      this.examMatrix[matrix.rank_name][matrix.item_type][matrix.item_name]['level_80'] = matrix.level_80;
      this.examMatrix[matrix.rank_name][matrix.item_type][matrix.item_name]['level_70'] = matrix.level_70;
      this.examMatrix[matrix.rank_name][matrix.item_type][matrix.item_name]['level_60'] = matrix.level_60;
      this.examMatrix[matrix.rank_name][matrix.item_type][matrix.item_name]['level_50'] = matrix.level_50;
      this.examMatrix[matrix.rank_name][matrix.item_type][matrix.item_name]['level_40'] = matrix.level_40;
      this.examMatrix[matrix.rank_name][matrix.item_type][matrix.item_name]['level_30'] = matrix.level_30;
      this.examMatrix[matrix.rank_name][matrix.item_type][matrix.item_name]['level_20'] = matrix.level_20;
      this.examMatrix[matrix.rank_name][matrix.item_type][matrix.item_name]['level_10'] = matrix.level_10;
      this.examMatrix[matrix.rank_name][matrix.item_type][matrix.item_name]['level_lt10'] = matrix.level_lt10;
    });
    console.log(this.examMatrix);
  }
  async GetExamRankMatrixGradeYear() {
    this.examMatrix = {};
    const rsp = await this.contract.send('GetJHExamRankMatrix', {
      SchoolYear: this.curSS.school_year
      , Semester: this.curSS.semester
      , ClassID: this.curClass.id
      , ExamID: this.curExam.id
      , RankType: this.curMatrix
    });
    const dataList: MatrixRec[] = [].concat(rsp.ExamRankMatrix || []);

    dataList.forEach((matrix: MatrixRec) => {
          this.examMatrix[matrix.rank_name.slice(0,1)] = this.examMatrix[matrix.rank_name.slice(0,1)]? this.examMatrix[matrix.rank_name.slice(0,1)] : {};
          this.examMatrix[matrix.rank_name.slice(0,1)]['定期評量/科目成績'] = {};
          this.examMatrix[matrix.rank_name.slice(0,1)]['定期評量_定期/科目成績'] = {};
      
          this.subjectList.forEach(x => {
            this.examMatrix[matrix.rank_name.slice(0,1)]['定期評量/科目成績'][x] = {};
            this.examMatrix[matrix.rank_name.slice(0,1)]['定期評量_定期/科目成績'][x]= {};
          })
        })

    dataList.forEach((matrix: MatrixRec) => {
      this.examMatrix[matrix.rank_name.slice(0,1)][matrix.item_type][matrix.item_name] = this.examMatrix[matrix.rank_name.slice(0,1)][matrix.item_type][matrix.item_name] ? this.examMatrix[matrix.rank_name.slice(0,1)][matrix.item_type][matrix.item_name] : {};
    })

    dataList.forEach((matrix: MatrixRec) => {
      let rank_name = "";
      rank_name = matrix.rank_name.slice(0,1);

      this.examMatrix[rank_name][matrix.item_type][matrix.item_name]['avg_top_25'] = this.avgPipe.transform(matrix.avg_top_25,this.global_score_decimal,this.global_score_carry);
      this.examMatrix[rank_name][matrix.item_type][matrix.item_name]['avg_top_50'] = this.avgPipe.transform(matrix.avg_top_50,this.global_score_decimal,this.global_score_carry);
      this.examMatrix[rank_name][matrix.item_type][matrix.item_name]['avg'] = this.avgPipe.transform(matrix.avg,this.global_score_decimal,this.global_score_carry);
      this.examMatrix[rank_name][matrix.item_type][matrix.item_name]['avg_bottom_50'] = this.avgPipe.transform(matrix.avg_bottom_50,this.global_score_decimal,this.global_score_carry);
      this.examMatrix[rank_name][matrix.item_type][matrix.item_name]['avg_bottom_25'] = this.avgPipe.transform(matrix.avg_bottom_25,this.global_score_decimal,this.global_score_carry);
      this.examMatrix[rank_name][matrix.item_type][matrix.item_name]['level_gte100'] = matrix.level_gte100;
      this.examMatrix[rank_name][matrix.item_type][matrix.item_name]['level_90'] = matrix.level_90;
      this.examMatrix[rank_name][matrix.item_type][matrix.item_name]['level_80'] = matrix.level_80;
      this.examMatrix[rank_name][matrix.item_type][matrix.item_name]['level_70'] = matrix.level_70;
      this.examMatrix[rank_name][matrix.item_type][matrix.item_name]['level_60'] = matrix.level_60;
      this.examMatrix[rank_name][matrix.item_type][matrix.item_name]['level_50'] = matrix.level_50;
      this.examMatrix[rank_name][matrix.item_type][matrix.item_name]['level_40'] = matrix.level_40;
      this.examMatrix[rank_name][matrix.item_type][matrix.item_name]['level_30'] = matrix.level_30;
      this.examMatrix[rank_name][matrix.item_type][matrix.item_name]['level_20'] = matrix.level_20;
      this.examMatrix[rank_name][matrix.item_type][matrix.item_name]['level_10'] = matrix.level_10;
      this.examMatrix[rank_name][matrix.item_type][matrix.item_name]['level_lt10'] = matrix.level_lt10;
    });
  }

  async setClass(data: ClassRec) { //影響學年度學期
    {
      this.curClass = data;
      await this.GetExamScoreSchoolYear();
      await this.GetClassStudent();
      await this.GetStuExamScore();
      await this.GetStuExamRank();
      await this.GetExamRankMatrix();
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
      await this.GetStuExamRank();
      await this.GetExamRankMatrix();
    }
    this.isLoading = false;
  }

  async setExam(data: ExamRec) {
    this.isLoading = true;
    {
      this.curExam = data;
      await this.GetClassStudent();
      await this.GetStuExamScore();
      await this.GetStuExamRank();
      await this.GetExamRankMatrix();
    }
    this.isLoading = false;
  }

  async setMatrix(data: string) {
    this.isLoading = true;
    {
      this.curMatrix = data;
      await this.GetClassStudent();
      await this.GetStuExamScore();
      await this.GetStuExamRank();
      if(this.curMatrix === '班排名'){
        await this.GetExamRankMatrix();
      }else{
        await this.GetExamRankMatrixGradeYear();
      }
    }
    this.isLoading = false;
  }

  setItemType(data: string) {
    this.isLoading = true;
    {
      if(data === '定期評量/科目成績' || ''){
        this.curExamTotalType = '定期評量/總計成績';
      }else if(data === '定期評量_定期/科目成績'){
        this.curExamTotalType = '定期評量_定期/總計成績';
      }
      this.curItemType = data;
    }
    this.isLoading = false;
  }

  setAvgType(data: string){
    if(data === '算術平均' || ''){
      this.curAvgType = data;
      this.curAvgTypeForServer = '平均';
      
    }else if(data === '加權平均' ){
      this.curAvgType = data;
      this.curAvgTypeForServer = '加權平均';

    }
  };
  openModal(template: TemplateRef<any>, scoreText: string) {
    this.modalRef = this.modalService.show(template, this.config);
    this.curScoreText = scoreText;
  }
}

interface SSRec {
  school_year: number;
  semester: number;
  content: string;
}
