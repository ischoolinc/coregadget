import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentPath: string;

  constructor(
    private route: ActivatedRoute
    , private router: Router
  ) {
  }

  ngOnInit() {
    this.router.events.subscribe((data) => {
      if (data instanceof RoutesRecognized) {
        const comp = data.state.root.firstChild.component as any;

        if (comp.name == "CaseListComponent")
          this.currentPath = "case";
        else if (comp.name == "CounselListComponent")
          this.currentPath = "counsel";
        else if (comp.name == "ReferralListComponent")
          this.currentPath = "referral";
        else if (comp.name == "CounselStatisticsComponent")
          this.currentPath = "counsel_statistics";
        else if (comp.name == "InterviewStatisticsComponent")
          this.currentPath = "interview_statistics";
        else
          this.currentPath = "counsel";
      }
    });
  }

  routeTo(to) {
    //讓特效跑
    setTimeout(function () {
      this.router.navigate([].concat(to || []), {
        relativeTo: this.route
      });
    }.bind(this), 200);
  }
}
