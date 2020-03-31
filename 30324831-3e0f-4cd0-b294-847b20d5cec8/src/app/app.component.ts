import { GadgetService } from './gadget.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { StudentRec, ClassRec ,ExamScoreRec, MatrixRec, ExamRec, ExamRankRec } from './data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent implements OnInit {

  contract: any;
  isLoading: boolean;

  curClass: ClassRec = {} as ClassRec;
  classList: ClassRec[] = [];
  ssList: SSRec[];
  curSS: SSRec = {} as SSRec;
  examList: ExamRec[];
  curExam: ExamRec = {} as ExamRec;
  matrixList = ['年排名', '班排名', '類別1排名', '類別2排名', '科排名']; 
  curMatrix = this.matrixList[0];

  studentExamRankList: ExamRankRec[];
  subjectList: string[];
  studentList: StudentRec[];
  examMatrix = {};

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
    private gadget: GadgetService) {
  }

  async ngOnInit() {
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

    const rsp = await this.contract.send('GetMyClass', {});
    this.classList = [].concat(rsp.Class || []);
    
    if (this.classList.length > 0) {
      this.curClass = this.classList[0];
    } else {
      this.curClass = {} as ClassRec;
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

      if (this.ssList.length > 0) {
        this.curSS = this.ssList[0];
      } else {
        this.curSS = {} as SSRec;
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
      return stu;
    });
  }

  async GetStuExamScore() {
    this.subjectList = [];
    const rsp = await this.contract.send('GetExamScore', {
      ClassID: this.curClass.id
      , SchoolYear: this.curSS.school_year
      , Semester: this.curSS.semester
    });

    [].concat(rsp.ExamScore || []).forEach((data: ExamScoreRec) => {
      if (this.subjectList.find(sub => sub === data.subject)===undefined) {
        this.subjectList.push(data.subject);
        this.studentList.map(stu => {
          stu.examScore[data.subject] = {};
          return stu;
        });
      }

      const index = this.studentList.findIndex((stu: StudentRec) => stu.id == +data.student_id);
      if (index > -1) {
        this.studentList[index].examScore[data.subject][data.exam_id] = data.score;
      }
    });
  }

  async GetStuExamRank() {
    // Init Object avoid property undefined
    this.studentList.forEach(stu => {
      this.examList.forEach(exam => {
        this.matrixList.forEach(matrix => {
          stu.examRank['平均'] = stu.examRank['平均'] ? stu.examRank['平均'] : {};
          stu.examRank['平均'][exam.id] = stu.examRank['平均'][exam.id] ? stu.examRank['平均'][exam.id] : {};
          stu.examRank['平均'][exam.id][matrix] = '';
        });
      });
    });
    
    const rsp = await this.contract.send('GetExamRank', {
      ClassID: this.curClass.id
      , SchoolYear: this.curSS.school_year
      , Semester: this.curSS.semester
    });

    this.studentExamRankList = [].concat(rsp.ExamRank || []);
    this.studentExamRankList.forEach((data: ExamRankRec) => {
      const index = this.studentList.findIndex((stu: StudentRec) => stu.id == data.student_id);
      if (index > -1) {
        let examRank = this.studentList[index].examRank;
        let subject = examRank[data.item_name] = examRank[data.item_name] ? examRank[data.item_name] : {};
        let exam = subject[data.exam_id] = subject[data.exam_id] ? subject[data.exam_id] : {};
        // data.rank
        exam[data.rank_type] = data;
      }
    });
  }

  async GetExamRankMatrix() {
    this.examMatrix = {};

    const rsp = await this.contract.send('GetExamRankMatrix', {
      SchoolYear: this.curSS.school_year
      , Semester: this.curSS.semester
      , ClassID: this.curClass.id
      , ExamID: this.curExam.id
      , RankType: this.curMatrix
    });

    const dataList: MatrixRec[] = [].concat(rsp.ExamRankMatrix || []);

    dataList.forEach((matrix: MatrixRec) => {
      this.examMatrix[matrix.item_name] = {};
      this.examMatrix[matrix.item_name]['avg_top_25'] = matrix.avg_top_25;
      this.examMatrix[matrix.item_name]['avg_top_50'] = matrix.avg_top_50;
      this.examMatrix[matrix.item_name]['avg'] = matrix.avg;
      this.examMatrix[matrix.item_name]['avg_bottom_50'] = matrix.avg_bottom_50;
      this.examMatrix[matrix.item_name]['avg_bottom_25'] = matrix.avg_bottom_25;
      this.examMatrix[matrix.item_name]['level_gte100'] = matrix.level_gte100;
      this.examMatrix[matrix.item_name]['level_90'] = matrix.level_90;
      this.examMatrix[matrix.item_name]['level_80'] = matrix.level_80;
      this.examMatrix[matrix.item_name]['level_70'] = matrix.level_70;
      this.examMatrix[matrix.item_name]['level_60'] = matrix.level_60;
      this.examMatrix[matrix.item_name]['level_50'] = matrix.level_50;
      this.examMatrix[matrix.item_name]['level_40'] = matrix.level_40;
      this.examMatrix[matrix.item_name]['level_30'] = matrix.level_30;
      this.examMatrix[matrix.item_name]['level_20'] = matrix.level_20;
      this.examMatrix[matrix.item_name]['level_10'] = matrix.level_10;
      this.examMatrix[matrix.item_name]['level_lt10'] = matrix.level_lt10;
    });
  }

  async setClass(data: ClassRec) {
    this.isLoading = true;
    {
      this.curClass = data;
      await this.GetExamScoreSchoolYear();
      await this.GetClassStudent();
      await this.GetStuExamScore();
      await this.GetStuExamRank();
    }
    this.isLoading = false;
  }

  setSS(data: SSRec) {
    this.isLoading = true;
    {
      this.curSS = data;
      this.GetStuExamScore();
      this.GetStuExamRank();
    }
    this.isLoading = false;
  }

  setExam(data: ExamRec) {
    this.curExam = data;
  }

  setMatrix(data: string) {
    this.isLoading = true;
    {
      this.curMatrix = data;
      this.GetExamRankMatrix();
    }
    this.isLoading = false;
  }
}

interface SSRec {
  school_year: number;
  semester: number;
  content: string;
}