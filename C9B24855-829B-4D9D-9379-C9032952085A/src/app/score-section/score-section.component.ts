import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CurrentItem, ICustomAssessment, IeslRecord, ISubjectInfo, ITermInfo } from '../vo/vo';
import { GadgetService } from '../gadget.service';
import { ToolService } from '../services/tool.service';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-score-section',
  templateUrl: './score-section.component.html',
  styleUrls: ['./score-section.component.scss']
})
export class ScoreSectionComponent implements OnInit, AfterViewInit {
  @ViewChild('chart') chart: ElementRef<HTMLCanvasElement> | undefined;


  loading = false;
  courseID: string | null | undefined;
  currentItem: CurrentItem = new CurrentItem();
  eslScoreInfoMap: Map<string, ITermInfo> = new Map();
  eslScoreInfoList: ITermInfo[] = [];
  scoreRange: any = {};

  constructor(
    private gadget: GadgetService,
    private route: ActivatedRoute,
    private router: Router,
    private tool: ToolService
  ) { }

  // @Input() subjData :any;
  async ngOnInit() {
    Chart.register(...registerables);
    // 0.取得傳進來地參數
    await this.route.paramMap.subscribe(
      (params: ParamMap): void => {
        this.courseID = params.get("course_id");
        this.getESLScoreInfoByCourID();
      })


  }

  /** 點選開細節*/
  async openDetail(customAssessment: ICustomAssessment ) {
    customAssessment.isCheck = !customAssessment.isCheck;
    this.currentItem.currentCustomAssessment = customAssessment;
    await this.getRangeCount();
    await this.getChart(customAssessment.customAssessName+"_md");
    await this.getChart(customAssessment.customAssessName+"_bg");
  }

  async get() { }



  /** 取得該學生目前成績 */
  async getESLScoreInfoByCourID() {

    try {
      this.loading = true;
      // 取得 contract 連線。
      const contract = await this.gadget.getContract('1campus.esl.student');
      // 呼叫 service。
      let rsp = await contract.send('GetESLscoreByCourseID', {
        CourseID: this.courseID
      });

      // 整理一下唷
      const eslRecords: IeslRecord[] = [].concat(rsp.ESLScoreRecord);
      eslRecords.forEach(scoreRecord => {

        let type = this.tool.checkScoreType(scoreRecord.CustomAssessment, scoreRecord.Assessment, scoreRecord.Subject, scoreRecord.Term);
        // Term
        if (!this.eslScoreInfoMap.has(scoreRecord.Term)) {
          let term = {
            termName: scoreRecord.Term,
            SubjectInfosMap: new Map(),
            SubjectInfosList: [],
            termScore: "",
            weight: ""
          };
          if (type == "term") {
            term.termScore = scoreRecord.Value;
            term.weight = scoreRecord.TermWeight;
          }

          this.eslScoreInfoMap.set(scoreRecord.Term, term);
          this.eslScoreInfoList.push(term);

        }
        // Subject

        if (!this.eslScoreInfoMap.get(scoreRecord.Term)?.SubjectInfosMap.has(scoreRecord.Subject)) {
          let subj = {
            subjectName: scoreRecord.Subject,
            AssessmentsMap: new Map(),
            AssessmentsList: [],
            subjScore: "",
            weight: ""
          };

          if (type == "subject") {
            subj.subjScore = scoreRecord.Value;
            subj.weight = scoreRecord.SubjectWeight;
          }
          this.eslScoreInfoMap.get(scoreRecord.Term)?.SubjectInfosMap.set(scoreRecord.Subject, subj)
          this.eslScoreInfoMap.get(scoreRecord.Term)?.SubjectInfosList.push(subj);
        }
        // Accessment
        let currentSubjectInfo: ISubjectInfo | undefined;
        if (!this.eslScoreInfoMap.get(scoreRecord.Term)?.SubjectInfosMap.has(scoreRecord.Assessment)) {
          currentSubjectInfo = this.eslScoreInfoMap.get(scoreRecord.Term)?.SubjectInfosMap.get(scoreRecord.Subject)
          if (!currentSubjectInfo?.AssessmentsMap.has(scoreRecord.Assessment)) {
            let assessment = {
              assessmentName: scoreRecord.Assessment,
              score: "",
              customAssessmentsMap: new Map(),
              customAssessmentsList: [],
              weight: ""
            }

            if (type == "assessment") {
              assessment.score = scoreRecord.Value;
              assessment.weight = scoreRecord.AssessmentWeight;

            }
            currentSubjectInfo?.AssessmentsMap.set(scoreRecord.Assessment, assessment);
            currentSubjectInfo?.AssessmentsList.push(assessment);
          }

        }
        // customAssessment
        let currentAssess = currentSubjectInfo?.AssessmentsMap.get(scoreRecord.Assessment);
        if (!currentAssess?.customAssessmentsMap.has(scoreRecord.CustomAssessment)) {

          let customAssess = {
            customAssessName: scoreRecord.CustomAssessment,
            customAssessmentScore: "",
            date: "",
            description: "",
            isCheck: false
          }

          if (type == "customAssessment") {
            customAssess.customAssessName = scoreRecord.CustomAssessment;
            customAssess.customAssessmentScore = scoreRecord.Value;

            currentAssess?.customAssessmentsMap.set(scoreRecord.CustomAssessment, customAssess);
            currentAssess?.customAssessmentsList.push(customAssess);
          }
        }
      });

      // 設定default
      this.currentItem.currentTerm = this.eslScoreInfoList[0];
      this.currentItem.currentSubj = this.eslScoreInfoList[0].SubjectInfosList[0];

    } catch (ex) {

    } finally {
      this.loading = false;
    }

  }

