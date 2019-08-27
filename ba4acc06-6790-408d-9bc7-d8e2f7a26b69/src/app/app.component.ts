import { Component, OnInit } from '@angular/core';
import { BaseService } from './core/base.service';
import { HeaderService } from './header/header.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  rsp: any;

  constructor(
    private baseSrv: BaseService,
    private headersrv: HeaderService
  ) { }

  async ngOnInit() {

    // this.rsp = await this.baseSrv.getMyClass().toPromise();
    // console.log(this.rsp);

    // this.rsp = await this.baseSrv.getMyInfo().toPromise();
    // console.log(this.rsp);

    // this.rsp = (await this.baseSrv.getClassStudentsV2(1446).toPromise());
    // console.log(this.rsp);

    // this.rsp = (await this.baseSrv.pushNotice({
    //   title: '測試訊息',
    //   message: '<div>測試訊息<a href="http://www.google.com.tw">內容</a></div>',
    //   parentVisible: true,
    //   studentVisible: true,
    //   students: [54149, 54150]
    // }).toPromise());
  }

  setNavigation(event) {
    this.headersrv.setNavigation(event);
  }

}
