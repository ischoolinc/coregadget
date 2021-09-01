import { Component, OnInit } from '@angular/core';
import { ConfirmDialogService } from '../shared/dialog/confirm-dialog.service';

@Component({
  selector: 'app-customize-service-manage',
  templateUrl: './customize-service-manage.component.html',
  styleUrls: ['./customize-service-manage.component.scss']
})
export class CustomizeServiceManageComponent implements OnInit {

  saving = false;
  curCSTab = 'editlink';
  services = [
    { title: 'Google', link: 'https://www.google.com/', order: 1, enabled: true, inEdit: false },
    { title: 'Material', link: 'https://material.angular.io/', order: 2, enabled: true, inEdit: false },
    { title: 'IThome', link: 'https://www.ithome.com.tw', order: 3, enabled: true, inEdit: false },
    { title: 'PCHome', link: 'https://24.pchome.com.tw', order: 4, enabled: true, inEdit: false }
  ];
  newTitle = '';
  newLink = '';

  constructor(
    private confirmSrv: ConfirmDialogService,
  ) { }

  ngOnInit(): void {
  }

  doSave(item: any) {
    item.inEdit = false;
  }

  doDel(item: any) {
    if (this.saving) { return; }

    this.confirmSrv.show({
      message: '您確定要刪除嗎？',
      accept: () => {
        this.confirmSrv.hide();
        this.delService(item);
      },
    });
  }

  delService(item: any) {
    this.services = this.services.filter(v => v.title !== item.title);

    this.saving = true;
    try {

    } catch (error) {

    } finally {
      this.saving = false;
    }
  }

  doAdd() {
    if (!this.newTitle) { return; }
    if (this.saving) { return; }
    const newOrder = Math.max(1, ...this.services.map(v => v.order));

    this.saving = true;
    try {
      this.services.push({
        title: this.newTitle,
        link: this.newLink,
        order: newOrder,
        enabled: true,
        inEdit: false,
      });
      this.newTitle = '';
      this.newLink = '';
    } catch (error) {

    } finally {
      this.saving = false;
    }
  }
}
