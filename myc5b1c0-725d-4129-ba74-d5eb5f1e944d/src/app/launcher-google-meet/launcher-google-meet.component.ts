import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { MyCourseRec } from '../core/data/my-course';
import { ServiceConfState } from '../core/states/conf.state';

@Component({
  selector: 'app-launcher-google-meet',
  templateUrl: './launcher-google-meet.component.html',
  styleUrls: ['./launcher-google-meet.component.scss']
})
export class LauncherGoogleMeetComponent implements OnInit {

  meetLink = undefined;
  unSubscribe$ = new Subject();

  @Input() roleName = '';
  @Input() course: MyCourseRec = {} as MyCourseRec;

  constructor(
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

      this.meetLink = meetConf.link;

    });
  }

  getMeetLink() {
    return this.meetLink;
  }
}
