import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSelectChange } from '@angular/material';

import { PublicService } from '../service/public.service';
import { HistoryEvent } from '../data';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent implements OnInit {

  loading: boolean;
  schoolYearList: string[] = [];
  sportEvents: HistoryEvent[] = [];
  categories: string[] = [];

  currYear = '';
  currCategory = '全部類別';

  constructor(
    private publicSrv: PublicService,
    public snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    try {
      this.loading = true;

      this.schoolYearList = await this.publicSrv.getSchoolYearList();
      if (this.schoolYearList.length) {
        this.currYear = this.schoolYearList[0];
        this.getYearEvents(this.currYear);
      }
    } catch (err) {
      console.log(err);
      this.openSnackBar('發生錯誤！', '');
    } finally {
      this.loading = false;
    }
  }

  /**
   * 取得某年度比賽項目
   */
  async getYearEvents(schoolYear) {
    try {
      const sportEvents: HistoryEvent[] = await this.publicSrv.getYearEventHistoricals(schoolYear);

      const colCategories = ['全部類別'];
      for (const item of sportEvents) {
        if (colCategories.indexOf(item.category) === -1) colCategories.push(item.category);
        item.isShowed = false;
      }
      this.categories = colCategories;
      this.sportEvents = sportEvents;

    } catch (err) {
      console.log(err);
      this.openSnackBar('發生錯誤！', '');
    }

  }

  /**
   * 切換學年度
   * @param event 事件
   */
  changeYear(event: MatSelectChange) {
    const schoolYear = event.value;
    this.currYear = schoolYear;
    this.getYearEvents(schoolYear);
  }

  /**
   * 切換類別
   * @param event 事件
   */
  changeCategory(event: MatSelectChange) {
    const currCategory = event.value;
    this.currCategory = currCategory;
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
   * 切換顯示/隱藏名次
   * @param item 競賽項目
   */
  toggleShowed(item) {
    item.isShowed = !item.isShowed;
  }
}
