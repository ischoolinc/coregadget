import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { AccessTokenCredential, DSA_ACCESSTOKEN } from './dsutil-ng/credential_provider';
import { DSAService } from './dsutil-ng/dsa.service';
import { RootAccessTokenService } from './root-access-token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'mycourse';

  constructor(
    private http: HttpClient,
    private dsa: DSAService
  ) {}

  async ngOnInit() {
    this.http.get('/auth/getMyInfo').subscribe(console.log);
    this.http.get('/service/gadget/selected_context').subscribe(console.log);

    const contract = await this.dsa.getConnection('demo.h.cynthia.chen', '1campus.mobile.v2.guest');

    console.log(contract);
    
    const rsp = await contract?.send('GetModuleConfig');
    console.log(rsp?.toXml());
  }
}
