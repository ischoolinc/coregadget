import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationItem } from '../header/header.service';
import { NavigationItemDirective } from '../header/navigation-item.directive';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute, RouteReuseStrategy } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ChooserComponent } from '../chooser/chooser.component';
import { SelectionResult } from '../data';
import { BaseService } from '../core/base.service';
import { flatten } from 'lodash';
import { Util } from '../util';
import { ReceiversService } from '../core';
import { Subject, Observable } from 'rxjs';
import { takeUntil, startWith, map } from 'rxjs/operators';
import { AppRoutingCache } from '../app-routing-cache';

@Component({
  selector: 'app-notice-push',
  templateUrl: './notice-push.component.html',
  styleUrls: ['./notice-push.component.scss']
})
export class NoticePushComponent implements OnInit, NavigationItem, OnDestroy {
  dispose$ = new Subject();
  loading = true;
  sending = false;
  target = '';

  title = "新增簡訊";
  link = ['/notice_push'];
  parent: NavigationItem;

  receivers: SelectionResult[] = [];

  receiverType: '' | '學生與家長' | '只有學生' | '只有家長' = '';

  senderControl = new FormControl();
  displaySenders: string[] = []; // 發送單位
  filterDisplaySenders: Observable<string[]>; // 發送單位自動完成清單

  smstitle: string;
  smscontent: string;

  constructor(
    nav: NavigationItemDirective,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private baseSrv: BaseService,
    private router: Router,
    private route: ActivatedRoute,
    private receiversSrv: ReceiversService,
    private routeReuseStrategy: RouteReuseStrategy,
  ) {
    this.parent = nav.appNavigationItem;
  }

  async ngOnInit() {
    this.route.queryParamMap.subscribe(v => {
      if (v.has('to')) {
        const sendTo = v.get('to');
        if (sendTo === 'teacher') {
          this.title = '新增老師簡訊';
          this.receiverType = '';
        }
        if (sendTo === 'student') {
          this.title = '學生及家長簡訊';
          this.receiverType = '學生與家長';
        }
        this.target = sendTo.toUpperCase();
        this.receiversSrv.resetReceivers();
      }
    });

    // 訂閱收件者清單
    this.receiversSrv.receivers$.pipe(
      takeUntil(this.dispose$)
    ).subscribe(receivers => {
      this.receivers = receivers;
    });

    await this.loadDisplaySenders();
  }

  ngOnDestroy(): void {
    this.dispose$.next();
  }

  /** 下載發送單位清單 */
  async loadDisplaySenders() {
    try {
      this.loading = true;
      this.displaySenders = [];
      this.filterDisplaySenders = this.senderControl.valueChanges.pipe(
        startWith(''),
        map((value: string) => this.filterSenders(value))
      );
      this.displaySenders = await this.baseSrv.getDisplaySenders().toPromise();

    } catch (error) {
      this.displaySenders = [];
    } finally {
      this.loading = false;
    }
  }

  /** 篩選自動完成的清單 */
  private filterSenders(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.displaySenders.filter(item => item.toLowerCase().includes(filterValue));
  }

  /** 開啟收件者選擇視窗 */
  async chooser() {
    this.dialog.open<ChooserComponent, {}, SelectionResult[]>(ChooserComponent, {
      data: { target: this.target },
      width: '80%',
      disableClose: false,
    });
  }

  /** 驗證訊息資料 */
  validMessage() {
    // console.log(this.sending, this.myControl.value, this.smstitle, this.smscontent, this.receivers);

    if (this.sending) { return false; }

    if (!this.senderControl.value) {
      this.snackbar.open('請輸入發送單位。', null, { duration: 5000 });
      return false;
    }

    if (!this.smstitle) {
      this.snackbar.open('請輸入「簡訊標題」。', null, { duration: 5000 });
      return false;
    }

    const txt = Util.trimHtml(this.smscontent);
    if (!(txt || '').trim()) {
      this.snackbar.open('請輸入「簡訊內容」。', null, { duration: 5000 });
      return false;
    }

    return true;
  }

  /** 傳送給自己 */
  async sendSelf() {
    console.log(this.smscontent);
    if (!this.validMessage()) { return; }

    const user = await this.baseSrv.getUserInfo().toPromise();

    this.snackbar.open(user.userName, "按我立即傳送", {
      duration: 10000,
    })
    .onAction()
    .subscribe(() => {
      this.sending = true;
      this.baseSrv.pushNoticeSelf(this.smstitle, this.smscontent, this.senderControl.value)
        .subscribe(rsp => {
          this.snackbar.open(`傳送結果：${rsp.postResult}`, null, { duration: 5000 });
        }, (err) => {
          this.snackbar.open('傳送失敗。', null, { duration: 5000 });
        }, () => {
          this.sending = false;
        });
    });
  }

  /** 傳送訊息 */
  sendMessage() {

    if (!this.validMessage()) { return; }

    const nestArray = this.receivers.map(r => r.IdList);
    const flatArray = flatten(nestArray);
    const filterArray = flatArray.filter((v: string, i: number, a: string[]) => v && a.indexOf(v) === i);
    console.log({
      title: this.smstitle,
      message: this.smscontent,
      displaySender: this.senderControl.value,
      parentVisible: ['學生與家長', '只有家長'].indexOf(this.receiverType) >= 0,
      studentVisible: ['學生與家長', '只有學生'].indexOf(this.receiverType) >= 0,
      students: (this.target === 'TEACHER' ? [] : filterArray),
      teachers: (this.target === 'STUDENT' ? [] : filterArray),
    });
    if (filterArray.length <= 0) {
      this.snackbar.open('請選擇收件者。', null, { duration: 5000 });
      return;
    }

    this.snackbar.open('確定傳送訊息？', '按我立即傳送', {
      duration: 10000
    }).onAction()
    .subscribe(() => {
      this.sending = true;
      this.baseSrv.pushNotice({
        title: this.smstitle,
        message: this.smscontent,
        displaySender: this.senderControl.value,
        parentVisible: ['學生與家長', '只有家長'].indexOf(this.receiverType) >= 0,
        studentVisible: ['學生與家長', '只有學生'].indexOf(this.receiverType) >= 0,
        students: (this.target === 'TEACHER' ? [] : filterArray),
        teachers: (this.target === 'STUDENT' ? [] : filterArray),
      }).subscribe(rsp => {
        const status = rsp.postResult;
        if (status === 'OK') {
          // 清除 notice-main 的 cache
          (this.routeReuseStrategy as AppRoutingCache).resetCache();

          this.router.navigate(['/']);
        } else {
          this.snackbar.open('傳送失敗。', null, { duration: 5000 });
        }
      }, (err) => {
        this.snackbar.open('傳送失敗，過程中發生錯誤。', null, { duration: 5000 });
      }, () => {
        this.sending = false;
      });
    });
  }
}
