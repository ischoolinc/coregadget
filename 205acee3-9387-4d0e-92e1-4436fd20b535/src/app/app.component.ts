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

  constructor(
    private store: Store
  ) { }

  async ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.store.dispatch(new GetAllPlans());
  }

}
