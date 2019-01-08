import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';
import { RoleService } from "../../../role.service";

@Component({
  selector: 'app-detail-routing',
  templateUrl: './detail-routing.component.html',
  styleUrls: ['./detail-routing.component.css']
})
export class DetailRoutingComponent implements OnInit {

  constructor(
    private roleService: RoleService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.routing();
  }

  routing() {
    if (!this.roleService.isLoading) {
      if (this.roleService.role.indexOf('班導師') >= 0 || this.roleService.role.indexOf('輔導老師') >= 0) {
        this.router.navigate(['interview'], {
          relativeTo: this.activatedRoute
          , skipLocationChange: true
        });
      }
      else if (this.roleService.role.indexOf('認輔老師') >= 0) {
        this.router.navigate(['counsel'], {
          relativeTo: this.activatedRoute
          , skipLocationChange: true
        });
      }
      else {
        this.router.navigate(['psychological_test'], {
          relativeTo: this.activatedRoute
          , skipLocationChange: true
        });
      }
    }
    else {
      setTimeout(this.routing, 100);
    }
  }
}
