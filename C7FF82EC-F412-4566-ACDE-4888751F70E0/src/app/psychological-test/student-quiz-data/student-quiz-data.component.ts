import { Component, Optional, OnInit, ViewChild } from "@angular/core";
import { AppComponent } from "../../app.component";
import { RoleService } from "../../role.service";
import { ActivatedRoute, ParamMap, Router, RoutesRecognized } from "@angular/router";
import * as node2json from 'nodexml';
import { DsaService } from "../../dsa.service";
import { Quiz, QuizItem, ClassQuizCount, ItemCount, StudentQuizData } from '../PsychologicalTest-vo';
import * as moment from 'moment';
import { PsychologicalTestService } from '../psychological-test.service';

@Component({
  selector: 'app-student-quiz-data',
  templateUrl: './student-quiz-data.component.html',
  styleUrls: ['./student-quiz-data.component.css']
})
export class StudentQuizDataComponent implements OnInit {

  isLoading = false;
  QuizID: string;
  ClassName: string;
  Quiz: Quiz;
  StudentQuizDataSource: any[] = [];
  StudentQuizDataList: StudentQuizData[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public roleService: RoleService,
    private dsaService: DsaService,
    public psychologicalTestService: PsychologicalTestService,
    @Optional()
    private appComponent: AppComponent
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.appComponent.currentComponent = "student-quiz-data";
    this.activatedRoute.paramMap.subscribe(
      (params: ParamMap): void => {
        this.QuizID = params.get("quiz_id");
        // 填入預設
        this.ClassName = params.get("class_name");
        this.loadData();
      }
    );
  }

  loadData() {

    this.psychologicalTestService.AllQuizList.forEach(qItem => {
      if (qItem.uid === this.QuizID) {
        this.Quiz = qItem;
      }
    });
    this.GetStudentQuizDataByClassName();
  }

  async GetStudentQuizDataByClassName() {
    let resp: any;
    try {
      resp = await this.dsaService.send("GetStudentQuizDataByClassName", {
        Request: {
          ClassName: this.ClassName,
          QuizID: this.QuizID
        }
      });
      this.StudentQuizDataList = [];
      this.StudentQuizDataSource = [].concat(resp.StudentQuizData || []);
      this.StudentQuizDataSource.forEach(item => {
        if (item.quiz_id && item.quiz_id === this.QuizID) {
          let studData: StudentQuizData = new StudentQuizData();
          studData.QuizUID = item.quiz_id;
          studData.ClassName = item.class_name;
          studData.SeatNo = item.seat_no;
          studData.StudentID = item.student_id;
          studData.StudentName = item.student_name;
          studData.AnalysisDate = moment(item.analysis_date);
          studData.ImplementationDate = moment(item.implementation_date);

          let xq = [].concat(node2json.xml2obj('<root>' + item.content + '</root>') || []);
          // xq.forEach(FieldItem => {
          //   if (FieldItem.Field) {
          //     FieldItem.Field = [].concat(FieldItem.Field || []);
          //     FieldItem.Field.forEach(xItem => {
          //       let qi: QuizItem = new QuizItem();
          //       if (xItem.name) {
          //         qi.QuizName = xItem.name;
          //       }

          //       if (xItem.order) {
          //         qi.QuizOrder = parseInt(xItem.order);
          //       }
          //       qz.QuizItemList.push(qi);
          //     });
          // }
          // });

        }
      });
      this.isLoading = false;
    } catch (err) {
      alert(err);
    }
  }
}
