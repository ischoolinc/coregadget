import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-case-interview-modal',
  templateUrl: './view-case-interview-modal.component.html',
  styleUrls: ['./view-case-interview-modal.component.css']
})
export class ViewCaseInterviewModalComponent implements OnInit {
  _studentName: string;

  SchoolYear: number;
  Semester: number;
  OccurDate: string = "";
  CaseNo: string = "";
  CounselType: string = "";
  CounselTypeOther: string = "";
  ContactName: string = "";
  Content: string = "";
  StudentID: string = "";
  selectCounselType: string = "";
  UID: string = "";
  AuthorName: string = "";
  CaseID: string = "";
  AuthorRole: string = "";

  isCancel: boolean = true;
  constructor() { }

  ngOnInit() { this.isCancel = true;
  }

}
