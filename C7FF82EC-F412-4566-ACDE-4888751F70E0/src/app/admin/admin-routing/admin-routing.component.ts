import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-routing',
  templateUrl: './admin-routing.component.html',
  styleUrls: ['./admin-routing.component.css']
})
export class AdminRoutingComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.router.navigate(['counsel_teacher_role'], {
      relativeTo: this.activatedRoute
      , skipLocationChange: true
    });
  }

}
