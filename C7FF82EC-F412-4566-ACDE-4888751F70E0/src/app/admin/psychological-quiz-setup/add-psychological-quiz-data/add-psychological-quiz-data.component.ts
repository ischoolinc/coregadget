import { Component, OnInit } from '@angular/core';
import { Quiz, QuizItem, MappingTable } from '../psychological-quiz-setup-vo';
import { DsaService } from "../../../dsa.service";
import { tmpMapXML } from 'src/app/psychological-test/PsychologicalTest-vo';

@Component({
  selector: 'app-add-psychological-quiz-data',
  templateUrl: './add-psychological-quiz-data.component.html',
  styleUrls: ['./add-psychological-quiz-data.component.css']
})
export class AddPsychologicalQuizDataComponent implements OnInit {

  isAdd: boolean = true;
  editType: string = '新增';
  QuizData: Quiz = new Quiz();
  isUserDefined: boolean = false;
  isUseMappingTable: boolean = false;
  isQuizNameHasValue: boolean = false;
  isSaveButtonDisable: boolean = true;
  selectMappingTableName: string = "心理測驗常模轉換對照表.CPMP";
 
  MappingTableList: MappingTable[] = [];

  constructor(private dsaService: DsaService) { }

  ngOnInit() {

  }

  cancel() {
    $("#addPsychologicalQuizData").modal("hide");
  }

  async save() {
    let useMt: string = 'f';
    let mTable: string = '';
    this.QuizData.parseXML();
    if (this.isUseMappingTable) {
      // 將暫存對照表寫入
      useMt = 't';
      let tt: tmpMapXML = new tmpMapXML();
      mTable = tt.xml;
    }
    let req = {};
    if (this.isAdd) {
      req = {
        Request: {
          QuizName: this.QuizData.QuizName,
          QuizDataField: this.QuizData.QuizDataFieldXML,
          MappingTable: mTable,
          UseMappingTable: useMt
        }
      };
    } else {
      req = {
        Request: {
          QuizID: this.QuizData.uid,
          QuizName: this.QuizData.QuizName,
          QuizDataField: this.QuizData.QuizDataFieldXML,
          MappingTable: mTable,
          UseMappingTable: useMt
        }
      };
    }

    // 呼叫 Service 檢查項目名稱是否重複
    let chkRsp;
    try {
      chkRsp = await this.dsaService.send("GetAllQuizNameUid");
      let chkQuiz = [].concat(chkRsp.Quiz || []);
      let pass: boolean = true;
      if (this.isAdd) {
        chkQuiz.forEach(item => {
          if (item.QuizName === this.QuizData.QuizName) {
            pass = false;
            alert(this.QuizData.QuizName + ',已有相同名稱無法新增。');
          }
        });
      } else {
        // 檢查更新
        chkQuiz.forEach(item => {
          if (item.QuizName === this.QuizData.QuizName && item.UID !== this.QuizData.uid) {
            pass = false;
            alert(this.QuizData.QuizName + ',已有相同名稱無法更新。');
          }
        });
      }

      if (pass) {
        try {
          let resp = await this.dsaService.send("SetCounselQuizByUID", req);
          $("#addPsychologicalQuizData").modal("hide");
        } catch (err) {
          alert(err);
        }
      }

    } catch (err) {
      alert(err);
    }
  }

  checkValue() {
    if (this.QuizData.QuizName.length === 0) {
      this.isSaveButtonDisable = true;
    } else
      this.isSaveButtonDisable = false;
  }

  SetSelectMappingTable(item: MappingTable) {

  }

  AddNullQuitItem() {
    let qi: QuizItem = new QuizItem();
    qi.QuizName = '';
    qi.QuizOrder =this.QuizData.QuizItemList.length + 1;
    this.QuizData.QuizItemList.push(qi);
  }

  setQuizType(name: string) {
    if (name === '自訂項目') {
      this.isUserDefined = true;
      this.isUseMappingTable = false;
      this.QuizData.UseMappingTable = false;
    }

    if (name === '常模轉換') {
      this.isUserDefined = false;
      this.isUseMappingTable = true;
      this.QuizData.UseMappingTable = true;
    }
  }

  delItem(item: QuizItem) {
    let tmp: QuizItem[] = [];
    if (this.QuizData.QuizItemList.length > 1) {
      this.QuizData.QuizItemList = this.QuizData.QuizItemList.filter(x => x.QuizName !== item.QuizName);

      this.QuizData.QuizItemList.forEach(iq => {
        if (item.QuizName !== iq.QuizName)
          tmp.push(iq);
      });

      this.QuizData.QuizItemList = tmp;
    }
  }
}
