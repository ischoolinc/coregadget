import { GadgetService } from './core/gadget.service';
import { Component, OnInit } from '@angular/core';
import { Jsonx } from '@1campus/jsonx';
import { Store } from '@ngxs/store';
import { GetAllPlans } from './state/plan.action';
import { take } from 'rxjs/operators';

export interface Section {
  name: string;
  updated: Date;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isLoading: boolean = false;

  constructor(
    private gadget: GadgetService,
    private store: Store
  ) { }

  
  notes: Section[] = [
    {
      name: 'Vacation Itinerary',
      updated: new Date('2/20/16'),
    },
    {
      name: 'Kitchen Remodel',
      updated: new Date('1/18/16'),
    }
  ];
  schoolInfo: any;

  async ngOnInit() {

    const contract = await this.gadget.getContract('basic.public');

    // 呼叫 service。
    this.schoolInfo = await contract.send('beta.GetSystemConfig', {
      Name: '學校資訊'
    });

    const jx = Jsonx.parse('<root><child val="1">text</child></root>');
    // console.log(jx.child('root', 'child').text);
    // console.log(jx.child('root', 'child').getAttr('val'));
    jx.child('root', 'child', 'newChild').text = 'add new';

    // 新增 element。
    const nc = jx.child('root').children('child').new();
    nc.setAttr('name', '123');
    nc.text = 'new text';
    // console.log(jx.toXml());

    this.isLoading = true;
    this.store.dispatch(new GetAllPlans()).pipe(
      take(1)
    ).subscribe(() => {
      this.isLoading = false;
    });
  }

}
