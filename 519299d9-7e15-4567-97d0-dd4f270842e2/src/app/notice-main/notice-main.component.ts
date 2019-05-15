import { Component, OnInit } from '@angular/core';
import { NavigationItemDirective } from '../header/navigation-item.directive';
import { NavigationItem } from '../header/header.service';
import { TeacherService, NoticeSummaryRecord } from '../teacher.service';
import * as moment from 'moment';

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
    private teacher: TeacherService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.teacher.getNotices().pipe(
    ).subscribe(notices => {

      this.notices = notices
        .sort((x, y) => +y.PostTime - +x.PostTime)
        .map<NoticeSummaryRecord>(notice => {
          return {
            ...notice,
            Message: this.generateHtmlPreview(notice.Message),
            PostTime: this.formatDate(notice.PostTime)
          };
        });

      this.loading = false;
    });
  }

  private formatDate(timeMillisecond: string): any {
    return moment(+timeMillisecond).format('YYYY/MM/DD');
  }

  private generateHtmlPreview(htmlStr: string) {
    const maxLen = 120;
    const div = document.createElement("div");
    div.innerHTML = htmlStr;
    const previewText =  div.textContent || div.innerText || "";

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
