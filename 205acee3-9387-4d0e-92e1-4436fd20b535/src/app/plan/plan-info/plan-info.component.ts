import { Component, Input, OnInit } from '@angular/core';
import { SubjectRec } from 'src/app/data';

@Component({
  selector: 'app-plan-info',
  templateUrl: './plan-info.component.html',
  styleUrls: ['./plan-info.component.scss']
})
export class PlanInfoComponent implements OnInit {

  @Input() dataSource: SubjectRec[] = [];
  @Input() columns: string[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
