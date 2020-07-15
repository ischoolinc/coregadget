import { Component, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComprehensiveDetailComponent } from "../../comprehensive-detail/comprehensive.component";

@Component({
  selector: 'app-comprehensive-detail-routing',
  templateUrl: './comprehensive-detail-routing.component.html',
  styleUrls: ['./comprehensive-detail-routing.component.css']
})
export class ComprehensiveDetailRoutingComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Optional()
    private comprehensiveComponent: ComprehensiveDetailComponent
  ) { }

  async ngOnInit() {
    this.router.navigate(["view", this.comprehensiveComponent.fillInSemester[0].SchoolYear, this.comprehensiveComponent.fillInSemester[0].Semester],{
      relativeTo: this.route,
      skipLocationChange: true
    });
  }
}
