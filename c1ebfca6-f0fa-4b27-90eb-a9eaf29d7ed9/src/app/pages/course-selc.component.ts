import { Component, OnInit } from '@angular/core';
import { CourseObj, ClassObj } from '../service/dsa.service';

@Component({
  selector: 'gd-course-selc',
  templateUrl: './course-selc.component.html',
  styles: []
})
export class CourseSelcComponent implements OnInit {

  jClass: ClassObj; // 課程或班級。

  constructor() { }

  ngOnInit() {


  }

}
