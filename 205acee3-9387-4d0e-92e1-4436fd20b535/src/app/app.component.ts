import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { GetAllPlans } from './state/plan.action';

export interface Section {
  name: string;
  updated: Date;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  isLoading: boolean = false;

  constructor(
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

  ngOnInit() {
    // const contract = await this.gadget.getContract('basic.public');

    // // 呼叫 service。
    // this.schoolInfo = await contract.send('beta.GetSystemConfig', {
    //   Name: '學校資訊'
    // });

    // const jx = Jsonx.parse('<root><child val="1">text</child></root>');
    // console.log(jx.child('root', 'child').text);
    // console.log(jx.child('root', 'child').getAttr('val'));
    // jx.child('root', 'child', 'newChild').text = 'add new';

    // // 新增 element。
    // const nc = jx.child('root').children('child').new();
    // nc.setAttr('name', '123');
    // nc.text = 'new text';
    // console.log(jx.toXml());
  }

  ngAfterViewInit(): void {
    this.store.dispatch(new GetAllPlans());
  }

}

const codes = ['108041305H11101A1010101',
'108041305H11101B810FFFF',
'108041305H11101B910EEEE',
'108120401V2130101010101',
'108120401V2130101010102',
'108120401V213010101030B',
'108120401V213010101060Y',
'108120401V2130101010713',
'108120401V2130101010815',
'108120401V2130101020002',
'108120401V2130101020003',
'108120401V2130101030004',
'108120401V2130101030005',
'108120401V213010103A107',
'108120401V213010103A209',
'108120401V2130102010003',
'108120401V2130102010090',
'108120401V2130102020090',
'108120401V2130102020091',
'108120401V2130102030090',
'108120401V2130102030092',
'108120401V2130108D00001',
'108120401V2130109D00001',
'108120401V2130109DD0090',
'108120401V2130109DD0091',
'108120401V2130109DD0092',
'108120401V2130109DD0093',
'108120401V2130109DD0094',
'108120401V2130109DD0095',
'108120401V2130109DD0096',
'108120401V2130109DD0098',
'108120401V2130109DD009B',
'108120401V2130109DD009E',
'108120401V2130109DD009F',
'108120401V2130109DD009H',
'108120401V2130109DD009K',
'108120401V2130109DD009L',
'108120401V2130109DD009Q',];
