import { Component, Optional, OnInit, ViewChild } from "@angular/core";
import { AppComponent } from "../../app.component";
import { RoleService } from "../../role.service";
import { ActivatedRoute, ParamMap, Router, RoutesRecognized } from "@angular/router";
import * as node2json from 'nodexml';
import { DsaService } from "../../dsa.service";
import { Quiz, QuizItem, ClassQuizCount, ItemCount, ClassInfo } from '../PsychologicalTest-vo';
import { ImportQuizDataComponent } from '../import-quiz-data/import-quiz-data.component';
import { PsychologicalTestService } from '../psychological-test.service';
@Component({
  selector: 'app-psychological-test-list',
  templateUrl: './psychological-test-list.component.html',
  styleUrls: ['./psychological-test-list.component.css']
})
export class PsychologicalTestListComponent implements OnInit {
  deny: boolean = false;
  isLoading: boolean = false;
  @ViewChild("import_quiz_data") import_quiz_data_modal: ImportQuizDataComponent;


  // 心理測驗原始資料
  AllQuizSource: any[] = [];
  AllClassQuizCountSource: any[] = [];
  AllQuizList: Quiz[] = [];
  AllClassQuizCountList: ClassQuizCount[] = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public roleService: RoleService,
    private dsaService: DsaService,
    public psychologicalTestService: PsychologicalTestService,
    @Optional()
    private appComponent: AppComponent
  ) {
    if (this.appComponent) this.appComponent.currentComponent = "psychological-test-list";
  }

  ngOnInit() {
    //var str = node2json.obj2xml({ test: "test" },"root");

    // let x1 = {Item:[{ '@name': "分數",'@value': "100" }]};
    // var str = node2json.obj2xml(x1);
    this.loadData();
  }

  loadData() {
    this.GetAllQuiz();
  }

  // 取得心理測驗題目
  async GetAllQuiz() {
    this.isLoading = true;
    let resp = await this.dsaService.send("GetAllQuiz", {});
    this.AllQuizList = [];
    this.AllQuizSource = [].concat(resp.Quiz || []);
    this.AllQuizSource.forEach(item => {
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
      this.AllQuizList.push(qz);
    });
    this.psychologicalTestService.AllQuizList = this.AllQuizList;
    this.GetClassQuizCount();
  }

  // 取得班級心理測驗人數統計
  async GetClassQuizCount() {
    let resp: any;
    try {
      resp = await this.dsaService.send("GetClassQuizCount", {});
    } catch (err) {
      alert(err);
    }

    this.AllClassQuizCountList = [];

    this.AllClassQuizCountSource = [].concat(resp.ClassQuizCount || []);
    this.AllClassQuizCountSource.forEach(item => {

      if (item.ClassStudent) {
        let ClassStudent = [].concat(item.ClassStudent || []);
        ClassStudent.forEach(classItem => {
          let ci: ClassQuizCount = new ClassQuizCount();
          if (classItem.class_id)
            ci.ClassID = classItem.class_id;

          if (classItem.class_name)
            ci.ClassName = classItem.class_name;

          if (classItem.class_student)
            ci.ClassStudents = classItem.class_student;
          ci.HasQuizCountList = [];
          this.AllClassQuizCountList.push(ci);
        });
      }
    });

    this.AllClassQuizCountSource.forEach(item => {
      if (item.ClassHasQuizCount) {
        let ClassHasQuizCount = [].concat(item.ClassHasQuizCount || []);
        ClassHasQuizCount.forEach(qCount => {

          if (qCount.class_name) {
            this.AllClassQuizCountList.forEach(classItem => {
              if (classItem.ClassName === qCount.class_name) {
                let ic: ItemCount = new ItemCount();
                if (qCount.quiz_name) {
                  ic.Name = qCount.quiz_name;
                }
                if (qCount.student_count) {
                  ic.Count = parseInt(qCount.student_count);
                }
                classItem.HasQuizCountList.push(ic);
              }

            });
          }
        });
      }
    });

    this.psychologicalTestService.AllClassList = [];
    this.AllClassQuizCountList.forEach(item => {
      let ci: ClassInfo = new ClassInfo();
      ci.ClassID = item.ClassID;
      ci.ClassName = item.ClassName;
      this.psychologicalTestService.AllClassList.push(ci);
    });

    this.isLoading = false;

  }

  modalImport(data: Quiz) {
    this.import_quiz_data_modal.QuizData = data;
    this.import_quiz_data_modal.loadImportFieldName();
    $("#psychological-import").modal("show");
    // 關閉畫面
    $("#psychological-import").on("hide.bs.modal", () => {
      // 重整資料
      this.loadData();
      $("#psychological-import").off("hide.bs.modal");

    });
  }

  showStudentQuizData(quiz_id: string, class_id: string) {
    if (quiz_id && class_id) {
      this.router.navigate(['../student-quiz-data', quiz_id, class_id], {
        relativeTo: this.activatedRoute,
      });
    }
  }

}
