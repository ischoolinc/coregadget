import { Component, OnInit } from "@angular/core";
import { CounselInterview } from "../../counsel/counsel-vo";
@Component({
  selector: "app-view-interview",
  templateUrl: "./view-interview.component.html",
  styleUrls: ["./view-interview.component.css"]
})
export class ViewInterviewComponent implements OnInit {
  _CounselInterview: CounselInterview;
  constructor() {}

  ngOnInit() {
    this._CounselInterview = new CounselInterview();
  }

}
