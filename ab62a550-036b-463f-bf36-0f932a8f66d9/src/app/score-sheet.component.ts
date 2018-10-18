import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSnackBar, MatSelectChange, MatDialog } from '@angular/material';

import * as moment from 'moment';

import { BasicService } from './service/basic.service';
import { TidyService } from './service/tidy.service';

@Component({
  selector: 'app-score-sheet',
  templateUrl: './score-sheet.component.html',
  styles: [],
})
export class ScoreSheetComponent implements OnInit {

  loading: boolean;
  date = new FormControl(moment());
  currDate: string; // YYYY-MM-DD
  maxDate = new Date();
  scoreSheetList = [];
  classList = [];
  currClass:any = {};
  dayScoreSheet = [];
  previewImgUrl = '';

  constructor(
    private basicSrv: BasicService,
    private tidySrv: TidyService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog) {
  }

  @ViewChild('previewImage') previewImage: TemplateRef<any>

  async ngOnInit() {

    try {
      this.loading = true;

      // 取得今天日期，並設定為最大日期
      const rspToday = await this.basicSrv.getToday();
      this.date = new FormControl(moment(rspToday, 'YYYY-MM-DD'));
      this.currDate = moment(rspToday, 'YYYY-MM-DD').format('YYYY-MM-DD');
      this.maxDate = moment(rspToday, 'YYYY-MM-DD').toDate();

      // 取得我的所有班級
      const rspClass = await this.basicSrv.getMyClass();
      this.classList = rspClass;
      this.currClass = rspClass[0];

      // 取得班級評分
      if (this.currClass.ClassId) {
        this.getScoreSheet(this.currDate, this.currClass.ClassId);
      }
    } catch (err) {
      this.openSnackBar('發生錯誤', '');
    } finally {
      this.loading = false;
    }

  }

  /**
   * 取得日評分
   */
  getScoreSheet = async (date: string, class_id: string) => {
    try {
      this.loading = true;

      this.dayScoreSheet = await this.tidySrv.getMyScoreSheetByDate(date, class_id);
    } catch (error) {
      this.openSnackBar('發生錯誤', '');
    } finally {
      this.loading = false;
    }
  }


  /**
   * 選擇班級的事件
   * @param event 事件
   */
  changeClass(event: MatSelectChange) {
    if (event.value) {
      this.currClass = event.value;
      if (this.currDate) {
        this.getScoreSheet(this.currDate, this.currClass.ClassId);
      } else {
        this.openSnackBar('日期格式錯誤！', '');
      }
    } else {
      this.openSnackBar('未指定班級！', '');

    }
  }

  /**
   * 選擇日期的事件
   * @param event 事件
   */
  addEvent(event: MatDatepickerInputEvent<Date>) {
    if (event.value.toString()) {
      this.currDate = moment(event.value).format('YYYY-MM-DD');
      const classId = this.currClass && this.currClass.ClassId;
      if (classId) {
        this.getScoreSheet(this.currDate, classId);
      } else {
        this.openSnackBar('未指定班級！', '');
      }
    } else {
      this.openSnackBar('日期格式錯誤！', '');
    }
  }

  /**
   * 頁面下方的 SnackBar
   * @param message 訊息文字
   * @param action 按鈕文字
   */
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  /**
   * 顯示圖片
   */
  openImage(url) {
    this.previewImgUrl = url;
    this.dialog.open(this.previewImage, {
      maxHeight: '85vh'
    });
  }
}
