import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { SportService } from '../service';
import { SportEvent } from '../data';

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styles: [`
    .list-group-item-info.list-group-item-action:hover a {
      color: #cddc39;
    }
    .textHighlight {
      background-color: #bbdefb; color: rgba(0,0,0,.87);
    }
  `]
})
export class ApplyComponent implements OnInit {

  loading: boolean;
  categories: string[] = [];
  currCategory = '全部類別';
  actionEvents: SportEvent[] = [];

  constructor(
    private sportSrv: SportService,
    public snackBar: MatSnackBar) {
  }

  ngOnInit() {

    try {
      this.loading = true;

      this.getSportEvent();
    } catch (err) {
      console.log(err);
      this.openSnackBar('發生錯誤！', '');
    } finally {
      this.loading = false;
    }
  }

  async getSportEvent() {
    const actionEvents = await this.sportSrv.getActionEvents();

    const colCategories = ['全部類別'];
    for (const item of actionEvents) {
      if (colCategories.indexOf(item.category) === -1) colCategories.push(item.category);
    }
    this.categories = colCategories;
    this.actionEvents = actionEvents;
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

}
