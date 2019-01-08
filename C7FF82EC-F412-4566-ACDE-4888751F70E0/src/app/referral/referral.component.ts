import { Component,Optional, OnInit } from '@angular/core';
import { AppComponent } from "../app.component";

@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.css']
})
export class ReferralComponent implements OnInit {

  _data;

  constructor(
        @Optional()
    private appComponent: AppComponent) { }

  ngOnInit() {
    if (this.appComponent) this.appComponent.currentComponent = "referral";
  }
  showModalTest(data){
    this._data=data;
  }
}
