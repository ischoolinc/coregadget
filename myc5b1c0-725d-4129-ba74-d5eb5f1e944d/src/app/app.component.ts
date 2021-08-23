import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { LoginService } from './core/login.service';
import { DSAService } from './dsutil-ng/dsa.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'mycourse';

  constructor(
    private http: HttpClient,
    private dsa: DSAService,
    private login: LoginService
  ) {}

  async ngOnInit() {
    this.http.get('/service/gadget/selected_context').subscribe(console.log);

    const contract = await this.dsa.getConnection('demo.h.cynthia.chen', '1campus.mobile.v2.guest');
    const rsp = await contract?.send('GetModuleConfig');
    console.log(rsp?.toXml());

    this.login.getMyInfo().subscribe(console.log);
    this.login.getAccessToken().subscribe(console.log);
  }
}
