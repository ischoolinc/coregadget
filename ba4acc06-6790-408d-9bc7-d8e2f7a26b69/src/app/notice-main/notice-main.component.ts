import { Component, OnInit } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material';
import { NavigationItemDirective } from '../header/navigation-item.directive';
import { NavigationItem } from '../header/header.service';
import { NoticesCacheService } from './notices-cache.service';
import { NoticeRecord, InstallVisitCountRecord } from '../data';
import { BaseService } from '../core';

@Component({
  selector: 'app-notice-main',
  templateUrl: './notice-main.component.html',
  styleUrls: ['./notice-main.component.scss']
})
export class NoticeMainComponent implements OnInit, NavigationItem {
  loading = true;

  notices: NoticeRecord[];
  pageSize = 10;
  noticeLength = 0;

  installCount: InstallVisitCountRecord = {} as InstallVisitCountRecord;

  constructor(
    private nav: NavigationItemDirective,
    private ncSrv: NoticesCacheService,
    private matPaginatorIntl: MatPaginatorIntl,
    private baseSrv: BaseService,
  ) { }

  async ngOnInit() {
    this.matPaginatorIntl.itemsPerPageLabel = '每頁筆數：';
    this.matPaginatorIntl.nextPageLabel = '下一頁';
    this.matPaginatorIntl.previousPageLabel = '上一頁';
    this.getNotices(this.pageSize, 0);
    await this.getInstalledCount();
  }

  async getInstalledCount() {
    this.installCount = await this.baseSrv.getInstalledCount().toPromise();
  }

  async getNotices(limit: number, offset: number) {
    this.loading = true;
    await this.ncSrv.cacheNotices(limit, offset);
    this.notices = this.ncSrv.notices;
    this.noticeLength = this.ncSrv.noticeLength;
    this.loading = false;
  }

  get title(): string {
    return this.nav.appNavigationItem.title;
  }

  get link(): string[] {
    return this.nav.appNavigationItem.link;
  }

  get parent(): NavigationItem {
    return null;
  }

  onPageEvent(e) {
    const offset = (e.pageSize * e.pageIndex);
    this.getNotices(e.pageSize, offset);
  }
}
