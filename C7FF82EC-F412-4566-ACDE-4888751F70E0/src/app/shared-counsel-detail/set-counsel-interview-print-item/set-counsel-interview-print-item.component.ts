import { Component, OnInit } from '@angular/core';
import { DsaService } from "../../dsa.service";
import * as moment from 'moment';

@Component({
  selector: 'app-set-counsel-interview-print-item',
  templateUrl: './set-counsel-interview-print-item.component.html',
  styleUrls: ['./set-counsel-interview-print-item.component.css']
})
export class SetCounselInterviewPrintItemComponent implements OnInit {

  isCancel: boolean = true;
  isCheckPublic: boolean = true;
  isCheckN1: boolean = true;
  isCheckN2: boolean = true;
  startDate: string = "";
  endDate: string = "";
  // [attr.href]="'content.htm#/(simple-page:simple-page/print/counsel-interview-doc/'+currentStudent.StudentID+')'">

  constructor(private dsaService: DsaService) { }
  studentID: string = "";

  cancel() {
    this.isCancel = true;
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

    let StartDate = this.startDate.replace('T', ' ');
    let EndDate = this.endDate.replace('T', ' ');
    //     { path: "print/counsel-interview-doc/:studentID/:p/:sd/:ed", component:Coun

    if (chkDataPass) {
      this.isCancel = false;

      let isP: string = 'f';
      if (this.isCheckPublic)
        isP = 't';
      let isCo: string = '';
      if (this.isCheckN1 && this.isCheckN2) {
        isCo = '12';
      }
      if (this.isCheckN1 && this.isCheckN2 === false) {
        isCo = '1';
      }

      if (this.isCheckN1 === false && this.isCheckN2) {
        isCo = '2';
      }



      window.open('content.htm#/(simple-page:simple-page/print/counsel-interview-doc/' + this.studentID + '/' + isP + '/' + StartDate + '/' + EndDate + '/' + isCo + ')', '_blank');
      $("#setCounselInterviewdocPrintItem").modal("hide");

    }

  }
  ngOnInit() {
    this.isCheckN1 = true;
    this.isCheckN2 = true;
    this.isCheckPublic = true;
  }

  setCheckItem(item: string) {

    if (item === '一級輔導') {
      if (this.isCheckN1)
        this.isCheckN1 = false;
      else
        this.isCheckN1 = true;
    }

    if (item === '二級輔導') {
      if (this.isCheckN2)
        this.isCheckN2 = false;
      else
        this.isCheckN2 = true;
    }

    if (item === '公開') {
      if (this.isCheckPublic)
        this.isCheckPublic = false;
      else
        this.isCheckPublic = true;

    }

    console.log(this.isCheckN1);
    console.log(this.isCheckN2);
  }

}
