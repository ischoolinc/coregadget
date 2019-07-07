import { Component, OnInit, Optional } from '@angular/core';
import { CounselDetailComponent } from "../counsel-detail.component";
import { DsaService } from "../../../dsa.service";
import { CounselStudentService } from "../../../counsel-student.service";
import { SemesterInfo, DomainScoreInfo, SubjectScoreInfo, StudentSemesterScoreInfo } from "./semester-score-vo";
import { identifierModuleUrl } from '@angular/compiler';

@Component({
  selector: 'app-semester-score-detail',
  templateUrl: './semester-score-detail.component.html',
  styleUrls: ['./semester-score-detail.component.css']
})
export class SemesterScoreDetailComponent implements OnInit {

  // 選的學年度學期
  selectSchoolYearSemester: SemesterInfo = new SemesterInfo();

  // 及格標準
  passScore: number = 60;

  // 學校型態
  selectSchoolType: string = "JHHC";

  semesterList: SemesterInfo[] = [];

  // 學期成績來源資料
  semesterScoreSource: any[] = [];

  serviceGetSemesterScore: string = "";

  studentSemesterScore: StudentSemesterScoreInfo = new StudentSemesterScoreInfo();

  constructor(private counselStudentService: CounselStudentService,
    private dsaService: DsaService,
    @Optional() private counselDetailComponent: CounselDetailComponent) { }

  ngOnInit() {
    this.counselDetailComponent.setCurrentItem('semester_score');
    this.loadData();
  }

  loadData() {

    if (this.selectSchoolType === 'JHHC') {
      // 新竹版國中小評量成績
      this.serviceGetSemesterScore = "GetSemesterScoreJHHC";
      this.GetSemesterScore();
    }

    // 取得預設學年度學期
    this.selectSchoolYearSemester.SchoolYear = this.counselDetailComponent.counselStudentService.currentSchoolYear
    this.selectSchoolYearSemester.Semester = this.counselDetailComponent.counselStudentService.currentSemester;

  }

  // 取得學期成績
  async GetSemesterScore() {
    this.semesterList = [];
    let tmpSems: string[] = [];
    let resp = await this.dsaService.send(this.serviceGetSemesterScore, {
      Request: {
        StudentID: this.counselDetailComponent.currentStudent.StudentID
      }
    });

    this.semesterScoreSource = [].concat(resp.SemesterScore || []);

    this.semesterScoreSource.forEach(semsScore => {
      if (semsScore.AverageScore) {
        semsScore.AverageScore.forEach(avgScore => {
          let ss = avgScore.SchoolYear + avgScore.Semester;
          if (!tmpSems.includes(ss)) {
            let semsInfo: SemesterInfo = new SemesterInfo();
            semsInfo.SchoolYear = parseInt(avgScore.SchoolYear);
            semsInfo.Semester = parseInt(avgScore.Semester);
            this.semesterList.push(semsInfo);
            tmpSems.push(ss);
          }
        });
      }
    });
    this.parseScore();
  }

  SetSelectSemester(item: SemesterInfo) {
    this.selectSchoolYearSemester = item;
    this.parseScore();
  }

  parseScore() {
    this.studentSemesterScore = new StudentSemesterScoreInfo();

    this.semesterScoreSource.forEach(semsScore => {
      // 學期平均
      if (semsScore.AverageScore) {
        semsScore.AverageScore.forEach(avgScore => {
          if (avgScore.SchoolYear == this.selectSchoolYearSemester.SchoolYear && avgScore.Semester == this.selectSchoolYearSemester.Semester) {
            this.studentSemesterScore.LearnDomainScore = parseFloat(avgScore.LearnDomainScore);
            this.studentSemesterScore.CourseLearnScore = parseFloat(avgScore.CourseLearnScore);

          }
        });
      }
    });

    this.semesterScoreSource.forEach(semsScore => {
      // 領域成績
      if (semsScore.DomainScore) {
        semsScore.DomainScore.forEach(domainScore => {
          if (domainScore.SchoolYear == this.selectSchoolYearSemester.SchoolYear && domainScore.Semester == this.selectSchoolYearSemester.Semester) {
            let dScore: DomainScoreInfo = new DomainScoreInfo();
            if (!domainScore.Domain)
              domainScore.Domain = '彈性課程';

            dScore.Domain = domainScore.Domain;
            dScore.Credit = parseFloat(domainScore.Credit);
            dScore.Effort = parseFloat(domainScore.Effort);
            dScore.Period = parseFloat(domainScore.Period);
            dScore.Score = parseFloat(domainScore.Score);
            dScore.SubjectScoreList = [];
            this.studentSemesterScore.DomainScoreList.push(dScore);
          }
        });
      }
    });

    let dd: DomainScoreInfo = new DomainScoreInfo();
    dd.Domain = '彈性課程';
    this.studentSemesterScore.DomainScoreList.push(dd);
    this.semesterScoreSource.forEach(semsScore => {
      // 科目成績
      if (semsScore.SubjectScore) {
        semsScore.SubjectScore.forEach(SubjScore => {
          if (SubjScore.SchoolYear == this.selectSchoolYearSemester.SchoolYear && SubjScore.Semester == this.selectSchoolYearSemester.Semester) {
            let sScore: SubjectScoreInfo = new SubjectScoreInfo();
            if (!SubjScore.Domain)
              SubjScore.Domain = '彈性課程';
            sScore.Domain = SubjScore.Domain;
            sScore.SubjectName = SubjScore.Subject;
            sScore.Credit = parseFloat(SubjScore.Credit);
            sScore.Effort = parseFloat(SubjScore.Effort);
            sScore.Period = parseFloat(SubjScore.Period);
            sScore.Score = parseFloat(SubjScore.Score);

            this.studentSemesterScore.DomainScoreList.forEach(dScore => {
              if (dScore.Domain === sScore.Domain) {
                dScore.SubjectScoreList.push(sScore);

              }

            });
          }
        });
      }
    });

    this.studentSemesterScore.DomainScoreList.forEach(item => {
      if (!item.Score)
        item.Calc();
    });
  }
}
