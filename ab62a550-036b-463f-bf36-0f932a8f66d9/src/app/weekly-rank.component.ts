import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { TidyService } from './service/tidy.service';

@Component({
  selector: 'app-weekly-rank',
  templateUrl: './weekly-rank.component.html',
  styleUrls: ['./weekly-rank.component.css'],
})
export class WeeklyRankComponent implements OnInit {

  loading: boolean;
  weeklyRankList = [];
  weekNumbers = [];
  currWeekNumber: any = {};
  weekRank = [];

  constructor(
    private tidySrv: TidyService,
    public snackBar: MatSnackBar) {
  }

  async ngOnInit() {

    try {
      this.loading = true;

      // 取得我的班級有週排名資料的週次
      this.weekNumbers = await this.tidySrv.getMyHasDataWeekly();
      if (this.weekNumbers.length) {
        this.toggleWeekNumber(this.weekNumbers[0]);
      }

    } catch (err) {
      this.openSnackBar('發生錯誤！', '');
    } finally {
      this.loading = false;
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
   *  改變週排名的週次
   */
  toggleWeekNumber = (item) => {
    this.currWeekNumber = item;
    this.getMyWeeklyRank(item.week_number);
  }

  /**
   * 取得週排名
   */
  getMyWeeklyRank = async (week_number: string) => {
    try {
      this.loading = true;

      this.weekRank = await this.tidySrv.getMyWeeklyRank(week_number);
    } catch (error) {
      this.openSnackBar('發生錯誤！', '');
    } finally {
      this.loading = false;
    }
  }
}