import { Component, InjectionToken, OnInit } from '@angular/core';

export const ByTagStudentComponent_INJECT_DATA = new InjectionToken<any>('app-by-tagstudent-inject-data');

@Component({
  selector: 'app-by-tag-student',
  templateUrl: './by-tag-student.component.html',
  styleUrls: ['./by-tag-student.component.scss']
})
export class ByTagStudentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
