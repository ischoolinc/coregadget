import { Component, OnInit } from '@angular/core';
import { NavigationItemDirective } from '../header/navigation-item.directive';
import { NavigationItem } from '../header/header.service';
import { TeacherService, NoticeSummaryRecord } from '../teacher.service';
import * as moment from 'moment';
import { Util } from '../util';
import { NoticesCacheService } from './notices-cache.service';

@Component({
  selector: 'app-notice-main',
  templateUrl: './notice-main.component.html',
  styleUrls: ['./notice-main.component.scss']
})
export class NoticeMainComponent implements OnInit, NavigationItem {

  loading = true;

  notices: NoticeSummaryRecord[];

  constructor(
    private nav: NavigationItemDirective,
    private teacher: TeacherService,
    private nc: NoticesCacheService
  ) { }

  async ngOnInit() {
    this.loading = true;
    await this.nc.cacheNotices();
    this.notices = this.nc.notices;
    this.loading = false;
  }

  private formatDate(timeMillisecond: string): any {
    return moment(+timeMillisecond).format('YYYY/MM/DD');
  }

  private generateHtmlPreview(htmlStr: string) {
    const maxLen = 120;
    const previewText =  Util.trimHtml(htmlStr);

    if (previewText.length > maxLen) {
      return `${previewText.substr(0, 120)}...`;
    } else {
      return previewText;
    }
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

}
