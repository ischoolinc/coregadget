import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'app-counsel-detail',
  templateUrl: './counsel-detail.component.html',
  styleUrls: ['./counsel-detail.component.css']
})
export class CounselDetailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute
    , private router: Router) {

  }

  ngOnInit() {
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
