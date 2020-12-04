import { Component, InjectionToken, OnInit } from '@angular/core';

export const ByClassStudentComponent_INJECT_DATA = new InjectionToken<any>('app-by-classstudent-inject-data');

@Component({
  selector: 'app-by-class-student',
  templateUrl: './by-class-student.component.html',
  styleUrls: ['./by-class-student.component.scss']
})
export class ByClassStudentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
