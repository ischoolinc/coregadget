import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-student-info',
  templateUrl: './student-info.component.html',
  styleUrls: ['./student-info.component.css']
})
export class StudentInfoComponent implements OnInit {
  studentID
  interviewID
  constructor(    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.activatedRoute.paramMap.subscribe(
      (params: ParamMap): void => {
        this.studentID = params.get("studentID");
        this.interviewID = params.get("interviewID");
      }
    );
  }

}
