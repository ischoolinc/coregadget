import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavigationItem } from '../header/header.service';
import { NavigationItemDirective } from '../header/navigation-item.directive';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { TeacherService, NoticeReadStatusRecord, InstallStatusInfo, NoticeSummaryRecord } from '../teacher.service';
import { Chart } from 'chart.js';
import { MatDialog } from '@angular/material';
import { NoticeDetailComponent } from './notice-detail/notice-detail.component';
import { NoticesCacheService } from '../notice-main/notices-cache.service';

@Component({
  selector: 'app-notice-summary',
  templateUrl: './notice-summary.component.html',
  styleUrls: ['./notice-summary.component.scss'],
})
export class NoticeSummaryComponent implements OnInit, NavigationItem {

  title = "簡訊查詢";
  link = ['/notice_summary'];
  parent: NavigationItem;

  students: NoticeReadStatusRecord[];

  loading = true;

  visits: InstallStatusInfo;

  notice: NoticeSummaryRecord;

  noticeId: string;

  constructor(
    nav: NavigationItemDirective,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private teacher: TeacherService,
    private nc: NoticesCacheService
  ) {
    this.parent = nav.appNavigationItem;
  }

  @ViewChild('chart') chart: ElementRef<HTMLCanvasElement>;

  drawchart: Chart;

  ngOnInit() {

    this.route.paramMap.pipe(
      map(v => v.get("id"))
    ).subscribe(async id => {
      this.noticeId = id;
      this.notice = await this.nc.getNotice(id); // 從快取取得完整資料。

      const studs = await this.teacher.getReadStatus(id).toPromise();
      this.visits = await this.teacher.getInstalledStatus(studs.map(v => v.StudentID)).toPromise();

      const count = studs.reduce((acc, cur) => {
        acc.readCount += (cur.Read === 'true' ? 1 : 0);
        acc.unreadCount += (cur.Read === 'false' ? 1 : 0);
        return acc;
      }, {readCount: 0, unreadCount: 0});

      // 對照 visits。
      for (const stu of studs) {
        for (const s of this.visits.Students.Student) {
          if (s.Id === stu.StudentID) {
            stu.StudentInstall = true;
          }
        }

        for (const p of this.visits.Parents.Parent) {
          if (p.Id === stu.StudentID) {
            stu.ParentInstall = true;
          }
        }
      }

      this.createChart(count.readCount, count.unreadCount);
      this.students = studs;
      this.loading = false;
    });

  }

  showReadHistory(stud: NoticeReadStatusRecord) {
    const { StudentID: studentId } = stud;

    this.dialog.open(NoticeDetailComponent, {
      data: { studentId, noticeId: this.noticeId },
      width: '400px'
    });
  }

  private createChart(readCount: number, unreadCount: number) {
    this.drawchart = new Chart(this.chart.nativeElement, {
      type: 'pie',
      data: {
        labels: [
          '已讀',
          '未讀'
        ],
        datasets: [{
          data: [readCount, unreadCount],
          backgroundColor: ['#f79965', '#e87990']
        }],
      },
      options: {
        animation: {
          animateScale: true
        }
      }
    });
  }
}
