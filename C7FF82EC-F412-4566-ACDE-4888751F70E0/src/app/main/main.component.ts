import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  currentPath: string;

  constructor(
    private route: ActivatedRoute
    , private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(async pm => {
      var mainPath = pm.get("main_path");
      switch (mainPath) {
        case "counsel":
        case "counsel_statistics":
        case "referral":
        case "case":
        case "interview_statistics":
          this.currentPath = mainPath;
          break;
        default:
          this.currentPath = "counsel";
          break;
      }
    });
  }
  routeTo(to) {
    //讓特效跑
    setTimeout(function () {
      this.router.navigate(["/", to], {
        relativeTo: this.route
      });
    }.bind(this), 200);
  }
}
