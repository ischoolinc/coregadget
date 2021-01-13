import { GadgetService } from './core/gadget.service';
import { Component, OnInit } from '@angular/core';
import { Jsonx } from '@1campus/jsonx';

export interface Section {
  name: string;
  updated: Date;
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private gadget: GadgetService
  ) { }

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'course_code', 'action'];
  dataSource = ELEMENT_DATA;

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
  }

  test() {
    
  }

}
