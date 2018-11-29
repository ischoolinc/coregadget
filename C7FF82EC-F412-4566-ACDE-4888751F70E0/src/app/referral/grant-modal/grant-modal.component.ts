import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-grant-modal',
  templateUrl: './grant-modal.component.html',
  styleUrls: ['./grant-modal.component.css']
})
export class GrantModalComponent implements OnInit {

  @Input('test') masterName: string;

  constructor() { }

  ngOnInit() {
  }

}
