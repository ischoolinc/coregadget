import { Component, OnInit, Optional } from '@angular/core';
import { AdminComponent } from "../admin.component";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-counsel-class',
  templateUrl: './counsel-class.component.html',
  styleUrls: ['./counsel-class.component.css']
})
export class CounselClassComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    @Optional()
    private adminComponent: AdminComponent) { }

  ngOnInit() {
    this.adminComponent.currentItem = "counsel_class";
  }
}
