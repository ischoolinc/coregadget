import { Component, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComprehensiveComponent } from "../comprehensive/comprehensive.component";

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
    private comprehensiveComponent: ComprehensiveComponent
  ) { }

  async ngOnInit() {
    this.router.navigate(["view", this.comprehensiveComponent.fillInSection[0].FillInSectionID], {
      relativeTo: this.route,
      skipLocationChange: true
    });
  }
}
