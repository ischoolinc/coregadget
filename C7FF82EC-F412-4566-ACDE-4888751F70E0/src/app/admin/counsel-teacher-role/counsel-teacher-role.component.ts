import { Component, OnInit, Optional } from '@angular/core';
import { AdminComponent } from "../admin.component";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-counsel-teacher-role',
  templateUrl: './counsel-teacher-role.component.html',
  styleUrls: ['./counsel-teacher-role.component.css']
})
export class CounselTeacherRoleComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    @Optional()
    private adminComponent: AdminComponent) { }

  ngOnInit() {
    this.adminComponent.currentItem = "counsel_teacher_role";
  }
}
