import { DataService } from './../Service/data.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Record } from '../vo';
import { Router } from '@angular/router';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class PrintComponent implements OnInit, AfterViewInit {
  AnnualSignTitle: string [];
  PrintDatas: Record;
  PrintDate: string;
  qiCode: string ;
  SchoolName: string ;
  constructor(
      public  dataService: DataService
    , private router: Router) { }


  async ngOnInit() {
    this.PrintDatas = await this.dataService.getPrintData();
    this.AnnualSignTitle = await this.dataService.getTeacherSign();
    this.PrintDate = await this.dataService.getPrintDate();
    this.qiCode = await this.PrintDatas.uqid;
    this.SchoolName = await this.dataService.getSchoolName();
  }

  async ngAfterViewInit(): Promise<any> {
    this.onDataReady() ;
  }

  onDataReady() {
    setTimeout(() => {
     window.print();
     this.router.navigate(['/']);
    });
  }
}
