import { Component, Optional, OnInit, ViewChild } from "@angular/core";
import { AppComponent } from "../../app.component";
import { RoleService } from "../../role.service";
import { ActivatedRoute, ParamMap, Router, RoutesRecognized } from "@angular/router";
import * as node2json from 'nodexml';
import { DsaService } from "../../dsa.service";
import { Quiz, QuizItem, ClassQuizCount, ItemCount, StudentQuizData, ClassInfo } from '../PsychologicalTest-vo';
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
  ClassID: string;
  Quiz: Quiz;
  QuizItemNameList: string[] = [];
  StudentQuizDataSource: any[] = [];
  StudentQuizDataList: StudentQuizData[] = [];
  
  selectClassName: string;
  selectQuizName: string;
  classList: ClassInfo[] = [];
  QuizList: Quiz[] = [];

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

    this.appComponent.currentComponent = "student-quiz-data";
    this.activatedRoute.paramMap.subscribe(
      (params: ParamMap): void => {
        this.QuizID = params.get("quiz_id");
        // 填入預設
        this.ClassID = params.get("class_id");
        this.loadData();
      }
    );
  }

  SetSelectClass(item: ClassInfo) {
    this.ClassID = item.ClassID;
    this.selectClassName = item.ClassName;
    this.router.navigate(['../../../student-quiz-data', this.QuizID, this.ClassID], {
      relativeTo: this.activatedRoute,
    });
  }

  SetSelectQuiz(item: Quiz) {
    this.Quiz = item;
    this.selectQuizName = item.QuizName;
    this.QuizID = item.uid;
    this.router.navigate(['../../../student-quiz-data', this.QuizID, this.ClassID], {
      relativeTo: this.activatedRoute,
    });
  }

  loadData() {
    this.isLoading = true;

    if (this.psychologicalTestService.AllClassList && this.psychologicalTestService.AllQuizList && this.psychologicalTestService.AllClassList.length > 0 && this.psychologicalTestService.AllQuizList.length > 0) {
      this.loadDefaultData();
    } else {
      this.GetAllQuiz();
    }

  }

  loadDefaultData() {
    this.classList = this.psychologicalTestService.AllClassList;
    if (this.psychologicalTestService.AllQuizList && this.psychologicalTestService.AllQuizList.length > 0) {
      this.QuizList = [];
      this.psychologicalTestService.AllQuizList.forEach(qItem => {
        this.QuizList.push(qItem);
        if (qItem.uid === this.QuizID) {
          this.Quiz = qItem;
          this.QuizItemNameList = [];
          this.Quiz.QuizItemList.forEach(item => {
            if (item.QuizName !== '實施日期' && item.QuizName !== '解析日期') {
              this.QuizItemNameList.push(item.QuizName);
            }
          });
        }
      });

      // 透過 id 解析選的名稱
      this.classList.forEach(item => {
        if (item.ClassID === this.ClassID) {
          this.selectClassName = item.ClassName;
        }
      });

      this.QuizList.forEach(item => {
        if (item.uid === this.QuizID) {
          this.selectQuizName = item.QuizName;
        }
      });

      this.GetStudentQuizDataByClassID();
    }
  }


  // 取得心理測驗題目
  async GetAllQuiz() {
    this.isLoading = true;
    let resp = await this.dsaService.send("GetAllQuiz", {});

    let AllQuizSource = [].concat(resp.Quiz || []);
    let AllQuizList: Quiz[] = [];
    AllQuizSource.forEach(item => {
      let qz: Quiz = new Quiz();
      qz.uid = item.UID;
      qz.QuizName = item.QuizName;
      qz.xmlSource = item.QuizDataField;
      qz.MappingTable = item.MappingTable;
      if (item.UseMappingTable && item.UseMappingTable === 't')
        qz.UseMappingTable = true;
      else
        qz.UseMappingTable = false;

      let xq = [].concat(node2json.xml2obj(item.QuizDataField) || []);
      xq.forEach(FieldItem => {
        if (FieldItem.Field) {
          FieldItem.Field = [].concat(FieldItem.Field || []);
          FieldItem.Field.forEach(xItem => {
            let qi: QuizItem = new QuizItem();
            if (xItem.name) {
              qi.QuizName = xItem.name;
            }

            if (xItem.order) {
              qi.QuizOrder = parseInt(xItem.order);
            }
            qz.QuizItemList.push(qi);
          });
        }
      });
      AllQuizList.push(qz);
    });
    this.QuizList = AllQuizList;
    this.psychologicalTestService.AllQuizList = AllQuizList;
    this.GetAllClassCount();
  }

  async GetAllClassCount() {
    let resp = await this.dsaService.send("GetAllClassCount", {});

    let ClassStudentCount = [].concat(resp.ClassStudentCount || []);
    this.classList = [];
    if (ClassStudentCount.length > 0) {
      ClassStudentCount.forEach(item => {
        let ci: ClassInfo = new ClassInfo();
        ci.ClassName = item.class_name;
        ci.ClassID = item.class_id;
        this.classList.push(ci);
      });
    }
    this.psychologicalTestService.AllClassList = this.classList;
    this.loadDefaultData();
  }

  async GetStudentQuizDataByClassID() {
    let resp: any;
    this.StudentQuizDataList = [];
    try {
      resp = await this.dsaService.send("GetStudentQuizDataByClassID1", {
        Request: {
          ClassID: this.ClassID
        }
      });

      this.StudentQuizDataSource = [].concat(resp.StudentQuizData || []);

      // 處理班級學生
      this.StudentQuizDataSource.forEach(item => {
        let studData: StudentQuizData = new StudentQuizData();
        studData.ClassName = item.ClassName;
        studData.SeatNo = item.SeatNo;
        studData.StudentID = item.StudentID;
        studData.StudentName = item.StudentName;
        studData.StudentNumber = item.StudentNumber;
        studData.QuizUID = item.QuizID;
        studData.AnalysisDate  = moment(item.AnalysisDate);
        studData.ImplementationDate =  moment(item.ImplementationDate);
        studData.parseDT();
        // 處理 value 內容有 <,> xml 會被吃問題
        let xxx = item.Content.replace(/</g,"&lt").replace(/&ltItem/g,"<Item");
        let xx1 = xxx.replace(/>/g,"&gt").replace(/\/&gt/g,"/>");
        let xq = [].concat(node2json.xml2obj('<root>' + xx1 + '</root>') || []);
     
        studData.QuizItemList = [];
        if (xq.length > 0) {
          if (xq[0].root && xq[0].root.Item) {
            let items = [].concat(xq[0].root.Item || []);
            items.forEach(subItem => {
              let qi: QuizItem = new QuizItem();
              qi.QuizName = subItem.name;
              qi.Value = subItem.value.replace(/&lt/g,"<").replace(/&gt/g,">");
              studData.QuizItemList.push(qi);
            });
          }
        }

        this.StudentQuizDataList.push(studData);
      });
      this.isLoading = false;
    } catch (err) {
      alert(err);
    }
  }
}
