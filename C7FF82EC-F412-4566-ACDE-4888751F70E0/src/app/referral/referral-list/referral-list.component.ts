import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-referral-list',
  templateUrl: './referral-list.component.html',
  styleUrls: ['./referral-list.component.css']
})
export class ReferralListComponent implements OnInit {

 _data;

  constructor() { }

  ngOnInit() {
  }
  showModalTest(data){
    this._data=data;
  }
}
