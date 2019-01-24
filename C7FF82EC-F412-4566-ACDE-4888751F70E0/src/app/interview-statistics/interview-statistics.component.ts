import { Component, OnInit, Optional } from "@angular/core";
import { AppComponent } from "../app.component";
import { CounselInterview } from "../counsel/counsel-vo";

@Component({
  selector: "app-interview-statistics",
  templateUrl: "./interview-statistics.component.html",
  styleUrls: ["./interview-statistics.component.css"]
})
export class InterviewStatisticsComponent implements OnInit {
  constructor(
    @Optional()
    private appComponent: AppComponent
  ) {}

  ngOnInit() {
    if (this.appComponent)
      this.appComponent.currentComponent = "interview_statistics";
  }
}
