import { Component, OnInit, Optional } from '@angular/core';
import { AppComponent } from "../app.component";

@Component({
  selector: 'app-counsel-statistics',
  templateUrl: './counsel-statistics.component.html',
  styleUrls: ['./counsel-statistics.component.css']
})
export class CounselStatisticsComponent implements OnInit {

  constructor(
    @Optional()
    private appComponent: AppComponent) { }

  ngOnInit() {
    if (this.appComponent) this.appComponent.currentComponent = "counsel_statistics";
  }

}
