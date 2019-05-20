import { Component, OnInit } from '@angular/core';

import { BasicService } from './service/basic.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent implements OnInit {

  systemPosition: string;

  loading: boolean;

  currTab = 'score_sheet';

  constructor(
    private basicSrv: BasicService) {
      // @ts-ignore
      if (gadget.params && gadget.params.system_position === 'teacher') {
        this.systemPosition = 'teacher';
      } else {
        this.systemPosition = 'student';
      }
      // 設定身份至 service 中
      this.basicSrv.systemPosition = this.systemPosition;
  }

  async ngOnInit() {
  }

}
