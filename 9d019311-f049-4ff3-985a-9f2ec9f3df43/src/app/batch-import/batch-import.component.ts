import { Component, OnInit, OnDestroy} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { StudentRecord, PerformanceDegree, CommentRecord, ExamRecord } from '../data';
import * as Papa from 'papaparse';
import { TargetDataService } from '../service/target-data.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BasicService } from '../service';

@Component({
  selector: 'app-batch-import',
  templateUrl: './batch-import.component.html',
  styleUrls: ['./batch-import.component.css']
})
export class BatchImportComponent implements OnInit, OnDestroy {

  
  // 標題
  title: string;
  // 學生清單
  studentList: StudentRecord[] = [];
  // 匯入資料
  sourceText: string;
  // 解析資料
  parseValues: string[] = [];
  hasError = false;
  dispose$ = new Subject();

  // 文字代碼表
  textCodeList: CommentRecord[] = [];
  // 程度代碼表
  degreeCodeList: PerformanceDegree[] =[];
  // 目前評量
  curExam: ExamRecord;

  //代碼資料比對用清單
  textCodeListT = {};
  degreeCodeListT = {};

  isLoading = true;
 
  constructor(
    public modalRef: BsModalRef,
    private targetDataSrv: TargetDataService,
    ) {
  }

  async ngOnInit() {
    // 訂閱資料
    this.targetDataSrv.studenList$.pipe(
      takeUntil(this.dispose$)
    ).subscribe((stuList: StudentRecord[]) => {
      this.studentList = stuList;
    });
    //產出兩張比對用的代碼對照表
      this.textCodeList.forEach(item => {
        if (item.Code) { this.textCodeListT[item.Code] = item.Comment || ''; }
    });
      this.degreeCodeList.forEach(item => {
        if (item.Degree) { this.degreeCodeListT[item.Degree] = item.Desc || ''; }
    });
  }

  ngOnDestroy() {
    this.dispose$.next();
  }

  // 要處理原始來自 Excel 來源的資料會有跨行(自動換行Excel 貼出來的字會有幫前後字串加綴雙引號")
  // 雙引號、單引號、逗號...等會造成 parser 的讀取轉換問題
  csvToArray(text: string) {
    let newData: any[] = Papa.parse(text || '').data;
    newData = newData.map((v: string[]) => v.join(',').replace(/\r?\n|\r/g, ''));
    return newData;
  }

  parse() {
    
    //點選解析時一併轉換（先保留）
    // if(this.curExam.ExamID === 'DailyLifeRecommend'){
    //   const re = new RegExp(/([\d\w]+)/, 'g');
    //   this.sourceText = (this.sourceText  || '').replace(re, (match, g1) => { 
    //     return this.textCodeListT[g1] || g1 });
    // }else{
    //   const re = new RegExp(/([\d\w]+)/, 'g');
    //   this.sourceText = (this.sourceText  || '').replace(re, (match, g1) => { 
    //     return this.degreeCodeListT[g1] || g1 
    //   });
    // }

    let parseText = this.sourceText || '';

    // 由於 Excel 格子內文字若輸入" 其複製到 Web 後，會變成"" ，在此將其移除，避免後續的儲存處理問題
    // parseText = parseText.replace(/""/g, '');

    const aryValues = this.csvToArray(parseText);
    this.hasError = false;
    this.studentList.forEach((stu, idx) => {
      if (idx >= aryValues.length) {
        aryValues.push('錯誤');
        this.hasError = true;
      } else {
        const value = aryValues[idx];
        if (value) {
          // 使用者若知道其學生沒有資料，請在其欄位內輸入 - ，程式碼會將其填上空值
          aryValues[idx] = (value === '-' ? '' : value);
        } else {
          aryValues[idx] = '錯誤';
          this.hasError = true;
        }
      }
    });
    // console.log(aryValues);
    // console.log(this.hasError);
    this.parseValues = aryValues;
  }

  /**清除資料 */
  clear() {
    this.parseValues = [];
  }

  /**匯入資料 */
  importData() {
    if (this.hasError == true) { 
      return; 
    } else {
      // 寫入匯入解析後的成績資料
      [].concat(this.studentList || []).forEach((stu: StudentRecord) => {
        stu.DailyLifeScore.set(`${this.targetDataSrv.exam$.value.ExamID}_${this.title}`, this.parseValues[stu.Index]);
      });
      const curStudent: StudentRecord = this.studentList.find((stu: StudentRecord) => stu.ID === this.targetDataSrv.student$.value.ID);

      // service 資料更新
      this.targetDataSrv.setStudentList(this.studentList);
      this.targetDataSrv.setStudent(curStudent);
      this.modalRef.hide();
    }
  }
  
  //代碼轉文字
  doTransfer(){
    if(this.curExam.ExamID === 'DailyLifeRecommend'){
      const re = new RegExp(/([\d\w]+)/, 'g');
      this.sourceText = (this.sourceText  || '').replace(re, (match, g1) => { 
        return this.textCodeListT[g1] || g1 });
    }else{
      const re = new RegExp(/([\d\w]+)/, 'g');
      this.sourceText = (this.sourceText  || '').replace(re, (match, g1) => { 
        return this.degreeCodeListT[g1] || g1 
      });
    }
  }
}
