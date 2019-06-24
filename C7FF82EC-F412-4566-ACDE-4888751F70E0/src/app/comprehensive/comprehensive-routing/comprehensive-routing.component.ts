import { Component, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComprehensiveComponent } from "../comprehensive.component";

@Component({
  selector: 'app-comprehensive-routing',
  templateUrl: './comprehensive-routing.component.html',
  styleUrls: ['./comprehensive-routing.component.css']
})
export class ComprehensiveRoutingComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Optional()
    private comprehensiveComponent: ComprehensiveComponent) { }

  ngOnInit() {
    this.router.navigate(["section", this.comprehensiveComponent.semeserList[0].SchoolYear, this.comprehensiveComponent.semeserList[0].Semester], {
      relativeTo: this.route,
      skipLocationChange: true
    });
  }
}
