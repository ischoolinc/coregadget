import { Component, OnInit, Optional, ViewChild } from '@angular/core';
import { AdminComponent } from "../admin.component";
import { ActivatedRoute, Router } from '@angular/router';
import { DsaService } from "../../dsa.service";
import { Quiz, QuizItem } from './psychological-quiz-setup-vo';
import * as node2json from 'nodexml';
import { AddPsychologicalQuizDataComponent } from './add-psychological-quiz-data/add-psychological-quiz-data.component';
import { DelPsychologicalQuizDataComponent } from './del-psychological-quiz-data/del-psychological-quiz-data.component';

@Component({
  selector: 'app-psychological-quiz-setup',
  templateUrl: './psychological-quiz-setup.component.html',
  styleUrls: ['./psychological-quiz-setup.component.css']
})
export class PsychologicalQuizSetupComponent implements OnInit {
  isLoading = false;
  @ViewChild("addPsychologicalQuizData") _addPsychologicalQuizData: AddPsychologicalQuizDataComponent;
  @ViewChild("delPsychologicalQuizData") _delPsychologicalQuizData: DelPsychologicalQuizDataComponent;
  AllQuizList: Quiz[] = [];
  AllQuizSource: any[] = [];
  constructor(private activatedRoute: ActivatedRoute,
    private dsaService: DsaService,
    private router: Router,
    @Optional()
    public adminComponent: AdminComponent) { }

  ngOnInit() {
    this.adminComponent.currentItem = "psychological_quiz_setup";
    this.loadData();
  }

  loadData() {
    this.GetAllQuiz();
  }

  Add() {
    this._addPsychologicalQuizData.QuizData = new Quiz();
    let qi: QuizItem = new QuizItem();
    qi.QuizOrder = 1;

    this._addPsychologicalQuizData.QuizData.QuizItemList.push(qi);
    this._addPsychologicalQuizData.isAdd = true;
    this._addPsychologicalQuizData.isQuizNameHasValue = false;
    this._addPsychologicalQuizData.isUserDefined = true;
    this._addPsychologicalQuizData.isUseMappingTable = false;
    this._addPsychologicalQuizData.editType = '新增';
    $("#addPsychologicalQuizData").modal("show");

    // 關閉畫面
    $("#addPsychologicalQuizData").on("hide.bs.modal", () => {
      // 重整資料
      this.loadData();
      $("#addPsychologicalQuizData").off("hide.bs.modal");
    });
  }

  delete(item: Quiz) {
    this._delPsychologicalQuizData.quizData = item;
    $("#delPsychologicalQuizData").modal("show");

    // 關閉畫面
    $("#delPsychologicalQuizData").on("hide.bs.modal", () => {
      // 重整資料
      this.loadData();
      $("#delPsychologicalQuizData").off("hide.bs.modal");
    });
  }

  edit(item: Quiz) {
    this._addPsychologicalQuizData.isAdd = false;
    this._addPsychologicalQuizData.QuizData = item;
    this._addPsychologicalQuizData.editType = '編輯';

    if (item.UseMappingTable) {
      this._addPsychologicalQuizData.isUseMappingTable = true;
      this._addPsychologicalQuizData.isUserDefined = false;
    } else {
      this._addPsychologicalQuizData.isUseMappingTable = false;
      this._addPsychologicalQuizData.isUserDefined = true;
    }
    $("#addPsychologicalQuizData").modal("show");

    // 關閉畫面
    $("#addPsychologicalQuizData").on("hide.bs.modal", () => {
      // 重整資料
      this.loadData();
      $("#addPsychologicalQuizData").off("hide.bs.modal");
    });
  }

  // 取得心理測驗題目
  async GetAllQuiz() {
    this.isLoading = true;

    try {
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
    } catch (err) {
      alert('無法取得心理測驗題目：' + err.dsaError.message);
    }
    this.isLoading = false;
  }
}
