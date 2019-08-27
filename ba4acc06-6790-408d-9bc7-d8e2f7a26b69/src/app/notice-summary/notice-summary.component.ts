import { Component, OnInit, ViewChild, ElementRef, TemplateRef, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatButtonToggleChange } from '@angular/material';
// import { Chart } from 'chart.js';
import { map, takeUntil, startWith, debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { NavigationItem } from '../header/header.service';
import { NavigationItemDirective } from '../header/navigation-item.directive';
import { BaseService } from '../core';
import { NoticeDetailComponent } from './notice-detail/notice-detail.component';
import { NoticesCacheService } from '../notice-main/notices-cache.service';
import { StudentReadStatusRecord, TeacherReadStatusRecord, NoticeRecord, InstallStatusInfo, ReadStatusRecord } from '../data';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-notice-summary',
  templateUrl: './notice-summary.component.html',
  styleUrls: ['./notice-summary.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NoticeSummaryComponent implements OnInit, NavigationItem, OnDestroy {

  title = '簡訊查詢';
  link = ['/notice_summary'];
  parent: NavigationItem;

  loading = true;

  noticeId: string;
  notice: NoticeRecord;
  sourceRecords: ReadStatusRecord[] = [];
  records: TeacherReadStatusRecord[] | StudentReadStatusRecord[];
  visits: InstallStatusInfo;
  count: {
    readCount: number,
    unreadCount: number,
    total: number,
    percentage: number,
  };

  readState: 'ALL' | 'READ' | 'UNREAD' = 'ALL';
  dispose$ = new Subject();
  placeHolder: string;
  searchControl = new FormControl();

  constructor(
    nav: NavigationItemDirective,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private baseSrv: BaseService,
    private ncSrv: NoticesCacheService
  ) {
    this.parent = nav.appNavigationItem;
  }

  displayPage: TemplateRef<any>;

  // @ViewChild('chart') chart: ElementRef<HTMLCanvasElement>;
  // drawchart: Chart;

  @ViewChild('tplTeacherList') tplTeacherList: TemplateRef<any>;
  @ViewChild('tplStudentList') tplStudentList: TemplateRef<any>;

  ngOnInit() {

    this.route.paramMap.pipe(
      map(v => v.get('id'))
    ).subscribe(async id => {
      this.noticeId = id;
      this.notice = await this.ncSrv.getNotice(id); // 從快取取得完整資料。

      if (this.notice) {
        const readStatus = await this.baseSrv.getReadStatus(id).toPromise();
        this.visits = await this.baseSrv.getInstalledStatus(
          readStatus.Teacher.map(v => v.TeacherId),
          readStatus.Student.map(v => v.StudentId)
        ).toPromise();

        // 統計已讀、未讀總數及百分比
        const curReadStatus = (this.notice.TargetRole === 'TEACHER') ? readStatus.Teacher : readStatus.Student;
        const count = (curReadStatus as Array<ReadStatusRecord>).reduce((acc, cur) => {
          acc.total += 1;
          acc.readCount += (cur.Read === 'true' ? 1 : 0);
          acc.unreadCount += (cur.Read === 'false' ? 1 : 0);
          return acc;
        }, { total: 0, readCount: 0, unreadCount: 0 });

        // 對照 visits。
        if (this.notice.TargetRole === 'TEACHER') {
          for (const tch of readStatus.Teacher) {
            for (const t of this.visits.Teachers.Teacher) {
              if (t.Id === tch.TeacherId) {
                tch.Install = true;
              }
            }
          }
        } else {
          for (const stu of readStatus.Student) {
            for (const s of this.visits.Students.Student) {
              if (s.Id === stu.StudentId) {
                stu.StudentInstall = true;
              }
            }

            for (const p of this.visits.Parents.Parent) {
              if (p.Id === stu.StudentId) {
                stu.ParentInstall = true;
              }
            }
          }
        }

        // this.createChart(count.readCount, count.unreadCount);
        let percentage = (count.readCount) ? (count.readCount * 100) / count.total : 0;
        percentage = this.round(percentage, 2);
        this.count = { ...count, percentage };

        if (this.notice.TargetRole === 'TEACHER') {
          this.sourceRecords = readStatus.Teacher;
          this.records = readStatus.Teacher;
          this.placeHolder = '姓名、暱稱關鍵字';
          this.displayPage = this.tplTeacherList;
        } else {
          this.sourceRecords = readStatus.Student;
          this.records = readStatus.Student;
          this.placeHolder = '姓名、學號關鍵字';
          this.displayPage = this.tplStudentList;
        }
        this.loading = false;

        this.searchControl.valueChanges.pipe(
          debounceTime(300), // 當 300 毫秒沒有新資料時，才進行搜尋
          distinctUntilChanged(), // 當「內容真正有變更」時，才進行搜尋
          map((keyword: string) => {
            if (keyword) {
              this._filterRecords(this.records, keyword, this.readState);
            } else {
              this._filterRecords(this.sourceRecords, keyword, this.readState);
            }
          }),
          startWith([]),
          takeUntil(this.dispose$)
        ).subscribe();
      } else {
        this.router.navigate(['/']);
      }
    });

  }

  ngOnDestroy(): void {
    this.dispose$.next();
  }

  /** 顯示訊息讀取記錄 */
  showReadHistory(target: StudentReadStatusRecord & TeacherReadStatusRecord) {
    const targetId = (this.notice.TargetRole === 'TEACHER') ? target.TeacherId : target.StudentId;

    this.dialog.open(NoticeDetailComponent, {
      data: { targetId, noticeId: this.noticeId, targetType: this.notice.TargetRole },
      width: '400px'
    });
  }

  /** 點選篩選狀態 */
  filterState(e: MatButtonToggleChange) {
    this.readState = e.value;
    this._filterRecords(this.sourceRecords, this.searchControl.value, e.value);
  }

  /** 篩選資料 */
  private _filterRecords(sourceData: ReadStatusRecord[], keyword: string, state: 'ALL' | 'READ' | 'UNREAD') {
    // 先過濾關鍵字，再過濾已讀狀態
    if (keyword) {
      if (this.notice.TargetRole === 'TEACHER') {
        sourceData = (sourceData as TeacherReadStatusRecord[]).filter(v => {
          return (v.TeacherName.indexOf(keyword) !== -1 || v.Nickname.indexOf(keyword) !== -1);
        });
      } else {
        sourceData = (sourceData as StudentReadStatusRecord[]).filter(v => {
          return (v.StudentName.indexOf(keyword) !== -1 || v.StudentNumber.indexOf(keyword) !== -1);
        });
      }
    }
    switch (state) {
      case 'READ':
        sourceData = sourceData.filter(v => v.Read === 'true');
        break;
      case 'UNREAD':
        sourceData = sourceData.filter(v => v.Read !== 'true');
        break;
      default:
        sourceData = sourceData;
    }
    if (this.notice.TargetRole === 'TEACHER') {
      return this.records = sourceData as TeacherReadStatusRecord[];
    } else {
      return this.records = sourceData as StudentReadStatusRecord[];
    }
  }

  /** 數字四捨五入至小數點 */
  private round(val: number, precision: number) {
    return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0));
  }

  // private createChart(readCount: number, unreadCount: number) {
  //   this.drawchart = new Chart(this.chart.nativeElement, {
  //     type: 'horizontalBar',
  //     data: {
  //       labels: ['已讀', '未讀'],
  //       datasets: [{
  //         data: [readCount, unreadCount],
  //         backgroundColor: ['#f79965', '#e87990']
  //       }],
  //     },
  //     options: {
  //       legend: {
  //         display: false
  //       },
  //     }
  //   });
  // }
}
