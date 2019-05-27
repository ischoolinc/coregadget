import { Injectable } from '@angular/core';
import { NoticeSummaryRecord, TeacherService } from '../teacher.service';
import * as moment from 'moment';
import { Util } from '../util';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class NoticesCacheService {

  constructor(
    private teacher: TeacherService
  ) { }

  public notices: NoticeSummaryRecord[] = [];

  public async cacheNotices() {
    const notices = await this.teacher.getNotices().toPromise();

    this.notices = notices
      .sort((x, y) => +y.PostTime - +x.PostTime)
      .map<NoticeSummaryRecord>(notice => {
        return {
          ...notice,
          rawMessage: notice.Message,
          Message: this.generateHtmlPreview(notice.Message),
          PostTime: this.formatDate(notice.PostTime)
        };
      });
  }

  public async getNotice(id: string) {
    if (this.notices.length <= 0) {
      await this.cacheNotices();
    }

    return this.notices.find(n => n.ID === id);
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
}
