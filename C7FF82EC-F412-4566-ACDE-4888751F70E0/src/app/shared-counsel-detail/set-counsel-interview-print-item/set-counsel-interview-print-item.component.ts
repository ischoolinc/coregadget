import { Component, OnInit } from '@angular/core';
import { DsaService } from "../../dsa.service";
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-set-counsel-interview-print-item',
  templateUrl: './set-counsel-interview-print-item.component.html',
  styleUrls: ['./set-counsel-interview-print-item.component.css']
})
export class SetCounselInterviewPrintItemComponent implements OnInit {

  isCancel: boolean = true;
  isCheckP1T: boolean = false;
  isCheckP1F: boolean = false;
  isCheckP2T: boolean = false;
  isCheckP2F: boolean = false;

  startDate: string = "";
  endDate: string = "";
  // [attr.href]="'content.htm#/(simple-page:simple-page/print/counsel-interview-doc/'+currentStudent.StudentID+')'">

  constructor(private dsaService: DsaService,
    private router: Router) { }
  studentID: string = "";

  cancel() {
    this.isCancel = true;
    this.startDate = this.endDate = '';
    this.isCheckP1T = this.isCheckP1F = this.isCheckP2T = this.isCheckP2F = false;
    $("#setCounselInterviewdocPrintItem").modal("hide");
  }

  print() {

    let chkDataPass: boolean = true;

    if (!moment(this.startDate).isValid() || !moment(this.endDate).isValid()) {
      alert("開始或結束日期錯誤！");
      chkDataPass = false;
    }

    if (moment(this.startDate).isValid() && moment(this.endDate).isValid()) {
      if (moment(this.startDate) > moment(this.endDate)) {
        alert("開始日期需要小於結束日期！");
        chkDataPass = false;
      }
    }

    if (this.isCheckP1T == false && this.isCheckP1F == false && this.isCheckP2T == false && this.isCheckP2F == false) {
      alert("只少勾選1個公開或不公開!");
      chkDataPass = false;
    }

    let StartDate = this.startDate.replace('T', ' ');
    let EndDate = this.endDate.replace('T', ' ');

    if (chkDataPass) {
      this.isCancel = false;

      let a = { studentID: this.studentID, StartDate: StartDate, EndDate: EndDate, P1T: this.isCheckP1T, P1F: this.isCheckP1F, P2T: this.isCheckP2T, P2F: this.isCheckP2F }
      let x = JSON.stringify(a);
      window.open('content.htm#/(simple-page:simple-page/print/counsel-interview-doc/' + x + ')', '_blank');
    }

  }
  ngOnInit() {
   
  }

  // 設定選項
  setCheckItem(item: string) {
    if (item === '一級輔導公開') {
      this.isCheckP1T = !this.isCheckP1T;
    }
    if (item === '一級輔導不公開') {
      this.isCheckP1F = !this.isCheckP1F;
    }

    if (item === '二級輔導公開') {
      this.isCheckP2T = !this.isCheckP2T;
    }
    if (item === '二級輔導不公開') {
      this.isCheckP2F = !this.isCheckP2F;
    }
  }

}
