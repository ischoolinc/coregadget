import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { TeacherService, ReadLogRecord } from 'src/app/teacher.service';
import * as moment from 'moment';
import { groupBy, forOwn } from 'lodash';

@Component({
  selector: 'app-notice-detail',
  templateUrl: './notice-detail.component.html',
  styleUrls: ['./notice-detail.component.scss']
})
export class NoticeDetailComponent implements OnInit {

  histories: ReadLogRecord[];

  groupby: { rel: string, records: ReadLogRecord[] }[] = [];

  loading = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public args: {studentId: string, noticeId: string},
    private teachersrv: TeacherService
  ) { }

  async ngOnInit() {
    const { noticeId, studentId } = this.args;
    this.histories = await this.teachersrv.getReadHistories(noticeId, studentId).toPromise();

    this.histories.forEach(history => {
      const m = moment(+history.Time);
      history.Time = m.format('YYYY-MM-DD HH:mm') + ` (${this.getWeekday(m)})`;
    });

    // 按照 Relationship 分群組。
    const gs = groupBy(this.histories, h => `${h.Relationship ? h.Relationship : '<未提供稱謂>'}` + (h.Account ? ` - ${h.Account}` : ''));
    forOwn(gs, (v, k) => this.groupby.push({ rel: k, records: v }));

    this.loading = false;
  }

  getWeekday(m: moment.Moment) {
    switch (m.weekday()) {
      case 0: return '週日';
      case 1: return '週一';
      case 2: return '週二';
      case 3: return '週三';
      case 4: return '週四';
      case 5: return '週五';
      case 6: return '週六';
      default: return '週週';
    }
  }
}
