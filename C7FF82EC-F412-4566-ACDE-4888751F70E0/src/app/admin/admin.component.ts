import { Component, OnInit, Optional } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  deny: boolean = false;
  isLoading: boolean = false;
  currentItem: string = "";

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    @Optional()
    private appComponent: AppComponent
    ) {

  }

  ngOnInit() {
    this.appComponent.currentComponent = "admin";
  }

  routeTo(to) {
    //讓特效跑
    setTimeout(
      function () {
        this.router.navigate([].concat(to || []), {
          relativeTo: this.activatedRoute
        });
      }.bind(this),
      200
    );
  }
}