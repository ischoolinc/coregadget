import { Injectable } from '@angular/core';
import { BaseService } from '../core';
import * as moment from 'moment';
import { Util } from '../util';
import { NoticeRecord } from '../data';

@Injectable({
  providedIn: 'root'
})
export class NoticesCacheService {

  constructor(
    private baseSrv: BaseService
  ) { }

  public notices: NoticeRecord[] = [];
  public noticeLength = 0;

  public async cacheNotices(limit: number = 30, offset: number = 0) {
    const noticeList = await this.baseSrv.getNotices(limit, offset).toPromise();

    this.noticeLength = noticeList.Count;
    this.notices = noticeList.Notices
      .map<NoticeRecord>(notice => {
        return {
          ...notice,
          rawMessage: notice.Message,
          Message: this.generateHtmlPreview(notice.Message),
          PostTime: this.formatDate(notice.PostTime)
        };
      });
  }

  public getLength() {
    return this.noticeLength;
  }

  public getNotice(id: string) {
    return this.notices.find(n => n.Id === id);
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
