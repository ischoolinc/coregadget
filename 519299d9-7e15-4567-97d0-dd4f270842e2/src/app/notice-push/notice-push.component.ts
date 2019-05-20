import { Component, OnInit } from '@angular/core';
import { NavigationItem } from '../header/header.service';
import { NavigationItemDirective } from '../header/navigation-item.directive';
import {MatDialog, MatSnackBar} from '@angular/material';
import { ChooserComponent } from '../chooser/chooser.component';
import { SelectionResult } from '../chooser/selection-result';
import { TeacherService } from '../teacher.service';
import { flatten } from 'lodash';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notice-push',
  templateUrl: './notice-push.component.html',
  styleUrls: ['./notice-push.component.scss']
})
export class NoticePushComponent implements OnInit, NavigationItem {

  title = "新增簡訊";
  link = ['/notice_push'];
  parent: NavigationItem;

  receivers: SelectionResult[] = [];

  receiverType: '學生與家長' | '只有學生' | '只有家長' = '學生與家長';

  // smssender: string;
  smstitle: string;
  smscontent: string;

  constructor(
    nav: NavigationItemDirective,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private teacher: TeacherService,
    private router: Router
  ) {
    this.parent = nav.appNavigationItem;
  }

  async ngOnInit() {
  }

  async chooser() {

    const ref = this.dialog.open<ChooserComponent, {}, SelectionResult[]>(ChooserComponent, {
      width: '80%',
      disableClose: false,
    });

    const result = await ref.afterClosed().toPromise();

    if (result) {
      this.receivers = this.receivers.concat(result);
    }

  }

  async sendSelf() {
    const user = await this.teacher.getUserInfo().toPromise();

    this.snackbar.open(user.userName, "立即傳送", {
      duration: 5000,
    }).onAction()
    .subscribe(() => {
      this.teacher.pushNoticeSelf(this.smstitle, this.smscontent)
        .subscribe(rsp => {
          this.snackbar.open(`傳送結果：${rsp.postResult}`, null, { duration: 5000 });
        }, err => {
          this.snackbar.open('傳送失敗。', null, { duration: 5000 });
        });
    });
  }

  sendMessage() {

    if (this.receivers.length <= 0) {
      this.snackbar.open('請選擇收件者。', null, { duration: 5000 });
      return;
    }

    if (!this.smstitle) {
      this.snackbar.open('請輸入「簡訊標題」。', null, { duration: 5000 });
      return;
    }

    if (!this.smscontent) {
      this.snackbar.open('請輸入「簡訊內容」。', null, { duration: 5000 });
      return;
    }

    this.snackbar.open('確定傳送訊息？', '立即傳送', {
      duration: 5000
    }).onAction()
    .subscribe(async () => {

      const nestArray = this.receivers.map(r => r.IdList);
      const flatArray = flatten(nestArray);

      const result = await this.teacher.pushNotice({
        title: this.smstitle,
        message: this.smscontent,
        parentVisible: ['學生與家長', '只有家長'].indexOf(this.receiverType) >= 0,
        studentVisible: ['學生與家長', '只有學生'].indexOf(this.receiverType) >= 0,
        students: flatArray
      }).toPromise();

      const status = result.postResult;

      if (status === 'OK') {
        this.router.navigate(['/']);
      } else {
        this.snackbar.open('傳送失敗。', null, { duration: 5000 });
      }
    });
  }
}
