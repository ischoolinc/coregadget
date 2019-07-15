import { Component, OnInit, ViewChild } from '@angular/core';
import { Quiz, QuizItem, ItemCount, StudentQuizData } from '../PsychologicalTest-vo';
import * as XLSX from 'xlsx';
import * as node2json from 'nodexml';
import * as moment from 'moment';
import { DsaService } from "../../dsa.service";

@Component({
  selector: 'app-import-quiz-data',
  templateUrl: './import-quiz-data.component.html',
  styleUrls: ['./import-quiz-data.component.css']
})
export class ImportQuizDataComponent implements OnInit {

  isImportButtonDisable: boolean = true;
  QuizData: Quiz = new Quiz();
  // 學生匯入方式
  selectImportStudentType: string = '班級座號';
  isSelectImportTypeClassSeatNo: boolean = false;
  isSelectImportTypeStudentNumber: boolean = false;
  isSelectImportTypeIDNumber: boolean = false;
  importFieldNameList: string[] = [];
  importFieldName: string = "";

  StudentQuizDataList: StudentQuizData[] = [];
  rABS = true; // true: readAsBinaryString ; false: readAsArrayBuffer
  sheet1 = [];
  constructor(
    private dsaService: DsaService
  ) { }

  ngOnInit() {
    this.selectImportStudentType = '班級座號';
    this.isSelectImportTypeClassSeatNo = true;
    this.isImportButtonDisable = true;

  }


  async importData() {
    let importData: any[] = [];

    this.StudentQuizDataList.forEach(item => {
      item.parseXML();
      let data = {
        QuizID: item.QuizUID,
        StudentID: item.StudentID,
        ImplementationDate: item.ImplementationDate.format('YYYY-MM-DD'),
        AnalysisDate: item.AnalysisDate.format('YYYY-MM-DD'),
        Content: item.ContentXML
      };
      importData.push(data);
    });

    // 資料寫入
    let importReq = {
      Request: {
        StudentQuizData: importData
      }
    }
    console.log(importReq);

    let respData = await this.dsaService.send("AddStudentQuizData",
      importReq
    );

    alert('匯入完成');
    console.log(respData);
  }

  // 載入匯入欄位名稱
  loadImportFieldName() {
    this.importFieldNameList = [];
    if (this.selectImportStudentType === "班級座號") {
      this.importFieldNameList.push("班級");
      this.importFieldNameList.push("座號");
    } if (this.selectImportStudentType === "學號") {
      this.importFieldNameList.push("學號");
    } if (this.selectImportStudentType === "身分證號") {
      this.importFieldNameList.push("身分證號");
    }

    this.importFieldNameList.push("實施日期");
    this.importFieldNameList.push("解析日期");
    this.QuizData.QuizItemList.forEach(item => {
      this.importFieldNameList.push(item.QuizName);
    });

    this.importFieldName = this.importFieldNameList.join(',');
  }


