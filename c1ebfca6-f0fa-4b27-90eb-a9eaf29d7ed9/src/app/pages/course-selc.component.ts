import { Component, OnInit } from '@angular/core';
import { CourseObj, ClassObj, DSAService } from '../service/dsa.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'gd-course-selc',
  templateUrl: './course-selc.component.html',
  styles: []
})
export class CourseSelcComponent implements OnInit {

  jClass: ClassObj; // 課程或班級。
  className: string;
  loading: boolean;
  today: string;

  constructor(
    private dsa: DSAService,
    private route: ActivatedRoute) {
    this.today = dsa.getToday();
  }

  ngOnInit() {

    this.Init();

  }

  //開始建置畫面
  Init() {
    this.loading = true;

    this.route.paramMap.subscribe(async pm => {

      this.className = pm.get('classname') as string; // course or class
      console.log(pm.get('classname'));
    });

}

}
