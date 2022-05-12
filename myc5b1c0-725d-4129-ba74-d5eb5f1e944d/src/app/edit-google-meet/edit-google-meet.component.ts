import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { AppComponent } from '../app.component';
import { MyCourseRec } from '../core/data/my-course';
import { CustomizeService } from '../core/data/service-conf';
import { Conf } from '../core/states/conf.actions';
import { ServiceConfState } from '../core/states/conf.state';
import { ConfirmDialogService } from '../shared/dialog/confirm-dialog.service';

@Component({
  selector: 'app-edit-google-meet',
  templateUrl: './edit-google-meet.component.html',
  styleUrls: ['./edit-google-meet.component.scss']
})
export class EditGoogleMeetComponent implements OnInit {

  saving = false;
  meetLink = '';
  unSubscribe$ = new Subject();

  @Input() data: { target: MyCourseRec } = { target: {} as MyCourseRec };

  constructor(
    private confirmSrv: ConfirmDialogService,
    private store: Store,
    private parent: AppComponent,
  ) { }

  ngOnInit(): void {
    this.store.select(ServiceConfState.getServiceConf).pipe(
      map(fn => fn(this.data.target.CourseId, 'google_meet'))
      , takeUntil(this.unSubscribe$)
    ).subscribe(v => {
      // 1. 將資料庫的內容記入 this.services
      // 2. 再將資料庫的內容再次記入 this.services.source，儲存時以 source 為主
      // 3. 若 store 有異動，且 this.service 已有值，則將其他服務的編輯狀態、編輯值還原

      const meetConf = JSON.parse(JSON.stringify(v?.conf || {}));

      this.meetLink = meetConf.link;

    });
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next();
  }

  async doSave() {
    if (this.saving) { return; }

    try {
      this.saving = true;
      await this.save();
    } catch (error) {
      console.log(error);
    } finally {
      this.saving = false;
    }
  }

  async save() {
    await this.store.dispatch(new Conf.SetConf({
      course_id: this.data.target.CourseId,
      service_id: 'google_meet',
      conf: { link: this.meetLink },
    })).toPromise();
    this.parent.manageProcessState = 301;
  }
}
