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

    const contract = await this.dsa.getConnection('dev.sh_d', 'web3.my_course.v2.public');
    const rsp = await contract?.send('test', { Powerful: 'what???' });
    const rspxml = rsp?.toCompactJson();
    console.log(rspxml);

    this.login.getMyInfo().subscribe(console.log);
    this.login.getAccessToken().subscribe(console.log);
  }
}
