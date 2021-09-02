import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { map } from 'rxjs/operators';
import { MyCourseRec } from '../core/data/my-course';
import { CustomizeService } from '../core/data/service-conf';
import { Conf } from '../core/states/conf.actions';
import { ServiceConfState } from '../core/states/conf.state';
import { ConfirmDialogService } from '../shared/dialog/confirm-dialog.service';

@Component({
  selector: 'app-customize-service-manage',
  templateUrl: './customize-service-manage.component.html',
  styleUrls: ['./customize-service-manage.component.scss']
})
export class CustomizeServiceManageComponent implements OnInit {

  saving = false;
  curCSTab = 'editlink';
  services: CustomizeService[] = [];
  newTitle = '';
  newLink = '';

  @Input() data: { target: MyCourseRec } = { target: {} as MyCourseRec };

  constructor(
    private confirmSrv: ConfirmDialogService,
    private store: Store,
  ) { }

  ngOnInit(): void {
    this.store.select(ServiceConfState.getServiceConf).pipe(
      map(fn => fn(this.data.target.CourseId, 'customize'))
    ).subscribe(v => {
      // 1. 將資料庫的內容記入 this.services
      // 2. 再將資料庫的內容再次記入 this.services.source，儲存時以 source 為主
      // 3. 若 store 有異動，且 this.service 已有值，則將其他服務的編輯狀態、編輯值還原

      const services = JSON.parse(JSON.stringify(v?.conf?.services || []));
      services.forEach((item: CustomizeService) => item.source = { ...item });

      if (this.services.length) {
        this.services.forEach((v, idx) => {
          if (v.inEdit) {
            services[idx].inEdit = true;
            services[idx].title = v.title;
            services[idx].link = v.link;
          }
        });
      }
      this.services = services;
    });
  }

  async doSave(item: CustomizeService) {
    if (this.saving) { return; }
    if (!(item.title && item.link)) { return; }

    try {
      this.saving = true;
      item.source!.title = item.title;
      item.source!.link = item.link;
      item.inEdit = false;
      await this.save(this.services);
    } catch (error) {
      console.log(error);
    } finally {
      this.saving = false;
    }
  }

  confirmDel(item: CustomizeService) {
    if (this.saving) { return; }

    this.confirmSrv.show({
      message: '您確定要刪除嗎？',
      accept: () => {
        this.confirmSrv.hide();
        this.delService(item);
      },
    });
  }

  async delService(item: CustomizeService) {
    this.saving = true;
    try {
      this.services = this.services.filter(v => v.title !== item.title)
      await this.save(this.services);
    } catch (error) {
      console.log(error);
    } finally {
      this.saving = false;
    }
  }

  async doAdd() {
    if (!this.newTitle) { return; }
    if (this.saving) { return; }
    const newOrder = Math.max(1, ...this.services.map(v => v.order));

    this.saving = true;
    try {
      const newService: CustomizeService = {
        title: this.newTitle,
        link: this.newLink,
        order: newOrder,
        enabled: true,
        inEdit: false,
      };
      await this.save(this.services.concat([{ ...newService, source: newService }]));
      this.newTitle = '';
      this.newLink = '';
      this.curCSTab = 'editlink';
    } catch (error) {
      console.log(error);
    } finally {
      this.saving = false;
    }
  }

  async toggleEnabledCustomizeService(item: CustomizeService) {
    if (this.saving) { return; }

    this.saving = true;
    try {
      item.source!.enabled = item.enabled;
      await this.save(this.services);
    } catch (error) {
      console.log(error);
    } finally {
      this.saving = false;
    }
  }

  async save(services: CustomizeService[]) {
    const data = services.map(v => { return v.source });
    await this.store.dispatch(new Conf.SetConf({
      course_id: this.data.target.CourseId,
      service_id: 'customize',
      conf: { services: data },
    })).toPromise();
  }
}
