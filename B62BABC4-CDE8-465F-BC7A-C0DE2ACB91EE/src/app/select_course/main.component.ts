import { Component, OnInit } from '@angular/core';
import { GadgetService, Contract } from '../gadget.service';
import * as moment from 'moment';
import { Subject } from '../data/subject';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AddDialogComponent } from './add-dialog.component';
import { SCBasicInfo } from '../data/scBasicInfo';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styles: []
})
export class MainComponent implements OnInit {
  loading: boolean = true;
  currentStatus: SCBasicInfo;
  Tooltip = "推算第一輪志願分發狀況\n 1. 自行評估選上的機率\n 2. 避免後面志願選填必定額滿的課程";

  constructor(private route: ActivatedRoute, private gadget: GadgetService, private router: Router, private dialog: MatDialog) { }
  // 取得 contract 連線。
  contract: Contract;

  async ngOnInit() {
    this.contract = await this.gadget.getContract('ischool.course_selection');
    this.getData();
  }

  /**取得選課基本資料 */
  async getData() {
    try {
      this.loading = true;

      // 呼叫 service。
      this.currentStatus = await this.contract.send('GetCurrentStatus');

      /**資料整理 */
      {
        this.currentStatus.StartTime = moment(parseInt(this.currentStatus.StartTime));
        this.currentStatus.EndTime = moment(parseInt(this.currentStatus.EndTime));
  
        if ((this.currentStatus.Mode == "先搶先贏" || this.currentStatus.Mode == "志願序")) {
          this.currentStatus.PS = "" + this.currentStatus.StartTime.format("YYYY/MM/DD HH:mm:ss") + " ~ " + this.currentStatus.EndTime.format("YYYY/MM/DD HH:mm:ss") + " (" + this.currentStatus.Mode + ")";
        }
        else {
          this.currentStatus.PS = "尚未設定選課時間";
        }
        
        this.currentStatus.SubjectType = [].concat(this.currentStatus.SubjectType || []);
        this.currentStatus.SubjectType.forEach(function (subjectType) {
          subjectType.Wish = [].concat(subjectType.Wish || []);
        });
      }
    } catch (err) {
      console.log(err);
      alert("GetCurrentStatus error:\n" + JSON.stringify(err));
    } finally {
      this.loading = false;
    }
  }

  /**顯示選課科目資料 */
  showDialog(subject: Subject, mode: string, countMode: string) {
    // console.log(JSON.stringify(subject));
    const dig = this.dialog.open(AddDialogComponent, {
      data: { subject: subject, mode: mode, countMode: countMode }
    });
  }

  // 先搶先贏
  async selectTakeAwayCourse(subjectType: string) {
    // 將使用者所選課程傳入
    this.router.navigate(['../add-task-away', subjectType], {
      relativeTo: this.route
    });
  }

  // 志願序
  async selectWishCourse(subjectType: string) {
    // 將使用者所選課程傳入
    this.router.navigate(['../add-wish', subjectType], {
      relativeTo: this.route
    });
  }

  /**取得科目級別 */
  getLevel(subject: Subject) {
    switch (subject.Level) {
      case "":
        return "";
      case "1":
        return " I";
      case "2":
        return " II";
      case "3":
        return " III";
      case "4":
        return " IV";
      case "5":
        return " V";
      case "6":
        return " VI";
      case "7":
        return " VII";
      case "8":
        return " VIII";
    }
  }
}
