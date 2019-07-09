import { Component, OnInit,Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminComponent } from "../admin.component";

@Component({
  selector: 'app-admin-routing',
  templateUrl: './admin-routing.component.html',
  styleUrls: ['./admin-routing.component.css']
})
export class AdminRoutingComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    @Optional()
    public adminComponent: AdminComponent
  ) { }

  ngOnInit() {

    if (this.adminComponent.isRoleEnable)
    {
      this.router.navigate(['counsel_teacher_role'], {
        relativeTo: this.activatedRoute
        , skipLocationChange: true
      });
    }else if (this.adminComponent.isClassEnable)
    {
      this.router.navigate(['counsel_class'], {
        relativeTo: this.activatedRoute
        , skipLocationChange: true
      });
    }
   
  }

}
