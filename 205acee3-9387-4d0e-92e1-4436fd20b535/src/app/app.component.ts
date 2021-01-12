import { Component, OnInit } from '@angular/core';
import { Jsonx } from '@1campus/jsonx';

export interface Section {
  name: string;
  updated: Date;
}

export interface Food {
  value: string;
  viewValue: string;
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
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

  foods: Food[] = [
    {value: 'steak-0', viewValue: '107'},
    {value: 'pizza-1', viewValue: '108'},
    {value: 'tacos-2', viewValue: '109'},
    {value: 'tacos-3', viewValue: '不分學年度'}
  ];

  typesOfShoes: string[] = [
    '資料處理科學程',
    '應用外語科日文組課程規劃',
    '設計科技學程不分班群',
    '學術自然學程不分班群',
    '應用英語學程不分班群'];

    ngOnInit(): void {
      const jx = Jsonx.parse('<root><child val="1">text</child></root>');

      console.log(jx.child('root', 'child').text);
      console.log(jx.child('root', 'child').getAttr('val'));

      jx.child('root', 'child', 'newChild').text = 'add new';

      // 新增 element。
      const nc = jx.child('root').children('child').new();
      nc.setAttr('name', '123');
      nc.text = 'new text';

      console.log(jx.toXml());
    }

}