  readSpreadsheet(event) {
    return new Promise((r, j) => {
      let reader = new FileReader();
      this.sheet1 = [];
      if (event.target.files && event.target.files.length) {
        const [file, file2] = event.target.files;

        if (this.rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);

        // 讀取 Excel 檔案並解析
        reader.onload = (e) => {
          let data: any = reader.result;
          if (!this.rABS) data = new Uint8Array(data as any);

          /* read workbook */
          const wb: XLSX.WorkBook = XLSX.read(data, { type: this.rABS ? 'binary' : 'array', cellDates: true, cellNF: false, cellText: false });

          /* grab first sheet */
          console.log(wb.Sheets);
          const wsname: string = wb.SheetNames[0];
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];

          // console.log(wsname);
          // console.log(ws);

          // 取得資料範圍 A1:D4
          //     console.log('!ref => ', ws['!ref']);

          // 取得資料範圍，轉換為 s: {c: 0, r: 0} e: {c: 3, r: 3}
          //        console.log('range => ', XLSX.utils.decode_range(ws['!ref']));

          // now change to A1:A3 變更查看的範圍
          // ws['!ref'] = 'A1:A3';

          // 以第一行的內容為 key
          //   console.log('json => ', XLSX.utils.sheet_to_json(ws));
          this.sheet1 = XLSX.utils.sheet_to_json(ws, { dateNF: "YYYY-MM-DD" });
          this.StudentQuizDataList = [];
          this.sheet1.forEach(item => {
            let studQ: StudentQuizData = new StudentQuizData();
            studQ.QuizUID = this.QuizData.uid;
            if (item["班級"])
              studQ.ClassName = item["班級"];

            if (item["座號"])
              studQ.SeatNo = item["座號"];

            if (item["學號"])
              studQ.StudentNumber = item["學號"];

            if (item["身分證號"])
              studQ.IDNumber = item["身分證號"];

            if (item["解析日期"]) {
              //  let dts:string = moment(item["解析日期"]).format('YYYY-MM-DD');
              studQ.AnalysisDate = moment(item["解析日期"]);
            }

            if (item["實施日期"]) {
              studQ.ImplementationDate = moment(item["實施日期"]);
            }

            this.QuizData.QuizItemList.forEach(qItem => {
              if (item[qItem.QuizName]) {
                let qi: QuizItem = new QuizItem();
                qi.QuizName = qItem.QuizName;
                qi.Value = item[qItem.QuizName];
                studQ.QuizItemList.push(qi);
              }
            });
            this.StudentQuizDataList.push(studQ);
          });
          return r();
        };
      }

    });
  }

  async onFileChange(event) {
    this.StudentQuizDataList = [];

    await this.readSpreadsheet(event);
    let checkPass: boolean = true;
    //   console.log(this.sheet1);

    // 檢查需要欄位是否完整

    if (this.sheet1.length === 0) {

      checkPass = false;
      alert("檔案內沒有資料。");
    }

    let lostField: string[] = [];
    // 驗證欄位是否缺少
    if (this.sheet1.length > 0) {
      this.importFieldNameList.forEach(item => {
        if (!this.sheet1[0][item]) {
          lostField.push(item);
        }
      });
    }

    if (lostField.length > 0) {
      checkPass = false;
      alert("檔案內缺少欄位：" + lostField.join(','));

    }


    if (checkPass) {
      // 判斷使用驗證方式
      if (this.selectImportStudentType === '班級座號') {
        let noStudentIDList: string[] = [];
        let ClassName = [];
        let tmpC: string[] = [];
        // 解析匯入班級座號
        this.StudentQuizDataList.forEach(item => {
          if (!tmpC.includes(item.ClassName)) {
            tmpC.push(item.ClassName);
            ClassName.push(item.ClassName);
          }
        });

        let req = {
          Request: {
            ImportType: this.selectImportStudentType,
            ClassName
          }
        };
        console.log(req);
        // console.log(tmpClassName);
        let resp = await this.dsaService.send("GetImportQuizCheckData",
          req
        );

        let xData = [].concat(resp.StudentIDs || []);
        xData.forEach(item => {
          this.StudentQuizDataList.forEach(sItem => {
            if (item.class_name == sItem.ClassName && item.seat_no == sItem.SeatNo) {
              sItem.StudentID = item.student_id;
            }
          });
        });

        this.StudentQuizDataList.forEach(sItem => {
          if (sItem.StudentID && sItem.StudentID.length > 0) {
          } else {
            let str = `班級：${sItem.ClassName}, 座號：${sItem.SeatNo}`;
            noStudentIDList.push(str);
          }
        });

        if (noStudentIDList.length > 0) {
          this.isImportButtonDisable = true;
          alert("班級,座號 無法比對：\n" + noStudentIDList.join('\n'));
        } else {
          this.isImportButtonDisable = false;
        }

      }

      if (this.selectImportStudentType === '學號') {
        let noStudentIDList: string[] = [];
        let StudentNumber = [];
        let tmpC: string[] = [];
        // 解析匯入學號
        this.StudentQuizDataList.forEach(item => {
          if (!tmpC.includes(item.StudentNumber)) {
            tmpC.push(item.StudentNumber);
            StudentNumber.push(item.StudentNumber)
          }
        });

        let req = {
          Request: {
            ImportType: this.selectImportStudentType,
            StudentNumber
          }
        };
        let resp = await this.dsaService.send("GetImportQuizCheckData",
          req
        );

        let xData = [].concat(resp.StudentIDs || []);
        xData.forEach(item => {
          this.StudentQuizDataList.forEach(sItem => {

            if (item.student_number == sItem.StudentNumber) {
              sItem.StudentID = item.student_id;
            }
          });
        });


        this.StudentQuizDataList.forEach(sItem => {
          if (sItem.StudentID && sItem.StudentID.length > 0) {
          } else {
            let str = `學號：${sItem.StudentNumber}}`;
            noStudentIDList.push(str);
          }
        });

        if (noStudentIDList.length > 0) {
          this.isImportButtonDisable = true;
          alert("學號無法比對：\n" + noStudentIDList.join('\n'));
        } else {
          this.isImportButtonDisable = false;
        }

      }

      if (this.selectImportStudentType === '身分證號') {
        let noStudentIDList: string[] = [];
        let IDNumber = [];
        let tmpC: string[] = [];
        // 解析匯入學號
        this.StudentQuizDataList.forEach(item => {
          if (!tmpC.includes(item.IDNumber)) {
            tmpC.push(item.IDNumber);
            IDNumber.push(item.IDNumber);
          }
        });

        let req = {
          Request: {
            ImportType: this.selectImportStudentType,
            IDNumber
          }
        };
        // console.log(req);
        // console.log(tmpClassName);
        let resp = await this.dsaService.send("GetImportQuizCheckData",
          req
        );

        let xData = [].concat(resp.StudentIDs || []);
        xData.forEach(item => {
          this.StudentQuizDataList.forEach(sItem => {

            if (item.id_number == sItem.IDNumber) {
              sItem.StudentID = item.student_id;
            }
          });
        });

        this.StudentQuizDataList.forEach(sItem => {
          if (sItem.StudentID && sItem.StudentID.length > 0) {
          } else {
            let str = `身分證號：${sItem.IDNumber}}`;
            noStudentIDList.push(str);
          }
        });

        if (noStudentIDList.length > 0) {
          this.isImportButtonDisable = true;
          alert("身分證號無法比對：\n" + noStudentIDList.join('\n'));
        } else {
          this.isImportButtonDisable = false;
        }

      }
    } else {
      this.isImportButtonDisable = true;
    }
  }

  SetSelectImportType(name: string) {
    this.isSelectImportTypeClassSeatNo = false;
    this.isSelectImportTypeIDNumber = false;
    this.isSelectImportTypeStudentNumber = false;
    this.selectImportStudentType = name;
    this.isSelectImportTypeClassSeatNo = (name === '班級座號');
    this.isSelectImportTypeIDNumber = (name === '身分證號');
    this.isSelectImportTypeStudentNumber = (name === '學號');
    this.loadImportFieldName();
  }
}