  /**取得圖表*/
  async getChart(id:string ) {
    var canvas = <HTMLCanvasElement>document.getElementById(id);
    var ctx = canvas.getContext("2d");

    if (ctx != null) {
      var myChart = new Chart(ctx,
        {
          type: 'bar',
          data: {
            labels: ['0-9', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '80-89', '90-99'],
            datasets: [{
              label: '# of Votes',
              data: [
                this.scoreRange._100,
                this.scoreRange._90_99,
                this.scoreRange._80_89,
                this.scoreRange._70_79,
                this.scoreRange._60_69,
                this.scoreRange._50_59,
                this.scoreRange._40_49,
                this.scoreRange._30_39,
                this.scoreRange._20_29,
                this.scoreRange._10_19,
                this.scoreRange._9_10,


              ],

              backgroundColor: [
                this.geBartColor(),
                this.geBartColor(),
                this.geBartColor(),
                this.geBartColor(),
                this.geBartColor(),
                this.geBartColor(),
                this.geBartColor(),
                this.geBartColor(),
                this.geBartColor(),
                this.geBartColor()

              ],
              // borderColor: [
              //   'rgba(255, 99, 132, 1)',
              //   'rgba(54, 162, 235, 1)',
              //   'rgba(255, 206, 86, 1)',
              //   'rgba(75, 192, 192, 1)',
              //   'rgba(153, 102, 255, 1)',
              //   'rgba(255, 159, 64, 1)'
              // ],
              borderWidth: 1
            }]
          },
          options: {
            indexAxis: 'y', //讓圖變成橫向
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
    }



  }
  ngAfterViewInit() {
  }


  /** AssessMent組距統計*/
  async getRangeCount() {
    try {
      this.loading = true;

      // 取得 contract 連線。
      const contract = await this.gadget.getContract('1campus.esl.student');
      // 呼叫 service。
      let rsp = await contract.send('GetCourseAssessmentScore', {
        CourseID: "275",
        Subject: "Term 1",
        Term: "mid-Term",
        Assessment: "In-Class Score",
        CustomAssessment: "Listening&Speaking"
      });

      this.scoreRange = rsp.CoursesCusAssessInfo;
      console.log("GetCourseAssessmentScore ", rsp);
    } catch (err) {
      // this.error = err;
    } finally {
      this.loading = false;
    }



  }

  /** */
  geBartColor(): string {
    return '#5ec1c79e';

  }
}
