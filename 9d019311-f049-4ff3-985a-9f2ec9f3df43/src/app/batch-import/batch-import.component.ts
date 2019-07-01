import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { StudentRecord } from '../data';
import * as Papa from 'papaparse';
import { TargetDataService } from '../service/target-data.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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

  constructor(
    public modalRef: BsModalRef,
    private targetDataSrv: TargetDataService
    ) {
  }

  ngOnInit() {
    // 訂閱資料
    this.targetDataSrv.studenList$.pipe(
      takeUntil(this.dispose$)
    ).subscribe((stuList: StudentRecord[]) => {
      this.studentList = stuList;
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
}
