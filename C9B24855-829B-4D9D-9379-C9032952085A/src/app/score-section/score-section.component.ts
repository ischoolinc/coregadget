import { DataServiceService } from './../services/data-service.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CurrentItem, IAssessment, ICustomAssessment, IeslRecord, ISubjectInfo, ITermInfo } from '../vo/vo';
import { GadgetService } from '../gadget.service';
import { ToolService } from '../services/tool.service';
import { Chart, registerables } from 'chart.js';
import { FormControl } from '@angular/forms';
// import { ConsoleReporter } from 'jasmine';

@Component({
  selector: 'app-score-section',
  templateUrl: './score-section.component.html',
  styleUrls: ['./score-section.component.scss']
})
export class ScoreSectionComponent implements OnInit {
  @ViewChild('chart') chart: ElementRef<HTMLCanvasElement> | undefined;
  position = new FormControl('below');

  loading = false;
  courseID: string | null | undefined;
  currentItem: CurrentItem = new CurrentItem();
  eslScoreInfoMap: Map<string, ITermInfo> = new Map();
  eslScoreInfoList: ITermInfo[] = [];
  islock = true;

  scoreRange: any = {};
  myChart: any;


  constructor(
    private gadget: GadgetService,
    private route: ActivatedRoute,
    private router: Router,
    private tool: ToolService,
    private dataService: DataServiceService
  ) { }

  // @Input() subjData :any;
  async ngOnInit() {

    // console.log("【score_ngOnInit】dataS",this.dataService.currentItem)
    Chart.register(...registerables);
    // 0.取得傳進來地參數
    await this.route.paramMap.subscribe(
      (params: ParamMap): void => {
        this.courseID = params.get("course_id");
        //  this.getESLScoreInfoByCourID();
      })

    this.currentItem = this.dataService.firstCurrentItem;

    await this.dataService.currentItem$.subscribe(
      currentItem => {
        this.currentItem = currentItem;
        console.log("current ", this.currentItem)
      }
    );
    console.log("current 2", this.currentItem)
    // this.dataService.currentItem.
    // this.dataService.currentItem.subscribe(data => {
    //   this.data = data;
    //   console.log(this.data);
    //   this.results = this.parseData(this.data);
    // });

  }

  /** 點選開細節*/
  async openDetail(assessment: IAssessment, customAssessment: ICustomAssessment) {
    customAssessment.isCheck = !customAssessment.isCheck;

    alert("hihi");
    //this.currentItem.currentTerm = customAssessment;

    this.currentItem.currentCustomAssessment = customAssessment;
    this.currentItem.currentAssess = assessment;
    console.log(" this.currentItem.currentCustomAssessment", this.currentItem.currentCustomAssessment);
    await this.getRangeCount();
    await this.getChart(customAssessment.customAssessName + "_md");
    await this.getChart(customAssessment.customAssessName + "_bg");
    await this.getChart(customAssessment.customAssessName + "_sm");
  }

  /**【View】移至 新地方*/
  navigateToSection(section :string){

     this.router.navigate(['/esl_score', this.courseID], { fragment: section })


  }


  /**取得圖表*/
  async getChart(id: string) {
    var canvas = <HTMLCanvasElement>document.getElementById(id);
    var ctx = canvas.getContext("2d");

    if (ctx != null) {
      this.myChart = new Chart(ctx,
        {
          type: 'bar',
          data: {
            labels: [
              '100',
              '90-99',
              '80-89',
              '70-79',
              '60-69',
              '50-59',
              '40-49',
              '30-39',
              '20-29',
              '10-19',
              '0-9',
            ],
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
                this.geBartColor(this.tool.checkStudentAtThisRange(100, 100, this.scoreRange.avg)),
                this.geBartColor(this.tool.checkStudentAtThisRange(90, 99, this.scoreRange.avg)),
                this.geBartColor(this.tool.checkStudentAtThisRange(80, 89, this.scoreRange.avg)),
                this.geBartColor(this.tool.checkStudentAtThisRange(70, 79, this.scoreRange.avg)),
                this.geBartColor(this.tool.checkStudentAtThisRange(60, 69, this.scoreRange.avg)),
                this.geBartColor(this.tool.checkStudentAtThisRange(50, 59, this.scoreRange.avg)),
                this.geBartColor(this.tool.checkStudentAtThisRange(40, 49, this.scoreRange.avg)),
                this.geBartColor(this.tool.checkStudentAtThisRange(30, 39, this.scoreRange.avg)),
                this.geBartColor(this.tool.checkStudentAtThisRange(20, 29, this.scoreRange.avg)),
                this.geBartColor(this.tool.checkStudentAtThisRange(10, 19, this.scoreRange.avg))
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
      let rsp = await contract.send('GetCourseAssessmentScoreRange', {
        CourseID: this.courseID,
        Subject: this.currentItem.currentSubj?.subjectName,
        Term: this.currentItem.currentTerm?.termName,
        Assessment: this.currentItem.currentAssess?.assessmentName,
        CustomAssessment: this.currentItem.currentCustomAssessment?.customAssessName
      });

      console.log("ff", {
        CourseID: this.courseID,
        Subject: this.currentItem.currentSubj?.subjectName,
        Term: this.currentItem.currentTerm?.termName,
        Assessment: this.currentItem.currentAssess?.assessmentName,
        CustomAssessment: this.currentItem.currentCustomAssessment?.customAssessName
      })

      this.scoreRange = rsp.CoursesCusAssessInfo;
      console.log("GetCourseAssessmentScore ", rsp);
    } catch (err) {
      // this.error = err;
    } finally {
      this.loading = false;
    }
  }

  /** */
  geBartColor(isCurrentStudentAtThisRange: boolean): string {

    return '#5ec1c79e';
    if (!isCurrentStudentAtThisRange) {
      return '#5ec1c79e';

    } else if (isCurrentStudentAtThisRange) {
      return '#1098a0';
    }
    else {
      return '#5ec1c79e';
    }
  }

  /** */
  termChange(term: any) {

    console.log("termChange....", term)
  }

  /** */
  displayTerm(term: ITermInfo) {
    console.log("record ....", term);
    if (term && term.termName) {
      return term ? `${term.termName}` ?? '請選擇項目' : 'Loading...';
    } else {
      return '無資料';
    }
  }

  displaySubj(subj: ISubjectInfo) {
    console.log("record ....", subj);
    if (subj && subj.subjectName) {
      return subj ? `${subj.subjectName}` ?? '請選擇項目' : 'Loading...';
    } else {
      return '無資料';
    }
  }


  changeShowSection(sectionName: string) {

    console.log('sectionName', sectionName)
    if (sectionName == "Score") {
      this.routeTo("esl_score");

    } else if (sectionName == "Behavior") {
      this.routeTo("behavior");
    }

  }
  /**導向 */
  async routeTo(to: any) {
    console.log('route to',)
    await this.router.navigate([to, this.courseID])
  }
  /** */
  getColor(score: string | undefined): string {
    if (score) {
      if (60 > parseFloat(score)) {
        // return "#DC3599";
        return "bg-warning-dark"
      } else {
        // return "#547CB4"
        return "text-secondary"
      }

    }
    return "text-secondary"

  }
}
