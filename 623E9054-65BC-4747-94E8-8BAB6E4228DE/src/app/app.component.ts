import { Component } from '@angular/core';
import { GadgetService, Contract } from 'src/app/gadget.service';
import { SchoolService } from './school.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'app';
  logoutUrl: string;
  constructor(private gadget: GadgetService,
    public school: SchoolService) {

    this.logoutUrl = gadget.authorizationUrl;
  }
  async logout() {
   
    const contract = await this.gadget.getContract('kcis.parent');
    const rsp = await contract.send('DS.Base.InvalidateSession',{SessionID: contract.getSessionID});
    window.location.replace(this.logoutUrl);
  }
}
