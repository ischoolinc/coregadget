import { Component, OnInit } from '@angular/core';
import { DSAService, GradeYearObj, ClassObj } from '../service/dsa.service';
import { AlertService } from '../service/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '../service/config.service';
import { DataCacheService } from '../service/data-cache.service';



@Component({
  selector: 'app-substitute',
  templateUrl: './substitute.component.html',
  styles: []
})
export class SubstituteComponent implements OnInit {
    
  loading :boolean;
  gradeAndCourse;
  today:string; // 今天
 
  gradeYeares:GradeYearObj[];
  yearColumns: string[] = ['GradeYear'];
  courseColumns: string[] = ['Period'];

  constructor(
    private dsa: DSAService,
    private alert: AlertService,
    private config: ConfigService,
    private router: Router,
    private cache: DataCacheService
  ) { 



  }

  async ngOnInit() {
    this.Init();
    this.today = await this.dsa.getToday();

  }

  async Init() {
    this.loading = true;
    try {
      await this.config.ready;

      this.gradeYeares = await this.dsa.getAllCourse();

      // console.log(this.gradeYeares);

    } catch (error) {
      this.alert.json(error);
    } finally {
      this.loading = false;
    }

  }

  openClass(oClass: ClassObj) {

    this.cache.selectedClass = oClass;
    this.router.navigate(['/course']);

  }
}
