import { Component, OnInit } from '@angular/core';
import { TeacherService } from './teacher.service';
import { HeaderService } from './header/header.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  rsp: any;

  constructor(
    private teacher: TeacherService,
    private headersrv: HeaderService
  ) { }

  async ngOnInit() {

    // this.rsp = await this.teacher.getMyClass().toPromise();
    // console.log(this.rsp);

    // this.rsp = await this.teacher.getMyInfo().toPromise();
    // console.log(this.rsp);

    // this.rsp = (await this.teacher.getClassStudentsV2(1446).toPromise());
    // console.log(this.rsp);

    // this.rsp = (await this.teacher.pushNotice({
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
