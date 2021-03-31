
import { Component, OnInit } from '@angular/core';
import { RollCallRecord,CourseObj,ClassObj , DSAService, CourseConf} from '../service/dsa.service';
import { ActivatedRoute } from '@angular/router';
import { DataCacheService } from '../service/data-cache.service';
import { MatDialog } from '@angular/material';
import { PeriodChooserComponent } from '../modal/period-chooser.component';




@Component({
    selector: 'gd-course-selc',
    templateUrl: './course-selc.component.html',
    styles: []
  })
  export class CourseSelcComponent implements OnInit {

    jClass:ClassObj;//班級或課程
    className:string;
    today:string;

    constructor(
        private dsa:DSAService,
        private route:ActivatedRoute,
        private cache:DataCacheService,
        private dialog :MatDialog
        ){
       //select class     
        
        this.jClass=cache.selectedClass;
        this.className=this.jClass.ClassName;
        console.log(this.jClass);
    }
    async ngOnInit() {
        //取得今天
        this.today = await this.dsa.getToday();
      }

    async openPicker(course:RollCallRecord)
    {
        //console.log(course);
        this.dialog.open(PeriodChooserComponent, {
            data: { course: course },
          });
    } 
  }