import { Component,Optional, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from "../app.component";
import { GrantModalComponent } from "./grant-modal/grant-modal.component";

@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.css']
})
export class ReferralComponent implements OnInit {

  _data;

  @ViewChild('grant_modal') grant_modal:GrantModalComponent; 

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
