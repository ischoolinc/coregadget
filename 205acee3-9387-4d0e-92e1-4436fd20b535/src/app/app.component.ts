import { Component } from '@angular/core';

export interface Section {
  name: string;
  updated: Date;
}
interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

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
    {value: 'tacos-2', viewValue: '109'}
  ];

  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
}
