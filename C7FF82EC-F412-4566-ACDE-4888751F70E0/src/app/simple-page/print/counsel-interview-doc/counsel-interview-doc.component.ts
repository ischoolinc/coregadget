import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { DsaService } from 'src/app/dsa.service';
import * as moment from 'moment';
import { VirtualTimeScheduler } from 'rxjs';

@Component({
  selector: 'app-counsel-interview-doc',
  templateUrl: './counsel-interview-doc.component.html',
  styleUrls: ['./counsel-interview-doc.component.css']
})
export class CounselInterviewDocComponent implements OnInit {
  isLoading = false;
  studentID: string;
  StudentNumber: string;
  SchoolName: string;
  StudentName: string;
  addBlank: number[] = [];
  isPrivate: string = 't';
  startDate: string = "";
  endDate: string = "";
  reportData: any;
  isDisplayCounsel: boolean = false;
  isDisplayCase: boolean = false;

  // 一級輔導
  CounselInterview: any[] = [];

  // 二級輔導
  CaseInterview: any[] = [];

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private dsaService: DsaService,) { }



  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(
      (params: ParamMap): void => {
        this.studentID = params.get("studentID");
        this.startDate = params.get("sd");
        this.endDate = params.get("ed");

        if (params.get("co") === '12') {
          this.isDisplayCase = true;
          this.isDisplayCounsel = true;
        } else if (params.get("co") === '1') {
          this.isDisplayCase = false;
          this.isDisplayCounsel = true;
        } else if (params.get("co") === '2') {
          this.isDisplayCase = true;
          this.isDisplayCounsel = false;
        } else {
          this.isDisplayCase = false;
          this.isDisplayCounsel = false;
        }

        if (params.get("p") === 'f') {
          this.isPrivate= 't';
        } else
          this.isPrivate = 'f';



        this.getReportData();
      }
    );
  }

  // 取得報表資料
  async getReportData() {
    this.isLoading = true;
    try {
      this.reportData = await this.dsaService.send("GetPrintCounselData12ByStudentID", {
        StudentID: this.studentID,
        StartDate: this.startDate,
        EndDate: this.endDate
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

      // 一級輔導
      this.CounselInterview = [];
      if (this.reportData.CounselInterview) {
        this.CounselInterview = [].concat(this.reportData.CounselInterview || []);
      }

      // 二級輔導
      this.CaseInterview = [];
      if (this.reportData.CaseInterview) {
        this.CaseInterview = [].concat(this.reportData.CaseInterview || []);
      }

      this.addBlank = [];
      // 判斷加入幾個空白
      if (this.CounselInterview.length > 0) {
        let n: number = (20 - this.CounselInterview.length);
        if (n > 1) {
          for (let i = 1; i <= n; i++) {
            this.addBlank.push(i);
          }
        }
      } else {
        for (let i = 1; i <= 20; i++) {
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
