import { GadgetService } from './gadget.service';
import { Component, OnInit, NgZone } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent implements OnInit {

  contract: any;
  isLoading: boolean;

  curClass: ClassRec = {} as ClassRec;
  classList: ClassRec[];
  ssList: SSRec[];
  curSS: SSRec = {} as SSRec;
  examList: ExamRec[];
  curExam: ExamRec = {} as ExamRec;
  matrixList = ['年排名', '班排名', '類別1排名', '類別2排名', '科排名']; 
  curMatrix = this.matrixList[0];
  studentExamScoreList: ExamScoreRec[];
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

      this.contract = await this.gadget.getContract('ischool.class.teacher');
      await this.getMyClass();
      await this.GetExamScoreSchoolYear();
      await this.GetAllExam();
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

  async GetAllExam() {
    this.examList = [];

    const rsp = await this.contract.send('GetAllExam', {});
    this.examList = [].concat(rsp.Exam || []);

    if (this.examList.length > 0) {
      this.curExam = this.examList[0];
    } else {
      this.curExam = {} as ExamRec;
    }
  }

  async GetStuExamScore() {
    this.studentList = [];
    this.subjectList = [];

    const rsp = await this.contract.send('GetExamScore', {
      ClassID: this.curClass.id
      , SchoolYear: this.curSS.school_year
      , Semester: this.curSS.semester
    });

    this.studentExamScoreList = [].concat(rsp.ExamScore || []);
    this.studentExamScoreList.forEach((data: ExamScoreRec) => {
      if (this.subjectList.findIndex((sub) => sub == data.subject) == -1) {
        this.subjectList.push(data.subject);
      }

      const index = this.studentList.findIndex((stu: StudentRec) => stu.id == data.student_id);
      if (index == -1) {
        const seatNo = Number(data.seat_no) == NaN ? null :  Number(data.seat_no);

        this.studentList.push({
          id: data.student_id
          , name: data.name
          , seatNo: seatNo
          , examScore: {}
          , examRank: {}
        });
      } 

      const _index = this.studentList.findIndex((stu: StudentRec) => stu.id == data.student_id);

      let examScore = this.studentList[_index].examScore;
      examScore[data.subject] = examScore[data.subject] ? examScore[data.subject] : {};
      examScore[data.subject][data.exam_id] = data.score;
    });

    this.studentList.sort((a: StudentRec, b: StudentRec) => {
      if (a.seatNo < b.seatNo) {
        return -1;
      } 
      if (a.seatNo > b.seatNo) {
        return 1;
      }
    })
  }

  async GetStuExamRank() {
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
        exam[data.rank_type] = data.rank;
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

  setClass(data: ClassRec) {
    this.isLoading = true;
    {
      this.curClass = data;
      this.GetExamScoreSchoolYear();
      this.GetStuExamScore();
      this.GetStuExamRank();
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

interface ClassRec {
  id: number;
  class_name: string;
  dept_name: string;
  grade_year: string;
}

interface SSRec {
  school_year: number;
  semester: number;
  content: string;
}

interface ExamRec {
  id: number;
  exam_name: string;
  description: string;
  display_order: string;
}

interface MatrixRec {
  exam_id: number;
  item_type: string;
  item_name: string;
  rank_type: string;
  avg_top_25: number;
  avg_top_50: number;
  avg: number;
  avg_bottom_50: number;
  avg_bottom_25: number;
  level_gte100: number;
  level_90: number;
  level_80: number;
  level_70: number;
  level_60: number;
  level_50: number;
  level_40: number;
  level_30: number;
  level_20: number;
  level_10: number;
  level_lt10: number;
}

interface ExamScoreRec {
  student_id: number;
  name: string;
  seat_no: number;
  subject: string;
  sc_attend_id: string;
  exam_id: number;
  exam_name: string;
  score: string;
}

interface ExamRankRec {
  student_id: number;
  rank: string;
  school_year: string;
  semester: string;
  item_type: string;
  exam_id: string;
  item_name: string;
  rank_type: string;
  rank_name: string;
}

interface StudentRec {
  id: number;
  name: string;
  seatNo: number;
  examScore: any;
  examRank: any;
}