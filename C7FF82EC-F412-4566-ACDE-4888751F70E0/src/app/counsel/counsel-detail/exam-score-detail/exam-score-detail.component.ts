import { Component, OnInit, Optional } from '@angular/core';
import { CounselDetailComponent } from "../counsel-detail.component";
import { DsaService } from "../../../dsa.service";
import { CounselStudentService } from "../../../counsel-student.service";
import { DomainScoreInfo, CourseScoreInfo, ExamScoreInfo, ExamAvgScoreInfo, SemesterInfo, StudentExamScore } from "./exam-score-vo";
import { debug } from 'util';


@Component({
  selector: 'app-exam-score-detail',
  templateUrl: './exam-score-detail.component.html',
  styleUrls: ['./exam-score-detail.component.css']
})
export class ExamScoreDetailComponent implements OnInit {

  // 選的學年度學期
  selectSchoolYearSemester: SemesterInfo = new SemesterInfo();

  // 學校型態
  selectSchoolType: string = "JHHC";

  semesterList: SemesterInfo[] = [];

  // 評量成績來源資料
  examScoreSource: any[] = [];

  selectExamScoreSource: any[] = [];

  studentExamScore: StudentExamScore = new StudentExamScore();
  // 真正使用 service
  servicGetExamScore: string = "";
  constructor(private counselStudentService: CounselStudentService,
    private dsaService: DsaService,
    @Optional() private counselDetailComponent: CounselDetailComponent) { }

  ngOnInit() {
    this.counselDetailComponent.setCurrentItem('exam_score');
    this.loadData();
  }

  loadData() {
    if (this.selectSchoolType === 'JHHC') {
      // 新竹版國中小評量成績
      this.servicGetExamScore = "GetExamScoreJHHC";
      this.GetExamScore();
    }

    // 取得預設學年度學期
    this.selectSchoolYearSemester.SchoolYear = this.counselDetailComponent.counselStudentService.currentSchoolYear
    this.selectSchoolYearSemester.Semester = this.counselDetailComponent.counselStudentService.currentSemester;
  }

  SetSelectSemester(item: SemesterInfo) {
    this.selectSchoolYearSemester = item;
    this.parseScore();
  }

  async GetExamScore() {
    this.semesterList = [];
    let tmpSems: string[] = [];
    let resp = await this.dsaService.send(this.servicGetExamScore, {
      Request: {
        StudentID: this.counselDetailComponent.currentStudent.StudentID
      }
    });

    this.examScoreSource = [].concat(resp.CourseExamScore || []);

    this.examScoreSource.forEach(ExamScore => {
      let ss = ExamScore.SchoolYear + ExamScore.Semester;
      if (!tmpSems.includes(ss)) {
        let semsInfo: SemesterInfo = new SemesterInfo();
        semsInfo.SchoolYear = parseInt(ExamScore.SchoolYear);
        semsInfo.Semester = parseInt(ExamScore.Semester);
        this.semesterList.push(semsInfo);
        tmpSems.push(ss);
      }
    });
    this.parseScore();
  }

  // 解析成績
  parseScore() {
    this.studentExamScore = new StudentExamScore();
    // 取得本學年度學期
    this.selectExamScoreSource = [];
    this.examScoreSource.forEach(item => {
      if (item.SchoolYear == this.selectSchoolYearSemester.SchoolYear && item.Semester == this.selectSchoolYearSemester.Semester) {
        this.selectExamScoreSource.push(item);
      }
    });

    this.selectExamScoreSource.forEach(item => {
      if (!item.Domain) {
        item.Domain = '彈性課程';
      }

      if (!this.studentExamScore.DomainNameList.includes(item.Domain)) {

        this.studentExamScore.DomainNameList.push(item.Domain)
        let domainScore: DomainScoreInfo = new DomainScoreInfo();
        domainScore.DomainName = item.Domain;
        domainScore.SumScore = 0;
        domainScore.Credit = 0;

        if (domainScore.DomainName === '語文') {
          domainScore.Order = 1;
        } else if (domainScore.DomainName === '數學') {
          domainScore.Order = 2;
        } else if (domainScore.DomainName === '社會') {
          domainScore.Order = 3;
        } else if (domainScore.DomainName === '自然與生活科技') {
          domainScore.Order = 4;
        } else if (domainScore.DomainName === '藝術與人文') {
          domainScore.Order = 5;
        } else if (domainScore.DomainName === '健康與體育') {
          domainScore.Order = 6;
        } else if (domainScore.DomainName === '綜合活動') {
          domainScore.Order = 6;
        } else {
          domainScore.Order = 99;
        }


        domainScore.CourseScoreList = [];
        this.studentExamScore.DomainScoreList.push(domainScore);
      }
      // 處理課程成績
      if (!this.studentExamScore.CourseNameList.includes(item.CourseName)) {
        this.studentExamScore.CourseNameList.push(item.CourseName);
        let courseScore: CourseScoreInfo = new CourseScoreInfo();
        courseScore.DomainName = item.Domain;
        courseScore.CourseCredit = parseFloat(item.Credit);
        courseScore.CourseName = item.CourseName;
        courseScore.CourseScore = parseFloat(item.ExamScore);
        courseScore.SubjectName = item.Subject;
        courseScore.ExamScoreList = [];
        this.studentExamScore.CourseScoreList.push(courseScore);
      }
    })

    // 處理評量成績
    this.selectExamScoreSource.forEach(item => {

      if (!this.studentExamScore.ExamNameList.includes(item.ExamName)) {
        this.studentExamScore.ExamNameList.push(item.ExamName);
      }
      this.studentExamScore.CourseScoreList.forEach(courseItem => {
        if (item.CourseName === courseItem.CourseName) {
          let exam: ExamScoreInfo = new ExamScoreInfo();
          exam.Score = parseFloat(item.Score);
          exam.AssignmentScore = parseFloat(item.AssignmentScore);
          exam.DisplayOrder = parseInt(item.DisplayOrder);
          exam.ExamScore = parseFloat(item.ExamScore);
          exam.ExamName = item.ExamName;
          exam.HasScore = true;
          courseItem.ExamScoreList.push(exam);
        }
      });
    });

    // 放入領域的課程成績
    this.studentExamScore.DomainScoreList.forEach(domainItem => {
      this.studentExamScore.CourseScoreList.forEach(courseItem => {
        if (domainItem.DomainName === courseItem.DomainName) {
          // 檢查 exam 不足補空的
          if (courseItem.ExamScoreList.length < this.studentExamScore.ExamNameList.length) {
            let order: number = 1;
            this.studentExamScore.ExamNameList.forEach(exName => {
              let checkHasData: boolean = false;
              let nullExam: ExamScoreInfo = new ExamScoreInfo();
              nullExam.HasScore = false;
              nullExam.DisplayOrder = order;
              courseItem.ExamScoreList.forEach(exScore => {
                if (exScore.ExamName == exName) {
                  checkHasData = true;
                }
              });
              if (checkHasData === false) {
                courseItem.ExamScoreList.push(nullExam);
              }
              order += 1;
            });
            courseItem.ExamScoreList.sort(function (a, b) {
              return a.DisplayOrder - b.DisplayOrder;
            });
          }

          domainItem.CourseScoreList.push(courseItem);
        }
      });
      // 計算領域成績
      domainItem.CalcDomainScore();

    });

    this.studentExamScore.DomainScoreList.sort(function (a, b) {
      return a.Order - b.Order;
    });
    debugger;
  }
}
