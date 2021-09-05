import { Component, Input, OnInit } from '@angular/core';
import { PeriodRec } from '../core/data/my-course';

@Component({
  selector: 'app-badge-period',
  templateUrl: './badge-period.component.html',
  styleUrls: ['./badge-period.component.scss']
})
export class BadgePeriodComponent implements OnInit {

  @Input() data?: PeriodRec;
  @Input() showWeekday = false;

  constructor() { }

  ngOnInit(): void {
  }

}
