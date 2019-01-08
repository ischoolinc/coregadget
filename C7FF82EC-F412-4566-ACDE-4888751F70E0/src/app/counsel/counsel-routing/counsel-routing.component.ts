import { Component, OnInit } from '@angular/core';
import { CounselStudentService, CounselClass, CounselStudent } from "../../counsel-student.service";
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'app-counsel-routing',
  templateUrl: './counsel-routing.component.html',
  styleUrls: ['./counsel-routing.component.css']
})
export class CounselRoutingComponent implements OnInit {

  constructor(
    private counselStudentService: CounselStudentService,
    private route: ActivatedRoute,
    private router: Router) {

  }

  ngOnInit() {
    this.routing();
  }

  routing() {
    if (!this.counselStudentService.isLoading) {
      if (this.counselStudentService.counselClass.length > 0) {
        this.router.navigate(['list', 'class', this.counselStudentService.counselClass[0].ClassID], {
          relativeTo: this.route
          , skipLocationChange: true
        });
      }
    }
    else {
      setTimeout(this.routing, 100);
    }
  }
}
