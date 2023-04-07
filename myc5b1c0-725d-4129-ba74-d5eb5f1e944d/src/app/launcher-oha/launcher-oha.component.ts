import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { MyCourseRec } from '../core/data/my-course';
import { LoginService } from '../core/login.service';
import { ServiceConfState } from '../core/states/conf.state';

@Component({
  selector: 'app-launcher-oha',
  templateUrl: './launcher-oha.component.html',
  styleUrls: ['./launcher-oha.component.scss']
})
export class LauncherOhaComponent implements OnInit, OnDestroy {

  meetLink: string | undefined = undefined;
  unSubscribe$ = new Subject();

  @Input() dsns = '';
  @Input() roleName = '';
  @Input() course: MyCourseRec = {} as MyCourseRec;

  // 改成「https://us-central1-classroom-1campus.cloudfunctions.net/ohaSSOUri」試試...
  #classroom_url = 'https://oha.1campus.net';

  constructor(
    private login: LoginService,
    private store: Store,
  ) { }

  ngOnInit(): void {
    this.store.select(ServiceConfState.getServiceConf).pipe(
      map(fn => fn(this.course.CourseId, 'google_meet'))
      , takeUntil(this.unSubscribe$)
    ).subscribe(v => {
      // 1. 將資料庫的內容記入 this.services
      // 2. 再將資料庫的內容再次記入 this.services.source，儲存時以 source 為主
      // 3. 若 store 有異動，且 this.service 已有值，則將其他服務的編輯狀態、編輯值還原

      const meetConf = JSON.parse(JSON.stringify(v?.conf || {}));

      this.meetLink = encodeURIComponent(meetConf.link || '');

    });
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next();
  }

  classroomUrl(course: MyCourseRec) {
    const target = `${this.#classroom_url}?dsns=${this.dsns}&type=course&uid=${course.CourseId}&role=${this.roleName}&meet=${this.meetLink}`;
    return this.login.getLinkout(target);
  }

}
