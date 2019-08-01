import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { DsaService } from 'src/app/dsa.service';
import * as moment from 'moment';

@Component({
  selector: 'app-counsel-history',
  templateUrl: './counsel-history.component.html',
  styleUrls: ['./counsel-history.component.css']
})
export class CounselHistoryComponent implements OnInit {

  isLoading = false;
  studentID: string;
  StudentNumber: string;
  SchoolName: string;
  StudentName: string;
  addBlank: number[] = [];
  reportData: any;
  CounselInterview: any[] = [];
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private dsaService: DsaService, ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(
      (params: ParamMap): void => {
        this.studentID = params.get("studentID");
        this.getReportData();
      }
    );
  }

  async getReportData() {
    this.isLoading = true;
    try {
      this.reportData = await this.dsaService.send("GetPrintDocumentCounselHistory", {
        StudentID: this.studentID
      });

      if (this.reportData.SchoolName) {
        this.SchoolName = this.reportData.SchoolName;
      }

      if (this.reportData.StudentName) {
        this.StudentName = this.reportData.StudentName;
      }

      if (this.reportData.StudentNumber) {
        this.StudentNumber = this.reportData.StudentNumber;
      }

      this.CounselInterview = [];
      if (this.reportData.CounselInterview) {
        this.CounselInterview = [].concat(this.reportData.CounselInterview || []);
      }

      this.addBlank = [];
      // 判斷加入幾個空白
      let n: number = (20-this.CounselInterview.length);
      if(n > 1)
      {
        for(let i=1; i <=n ;i ++)
        {
          this.addBlank.push(i);
        }
      }

    } catch (error) {
      console.log(error);
    } finally {
      this.isLoading = false;
    }
  }
}
